import { calculateRoomRisk } from "./riskEngine1";

// Test 1: Big Box Interaction (Fire near Furniture)
// Centers are far (~0.49), but edges overlap.
console.log("Test 1: Big Box Interaction (Flame near Wooden Furniture)");
const res1 = calculateRoomRisk([
  { class: "open_flame_hazard", confidence: 0.9, bbox: [0.1, 0.1, 0.5, 0.5] },
  {
    class: "heavy_wooden_furniture",
    confidence: 0.9,
    bbox: [0.45, 0.45, 0.85, 0.85],
  },
]);
console.log(`Risk Score: ${res1.riskScore}, Level: ${res1.level}`);
console.log(`Insights: ${res1.spatialInsights.join(", ")}\n`);

// Test 2: Containment (Broken Glass inside a shelf/cabinet boundary)
console.log(
  "Test 2: Containment (Broken glass 90% inside original shelf area)",
);
const res2 = calculateRoomRisk([
  { class: "elevated_breakables", confidence: 0.9, bbox: [0.2, 0.2, 0.8, 0.8] },
  { class: "broken_glass", confidence: 0.9, bbox: [0.4, 0.4, 0.6, 0.6] },
]);
console.log(`Risk Score: ${res2.riskScore}, Level: ${res2.level}`);
console.log(`Insights: ${res2.spatialInsights.join(", ")}\n`);

// Test 3: Structural Cluster (3 Cracks nearby)
console.log("Test 3: Structural Cluster (Clustered cracks)");
const res3 = calculateRoomRisk([
  { class: "major_crack", confidence: 0.9, bbox: [0.1, 0.1, 0.2, 0.2] },
  { class: "major_crack", confidence: 0.9, bbox: [0.15, 0.15, 0.25, 0.25] },
  { class: "major_crack", confidence: 0.9, bbox: [0.2, 0.2, 0.3, 0.3] },
]);
console.log(`Risk Score: ${res3.riskScore}, Level: ${res3.level}`);
console.log(`Insights: ${res3.spatialInsights.join(", ")}\n`);
