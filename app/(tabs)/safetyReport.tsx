import RefreshIcon from "@/assets/icons/RefreshIcon";
import Button from "@/components/Button";
import HazardCard from "@/components/HazardCard";
import HazardSortingButtons from "@/components/HazardSortingButons";
import MascotReporter, { getRiskVariant } from "@/components/MascotReporter";
import { getScanSessionDetails, type ScanSessionDetails } from "@/db/db";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function SafetyReport() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sessionId?: string | string[] }>();
  const sessionIdValue = Array.isArray(params.sessionId)
    ? params.sessionId[0]
    : params.sessionId;
  const sessionId = sessionIdValue ? Number(sessionIdValue) : null;
  const hasSession =
    Number.isFinite(sessionId ?? Number.NaN) && (sessionId ?? 0) > 0;

  const [session, setSession] = useState<ScanSessionDetails | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(hasSession);
  const [loadError, setLoadError] = useState<string | null>(null);

  const executeDatabaseSearch = () => {
    // Sorting buttons are still placeholder UI in this screen.
  };

  useEffect(() => {
    if (!hasSession || sessionId === null) {
      setSession(null);
      setIsLoadingSession(false);
      setLoadError(null);
      return;
    }

    let isActive = true;

    const loadSession = async () => {
      try {
        setIsLoadingSession(true);
        setLoadError(null);

        const details = await getScanSessionDetails(sessionId);
        if (!isActive) {
          return;
        }

        if (!details) {
          setSession(null);
          setLoadError("We could not find that saved scan.");
          return;
        }

        setSession(details);
      } catch (error) {
        if (isActive) {
          setSession(null);
          setLoadError("We could not load the saved scan details.");
        }
        console.error("Failed to load scan session:", error);
      } finally {
        if (isActive) {
          setIsLoadingSession(false);
        }
      }
    };

    loadSession();

    return () => {
      isActive = false;
    };
  }, [hasSession, sessionId]);

  // TO DO: create a function to solve the room score */
  const roomScore = session?.roomScore ?? 15;
  const riskVariant = getRiskVariant(roomScore);
  const hazardCount = hasSession ? (session?.hazardCount ?? 0) : 3;
  const hazards = hasSession ? (session?.hazards ?? []) : undefined;

  return (
    <ScrollView
      className="flex-1 mt-9 pb-56 mb-14 bg-surface-default"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-14"
    >
      <View className="mx-7 gap-7">
        {/* Safety Report Header */}
        <View className="flex-1 justify-center items-center gap-4">
          <Text className="text-h2 font-bold text-center mt-10">
            Room Safety Report
          </Text>
          <View className="relative">
            <MascotReporter score={riskVariant} value={roomScore} />
          </View>
        </View>

        {hasSession && loadError ? (
          <View className="rounded-2xl bg-surface-light px-4 py-3">
            <Text className="font-semibold">Saved scan unavailable</Text>
            <Text className="text-text-subtle mt-1">{loadError}</Text>
          </View>
        ) : null}

        {/* No. of identified hazard and instructions */}
        <View>
          <Text className="text-2xl font-bold mt-10 mb-1">
            Identified Hazards ({hazardCount})
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

        <View>
          {hasSession && isLoadingSession ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="large" color="#0f172a" />
              <Text className="text-text-subtle mt-4">
                Loading saved scan details...
              </Text>
            </View>
          ) : (
            <HazardCard hazards={hazards} showResolutionAction={hasSession} />
          )}
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
