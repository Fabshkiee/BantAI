import ScanIcon from "@/assets/icons/ScanIcon";
import ArticleCard from "@/components/ArticleCard";
import Button from "@/components/Button";
import { useCoachmarks } from "@/context/CoachmarkContext";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  type View as RNView,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { startHomeTour, homeStep, setHomeScanButtonRect } = useCoachmarks();
  const scanButtonWrapperRef = useRef<RNView>(null);

  useFocusEffect(
    useCallback(() => {
      startHomeTour();
    }, [startHomeTour]),
  );

  // COACHMARK TARGET: measure the real "Scan a Room" button location.
  const measureHomeScanButton = useCallback(() => {
    scanButtonWrapperRef.current?.measureInWindow((x, y, width, height) => {
      if (!width || !height) {
        return;
      }
      setHomeScanButtonRect({ x, y, width, height });
    });
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
            <View
              ref={scanButtonWrapperRef}
              onLayout={measureHomeScanButton}
              className="w-full"
            >
              <Button
                label="Scan a Room"
                icon={<ScanIcon color="white" size={24} />}
                iconPosition="left"
                onPress={() => {
                  router.push("/photoInstructions");
                }}
                className="w-full"
              />
            </View>
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
