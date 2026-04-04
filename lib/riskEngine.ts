import { hazardDictionary } from "../hazardDictionary";

export type RiskLevel = "Safe" | "Low" | "Medium" | "High" | "Critical";

export interface RiskResult {
  riskScore: number;
  safetyScore: number; // 0-100, where 100 is perfectly safe
  level: RiskLevel;
  mascotVariant: "low" | "medium" | "high" | "critical";
  breakdown: Record<string, { count: number; weightedScore: number }>;
}

const SEVERITY_VALUES: Record<string, number> = {
  critical: 15,
  high: 10,
  medium: 5,
  low: 2,
};

function getDictionaryId(className: string): string {
  return `HAZARD_LABELS.${className.toUpperCase()}`;
}

/**
 * Calculates a density-weighted risk score for a room.
 * Multiplier logic: Every additional instance of a hazard adds 15% to that hazard's total score.
 * Locking logic: If 5+ instances of a High hazard or 3+ of a Critical hazard exist, the room is automatically 'Critical'.
 */
export function calculateRoomRisk(
  detections: { class: string; confidence: number }[],
): RiskResult {
  const breakdown: Record<string, { count: number; weightedScore: number }> =
    {};

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

  // 2. Apply density logic to each group
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
    if (entry.default_severity === "critical" && count >= 3)
      forceCritical = true;
  });

  // 4. Calculate safety score (invert risk)
  // Max risk considered for 0% safety is ~50
  const safetyScore = Math.max(
    0,
    Math.min(100, Math.round(100 - totalRiskScore * 2)),
  );

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
  };
}
