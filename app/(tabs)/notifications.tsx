import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import SafetyIcon from "@/assets/icons/SafetyIcon";
import WarningIcon from "@/assets/icons/WarningIcon";
import Button from "@/components/Button";
import NotificationCard from "@/components/NotificationCard";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

// Grouped Mock Data to match the Figma sections
const GROUPED_NOTIFICATIONS = [
  {
    title: "Today",
    data: [
      {
        id: "report-101",
        type: "hazard",
        title: "Pending Hazards",
        time: "10:04 am",
        desc: "You haven't resolved the 'Overloaded Extension Cord' from yesterday's scan. Tap here for a quick 3-step fix.",
        isOpened: false, // Will trigger the blue dot
      },
      {
        id: "safety-202",
        type: "safety",
        title: "Time for a Safety Check!",
        time: "10:04 am",
        desc: "It has been 30 days since your last scan. Your space might have changed—run a quick safety check today.",
        isOpened: true,
      },
    ],
  },
  {
    title: "Yesterday",
    data: [
      {
        id: "report-103",
        type: "hazard",
        title: "Pending Hazards",
        time: "10:04 am",
        desc: "You haven't resolved the 'Overloaded Extension Cord' from yesterday's scan. Tap here for a quick 3-step fix.",
        isOpened: true,
      },
      {
        id: "report-104",
        type: "hazard",
        title: "Pending Hazards",
        time: "10:04 am",
        desc: "You haven't resolved the 'Overloaded Extension Cord' from yesterday's scan. Tap here for a quick 3-step fix.",
        isOpened: true,
      },
    ],
  },
  {
    title: "This Week",
    data: [
      {
        id: "report-105",
        type: "hazard",
        title: "Pending Hazards",
        time: "10:04 am",
        desc: "You haven't resolved the 'Overloaded Extension Cord' from yesterday's scan. Tap here for a quick 3-step fix.",
        isOpened: true,
      },
    ],
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  // Route handler based on the ID or type
  const handleNotificationPress = (id: string, type: string) => {
    if (type === "hazard") {
      router.push(`/report/${id}`); // Placeholder for dynamic routing
    } else if (type === "safety") {
      router.push("/photoInstructions");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-surface-default px-7 mt-9 mb-16"
      showsVerticalScrollIndicator={false}
    >
      <View className="pb-20">
        <View className="items-start -ml-4 mb-3">
          <Button
            variant="returnLg"
            label="Notifications"
            iconPosition="left"
            icon={<ArrowLeftIcon />}
            onPress={() => {
              router.back;
            }}
          />
        </View>

        {/* Outer Loop: Iterate through the groups (Today, Yesterday, etc.) */}
        {GROUPED_NOTIFICATIONS.map((group) => (
          <View key={group.title} className="mb-6">
            {/* Section Header */}
            <Text className="text-lg font-bold text-text-default mb-6">
              {group.title}
            </Text>

            {/* Inner Loop: Iterate through the notifications in this group */}
            {group.data.map((notif, index) => {
              const IconComponent =
                notif.type === "hazard" ? (
                  <WarningIcon width={24} height={25} />
                ) : (
                  <SafetyIcon size={28} />
                );

              return (
                <View key={notif.id}>
                  <NotificationCard
                    icon={IconComponent}
                    title={notif.title}
                    desc={notif.desc}
                    time={notif.time}
                    isOpened={notif.isOpened}
                    onPress={() =>
                      handleNotificationPress(notif.id, notif.type)
                    }
                  />
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
