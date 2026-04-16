import React from "react";
import { Svg, Circle } from "react-native-svg";

const MoreIcon = ({ size = 24, color = "#000" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="2" fill={color} />
    <Circle cx="19" cy="12" r="2" fill={color} />
    <Circle cx="5" cy="12" r="2" fill={color} />
  </Svg>
);

export default MoreIcon;
