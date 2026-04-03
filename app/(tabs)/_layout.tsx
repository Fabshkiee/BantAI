import CameraIcon from "@/assets/icons/CameraIcon";
import HistoryIcon from "@/assets/icons/HistoryIcon";
import HomeIcon from "@/assets/icons/HomeIcon";
import * as ImagePicker from "expo-image-picker";
import { router, Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Modal, Pressable, Text, View } from "react-native";

export default function TabLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Animated value starting off-screen
  const slideAnim = useRef(new Animated.Value(400)).current;

  // Automatically slide up when the modal opens
  useEffect(() => {
    if (isModalOpen) {
      slideAnim.setValue(400); // Reset position
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isModalOpen]);

  // Slide down before unmounting the modal
  const closeModal = (callback?: () => void) => {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsModalOpen(false);
      if (callback) callback();
    });
  };

  const handleCamera = () => {
    closeModal(async () => {
      router.push("/camera");
    });
  };

  const handleOpenGallery = () => {
    closeModal(async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Needed",
          "We need gallery permissions to select a photo.",
        );
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        console.log("Photo selected:", result.assets[0].uri);
      }
    });
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#006ec2",
          tabBarInactiveTintColor: "#84888c",
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarStyle: {
            backgroundColor: "#f0f8ff",
            borderStartWidth: 2,
            borderTopWidth: 2,
            borderEndWidth: 2,
            borderColor: "#e5e5e5",
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            paddingBottom: 28,
            paddingTop: 16,
            bottom: 38,
            position: "absolute",
            shadowOpacity: 0,
            elevation: 0,
          },
          tabBarLabelStyle: {
            fontFamily: "Inter",
            fontSize: 16,
            fontWeight: "bold",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIconStyle: { paddingBottom: 8 },
            tabBarIcon: ({ color }) => <HomeIcon color={color} size={40} />,
          }}
        />

        {/* The Intercepted Camera Screen */}
        <Tabs.Screen
          name="photoInstructions"
          options={{
            title: "",
            tabBarButton: () => (
              <Pressable
                onPress={() => setIsModalOpen(true)}
                className="active:scale-95 transition-all flex-1 items-center justify-center"
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
          name="history"
          options={{
            title: "History",
            tabBarIconStyle: { paddingBottom: 8 },
            tabBarIcon: ({ color }) => <HistoryIcon color={color} size={32} />,
          }}
        />

        {/* Hidden Screens */}
        <Tabs.Screen
          name="landscapeOrientation"
          options={{ href: null, tabBarStyle: { display: "none" } }}
        />
        <Tabs.Screen
          name="camera"
          options={{ href: null, tabBarStyle: { display: "none" } }}
        />
        <Tabs.Screen
          name="loadingScreen"
          options={{ href: null, tabBarStyle: { display: "none" } }}
        />
        <Tabs.Screen
          name="safetyReport"
          options={{ href: null, tabBarStyle: { display: "none" } }}
        />
        <Tabs.Screen
          name="articles/earthquakeArticle"
          options={{ href: null, tabBarStyle: { display: "none" } }}
        />
        <Tabs.Screen
          name="articles/typhoonArticle"
          options={{ href: null, tabBarStyle: { display: "none" } }}
        />
        <Tabs.Screen
          name="articles/fireArticle"
          options={{ href: null, tabBarStyle: { display: "none" } }}
        />
      </Tabs>

      <Modal
        visible={isModalOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => closeModal()}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => closeModal()}
        >
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <Pressable
              className="bg-white rounded-t-3xl p-6 pb-10 gap-3 shadow-xl border-t border-gray-200"
              onPress={(e) => e.stopPropagation()}
            >
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
                onPress={() => closeModal()}
              >
                <Text className="text-text-subtle font-semibold text-lg">
                  Cancel
                </Text>
              </Pressable>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}
