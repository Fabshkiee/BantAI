import CameraIcon from "@/assets/icons/CameraIcon";
import HomeIcon from "@/assets/icons/HomeIcon";
import ScanIcon from "@/assets/icons/ScanIcon";
import CoachmarkOverlay from "@/components/CoachmarkOverlay";
import { useCoachmarks } from "@/context/CoachmarkContext";
import "@/languages/i18n";
import * as ImagePicker from "expo-image-picker";
import { router, Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Animated, Modal, Pressable, Text, View } from "react-native";

const TAB_BAR_OPTIONS = {
  headerShown: false,
  tabBarActiveTintColor: "#006ec2",
  tabBarInactiveTintColor: "#84888c",
  tabBarItemStyle: { justifyContent: "center", alignItems: "center" } as any,
  tabBarStyle: {
    height: 120,
    backgroundColor: "#f5faff",
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
  "scanReport",
  "articles/earthquakeArticle",
  "articles/typhoonArticle",
  "articles/fireArticle",
  "notifications",
];

const CameraActionModal = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const { t } = useTranslation();

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

  const importFromGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("common.permission_needed"),
          t("camera_modal.gallery_permission_message"),
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

      router.replace({
        pathname: "/loadingScreen",
        params: { imageUri: uri },
      });
    } catch (error) {
      console.error("Failed to import image:", error);
      Alert.alert(
        t("common.import_failed"),
        t("common.could_not_process_image"),
      );
    }
  };

  const handleOpenGallery = () => {
    handleClose(() => {
      Alert.alert(
        t("camera_modal.landscape_recommended_title"),
        t("camera_modal.landscape_recommended_message"),
        [
          { text: t("camera_modal.landscape_cancel"), style: "cancel" },
          {
            text: t("camera_modal.landscape_continue"),
            onPress: () => {
              void importFromGallery();
            },
          },
        ],
      );
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
            <Text className="text-2xl font-bold text-center mb-4">
              {t("camera_modal.title")}
            </Text>

            <Pressable
              className="bg-surface-primary p-4 rounded-full flex-row justify-center items-center active:opacity-80 active:scale-95 transition-all"
              onPress={handleCamera}
            >
              <Text className="text-white font-semibold text-lg">
                {t("camera_modal.snap_photo")}
              </Text>
            </Pressable>

            <Pressable
              className=" border border-border-primary p-4 rounded-full flex-row justify-center items-center active:opacity-80 active:scale-95 transition-all"
              onPress={handleOpenGallery}
            >
              <Text className="text-surface-primary font-semibold text-lg">
                {t("camera_modal.choose_gallery")}
              </Text>
            </Pressable>

            <Pressable
              className="bg-gray-100 p-4 rounded-full items-center mt-2 active:opacity-80 active:scale-95 transition-all"
              onPress={() => handleClose()}
            >
              <Text className="text-text-subtle font-semibold text-lg">
                {t("camera_modal.cancel")}
              </Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default function TabLayout() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { homeStep, nextHomeStep, dismissHomeTour, homeScanButtonRect } =
    useCoachmarks();

  return (
    <>
      <Tabs screenOptions={TAB_BAR_OPTIONS}>
        <Tabs.Screen
          name="index"
          options={{
            title: t("tabs.home"),
            tabBarIconStyle: { paddingBottom: 8 },
            tabBarIcon: ({ color }) => <HomeIcon color={color} size={40} />,
            animation: "fade",
          }}
        />

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

        <Tabs.Screen
          name="scans"
          options={{
            title: t("tabs.scans"),
            tabBarIconStyle: { paddingBottom: 8 },
            tabBarIcon: ({ color }) => <ScanIcon color={color} size={32} />,
            animation: "fade",
          }}
        />

        {HIDDEN_SCREENS.map((screenName) => (
          <Tabs.Screen
            key={screenName}
            name={screenName}
            options={{ href: null, tabBarStyle: { display: "none" } }}
          />
        ))}
      </Tabs>

      <CameraActionModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* COACHMARK STEP 1: Spotlight the Home screen "Scan a Room" button. */}
      {homeStep === 1 && homeScanButtonRect && (
        <CoachmarkOverlay
          title="Start Your Safety Check"
          stepText="1 of 2"
          description="Tap here to let the AI scan your environment for potential hazards."
          ctaLabel="Next"
          onNext={nextHomeStep}
          onSkip={dismissHomeTour}
          pointerSide="bottom"
          pointerOffset={140}
          // COACHMARK TUNE: adjust card position here.
          positionStyle={{ left: 16, right: 16, bottom: 500 }}
          spotlightRect={homeScanButtonRect}
          // COACHMARK TUNE: match button roundness.
          spotlightRadius={20}
        />
      )}

      {homeStep === 2 && (
        <CoachmarkOverlay
          title="Be Prepared"
          stepText="2 of 2"
          description="Read these quick guides anytime to learn how to mitigate risks and handle emergencies."
          ctaLabel="Got It!"
          onNext={nextHomeStep}
          onSkip={dismissHomeTour}
          pointerSide="bottom"
          pointerOffset={44}
          positionStyle={{ right: 130, top: 245 }}
          spotlightRect={{ x: 10, y: 520, width: 390, height: 265 }}
          // COACHMARK TUNE: match button roundness.
          spotlightRadius={20}
        />
      )}
    </>
  );
}
