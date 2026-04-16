import MascotLoader from "@/components/MascotLoader";
import { initDatabase } from "@/db/db";
import {
  initializeNotifications,
  setupNotificationReceivedListener,
} from "@/lib/notificationService";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

// Prevent the native splash screen from auto-hiding before our loader mounts
SplashScreen.preventAutoHideAsync();

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
  // Initialize DB, notifications, and hide splash when ready
  useEffect(() => {
    async function prepare() {
      try {
        await initDatabase();
        await initializeNotifications();
      } catch (e) {
        console.warn("App initialization failed:", e);
      } finally {
        // We're ready to show our custom React Native UI
        await SplashScreen.hideAsync();
      }
    }
    prepare();

    // Listen for notifications the OS delivers while the app is open
    const subscription = setupNotificationReceivedListener();
    return () => subscription.remove();
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
        <MascotLoader />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
