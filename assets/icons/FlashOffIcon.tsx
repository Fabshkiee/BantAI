import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

export default function FlashOffIcon({
  color = "black",
  size = 24,
  ...props
}: SvgProps & { color?: string; size?: number }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 2L22 22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
