export interface Point {
  x: number;
  y: number;
}

/**
 * Returns the center {x, y} of a bounding box [x1, y1, x2, y2].
 */
export function getCenter(bbox: [number, number, number, number]): Point {
  return {
    x: (bbox[0] + bbox[2]) / 2,
    y: (bbox[1] + bbox[3]) / 2,
  };
}

/**
 * Calculates the shortest Euclidean distance between the boundaries of two boxes.
 * Returns 0 if they overlap or touch.
 */
export function getBoxDistance(
  boxA: [number, number, number, number],
  boxB: [number, number, number, number],
): number {
  const distX = Math.max(0, boxA[0] - boxB[2], boxB[0] - boxA[2]);
  const distY = Math.max(0, boxA[1] - boxB[3], boxB[1] - boxA[3]);
  return Math.sqrt(distX * distX + distY * distY);
}

/**
 * Calculates what fraction of Box A's area lies inside Box B.
 * Returns a value from 0 to 1.
 */
export function getContainmentRatio(
  boxA: [number, number, number, number],
  boxB: [number, number, number, number],
): number {
  const xA = Math.max(boxA[0], boxB[0]);
  const yA = Math.max(boxA[1], boxB[1]);
  const xB = Math.min(boxA[2], boxB[2]);
  const yB = Math.min(boxA[3], boxB[3]);

  const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
  const areaA = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1]);

  if (areaA <= 0) return 0;
  return interArea / areaA;
}

/**
 * Quick check if two bounding boxes intersect.
 */
export function isOverlapping(
  boxA: [number, number, number, number],
  boxB: [number, number, number, number],
): boolean {
  return !(
    boxA[2] < boxB[0] ||
    boxA[0] > boxB[2] ||
    boxA[3] < boxB[1] ||
    boxA[1] > boxB[3]
  );
}

/**
 * Calculate the Intersection over Union (IoU) of two boxes.
 */
export function getIoU(
  boxA: [number, number, number, number],
  boxB: [number, number, number, number],
): number {
  const xA = Math.max(boxA[0], boxB[0]);
  const yA = Math.max(boxA[1], boxB[1]);
  const xB = Math.min(boxA[2], boxB[2]);
  const yB = Math.min(boxA[3], boxB[3]);

  const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
  const boxAArea = (boxA[2] - boxA[0]) * (boxA[3] - boxA[1]);
  const boxBArea = (boxB[2] - boxB[0]) * (boxB[3] - boxB[1]);

  return interArea / (boxAArea + boxBArea - interArea);
}