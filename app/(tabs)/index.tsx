import ScanIcon from "@/assets/icons/ScanIcon";
import ArticleCard from "@/components/ArticleCard";
import Button from "@/components/Button";
import i18n from "@/languages/i18n";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

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
      className="flex-1 mt-9 bg-surface-default"
      contentContainerClassName="pb-40"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-7">
        {/*SIXSEBEN */}
        {/* Navigation Bar COntainer*/}
        <View
          className="flex-row justify-between items-center w-full h-[80px] bg-white mt-[12.66px] px-10  z-50 shadow-sm"
          style={{ elevation: 12 }}
        >
          {/*Bantais Logo and TItle*/}
          <View className="flex-row items-center gap-[5.89px] ">
            <Image
              source={require("@/assets/logo/horizontal.png")}
              className="w-48  h-60"
              resizeMode="contain"
            />
          </View>

          {/*Language tOGGLE DROPDOWN*/}
          <View className="relative z-50 ">
            <Pressable
              onPress={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex-row items-center px-3 py-2 rounded-lg shadow-sm active:opacity-80 justify-center bg-gray-50 border border-gray-200 w-20 h-12"
            >
              <Image
                source={
                  currentLanguage === "en"
                    ? require("@/assets/images/US-Flag.jpg")
                    : require("@/assets/images/PH-Flag.jpg")
                }
                className="w-8 h-6 rounded-sm"
                resizeMode="cover"
              />

              {/* IMAGE DROPDOWN ARROW */}
              <Image
                source={require("@/assets/images/ArrowDropDown.png")}
                className="w-3 h-3 ml-2"
                resizeMode="contain"
                style={{
                  transform: [{ rotate: isLangMenuOpen ? "180deg" : "0deg" }],
                }}
              />
            </Pressable>

            {/* The menu after pressing the button*/}
            {isLangMenuOpen && (
              <View className="absolute top-12 right-0 w-44 bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 h-auto ">
                {/* English Option */}
                <Pressable
                  className={`flex-row items-center gap-4 px-3 py-4 active:bg-gray-50 ${
                    currentLanguage === "en" ? "bg-blue-50" : ""
                  }`}
                  onPress={() => {
                    i18n.changeLanguage("en");
                    setIsLangMenuOpen(false);
                  }}
                >
                  <Image
                    source={require("@/assets/images/US-Flag.jpg")}
                    className="w-8 h-6 rounded-sm border border-gray-200"
                    resizeMode="cover"
                  />
                  <Text className="font-extrabold text-lg text-black-500">
                    {t("common.english")}
                  </Text>
                </Pressable>

                <View className="h-[1px] w-full bg-gray-200" />

                {/* Tagalog Option */}
                <Pressable
                  className={`flex-row items-center gap-3 px-4 py-3 active:bg-gray-100 ${
                    currentLanguage === "tl" ? "bg-blue-50" : ""
                  }`}
                  onPress={() => {
                    i18n.changeLanguage("tl");
                    setIsLangMenuOpen(false);
                  }}
                >
                  <Image
                    source={require("@/assets/images/PH-Flag.jpg")}
                    className="w-8 h-6 rounded-sm border border-gray-200"
                    resizeMode="cover"
                  />
                  <Text className="font-extrabold text-lg text-black-500">
                    {t("common.tagalog")}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* Container to seperate nav bar and the actual content */}

        <View className="px-7">
          {/* Hero Section */}
          <View className="justify-center items-center gap-4">
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
