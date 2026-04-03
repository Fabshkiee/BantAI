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
  return `HAZARD_LABELS.${className.toUpperCase()}`;
}

/**
 * Calculates a density-weighted AND spatial-aware risk score.
 * 1. Count instances (Density)
 * 2. Check Boundary Proximity & Containment
 * 3. Lock status to Critical if extreme conditions met
 */
export function calculateRoomRisk(
  detections: { class: string; confidence: number; bbox: [number, number, number, number] }[],
): RiskResult {
  const breakdown: Record<string, { count: number; weightedScore: number }> = {};
  const spatialInsights: string[] = [];
  
  // 1. Group and count detections
  detections.forEach((det) => {
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

    // Density Formula: 15% boost per extra instance
    const densityMultiplier = 1 + (count - 1) * 0.15;
    const weightedScore = baseValue * densityMultiplier;

    breakdown[dictId].weightedScore = weightedScore;
    totalRiskScore += weightedScore;

    // 3. Status Escalation (Locking) logic
    // 5+ High hazards OR 3+ Critical hazards = Automatic Critical Risk
    if (entry.default_severity === "high" && count >= 5) forceCritical = true;
    if (entry.default_severity === "critical" && count >= 3) forceCritical = true;
  });

  // 4. Precise Spatial Reasoning Phase
  for (let i = 0; i < detections.length; i++) {
    for (let j = i + 1; j < detections.length; j++) {
      const detA = detections[i];
      const detB = detections[j];
      const dist = getBoxDistance(detA.bbox, detB.bbox);

      if (dist < PROXIMITY_THRESHOLD) {
        let multiplier = 1;
        const entryA = hazardDictionary.find((h) => h.id === getDictionaryId(detA.class));
        const entryB = hazardDictionary.find((h) => h.id === getDictionaryId(detB.class));
        
        if (!entryA || !entryB) continue;

        // RULE: Fire + Furniture Proximity (High Spread Risk)
        if (
          (entryA.category === "fire" && entryB.id === "HAZARD_LABELS.HEAVY_WOODEN_FURNITURE") ||
          (entryB.category === "fire" && entryA.id === "HAZARD_LABELS.HEAVY_WOODEN_FURNITURE")
        ) {
          multiplier = 2.0;
          spatialInsights.push(`Critical: Open flame detected dangerously close to wooden furniture.`);
        }
      }
    }
  }
        


  const safetyScore = Math.max(0, Math.min(100, Math.round(100 - (totalRiskScore * 1.3))));

  // 5. Determine levels and mascot variants
  let level: RiskLevel = "Safe";
  let mascotVariant: "low" | "medium" | "high" | "critical" = "low";

  if (safetyScore <= 10 || forceCritical) {
    level = "Critical";
    mascotVariant = "critical";
  } else if (safetyScore < 40) {
    level = "High";
    mascotVariant = "high";
  } else if (safetyScore < 70) {
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
    spatialInsights: [],
  };
}
