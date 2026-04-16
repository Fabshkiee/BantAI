import ArrowIcon from "@/assets/icons/ArrowIcon";
import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import Button from "@/components/Button";
import LanguageSelector from "@/components/LanguageSelector";
import i18n from "@/languages/i18n";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Image, Pressable, Text, View } from "react-native";

const HEADER_HEIGHT = 80;

export default function fireArticle() {
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
        <LanguageSelector />
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
                source={require("@/assets/images/fire.jpg")}
                className="w-full h-[420px]"
                resizeMode="cover"
              />
            </View>
            <View className="bg-surface-light mx-[-36px] px-9 mt-[-12px] py-3 border-border-secondary border-b border-t">
              <Text className="leading-7 text-sm text-text-subtle">
                Image Courtesy: CritterGuard
              </Text>
            </View>

            <Text className="text-h3 font-bold leading-8">
              {t("articles.fire.title")}
            </Text>

            <Text className="leading-7 text-text-subtle">
              {t("articles.fire.source")}
            </Text>
          </View>

          <View className="gap-10">
            <Text className="leading-7 text-xl">
              {t("articles.fire.intro")}
            </Text>

            <View className="gap-4">
              <Text className="text-2xl font-medium leading-7">
                {t("articles.fire.understanding_fire_title")}
              </Text>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.fire.fire_fast_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.fire.fire_fast_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.fire.fire_hot_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.fire.fire_hot_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.fire.fire_dark_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.fire.fire_dark_content")}
                </Text>
              </View>
            </View>

            <View className="gap-4">
              <Text className="text-2xl font-medium leading-7">
                {t("articles.fire.preparation_title")}
              </Text>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.fire.map_exits_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.fire.map_exits_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.fire.practice_escape_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.fire.practice_escape_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.fire.sleep_safely_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.fire.sleep_safely_content")}
                </Text>
              </View>
            </View>

            <View className="gap-4">
              <Text className="text-2xl font-medium leading-7">
                {t("articles.fire.prevention_title")}
              </Text>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.fire.safe_cooking_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.fire.safe_cooking_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.fire.electrical_safety_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.fire.electrical_safety_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.fire.protect_children_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.fire.protect_children_content")}
                </Text>
              </View>
            </View>

            <View className="gap-4">
              <Text className="text-2xl font-medium leading-7">
                {t("articles.fire.during_fire_title")}
              </Text>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.fire.crawl_low_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.fire.crawl_low_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.fire.feel_doors_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.fire.feel_doors_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.fire.if_trapped_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.fire.if_trapped_content")}
                </Text>
              </View>

              <View>
                <Text className="leading-7 font-medium text-xl">
                  {"\u2022"} {t("articles.fire.stop_drop_roll_title")}
                </Text>
                <Text className="leading-7 ml-4 text-xl">
                  {t("articles.fire.stop_drop_roll_content")}
                </Text>
              </View>
            </View>

            <View className="gap-4">
              <Text className="leading-7 text-xl">
                {t("articles.fire.closing_text")}
              </Text>
              <Text className="leading-7 italic text-xl">
                {t("articles.fire.closing_text_italic")}
              </Text>
            </View>

            <View className="h-[2px] bg-border-secondary my-4" />

            <View className="bg-surface-light p-4 rounded-xl border border-border-secondary/30 gap-1 mb-2">
              <Text className="text-xl font-bold text-text-subtle uppercase tracking-wider mb-1">
                {t("articles.common.source_information")}
              </Text>
              <Text className="leading-6 text-xl">
                {t("articles.fire.source_info")}
              </Text>

              <Pressable
                className="mt-1 active:opacity-70"
                onPress={() => {
                  router.push("https://www.ready.gov/home-fires");
                }}
              >
                <Text className="leading-6 text-blue-600 font-semibold text-xl">
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
                    router.replace("/articles/typhoonArticle");
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
                    router.replace("/articles/earthquakeArticle");
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
