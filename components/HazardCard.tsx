import CheckIcon from "@/assets/icons/CheckIcon";
import CriticalRiskIcon from "@/assets/icons/CriticalRiskIcon";
import DropDownIcon from "@/assets/icons/DropDownIcon";
import HighRiskIcon from "@/assets/icons/HighRiskIcon";
import LowRiskIcon from "@/assets/icons/LowRiskIcon";
import MediumRiskIcon from "@/assets/icons/MediumRiskIcon";
import {
  fetchDataFromDB,
  markHazardAsAssessed,
  markHazardAsUnassessed,
  type ScanSessionDetails,
} from "@/db/db";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
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
  general_reason?: string;
  general_fixes?: string[];
  bbox?: [number, number, number, number];
  isAssessed?: boolean;
  internalName?: string;
  disasterTypes?: string[];
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
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isResolved, setIsResolved] = useState(data.isAssessed || false);
  const [isTogglingResolution, setIsTogglingResolution] = useState(false);
  const rotation = useSharedValue(0);

  useEffect(() => {
    setIsResolved(data.isAssessed || false);
  }, [data.isAssessed]);

  const internalKey = data.internalName?.toLowerCase() || "unknown";
  const capitalizedDisaster =
    activeDisasterTab.charAt(0).toUpperCase() + activeDisasterTab.slice(1);

  // --- DYNAMIC TRANSLATION LOGIC FOR REASON ---
  let displayedReason = "";
  if (activeDisasterTab === "all") {
    displayedReason = t(`hazard_content.${internalKey}.general_reason`, {
      defaultValue: data.general_reason || data.reason,
    });
  } else {
    const fallbackReason =
      (data[`${activeDisasterTab}_reason` as keyof HazardData] as string) || "";
    const specificReason = t(
      `hazard_content.${internalKey}.${activeDisasterTab}_reason`,
      { defaultValue: fallbackReason },
    );
    displayedReason =
      specificReason ||
      t("hazard_card.reason_unavailable", { disaster: capitalizedDisaster });
  }

  // --- DYNAMIC TRANSLATION LOGIC FOR FIXES (ARRAYS) ---
  let fixes: string[] = [];
  if (activeDisasterTab === "all") {
    const defaultGeneralFixes =
      data.general_fixes && data.general_fixes.length > 0
        ? data.general_fixes
        : [data.suggestedFix];

    const transGeneralFixes = t(`hazard_content.${internalKey}.general_fixes`, {
      returnObjects: true,
      defaultValue: defaultGeneralFixes,
    }) as string | string[];

    fixes = Array.isArray(transGeneralFixes)
      ? transGeneralFixes
      : [transGeneralFixes];
  } else {
    const defaultSpecificFixes =
      (data[`${activeDisasterTab}_fixes` as keyof HazardData] as string[]) ||
      [];

    const transSpecificFixes = t(
      `hazard_content.${internalKey}.${activeDisasterTab}_fixes`,
      {
        returnObjects: true,
        defaultValue: defaultSpecificFixes,
      },
    ) as string | string[];

    const parsedFixes = Array.isArray(transSpecificFixes)
      ? transSpecificFixes
      : [transSpecificFixes];

    fixes =
      parsedFixes.length > 0 && parsedFixes[0] !== ""
        ? parsedFixes
        : [t("hazard_card.fix_unavailable", { disaster: capitalizedDisaster })];
  }

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
      className="bg-surface-light rounded-lg flex-col shadow-sm border border-border-secondary p-4 overflow-hidden"
    >
      <Pressable className="flex-row items-center gap-4" onPress={toggleExpand}>
        {riskIcons[data.variant]}
        <Text
          className="text-2xl leading-7 font-semibold flex-1 pr-2"
          numberOfLines={2}
        >
          {t(`hazard_titles.${internalKey}`, { defaultValue: data.title })}
        </Text>

        <View className="flex-row items-center gap-3">
          {riskStatus[data.variant]}
          <Animated.View
            style={{ transform: [{ rotate: `${isExpanded ? 180 : 0}deg` }] }}
          >
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
                const scale = Math.min(
                  2.5,
                  Math.max(1, 0.6 / Math.max(width, height)),
                );
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
                  {hasBbox &&
                    (() => {
                      const bboxColor =
                        data.variant === "critical"
                          ? "#b40000"
                          : data.variant === "high"
                            ? "#c56400"
                            : data.variant === "medium"
                              ? "#d89700"
                              : "#00ad14";
                      const severityLabel =
                        data.variant.charAt(0).toUpperCase() +
                        data.variant.slice(1);
                      const bboxW = (data.bbox![2] - data.bbox![0]) * 100;
                      const bboxH = (data.bbox![3] - data.bbox![1]) * 100;
                      const fontSize = Math.max(
                        7,
                        Math.min(14, Math.min(bboxW, bboxH) * 0.3),
                      );
                      return (
                        <>
                          <View
                            style={{
                              position: "absolute",
                              left: `${data.bbox![0] * 100}%`,
                              top: `${
                                data.bbox![1] * 100 - (fontSize + 6) / 2.56
                              }%`,
                              backgroundColor: bboxColor,
                              paddingHorizontal: 4,
                              paddingVertical: 1,
                              borderRadius: 2,
                              zIndex: 10,
                            }}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontSize,
                                fontWeight: "700",
                              }}
                            >
                              {severityLabel}
                            </Text>
                          </View>
                          <View
                            className="absolute border-[2.5px]"
                            style={{
                              left: `${data.bbox![0] * 100}%`,
                              top: `${data.bbox![1] * 100}%`,
                              width: `${bboxW}%`,
                              height: `${bboxH}%`,
                              borderColor: bboxColor,
                              backgroundColor: "rgba(255,255,255,0.05)",
                            }}
                          />
                        </>
                      );
                    })()}
                </View>
              );
            })()}
          </View>

          <View>
            <Text className="text-xl font-semibold mb-2 text-text-default">
              {t("hazard_card.reason_label")}
            </Text>
            <Text className="text-lg leading-6 text-text-default">
              {displayedReason}
            </Text>
          </View>

          <View>
            <Text className="text-xl font-semibold mb-2 text-text-default">
              {t("hazard_card.fixes_label")}
            </Text>
            {fixes.map((fix, index) => (
              <View key={index} className="flex-row gap-2 mb-2">
                <Text className="text-lg font-bold text-text-default">
                  {index + 1}.
                </Text>
                <Text className="text-lg flex-1 text-text-default">{fix}</Text>
              </View>
            ))}
          </View>

          {showResolutionAction && (
            <View>
              <Button
                label={
                  isResolved
                    ? t("hazard_card.unmark_resolved")
                    : t("hazard_card.mark_resolved")
                }
                variant={isResolved ? "cancel" : "primary"}
                icon={
                  <CheckIcon
                    color={isResolved ? "#b40000" : "white"}
                    size={24}
                  />
                }
                iconPosition="right"
                loading={isTogglingResolution}
                onPress={async () => {
                  if (isTogglingResolution) return;
                  try {
                    setIsTogglingResolution(true);
                    const freshSession = isResolved
                      ? await markHazardAsUnassessed(data.id as number)
                      : await markHazardAsAssessed(data.id as number);
                    setIsResolved(!isResolved);
                    if (onResolved) onResolved(freshSession);
                  } catch (error) {
                    console.error("Failed to update hazard resolution:", error);
                  } finally {
                    setIsTogglingResolution(false);
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
  const { t } = useTranslation();
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
        <Text className="text-text-subtle mt-2">
          {t("hazard_card.loading")}
        </Text>
      </View>
    );
  }

  if (loadedHazards.length === 0) {
    return (
      <View className="bg-surface-light rounded-lg p-8 items-center border-2 border-dashed border-border-secondary">
        <Text className="text-xl font-semibold text-gray-500 text-center">
          {t("hazard_card.no_hazards_title")}
        </Text>
        <Text className="text-base text-gray-400 text-center mt-2">
          {t("hazard_card.no_hazards_message")}
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
