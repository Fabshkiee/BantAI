import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import MascotReporter from "./MascotReporter";

// TO DO: Create props for historycard
export default function HistoryCard() {
  return (
    <Pressable
      className="flex-row p-3 gap-3 justify-between items-start bg-surface-light rounded-2xl border border-border-secondary transition-all active:scale-[0.95]"
      onPress={() => {
        router.push("/safetyReport");
        {
          /* TODO: Make it dynamic and locate to specific safety report id */
        }
      }}
    >
      {/* Left Side: Image & Text Group */}
      <View className="flex-1 flex-row gap-4 items-center">
        {/* TODO: Link image to specific report id */}
        <Image
          source={require("@/assets/images/room.png")}
          resizeMode="cover"
          className="w-20 h-20 rounded-xl"
        />

        {/* TODO: Link Title and date to specific report id */}
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-semibold">HazardNadadadme</Text>
          <Text className="text-md text-text-subtle mt-1">March 24, 2026</Text>
        </View>
      </View>

      {/* TODO: Link report to specific report id */}
      <View className="w-16 h-16 items-center justify-center">
        <View className="scale-[0.25] mr-2">
          <MascotReporter score="medium" value={47} hideStatus={true} />
        </View>
      </View>
    </Pressable>
  );
}
