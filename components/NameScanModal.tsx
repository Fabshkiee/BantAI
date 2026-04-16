import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "./Button";

type NameScanModalProps = {
  isVisible: boolean;
  onSave: (name: string) => void;
  onClose: () => void;
  defaultName?: string;
};

const SUGGESTIONS = [
  "Living Room",
  "Kitchen",
  "Master Bedroom",
  "Bedroom 2",
  "Bathroom",
  "Dining Area",
  "Basement",
  "Attic",
  "Garage",
];

export default function NameScanModal({
  isVisible,
  onSave,
  onClose,
  defaultName = "",
}: NameScanModalProps) {
  const { t } = useTranslation();
  const [roomName, setRoomName] = useState(defaultName);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (isVisible) {
      setRoomName(defaultName);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, defaultName, fadeAnim, slideAnim]);

  const handleSave = () => {
    if (roomName.trim()) {
      onSave(roomName.trim());
    } else {
      onSave("Unnamed Scan");
    }
    onClose();
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Pressable className="flex-1" onPress={Keyboard.dismiss}>
          <Animated.View
            style={{ opacity: fadeAnim }}
            className="flex-1 bg-black/60 items-center justify-center px-6"
          >
            <Animated.View
              style={{ transform: [{ translateY: slideAnim }] }}
              className="bg-surface-default w-full rounded-3xl p-6 shadow-2xl"
            >
              <Text className="text-h3 font-bold text-text-default mb-2">
                {t("name_scan_modal.title", "Name your scan")}
              </Text>
              <Text className="text-md text-text-subtle mb-6">
                {t(
                  "name_scan_modal.description",
                  "Give this room a name to easily identify it in your scan history.",
                )}
              </Text>

              <View className="mb-6">
                <TextInput
                  value={roomName}
                  onChangeText={setRoomName}
                  placeholder={t(
                    "name_scan_modal.placeholder",
                    "e.g. Living Room",
                  )}
                  className="bg-surface-light border border-border-secondary rounded-xl px-4 py-4 text-lg font-text text-text-default"
                  autoFocus
                  maxLength={40}
                />
              </View>

              <Text className="text-sm font-semibold text-text-subtle mb-3 uppercase tracking-wider">
                {t("name_scan_modal.suggestions", "Suggestions")}
              </Text>

              <View className="flex-row flex-wrap gap-2 mb-8 overflow-hidden">
                {SUGGESTIONS.map((suggestion) => (
                  <Pressable
                    key={suggestion}
                    onPress={() => setRoomName(suggestion)}
                    className={`px-4 py-2 rounded-full border ${
                      roomName === suggestion
                        ? "bg-surface-critical/10 border-text-low"
                        : "bg-surface-default border-border-secondary"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        roomName === suggestion
                          ? "text-text-low"
                          : "text-text-default"
                      }`}
                    >
                      {suggestion}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View className="flex-row gap-3">
                <Button
                  label={t("common.skip", "Skip")}
                  variant="secondary"
                  className="flex-1"
                  onPress={() => {
                    onSave("Unnamed Room");
                    onClose();
                  }}
                />
                <Button
                  label={t("common.save", "Save")}
                  className="flex-1"
                  onPress={handleSave}
                />
              </View>
            </Animated.View>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
