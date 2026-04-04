import CheckIcon from "@/assets/icons/CheckIcon";
import CriticalRiskIcon from "@/assets/icons/CriticalRiskIcon";
import DropDownIcon from "@/assets/icons/DropDownIcon";
import HighRiskIcon from "@/assets/icons/HighRiskIcon";
import LowRiskIcon from "@/assets/icons/LowRiskIcon";
import MediumRiskIcon from "@/assets/icons/MediumRiskIcon";
import {
    HazardData as DBHazardData,
    fetchDataFromDB,
    markHazardAsAssessed,
} from "@/db/db";
import React, { useEffect, useState } from "react";
import { Image, LayoutAnimation, Pressable, Text, View } from "react-native";
import Button from "./Button";
import RiskStatus from "./RiskStatus";

// Change to database connection
export type HazardData = DBHazardData;

type HazardCardProps = {
  hazards?: HazardData[];
  showResolutionAction?: boolean;
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

function HazardCardDesign({
  data,
  showResolutionAction = false,
}: {
  data: HazardData;
  showResolutionAction?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View className="bg-surface-light rounded-2xl flex-col shadow-lg shadow-border-default p-4 overflow-hidden">
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

          {showResolutionAction ? (
            <View>
              <Button
                label={isResolved ? "Resolved" : "Mark as Resolved"}
                variant="primary"
                icon={<CheckIcon color="white" size={24} />}
                iconPosition="right"
                onPress={async () => {
                  if (isResolved) {
                    return;
                  }

                  try {
                    await markHazardAsAssessed(data.id);
                    setIsResolved(true);
                  } catch (error) {
                    console.error("Failed to mark hazard as resolved:", error);
                  }
                }}
              />
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const HazardCard = ({
  hazards,
  showResolutionAction = false,
}: HazardCardProps) => {
  const [loadedHazards, setLoadedHazards] = useState<HazardData[]>([]);
  const [isLoading, setIsLoading] = useState(hazards === undefined);

  useEffect(() => {
    if (hazards !== undefined) {
      setLoadedHazards(hazards);
      setIsLoading(false);
      return;
    }

    const fetchHazards = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDataFromDB();
        setLoadedHazards(data);
      } catch (error) {
        console.error("Failed to load hazards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHazards();
  }, [hazards]);

  if (isLoading) {
    return (
      <View className="items-center justify-center py-10">
        <Text className="text-text-subtle">Loading hazards...</Text>
      </View>
    );
  }

  return (
    <View className="gap-4">
      {loadedHazards.length === 0 ? (
        <View className="rounded-2xl bg-surface-light px-4 py-6">
          <Text className="text-lg font-semibold">No hazards detected</Text>
          <Text className="text-text-subtle mt-1">
            The scan did not produce any hazards for this report.
          </Text>
        </View>
      ) : (
        loadedHazards.map((hazard) => (
          <HazardCardDesign
            key={hazard.id}
            data={hazard}
            showResolutionAction={showResolutionAction}
          />
        ))
      )}
    </View>
  );
};

export default HazardCard;
