import MascotLoader from "@/components/MascotLoader";
import { initDatabase } from "@/db/db";
import "@/languages/i18n";
import {
  initializeNotifications,
  setupNotificationReceivedListener,
  syncPendingNdrrmcAlerts,
} from "@/lib/notificationService";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
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
  const router = useRouter();

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

    // 1. Listen for notifications the OS delivers while the app is open
    const subscription = setupNotificationReceivedListener();

    // 2. Global Tray-Click Handler: Navigate to notifications list on tap
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        router.push("/notifications" as any);
      });

    // 3. Real-time Sync: Check for native alerts whenever the app is foregrounded
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        syncPendingNdrrmcAlerts();
      }
    };

    const appStateSubscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
      responseSubscription.remove();
      appStateSubscription.remove();
    };
  }, [router]);

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
