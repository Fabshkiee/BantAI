import * as React from "react";
import Svg, { Path } from "react-native-svg";

// CheckIcon
export default function CheckIcon({ color = "", size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 13L9 17L19 7"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      ;
    </Svg>
  );
}
