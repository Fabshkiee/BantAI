import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import RefreshIcon from "@/assets/icons/RefreshIcon";
import Button from "@/components/Button";
import HazardCard, { HazardData } from "@/components/HazardCard";
import HazardSortingButtons from "@/components/HazardSortingButons";
import MascotReporter from "@/components/MascotReporter";
import { calculateRoomRisk } from "@/lib/riskEngine";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface Detection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
}

export default function SafetyReport() {
  const router = useRouter();
  const { imageUri, detections: detectionsJson } = useLocalSearchParams();

  // 1. Logic for parsing and mapping hazards
  const detections: Detection[] = detectionsJson
    ? JSON.parse(detectionsJson as string)
    : [];

  const mappedHazards: HazardData[] = detections.map((d, index) => {
    const title = d.class
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    let variant: "low" | "medium" | "high" | "critical" = "low";
    if (d.confidence >= 0.8) variant = "critical";
    else if (d.confidence >= 0.6) variant = "high";
    else if (d.confidence >= 0.4) variant = "medium";
    else variant = "low";

    return {
      id: index,
      title: title,
      variant: variant,
      reason: `AI detected this hazard with ${(d.confidence * 100).toFixed(1)}% confidence.`,
      suggestedFix:
        "Please inspect the area and resolve the hazard to ensure safety.",
      bbox: d.bbox,
    };
  });

  const executeDatabaseSearch = (sqlCommand: string) => {};

  // Calculate the actual room score and variant using the new Risk Engine
  const { safetyScore, mascotVariant, spatialInsights } =
    calculateRoomRisk(detections);
  const insets = useSafeAreaInsets();

  // 3. Animation logic (Using useFocusEffect from master to ensure it runs on every view)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]),
  );

  return (
    <Animated.ScrollView
      className="flex-1 mt-9 pb-56 mb-14 bg-surface-default"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-14"
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View className="absolute -top-9 left-0 px-6 pt-8">
          <Button
            label="Return"
            variant="return"
            icon={<ArrowLeftIcon color="black" size={18} />}
            iconPosition="left"
            onPress={() => {
              router.replace("/history");
            }}
          />
        </View>

        <View className="mx-7 gap-7">
          {/* Safety Report Header */}
          <View className="flex-1 justify-center items-center gap-4">
            <Text className="text-h2 font-bold text-center mt-14">
              Room Safety Report
            </Text>
            <View className="relative">
              <MascotReporter score={mascotVariant} value={safetyScore} />
            </View>
          </View>

          {/* Spatial Insights / Warning Section */}
          {spatialInsights.length > 0 && (
            <View className="bg-surface-critical/10 border border-surface-critical p-4 rounded-xl gap-2">
              <Text className="text-text-critical font-bold text-lg">
                ⚠️ Spatial Warnings
              </Text>
              {spatialInsights.map((insight, idx) => (
                <Text key={idx} className="text-text-default text-base">
                  • {insight}
                </Text>
              ))}
            </View>
          )}

          <View>
            <Text className="text-2xl font-bold mt-10 mb-1">
              Identified Hazards (
              {mappedHazards.length > 0 ? mappedHazards.length : 3})
            </Text>
            <Text className="text-lg">
              After assessing each hazard, apply the recommended fix, and press
              the hazard assessed button once finished.
            </Text>
          </View>

          <View>
            <HazardSortingButtons
              tableName="test"
              onSortQueryChange={executeDatabaseSearch}
            />
          </View>

          <View className="mt-7">
            <HazardCard
              hazards={mappedHazards.length > 0 ? mappedHazards : undefined}
              imageUri={imageUri as string | undefined}
            />
          </View>

          <View className="w-full gap-4">
            <Button
              label="Rescan Room"
              onPress={() => {
                router.replace("/camera");
              }}
              icon={<RefreshIcon color="white" size={26} />}
            />
            <Button
              label="Back to Home"
              variant="secondary"
              onPress={() => {
                router.replace("/");
              }}
            />
          </View>
        </View>
      </Animated.View>
    </Animated.ScrollView>
  );
}
