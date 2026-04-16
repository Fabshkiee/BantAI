import { hasCompletedOnboarding } from "@/lib/onboardingStorage";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function AppEntry() {
  useEffect(() => {
    let isMounted = true;

    const routeByOnboardingState = async () => {
      try {
        const completed = await hasCompletedOnboarding();
        if (!isMounted) return;

        if (completed) {
          router.replace("/(tabs)");
          return;
        }

        router.replace("/onboarding");
      } catch {
        if (!isMounted) return;
        router.replace("/onboarding");
      }
    };

    void routeByOnboardingState();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-surface-default">
      <ActivityIndicator size="large" color="#006ec2" />
    </View>
  );
}
