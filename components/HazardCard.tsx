import CheckIcon from "@/assets/icons/CheckIcon";
import CriticalRiskIcon from "@/assets/icons/CriticalRiskIcon";
import DropDownIcon from "@/assets/icons/DropDownIcon";
import HighRiskIcon from "@/assets/icons/HighRiskIcon";
import LowRiskIcon from "@/assets/icons/LowRiskIcon";
import MediumRiskIcon from "@/assets/icons/MediumRiskIcon";
import React, { useState } from "react";
import { Image, LayoutAnimation, Pressable, Text, View } from "react-native";
import Button from "./Button";
import RiskStatus from "./RiskStatus";

type HazardCardLevelProps = {
  variants: "low" | "medium" | "high" | "critical";
};

const riskIcons = {
  low: <LowRiskIcon size={36} />,
  medium: <MediumRiskIcon size={36} />,
  high: <HighRiskIcon size={36} />,
  critical: <CriticalRiskIcon size={36} />,
};

const riskStatus = {
  low: <RiskStatus variants="low" />,
  medium: <RiskStatus variants="medium" />,
  high: <RiskStatus variants="high" />,
  critical: <RiskStatus variants="critical" />,
};

{
  /* Modify based on scenarios */
}
const cardTitle = "Exposed Wiring";
const variant = "low";
const reason = "Frayed wires near water source.";
const suggestedFix = "Replace cable and route away from sink.";
const numberOfHazards = 4;

function HazardCardDesign({ variants }: HazardCardLevelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View className="bg-surface-light rounded-2xl flex-col border-2 border-border-secondary p-4 overflow-hidden">
      <Pressable className="flex-row items-center gap-4" onPress={toggleExpand}>
        {riskIcons[variants]}
        <Text className="text-2xl font-semibold flex-1">{cardTitle}</Text>
        <View className="flex-row items-center gap-3">
          {riskStatus[variants]}
          <View className={isExpanded ? "rotate-180" : "rotate-0"}>
            <DropDownIcon size={26} />
          </View>
        </View>
      </Pressable>

      {isExpanded && (
        <View className="flex-col gap-7 mt-4">
          <View>
            <Text className="text-xl font-semibold">Identified Hazard:</Text>
            <Image
              source={require("@/assets/images/room.png")}
              className="rounded-2xl mt-2 w-full h-160"
              resizeMode="cover"
            />
          </View>

          <View>
            <Text className="text-xl font-semibold mb-2">Reason:</Text>
            <Text>{reason}</Text>
          </View>

          <View>
            <Text className="text-xl font-semibold mb-2">Suggested Fix:</Text>
            <Text>{suggestedFix}</Text>
          </View>

          <View>
            <Button
              label="Mark as Resolved"
              variant="primary"
              icon={<CheckIcon color="white" size={24} />}
              iconPosition="right"
              onPress={() => console.log("Resolved")}
            />
          </View>
        </View>
      )}
    </View>
  );
}

export default function HazardCard() {
  return (
    <View className="gap-4">
      {Array.from({ length: numberOfHazards }).map((_, index) => (
        <HazardCardDesign key={index} variants={variant} />
      ))}
    </View>
  );
}
