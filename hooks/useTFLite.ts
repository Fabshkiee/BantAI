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



