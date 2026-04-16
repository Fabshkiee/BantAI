import ArrowIcon from "@/assets/icons/ArrowIcon";
import {
  hasCompletedOnboarding,
  markOnboardingCompleted,
} from "@/lib/onboardingStorage";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

type LanguageOption = "English" | "Tagalog" | "Hiligaynon";

const ONBOARDING_SLIDES = [
  {
    title: "Say Hello to BantAI",
    description:
      "Your smart companion for spotting hazards and creating a safer environment in seconds.",
    image: require("@/assets/mascot/MascotWave.png"),
  },
  {
    title: "Scan & Prepare",
    description:
      "Instantly scan your surroundings for risks, and access easy-to-follow disaster reduction guides to help you secure your space.",
    image: require("@/assets/mascot/MascotSearch.png"),
  },
  {
    title: "Ready to Scan Your Room?",
    description:
      "Secure your space in seconds. Let us do your first safety check!",
    image: require("@/assets/mascot/MascotPhone.png"),
  },
] as const;

const LANGUAGES: LanguageOption[] = ["English", "Tagalog", "Hiligaynon"];

export default function OnboardingScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageOption>("English");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const guardIfAlreadyCompleted = async () => {
      const completed = await hasCompletedOnboarding();
      if (completed && isMounted) {
        router.replace("/(tabs)");
      }
    };

    void guardIfAlreadyCompleted();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeSlide = useMemo(() => {
    if (stepIndex === 0) return null;
    return ONBOARDING_SLIDES[stepIndex - 1];
  }, [stepIndex]);

  const completeOnboarding = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      await markOnboardingCompleted();
      router.replace("/(tabs)");
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = async () => {
    if (stepIndex === 0) {
      setStepIndex(1);
      return;
    }

    if (stepIndex < ONBOARDING_SLIDES.length) {
      setStepIndex((prev) => prev + 1);
      return;
    }

    await completeOnboarding();
  };

  const ctaLabel =
    stepIndex === 0
      ? "Hello, Let's Get Started"
      : stepIndex === ONBOARDING_SLIDES.length
        ? "Get Started"
        : "Next";

  return (
    <View className="flex-1 bg-[#eef1f5] px-7 pt-10 pb-8">
      <View className="flex-1 items-center">
        <Image
          source={
            stepIndex === 0
              ? require("@/assets/mascot/MascotWave.png")
              : activeSlide?.image
          }
          className="w-[280px] h-[280px] mt-6"
          resizeMode="contain"
        />

        {stepIndex === 0 ? (
          <>
            <Text className="text-[50px] leading-[52px] text-center font-bold text-text-default mt-2">
              Choose Your{"\n"}Language
            </Text>
            <Text className="text-lg text-center text-text-default mt-4 mb-8">
              Piliin ang iyong wika / Pili-a ang imo lenggwahe.
            </Text>

            <View className="w-full gap-3">
              {LANGUAGES.map((language) => {
                const isSelected = language === selectedLanguage;

                return (
                  <Pressable
                    key={language}
                    onPress={() => setSelectedLanguage(language)}
                    className={`w-full rounded-2xl border px-5 py-4 flex-row items-center justify-between ${
                      isSelected
                        ? "border-border-primary bg-surface-light"
                        : "border-border-secondary bg-surface-default"
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-9 h-9 rounded-full bg-[#d7e9f8] items-center justify-center">
                        <Text className="text-xs font-semibold text-text-default">
                          {language === "English" ? "US" : "PH"}
                        </Text>
                      </View>
                      <Text
                        className={`text-xl ${
                          isSelected ? "text-text-primary" : "text-text-default"
                        }`}
                      >
                        {language}
                      </Text>
                    </View>

                    <View
                      className={`w-7 h-7 rounded-full border-2 items-center justify-center ${
                        isSelected
                          ? "border-border-primary"
                          : "border-border-secondary"
                      }`}
                    >
                      {isSelected ? (
                        <View className="w-4 h-4 rounded-full bg-surface-primary" />
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : (
          <>
            <Text className="text-[50px] leading-[52px] text-center font-bold text-text-default mt-5">
              {activeSlide?.title}
            </Text>
            <Text className="text-xl text-center text-text-default mt-5 px-2">
              {activeSlide?.description}
            </Text>

            <View className="flex-row items-center justify-center gap-3 mt-14">
              {ONBOARDING_SLIDES.map((_, index) => {
                const isActive = index + 1 === stepIndex;
                return (
                  <View
                    key={index}
                    className={`w-4 h-4 rounded-full ${
                      isActive ? "bg-surface-primary" : "bg-border-secondary"
                    }`}
                  />
                );
              })}
            </View>
          </>
        )}
      </View>

      <View className="w-full gap-5">
        <Pressable
          onPress={() => {
            void nextStep();
          }}
          className="w-full bg-surface-primary rounded-full items-center py-5"
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#f5faff" />
          ) : (
            <View className="flex-row items-center justify-center gap-3">
              <Text className="text-text-inverse text-2xl font-bold">
                {ctaLabel}
              </Text>
              <ArrowIcon color="#f5faff" size={22} />
            </View>
          )}
        </Pressable>

        {stepIndex > 0 ? (
          <Pressable
            onPress={() => {
              void completeOnboarding();
            }}
            className="items-center py-2"
            disabled={isSaving}
          >
            <Text className="text-text-subtle text-2xl font-semibold">
              Skip
            </Text>
          </Pressable>
        ) : (
          <View className="h-[40px]" />
        )}
      </View>
    </View>
  );
}
