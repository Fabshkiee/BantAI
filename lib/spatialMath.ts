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

