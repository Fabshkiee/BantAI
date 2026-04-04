import HistoryCard from "@/components/HistoryCard";
import { Image, ScrollView, Text, View } from "react-native";

export default function history() {
  return (
    <ScrollView
      className="flex-1 px-7 mt-9 bg-surface-default"
      contentContainerClassName="pb-40"
      showsVerticalScrollIndicator={false}
    >
      <View className="justify-center items-center">
        <Image
          source={require("@/assets/logo/horizontal.png")}
          className="flex w-52 h-14 mt-5 mb-4"
          resizeMode="contain"
        />
      </View>

      <Text className="text-h2 font-bold mb-4">Recent Scans</Text>
      <View className="flex gap-6">
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
        <HistoryCard />
      </View>
    </ScrollView>
  );
}
