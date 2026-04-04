import React from "react";
import { Image, Text, View } from "react-native";
import * as Progress from "react-native-progress";

export type RiskVariant = "low" | "medium" | "high" | "critical";

export function getRiskVariant(score: number): RiskVariant {
  if (score <= 15) return "critical";
  if (score < 45) return "high";
  if (score < 75) return "medium";
  return "low";
}

type MascotReportProps = {
  score: RiskVariant;
  value: number;
  hideStatus?: boolean;
};

const colors = {
  low: "#00ad14",
  medium: "#d89700",
  high: "#c56400",
  critical: "#b40000",
};

const statusDesc = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const statusTextColors = {
  low: "text-text-low",
  medium: "text-text-medium",
  high: "text-text-high",
  critical: "text-text-critical",
};

export default function MascotReporter({
  score,
  value,
  hideStatus = false,
}: MascotReportProps) {
  return (
    <View className="flex items-center justify-center max-w-fit">
      <View className="relative flex items-center justify-center w-[280px] h-[280px]">
        <Progress.Circle
          progress={value / 100}
          size={280}
          unfilledColor="#e5e5e5"
          borderWidth={0}
          thickness={18}
          color={colors[score]}
        />

        <Image
          source={require("@/assets/mascot/MascotHead.png")}
          resizeMode="contain"
          className="absolute w-[180px] h-[180px]"
        />

        <Text
          className="absolute text-h1 font-bold left-[50%] top-[50%] -translate-x-1/2 text-center text-text-inverse overflow-visible"
          style={{
            textShadowColor: colors[score],
            textShadowRadius: 15,
            textShadowOffset: { width: 0, height: 0 },
          }}
        >
          {"   "}
          {value}
          {"   "}
        </Text>
      </View>

      {/* Adjusted the margin-top so it doesn't overlap the newly sized 280px box */}
      {!hideStatus && (
        <View className="mt-4">
          <Text
            className={`text-center text-lg font-semibold ${statusTextColors[score]}`}
          >
            Status: {statusDesc[score]} Risk{" "}
          </Text>
        </View>
      )}
    </View>
  );
}
