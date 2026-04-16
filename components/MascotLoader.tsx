import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const scale = useSharedValue(0);
  const spinnerOpacity = useSharedValue(0);
  const mainOpacity = useSharedValue(1);

  useEffect(() => {
    // Entrance animations for mascot
    scale.value = withSequence(
      withSpring(1, { damping: 14, stiffness: 120 }),
      withDelay(500, withTiming(1.15, { duration: 600 })),
    );
    // Late entrance for spinner
    spinnerOpacity.value = withDelay(1200, withTiming(1, { duration: 400 }));

    // Master Visual Fade Out (Timed Transition)
    const fadeTimer = setTimeout(() => {
      mainOpacity.value = withTiming(0, { duration: 800 });
      // Clean unmount after fade
      setTimeout(() => setIsVisible(false), 800);
    }, 2800);

    return () => clearTimeout(fadeTimer);
  }, []);

  const mainContainerStyle = useAnimatedStyle(() => ({
    opacity: mainOpacity.value,
  }));

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const spinnerStyle = useAnimatedStyle(() => ({
    opacity: spinnerOpacity.value,
  }));

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        mainContainerStyle,
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
        },
      ]}
      className="items-center justify-center bg-surface-default"
    >
      <View
        className="items-center justify-center"
        style={{ width: 240, height: 240 }}
      >
        {/* The Fading Spinner & Text */}
        <Animated.View style={[spinnerStyle, { position: "absolute" }]}>
          <Progress.CircleSnail
            color={["#006ec2", "#54a9ea"]}
            size={240}
            thickness={5}
          />
        </Animated.View>

        {/* The Mascot */}
        <Animated.View style={mascotStyle}>
          <Animated.Image
            source={require("@/assets/mascot/MascotSmile.png")}
            style={{ width: 140, height: 140 }}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* The Loading Text */}
      <Animated.View style={[spinnerStyle, { marginTop: 40 }]}>
        <Text className="text-text-subtle font-medium text-lg">
          {t("common.loading")}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
