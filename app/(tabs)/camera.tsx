import ArrowIcon from "@/assets/icons/ArrowIcon";
import Button from "@/components/Button";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import * as React from "react";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showNotification, setShowNotification] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
      );

      return () => {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        );
      };
    }, []),
  );

  // useEffect(() => {
  //   if (showNotification) {
  //     const timer = setTimeout(() => {
  //       setShowNotification(false);
  //     }, 5000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [showNotification]);

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-surface-default px-8">
        <Image
          source={require("@/assets/mascot/MascotPhone.png")}
          style={{
            width: 160,
            height: 180,
          }}
        />
        <Text className="text-center font-text font-semibold text-lg mt-3 mb-4 text-text-default">
          BantAI need permission to use your camera.
        </Text>
        <Button
          label="Allow Camera Use"
          onPress={requestPermission}
          className="w-56"
          icon={<ArrowIcon color="white" size={18} />}
          iconPosition="right"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView style={{ flex: 1 }} facing="back">
        {/* Feedback Notification Popup */}
        {showNotification && (
          <View
            className="absolute top-8 left-0 items-center right-0 px-6"
            style={{ zIndex: 50, overflow: "visible" }}
          >
            <View
              className="w-[44%] flex-row items-center"
              style={{ overflow: "visible" }}
            >
              <View
                className="flex-1 bg-white rounded-full py-4 pr-6 pl-12 shadow-lg border border-gray-100"
                style={{ minHeight: 64, justifyContent: "center" }}
              >
                <Text className="font-text text-md font-medium text-text-default ml-10">
                  Perfect, you may now take the photo.
                </Text>
              </View>

              <View
                className="absolute left-0 w-[64px] h-[64px] rounded-full bg-[#bde0fe] items-center justify-center shadow-sm"
                style={{ zIndex: 100, elevation: 10 }} // Elevation forces it above the white box on Android
              >
                <Image
                  source={require("@/assets/mascot/MascotSmile.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        )}

        {/* Capture Button */}
        <View className="absolute right-20 top-0 bottom-0 justify-center items-center">
          <TouchableOpacity
            className="w-[84px] h-[84px] rounded-full border-[3px] border-white items-center justify-center bg-transparent active:scale-95 transition-all"
            activeOpacity={0.8}
            onPress={() => {
              // Handle photo capture in future logic
            }}
          >
            <View className="w-[72px] h-[72px] rounded-full bg-white shadow-sm" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
