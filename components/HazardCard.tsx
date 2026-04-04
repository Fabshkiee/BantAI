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

// Change to database connection
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
};

export interface HazardCardProps {
  hazards?: HazardData[];
  imageUri?: string;
  showResolutionAction?: boolean;
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
  onResolved,
}: {
  data: HazardData;
  imageUri?: string;
  showResolutionAction?: boolean;
  onResolved?: (updatedSession?: ScanSessionDetails | null) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isResolved, setIsResolved] = useState(data.isAssessed || false);

  useEffect(() => {
    setIsResolved(data.isAssessed || false);
  }, [data.isAssessed]);
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
          <View className="relative w-full h-64 mt-2 rounded-2xl overflow-hidden bg-gray-100 border border-border-secondary">
            {(() => {
              // Zoom logic: Calculate transform based on bbox
              const hasBbox = data.bbox && data.bbox.length === 4;
              let transformStyles = {};
              if (hasBbox) {
                const [x1, y1, x2, y2] = data.bbox!;
                const centerX = (x1 + x2) / 2;
                const centerY = (y1 + y2) / 2;
                const width = x2 - x1;
                const height = y2 - y1;
                // Calculate scale: we want the box to take up ~60% of the view height/width
                const scale = Math.min(
                  2.5,
                  Math.max(1, 0.6 / Math.max(width, height)),
                );
                // Calculate translation to center the bbox
                // (0.5 - center) * 100%
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
                    source={
                      imageUri
                        ? { uri: imageUri }
                        : require("@/assets/images/room.png")
                    }
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
                        borderColor:
                          data.variant === "critical"
                            ? "#b40000"
                            : data.variant === "high"
                              ? "#c56400"
                              : data.variant === "medium"
                                ? "#d89700"
                                : "#00ad14",
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                    >
                      {/* Risk Label Tag */}
                      <View
                        className="absolute -top-[18px] -left-[2px] px-1.5 py-0.5 rounded-t-sm"
                        style={{
                          backgroundColor:
                            data.variant === "critical"
                              ? "#b40000"
                              : data.variant === "high"
                                ? "#c56400"
                                : data.variant === "medium"
                                  ? "#d89700"
                                  : "#00ad14",
                          minWidth: 40,
                        }}
                      >
                        <Text
                          className="text-[9px] font-bold text-white text-center"
                          numberOfLines={1}
                          adjustsFontSizeToFit
                        >
                          {data.variant.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            })()}
          </View>

          <View>
            <Text className="text-xl font-semibold mb-2">Reason:</Text>
            <Text className="text-lg leading-6">{data.reason}</Text>
          </View>

          <View>
            <Text className="text-xl font-semibold mb-2">Suggested Fix:</Text>
            <Text className="text-lg leading-6">{data.suggestedFix}</Text>
          </View>

          {showResolutionAction ? (
            <View>
              <Button
                label={isResolved ? "Resolved" : "Mark as Resolved"}
                variant={isResolved ? "secondary" : "primary"}
                icon={<CheckIcon color={isResolved ? "black" : "white"} size={24} />}
                iconPosition="right"
                onPress={async () => {
                  if (isResolved) {
                    return;
                  }

                  try {
                    const freshSession = await markHazardAsAssessed(
                      data.id as number,
                    );
                    setIsResolved(true);
                    if (onResolved) onResolved(freshSession);
                  } catch (error) {
                    console.error("Failed to mark hazard as resolved:", error);
                  }
                }}
              />
            </View>
          ) : null}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const HazardCard = ({
  hazards,
  imageUri,
  showResolutionAction = false,
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
        <Text className="text-text-subtle">Loading hazards...</Text>
      </View>
    );
  }

  if (loadedHazards.length === 0) {
    return (
      <View className="bg-surface-light rounded-2xl p-8 items-center border-2 border-dashed border-border-secondary">
        <Text className="text-xl font-semibold text-gray-500">
          No Hazards Detected
        </Text>
        <Text className="text-base text-gray-400 text-center mt-2">
          This area appears to be safe based on the current AI scan.
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
          onResolved={onResolved}
        />
      ))}
    </View>
  );
};

export default HazardCard;
