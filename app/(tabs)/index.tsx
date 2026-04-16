import ScanIcon from "@/assets/icons/ScanIcon";
import ArticleCard from "@/components/ArticleCard";
import Button from "@/components/Button";
import TopNavBar from "@/components/TopBar";
import { resetOnboardingState } from "@/lib/onboardingStorage";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleRestartOnboarding = async () => {
    await resetOnboardingState();
    router.replace("/onboarding");
  };

  return (
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
            <Button
              label={t("home_screen.scan_room")}
              icon={<ScanIcon color="white" size={24} />}
              iconPosition="left"
              onPress={() => {
                router.push("/photoInstructions");
              }}
              className="w-full"
            />
            <Button
              label="Restart Onboarding"
              variant="secondary"
              onPress={() => {
                void handleRestartOnboarding();
              }}
              className="w-full"
            />
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
  );
}
