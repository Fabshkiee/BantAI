import React from "react";
import { Pressable, Text, View } from "react-native";

interface NotificationCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  time: string;
  isOpened?: boolean;
  onPress: () => void;
}

export default function NotificationCard({
  icon,
  title,
  desc,
  time,
  isOpened = false,
  onPress,
}: NotificationCardProps) {
  return (
    <Pressable
      onPress={onPress} // add another on press that if clicked it will set the is opened to true
      className="flex-row items-center pb-5 w-full mb-3 bg-surface-default border-b border-border-secondary active:scale-95 active:opacity-75 transition-all"
    >
      {/* Unread Indicator Container */}
      <View className="items-center justify-center">
        {!isOpened && (
          <View className="w-3 h-3 rounded-full bg-surface-primary mr-2" />
        )}
      </View>

      {/* Icon Circle */}
      <View className="w-14 h-14 bg-border-secondary rounded-full justify-center items-center mr-4">
        {icon}
      </View>

      {/* Text Content */}
      <View className="flex-1">
        {/* Header Row */}
        <View className="flex-row justify-between items-start mb-1">
          <Text
            className={`text-lg font-semibold flex-1 mr-2 leading-tight ${
              isOpened ? "text-text-subtle" : "text-text-default"
            }`}
          >
            {title}
          </Text>
          <Text
            className={`text-sm  mt-[2px] ${
              isOpened ? "text-text-subtle" : "text-text-default"
            }`}
          >
            {time}
          </Text>
        </View>

        {/* Description */}
        <Text
          className={`text-md leading-5 ${
            isOpened ? "text-text-subtle" : "text-text-default"
          }`}
        >
          {desc}
        </Text>
      </View>
    </Pressable>
  );
}
