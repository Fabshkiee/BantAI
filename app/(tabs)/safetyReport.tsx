import RefreshIcon from "@/assets/icons/RefreshIcon";
import Button from "@/components/Button";
import HazardCard, { HazardData } from "@/components/HazardCard";
import HazardSortingButtons from "@/components/HazardSortingButons";
import MascotReporter from "@/components/MascotReporter";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { calculateRoomRisk } from "@/lib/riskEngine";

export interface Detection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
}

export default function SafetyReport() {
  const router = useRouter();
  const { imageUri, detections: detectionsJson } = useLocalSearchParams();

  const detections: Detection[] = detectionsJson
    ? JSON.parse(detectionsJson as string)
    : [];

  const mappedHazards: HazardData[] = detections.map((d, index) => {
    // Format the class name to be more readable
    const title = d.class
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Map confidence to variant
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
  const { safetyScore, mascotVariant } = calculateRoomRisk(detections);
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 pt-9 pb-56 bg-surface-default"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-20"
    >
      <View className="mx-7 gap-7">
        {/* Safety Report Header */}
        <View className="flex-1 justify-center items-center gap-4">
          <Text className="text-h2 font-bold text-center mt-10">
            Room Safety Report
          </Text>
          <View className="relative">
            <MascotReporter score={mascotVariant} value={safetyScore} />
          </View>
        </View>

        {/* No. of identified hazard and instructions */}
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
          {/* TO DO: define parameters */}
          <HazardSortingButtons
            tableName="test"
            onSortQueryChange={executeDatabaseSearch}
          />
        </View>

        {/* TO DO: modify hazard card to determine risks */}
        {/* Hazard Cards */}
        <View className="mt-7">
          <HazardCard
            hazards={mappedHazards.length > 0 ? mappedHazards : undefined}
            imageUri={imageUri as string | undefined}
          />
        </View>

        {/* Return Buttons */}
        <View className="w-full gap-4">
          <Button
            label="Rescan Room"
            onPress={() => {
              router.push("/camera");
            }}
            icon={<RefreshIcon color="white" size={26} />}
          />
          <Button
            label="Back to Home"
            variant="secondary"
            onPress={() => {
              router.push("/");
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
