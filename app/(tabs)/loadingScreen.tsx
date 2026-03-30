import ProgressBar from "@/components/ProgressBar";
import { Image, View } from "react-native";

export default function LoadingScreen() {
  return (
    <View className="flex-1 bg-surface-default px-8 pt-44">
      {/* Mascot image */}
      <View className="flex justify-center items-center mr-3 mb-4">
        <Image
          source={require("@/assets/mascot/MascotSearch.png")}
          resizeMode="contain"
          className="w-72 h-72"
        />
      </View>

      {/* Progress Bar component */}
      <ProgressBar />
    </View>
  );
}
