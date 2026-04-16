import ScanIcon from "@/assets/icons/ScanIcon";
import ArticleCard from "@/components/ArticleCard";
import Button from "@/components/Button";
import TopNavBar from "@/components/TopBar";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1 mt-9 bg-surface-default"
      contentContainerClassName="pb-40"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-7 mb-14">
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
          </View>

          {/* Articles */}
          <View>
            <Text className="text-h3 font-bold mb-4 mt-10">
              {t("home_screen.articles_title")}
            </Text>
            <ArticleCard />
          </View>

          <Text className="text-h3 font-bold mb-4 mt-6">
              {t("Feeling Lost?")}
            </Text>
            <Text className="text-md mb-4 text-text-subtle mb-10">
              {t("Don't worry, we can show you around again! Tap the button below for a quick refresher on how to spot hazards and secure your space.")}
            </Text>

          <Button
              label="Replay App Tutorial"
              onPress={() => {
                router.push("/mockScreens");
              }}
              className="w-full"
            />
        </View>
      </View>
    </ScrollView>
  );
}
