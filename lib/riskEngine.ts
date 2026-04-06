import { hazardDictionary } from "../hazardDictionary";
import { getBoxDistance, getContainmentRatio } from "./spatialMath";

export type RiskLevel = "Safe" | "Low" | "Medium" | "High" | "Critical";

export interface RiskResult {
  riskScore: number;
  safetyScore: number; // 0-100, where 100 is perfectly safe
  level: RiskLevel;
  mascotVariant: "low" | "medium" | "high" | "critical";
  breakdown: Record<string, { count: number; weightedScore: number }>;
  spatialInsights: string[];
}

const SEVERITY_VALUES: Record<string, number> = {
  critical: 15,
  high: 10,
  medium: 5,
  low: 2,
};

const PROXIMITY_THRESHOLD = 0.2; // 20% of the screen distance edge-to-edge

function getDictionaryId(className: string): string {
  if (!className) return "HAZARD_LABELS.UNKNOWN";
  return `HAZARD_LABELS.${className.toUpperCase()}`;
}

export interface Detection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
}

/**
 * Calculates a density-weighted AND spatial-aware risk score.
 * 1. Count instances (Density)
 * 2. Check Boundary Proximity & Containment
 * 3. Lock status to Critical if extreme conditions met
 */
export function calculateRoomRisk(detections: Detection[]): RiskResult {
  const consideredDetections = detections;
  const breakdown: Record<string, { count: number; weightedScore: number }> =
    {};
  const spatialInsights: string[] = [];

  // 1. Group and count detections
  consideredDetections.forEach((det) => {
    const dictId = getDictionaryId(det.class);
    if (!breakdown[dictId]) {
      breakdown[dictId] = { count: 0, weightedScore: 0 };
    }
    breakdown[dictId].count += 1;
  });

  let totalRiskScore = 0;
  let forceCritical = false;

  // 2. Base & Density Scoring
  Object.keys(breakdown).forEach((dictId) => {
    const entry = hazardDictionary.find((h) => h.id === dictId);
    if (!entry) return;

    const baseValue = SEVERITY_VALUES[entry.default_severity] || 0;
    const count = breakdown[dictId].count;

    const densityMultiplier = 1 + (count - 1) * 0.15;
    const weightedScore = baseValue * densityMultiplier;

    breakdown[dictId].weightedScore = weightedScore;
    totalRiskScore += weightedScore;

    if (entry.default_severity === "high" && count >= 5) forceCritical = true;
    if (entry.default_severity === "critical" && count >= 3)
      forceCritical = true;
  });

  // 3. Precise Spatial Reasoning Phase
  for (let i = 0; i < consideredDetections.length; i++) {
    for (let j = i + 1; j < consideredDetections.length; j++) {
      const detA = consideredDetections[i];
      const detB = consideredDetections[j];
      const dist = getBoxDistance(detA.bbox, detB.bbox);

      if (dist < PROXIMITY_THRESHOLD) {
        let multiplier = 1;
        const entryA = hazardDictionary.find(
          (h) => h.id === getDictionaryId(detA.class),
        );
        const entryB = hazardDictionary.find(
          (h) => h.id === getDictionaryId(detB.class),
        );

        if (!entryA || !entryB) continue;

        // RULE: Fire + Furniture Proximity (High Spread Risk)
        if (
          (entryA.category === "fire" &&
            entryB.id === "HAZARD_LABELS.HEAVY_WOODEN_FURNITURE") ||
          (entryB.category === "fire" &&
            entryA.id === "HAZARD_LABELS.HEAVY_WOODEN_FURNITURE")
        ) {
          multiplier = 2.0;
          spatialInsights.push(
            `Critical: Open flame detected dangerously close to wooden furniture.`,
          );
        }
        // RULE: Fire + Electrical Proximity
        else if (
          (entryA.category === "fire" && entryB.category === "electrical") ||
          (entryA.category === "electrical" && entryB.category === "fire")
        ) {
          multiplier = 1.8;
          spatialInsights.push(
            `Danger: Fire source near electrical components.`,
          );
        }
        // RULE: Structural Clustering (Edge distance is 0 for touching boxes)
        else if (
          entryA.category === "structural" &&
          entryB.category === "structural"
        ) {
          multiplier = 1.4;
          spatialInsights.push(
            `Structural Warning: Clustered cracks detected in the same area.`,
          );
        }

        // RULE: Containment Check for Broken Glass
        // If broken glass is contained within elevated breakables shelf, it's safer.
        if (
          (detA.class === "broken_glass" &&
            detB.class === "elevated_breakables") ||
          (detB.class === "broken_glass" &&
            detA.class === "elevated_breakables")
        ) {
          const glassBox =
            detA.class === "broken_glass" ? detA.bbox : detB.bbox;
          const shelfBox =
            detA.class === "elevated_breakables" ? detA.bbox : detB.bbox;
          const containment = getContainmentRatio(glassBox, shelfBox);

          if (containment > 0.7) {
            multiplier = 0.5; // Half risk if glass is contained on a shelf
            spatialInsights.push(
              `Safe: Broken glass is contained within its original shelf area.`,
            );
          }
        }

        if (multiplier !== 1) {
          const pairBaseSeverity =
            SEVERITY_VALUES[entryA.default_severity] +
            SEVERITY_VALUES[entryB.default_severity];
          totalRiskScore += pairBaseSeverity * (multiplier - 1);
        }
      }
    }
  }

  // 4. Flood Zone Awareness (Bottom 15% of frame)
  consideredDetections.forEach((det) => {
    const isAtBottom = det.bbox[3] > 0.85; // Lower 15%
    const entry = hazardDictionary.find(
      (h) => h.id === getDictionaryId(det.class),
    );
    if (
      isAtBottom &&
      (entry?.category === "electrical" || det.class === "floor_appliance")
    ) {
      totalRiskScore += 12;
      spatialInsights.push(
        `Flood Risk: Electrical hazards identified in the flood zone (floor).`,
      );
    }
  });

  // 5. Calculate final safety score
  const safetyScore = Math.max(
    0,
    Math.min(100, Math.round(100 - totalRiskScore * 1.3)),
  );

  // 6. Determine status
  let level: RiskLevel = "Safe";
  let mascotVariant: "low" | "medium" | "high" | "critical" = "low";

  if (safetyScore <= 15 || forceCritical) {
    level = "Critical";
    mascotVariant = "critical";
  } else if (safetyScore < 45) {
    level = "High";
    mascotVariant = "high";
  } else if (safetyScore < 75) {
    level = "Medium";
    mascotVariant = "medium";
  } else if (safetyScore < 95) {
    level = "Low";
    mascotVariant = "low";
  } else {
    level = "Safe";
    mascotVariant = "low";
  }

  return {
    riskScore: Math.round(totalRiskScore),
    safetyScore,
    level,
    mascotVariant,
    breakdown,
    spatialInsights: Array.from(new Set(spatialInsights)), // Deduplicate
  };
}
