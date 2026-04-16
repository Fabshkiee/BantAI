import * as React from "react";
import Svg, { Path } from "react-native-svg";

// SafetyIcon
export default function SafetyIcon({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <Path
        d="M9 13.0742L11.6667 15.7409L17 10.4076M24.4905 5.05334C24.2177 5.06718 23.943 5.07418 23.6667 5.07418C19.5687 5.07418 15.8306 3.5336 12.9999 1C10.1692 3.5335 6.43118 5.07402 2.33333 5.07402C2.05703 5.07402 1.78237 5.06701 1.50951 5.05318C1.17694 6.33799 1 7.68545 1 9.07423C1 16.5296 6.09909 22.794 13 24.5702C19.9009 22.794 25 16.5296 25 9.07423C25 7.68551 24.8231 6.3381 24.4905 5.05334Z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
