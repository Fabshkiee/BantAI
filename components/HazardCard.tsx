import CheckIcon from "@/assets/icons/CheckIcon";
import CriticalRiskIcon from "@/assets/icons/CriticalRiskIcon";
import DropDownIcon from "@/assets/icons/DropDownIcon";
import HighRiskIcon from "@/assets/icons/HighRiskIcon";
import LowRiskIcon from "@/assets/icons/LowRiskIcon";
import MediumRiskIcon from "@/assets/icons/MediumRiskIcon";
import {
  fetchDataFromDB,
  markHazardAsAssessed,
  type ScanSessionDetails,
} from "@/db/db";
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

export type HazardData = {
  id: string | number;
  title: string;
  variant: "low" | "medium" | "high" | "critical";
  reason: string;
  suggestedFix: string;
  bbox?: [number, number, number, number];
  isAssessed?: boolean;
  internalName?: string;
  disasterTypes?: string[];
  // Disaster specific fields from the dictionary
  earthquake_reason?: string;
  earthquake_fixes?: string[];
  fire_reason?: string;
  fire_fixes?: string[];
  typhoon_reason?: string;
  typhoon_fixes?: string[];
};

export interface HazardCardProps {
  hazards?: HazardData[];
  imageUri?: string;
  showResolutionAction?: boolean;
  activeDisasterTab?: "all" | "earthquake" | "typhoon" | "fire";
  onResolved?: (updatedSession?: ScanSessionDetails | null) => void;
}

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
  imageUri,
  showResolutionAction = false,
  activeDisasterTab = "all",
  onResolved,
}: {
  data: HazardData;
  imageUri?: string;
  showResolutionAction?: boolean;
  activeDisasterTab?: "all" | "earthquake" | "typhoon" | "fire";
  onResolved?: (updatedSession?: ScanSessionDetails | null) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isResolved, setIsResolved] = useState(data.isAssessed || false);
  const rotation = useSharedValue(0);

  useEffect(() => {
    setIsResolved(data.isAssessed || false);
  }, [data.isAssessed]);

  // Disaster Sorting Logic: Determine which text to show
  const tab = activeDisasterTab === "all" ? "earthquake" : activeDisasterTab;
  const reason = (data[`${tab}_reason` as keyof HazardData] as string) || data.reason;
  const fixes = (data[`${tab}_fixes` as keyof HazardData] as string[]) || [data.suggestedFix];

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
          <Animated.View style={{ transform: [{ rotate: `${isExpanded ? 180 : 0}deg` }] }}>
            <DropDownIcon size={26} />
          </Animated.View>
        </View>
      </Pressable>

      {isExpanded && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          exiting={FadeOutUp.duration(200)}
          className="flex-col gap-7 mt-4"
        >
          {/* Image & Bbox Logic */}
          <View className="relative w-full h-64 mt-2 rounded-2xl overflow-hidden bg-gray-100 border border-border-secondary">
            {(() => {
              const hasBbox = data.bbox && data.bbox.length === 4;
              let transformStyles = {};
              if (hasBbox) {
                const [x1, y1, x2, y2] = data.bbox!;
                const centerX = (x1 + x2) / 2;
                const centerY = (y1 + y2) / 2;
                const width = x2 - x1;
                const height = y2 - y1;
                const scale = Math.min(2.5, Math.max(1, 0.6 / Math.max(width, height)));
                const translateX = (0.5 - centerX) * 100;
                const translateY = (0.5 - centerY) * 100;
                transformStyles = {
                  transform: [
                    { scale: scale },
                    { translateX: `${translateX}%` as any },
                    { translateY: `${translateY}%` as any },
                  ],
                };
              }
              return (
                <View className="w-full h-full" style={transformStyles}>
                  <Image
                    source={imageUri ? { uri: imageUri } : require("@/assets/images/room.png")}
                    className="absolute inset-0 w-full h-full"
                    resizeMode="stretch"
                  />
                  {hasBbox && (
                    <View
                      className="absolute border-[2.5px]"
                      style={{
                        left: `${data.bbox![0] * 100}%`,
                        top: `${data.bbox![1] * 100}%`,
                        width: `${(data.bbox![2] - data.bbox![0]) * 100}%`,
                        height: `${(data.bbox![3] - data.bbox![1]) * 100}%`,
                        borderColor: data.variant === "critical" ? "#b40000" : data.variant === "high" ? "#c56400" : data.variant === "medium" ? "#d89700" : "#00ad14",
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                    />
                  )}
                </View>
              );
            })()}
          </View>

          {/* Dynamic Reason based on Tab */}
          <View>
            <Text className="text-xl font-semibold mb-2 text-text-default">Reason:</Text>
            <Text className="text-lg leading-6 text-text-default">{reason}</Text>
          </View>

          {/* Dynamic Fixes based on Tab */}
          <View>
            <Text className="text-xl font-semibold mb-2 text-text-default">Suggested Fixes:</Text>
            {fixes.map((fix, index) => (
              <View key={index} className="flex-row gap-2 mb-2">
                <Text className="text-lg font-bold text-text-default">{index + 1}.</Text>
                <Text className="text-lg flex-1 text-text-default">{fix}</Text>
              </View>
            ))}
          </View>

          {showResolutionAction && (
            <View>
              <Button
                label={isResolved ? "Resolved" : "Mark as Resolved"}
                variant={isResolved ? "secondary" : "primary"}
                icon={<CheckIcon color={isResolved ? "#006ec2" : "white"} size={24} />}
                iconPosition="right"
                onPress={async () => {
                  if (isResolved) return;
                  try {
                    const freshSession = await markHazardAsAssessed(data.id as number);
                    setIsResolved(true);
                    if (onResolved) onResolved(freshSession);
                  } catch (error) {
                    console.error("Failed to mark hazard as resolved:", error);
                  }
                }}
              />
            </View>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const HazardCard = ({
  hazards,
  imageUri,
  showResolutionAction = false,
  activeDisasterTab = "all",
  onResolved,
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
        <ActivityIndicator size="small" color="#0f172a" />
        <Text className="text-text-subtle mt-2">Loading hazards...</Text>
      </View>
    );
  }

  if (loadedHazards.length === 0) {
    return (
      <View className="bg-surface-light rounded-2xl p-8 items-center border-2 border-dashed border-border-secondary">
        <Text className="text-xl font-semibold text-gray-500 text-center">No Hazards Detected</Text>
        <Text className="text-base text-gray-400 text-center mt-2">
          This area appears to be safe based on the current scan.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-4">
      {loadedHazards.map((hazard) => (
        <HazardCardDesign
          key={hazard.id}
          data={hazard}
          imageUri={imageUri}
          showResolutionAction={showResolutionAction}
          activeDisasterTab={activeDisasterTab}
          onResolved={onResolved}
        />
      ))}
    </View>
  );
};

export default HazardCard;