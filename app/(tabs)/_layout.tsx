import CameraIcon from "@/assets/icons/CameraIcon";
import HistoryIcon from "@/assets/icons/HistoryIcon";
import HomeIcon from "@/assets/icons/HomeIcon";
import { createScanSession, insertDetectedHazards } from "@/db/db";
import { HAZARD_LABELS, type HazardLabel } from "@/db/hazards";
import * as ImagePicker from "expo-image-picker";
import { router, Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Modal, Pressable, Text, View } from "react-native";

const FALLBACK_HAZARDS: HazardLabel[] = [
  HAZARD_LABELS.OVERLOADED_SOCKET,
  HAZARD_LABELS.DAMAGED_WIRE,
  HAZARD_LABELS.FLOOR_APPLIANCE,
  HAZARD_LABELS.MAJOR_CRACK,
  HAZARD_LABELS.MINOR_CRACK,
  HAZARD_LABELS.BROKEN_GLASS,
];

const getFallbackPredictions = (): HazardLabel[] => {
  const randomCount = 2 + Math.floor(Math.random() * 3);
  return [...FALLBACK_HAZARDS]
    .sort(() => Math.random() - 0.5)
    .slice(0, randomCount);
};

// Static configurations
const TAB_BAR_OPTIONS = {
  headerShown: false,
  tabBarActiveTintColor: "#006ec2",
  tabBarInactiveTintColor: "#84888c",
  tabBarItemStyle: { justifyContent: "center", alignItems: "center" } as any,
  tabBarStyle: {
    height: 120,
    backgroundColor: "#f0f8ff",
    borderStartWidth: 2,
    borderTopWidth: 2,
    borderEndWidth: 2,
    borderColor: "#e5e5e5",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingBottom: 60,
    paddingTop: 16,
    position: "absolute",
    shadowOpacity: 0,
    elevation: 0,
  } as any,
  tabBarLabelStyle: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "bold",
  } as any,
};

const HIDDEN_SCREENS = [
  "landscapeOrientation",
  "camera",
  "loadingScreen",
  "safetyReport",
  "articles/earthquakeArticle",
  "articles/typhoonArticle",
  "articles/fireArticle",
];

// Modal component
const CameraActionModal = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (isVisible) {
      slideAnim.setValue(400);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const handleClose = (callback?: () => void) => {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      if (callback) callback();
    });
  };

  const handleCamera = () => handleClose(() => router.push("/camera"));

  const handleOpenGallery = () => {
    handleClose(async () => {
      try {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Needed",
            "We need gallery permissions to select a photo.",
          );
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });

        if (result.canceled) {
          return;
        }

        const uri = result.assets[0]?.uri;
        if (!uri) {
          throw new Error("Selected image does not include a URI.");
        }

        const sessionId = await createScanSession(uri);
        await insertDetectedHazards(sessionId, getFallbackPredictions());

        router.replace({
          pathname: "/safetyReport",
          params: { sessionId: String(sessionId) },
        });
      } catch (error) {
        console.error("Failed to import image:", error);
        Alert.alert(
          "Import failed",
          "We could not process that image. Please try again.",
        );
      }
    });
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => handleClose()}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={() => handleClose()}
      >
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Pressable
            className="bg-white rounded-t-3xl p-6 pb-10 gap-3 shadow-xl border-t border-gray-200"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-2" />
            <Text className="text-2xl font-bold text-center mb-4">
              Ready for a Safety Check?
            </Text>

            <Pressable
              className="bg-surface-primary p-4 rounded-full flex-row justify-center items-center active:opacity-80"
              onPress={handleCamera}
            >
              <Text className="text-white font-semibold text-lg">
                Snap a Photo
              </Text>
            </Pressable>

            <Pressable
              className="bg-blue-50 border border-blue-200 p-4 rounded-full flex-row justify-center items-center active:bg-blue-100"
              onPress={handleOpenGallery}
            >
              <Text className="text-surface-primary font-semibold text-lg">
                Choose from Gallery
              </Text>
            </Pressable>

            <Pressable
              className="bg-gray-100 p-4 rounded-full items-center mt-2 active:bg-gray-200"
              onPress={() => handleClose()}
            >
              <Text className="text-text-subtle font-semibold text-lg">
                Cancel
              </Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

// Main tab layout
export default function TabLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Tabs screenOptions={TAB_BAR_OPTIONS}>
        {/* Home Tab */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIconStyle: { paddingBottom: 8 },
            tabBarIcon: ({ color }) => <HomeIcon color={color} size={40} />,
          }}
        />

        {/* Action Button (Center Tab) */}
        <Tabs.Screen
          name="photoInstructions"
          options={{
            title: "photo",
            tabBarStyle: { display: "none" },
            tabBarButton: () => (
              <Pressable
                onPress={() => setIsModalOpen(true)}
                className="flex-1 items-center justify-center"
                style={{ top: -10 }}
              >
                <View
                  className="bg-surface-primary rounded-[56px] p-4"
                  style={{
                    elevation: 10,
                    shadowColor: "#005da3",
                    shadowRadius: 12,
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 0, height: 4 },
                  }}
                >
                  <CameraIcon color="#f5faff" size={60} />
                </View>
              </Pressable>
            ),
          }}
        />

        {/* History Tab */}
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIconStyle: { paddingBottom: 8 },
            tabBarIcon: ({ color }) => <HistoryIcon color={color} size={32} />,
          }}
        />

        {/* Dynamically Render All Hidden Screens */}
        {HIDDEN_SCREENS.map((screenName) => (
          <Tabs.Screen
            key={screenName}
            name={screenName}
            options={{ href: null, tabBarStyle: { display: "none" } }}
          />
        ))}
      </Tabs>

      {/* Extracted Modal Component */}
      <CameraActionModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
