import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useState } from "react";
import {
    Image,
    ImageSourcePropType,
    Pressable,
    useWindowDimensions,
    View,
} from "react-native";

const SAMPLE_IMAGES = new Map<number, ImageSourcePropType>([
  [1, require("@/assets/images/sample1.png")],
  [2, require("@/assets/images/sample2.png")],
  [3, require("@/assets/images/sample3.png")],
  [4, require("@/assets/images/sample4.png")],
  [5, require("@/assets/images/sample5.png")],
  [6, require("@/assets/images/sample6.png")],
  [7, require("@/assets/images/sample7.png")],
  [8, require("@/assets/images/sample8.png")],
]);

export default function MockScreen() {
  const { width, height } = useWindowDimensions();
  const [activeStep, setActiveStep] = useState(1);

  useFocusEffect(
    React.useCallback(() => {
      setActiveStep(1);
    }, []),
  );

  useEffect(() => {
    const applyOrientation = async () => {
      if (activeStep === 3) {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
        );
        return;
      }

      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    };

    void applyOrientation();

    return () => {
      void ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
    };
  }, [activeStep]);

  const handlePress = () => {
    if (activeStep >= 8) {
      router.replace("/(tabs)");
      return;
    }

    setActiveStep((currentStep) => currentStep + 1);
  };

  return (
    <View className="flex-1 bg-black">
      <Pressable className="flex-1" onPress={handlePress}>
        <View style={{ width, height }}>
          {Array.from(SAMPLE_IMAGES.entries()).map(([step, source]) => (
            <Image
              key={step}
              source={source}
              resizeMode="cover"
              style={{
                position: "absolute",
                width,
                height,
                opacity: step === activeStep ? 1 : 0,
              }}
            />
          ))}
        </View>
      </Pressable>

      <View className="absolute left-4 right-4 top-12 items-center">
        <View className="rounded-full bg-black/60 px-4 py-2"></View>
      </View>
    </View>
  );
}
