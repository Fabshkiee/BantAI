import HistoryCard from "@/components/HistoryCard";
import { Image, ScrollView, Text, View } from "react-native";

export default function history() {
  return (
    <ScrollView
      className="flex-1 px-7 mt-9 bg-surface-default"
      contentContainerClassName="pb-32"
      showsVerticalScrollIndicator={false}
    >
      <View className="">
        <View className="justify-center items-center">
          <Image
            source={require("@/assets/logo/horizontal.png")}
            className="flex w-52 h-14 mt-5 mb-3"
            resizeMode="contain"
          />
        </View>

        <Text className="text-h2 font-bold mb-3">Recent Scans</Text>
        <View className="flex gap-3">
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
          <HistoryCard />
        </View>
      </View>
    </ScrollView>
  );
}
