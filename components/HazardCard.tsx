import CheckIcon from "@/assets/icons/CheckIcon";
import CriticalRiskIcon from "@/assets/icons/CriticalRiskIcon";
import DropDownIcon from "@/assets/icons/DropDownIcon";
import HighRiskIcon from "@/assets/icons/HighRiskIcon";
import LowRiskIcon from "@/assets/icons/LowRiskIcon";
import MediumRiskIcon from "@/assets/icons/MediumRiskIcon";
import { fetchDataFromDB } from "@/db/db";
import React, { useEffect, useState } from "react";
import { Image, LayoutAnimation, Pressable, Text, View } from "react-native";
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
};

// MockData for example
const detectedHazards: HazardData[] = [
  {
    id: "risk-001",
    title: "Exposed Wiring",
    variant: "high",
    reason: "Frayed wires near water source.",
    suggestedFix: "Replace cable and route away from sink.",
  },
  {
    id: "risk-002",
    title: "Blocked Fire Exit",
    variant: "critical",
    reason: "Boxes stacked in front of the primary emergency door.",
    suggestedFix: "Move boxes to storage room immediately.",
  },
  {
    id: "risk-003",
    title: "Slippery Floor",
    variant: "low",
    reason: "Minor water spill near the cooler.",
    suggestedFix: "Wipe area with dry mop and place caution sign.",
  },
];

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
}: {
  data: HazardData;
  imageUri?: string;
}) {
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
                const scale = Math.min(2.5, Math.max(1, 0.6 / Math.max(width, height)));
                
                // Calculate translation to center the bbox
                // (0.5 - center) * 100%
                const translateX = (0.5 - centerX) * 100;
                const translateY = (0.5 - centerY) * 100;
                
                transformStyles = {
                  transform: [
                    { scale: scale },
                    { translateX: `${translateX}%` as any },
                    { translateY: `${translateY}%` as any },
                  ]
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
                          data.variant === "critical" ? "#b40000" : 
                          data.variant === "high" ? "#c56400" : 
                          data.variant === "medium" ? "#d89700" : "#00ad14",
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                    >
                      {/* Risk Label Tag */}
                      <View
                        className="absolute -top-[18px] -left-[2px] px-1.5 py-0.5 rounded-t-sm"
                        style={{
                          backgroundColor:
                            data.variant === "critical" ? "#b40000" : 
                            data.variant === "high" ? "#c56400" : 
                            data.variant === "medium" ? "#d89700" : "#00ad14",
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

export interface HazardCardProps {
  hazards?: HazardData[];
  imageUri?: string;
}

const HazardCard = ({ hazards: propHazards, imageUri }: HazardCardProps) => {
  const [hazards, setHazards] = useState<HazardData[]>(propHazards || []);

  useEffect(() => {
    if (propHazards) {
      setHazards(propHazards);
      return;
    }
    const fetchHazards = async () => {
      try {
        const data = await fetchDataFromDB();
        setHazards(data);
      } catch (error) {
        console.error("Failed to load hazards:", error);
      }
    };

    fetchHazards();
  }, [propHazards]);

  return (
    <View className="gap-4">
      {hazards.map((hazard) => (
        <HazardCardDesign key={hazard.id} data={hazard} imageUri={imageUri} />
      ))}
    </View>
  );
};

export default HazardCard;
