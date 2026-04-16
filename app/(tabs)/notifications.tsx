import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import MoreIcon from "@/assets/icons/MoreIcon";
import SafetyIcon from "@/assets/icons/SafetyIcon";
import WarningIcon from "@/assets/icons/WarningIcon";
import Button from "@/components/Button";
import NotificationCard from "@/components/NotificationCard";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  markNotificationRead,
  type GroupedNotifications,
  type NotificationRow,
} from "@/db/db";
import i18n from "@/languages/i18n";
import { syncPendingNdrrmcAlerts } from "@/lib/notificationService";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  DeviceEventEmitter,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

// ──────────────────────────────────────────────────
// Delete Confirmation Modal (Single Item)
// ──────────────────────────────────────────────────

const DeleteModal = ({
  isVisible,
  onClose,
  onDeleteOne,
  selectedTitle,
}: {
  isVisible: boolean;
  onClose: () => void;
  onDeleteOne: () => void;
  selectedTitle: string;
}) => {
  const { t } = useTranslation();
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (isVisible) {
      slideAnim.setValue(400);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const handleClose = (callback?: () => void) => {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      if (callback) callback();
    });
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => handleClose()}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={() => handleClose()}
      >
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Pressable
            className="bg-white rounded-t-3xl p-6 pb-10 gap-3 shadow-xl border-t border-gray-200"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-2xl font-bold text-center mb-2">
              {t("notifications.screen.delete_modal_title")}
            </Text>
            <Text className="text-md text-text-subtle text-center mb-4 font-text">
              {selectedTitle
                ? t("notifications.screen.delete_modal_desc", {
                    title: selectedTitle,
                  })
                : t("notifications.screen.delete_modal_desc_fallback")}
            </Text>

            <Button
              label={t("notifications.screen.delete_this")}
              variant="cancel"
              onPress={() => handleClose(onDeleteOne)}
            />

            <Pressable
              className="bg-gray-100 p-4 rounded-full items-center mt-2 active:opacity-80 active:scale-95 transition-all"
              onPress={() => handleClose()}
            >
              <Text className="text-text-subtle font-semibold text-lg">
                {t("notifications.screen.cancel")}
              </Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

// ──────────────────────────────────────────────────
// Global Actions Modal (Options Menu)
// ──────────────────────────────────────────────────

const GlobalActionsModal = ({
  isVisible,
  onClose,
  onDeleteAll,
}: {
  isVisible: boolean;
  onClose: () => void;
  onDeleteAll: () => void;
}) => {
  const { t } = useTranslation();
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (isVisible) {
      slideAnim.setValue(400);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  const handleClose = (callback?: () => void) => {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
      if (callback) callback();
    });
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => handleClose()}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-end"
        onPress={() => handleClose()}
      >
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Pressable
            className="bg-white rounded-t-3xl p-6 pb-10 gap-3 shadow-xl border-t border-gray-200"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-2xl font-bold text-center mb-2">
              {t("notifications.screen.options_title")}
            </Text>
            <Text className="text-md text-text-subtle text-center mb-4 font-text">
              {t("notifications.screen.options_desc")}
            </Text>

            <Button
              label={t("notifications.screen.delete_all")}
              variant="cancel"
              onPress={() => handleClose(onDeleteAll)}
            />

            <Pressable
              className="bg-gray-100 p-4 rounded-full items-center mt-2 active:opacity-80 active:scale-95 transition-all"
              onPress={() => handleClose()}
            >
              <Text className="text-text-subtle font-semibold text-lg">
                {t("notifications.screen.cancel")}
              </Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

// ──────────────────────────────────────────────────
// Main Notifications Screen
// ──────────────────────────────────────────────────

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [groups, setGroups] = useState<GroupedNotifications[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<NotificationRow | null>(
    null,
  );
  const [, setLanguage] = useState<string>(i18n.language);

  // ──────────────────────────────────────────────────
  // Helper: Live Translation for Group Dates
  // ──────────────────────────────────────────────────
  const getLocalizedGroupTitle = (title: string) => {
    if (title === "Today") return t("date.today");
    if (title === "Yesterday") return t("date.yesterday");
    if (title === "This Week") return t("date.this_week");
    if (title === "Older") return t("date.older");
    return title;
  };

  // ──────────────────────────────────────────────────
  // Helper: Live Translation for Old DB Entries
  // ──────────────────────────────────────────────────
  const getLocalizedNotification = (title: string, body: string) => {
    // 1. Monthly Reminder
    if (
      title.includes("Time for a Safety Check") ||
      title.includes("Tion na para") ||
      title.includes("Oras na para")
    ) {
      return {
        locTitle: t("notifications.monthly.title"),
        locBody: t("notifications.monthly.body"),
      };
    }
    // 2. Summer Reminder
    if (
      title.includes("Summer Safety") ||
      title.includes("Tig-ilinit") ||
      title.includes("Tag-init")
    ) {
      return {
        locTitle: t("notifications.seasonal_summer.title"),
        locBody: t("notifications.seasonal_summer.body"),
      };
    }
    // 3. Typhoon Reminder
    if (
      title.includes("Typhoon Season") ||
      title.includes("Tig-ululan") ||
      title.includes("Panahon ng Bagyo")
    ) {
      return {
        locTitle: t("notifications.seasonal_typhoon.title"),
        locBody: t("notifications.seasonal_typhoon.body"),
      };
    }
    // 4. Overdue Reminder
    if (
      title.includes("Check-up") ||
      title.includes("Check up") ||
      title.includes("Kinahanglan sang Check-up") ||
      title.includes("Kailangan ng Check-up")
    ) {
      return {
        locTitle: t("notifications.scan_overdue.title"),
        locBody: t("notifications.scan_overdue.body"),
      };
    }
    // 5. Generic NDRRMC (Static)
    if (
      title.includes("Disaster Alert Received") ||
      title.includes("May Nabaton nga Disaster Alert") ||
      title.includes("May Natanggap na Disaster Alert")
    ) {
      return {
        locTitle: t("notifications.ndrrmc.title"),
        locBody: t("notifications.ndrrmc.body"),
      };
    }

    // 6. Dynamic NDRRMC Alerts (Leave as is since the body contains dynamic SMS data)
    return { locTitle: title, locBody: body };
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, []),
  );

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setGroups(data);
    } catch (e) {
      console.warn("Failed to load notifications:", e);
    }
  };

  const handleNotificationPress = async (notif: NotificationRow) => {
    try {
      await markNotificationRead(notif.id);
      await loadNotifications();
    } catch (e) {
      console.warn("Failed to mark notification as read:", e);
    }
    router.push("/landscapeOrientation" as any);
  };

  const handleLongPress = (notif: NotificationRow) => {
    setSelectedNotif(notif);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteOne = async () => {
    if (!selectedNotif) return;
    try {
      await deleteNotification(selectedNotif.id);
      await loadNotifications();
    } catch (e) {
      console.warn("Failed to delete notification:", e);
    }
    setSelectedNotif(null);
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications();
      await loadNotifications();
    } catch (e) {
      console.warn("Failed to delete all notifications:", e);
    }
    setSelectedNotif(null);
  };

  const getIcon = (type: string) => {
    if (type === "ndrrmc" || type === "hazard") {
      return <WarningIcon width={24} height={25} />;
    }
    return <SafetyIcon size={28} />;
  };

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "onNewNDRRMCAlert",
      async () => {
        await syncPendingNdrrmcAlerts();
        await loadNotifications();
      },
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(i18n.language);
    };

    i18n.on("languageChanged", handleLanguageChange);
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-surface-default px-7 mt-14 pt-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="pb-20">
          <View className="flex-row items-center justify-between mb-3 -ml-4 -mr-2">
            <Button
              variant="returnLg"
              label={t("notifications.screen.title")}
              iconPosition="left"
              icon={<ArrowLeftIcon />}
              onPress={() => {
                router.back();
              }}
            />
            <Pressable
              className="p-4 active:opacity-50"
              onPress={() => setIsGlobalModalOpen(true)}
            >
              <MoreIcon color="#64748b" />
            </Pressable>
          </View>

          {groups.length === 0 && (
            <View className="items-center justify-center mt-20">
              <Text className="text-lg text-text-subtle font-text">
                {t("notifications.screen.empty_title")}
              </Text>
              <Text className="text-md text-text-subtle font-text mt-2 text-center">
                {t("notifications.screen.empty_message")}
              </Text>
            </View>
          )}

          {groups.map((group) => (
            <View key={group.title} className="mb-6">
              <Text className="text-lg font-bold text-text-default mb-6">
                {getLocalizedGroupTitle(group.title)}
              </Text>

              {group.data.map((notif) => {
                const { locTitle, locBody } = getLocalizedNotification(
                  notif.title,
                  notif.body,
                );

                return (
                  <View key={notif.id}>
                    <NotificationCard
                      accessibilityLabel={t("card.accessibility_label", {
                        title: locTitle,
                      })}
                      icon={getIcon(notif.type)}
                      title={locTitle}
                      desc={locBody}
                      time={formatTime(notif.created_at)}
                      isOpened={!!notif.is_read}
                      onPress={() => handleNotificationPress(notif)}
                      onLongPress={() => handleLongPress(notif)}
                    />
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      <DeleteModal
        isVisible={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleteOne={handleDeleteOne}
        selectedTitle={
          selectedNotif
            ? getLocalizedNotification(selectedNotif.title, selectedNotif.body)
                .locTitle
            : ""
        }
      />

      <GlobalActionsModal
        isVisible={isGlobalModalOpen}
        onClose={() => setIsGlobalModalOpen(false)}
        onDeleteAll={handleDeleteAll}
      />
    </>
  );
}
