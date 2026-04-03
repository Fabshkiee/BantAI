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
