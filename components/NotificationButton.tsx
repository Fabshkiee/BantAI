// temporary component for the notif button. Must be merged with top bar
import NotificationIcon from "@/assets/icons/NotificationIcon";
import { getUnreadNotificationCount } from "@/db/db";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function NotificationButton({
  size = 50,
  badgeColor = "#006ec2",
}) {
  const [count, setCount] = useState(0);
  const badgeSize = size * 0.45;
  const badgeFontSize = badgeSize * 0.5;
  const router = useRouter();

  // Refresh unread count whenever the screen containing this button is focused
  useFocusEffect(
    useCallback(() => {
      loadUnreadCount();
    }, []),
  );

  const loadUnreadCount = async () => {
    try {
      const unread = await getUnreadNotificationCount();
      setCount(unread);
    } catch (e) {
      console.warn("Failed to load unread count:", e);
    }
  };

  return (
    // Button navigating to notifications
    <Pressable
      className="relative justify-center items-center active:scale-95 active:opacity-75 transition-all"
      style={{ width: size, height: size }}
      onPress={() => {
        router.push("/notifications" as any);
      }}
    >
      {/* Main button design*/}
      <View className="w-full h-full bg-surface-default border-2 border-border-secondary justify-center items-center rounded-full">
        <NotificationIcon color="#84888c" size={32} />
      </View>

      {/* Number of unopened notifs */}
      {count > 0 && (
        <View
          className="absolute justify-center items-center rounded-full"
          style={{
            backgroundColor: badgeColor,
            minWidth: badgeSize,
            height: badgeSize,
            top: -badgeSize * 0.1,
            right: -badgeSize * 0.1,
          }}
        >
          <Text
            className="text-text-inverse font-normal text-center"
            style={{ fontSize: badgeFontSize }}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {count > 99 ? "99+" : count}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
