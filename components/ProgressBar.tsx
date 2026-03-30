import Button from "@/components/Button";
import { Text, View } from "react-native";
import * as Progress from "react-native-progress";

export default function ProgressBar() {
  // const variables
  const progressiveValue = 0;
  const brandColor = "#006ec2";
  const subtext = "test";
  const percentage = 0;

  // progress bar logic
  return (
    <View className="flex items-center justify-center">
      {/* Loading header text */}
      <View className="flex items-center">
        <Text className="text-h3 font-semibold mb-1">Analyzing Your Room</Text>
        <Text className="mb-6"> {subtext} </Text>
      </View>

      {/* ProgressBar properties */}
      <Progress.Bar
        progress={progressiveValue}
        width={320}
        height={12}
        borderRadius={12}
        borderWidth={0}
        useNativeDriver={true}
        animationType="spring"
        unfilledColor="#e5e5e5"
        color={brandColor}
      />
      <Text className="text-center mt-2 text-lg font-semibold color-text-primary mb-6">
        {percentage} %
      </Text>

      {/* Cancel Button */}
      <Button
        label="Cancel"
        className="w-full"
        onPress={() => null} // This should cancel ta operation
        variant="cancel"
      />
    </View>
  );
}
