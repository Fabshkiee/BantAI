import ArrowIcon from "@/assets/icons/ArrowIcon";
import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import Button from "@/components/Button";
import i18n from "@/languages/i18n";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Image, Pressable, Text, View } from "react-native";

const HEADER_HEIGHT = 80;

export default function typhoonArticle() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollYClamped = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);
  const fadeAnim = useRef(new Animated.Value(0)).current;
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
    useCallback(() => {
      fadeAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]),
  );

  const translateY = scrollYClamped.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
  });

  return (
    <View className="bg-surface-default mt-9 mb-14">
      <Animated.View
        style={{ transform: [{ translateY }] }}
        className="absolute top-[-12px] left-0 right-0 z-10 pt-8 px-6 flex-row justify-between"
      >
        <View className="rounded-full self-start overflow-hidden shadow-sm">
          <Button
            label={t("common.return")}
            variant="return"
            icon={<ArrowLeftIcon size={18} />}
            iconPosition="left"
            onPress={() => {
              router.replace("/");
            }}
          />
        </View>
        <View className="rounded-full overflow-hidden shadow-sm">
          <Button
            label={currentLanguage === "en" ? "TL" : "EN"}
            variant="secondary"
            className="w-16"
            onPress={() => {
              i18n.changeLanguage(currentLanguage === "en" ? "tl" : "en");
            }}
          />
        </View>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-9 pb-12 gap-6"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          <View className="gap-3">
            <View className="mx-[-36px]">
              <Image
                source={require("@/assets/images/typhoon.jpg")}
                className="w-full h-[420px]"
                resizeMode="cover"
              />
            </View>
            <View className="bg-surface-light mx-[-36px] px-9 mt-[-12px] py-3 border-border-secondary border-b border-t">
              <Text className="leading-7 text-sm text-text-subtle">
                Image Courtesy: FreePik
              </Text>
            </View>

            <Text className="text-h3 font-bold leading-8">
              {t("articles.typhoon.title")}
            </Text>

            <Text className="leading-7 text-text-subtle">
              {t("articles.typhoon.source")}
            </Text>
          </View>

          <View className="gap-10">
            <Text className="leading-7 text-xl">
              {t("articles.typhoon.intro")}
            </Text>

            <View className="gap-4">
              <Text className="text-2xl font-medium leading-7">
                {t("articles.typhoon.exterior_title")}
              </Text>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.typhoon.inspect_roof_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.typhoon.inspect_roof_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.typhoon.clear_gutters_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.typhoon.clear_gutters_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.typhoon.trim_trees_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.typhoon.trim_trees_content")}
                </Text>
              </View>
            </View>

            <View className="gap-4">
              <Text className="text-2xl font-medium leading-7">
                {t("articles.typhoon.interior_title")}
              </Text>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.typhoon.secure_windows_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.typhoon.secure_windows_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.typhoon.check_wiring_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.typhoon.check_wiring_content")}
                </Text>
              </View>
            </View>

            <View className="gap-4">
              <Text className="text-2xl font-medium leading-7">
                {t("articles.typhoon.supplies_title")}
              </Text>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.typhoon.stock_pantry_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.typhoon.stock_pantry_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.typhoon.emergency_kit_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.typhoon.emergency_kit_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.typhoon.store_water_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.typhoon.store_water_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.typhoon.protect_documents_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.typhoon.protect_documents_content")}
                </Text>
              </View>
            </View>

            <View className="gap-4">
              <Text className="text-2xl font-medium leading-7">
                {t("articles.typhoon.family_title")}
              </Text>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.typhoon.emergency_numbers_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.typhoon.emergency_numbers_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.typhoon.plan_evacuation_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.typhoon.plan_evacuation_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.typhoon.check_loved_ones_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.typhoon.check_loved_ones_content")}
                </Text>
              </View>
            </View>

            <Text className="leading-7 italic text-xl">
              {t("articles.typhoon.closing_text")}
            </Text>

            <View className="h-[2px] bg-border-secondary my-4" />

            <View className="bg-surface-light p-4 rounded-xl border border-border-secondary/30 gap-1 mb-2">
              <Text className="text-xl font-bold text-text-subtle uppercase tracking-wider mb-1">
                {t("articles.common.source_information")}
              </Text>
              <Text className="leading-6 text-xl">
                {t("articles.typhoon.source_info")}
              </Text>

              <Pressable
                className="mt-1 active:opacity-70"
                onPress={() => {
                  router.push(
                    "https://www.camella.com.ph/preparing-your-home-for-the-rainy-season/",
                  );
                }}
              >
                <Text className="text-xl leading-6 text-blue-600 font-semibold">
                  {t("articles.common.read_original_article")}
                </Text>
              </Pressable>
            </View>
          </View>

          <View className="mt-4 gap-5">
            <Text className="text-xl font-bold text-text-main">
              {t("articles.common.more_articles")}
            </Text>

            <View className="justify-between flex-row items-center">
              <View className="w-[110px] h-auto">
                <Button
                  label={t("articles.common.previous")}
                  variant="return"
                  icon={<ArrowLeftIcon size={18} />}
                  iconPosition="left"
                  onPress={() => {
                    router.replace("/articles/earthquakeArticle");
                  }}
                />
              </View>
              <View className="w-[110px] h-auto">
                <Button
                  label={t("articles.common.next")}
                  variant="return"
                  icon={<ArrowIcon size={18} />}
                  iconPosition="right"
                  onPress={() => {
                    router.replace("/articles/fireArticle");
                  }}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}
