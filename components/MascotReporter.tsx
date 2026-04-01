import React from "react";
import { Image, Text, View } from "react-native";
import * as Progress from "react-native-progress";

// safety report map
type RiskVariant = "low" | "medium" | "high" | "critical";

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

// risk variant solver
export function getRiskVariant(score: number): RiskVariant {
  // 0 to 10 is Critical
  if (score >= 0 && score <= 10) {
    return "critical";
  }
  // 11 to 39 is High
  else if (score > 10 && score < 40) {
    return "high";
  }
  // 40 to 79 is Medium
  else if (score >= 40 && score < 80) {
    return "medium";
  }
  // 80 to 100+ is Low
  else {
    return "low";
  }
}

export default function MascotReporter({
  score,
  value,
  hideStatus = false,
}: MascotReportProps) {
  return (
    <View className="flex items-center justify-center max-w-fit">
      <View>
        <Progress.Circle
          progress={value / 100}
          size={280}
          unfilledColor="#e5e5e5"
          borderWidth={0}
          className="absolute -left-[16%] -bottom-[28%]"
          thickness={18}
          color={colors[score]}
        />
        {/* Mascot Head */}
        <Image
          source={require("@/assets/mascot/MascotHead.png")}
          resizeMode="contain"
          className="w-45 h-45"
        />
        {/* Score */}
        <Text
          className="text-h1 font-bold absolute left-[25%] bottom-[18%] -translate-x-1/2 text-center text-text-inverse overflow-visible"
          style={{
            textShadowColor: colors[score],
            textShadowRadius: 15,
            textShadowOffset: { width: 0, height: 0 },
          }}
        >
          {/* Invisible space to negate shadow clippings */}
          {"   "}
          {value}
          {"   "}
        </Text>
      </View>

      {!hideStatus && (
        <View>
          <Text
            className={`text-center text-lg font-semibold mt-20 ${statusTextColors[score]}`}
          >
            Status: {statusDesc[score]} Risk{" "}
          </Text>
        </View>
      )}
    </View>
  );
}
