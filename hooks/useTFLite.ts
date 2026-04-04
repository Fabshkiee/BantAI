import { Detection, performNMS } from "@/lib/spatialMath";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { useCallback, useEffect, useState } from "react";
import { Image, Platform } from "react-native";
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

/** 2x2 Grid with 20% overlap */
const SAHI_SLICES = [
  { x: 0, y: 0, w: 0.6, h: 0.6 }, // Top-Left
  { x: 0.4, y: 0, w: 0.6, h: 0.6 }, // Top-Right
  { x: 0, y: 0.4, w: 0.6, h: 0.6 }, // Bottom-Left
  { x: 0.4, y: 0.4, w: 0.6, h: 0.6 }, // Bottom-Right
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

function parseDetections(
  output: ArrayLike<number | bigint>,
  offsetParams: { x: number; y: number; scale: number } = {
    x: 0,
    y: 0,
    scale: 1,
  },
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
      // Map local slice coordinates back to global normalized space (0-1)
      const x1 = offsetParams.x + x1_raw * offsetParams.scale;
      const y1 = offsetParams.y + y1_raw * offsetParams.scale;
      const x2 = offsetParams.x + x2_raw * offsetParams.scale;
      const y2 = offsetParams.y + y2_raw * offsetParams.scale;

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
      console.log("⏳ Loading TFLite model...");
      const loadedModel = await loadTensorflowModel(
        require("@/model/bantai_model.tflite"),
      );
      setModel(loadedModel);
      setModelLoaded(true);
      console.log("✓ YOLO26s Model Loaded");
    } catch (err) {
      console.error("✗ MODEL LOAD FAILED:", String(err));
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const runSinglePass = async (
    uri: string,
    offset = { x: 0, y: 0, scale: 1 },
  ): Promise<Detection[]> => {
    if (!model) return [];
    const tensor = await prepareTensor(uri, model.inputs[0].dataType);
    const outputs = await model.run([tensor]);
    return parseDetections(outputs[0], offset);
  };

  const runInference = useCallback(
    async (imageUri: string): Promise<Detection[]> => {
      if (!modelLoaded || !model) throw new Error("Model not ready");

      try {
        const { width, height } = await getOriginalSize(imageUri);
        const allResults: Detection[] = [];

        console.log("--- Starting SAHI Scan ---");

        // Pass 1: Global Scan
        const globalResized = await manipulateAsync(
          imageUri,
          [{ resize: { width: INPUT_SIZE, height: INPUT_SIZE } }],
          { format: SaveFormat.JPEG },
        );
        const globalDetections = await runSinglePass(globalResized.uri);
        allResults.push(...globalDetections);
        console.log(`Global Pass: Found ${globalDetections.length}`);

        // Pass 2-5: Detailed Slices (2x2 Grid)
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

          const sliceDetections = await runSinglePass(crop.uri, {
            x: s.x,
            y: s.y,
            scale: s.w,
          });
          allResults.push(...sliceDetections);
          console.log(`Slice ${idx + 1} Pass: Found ${sliceDetections.length}`);
        }

        // Final Step: NMS to merge overlapping detections
        const mergedResults = performNMS(allResults, NMS_THRESHOLD);
        console.log(
          `SAHI Complete: ${mergedResults.length} unique hazards found.`,
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
