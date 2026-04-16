import ScansCard from "@/components/ScansCard";
import TopNavBar from "@/components/TopBar";
import { getRecentScanSessions, type ScanSessionSummary } from "@/db/db";
import i18n from "@/languages/i18n";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function ScansScreen() {
  const [sessions, setSessions] = useState<ScanSessionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
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

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadSessions = async () => {
        try {
          setIsLoading(true);
          setLoadError(null);

          const recentSessions = await getRecentScanSessions();
          if (isActive) {
            setSessions(recentSessions);
          }
        } catch (error) {
          if (isActive) {
            setLoadError(t("history_screen.error_message"));
            setSessions([]);
          }
          console.error("Failed to load scan history:", error);
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      loadSessions();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <ScrollView
      className="flex-1 px-7 mt-9 bg-surface-default"
      contentContainerClassName="pb-40"
      showsVerticalScrollIndicator={false}
    >
      <TopNavBar></TopNavBar>

      <Text className="text-h2 font-bold mb-4">
        {t("history_screen.title")}
      </Text>

      {isLoading ? (
        <View className="py-10 items-center justify-center">
          <ActivityIndicator size="large" color="#0f172a" />
          <Text className="text-text-subtle mt-4">
            {t("history_screen.loading")}
          </Text>
        </View>
      ) : loadError ? (
        <View className="py-10 items-center justify-center rounded-2xl bg-surface-light px-6">
          <Text className="text-lg font-semibold text-center">
            {t("history_screen.error_title")}
          </Text>
          <Text className="text-text-subtle text-center mt-2">{loadError}</Text>
        </View>
      ) : sessions.length === 0 ? (
        <View className="py-10 items-center justify-center rounded-2xl bg-surface-light px-6">
          <Text className="text-lg font-semibold text-center">
            {t("history_screen.empty_title")}
          </Text>
          <Text className="text-text-subtle text-center mt-2">
            {t("history_screen.empty_message")}
          </Text>
        </View>
      ) : (
        <View className="flex gap-6">
          {sessions.map((session) => (
            <ScansCard
              key={session.id}
              id={session.id}
              title={t("history_card.scan_title", { id: session.id })}
              scannedAt={session.scannedAt}
              roomScore={session.roomScore}
              riskVariant={session.riskVariant}
              photoPath={session.photoPath}
              hazardCount={session.hazardCount}
              assessedCount={session.assessedCount}
              status={session.status}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}
