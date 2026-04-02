import { HazardData as DBHazardData, fetchDataFromDB } from "@/app/db/db";
import CheckIcon from "@/assets/icons/CheckIcon";
import CriticalRiskIcon from "@/assets/icons/CriticalRiskIcon";
import DropDownIcon from "@/assets/icons/DropDownIcon";
import HighRiskIcon from "@/assets/icons/HighRiskIcon";
import LowRiskIcon from "@/assets/icons/LowRiskIcon";
import MediumRiskIcon from "@/assets/icons/MediumRiskIcon";
import React, { useEffect, useState } from "react";
import { Image, LayoutAnimation, Pressable, Text, View } from "react-native";
import Button from "./Button";
import RiskStatus from "./RiskStatus";

// Change to database connection
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

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View className="bg-surface-light rounded-2xl flex-col border-2 border-border-secondary p-4 overflow-hidden">
      <Pressable className="flex-row items-center gap-4" onPress={toggleExpand}>
        {/* Read from data.variant */}
        {riskIcons[data.variant]}
        <Text className="text-2xl font-semibold flex-1">{data.title}</Text>
        <View className="flex-row items-center gap-3">
          {riskStatus[data.variant]}
          <View
            className={
              isExpanded ? "rotate-180 items-center" : "rotate-0 items-center"
            }
          >
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
            {/* Read from data.reason */}
            <Text className="text-lg">{data.reason}</Text>
          </View>

          <View>
            <Text className="text-xl font-semibold mb-2">Suggested Fix:</Text>
            {/* Read from data.suggestedFix */}
            <Text className="text-lg">{data.suggestedFix}</Text>
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
        </View>
      )}
    </View>
  );
}

const HazardCard = () => {
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
};

export default HazardCard;
