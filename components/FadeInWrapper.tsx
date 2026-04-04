import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Animated } from "react-native";

interface FadeInWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function FadeInWrapper({
  children,
  className,
}: FadeInWrapperProps) {
  // Set up animation starting values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  useFocusEffect(
    useCallback(() => {
      // Reset the values
      fadeAnim.setValue(0);
      slideAnim.setValue(15);

      // Play the animations together
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      return () => {
        fadeAnim.setValue(0);
      };
    }, []),
  );

  return (
    <Animated.View
      className={`flex-1 ${className || ""}`}
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
}
