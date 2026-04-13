import ScanIcon from "@/assets/icons/ScanIcon";
import ArticleCard from "@/components/ArticleCard";
import Button from "@/components/Button";
import i18n from "@/languages/i18n";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
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

  return (
    <ScrollView
      className="flex-1 px-7 mt-9 bg-surface-default"
      contentContainerClassName="pb-40"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-14">
        {/* Language Toggle Button */}
        <View className="flex-row justify-end">
          <Button
            label={currentLanguage === "en" ? "TL" : "EN"}
            variant="secondary"
            className="w-16"
            onPress={() => {
              i18n.changeLanguage(currentLanguage === "en" ? "tl" : "en");
            }}
          />
        </View>

        {/* Hero Section */}
        <View className="justify-center items-center gap-4">
          <Image
            source={require("@/assets/logo/horizontal.png")}
            className="flex w-52 h-14 mt-5"
            resizeMode="contain"
          />
          <Image
            source={require("@/assets/mascot/MascotWave.png")}
            className="flex w-[250px] h-[250px] ml-5"
            resizeMode="contain"
          />
          <Text className="text-h3 font-bold mt-4">
            {t("home_screen.ready_title")}
          </Text>
          <Button
            label={t("home_screen.scan_room")}
            icon={<ScanIcon size={24} />}
            iconPosition="left"
            onPress={() => {
              router.push("/photoInstructions");
            }}
            className="w-full "
          />
        </View>

        {/* Articles */}
        <View>
          <Text className="text-h3 font-bold mb-4 ">
            {t("home_screen.articles_title")}
          </Text>
          <ArticleCard />
        </View>
      </View>
    </ScrollView>
  );
}
