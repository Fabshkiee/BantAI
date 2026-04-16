import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";

// WarningIcon
export default function WarningIcon({ width = 28, height = 25 }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 28 25" fill="none">
      <Path
        d="M12.9785 1.37109C13.4331 0.579844 14.5669 0.579838 15.0215 1.37109L27.0605 22.3252C27.5193 23.124 26.9417 24.1113 26.0391 24.1113H1.96094C1.05824 24.1113 0.480715 23.1239 0.939453 22.3252L12.9785 1.37109Z"
        stroke="black"
        strokeWidth="2"
      />
      <Rect
        x="13.6111"
        y="8.16672"
        width="1"
        height="7.77778"
        rx="0.388889"
        fill="black"
        stroke="black"
        strokeLinejoin="round"
      />
      <Rect
        x="12.4445"
        y="17.8889"
        width="3.11111"
        height="3.11111"
        rx="1.55556"
        fill="black"
      />
    </Svg>
  );
}
