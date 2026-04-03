import { initDatabase } from "@/db/db";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import "../global.css";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch((error) => {
      console.error("Database initialization failed:", error);
    });
  }, []);

  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          // Standard iOS/Android "Slide" feel
          animation: "slide_from_right",
          animationDuration: 250, // 250ms is the "Sweet Spot" for perceived speed
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      ></Stack>
    </View>
  );
}
