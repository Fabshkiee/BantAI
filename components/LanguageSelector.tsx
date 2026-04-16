import DropDownIcon from "@/assets/icons/DropDownIcon";
import PHFlagIcon from "@/assets/icons/PHFlagIcon";
import USFlagIcon from "@/assets/icons/USFlagIcon";
import i18n from "@/languages/i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

export default function LanguageSelector() {
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

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsLangMenuOpen(false);
  };

  return (
    <View className="relative z-50">
      <Pressable
        onPress={() => setIsLangMenuOpen(!isLangMenuOpen)}
        className="flex-row items-center gap-2 px-3 py-2 rounded-lg shadow-sm active:opacity-80 justify-center bg-surface-default border border-border-secondary w-20 h-12"
      >
        {currentLanguage === "en" ? (
          <USFlagIcon size={24} />
        ) : (
          <PHFlagIcon size={24} />
        )}

        <View
          style={{
            transform: [{ rotate: isLangMenuOpen ? "180deg" : "0deg" }],
          }}
        >
          <DropDownIcon size={24} />
        </View>
      </Pressable>

      {isLangMenuOpen && (
        <View className="absolute top-14 right-0 w-44 bg-surface-default rounded-lg shadow-xl overflow-hidden border border-border-secondary h-auto">
          <Pressable
            className={`flex-row items-center gap-4 px-3 py-4 active:opacity-70 ${
              currentLanguage === "en" ? "bg-surface-primary/10" : ""
            }`}
            onPress={() => changeLanguage("en")}
          >
            <USFlagIcon size={24} />
            <Text className="font-extrabold text-lg text-text-default">
              {t("common.english")}
            </Text>
          </Pressable>

          <View className="h-[1px] w-full bg-border-secondary" />

          <Pressable
            className={`flex-row items-center gap-3 px-4 py-3 active:opacity-70 ${
              currentLanguage === "tl" ? "bg-surface-primary/10" : ""
            }`}
            onPress={() => changeLanguage("tl")}
          >
            <PHFlagIcon size={24} />
            <Text className="font-extrabold text-lg text-text-default">
              {t("common.tagalog")}
            </Text>
          </Pressable>

          <View className="h-[1px] w-full bg-border-secondary" />

          <Pressable
            className={`flex-row items-center gap-3 px-4 py-3 active:opacity-70 ${
              currentLanguage === "hil" ? "bg-surface-primary/10" : ""
            }`}
            onPress={() => changeLanguage("hil")}
          >
            <PHFlagIcon size={24} />
            <Text className="font-extrabold text-lg text-text-default">
              {t("common.hiligaynon")}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
