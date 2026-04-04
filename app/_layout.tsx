import { initDatabase } from "@/db/db";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

// Define default bg theme
const BgTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f5faff", // Defauly bg color
  },
};

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch((error) => {
      console.error("Database initialization failed:", error);
    });
  }, []);

  return (
    // Apply theme
    <ThemeProvider value={BgTheme}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
