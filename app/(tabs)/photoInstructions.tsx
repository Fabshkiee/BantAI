import ArrowIcon from "@/assets/icons/ArrowIcon";
import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import Button from "@/components/Button";
import FadeInWrapper from "@/components/FadeInWrapper";
import { router } from "expo-router";
import { Image, Text, View } from "react-native";

export default function PhotoInstructionsScreen() {
  return (
    <FadeInWrapper>
      <View className="flex-1 bg-surface-default px-8 pt-36">
        <View className="absolute top-0 left-0 px-6 pt-8">
          <Button
            label="Return"
            variant="return"
            icon={<ArrowLeftIcon color="black" size={18} />}
            iconPosition="left"
            onPress={() => {
              router.push("/");
            }}
          />
        </View>

        <View className="items-center w-full">
          <Text className="text-h2 font-display font-bold text-center mb-3 leading-tight">
            How to Take the Photo
          </Text>
          <Text className="text-lg text-center font-text leading-5 mb-9">
            Position your phone in the area where you{"\n"}can see most of the
            room to ensure a{"\n"}complete scan of all sections.
          </Text>

          {/* Image */}
          <View
            className="w-full rounded-2xl mb-9"
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
              router.push("/landscapeOrientation");
            }}
            icon={<ArrowIcon color="white" size={18} />}
            iconPosition="right"
          />
        </View>
      </View>
    </FadeInWrapper>
  );
}
