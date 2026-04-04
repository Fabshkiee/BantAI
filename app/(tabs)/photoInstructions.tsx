import ArrowIcon from "@/assets/icons/ArrowIcon";
import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import Button from "@/components/Button";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Animated, Image, Text, View } from "react-native";

export default function PhotoInstructionsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      fadeAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]),
  );

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <View className="bg-surface-default px-8 pt-36">
        <View className="absolute top-0 left-0 px-6 pt-8">
          <Button
            label="Return"
            variant="return"
            icon={<ArrowLeftIcon color="black" size={18} />}
            iconPosition="left"
            onPress={() => {
              router.back();
            }}
          />
        </View>
        <View className="items-center w-full">
          <Text className="text-h2 font-display font-bold text-center mb-3 leading-tight">
            How to Take the Photo
          </Text>
          <Text className="text-lg text-center font-text leading-7 mb-9">
            Position your phone in the area where youcan see most of the room to
            ensure a complete scan of all sections.
          </Text>

          {/* Image */}
          <View
            className="w-full rounded-2xl mb-9"
            style={{ overflow: "hidden", aspectRatio: 4 / 3 }}
          >
            <Image
              source={require("@/assets/images/room.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>

          <Button
            label="Proceed"
            className="w-full"
            onPress={() => {
              router.replace("/landscapeOrientation");
            }}
            icon={<ArrowIcon color="white" size={18} />}
            iconPosition="right"
          />
        </View>
      </View>
    </Animated.View>
  );
}
