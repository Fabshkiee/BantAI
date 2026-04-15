import {
  CLASS_CONFIDENCE_PROFILE,
  CLASS_MIN_AREA_PROFILE,
  CLASS_STRONG_CONFIDENCE_PROFILE,
} from "@/lib/detectionCalibration";
import {
  Detection,
  getBoxDistance,
  getContainmentRatio,
  getIoU,
  performNMS,
} from "@/lib/spatialMath";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { useCallback, useEffect, useRef, useState } from "react";
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
  "window_security_bar",
  "curtain",
  "water_damage",
  "gas_tank",
];

const INPUT_SIZE = 640;
const GLOBAL_CONF = 0.5;
const SLICE_CONF = 0.4; // zoomed crops have less context, permissive filter
const RELAXED_GLOBAL_CONF = 0.42;
const RELAXED_SLICE_CONF = 0.32;
const RELAXED_CLASS_FLOOR_DELTA = 0.08;
const NMS_THRESHOLD = 0.45;
const MIN_BBOX_AREA = 0.001; // Minimum 0.1% of image area — filters noise-level hallucinations
const MIN_BBOX_SIDE = 0.02; // Minimum 2% width/height
const MAX_ASPECT_RATIO = 12; // Reject ultra-thin hallucination boxes
const MIN_STRUCTURAL_BBOX_SIDE = 0.008; // Allow thin crack boxes
const STRUCTURAL_MAX_ASPECT_RATIO = 30; // Cracks can be long and thin
const SUPPORT_IOU = 0.35;
const CRITICAL_SUPPORT_MIN = 3;
const RELAXED_SUPPORT_IOU = 0.22;
const RELAXED_CLASS_FLOOR_DELTA_CONSENSUS = 0.04;
const NON_CRITICAL_SUPER_STRONG_FLOOR = 0.92;
const EXCLUSIVE_DUPLICATE_IOU = 0.42;
const SAME_CLASS_CONTAINMENT_THRESHOLD = 0.86;
const SAME_CLASS_MAX_NESTED_AREA_RATIO = 0.45;
const SMALLER_BOX_KEEP_MARGIN = 0.12;

const CRITICAL_CLASSES = new Set<string>([
  "collapsed_structure",
  "open_flame_hazard",
  "exposed_breaker",
  "gas_tank",
]);

const STRUCTURAL_CLASSES = new Set<string>([
  "major_crack",
  "minor_crack",
  "collapsed_structure",
  "water_damage",
]);

const MUTUALLY_EXCLUSIVE_CLASS_GROUPS: Array<Set<string>> = [
  new Set(["major_crack", "minor_crack"]),
];

const EXCLUSIVE_CLASS_PRIORITY: Record<string, number> = {
  major_crack: 2,
  minor_crack: 1,
};

const MIN_CLASS_CONFIDENCE = CLASS_CONFIDENCE_PROFILE;
const MIN_CLASS_AREA = CLASS_MIN_AREA_PROFILE;
const STRONG_CONFIDENCE = CLASS_STRONG_CONFIDENCE_PROFILE;

const MAX_DETECTIONS_PER_CLASS = 3;

type PassSource = "global" | `slice-${number}`;

type DetectionCandidate = Detection & {
  source: PassSource;
};

/**
 * 3x3 Grid (3 columns, 3 rows) aligned with project documentation.
 * Each tile: 0.4w x 0.4h with ~25% overlap in both axes.
 * Total: 9 slices + 1 global = 10 passes.
 */
const SAHI_SLICES = [
  // Row 1 (top)
  { x: 0, y: 0, w: 0.4, h: 0.4 },
  { x: 0.3, y: 0, w: 0.4, h: 0.4 },
  { x: 0.6, y: 0, w: 0.4, h: 0.4 },
  // Row 2 (middle)
  { x: 0, y: 0.3, w: 0.4, h: 0.4 },
  { x: 0.3, y: 0.3, w: 0.4, h: 0.4 },
  { x: 0.6, y: 0.3, w: 0.4, h: 0.4 },
  // Row 3 (bottom)
  { x: 0, y: 0.6, w: 0.4, h: 0.4 },
  { x: 0.3, y: 0.6, w: 0.4, h: 0.4 },
  { x: 0.6, y: 0.6, w: 0.4, h: 0.4 },
];

function getSafeSliceCrop(
  slice: { x: number; y: number; w: number; h: number },
  width: number,
  height: number,
): { originX: number; originY: number; width: number; height: number } {
  const originX = Math.max(0, Math.min(width - 1, Math.floor(slice.x * width)));
  const originY = Math.max(
    0,
    Math.min(height - 1, Math.floor(slice.y * height)),
  );

  const desiredWidth = Math.max(1, Math.round(slice.w * width));
  const desiredHeight = Math.max(1, Math.round(slice.h * height));

  const safeWidth = Math.max(1, Math.min(desiredWidth, width - originX));
  const safeHeight = Math.max(1, Math.min(desiredHeight, height - originY));

  return { originX, originY, width: safeWidth, height: safeHeight };
}

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
  offsetParams: { x: number; y: number; scaleX: number; scaleY: number } = {
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
  },
  confThreshold = GLOBAL_CONF,
  classFloorDelta = 0,
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
      Number.isFinite(confidence) &&
      confidence > confThreshold &&
      classIdx >= 0 &&
      classIdx < CLASS_NAMES.length
    ) {
      const className = CLASS_NAMES[classIdx];
      const isStructural = STRUCTURAL_CLASSES.has(className);
      const classConfFloor =
        (MIN_CLASS_CONFIDENCE[className] ?? confThreshold) - classFloorDelta;
      if (confidence < classConfFloor) continue;

      // Guard against swapped coordinates and malformed outputs.
      // Some exported models may emit x2/y2 slightly lower than x1/y1.
      const rawLeft = Math.min(x1_raw, x2_raw);
      const rawTop = Math.min(y1_raw, y2_raw);
      const rawRight = Math.max(x1_raw, x2_raw);
      const rawBottom = Math.max(y1_raw, y2_raw);

      // Model outputs normalized 0-1 coordinates — map directly to global space
      const x1 = offsetParams.x + rawLeft * offsetParams.scaleX;
      const y1 = offsetParams.y + rawTop * offsetParams.scaleY;
      const x2 = offsetParams.x + rawRight * offsetParams.scaleX;
      const y2 = offsetParams.y + rawBottom * offsetParams.scaleY;

      const clampedX1 = Math.max(0, Math.min(1, x1));
      const clampedY1 = Math.max(0, Math.min(1, y1));
      const clampedX2 = Math.max(0, Math.min(1, x2));
      const clampedY2 = Math.max(0, Math.min(1, y2));

      const width = clampedX2 - clampedX1;
      const height = clampedY2 - clampedY1;
      if (width <= 0 || height <= 0) continue;

      const minSide = isStructural ? MIN_STRUCTURAL_BBOX_SIDE : MIN_BBOX_SIDE;
      if (width < minSide || height < minSide) continue;

      const aspectRatio = Math.max(width / height, height / width);
      const maxAspectRatio = isStructural
        ? STRUCTURAL_MAX_ASPECT_RATIO
        : MAX_ASPECT_RATIO;
      if (aspectRatio > maxAspectRatio) continue;

      // Filter out noise: discard boxes smaller than MIN_BBOX_AREA of the image
      const area = width * height;
      const classMinArea = MIN_CLASS_AREA[className] ?? MIN_BBOX_AREA;
      if (area < classMinArea) continue;

      detections.push({
        class: className,
        confidence: Math.min(1, confidence),
        bbox: [clampedX1, clampedY1, clampedX2, clampedY2],
      });
    }
  }
  return detections;
}

function getBoxArea(bbox: [number, number, number, number]): number {
  const width = Math.max(0, bbox[2] - bbox[0]);
  const height = Math.max(0, bbox[3] - bbox[1]);
  return width * height;
}

function isMutuallyExclusiveClassPair(aClass: string, bClass: string): boolean {
  if (aClass === bClass) return false;
  return MUTUALLY_EXCLUSIVE_CLASS_GROUPS.some(
    (group) => group.has(aClass) && group.has(bClass),
  );
}

function pickExclusiveWinner(a: Detection, b: Detection): Detection {
  const confidenceDelta = Math.abs(a.confidence - b.confidence);
  if (confidenceDelta > 0.03) {
    return a.confidence >= b.confidence ? a : b;
  }

  const aPriority = EXCLUSIVE_CLASS_PRIORITY[a.class] ?? 0;
  const bPriority = EXCLUSIVE_CLASS_PRIORITY[b.class] ?? 0;
  if (aPriority !== bPriority) {
    return aPriority > bPriority ? a : b;
  }

  return a.confidence >= b.confidence ? a : b;
}

function suppressSemanticDuplicates(detections: Detection[]): Detection[] {
  if (detections.length < 2) return detections;

  const sorted = [...detections].sort((a, b) => b.confidence - a.confidence);
  const removed = new Set<number>();

  for (let i = 0; i < sorted.length; i++) {
    if (removed.has(i)) continue;

    for (let j = i + 1; j < sorted.length; j++) {
      if (removed.has(j)) continue;

      const a = sorted[i];
      const b = sorted[j];
      const iou = getIoU(a.bbox, b.bbox);

      if (
        isMutuallyExclusiveClassPair(a.class, b.class) &&
        iou >= EXCLUSIVE_DUPLICATE_IOU
      ) {
        const winner = pickExclusiveWinner(a, b);
        if (winner === a) {
          removed.add(j);
        } else {
          removed.add(i);
          break;
        }
        continue;
      }

      if (a.class !== b.class) continue;

      const areaA = getBoxArea(a.bbox);
      const areaB = getBoxArea(b.bbox);
      if (areaA <= 0 || areaB <= 0) continue;

      const aIsSmaller = areaA <= areaB;
      const smallerIdx = aIsSmaller ? i : j;
      const largerIdx = aIsSmaller ? j : i;
      const smaller = aIsSmaller ? a : b;
      const larger = aIsSmaller ? b : a;

      const containment = getContainmentRatio(smaller.bbox, larger.bbox);
      const areaRatio = Math.min(areaA, areaB) / Math.max(areaA, areaB);
      const isNestedPartDuplicate =
        containment >= SAME_CLASS_CONTAINMENT_THRESHOLD &&
        areaRatio <= SAME_CLASS_MAX_NESTED_AREA_RATIO;

      if (!isNestedPartDuplicate) continue;

      const keepSmaller =
        smaller.confidence >= larger.confidence + SMALLER_BOX_KEEP_MARGIN;
      if (!keepSmaller) {
        removed.add(smallerIdx);
        if (smallerIdx === i) break;
      } else {
        removed.add(largerIdx);
      }
    }
  }

  return sorted.filter((_, idx) => !removed.has(idx));
}

function applyConsensusFilter(
  candidates: DetectionCandidate[],
  options: { relaxed?: boolean } = {},
): Detection[] {
  if (candidates.length === 0) return [];
  const relaxed = options.relaxed ?? false;
  const supportIou = relaxed ? RELAXED_SUPPORT_IOU : SUPPORT_IOU;

  const merged = performNMS(candidates, NMS_THRESHOLD);

  const filtered: Detection[] = [];
  for (const det of merged) {
    const supporters = candidates.filter(
      (cand) =>
        cand.class === det.class && getIoU(cand.bbox, det.bbox) >= supportIou,
    );

    const supportCount = supporters.length;
    const globalSupport = supporters.filter(
      (s) => s.source === "global",
    ).length;
    const sliceSupport = supportCount - globalSupport;
    const isCritical = CRITICAL_CLASSES.has(det.class);
    const isStructural = STRUCTURAL_CLASSES.has(det.class);
    const className = det.class as (typeof CLASS_NAMES)[number];
    const baseClassFloor = MIN_CLASS_CONFIDENCE[className] ?? GLOBAL_CONF;
    const classFloor =
      baseClassFloor - (relaxed ? RELAXED_CLASS_FLOOR_DELTA_CONSENSUS : 0);
    const strongFloor =
      (STRONG_CONFIDENCE[className] ?? 0.8) - (relaxed ? 0.05 : 0);
    const peakConfidence = Math.max(
      ...supporters.map((s) => s.confidence),
      det.confidence,
    );
    const meanConfidence =
      supporters.reduce((sum, s) => sum + s.confidence, 0) /
      Math.max(1, supportCount);

    const strongConf = peakConfidence >= strongFloor;
    const superStrongConf =
      peakConfidence >=
      Math.max(strongFloor + 0.08, NON_CRITICAL_SUPER_STRONG_FLOOR);

    const supportedEnough =
      supportCount >= 2 &&
      (globalSupport > 0 || strongConf || meanConfidence >= classFloor + 0.05);

    const relaxedSupportedEnough =
      supportCount >= 1 &&
      (globalSupport > 0 ||
        peakConfidence >= classFloor + 0.02 ||
        meanConfidence >= classFloor);

    const structuralSinglePassAccepted =
      isStructural &&
      supportCount >= 1 &&
      (peakConfidence >= classFloor + 0.08 || globalSupport > 0);

    const criticalAccepted =
      !isCritical ||
      strongConf ||
      supportCount >= (relaxed ? 2 : CRITICAL_SUPPORT_MIN);
    const nonCriticalAccepted =
      isCritical ||
      supportedEnough ||
      (relaxed && relaxedSupportedEnough) ||
      structuralSinglePassAccepted ||
      (globalSupport > 0 && strongConf) ||
      superStrongConf;

    if (!criticalAccepted || !nonCriticalAccepted) {
      continue;
    }

    filtered.push({
      ...det,
      confidence: Math.min(1, meanConfidence),
    });
  }

  const deduped = suppressSemanticDuplicates(filtered);

  // Keep only top-k per class to prevent one class from dominating due to noise.
  const buckets = new Map<string, Detection[]>();
  for (const det of deduped) {
    if (!buckets.has(det.class)) buckets.set(det.class, []);
    buckets.get(det.class)!.push(det);
  }

  const limited: Detection[] = [];
  buckets.forEach((items) => {
    items
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, MAX_DETECTIONS_PER_CLASS)
      .forEach((item) => limited.push(item));
  });

  return limited.sort((a, b) => b.confidence - a.confidence);
}

const FIRE_SOURCES = new Set([
  "open_flame_hazard",
  "overloaded_socket",
  "damaged_wire",
  "electronic_hazard",
  "exposed_breaker",
  "exposed_ceiling_lights",
]);

function filterContextualHazards(detections: Detection[]): Detection[] {
  const PROXIMITY_THRESHOLD = 0.2;
  return detections.filter((det) => {
    if (det.class === "curtain" || det.class === "gas_tank") {
      // Must be near a fire source to be shown
      return detections.some((other) => {
        if (det === other) return false;
        if (FIRE_SOURCES.has(other.class)) {
          const dist = getBoxDistance(det.bbox, other.bbox);
          return dist < PROXIMITY_THRESHOLD;
        }
        return false;
      });
    }
    return true;
  });
}


export function useTFLite() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<TensorflowModel | null>(null);
  const runtimeDebugLoggedRef = useRef(false);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      console.log("Loading TFLite model...");
      const loadedModel = await loadTensorflowModel(
        require("@/model/bantai-model-v2.tflite"),
      );
      setModel(loadedModel);
      setModelLoaded(true);
      console.log(
        `YOLO26s Model Loaded (delegate=${loadedModel.delegate}, input=${loadedModel.inputs
          .map((t) => `${t.name}:${t.dataType}[${t.shape.join("x")}]`)
          .join("; ")}, outputs=${loadedModel.outputs
          .map((t) => `${t.name}:${t.dataType}[${t.shape.join("x")}]`)
          .join("; ")})`,
      );
    } catch (err) {
      console.error("MODEL LOAD FAILED:", String(err));
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const runSinglePass = async (
    uri: string,
    offset = { x: 0, y: 0, scaleX: 1, scaleY: 1 },
    confThreshold = GLOBAL_CONF,
    classFloorDelta = 0,
  ): Promise<Detection[]> => {
    if (!model) return [];
    const tensor = await prepareTensor(uri, model.inputs[0].dataType);
    const outputs = await model.run([tensor]);
    if (outputs.length === 0) {
      return [];
    }

    // Some runtimes/delegates expose multiple outputs with varying order.
    // Use the largest output tensor as detection payload for better cross-device consistency.
    const detectionOutput = outputs.reduce((best, current) =>
      current.length > best.length ? current : best,
    );

    if (!runtimeDebugLoggedRef.current) {
      console.log(
        `TFLite output lengths: [${outputs.map((o) => o.length).join(", ")}], selected=${detectionOutput.length}`,
      );
      runtimeDebugLoggedRef.current = true;
    }

    return parseDetections(
      detectionOutput,
      offset,
      confThreshold,
      classFloorDelta,
    );
  };

  const runInference = useCallback(
    async (
      imageUri: string,
      onProgress?: (step: number, total: number) => void,
    ): Promise<Detection[]> => {
      if (!modelLoaded || !model) throw new Error("Model not ready");
      const totalSteps = 1 + SAHI_SLICES.length;

      try {
        const { width, height } = await getOriginalSize(imageUri);
        const allCandidates: DetectionCandidate[] = [];

        console.log("--- Starting 10-Pass SAHI Scan (3x3) ---");

        // Pass 1: Global Scan (full context, strict threshold)
        const globalResized = await manipulateAsync(
          imageUri,
          [{ resize: { width: INPUT_SIZE, height: INPUT_SIZE } }],
          { format: SaveFormat.JPEG },
        );
        const globalDetections = await runSinglePass(
          globalResized.uri,
          undefined,
          GLOBAL_CONF,
        );
        allCandidates.push(
          ...globalDetections.map((d) => ({ ...d, source: "global" as const })),
        );
        console.log(
          `Global Pass (conf=${GLOBAL_CONF}): ${globalDetections.length} detections`,
        );
        onProgress?.(1, totalSteps);

        // Pass 2-10: Detailed Slices (3x3 Grid)
        for (let idx = 0; idx < SAHI_SLICES.length; idx++) {
          const s = SAHI_SLICES[idx];
          try {
            const cropRect = getSafeSliceCrop(s, width, height);
            const crop = await manipulateAsync(
              imageUri,
              [
                {
                  crop: cropRect,
                },
                { resize: { width: INPUT_SIZE, height: INPUT_SIZE } },
              ],
              { format: SaveFormat.JPEG },
            );

            const sliceDetections = await runSinglePass(
              crop.uri,
              { x: s.x, y: s.y, scaleX: s.w, scaleY: s.h },
              SLICE_CONF, // permissive threshold for zoomed crops
            );
            const source = `slice-${idx + 1}` as const;
            allCandidates.push(
              ...sliceDetections.map((d) => ({ ...d, source })),
            );
            console.log(
              `Slice ${idx + 1}: ${sliceDetections.length} detections`,
            );
          } catch (sliceErr) {
            console.warn(`Slice ${idx + 1} failed, continuing SAHI:`, sliceErr);
          }
          onProgress?.(2 + idx, totalSteps);
        }

        // Final: NMS + consensus filter to reduce single-pass hallucinations
        const mergedResults = applyConsensusFilter(allCandidates);
        console.log(
          `SAHI Complete: ${allCandidates.length} raw -> ${mergedResults.length} vetted hazards`,
        );

        if (mergedResults.length > 0) {
          return filterContextualHazards(mergedResults);
        }

        const relaxedFromStrictCandidates = applyConsensusFilter(
          allCandidates,
          {
            relaxed: true,
          },
        );
        console.log(
          `Relaxed consensus on strict candidates: ${relaxedFromStrictCandidates.length} hazards`,
        );
        if (relaxedFromStrictCandidates.length > 0) {
          return filterContextualHazards(relaxedFromStrictCandidates);
        }

        // Lightweight fallback: run one relaxed global pass only.
        // Avoids doubling SAHI slice workload on lower-memory real devices.
        console.log(
          "No hazards from strict SAHI. Trying relaxed global fallback...",
        );

        const relaxedGlobalDetections = await runSinglePass(
          globalResized.uri,
          undefined,
          RELAXED_GLOBAL_CONF,
          RELAXED_CLASS_FLOOR_DELTA,
        );
        const relaxedCandidates: DetectionCandidate[] = [];
        relaxedCandidates.push(
          ...relaxedGlobalDetections.map((d) => ({
            ...d,
            source: "global" as const,
          })),
        );

        const relaxedResults = applyConsensusFilter(relaxedCandidates, {
          relaxed: true,
        });
        console.log(
          `Relaxed global fallback: ${relaxedCandidates.length} raw -> ${relaxedResults.length} vetted hazards`,
        );

        return filterContextualHazards(relaxedResults);
      } catch (err) {
        console.error("SAHI Inference Failed:", err);

        try {
          // Emergency fallback for low-memory/device-specific SAHI failures.
          // Run a single global pass so users still get detections instead of an empty report.
          const globalResized = await manipulateAsync(
            imageUri,
            [{ resize: { width: INPUT_SIZE, height: INPUT_SIZE } }],
            { format: SaveFormat.JPEG },
          );

          const emergencyDetections = await runSinglePass(
            globalResized.uri,
            undefined,
            RELAXED_GLOBAL_CONF,
            RELAXED_CLASS_FLOOR_DELTA,
          );
          const emergencyCandidates: DetectionCandidate[] =
            emergencyDetections.map((d) => ({
              ...d,
              source: "global" as const,
            }));
          const emergencyResults = applyConsensusFilter(emergencyCandidates, {
            relaxed: true,
          });

          console.log(
            `Emergency global fallback: ${emergencyDetections.length} raw -> ${emergencyResults.length} vetted hazards`,
          );

          return filterContextualHazards(emergencyResults);
        } catch (fallbackErr) {
          console.error("Emergency fallback failed:", fallbackErr);
          throw err;
        }
      }
    },
    [model, modelLoaded],
  );

  return { modelLoaded, error, runInference };
}
