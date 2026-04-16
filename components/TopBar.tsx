import DropDownIcon from "@/assets/icons/DropDownIcon";
import PHFlagIcon from "@/assets/icons/PHFlagIcon";
import USFlagIcon from "@/assets/icons/USFlagIcon";
import NotificationButton from "@/components/NotificationButton";
import i18n from "@/languages/i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";

export default function TopNavBar() {
  const { t } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleLanguageChanged = () => {
      setCurrentLanguage(i18n.language);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  return (
    <View className="flex-row justify-between items-center w-full h-32 bg-surface-default  px-10 z-50 shadow-lg">
      {/* BantAI Logo and Title */}
      <View className="flex-row items-center gap-[5.89px]">
        <Image
          source={require("@/assets/logo/horizontal.png")}
          className="w-48 h-60"
          resizeMode="contain"
        />
      </View>

      {/* Actions Section: Notification + Language Toggle */}
      <View className="flex-row items-center gap-4 relative z-50">
        <NotificationButton size={45} />

        <View className="relative">
          <Pressable
            onPress={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex-row items-center gap-2 px-3 py-2 rounded-lg shadow-sm active:opacity-80 justify-center bg-surface-default border border-border-secondary w-20 h-10"
          >
          {currentLanguage === "en" ? (
            <USFlagIcon size={24} />
          ) : (
            <PHFlagIcon size={24} />
          )}

          {/* IMAGE DROPDOWN ARROW */}
          <View
            style={{
              transform: [{ rotate: isLangMenuOpen ? "180deg" : "0deg" }],
            }}
          >
            <DropDownIcon size={24} />
          </View>
        </Pressable>

        {/* The menu after pressing the button */}
        {isLangMenuOpen && (
          <View className="absolute top-14 right-0 w-44 bg-surface-default rounded-lg shadow-xl overflow-hidden border border-border-secondary h-auto">
            {/* English Option */}
            <Pressable
              className={`flex-row items-center gap-4 px-3 py-4 active:opacity-70 ${
                currentLanguage === "en" ? "bg-surface-primary/10" : ""
              }`}
              onPress={() => {
                i18n.changeLanguage("en");
                setIsLangMenuOpen(false);
              }}
            >
              <USFlagIcon size={24} />
              <Text className="font-extrabold text-lg text-text-default">
                {t("common.english")}
              </Text>
            </Pressable>

            <View className="h-[1px] w-full bg-border-secondary" />

            {/* Tagalog Option */}
            <Pressable
              className={`flex-row items-center gap-3 px-4 py-3 active:opacity-70 ${
                currentLanguage === "tl" ? "bg-surface-primary/10" : ""
              }`}
              onPress={() => {
                i18n.changeLanguage("tl");
                setIsLangMenuOpen(false);
              }}
            >
              <PHFlagIcon size={24} />
              <Text className="font-extrabold text-lg text-text-default">
                {t("common.tagalog")}
              </Text>
            </Pressable>

            <View className="h-[1px] w-full bg-border-secondary" />

            {/* Hiligaynon Option */}
            <Pressable
              className={`flex-row items-center gap-3 px-4 py-3 active:opacity-70 ${
                currentLanguage === "hil" ? "bg-surface-primary/10" : ""
              }`}
              onPress={() => {
                i18n.changeLanguage("hil");
                setIsLangMenuOpen(false);
              }}
            >
              <PHFlagIcon size={24} />
              <Text className="font-extrabold text-lg text-text-default">
                {t("common.hiligaynon")}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  </View>
);
}
