import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import RefreshIcon from "@/assets/icons/RefreshIcon";
import Button from "@/components/Button";
import HazardCard, { HazardData } from "@/components/HazardCard";
import HazardSortingButtons from "@/components/HazardSortingButons";
import MascotReporter, { getRiskVariant } from "@/components/MascotReporter";
import { getScanSessionDetails, type ScanSessionDetails } from "@/db/db";
import { type DisasterType } from "@/db/hazards";
import { hazardDictionary } from "@/hazardDictionary";
import { calculateRoomRisk, type Detection } from "@/lib/riskEngine";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SEVERITY_PRIORITY: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export default function SafetyReport() {
  const router = useRouter();
  const {
    imageUri,
    detections: detectionsJson,
    sessionId: sessionIdParam,
  } = useLocalSearchParams();

  const detections: Detection[] = detectionsJson
    ? JSON.parse(detectionsJson as string)
    : [];

  const sessionIdValue = Array.isArray(sessionIdParam)
    ? sessionIdParam[0]
    : sessionIdParam;
  const sessionId = sessionIdValue ? Number(sessionIdValue) : null;
  const hasSession =
    Number.isFinite(sessionId ?? Number.NaN) && (sessionId ?? 0) > 0;

  const [session, setSession] = useState<ScanSessionDetails | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(hasSession);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeDisasterTab, setActiveDisasterTab] = useState<
    DisasterType | "all"
  >("all");

  const executeDatabaseSearch = (_sqlCommand: string, filterId: string) => {
    setActiveDisasterTab(filterId as DisasterType | "all");
  };
  const loadSession = useCallback(
    async (quiet = false) => {
      if (!hasSession || sessionId === null) {
        setSession(null);
        setIsLoadingSession(false);
        setLoadError(null);
        return;
      }

      try {
        if (!quiet) setIsLoadingSession(true);
        setLoadError(null);

        const details = await getScanSessionDetails(sessionId);
        if (!details) {
          setSession(null);
          setLoadError("We could not find that saved scan.");
          return;
        }

        setSession(details);
      } catch (error) {
        setSession(null);
        setLoadError("We could not load the saved scan details.");
        console.error("Failed to load scan session:", error);
      } finally {
        if (!quiet) setIsLoadingSession(false);
      }
    },
    [hasSession, sessionId],
  );

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // 1. Map and Enrich Hazards using the Dictionary (Fallback if NO session)
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

  const {
    safetyScore: rawScore,
    mascotVariant: rawMascot,
    spatialInsights: rawInsights,
  } = calculateRoomRisk(detections);

  // Derive current session risk state (for spatial insights)
  const sessionDetections: Detection[] = (session?.hazards ?? [])
    .filter((h) => !h.isAssessed)
    .map((h) => ({
      class: h.internalName || "",
      bbox: h.bbox || [0, 0, 0, 0],
      confidence: 1.0,
    }));

  const { spatialInsights: sessionInsights } =
    calculateRoomRisk(sessionDetections);

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

  const finalRoomScore = session?.roomScore ?? rawScore ?? 15;
  const finalRiskVariant = hasSession
    ? getRiskVariant(finalRoomScore)
    : rawMascot;
  const finalHazards = (
    hasSession ? (session?.hazards ?? []) : mappedHazards
  ) as HazardData[];

  const finalHazardCount = finalHazards.length;
  const finalSpatialInsights = hasSession ? sessionInsights : rawInsights;
  const finalImageUri = hasSession ? session?.photoPath : imageUri;

  const filteredHazards = (
    finalHazards
      ? activeDisasterTab === "all"
        ? finalHazards
        : (finalHazards as HazardData[]).filter((h) =>
            h.disasterTypes?.includes(activeDisasterTab),
          )
      : []
  ).sort(
    (a, b) =>
      (SEVERITY_PRIORITY[b.variant] || 0) - (SEVERITY_PRIORITY[a.variant] || 0),
  );

  return (
    <Animated.ScrollView
      className="flex-1 mt-9 pb-56 mb-14 bg-surface-default"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-14"
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View className="absolute -top-9 left-0 px-6 pt-8 z-10">
          <Button
            label="Return"
            variant="return"
            icon={<ArrowLeftIcon color="black" size={18} />}
            iconPosition="left"
            onPress={() => router.push("/history")}
          />
        </View>

        <View className="mx-7 gap-7">
          <View className="flex-1 justify-center items-center gap-4">
            <Text className="text-h2 font-bold text-center mt-14">
              Room Safety Report
            </Text>
            <View className="relative">
              <MascotReporter score={finalRiskVariant} value={finalRoomScore} />
            </View>
          </View>

          {hasSession && loadError ? (
            <View className="rounded-2xl bg-surface-light px-4 py-3">
              <Text className="font-semibold">Saved scan unavailable</Text>
              <Text className="text-text-subtle mt-1">{loadError}</Text>
            </View>
          ) : null}

          {finalSpatialInsights && finalSpatialInsights.length > 0 && (
            <View className="bg-surface-critical/10 border border-surface-critical p-4 rounded-xl gap-2">
              <Text className="text-text-critical font-bold text-lg">
                ⚠️ Spatial Warnings
              </Text>
              {finalSpatialInsights.map((insight: string, idx: number) => (
                <Text key={idx} className="text-text-default text-base">
                  • {insight}
                </Text>
              ))}
            </View>
          )}

          <View>
            <Text className="text-2xl font-bold mt-10 mb-1">
              Identified Hazards ({finalHazardCount})
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
            {hasSession && isLoadingSession ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color="#0f172a" />
                <Text className="text-text-subtle mt-4">
                  Loading saved scan details...
                </Text>
              </View>
            ) : (
              <HazardCard
                hazards={filteredHazards as HazardData[]}
                imageUri={finalImageUri as string | undefined}
                showResolutionAction={hasSession}
                onResolved={() => loadSession(true)}
              />
            )}
          </View>

          <View className="w-full gap-4">
            <Button
              label="Rescan Room"
              onPress={() => router.push("/camera")}
              icon={<RefreshIcon color="white" size={26} />}
            />
            <Button
              label="Back to Home"
              variant="secondary"
              onPress={() => router.push("/")}
            />
          </View>
        </View>
      </Animated.View>
    </Animated.ScrollView>
  );
}
