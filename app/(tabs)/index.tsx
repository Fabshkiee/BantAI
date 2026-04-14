import ScanIcon from "@/assets/icons/ScanIcon";
import ArticleCard from "@/components/ArticleCard";
import Button from "@/components/Button";
import { useCoachmarks } from "@/context/CoachmarkContext";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Image, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { startHomeTour } = useCoachmarks();

  useFocusEffect(
    useCallback(() => {
      startHomeTour();
    }, [startHomeTour]),
  );

  return (
    <View className="flex-1 bg-surface-default">
      <ScrollView
        className="flex-1 px-7 mt-9"
        contentContainerClassName="pb-40"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-14">
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
              Ready for a Safety Check?
            </Text>
            <Button
              label="Scan a Room"
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
              Disaster Risk Reduction Guides
            </Text>
            <ArticleCard />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
