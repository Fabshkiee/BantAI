import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

// risk level map
type RiskLevelProps = {
  variants: "low" | "medium" | "high" | "critical";
};

const bgStyle = {
  low: "bg-surface-green/60 border-2 border-border-low",
  medium: "bg-surface-yellow/60 border-2 border-border-medium",
  high: "bg-surface-orange/60 border-2 border-border-high",
  critical: "bg-surface-red/60 border-2 border-border-critical",
};

const textStyle = {
  low: "text-text-low",
  medium: "text-text-medium",
  high: "text-text-high",
  critical: "text-text-critical",
};

export default function RiskStatus({ variants }: RiskLevelProps) {
  const { t } = useTranslation();

  return (
    <View
      className={`rounded-full py-1 px-4 items-center justify-center flex self-start ${bgStyle[variants]}`}
    >
      <Text className={`text-md font-semibold ${textStyle[variants]}`}>
        {" "}
        {t(`risk_status.${variants}`)}
      </Text>
    </View>
  );
}
