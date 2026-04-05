import { initDatabase } from "@/db/db";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useEffect } from "react";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const BgTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#f5faff",
  },
};

export default function RootLayout() {
  // Initialize DB
  useEffect(() => {
    initDatabase().catch((error) => {
      console.error("Database initialization failed:", error);
    });
  }, []);

  return (
    <ThemeProvider value={BgTheme}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            animation: "slide_from_right",
            animationDuration: 250,
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
          }}
        />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
