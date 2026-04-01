import RefreshIcon from "@/assets/icons/RefreshIcon";
import Button from "@/components/Button";
import HazardCard from "@/components/HazardCard";
import MascotReporter from "@/components/MascotReporter";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

export default function SafetyReport() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 mt-9 bg-surface-default">
      <View className="mx-7">
        <View className="flex-1 justify-center items-center">
          <Text className="text-h2 font-bold text-center mt-10">
            Room Safety Report
          </Text>
          <View className="relative mt-5">
            <MascotReporter score="critical" value={10} />
          </View>
        </View>

        {/* No. of identified hazard and instructions */}
        <View>
          <Text className="text-2xl font-bold mt-10 mb-1">
            Identified Hazards (3)
          </Text>
          <Text className="text-lg">
            After assessing each hazard, apply the recommended fix, and press
            the hazard assessed button once finished.
          </Text>
        </View>

        {/* Hazard Cards */}
        <View className="mt-7">
          <HazardCard />
        </View>

        {/* Return Buttons */}
        <View className="flex gap-4 mt-7">
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
              router.push("/index");
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
