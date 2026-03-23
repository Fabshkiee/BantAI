import ArrowIcon from "@/assets/icons/ArrowIcon";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="mx-7">
      <Button
        label="Analyze Risks"
        onPress={() => router.push("/explore")}
        iconPosition="right"
        icon={<ArrowIcon color="white" size={20} />}
      />
    </View>
  );
}
