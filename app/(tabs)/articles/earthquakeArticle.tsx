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

export default function earthquakeArticle() {
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
    <View className=" bg-surface-default mt-9 mb-14">
      {/* Animated Floating Pill Header */}
      <Animated.View
        style={{ transform: [{ translateY }] }}
        className="absolute -top-3 left-0 right-0 z-10 pt-8 px-6 flex-row justify-between"
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

      {/* Main Scrolling Content */}
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
            <View className="-mx-9">
              <Image
                source={require("@/assets/images/earthquake.jpg")}
                className="w-full h-[420px]"
                resizeMode="cover"
              />
            </View>
            <View className="bg-surface-light -mx-9 px-9 -mt-3 py-3 border-border-secondary border-b border-t">
              <Text className="leading-7 text-sm text-text-subtle ">
                Image Courtesy: CubeSmart
              </Text>
            </View>

            <Text className="text-h3 font-bold leading-8">
              {t("articles.earthquake.title")}
            </Text>

            <Text className="leading-7 text-text-subtle">
              {t("articles.earthquake.source")}
            </Text>
          </View>

          {/* Main Article */}
          <View className="gap-10">
            <Text className="leading-7 text-xl">
              {t("articles.earthquake.intro")}
            </Text>

            {/* 1. Lock Your Cabinets */}
            <View className="gap-2">
              <Text className="text-2xl font-medium leading-7">
                {t("articles.earthquake.section1_title")}
              </Text>
              <Text className="leading-7 text-xl">
                {t("articles.earthquake.section1_content")}
              </Text>
            </View>

            {/* 2. Keep Exits Clear */}
            <View className="gap-2">
              <Text className="text-2xl font-medium leading-7">
                {t("articles.earthquake.section2_title")}
              </Text>
              <Text className="leading-7 text-xl">
                {t("articles.earthquake.section2_content")}
              </Text>
            </View>

            {/* 3. Know How to Protect Yourself */}
            <View className="gap-2">
              <Text className="text-2xl font-medium leading-7">
                {t("articles.earthquake.section3_title")}
              </Text>
              <Text className="leading-7 text-xl">
                {t("articles.earthquake.section3_content")}
              </Text>
            </View>

            {/* 4. Anchor Heavy Furniture */}
            <View className="gap-2">
              <Text className="text-2xl font-medium leading-7">
                {t("articles.earthquake.section4_title")}
              </Text>
              <Text className="leading-7 text-xl">
                {t("articles.earthquake.section4_content")}
              </Text>
            </View>

            {/* 5. Secure Utilities & Flammables */}
            <View className="gap-2">
              <Text className="text-2xl font-medium leading-7">
                {t("articles.earthquake.section5_title")}
              </Text>
              <Text className="leading-7 text-xl">
                {t("articles.earthquake.section5_content")}
              </Text>
            </View>

            {/* 6. Secure Small Hazards */}
            <View className="gap-2">
              <Text className="text-2xl font-medium leading-7">
                {t("articles.earthquake.section6_title")}
              </Text>
              <Text className="leading-7 text-xl">
                {t("articles.earthquake.section6_content")}
              </Text>
            </View>

            {/* Divider */}
            <View className="h-[2px] bg-border-secondary my-4" />

            {/* Source Information */}
            <View className="bg-surface-light p-4 rounded-xl border border-border-secondary/30 gap-1 mb-2">
              <Text className="text-lg font-bold text-text-subtle uppercase tracking-wider mb-1">
                {t("articles.common.source_information")}
              </Text>
              <Text className="leading-6 text-lg">
                {t("articles.earthquake.source_info")}
              </Text>

              <Pressable
                className="mt-1 active:opacity-70"
                onPress={() => {
                  router.push(
                    "https://geovera.com/2024/01/30/earthquake-preparedness-at-home-6-tips/",
                  );
                }}
              >
                <Text className="leading-6 text-blue-600 font-semibold text-lg">
                  {t("articles.common.read_original_article")}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* More Articles Navigation */}
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
                    router.replace("/articles/fireArticle");
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
                    router.replace("/articles/typhoonArticle");
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
