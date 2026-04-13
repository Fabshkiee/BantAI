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
import i18n from "@/languages/i18n";
import { calculateRoomRisk, type Detection } from "@/lib/riskEngine";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SEVERITY_PRIORITY: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export default function SafetyReport() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLanguage(i18n.language);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

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

  const [showBoost, setShowBoost] = useState(false);
  const [boostScore, setBoostScore] = useState(0);
  const [oldBoostScore, setOldBoostScore] = useState(0);
  const [boostMessage, setBoostMessage] = useState("");
  const boostAnim = useRef(new Animated.Value(0)).current;

  const BOOST_MESSAGES = t("boost_messages.messages", {
    returnObjects: true,
  }) as string[];

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
      }, 2500);
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
          setLoadError(t("safety_report.saved_scan_unavailable"));
          return;
        }

        setSession(details);
      } catch (error) {
        setSession(null);
        setLoadError(t("safety_report.loading_scan"));
        console.error("Failed to load scan session:", error);
      } finally {
        if (!quiet) setIsLoadingSession(false);
      }
    },
    [hasSession, sessionId, t],
  );

  useEffect(() => {
    loadSession();
  }, [loadSession]);

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
      internalName: d.class,
      variant: variant as "low" | "medium" | "high" | "critical",
      reason:
        seed?.description ||
        entry?.description ||
        t("safety_report.fallback_reason", {
          confidence: (d.confidence * 100).toFixed(1),
        }),
      suggestedFix:
        seed?.recommendation ||
        entry?.fire_fixes?.[0] ||
        t("safety_report.fallback_fix"),
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

  mappedHazards.sort(
    (a, b) =>
      (SEVERITY_PRIORITY[b.variant] || 0) - (SEVERITY_PRIORITY[a.variant] || 0),
  );

  const {
    safetyScore: rawScore,
    mascotVariant: rawMascot,
    spatialInsights: rawInsights,
  } = calculateRoomRisk(detections);

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
    all: t("safety_report.context_all"),
    earthquake: t("safety_report.context_earthquake"),
    typhoon: t("safety_report.context_typhoon"),
    fire: t("safety_report.context_fire"),
  };

  const sortingContextMessage: Record<DisasterType | "all", string> = {
    earthquake: t("safety_report.sorting_message_earthquake"),
    typhoon: t("safety_report.sorting_message_typhoon"),
    fire: t("safety_report.sorting_message_fire"),
    all: t("safety_report.sorting_message_all"),
  };

  const handleUploadAnotherImage = useCallback(async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("common.permission_needed"),
          t("safety_report.upload_permission_message"),
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
        t("common.import_failed"),
        t("common.could_not_process_image"),
      );
    }
  }, [router, t]);

  const handleConfirmScanAnotherRoom = useCallback(() => {
    Alert.alert(
      t("safety_report.confirm_scan_title"),
      t("safety_report.confirm_scan_message"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("safety_report.confirm_scan_continue"),
          onPress: () => router.push("/camera"),
        },
      ],
    );
  }, [router, t]);

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        className="flex-1 mt-9 pb-56 mb-8 bg-surface-default"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-14"
        style={{ opacity: fadeAnim }}
      >
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <View className="absolute -top-9 left-0 right-0 px-6 pt-8 z-10 flex-row justify-between">
            <Button
              label={t("common.return")}
              variant="return"
              icon={<ArrowLeftIcon color="black" size={18} />}
              iconPosition="left"
              onPress={() => router.push("/history")}
            />
            <Button
              label={currentLanguage === "en" ? "TL" : "EN"}
              variant="secondary"
              className="w-16"
              onPress={() => {
                i18n.changeLanguage(currentLanguage === "en" ? "tl" : "en");
              }}
            />
          </View>

          <View className="mx-7 mt-7 gap-7">
            <View className="flex-1 justify-center items-center gap-4">
              <Text className="text-h2 font-bold text-center mt-14">
                {t("safety_report.title")}
              </Text>
              <View className="relative">
                <MascotReporter
                  score={finalRiskVariant}
                  value={finalRoomScore}
                />
              </View>
            </View>

            <Text className="text-text-subtle -mt-5 text-center text-sm">
              {t("safety_report.disclaimer")}
            </Text>

            {hasSession && loadError ? (
              <View className="rounded-2xl bg-surface-light px-4 py-3">
                <Text className="font-semibold">
                  {t("safety_report.saved_scan_unavailable")}
                </Text>
                <Text className="text-text-subtle mt-1">{loadError}</Text>
              </View>
            ) : null}

            {finalSpatialInsights && finalSpatialInsights.length > 0 && (
              <View className="bg-surface-critical/10 border border-surface-critical p-4 rounded-lg gap-2">
                <Text className="text-text-critical font-bold text-lg">
                  {t("safety_report.spatial_warnings_title")}
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
                {t("safety_report.identified_hazards", {
                  count: finalHazardCount,
                })}
              </Text>
              <Text className="text-lg">
                {t("safety_report.hazards_instruction")}
              </Text>
            </View>

            <View>
              <HazardSortingButtons
                tableName="test"
                onSortQueryChange={executeDatabaseSearch}
              />
              <View className="mt-3 rounded-xl bg-surface-light px-4 py-3 border border-border-light">
                <Text className="text-sm font-semibold text-text-default">
                  {t("safety_report.reason_context_label", {
                    context: activeContextLabel[activeDisasterTab],
                  })}
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
                    {t("safety_report.loading_scan")}
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
                label={t("safety_report.scan_another_room")}
                onPress={handleConfirmScanAnotherRoom}
                icon={<RefreshIcon color="white" size={26} />}
              />
              <Button
                label={t("safety_report.upload_another_image")}
                variant="secondary"
                onPress={handleUploadAnotherImage}
                icon={<PlusIcon color="#006ec2" size={24} />}
              />
              <Button
                label={t("common.back_to_home")}
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
