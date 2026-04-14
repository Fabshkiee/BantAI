import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

type PointerSide = "top" | "bottom" | "left" | "right";

type CoachmarkOverlayProps = {
  title: string;
  description: string;
  stepText: string;
  ctaLabel: string;
  onNext: () => void;
  onSkip?: () => void;
  positionStyle: ViewStyle;
  pointerSide?: PointerSide;
  pointerOffset?: number;
};

const CARD_BG = "#e8eef4";

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
  positionStyle,
  pointerSide = "top",
  pointerOffset = 120,
}: CoachmarkOverlayProps) {
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onSkip ?? (() => null)}
      />

      <View style={[styles.card, positionStyle]}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.stepText}>{stepText}</Text>
        </View>

        <Text style={styles.description}>{description}</Text>

        <Pressable style={styles.cta} onPress={onNext}>
          <Text style={styles.ctaText}>{ctaLabel}</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.58)",
  },
  card: {
    position: "absolute",
    backgroundColor: CARD_BG,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    width: 320,
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
  },
  cta: {
    marginTop: 18,
    borderRadius: 999,
    backgroundColor: "#0d72c8",
    alignItems: "center",
    justifyContent: "center",
    height: 58,
  },
  ctaText: {
    color: "#f4f9ff",
    fontSize: 42 / 2,
    lineHeight: 42 / 2,
    fontWeight: "700",
  },
});
