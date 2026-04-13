import ArrowIcon from "@/assets/icons/ArrowIcon";
import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import Button from "@/components/Button";
import i18n from "@/languages/i18n";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Image, Text, View } from "react-native";

export default function PhotoInstructionsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = React.useState(i18n.language);

  React.useEffect(() => {
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
      fadeAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]),
  );

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <View className="bg-surface-default px-8 pt-36">
        <View className="absolute top-0 left-0 right-0 px-6 pt-8 flex-row justify-between">
          <Button
            label={t("common.return")}
            variant="return"
            icon={<ArrowLeftIcon color="black" size={18} />}
            iconPosition="left"
            onPress={() => {
              router.back();
            }}
          />
          <Button
            label={currentLanguage === "en" ? "TL" : "EN"}
            variant="secondary"
            className="w-16"
            onPress={() => {
              i18n.changeLanguage(currentLanguage === "en" ? "tl" : "en");
            }}
          />
        </View>
        <View className="items-center w-full">
          <Text className="text-h2 font-display font-bold text-center mb-3 leading-tight">
            {t("photo_instructions_screen.title")}
          </Text>
          <Text className="text-lg text-center font-text leading-7 mb-9">
            {t("photo_instructions_screen.description")}
          </Text>

          {/* Image */}
          <View
            className="w-full rounded-2xl mb-9"
            style={{ overflow: "hidden", aspectRatio: 4 / 3 }}
          >
            <Image
              source={require("@/assets/images/room.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>

          <Button
            label={t("photo_instructions_screen.proceed")}
            className="w-full"
            onPress={() => {
              router.replace("/landscapeOrientation");
            }}
            icon={<ArrowIcon color="white" size={18} />}
            iconPosition="right"
          />
        </View>
      </View>
    </Animated.View>
  );
}
