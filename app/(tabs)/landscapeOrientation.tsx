import ArrowIcon from "@/assets/icons/ArrowIcon";
import Button from "@/components/Button";
import i18n from "@/languages/i18n";
import { router, useFocusEffect } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Text, View, useWindowDimensions } from "react-native";

export default function LandscapeOrientationScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
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
      // Unlock all orientations for this page
      ScreenOrientation.unlockAsync();

      return () => {
        // Lock back to portrait when leaving
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP,
        );
      };
    }, []),
  );

  return (
    <View
      className={`flex-1 bg-surface-default px-8 ${
        isLandscape ? "items-center justify-center" : "pt-48"
      }`}
    >
      <View
        className={`absolute ${isLandscape ? "top-4" : "top-8"} right-4 z-10`}
      >
        <Button
          label={currentLanguage === "en" ? "TL" : "EN"}
          variant="secondary"
          className="w-16"
          onPress={() => {
            i18n.changeLanguage(currentLanguage === "en" ? "tl" : "en");
          }}
        />
      </View>
      <View className="items-center">
        {/* Robot */}
        <View
          className={`items-center justify-center ${isLandscape ? "mb-2" : "mb-8"}`}
        >
          <Image
            source={require("@/assets/mascot/MascotPhone.png")}
            style={
              isLandscape
                ? { width: 160, height: 180 }
                : { width: 201, height: 229 }
            }
          />
        </View>
      </View>

      <View className="items-center">
        <Text
          className={`text-xl font-text font-semibold mb-3 leading-tight text-center`}
        >
          {t("landscape_screen.instruction")}
        </Text>

        <Text
          className={`text-md font-text mb-6 text-center ${
            isLandscape ? "text-text-low" : "text-text-critical"
          }`}
        >
          {isLandscape
            ? t("landscape_screen.ready_message")
            : t("landscape_screen.not_landscape")}
        </Text>

        <Button
          label={t("landscape_screen.take_photo")}
          className={isLandscape ? "w-80" : "w-full"}
          disabled={!isLandscape}
          onPress={() => {
            router.push("/camera");
          }}
          icon={<ArrowIcon color="white" size={18} />}
          iconPosition="right"
        />
      </View>
    </View>
  );
}
