import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import RefreshIcon from "@/assets/icons/RefreshIcon";
import Button from "@/components/Button";
import HazardCard, { HazardData } from "@/components/HazardCard";
import HazardSortingButtons from "@/components/HazardSortingButons";
import MascotReporter, { getRiskVariant } from "@/components/MascotReporter";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"; // Added useFocusEffect
import React, { useCallback, useRef } from "react";
import { Animated, Text, View } from "react-native";

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

  // 2. Room Score logic
  const roomScore = 15;
  const riskVariant = getRiskVariant(roomScore);

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
          <View className="flex-1 justify-center items-center gap-4">
            <Text className="text-h2 font-bold text-center mt-14">
              Room Safety Report
            </Text>
            <View className="relative">
              <MascotReporter score={riskVariant} value={roomScore} />
            </View>
          </View>

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
