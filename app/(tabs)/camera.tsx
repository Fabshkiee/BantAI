import ArrowIcon from "@/assets/icons/ArrowIcon";
import Button from "@/components/Button";
import CoachmarkOverlay from "@/components/CoachmarkOverlay";
import { useCoachmarks } from "@/context/CoachmarkContext";
import { useTFLite } from "@/hooks/useTFLite";
import i18n from "@/languages/i18n";
import { useKeepAwake } from "expo-keep-awake";
import { useFocusEffect, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const cameraRef = useRef<Camera>(null);
  const { modelLoaded, error: modelError } = useTFLite();
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const { scanStep, startScanTour, advanceScanStep, dismissScanTour } =
    useCoachmarks();

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
    useCallback(() => {
      startScanTour();
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
      );

      return () => {
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        );
      };
    }, [startScanTour]),
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

      {scanStep === 1 && (
        <CoachmarkOverlay
          title="Frame the Hazards"
          stepText="1 of 5"
          description="Ensure potential risks, like tangled cords or precarious furniture, are clearly visible in the frame before snapping your photo."
          ctaLabel="Next"
          onNext={advanceScanStep}
          onSkip={dismissScanTour}
          pointerSide="right"
          pointerOffset={42}
          positionStyle={{ right: 172, top: 154, width: 360 }}
        />
      )}
    </View>
  );
}
