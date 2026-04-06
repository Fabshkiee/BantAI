import ArrowIcon from "@/assets/icons/ArrowIcon";
import Button from "@/components/Button";
import { useTFLite } from "@/hooks/useTFLite";
import { useFocusEffect, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useKeepAwake } from "expo-keep-awake";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

export default function CameraScreen() {
  useKeepAwake();
  const router = useRouter();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const [showNotification, setShowNotification] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<Camera>(null);
  const { modelLoaded, error: modelError } = useTFLite();

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

  useEffect(() => {
    if (!showNotification) {
      return;
    }

    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showNotification]);

  const handleCapture = async () => {
    if (!cameraRef.current || !modelLoaded || !device || isCapturing) {
      return;
    }

    try {
      setIsCapturing(true);

      const photo = await cameraRef.current.takePhoto({
        flash: "off",
        enableShutterSound: false,
      });

      if (!photo) return;

      const fileUri = photo.path.startsWith("file://")
        ? photo.path
        : `file://${photo.path}`;

      router.replace({
        pathname: "/loadingScreen",
        params: {
          imageUri: fileUri,
        },
      });
    } catch (err) {
      console.error("Camera error:", err);
      Alert.alert(
        "Capture failed",
        "We could not capture the photo. Please try again.",
      );
    } finally {
      setIsCapturing(false);
    }
  };

  if (!hasPermission) {
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

  if (device == null) {
    return (
      <View className="flex-1 justify-center items-center bg-surface-default px-8">
        <Text className="text-center font-text font-semibold text-lg mt-3 mb-4 text-text-default">
          No camera device found.
        </Text>
      </View>
    );
  }

  if (modelError) {
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
          Model Loading Failed
        </Text>
        <Text className="text-center text-gray-600 mb-6 text-sm">
          {modelError}
        </Text>
        <Button
          label="Back to Home"
          onPress={() => router.push("/")}
          className="w-56"
          icon={<ArrowIcon color="white" size={18} />}
          iconPosition="right"
        />
      </View>
    );
  }

  if (!modelLoaded) {
    return (
      <View className="flex-1 justify-center items-center bg-surface-default px-8">
        <ActivityIndicator size="large" color="#0077cc" />
        <Text className="text-center font-text font-semibold text-lg mt-4 text-text-default">
          Loading AI Model...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* Feedback Notification Popup */}
      {showNotification && (
        <View
          className="absolute top-8 left-0 items-center right-0 px-6"
          style={{ zIndex: 50, overflow: "visible" }}
        >
          <View
            className="flex-row items-center"
            style={{ overflow: "visible" }}
          >
            <View
              className="bg-white rounded-full py-4 pr-6 pl-12 shadow-lg border border-gray-100 w-fit"
              style={{ minHeight: 64, justifyContent: "center" }}
            >
              <Text className="font-text text-md font-medium text-text-default ml-10">
                Perfect, you may now take the photo.
              </Text>
            </View>

            <View
              className="absolute left-0 w-[64px] h-[64px] rounded-full bg-[#bde0fe] items-center justify-center shadow-sm"
              style={{ zIndex: 100, elevation: 10 }}
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
          disabled={!modelLoaded || isCapturing}
          className="w-[84px] h-[84px] rounded-full border-[3px] border-white items-center justify-center bg-transparent active:scale-95 transition-all"
          activeOpacity={0.8}
          onPress={handleCapture}
        >
          <View
            className={`w-[72px] h-[72px] rounded-full shadow-sm ${
              isCapturing ? "bg-gray-300" : "bg-white"
            }`}
          />
        </TouchableOpacity>

      </View>
    </View>
  );
}
