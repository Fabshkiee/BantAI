import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import MascotReporter from "./MascotReporter";

export default function HistoryCard() {
  return (
    <Pressable
      className="flex-row p-3 justify-between items-center bg-surface-light rounded-2xl border border-border-secondary transition-all active:scale-[0.95]"
      onPress={() => {
        router.push("/safetyReport");
        {
          /* TODO: Make it dynamic and locate to specific safety report id */
        }
      }}
    >
      {/* Left Side: Image & Text Group */}
      <View className="flex-row gap-4 items-center">
        {/* TODO: Link image to specific report id */}
        <Image
          source={require("@/assets/images/room.png")}
          resizeMode="cover"
          className="w-20 h-20 rounded-xl"
        />

        {/* TODO: Link Title and date to specific report id */}
        <View className="justify-center">
          <Text className="text-lg font-semibold">Shelf Hazards</Text>
          <Text className="text-sm text-text-subtle mt-1">March 24, 2026</Text>
        </View>
      </View>

      {/* TODO: Link report to specific report id */}
      <View className="w-20 h-20 items-center justify-center -mt-4">
        <View className="scale-[0.25]">
          <MascotReporter score="medium" value={47} hideStatus={true} />
        </View>
      </View>
    </Pressable>
  );
}
