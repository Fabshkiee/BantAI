import Button from "@/components/Button";
import React from "react";
import { Text, View } from "react-native";
import * as Progress from "react-native-progress";

const brandColor = "#006ec2";

// progress bar map
type progressBarState = {
  progressValue: number;
  percentage: number;
  subtext: string;
};

const progressBarStates: progressBarState[] = [
  { progressValue: 0, percentage: 0, subtext: "Initializing..." },
  { progressValue: 0.2, percentage: 20, subtext: "Detecting room layout..." },
  {
    progressValue: 0.5,
    percentage: 50,
    subtext: "Analyzing for disastrous hazards...",
  },
  {
    progressValue: 0.8,
    percentage: 80,
    subtext: "Generating safety report...",
  },
  { progressValue: 1, percentage: 100, subtext: "Analysis Complete!" },
];

export default function ProgressBar() {
  // NOTE: Back-end Logic may be placed here.
  // use index locations when changing conditions at each phase.
  // refer to the map above.

  // index default by 0
  const indexProgress = 0;
  const currentState = progressBarStates[indexProgress];

  // progress bar logic
  return (
    <View className="flex items-center justify-center">
      {/* Loading header text */}
      <View className="flex items-center">
        <Text className="text-h3 font-semibold mb-1">Analyzing Your Room</Text>
        <Text className="mb-6"> {currentState.subtext} </Text>
      </View>

      {/* ProgressBar properties */}
      <Progress.Bar
        progress={currentState.progressValue}
        width={320}
        height={12}
        borderRadius={12}
        borderWidth={0}
        animationType="spring"
        unfilledColor="#e5e5e5"
        color={brandColor}
      />
      <Text className="text-center mt-2 text-lg font-semibold color-text-primary mb-6">
        {currentState.percentage} %
      </Text>

      {/* Cancel Button */}
      <Button
        label="Cancel"
        className="w-full"
        onPress={() => null}
        variant="cancel"
      />
    </View>
  );
}
