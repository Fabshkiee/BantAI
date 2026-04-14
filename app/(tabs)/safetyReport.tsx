import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import RefreshIcon from "@/assets/icons/RefreshIcon";
import Button from "@/components/Button";
import HazardCard, { HazardData } from "@/components/HazardCard";
import HazardSortingButtons from "@/components/HazardSortingButons";
import MascotReporter, { getRiskVariant } from "@/components/MascotReporter";
import { getScanSessionDetails, type ScanSessionDetails } from "@/db/db";
import { HAZARD_TYPES, type DisasterType } from "@/db/hazards";
import { hazardDictionary } from "@/hazardDictionary";
import { calculateRoomRisk, type Detection } from "@/lib/riskEngine";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SEVERITY_PRIORITY: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const BOOST_MESSAGES = [
  "Risk Mitigated!",
  "Room Secured!",
  "Hazard Resolved!",
  "Safety Improved!",
  "BantAI Approved!",
  "Well done!",
];

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

  // Boost Animation State
  const [showBoost, setShowBoost] = useState(false);
  const [boostScore, setBoostScore] = useState(0);
  const [oldBoostScore, setOldBoostScore] = useState(0);
  const [boostMessage, setBoostMessage] = useState("");
  const boostAnim = useRef(new Animated.Value(0)).current;

  const triggerBoost = (newScore: number, oldScore: number) => {
    setBoostScore(newScore);
    setOldBoostScore(oldScore);
    setShowBoost(true);

    const msg =
      BOOST_MESSAGES[Math.floor(Math.random() * BOOST_MESSAGES.length)];
    setBoostMessage(msg);

    Animated.timing(boostAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(boostAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setShowBoost(false);
        });
      }, 2500); // Dwell time for the score climb and message
    });
  };

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
    const seed = HAZARD_TYPES.find((h) => h.name === d.class);

    const title = entry
      ? entry.title
      : d.class
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

    const baseVariant = (entry ? entry.default_severity : "low") as
      | "low"
      | "medium"
      | "high"
      | "critical";
    const variant = baseVariant;

    const disasterTypes = Array.from(
      new Set<DisasterType>([
        ...(seed?.disasterTypes ?? []),
        ...(entry?.disaster_filters ?? []),
        ...(entry?.highest_risk_disaster ? [entry.highest_risk_disaster] : []),
      ]),
    );

    mappedHazards.push({
      id: i.toString(),
      title: title,
      variant: variant as "low" | "medium" | "high" | "critical",
      reason:
        seed?.description ||
        entry?.description ||
        `AI detected this hazard with ${(d.confidence * 100).toFixed(1)}% confidence.`,
      suggestedFix:
        seed?.recommendation ||
        entry?.fire_fixes?.[0] ||
        "Please inspect the area and resolve the hazard to ensure safety.",
      disasterTypes,
      earthquake_reason: entry?.earthquake_reason,
      typhoon_reason: entry?.typhoon_reason,
      fire_reason: entry?.fire_reason,
      earthquake_fixes: entry?.earthquake_fixes,
      typhoon_fixes: entry?.typhoon_fixes,
      fire_fixes: entry?.fire_fixes,
      general_reason: entry?.general_reason,
      general_fixes: entry?.general_fixes,
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

  const activeContextLabel: Record<DisasterType | "all", string> = {
    all: "All Hazards",
    earthquake: "Earthquake",
    typhoon: "Typhoon",
    fire: "Fire",
  };

  const sortingContextMessage: Record<DisasterType | "all", string> = {
    earthquake:
      "You are viewing earthquake-focused cards. Each reason and suggested solution explains the earthquake safety context of the hazard.",
    typhoon:
      "You are viewing typhoon-focused cards. Each reason and suggested solution explains the typhoon safety context of the hazard.",
    fire: "You are viewing fire-focused cards. Each reason and suggested solution explains the fire safety context of the hazard.",
    all: "You are viewing all hazards. Reasons and suggested sollutions are based on each hazard's most critical risk evaluation.",
  };

  const handleUploadAnotherImage = useCallback(async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Needed",
          "We need gallery permissions to select a photo.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const uri = result.assets[0]?.uri;
      if (!uri) {
        throw new Error("Selected image does not include a URI.");
      }

      router.replace({
        pathname: "/loadingScreen",
        params: { imageUri: uri },
      });
    } catch (error) {
      console.error("Failed to import image:", error);
      Alert.alert(
        "Import failed",
        "We could not process that image. Please try again.",
      );
    }
  }, [router]);

  const handleConfirmScanAnotherRoom = useCallback(() => {
    Alert.alert(
      "Scan another room?",
      "Your current report will stay in history. Continue to camera?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          onPress: () => router.push("/camera"),
        },
      ],
    );
  }, [router]);

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        className="flex-1 mt-9 pb-56 mb-8 bg-surface-default"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-14"
        style={{ opacity: fadeAnim }}
      >
        <Animated.View style={{ flex: 1 }}>
          <View className="flex flex-row items-center ml-6">
            <Button
              label=""
              variant="return"
              icon={<ArrowLeftIcon color="black" size={18} />}
              iconPosition="left"
              onPress={() => router.push("/scans")}
            />
            <Text className="text-h3 font-bold text-center -ml-2">
              Safety Report
            </Text>
          </View>

          <View className="mx-7 mt-7 gap-7">
            <View className="flex-1 justify-center items-center gap-4">
              <View className="relative">
                <MascotReporter
                  score={finalRiskVariant}
                  value={finalRoomScore}
                />
              </View>
            </View>

            <Text className="text-text-default -mt-5 text-center text-md">
              BantAI scans provide directional and informational guidance.
              Results are purely advisory and each must be validated by your own
              physical inspection.
            </Text>

            {hasSession && loadError ? (
              <View className="rounded-lg bg-surface-light px-4 py-3">
                <Text className="font-semibold">Saved scan unavailable</Text>
                <Text className="text-text-subtle mt-1">{loadError}</Text>
              </View>
            ) : null}

            {finalSpatialInsights && finalSpatialInsights.length > 0 && (
              <View className="bg-surface-critical/10 border border-surface-critical p-4 rounded-lg gap-2">
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
              <Text className="text-2xl font-bold mt-10 mb-5">
                Captured Image
              </Text>
              <View
                className="w-full rounded-lg"
                style={{ overflow: "hidden", aspectRatio: 4 / 3 }}
              >
                {/* Change to the uploaded image in the db*/}
                <Image
                  source={require("@/assets/images/room.png")}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-2xl font-bold mb-1">
                Identified Hazards ({finalHazardCount})
              </Text>
              <Text className="text-lg">
                After assessing each hazard, apply the recommended solution, and
                press the 'Mark as Resolved' button once finished.
              </Text>
            </View>

            <View className="-mt-6">
              <View className="mb-5">
                <HazardSortingButtons
                  tableName="test"
                  onSortQueryChange={executeDatabaseSearch}
                />
              </View>

              <View className=" rounded-lg bg-surface-default px-5 py-3 border border-border-secondary">
                <Text className="text-md font-semibold text-text-default">
                  Reason & Solution Context:{" "}
                  {activeContextLabel[activeDisasterTab]}
                </Text>
                <Text className="text-md text-text-subtle mt-2 leading-5">
                  {sortingContextMessage[activeDisasterTab]}
                </Text>
              </View>
            </View>

            <View>
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
                  activeDisasterTab={activeDisasterTab}
                  onResolved={(updatedSession) => {
                    if (updatedSession) {
                      const oldScore = session?.roomScore ?? finalRoomScore;
                      setSession(updatedSession);
                      const nextScore = updatedSession.roomScore || 0;
                      if (nextScore > oldScore) {
                        triggerBoost(nextScore, oldScore);
                      }
                    } else {
                      loadSession(true);
                    }
                  }}
                />
              )}
            </View>

            <View className="w-full gap-3">
              <Button
                label="Scan Another Room"
                onPress={handleConfirmScanAnotherRoom}
                icon={<RefreshIcon color="white" size={26} />}
              />
              <Button
                label="Upload Another Image"
                variant="secondary"
                onPress={handleUploadAnotherImage}
                icon={<PlusIcon color="#006ec2" size={24} />}
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

      {showBoost && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.7)",
            alignItems: "center",
            justifyContent: "center",
            opacity: boostAnim,
          }}
        >
          <Animated.View
            style={{
              transform: [
                {
                  scale: boostAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 0.85],
                  }),
                },
              ],
            }}
          >
            <MascotReporter
              value={boostScore}
              initialValue={oldBoostScore}
              score={getRiskVariant(boostScore)}
              hideStatus={false}
            />
            <View className="bg-surface-default px-10 py-4 rounded-full mt-10 shadow-2xl border-[3px] border-text-low">
              <Text className="text-text-low font-bold text-3xl text-center">
                {boostMessage} +{Math.max(0, boostScore - oldBoostScore)}
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}
