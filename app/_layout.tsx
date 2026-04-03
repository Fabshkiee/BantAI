import { initDatabase } from "@/db/db";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import "../global.css";

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
          animation: "slide_from_right",
          animationDuration: 250,
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      ></Stack>
    </View>
  );
}
