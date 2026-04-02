import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import {
  loadTensorflowModel,
  type TensorflowModel,
} from "react-native-fast-tflite";

const jpeg = require("jpeg-js") as {
  decode: (
    data: Uint8Array,
    options?: { useTArray?: boolean },
  ) => { data: Uint8Array; width: number; height: number };
};

export interface Detection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
}

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
const ANDROID_BUNDLED_MODEL_URL =
  "file:///android_asset/models/bantai_model.tflite";

async function preprocessImage(imageUri: string): Promise<Float32Array> {
  const resized = await manipulateAsync(
    imageUri,
    [{ resize: { width: INPUT_SIZE, height: INPUT_SIZE } }],
    {
      compress: 0.9,
      format: SaveFormat.JPEG,
    },
  );

  const response = await fetch(resized.uri);
  const arrayBuffer = await response.arrayBuffer();

  const decoded = jpeg.decode(new Uint8Array(arrayBuffer), {
    useTArray: true,
  });

  const tensor = new Float32Array(INPUT_SIZE * INPUT_SIZE * 3);
  let tensorIndex = 0;

  for (let i = 0; i < decoded.data.length; i += 4) {
    // RGB extraction, normalizing to 0-1 range
    tensor[tensorIndex++] = decoded.data[i] / 255.0;
    tensor[tensorIndex++] = decoded.data[i + 1] / 255.0;
    tensor[tensorIndex++] = decoded.data[i + 2] / 255.0;
  }

  return tensor;
}

function parseDetectionsFromOutput(
  output: ArrayLike<number | bigint>,
): Detection[] {
  const readValue = (index: number) => Number(output[index]);

  const detections: Detection[] = [];
  const stride = 6; // Output shape is [1, 300, 6] (x, y, w, h, confidence, class_id) or (x1, y1, x2, y2, score, class_id)
  const numDetections = Math.floor(output.length / stride);

  for (let i = 0; i < numDetections; i++) {
    const offset = i * stride;

    // YOLO26s TFLite format: [x1, y1, x2, y2, confidence, class_id]
    const x1_raw = readValue(offset);
    const y1_raw = readValue(offset + 1);
    const x2_raw = readValue(offset + 2);
    const y2_raw = readValue(offset + 3);
    const confidence = readValue(offset + 4);
    const classIdx = Math.round(readValue(offset + 5));

    // If it's a valid prediction (classIdx usually shouldn't be negative but just in case, and check confidence)
    if (
      confidence > CONF_THRESHOLD &&
      classIdx >= 0 &&
      classIdx < CLASS_NAMES.length
    ) {
      // Coordinates are usually absolute (0-INPUT_SIZE), convert to normalized (0-1)
      const x1 = Math.max(0, Math.min(1, x1_raw / INPUT_SIZE));
      const y1 = Math.max(0, Math.min(1, y1_raw / INPUT_SIZE));
      const x2 = Math.max(0, Math.min(1, x2_raw / INPUT_SIZE));
      const y2 = Math.max(0, Math.min(1, y2_raw / INPUT_SIZE));

      detections.push({
        class: CLASS_NAMES[classIdx],
        confidence: Math.min(1, confidence),
        bbox: [x1, y1, x2, y2],
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

      // Use the pre-bundled native Android asset to bypass dev server HTTP crashes completely
      const modelSource =
        Platform.OS === "android"
          ? { url: ANDROID_BUNDLED_MODEL_URL }
          : require("@/model/bantai_model.tflite");

      const loadedModel = await loadTensorflowModel(modelSource);
      setModel(loadedModel);
      setModelLoaded(true);
      console.log("✓ TFLite model loaded");
      console.log("Model inputs:", loadedModel.inputs);
      console.log("Model outputs:", loadedModel.outputs);
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : String(err);
      setError(errMessage);
      console.error("✗ Model load failed:", errMessage);
    }
  };

}