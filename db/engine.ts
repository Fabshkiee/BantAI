import { HAZARD_TYPES, SEVERITY_SCORES, CATEGORY_WEIGHTS } from "./hazards";

export const calculateRisk = (detectedNames: string[]) => {
  // Get the full hazard objects based on the names detected by the AI
  const activeHazards = HAZARD_TYPES.filter(h => detectedNames.includes(h.name));

  // 2. Calculate individual scores: (Severity * Weight)
  const scores = activeHazards.map(h => {
    const s = SEVERITY_SCORES[h.default_severity];
    const w = CATEGORY_WEIGHTS[h.category] || 0.1;
    return s * w;
  });

  // 3. Sum the top 5 and multiply by 0.8
  const total = scores
    .sort((a, b) => b - a)
    .slice(0, 5)
    .reduce((sum, val) => sum + val, 0);

  return Math.min(Math.round(total * 0.8), 100);
};