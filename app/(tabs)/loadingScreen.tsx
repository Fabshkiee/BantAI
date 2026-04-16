import ProgressBar from "@/components/ProgressBar";
import { createScanSession, insertDetectedHazards } from "@/db/db";
import { useTFLite } from "@/hooks/useTFLite";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, View } from "react-native";

/** Maps SAHI slice progress to user-facing status messages */
function getStatusText(progress: number, t: any): string {
  if (progress < 0.05) return t("loading_screen.status_init");
  if (progress < 0.15) return t("loading_screen.status_global");
  if (progress < 0.5) return t("loading_screen.status_quadrants");
  if (progress < 0.8) return t("loading_screen.status_details");
  if (progress < 0.95) return t("loading_screen.status_report");
  return t("loading_screen.status_complete");
}

async function getImageSize(
  uri: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    Image.getSize(uri, (width, height) => resolve({ width, height }), reject);
  });
}

async function normalizeCaptureForInference(uri: string): Promise<string> {
  const { width, height } = await getImageSize(uri);
  if (width >= height) {
    return uri;
  }

  const rotated = await manipulateAsync(uri, [{ rotate: 90 }], {
    format: SaveFormat.JPEG,
    compress: 1,
  });
  console.log(
    `Normalized portrait capture to landscape for inference (${width}x${height}).`,
  );
  return rotated.uri;
}

export default function LoadingScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams();
  const { modelLoaded, runInference } = useTFLite();
  const [progress, setProgress] = useState(0);
  const cancelRequestedRef = useRef(false);
  const { t } = useTranslation();

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

        let inferenceUri = primaryUri;
        try {
          inferenceUri = await normalizeCaptureForInference(primaryUri);
        } catch (normalizationError) {
          console.warn(
            "Image normalization failed, using original photo:",
            normalizationError,
          );
        }

        if (cancelRequestedRef.current) return;

        // Phase 1: Init (0% to 5%)
        setProgress(0.05);
        await new Promise((resolve) => setTimeout(resolve, 400));

        if (cancelRequestedRef.current) return;

        // Phase 2: Primary Inference
        const detections = await runInference(inferenceUri, (step, total) => {
          if (cancelRequestedRef.current) return;
          const inferenceProgress = 0.05 + (step / total) * 0.8;
          setProgress(inferenceProgress);
        });

        if (cancelRequestedRef.current) return;

        // Phase 3: Saving to database (85% to 95%)
        setProgress(0.9);
        const sessionId = await createScanSession(inferenceUri);
        await insertDetectedHazards(sessionId, detections);

        if (cancelRequestedRef.current) return;

        // Phase 4: Complete (100%)
        setProgress(1);
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

  const statusText = getStatusText(progress, t);

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

      {/* Progress Bar driven by real SAHI inference progress */}
      <ProgressBar
        progress={progress}
        statusText={statusText}
        onCancel={handleCancelAnalysis}
      />
    </View>
  );
}
