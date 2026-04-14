import { router } from "expo-router";
import React from "react";
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
  const score = roomScore ?? 0;
  const displayVariant = riskVariant ?? "critical";
  const imageSource = photoPath
    ? { uri: photoPath }
    : require("@/assets/images/room.png");

  // Logic for the descriptive status label
  const getStatusLabel = () => {
    if (hazardCount === 0) {
      return "No hazards";
    }

    return `${assessedCount}/${hazardCount} Hazards Resolved`;
  };

  return (
    <Pressable
      className="flex-row p-3 gap-3 justify-between items-start bg-surface-light rounded-2xl shadow-xl shadow-border-default transition-all active:scale-[0.95]"
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
          className="w-20 h-20 rounded-xl"
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
