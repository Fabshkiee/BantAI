import ProgressBar from "@/components/ProgressBar";
import { createScanSession, insertDetectedHazards } from "@/db/db";
import { useTFLite } from "@/hooks/useTFLite";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, View } from "react-native";

/** Maps SAHI slice progress to user-facing status messages */
function getStatusText(progress: number): string {
  if (progress < 0.05) return "Initializing AI engine...";
  if (progress < 0.12) return "Running global scan...";
  if (progress < 0.55) return "Scanning room quadrants...";
  if (progress < 0.85) return "Analyzing hazard details...";
  if (progress < 0.95) return "Generating safety report...";
  return "Analysis Complete!";
}



export default function LoadingScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams();
  const { modelLoaded, runInference } = useTFLite();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing AI engine...");
  const cancelRequestedRef = useRef(false);

  const handleCancelAnalysis = useCallback(() => {
    cancelRequestedRef.current = true;
    router.back();
  }, [router]);

  useEffect(() => {
    cancelRequestedRef.current = false;

    async function performAnalysis() {
      if (!modelLoaded) return;

      const primaryUri = Array.isArray(imageUri) ? imageUri[0] : imageUri;

      if (!primaryUri) return;

      try {
        if (cancelRequestedRef.current) return;

        const inferenceUri = primaryUri;

        if (cancelRequestedRef.current) return;

        // Phase 1: Init (0% -> 5%)
        setProgress(0.05);
        setStatusText(getStatusText(0.05));
        await new Promise((resolve) => setTimeout(resolve, 400));

        if (cancelRequestedRef.current) return;

        // Phase 2: Primary Inference
        const detections = await runInference(inferenceUri, (step, total) => {
          if (cancelRequestedRef.current) return;
          const inferenceProgress = 0.05 + (step / total) * 0.8;
          setProgress(inferenceProgress);
          setStatusText(getStatusText(inferenceProgress));
        });

        if (cancelRequestedRef.current) return;

        // Phase 3: Saving to database (85% -> 95%)
        setProgress(0.9);
        setStatusText("Generating safety report...");
        const sessionId = await createScanSession(inferenceUri);
        await insertDetectedHazards(sessionId, detections);

        if (cancelRequestedRef.current) return;

        // Phase 4: Complete (100%)
        setProgress(1);
        setStatusText("Analysis Complete!");
        await new Promise((resolve) => setTimeout(resolve, 400));

        if (cancelRequestedRef.current) return;

        // Navigate to Safety Report
        router.replace({
          pathname: "/safetyReport",
          params: {
            sessionId: String(sessionId),
            imageUri: inferenceUri,
            detections: JSON.stringify(detections),
          },
        });
      } catch (error) {
        console.error("Analysis failed:", error);
        if (!cancelRequestedRef.current) {
          router.replace("/safetyReport");
        }
      }
    }

    performAnalysis();

    return () => {
      cancelRequestedRef.current = true;
    };
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

      {/* Progress Bar — driven by real SAHI inference progress */}
      <ProgressBar
        progress={progress}
        statusText={statusText}
        onCancel={handleCancelAnalysis}
      />
    </View>
  );
}
