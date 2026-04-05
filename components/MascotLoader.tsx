import React, { useEffect } from "react";
import { Text, View } from "react-native";
import * as Progress from "react-native-progress";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function MascotLoader() {
  const scale = useSharedValue(0);
  const spinnerOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1, { damping: 40, stiffness: 350 }),

      withDelay(300, withTiming(1.15, { duration: 200 })),
    );
    spinnerOpacity.value = withDelay(1200, withTiming(1, { duration: 400 }));
  }, []);

  const mascotStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const spinnerStyle = useAnimatedStyle(() => {
    return {
      opacity: spinnerOpacity.value,
      marginTop: 40,
    };
  });

  return (
    <View className="flex-1 items-center justify-center bg-surface-default">
      {/* The Animated Mascot */}
      <View className="absolute bottom-[30%]">
        <Animated.Image
          source={require("@/assets/mascot/MascotSmile.png")} //
          style={[mascotStyle, { width: 140, height: 140 }]}
          resizeMode="contain"
        />
      </View>

      {/* The Fading Spinner & Text */}
      <Animated.View style={spinnerStyle} className="items-center">
        <Progress.CircleSnail
          color={["#006ec2", "#54a9ea"]}
          size={240}
          thickness={5}
        />
        <Text className="mt-6 text-text-subtle font-medium text-lg">
          Loading BantAI...
        </Text>
      </Animated.View>
    </View>
  );
}
