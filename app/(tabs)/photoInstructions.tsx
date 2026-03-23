import ArrowIcon from "@/assets/icons/ArrowIcon";
import Button from "@/components/Button";
import { router } from "expo-router";
import { Image, Text, View } from "react-native";

export default function PhotoInstructionsScreen() {
  return (
    <View className="flex-1 bg-surface-default px-8 justify-center">
      <View className="items-center w-full">
        <Text className="text-h2 font-display font-bold text-center mb-4 leading-tight">
          How to Take the Photo
        </Text>
        <Text className="text-[14px] text-black text-center font-text leading-6 mb-12">
          Position your phone in the area where you{"\n"}can see most of the
          room to ensure a{"\n"}complete scan of all sections.
        </Text>

        {/* Image */}
        <View
          className="w-full bg-blue-100 rounded-[16px] mb-12"
          style={{ overflow: "hidden", aspectRatio: 4 / 3 }}
        >
          <Image
            source={require("@/assets/images/room.png")}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        </View>

        <Button
          label="Proceed"
          className="w-full"
          onPress={() => {
            router.push("/");
          }}
          icon={<ArrowIcon color="white" size={20} />}
          iconPosition="right"
        />
      </View>
    </View>
  );
}
