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

const LANGUAGE_SCREEN_STYLES = {
  container: "flex-1 items-center mt-6",
  image: "w-[280px] h-[280px] mt-14",
  imageOffset: { x: 0, y: 0 },
  title: "text-h2 text-center font-bold text-text-default mt-2",
  subtitle: "text-md text-center text-text-default mt-4 mb-8",
  languageListContainer: "w-full gap-3",
};

const SLIDE_1_STYLES = {
  container: "flex-1 items-center mt-8 relative",
  image: "w-[280px] h-[280px] mt-14",
  imageOffset: { x: 15, y: 0 },
  title: "text-h2 text-center font-bold text-text-default mt-5",
  description: "text-md text-center text-text-default mt-5 px-2",
  dotsContainer:
    "absolute bottom-10 left-0 right-0 flex-row items-center justify-center gap-3",
};

const SLIDE_2_STYLES = {
  container: "flex-1 items-center mt-8 relative",
  image: "w-[280px] h-[280px] mt-14",
  imageOffset: { x: -10, y: 0 },
  title: "text-h2 text-center font-bold text-text-default mt-5",
  description: "text-md text-center text-text-default mt-5 px-2",
  dotsContainer:
    "absolute bottom-10 left-0 right-0 flex-row items-center justify-center gap-3",
};

const SLIDE_3_STYLES = {
  container: "flex-1 items-center mt-8 relative",
  image: "w-[280px] h-[280px] mt-14",
  imageOffset: { x: 0, y: 0 },
  title: "text-h2 text-center font-bold text-text-default mt-5",
  description: "text-md text-center text-text-default mt-5 px-2",
  dotsContainer:
    "absolute bottom-10 left-0 right-0 flex-row items-center justify-center gap-3",
};

const getSlideStyles = (index: number) => {
  switch (index) {
    case 1:
      return SLIDE_1_STYLES;
    case 2:
      return SLIDE_2_STYLES;
    case 3:
      return SLIDE_3_STYLES;
    default:
      return SLIDE_1_STYLES;
  }
};

const getImageOffsetStyle = (offset: { x: number; y: number }) => ({
  transform: [{ translateX: offset.x }, { translateY: offset.y }],
});

const LANGUAGE_SCREEN_BUTTON_STYLES = {
  ctaContainer: "w-full gap-5",
  ctaButton: "w-full bg-surface-primary rounded-full items-center py-5",
  ctaContent: "flex-row items-center justify-center gap-3",
  ctaText: "text-text-inverse text-2xl font-bold",
  skipButton: "items-center py-2",
  skipText: "text-text-subtle text-2xl font-semibold",
  spacer: "h-[40px]",
};

const SLIDE_1_BUTTON_STYLES = {
  ctaContainer: "w-full gap-5",
  ctaButton: "w-full bg-surface-primary rounded-full items-center py-5",
  ctaContent: "flex-row items-center justify-center gap-3",
  ctaText: "text-text-inverse text-2xl font-bold",
  skipButton: "items-center py-2",
  skipText: "text-text-subtle text-2xl font-semibold mb-24",
  spacer: "h-[40px]",
};

const SLIDE_2_BUTTON_STYLES = {
  ctaContainer: "w-full gap-5",
  ctaButton: "w-full bg-surface-primary rounded-full items-center py-5",
  ctaContent: "flex-row items-center justify-center gap-3",
  ctaText: "text-text-inverse text-2xl font-bold",
  skipButton: "items-center py-2",
  skipText: "text-text-subtle text-2xl font-semibold mb-24",
  spacer: "h-[40px]",
};

const SLIDE_3_BUTTON_STYLES = {
  ctaContainer: "w-full gap-5",
  ctaButton: "w-full bg-surface-primary rounded-full items-center py-5",
  ctaContent: "flex-row items-center justify-center gap-3",
  ctaText: "text-text-inverse text-2xl font-bold",
  skipButton: "items-center py-2",
  skipText: "text-text-subtle text-2xl font-semibold mb-24",
  spacer: "h-[40px]",
};

const getButtonStyles = (index: number) => {
  switch (index) {
    case 0:
      return LANGUAGE_SCREEN_BUTTON_STYLES;
    case 1:
      return SLIDE_1_BUTTON_STYLES;
    case 2:
      return SLIDE_2_BUTTON_STYLES;
    case 3:
      return SLIDE_3_BUTTON_STYLES;
    default:
      return LANGUAGE_SCREEN_BUTTON_STYLES;
  }
};

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
      {stepIndex === 0 ? (
        <View className={LANGUAGE_SCREEN_STYLES.container}>
          <Image
            source={require("@/assets/mascot/MascotWave.png")}
            className={LANGUAGE_SCREEN_STYLES.image}
            style={getImageOffsetStyle(LANGUAGE_SCREEN_STYLES.imageOffset)}
            resizeMode="contain"
          />

          <Text className={LANGUAGE_SCREEN_STYLES.title}>
            Choose Your{"\n"}Language
          </Text>
          <Text className={LANGUAGE_SCREEN_STYLES.subtitle}>
            Piliin ang iyong wika / Pili-a ang imo lenggwahe.
          </Text>

          <View className={LANGUAGE_SCREEN_STYLES.languageListContainer}>
            {LANGUAGES.map((language) => {
              const isSelected = language === selectedLanguage;

              return (
                <Pressable
                  key={language}
                  onPress={() => setSelectedLanguage(language)}
                  className={`w-full rounded-2xl border px-5 py-4 flex-row items-center justify-between active:opacity-80 active:scale-95 ${
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
        </View>
      ) : (
        <View className={getSlideStyles(stepIndex).container}>
          <Image
            source={activeSlide?.image}
            className={getSlideStyles(stepIndex).image}
            style={getImageOffsetStyle(getSlideStyles(stepIndex).imageOffset)}
            resizeMode="contain"
          />

          <Text className={getSlideStyles(stepIndex).title}>
            {activeSlide?.title}
          </Text>
          <Text className={getSlideStyles(stepIndex).description}>
            {activeSlide?.description}
          </Text>

          <View className={getSlideStyles(stepIndex).dotsContainer}>
            {ONBOARDING_SLIDES.map((_, index) => {
              const isActive = index + 1 === stepIndex;
              return (
                <View
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    isActive ? "bg-surface-primary" : "bg-border-secondary"
                  }`}
                />
              );
            })}
          </View>
        </View>
      )}

      <View className={getButtonStyles(stepIndex).ctaContainer}>
        <Pressable
          onPress={() => {
            void nextStep();
          }}
          className={getButtonStyles(stepIndex).ctaButton}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#f5faff" />
          ) : (
            <View className={getButtonStyles(stepIndex).ctaContent}>
              <Text className={getButtonStyles(stepIndex).ctaText}>
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
            className={getButtonStyles(stepIndex).skipButton}
            disabled={isSaving}
          >
            <Text className={getButtonStyles(stepIndex).skipText}>Skip</Text>
          </Pressable>
        ) : (
          <View className={getButtonStyles(stepIndex).spacer} />
        )}
      </View>
    </View>
  );
}
