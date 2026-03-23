import ArrowIcon from "@/assets/icons/ArrowIcon";
import Button from "@/components/Button";
import { router } from "expo-router";
import * as React from "react";
import { Image, Text, View } from "react-native";

export default function LandscapeOrientationScreen() {
  return (
    <View className="flex-1 bg-surface-default px-8 pt-44">
      <View className="items-center">
        {/* Robot */}
        <View className="items-center justify-center mb-8">
          <Image
            source={require("@/assets/mascot/MascotPhone.png")}
            className="w-[201px] h-[229px]"
          />
        </View>

        <Text className="text-lg font-text font-black text-center mb-3 leading-tight">
          For better accuracy, hold your device in landscape orientation.
        </Text>

        <Text className="text-md text-text-critical text-center font-text mb-6">
          Device is not yet in landscape orientation.
        </Text>

        <Button
          label="Take Photo"
          className="w-full"
          onPress={() => {
            // Future logic: Trigger camera capture
            router.push("/");
          }}
          icon={<ArrowIcon color="white" size={20} />}
          iconPosition="right"
        />
      </View>
    </View>
  );
}
