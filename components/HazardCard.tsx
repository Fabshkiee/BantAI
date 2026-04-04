import CheckIcon from "@/assets/icons/CheckIcon";
import CriticalRiskIcon from "@/assets/icons/CriticalRiskIcon";
import DropDownIcon from "@/assets/icons/DropDownIcon";
import HighRiskIcon from "@/assets/icons/HighRiskIcon";
import LowRiskIcon from "@/assets/icons/LowRiskIcon";
import MediumRiskIcon from "@/assets/icons/MediumRiskIcon";
import { HazardData as DBHazardData, fetchDataFromDB } from "@/db/db";
import React, { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import Animated, {
  FadeInUp,
  FadeOutUp,
  LinearTransition,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Button from "./Button";
import RiskStatus from "./RiskStatus";

export type HazardData = DBHazardData;

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

function HazardCardDesign({ data }: { data: HazardData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const rotation = useSharedValue(0);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    rotation.value = withSpring(isExpanded ? 0 : 180, {
      damping: 15,
      stiffness: 150,
    });
  };

  return (
    <Animated.View
      layout={LinearTransition.damping(18).stiffness(120)}
      className="bg-surface-light rounded-2xl flex-col shadow-sm border border-border-secondary p-4 overflow-hidden"
    >
      <Pressable className="flex-row items-center gap-4" onPress={toggleExpand}>
        {riskIcons[data.variant]}
        <Text className="text-2xl font-semibold flex-1">{data.title}</Text>

        <View className="flex-row items-center gap-3">
          {riskStatus[data.variant]}

          <View
            className={`items-center transition-transform duration-300 ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
          >
            <DropDownIcon size={26} />
          </View>
        </View>
      </Pressable>

      {isExpanded && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          exiting={FadeOutUp.duration(200)}
          className="flex-col gap-7 mt-4"
        >
          <View>
            <Text className="text-xl font-semibold">Identified Hazard:</Text>
            <Image
              source={require("@/assets/images/room.png")}
              className="rounded-2xl mt-2 w-full h-[160px]"
              resizeMode="cover"
            />
          </View>

          <View>
            <Text className="text-xl font-semibold mb-2">Reason:</Text>
            <Text className="text-lg leading-6">{data.reason}</Text>
          </View>

          <View>
            <Text className="text-xl font-semibold mb-2">Suggested Fix:</Text>
            <Text className="text-lg leading-6">{data.suggestedFix}</Text>
          </View>

          <View>
            <Button
              label="Mark as Resolved"
              variant="primary"
              icon={<CheckIcon color="white" size={24} />}
              iconPosition="right"
              onPress={() => console.log(`Resolved hazard: ${data.id}`)}
            />
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
}

export default function HazardCard() {
  const [hazards, setHazards] = useState<HazardData[]>([]);

  useEffect(() => {
    const fetchHazards = async () => {
      try {
        const data = await fetchDataFromDB();
        setHazards(data);
      } catch (error) {
        console.error("Failed to load hazards:", error);
      }
    };

    fetchHazards();
  }, []);

  return (
    <View className="gap-4">
      {hazards.map((hazard) => (
        <HazardCardDesign key={hazard.id} data={hazard} />
      ))}
    </View>
  );
}
