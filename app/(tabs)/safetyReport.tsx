import RefreshIcon from "@/assets/icons/RefreshIcon";
import Button from "@/components/Button";
import HazardCard from "@/components/HazardCard";
import HazardSortingButtons from "@/components/HazardSortingButons";
import MascotReporter, { getRiskVariant } from "@/components/MascotReporter";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SafetyReport() {
  const router = useRouter();

  var executeDatabaseSearch; // TO DO: Create a function that searches the db (change to const)

  // TO DO: create a function to solve the room score */
  const roomScore = 15;
  const riskVariant = getRiskVariant(roomScore);
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 pt-9 pb-56 bg-surface-default"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-20"
    >
      <View className="mx-7 gap-7">
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
