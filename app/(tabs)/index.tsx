import ScanIcon from "@/assets/icons/ScanIcon";
import ArticleCard from "@/components/ArticleCard";
import Button from "@/components/Button";
import NotificationButton from "@/components/NotificationButton";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 px-7 mt-9 bg-surface-default"
      contentContainerClassName="pb-40"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-14">
        {/* Header Section */}
        <View className="flex-row justify-between items-center mt-5">
          <Image
            source={require("@/assets/logo/horizontal.png")}
            className="w-52 h-14"
            resizeMode="contain"
          />
          <NotificationButton size={48} />
        </View>

        {/* Hero Section */}
        <View className="justify-center items-center gap-4">
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
            icon={<ScanIcon color="white" size={24} />}
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
  );
}
