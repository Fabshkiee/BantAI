import { calculateRoomRisk } from "./riskEngine";

// Test 1: Single High Hazard
console.log("Test 1: Single High Hazard (Expected: High/7)");
const res1 = calculateRoomRisk([{ class: "major_crack", confidence: 0.9 }]);
console.log(JSON.stringify(res1, null, 2));

// Test 2: 5x High Hazard (Expected: Critical/Density Scaling)
console.log("\nTest 2: 5x High Hazards (Expected: Critical/Density Escalated)");
const detections2 = Array(5).fill({ class: "major_crack", confidence: 0.9 });
const res2 = calculateRoomRisk(detections2);
console.log(JSON.stringify(res2, null, 2));

// Test 3: 3x Critical Hazard (Expected: Critical/Locking)
console.log("\nTest 3: 3x Critical Hazards (Expected: Critical/Escalated)");
const detections3 = Array(3).fill({ class: "exposed_breaker", confidence: 0.9 });
const res3 = calculateRoomRisk(detections3);
console.log(JSON.stringify(res3, null, 2));
