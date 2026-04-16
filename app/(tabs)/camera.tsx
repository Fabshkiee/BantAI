import ArrowIcon from "@/assets/icons/ArrowIcon";
import FlashIcon from "@/assets/icons/FlashIcon";
import FlashOffIcon from "@/assets/icons/FlashOffIcon";
import Button from "@/components/Button";
import { useTFLite } from "@/hooks/useTFLite";
import i18n from "@/languages/i18n";
import { useKeepAwake } from "expo-keep-awake";
import { useFocusEffect, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

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
  const [flashMode, setFlashMode] = useState<"on" | "off">("off");
  const cameraRef = useRef<Camera>(null);
  const { modelLoaded, error: modelError } = useTFLite();
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLanguage(i18n.language);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

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
        flash: flashMode,
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
        t("camera_screen.capture_failed_title"),
        t("camera_screen.capture_failed_message"),
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
          {t("camera_screen.permission_message")}
        </Text>
        <Button
          label={t("camera_screen.allow_camera")}
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
          {t("camera_screen.no_device")}
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
          {t("camera_screen.model_failed")}
        </Text>
        <Text className="text-center text-gray-600 mb-6 text-sm">
          {modelError}
        </Text>
        <Button
          label={t("camera_screen.back_to_home")}
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
          {t("camera_screen.loading_model")}
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

      {/* Flash Toggle Button */}
      {device.hasFlash && (
        <View className="absolute top-4 left-4 z-50">
          <TouchableOpacity
            onPress={() => setFlashMode((prev) => (prev === "off" ? "on" : "off"))}
            className="w-12 h-12 bg-black/40 rounded-full items-center justify-center border border-white/20 active:scale-95 transition-transform"
          >
            {flashMode === "on" ? (
              <FlashIcon color="white" size={24} />
            ) : (
              <FlashOffIcon color="white" size={24} />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Language Toggle Button */}
      <View className="absolute top-4 right-4 z-50">
        <Button
          label={currentLanguage === "en" ? "TL" : "EN"}
          variant="secondary"
          className="w-16"
          onPress={() => {
            i18n.changeLanguage(currentLanguage === "en" ? "tl" : "en");
          }}
        />
      </View>

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
                {t("camera_screen.capture_ready")}
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
