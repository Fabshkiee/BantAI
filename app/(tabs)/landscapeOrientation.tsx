import ArrowIcon from "@/assets/icons/ArrowIcon";
import Button from "@/components/Button";
import { router } from "expo-router";
import * as React from "react";
import { Image, Text, View, useWindowDimensions } from "react-native";

export default function LandscapeOrientationScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <View
      className={`flex-1 bg-surface-default px-8 ${
        isLandscape ? "items-center justify-center" : "pt-44"
      }`}
    >
      <View className="items-center">
        {/* Robot */}
        <View
          className={`items-center justify-center ${isLandscape ? "mb-2" : "mb-8"}`}
        >
          <Image
            source={require("@/assets/mascot/MascotPhone.png")}
            style={
              isLandscape
                ? { width: 160, height: 180 }
                : { width: 201, height: 229 }
            }
          />
        </View>
      </View>

      <View className="items-center">
        <Text
          className={`text-lg font-text font-black mb-3 leading-tight text-center`}
        >
          For better accuracy, hold your device in landscape orientation.
        </Text>

        <Text
          className={`text-md font-text mb-6 text-center ${
            isLandscape ? "text-text-low" : "text-text-critical"
          }`}
        >
          {isLandscape
            ? "Feel free to take a photo of your room now."
            : "Device is not yet in landscape orientation."}
        </Text>

        <Button
          label="Take Photo"
          className={isLandscape ? "w-80" : "w-full"}
          disabled={!isLandscape}
          onPress={() => {
            router.push("/camera");
          }}
          icon={<ArrowIcon color="white" size={20} />}
          iconPosition="right"
        />
      </View>
    </View>
  );
}
