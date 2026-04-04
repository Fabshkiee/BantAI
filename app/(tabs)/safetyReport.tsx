import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import RefreshIcon from "@/assets/icons/RefreshIcon";
import Button from "@/components/Button";
import HazardCard, { HazardData } from "@/components/HazardCard";
import HazardSortingButtons from "@/components/HazardSortingButons";
import MascotReporter from "@/components/MascotReporter";
import { hazardDictionary } from "@/hazardDictionary";
import { calculateRoomRisk, type Detection } from "@/lib/riskEngine";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SEVERITY_PRIORITY: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export default function SafetyReport() {
  const router = useRouter();
  const { imageUri, detections: detectionsJson } = useLocalSearchParams();

  const detections: Detection[] = detectionsJson
    ? JSON.parse(detectionsJson as string)
    : [];

  // 1. Map and Enrich Hazards using the Dictionary
  const mappedHazards: HazardData[] = [];
  for (let i = 0; i < detections.length; i++) {
    const d = detections[i];
    const dictId = `HAZARD_LABELS.${d.class.toUpperCase()}`;
    const entry = hazardDictionary.find((h) => h.id === dictId);

    const title = entry
      ? entry.title
      : d.class
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

    const variant = entry ? entry.default_severity : "low";

    mappedHazards.push({
      id: i.toString(),
      title: title,
      variant: variant as "low" | "medium" | "high" | "critical",
      reason:
        entry?.description ||
        `AI detected this hazard with ${(d.confidence * 100).toFixed(1)}% confidence.`,
      suggestedFix:
        entry?.fire_fixes?.[0] ||
        "Please inspect the area and resolve the hazard to ensure safety.",
      bbox: d.bbox,
    });
  }

  // 2. Sort by urgency (Priority)
  mappedHazards.sort(
    (a, b) =>
      (SEVERITY_PRIORITY[b.variant] || 0) - (SEVERITY_PRIORITY[a.variant] || 0),
  );

  const executeDatabaseSearch = (sqlCommand: string) => {};

  const { safetyScore, mascotVariant, spatialInsights } =
    calculateRoomRisk(detections);
  const insets = useSafeAreaInsets();

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
            onPress={() => router.replace("/history")}
          />
        </View>

        <View className="mx-7 gap-7">
          <View className="flex-1 justify-center items-center gap-4">
            <Text className="text-h2 font-bold text-center mt-14">
              Room Safety Report
            </Text>
            <View className="relative">
              <MascotReporter score={mascotVariant} value={safetyScore} />
            </View>
          </View>

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
              Identified Hazards ({mappedHazards.length})
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
              hazards={mappedHazards}
              imageUri={imageUri as string | undefined}
            />
          </View>

          <View className="w-full gap-4">
            <Button
              label="Rescan Room"
              onPress={() => router.replace("/camera")}
              icon={<RefreshIcon color="white" size={26} />}
            />
            <Button
              label="Back to Home"
              variant="secondary"
              onPress={() => router.replace("/")}
            />
          </View>
        </View>
      </Animated.View>
    </Animated.ScrollView>
  );
}
