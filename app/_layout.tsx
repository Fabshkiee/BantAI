import { Stack } from "expo-router";
import { View } from "react-native";
import "../global.css";

export default function RootLayout() {
  return (
    <View className="flex-1 bg-surface-default">
      <Stack
        screenOptions={{
          // Standard iOS/Android "Slide" feel
          animation: "slide_from_right",
          animationDuration: 250, // 250ms is the "Sweet Spot" for perceived speed
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      >
        {/* Specific screen overrides */}
        <Stack.Screen name="explore" options={{ animation: "fade" }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Modals usually look better sliding from bottom */}
        <Stack.Screen
          name="not-found"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
      </Stack>
    </View>
  );
}
