import ArrowIcon from "@/assets/icons/ArrowIcon";
import Button from "@/components/Button";
import { createScanSession, insertDetectedHazards } from "@/db/db";
import { HAZARD_LABELS, type HazardLabel } from "@/db/hazards";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

const FALLBACK_HAZARDS: HazardLabel[] = [
  HAZARD_LABELS.OVERLOADED_SOCKET,
  HAZARD_LABELS.DAMAGED_WIRE,
  HAZARD_LABELS.FLOOR_APPLIANCE,
  HAZARD_LABELS.MAJOR_CRACK,
  HAZARD_LABELS.MINOR_CRACK,
  HAZARD_LABELS.BROKEN_GLASS,
];

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [showNotification, setShowNotification] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  const getFallbackPredictions = (): HazardLabel[] => {
    const randomCount = 2 + Math.floor(Math.random() * 3);
    return [...FALLBACK_HAZARDS]
      .sort(() => Math.random() - 0.5)
      .slice(0, randomCount);
  };

  const navigateToReportWithSession = async (photoPath: string) => {
    const sessionId = await createScanSession(photoPath);
    await insertDetectedHazards(sessionId, getFallbackPredictions());

    router.replace({
      pathname: "/safetyReport",
      params: { sessionId: String(sessionId) },
    });
  };

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
    if (!cameraRef.current || isCapturing) {
      return;
    }

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (!photo?.uri) {
        throw new Error("Camera capture did not return a photo URI.");
      }

      await navigateToReportWithSession(photo.uri);
    } catch (error) {
      console.error("Failed to capture photo:", error);
      Alert.alert(
        "Capture failed",
        "We could not capture the photo. Please try again.",
      );
    } finally {
      setIsCapturing(false);
    }
  };

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
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back">
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
            className="w-[84px] h-[84px] rounded-full border-[3px] border-white items-center justify-center bg-transparent"
            activeOpacity={0.8}
            disabled={isCapturing}
            onPress={handleCapture}
          >
            <View
              className={`w-[72px] h-[72px] rounded-full shadow-sm ${isCapturing ? "bg-gray-300" : "bg-white"}`}
            />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}
