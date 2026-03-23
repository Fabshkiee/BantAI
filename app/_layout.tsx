import { Stack } from "expo-router";
import { View } from "react-native";
import "../global.css";

export default function RootLayout() {
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
