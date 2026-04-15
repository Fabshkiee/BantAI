import ArrowRightIcon from "@/assets/icons/ArrowRightIcon";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import Svg, { Path } from "react-native-svg";

type PointerSide = "top" | "bottom" | "left" | "right";

type CoachmarkOverlayProps = {
  title: string;
  description: string;
  stepText: string;
  ctaLabel: string;
  onNext: () => void;
  onSkip?: () => void;
  ctaIcon?: React.ReactNode;
  ctaIconPosition?: "left" | "right";
  positionStyle: ViewStyle;
  pointerSide?: PointerSide;
  pointerOffset?: number;
  spotlightRect?: { x: number; y: number; width: number; height: number };
  spotlightRadius?: number;
  onSpotlightPress?: () => void;
};

const CARD_BG = "#e8eef4";
const DIM_BG = "rgba(0, 0, 0, 0.58)";

function getPointerStyle(side: PointerSide, offset: number) {
  switch (side) {
    case "bottom":
      return {
        position: "absolute" as const,
        bottom: -12,
        left: offset,
        width: 0,
        height: 0,
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderTopWidth: 12,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: CARD_BG,
      };
    case "left":
      return {
        position: "absolute" as const,
        left: -12,
        top: offset,
        width: 0,
        height: 0,
        borderTopWidth: 12,
        borderBottomWidth: 12,
        borderRightWidth: 12,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        borderRightColor: CARD_BG,
      };
    case "right":
      return {
        position: "absolute" as const,
        right: -12,
        top: offset,
        width: 0,
        height: 0,
        borderTopWidth: 12,
        borderBottomWidth: 12,
        borderLeftWidth: 12,
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        borderLeftColor: CARD_BG,
      };
    case "top":
    default:
      return {
        position: "absolute" as const,
        top: -12,
        left: offset,
        width: 0,
        height: 0,
        borderLeftWidth: 12,
        borderRightWidth: 12,
        borderBottomWidth: 12,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: CARD_BG,
      };
  }
}

export default function CoachmarkOverlay({
  title,
  description,
  stepText,
  ctaLabel,
  onNext,
  onSkip,
  ctaIcon = <ArrowRightIcon color="white" size={16} />,
  ctaIconPosition = "right",
  positionStyle,
  pointerSide = "top",
  pointerOffset = 120,
  spotlightRect,
  spotlightRadius = 18,
  onSpotlightPress,
}: CoachmarkOverlayProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const blockOverlayTap = () => null;
  void onSpotlightPress;

  const holePath = spotlightRect
    ? (() => {
        const x = spotlightRect.x;
        const y = spotlightRect.y;
        const w = spotlightRect.width;
        const h = spotlightRect.height;
        const r = Math.max(0, Math.min(spotlightRadius, w / 2, h / 2));

        return [
          `M0 0H${screenWidth}V${screenHeight}H0Z`,
          `M${x + r} ${y}`,
          `H${x + w - r}`,
          `Q${x + w} ${y} ${x + w} ${y + r}`,
          `V${y + h - r}`,
          `Q${x + w} ${y + h} ${x + w - r} ${y + h}`,
          `H${x + r}`,
          `Q${x} ${y + h} ${x} ${y + h - r}`,
          `V${y + r}`,
          `Q${x} ${y} ${x + r} ${y}`,
          "Z",
        ].join(" ");
      })()
    : "";

  return (
    <View style={styles.overlay} pointerEvents="auto">
      {spotlightRect ? (
        <>
          {/* Visual dim layer with a rounded transparent hole for the spotlight target */}
          <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
            <Path d={holePath} fill={DIM_BG} fillRule="evenodd" />
          </Svg>

          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={blockOverlayTap}
          />

          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: spotlightRect.x,
              top: spotlightRect.y,
              width: spotlightRect.width,
              height: spotlightRect.height,
              borderRadius: spotlightRadius,
              //   borderWidth: 2,
              //   borderColor: "rgba(255,255,255,0.95)",
            }}
          />
        </>
      ) : (
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: DIM_BG }]}
          onPress={blockOverlayTap}
        />
      )}

      <View className="bg-default" style={[styles.card, positionStyle]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.stepText}>{stepText}</Text>
        </View>

        <Text style={styles.description}>{description}</Text>

        <Pressable style={styles.cta} onPress={onNext}>
          <View style={styles.ctaContent}>
            {ctaIconPosition === "left" && ctaIcon}
            <Text style={styles.ctaText}>{ctaLabel}</Text>
            {ctaIconPosition === "right" && ctaIcon}
          </View>
        </Pressable>

        <View style={getPointerStyle(pointerSide, pointerOffset)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9998,
    backgroundColor: "transparent",
  },
  card: {
    position: "absolute",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 20,
    maxWidth: 250,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    color: "#121417",
    fontWeight: "600",
    flexShrink: 1,
    paddingRight: 20,
  },
  stepText: {
    fontSize: 18,
    lineHeight: 26,
    color: "#81858b",
    fontWeight: "400",
  },
  description: {
    marginTop: 10,
    fontSize: 17,
    lineHeight: 29,
    color: "#121417",
    //paddingRight: 20,
    // maxWidth: 250,
  },
  cta: {
    marginTop: 18,
    borderRadius: 999,
    backgroundColor: "#0d72c8",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    maxWidth: 150,
  },
  ctaContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  ctaText: {
    color: "#f4f9ff",
    fontSize: 42 / 2,
    lineHeight: 42 / 2,
    fontWeight: "700",
  },
});
