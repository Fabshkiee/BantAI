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


