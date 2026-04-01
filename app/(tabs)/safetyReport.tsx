import RefreshIcon from "@/assets/icons/RefreshIcon";
import Button from "@/components/Button";
import HazardCard from "@/components/HazardCard";
import MascotReporter, { getRiskVariant } from "@/components/MascotReporter";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafetyReport() {
  const router = useRouter();

  {
    /* TO DO: create a function to solve the room score */
  }
  const roomScore = 15;
  const riskVariant = getRiskVariant(roomScore);
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 pt-9 pb-56 bg-surface-default"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
    >
      <View className="mx-7">
        {/* Safety Report Header */}
        <View className="flex-1 justify-center items-center gap-4">
          <Text className="text-h2 font-bold text-center mt-10">
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

        {/* TO DO: modify hazard card to determine risks */}
        {/* Hazard Cards */}
        <View className="mt-7">
          <HazardCard />
        </View>

        {/* Return Buttons */}
        <View className="w-full gap-4 mt-7">
          <Button
            label="Rescan Room"
            onPress={() => {
              router.push("/camera");
            }}
            icon={<RefreshIcon color="white" size={26} />}
          />
          <Button
            label="Back to Home"
            variant="secondary"
            onPress={() => {
              router.push("/");
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
