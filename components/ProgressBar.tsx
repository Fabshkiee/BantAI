import Button from "@/components/Button";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import * as Progress from "react-native-progress";

const brandColor = "#006ec2";

interface ProgressBarProps {
  /** 0.0 to 1.0 continuous progress */
  progress?: number;
  /** Status text */
  statusText?: string;
  /** Optional cancel handler */
  onCancel?: () => void;
}

export default function ProgressBar({
  progress = 0,
  statusText = "Initializing...",
  onCancel,
}: ProgressBarProps) {
  const { t } = useTranslation();
  const percentage = Math.round(progress * 100);

  return (
    <View className="flex items-center justify-center">
      {/* Loading header text */}
      <View className="flex items-center">
        <Text className="text-h3 font-semibold mb-1">
          {t("progress_bar.title")}
        </Text>
        <Text className="mb-6"> {statusText} </Text>
      </View>

      {/* ProgressBar properties */}
      <Progress.Bar
        progress={progress}
        width={320}
        height={12}
        borderRadius={12}
        borderWidth={0}
        animationType="spring"
        unfilledColor="#e5e5e5"
        color={brandColor}
      />
      <Text className="text-center mt-2 text-lg font-semibold color-text-primary mb-6">
        {percentage} %
      </Text>

      {/* Cancel Button */}
      <Button
        label={t("progress_bar.cancel")}
        className="w-full"
        onPress={onCancel ?? (() => null)}
        disabled={!onCancel}
        variant="cancel"
      />
    </View>
  );
}
