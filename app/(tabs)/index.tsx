import ScanIcon from "@/assets/icons/ScanIcon";
import ArticleCard from "@/components/ArticleCard";
import Button from "@/components/Button";
import TopNavBar from "@/components/TopBar";
import { useCoachmarks } from "@/context/CoachmarkContext";
import { resetOnboardingState } from "@/lib/onboardingStorage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { startHomeTour, homeStep, setHomeScanButtonRect } = useCoachmarks();
  const scanButtonWrapperRef = useRef<any>(null);

  const restartOnboarding = async () => {
    await resetOnboardingState();
    router.replace("/onboarding");
  };

  useFocusEffect(
    useCallback(() => {
      startHomeTour();
    }, [startHomeTour]),
  );

  // COACHMARK TARGET: measure the real "Scan a Room" button location.
  const measureHomeScanButton = useCallback(() => {
    scanButtonWrapperRef.current?.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        if (!width || !height) {
          return;
        }
        setHomeScanButtonRect({ x, y, width, height });
      },
    );
  }, [setHomeScanButtonRect]);

  useEffect(() => {
    if (homeStep === 1) {
      const timer = setTimeout(measureHomeScanButton, 0);
      return () => clearTimeout(timer);
    }
  }, [homeStep, measureHomeScanButton]);

  useEffect(() => {
    return () => setHomeScanButtonRect(null);
  }, [setHomeScanButtonRect]);

  return (
    <View className="flex-1 bg-surface-default">
      <ScrollView
        className="flex-1 mt-9 bg-surface-default"
        contentContainerClassName="pb-40"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-7">
          <TopNavBar />

          {/* Container to seperate nav bar and the actual content */}
          <View className="px-7">
            {/* Hero Section */}
            <View className="justify-center items-center gap-4">
              <Image
                source={require("@/assets/mascot/MascotWave.png")}
                className="flex w-[250px] h-[250px] ml-5"
                resizeMode="contain"
              />
              <Text className="text-h3 font-bold mt-4 text-center">
                {t("home_screen.ready_title")}
              </Text>
              <View
                ref={scanButtonWrapperRef}
                onLayout={measureHomeScanButton}
                className="w-full"
              >
                <Button
                  label={t("home_screen.scan_room")}
                  icon={<ScanIcon color="white" size={24} />}
                  iconPosition="left"
                  onPress={() => {
                    router.push("/photoInstructions");
                  }}
                  className="w-full"
                />
              </View>

              {__DEV__ ? (
                <Pressable
                  onPress={() => {
                    void restartOnboarding();
                  }}
                  className="mt-3 rounded-full border border-dashed border-border-primary px-5 py-3"
                >
                  <Text className="text-text-primary font-semibold text-base">
                    Restart onboarding
                  </Text>
                </Pressable>
              ) : null}
            </View>

            {/* Articles */}
            <View>
              <Text className="text-h3 font-bold mb-4 mt-10">
                {t("home_screen.articles_title")}
              </Text>
              <ArticleCard />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
