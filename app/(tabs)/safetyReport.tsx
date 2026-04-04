import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import RefreshIcon from "@/assets/icons/RefreshIcon";
import Button from "@/components/Button";
import HazardCard from "@/components/HazardCard";
import HazardSortingButtons from "@/components/HazardSortingButons";
import MascotReporter, { getRiskVariant } from "@/components/MascotReporter";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Animated, Text, View } from "react-native";

export default function SafetyReport() {
  const router = useRouter();
  var executeDatabaseSearch; // TO DO: Create a function that searches the db (change to const)

  // TO DO: create a function to solve the room score */
  const roomScore = 15;
  const riskVariant = getRiskVariant(roomScore);

  const fadeAnim = useRef(new Animated.Value(0)).current;

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

  return (
    <Animated.ScrollView
      className="flex-1 mt-9 pb-56 mb-14 bg-surface-default"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-14"
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View className="absolute -top-9 left-0 px-6 pt-8">
          <Button
            label="Return"
            variant="return"
            icon={<ArrowLeftIcon color="black" size={18} />}
            iconPosition="left"
            onPress={() => {
              router.replace("/history");
            }}
          />
        </View>
        <View className="mx-7 gap-7">
          {/* Safety Report Header */}
          <View className="flex-1 justify-center items-center gap-4">
            <Text className="text-h2 font-bold text-center mt-14">
              Room Safety Report
            </Text>
            <View className="relative">
              <MascotReporter score={riskVariant} value={roomScore} />
            </View>
          </View>

          {/* No. of identified hazard and instructions */}
          <View>
            {/* TO DO: create a function with regards to the hazard card to determine its number */}
            <Text className="text-2xl font-bold mt-10 mb-1">
              Identified Hazards (3)
            </Text>
            <Text className="text-lg">
              After assessing each hazard, apply the recommended fix, and press
              the hazard assessed button once finished.
            </Text>
          </View>

          <View>
            {/* TO DO: define parameters */}
            <HazardSortingButtons
              tableName="test"
              onSortQueryChange={executeDatabaseSearch}
            />
          </View>

          {/* TO DO: modify hazard card to determine risks */}
          {/* Hazard Cards */}
          <View>
            <HazardCard />
          </View>

          {/* Return Buttons */}
          <View className="w-full gap-4">
            <Button
              label="Rescan Room"
              onPress={() => {
                router.replace("/camera");
              }}
              icon={<RefreshIcon color="white" size={26} />}
            />
            <Button
              label="Back to Home"
              variant="secondary"
              onPress={() => {
                router.replace("/");
              }}
            />
          </View>
        </View>
      </Animated.View>
    </Animated.ScrollView>
  );
}
