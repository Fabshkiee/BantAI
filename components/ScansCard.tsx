import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";
import MascotReporter, { type RiskVariant } from "./MascotReporter";

type ScansCardProps = {
  id: number;
  title: string;
  scannedAt: number;
  roomScore: number | null;
  riskVariant: RiskVariant | null;
  photoPath: string | null;
  hazardCount: number;
  assessedCount: number;
  status: string;
};

const formatScanDate = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export default function ScansCard({
  id,
  title,
  scannedAt,
  roomScore,
  riskVariant,
  photoPath,
  hazardCount,
  assessedCount,
  status,
}: ScansCardProps) {
  const { t } = useTranslation();
  const score = roomScore ?? 0;
  const displayVariant = riskVariant ?? "critical";
  const imageSource = photoPath
    ? { uri: photoPath }
    : require("@/assets/images/room.png");

  // Logic for the descriptive status label
  const getStatusLabel = () => {
    if (hazardCount === 0) {
      return t("history_card.no_hazards");
    }

    return t("history_card.hazards_resolved", {
      assessed: assessedCount,
      total: hazardCount,
    });
  };

  return (
    <Pressable
      className="flex-row py-4 gap-3 justify-between items-start bg-surface-default border-b border-b-border-secondary transition-all active:scale-[0.95]"
      onPress={() => {
        router.push({
          pathname: "/safetyReport",
          params: { sessionId: String(id) },
        });
      }}
    >
      {/* Left Side: Image & Text Group */}
      <View className="flex-1 flex-row gap-4 items-center">
        <Image
          source={imageSource}
          resizeMode="cover"
          className="w-20 h-20 rounded-md"
        />

        <View className="flex-1 justify-center">
          <Text className="text-2xl font-semibold">{title}</Text>
          <Text className="text-md text-text-subtle mt-1">
            {formatScanDate(scannedAt)}
          </Text>
          <Text className="text-sm text-text-subtle mt-1">
            {getStatusLabel()}
          </Text>
        </View>
      </View>

      <View className="w-16 h-16 items-center justify-center">
        <View className="scale-[0.25] mr-2">
          <MascotReporter
            score={displayVariant}
            value={score}
            hideStatus={true}
          />
        </View>
      </View>
    </Pressable>
  );
}
