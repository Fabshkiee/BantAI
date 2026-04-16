import React, { useMemo, useState } from "react";
import {
    Image,
    ImageSourcePropType,
    Pressable,
    useWindowDimensions,
    View
} from "react-native";

const SAMPLE_IMAGES = new Map<number, ImageSourcePropType>([
  [1, require("@/assets/images/sample1.png")],
  [2, require("@/assets/images/sample2.png")],
  [3, require("@/assets/images/sample3.png")],
  [4, require("@/assets/images/sample4.png")],
  [5, require("@/assets/images/sample5.png")],
]);

export default function MockScreen() {
  const { width, height } = useWindowDimensions();
  const [activeStep, setActiveStep] = useState(1);

  const activeImage = useMemo(() => {
    return SAMPLE_IMAGES.get(activeStep) ?? SAMPLE_IMAGES.get(1)!;
  }, [activeStep]);

  const handlePress = () => {
    setActiveStep((currentStep) => (currentStep >= 5 ? 1 : currentStep + 1));
  };

  return (
    <Pressable className="flex-1 bg-black" onPress={handlePress}>
      <Image
        source={activeImage}
        resizeMode="cover"
        style={{ width, height }}
      />

      <View className="absolute left-4 right-4 top-12 items-center">
        <View className="rounded-full bg-black/60 px-4 py-2"></View>
      </View>
    </Pressable>
  );
}
