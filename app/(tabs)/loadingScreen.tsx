import ProgressBar from "@/components/ProgressBar";
import { useTFLite } from "@/hooks/useTFLite";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";

export default function LoadingScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams();
  const { modelLoaded, runInference } = useTFLite();
  const [progressIndex, setProgressIndex] = useState(0);

  useEffect(() => {
    async function performAnalysis() {
      if (!modelLoaded || !imageUri) return;

      try {
        // Step 1: Initializing (index 0)
        setProgressIndex(0);
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Step 2: Detecting layout (index 1)
        setProgressIndex(1);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Step 3: Analyzing (index 2) - ACTUAL inference here
        setProgressIndex(2);
        const detections = await runInference(imageUri as string);

        // Step 4: Generating report (index 3)
        setProgressIndex(3);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Step 5: Complete! (index 4)
        setProgressIndex(4);
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Navigate to Safety Report
        router.push({
          pathname: "/safetyReport",
          params: {
            imageUri: imageUri,
            detections: JSON.stringify(detections),
          },
        });
      } catch (error) {
        console.error("Analysis failed:", error);
        // Fallback to safety report even if inference fails to show empty state/error
        router.push("/safetyReport");
      }
    }

    performAnalysis();
  }, [modelLoaded, imageUri, runInference, router]);

  return (
    <View className="flex-1 bg-surface-default px-8 pt-44">
      {/* Mascot image */}
      <View className="flex justify-center items-center mr-3 mb-4">
        <Image
          source={require("@/assets/mascot/MascotSearch.png")}
          resizeMode="contain"
          className="w-72 h-72"
        />
      </View>

      {/* Progress Bar component */}
      <ProgressBar index={progressIndex} />
    </View>
  );
}
