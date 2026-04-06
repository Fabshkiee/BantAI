import { Detection, performNMS } from "@/lib/spatialMath";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { useCallback, useEffect, useState } from "react";
import { Image } from "react-native";
import {
  loadTensorflowModel,
  type TensorflowModel,
} from "react-native-fast-tflite";

interface JpegDecoder {
  decode: (
    data: Uint8Array,
    options?: { useTArray?: boolean },
  ) => { data: Uint8Array; width: number; height: number };
}

const jpeg = require("jpeg-js") as JpegDecoder;

const CLASS_NAMES = [
  "overloaded_socket",
  "damaged_wire",
  "floor_appliance",
  "major_crack",
  "minor_crack",
  "collapsed_structure",
  "broken_glass",
  "electronic_hazard",
  "elevated_breakables",
  "exposed_breaker",
  "exposed_ceiling_lights",
  "heavy_wooden_furniture",
  "open_flame_hazard",
];

const INPUT_SIZE = 640;
const CONF_THRESHOLD = 0.4;
const NMS_THRESHOLD = 0.45;
const EDGE_MARGIN = 0.02; // 2% edge margin — discard partial detections at slice borders

/**
 * 3x3 Grid with larger tiles (0.45x0.45) for more context per slice.
 * Positions are staggered to maintain full coverage with ~27% overlap.
 */
const SAHI_SLICES = [
  // Row 1
  { x: 0, y: 0, w: 0.45, h: 0.45 },
  { x: 0.275, y: 0, w: 0.45, h: 0.45 },
  { x: 0.55, y: 0, w: 0.45, h: 0.45 },
  // Row 2
  { x: 0, y: 0.275, w: 0.45, h: 0.45 },
  { x: 0.275, y: 0.275, w: 0.45, h: 0.45 },
  { x: 0.55, y: 0.275, w: 0.45, h: 0.45 },
  // Row 3
  { x: 0, y: 0.55, w: 0.45, h: 0.45 },
  { x: 0.275, y: 0.55, w: 0.45, h: 0.45 },
  { x: 0.55, y: 0.55, w: 0.45, h: 0.45 },
];

async function getOriginalSize(
  uri: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });
}

/** Prepares a normalized tensor from an image URI (expects image to be 640x640 already) */
async function prepareTensor(
  imageUri: string,
  modelDataType: string,
): Promise<Float32Array | Uint8Array> {
  const response = await fetch(imageUri);
  const arrayBuffer = await response.arrayBuffer();

  const decoded = jpeg.decode(new Uint8Array(arrayBuffer), {
    useTArray: true,
  });

  const isQuantized = modelDataType === "uint8" || modelDataType === "int8";

  if (isQuantized) {
    const tensor = new Uint8Array(INPUT_SIZE * INPUT_SIZE * 3);
    let tensorIndex = 0;
    for (let i = 0; i < decoded.data.length; i += 4) {
      tensor[tensorIndex++] = decoded.data[i];
      tensor[tensorIndex++] = decoded.data[i + 1];
      tensor[tensorIndex++] = decoded.data[i + 2];
    }
    return tensor;
  } else {
    const tensor = new Float32Array(INPUT_SIZE * INPUT_SIZE * 3);
    let tensorIndex = 0;
    for (let i = 0; i < decoded.data.length; i += 4) {
      tensor[tensorIndex++] = decoded.data[i] / 255.0;
      tensor[tensorIndex++] = decoded.data[i + 1] / 255.0;
      tensor[tensorIndex++] = decoded.data[i + 2] / 255.0;
    }
    return tensor;
  }
}

/**
 * Checks if a detection's bbox sits at the edge of the slice (in local 0-1 space).
 * If it does, it's likely a partial object — the neighboring slice will have the full one.
 */
function isEdgeDetection(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): boolean {
  return (
    x1 < EDGE_MARGIN ||
    y1 < EDGE_MARGIN ||
    x2 > 1 - EDGE_MARGIN ||
    y2 > 1 - EDGE_MARGIN
  );
}

function parseDetections(
  output: ArrayLike<number | bigint>,
  offsetParams: { x: number; y: number; scaleX: number; scaleY: number } = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
  },
  isSlice = false,
): Detection[] {
  const readValue = (index: number) => Number(output[index]);
  const detections: Detection[] = [];
  const stride = 6;
  const numDetections = Math.floor(output.length / stride);

  for (let i = 0; i < numDetections; i++) {
    const offset = i * stride;
    const x1_raw = readValue(offset);
    const y1_raw = readValue(offset + 1);
    const x2_raw = readValue(offset + 2);
    const y2_raw = readValue(offset + 3);
    const confidence = readValue(offset + 4);
    const classIdx = Math.round(readValue(offset + 5));

    if (
      confidence > CONF_THRESHOLD &&
      classIdx >= 0 &&
      classIdx < CLASS_NAMES.length
    ) {
      // For slice passes: filter out detections that are cut off at the slice border
      if (isSlice && isEdgeDetection(x1_raw, y1_raw, x2_raw, y2_raw)) {
        continue;
      }

      // Model outputs normalized 0-1 coordinates — map directly to global space
      const x1 = offsetParams.x + x1_raw * offsetParams.scaleX;
      const y1 = offsetParams.y + y1_raw * offsetParams.scaleY;
      const x2 = offsetParams.x + x2_raw * offsetParams.scaleX;
      const y2 = offsetParams.y + y2_raw * offsetParams.scaleY;

      detections.push({
        class: CLASS_NAMES[classIdx],
        confidence: Math.min(1, confidence),
        bbox: [
          Math.max(0, Math.min(1, x1)),
          Math.max(0, Math.min(1, y1)),
          Math.max(0, Math.min(1, x2)),
          Math.max(0, Math.min(1, y2)),
        ],
      });
    }
  }
  return detections;
}

export function useTFLite() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<TensorflowModel | null>(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      console.log("Loading TFLite model...");
      const loadedModel = await loadTensorflowModel(
        require("@/model/bantai_model.tflite"),
      );
      setModel(loadedModel);
      setModelLoaded(true);
      console.log("YOLO26s Model Loaded");
    } catch (err) {
      console.error("MODEL LOAD FAILED:", String(err));
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const runSinglePass = async (
    uri: string,
    offset = { x: 0, y: 0, scaleX: 1, scaleY: 1 },
    isSlice = false,
  ): Promise<Detection[]> => {
    if (!model) return [];
    const tensor = await prepareTensor(uri, model.inputs[0].dataType);
    const outputs = await model.run([tensor]);
    return parseDetections(outputs[0], offset, isSlice);
  };

  const runInference = useCallback(
    async (imageUri: string): Promise<Detection[]> => {
      if (!modelLoaded || !model) throw new Error("Model not ready");

      try {
        const { width, height } = await getOriginalSize(imageUri);
        const allResults: Detection[] = [];

        console.log("--- Starting 10-Pass SAHI Scan (3x3) ---");

        // Pass 1: Global Scan (full context, no edge filtering)
        const globalResized = await manipulateAsync(
          imageUri,
          [{ resize: { width: INPUT_SIZE, height: INPUT_SIZE } }],
          { format: SaveFormat.JPEG },
        );
        const globalDetections = await runSinglePass(globalResized.uri);
        allResults.push(...globalDetections);
        console.log(`Global Pass: ${globalDetections.length} detections`);

        // Pass 2-10: Detailed Slices (3x3 Grid, edge-filtered)
        for (let idx = 0; idx < SAHI_SLICES.length; idx++) {
          const s = SAHI_SLICES[idx];
          const crop = await manipulateAsync(
            imageUri,
            [
              {
                crop: {
                  originX: s.x * width,
                  originY: s.y * height,
                  width: s.w * width,
                  height: s.h * height,
                },
              },
              { resize: { width: INPUT_SIZE, height: INPUT_SIZE } },
            ],
            { format: SaveFormat.JPEG },
          );

          const sliceDetections = await runSinglePass(
            crop.uri,
            { x: s.x, y: s.y, scaleX: s.w, scaleY: s.h },
            true, // enable edge filtering for slices
          );
          allResults.push(...sliceDetections);
          console.log(`Slice ${idx + 1}: ${sliceDetections.length} detections`);
        }

        // Final: NMS to merge duplicate detections from overlapping slices
        const mergedResults = performNMS(allResults, NMS_THRESHOLD);
        console.log(
          `SAHI Complete: ${allResults.length} raw -> ${mergedResults.length} unique hazards`,
        );

        return mergedResults;
      } catch (err) {
        console.error("SAHI Inference Failed:", err);
        throw err;
      }
    },
    [model, modelLoaded],
  );

  return { modelLoaded, error, runInference };
}
