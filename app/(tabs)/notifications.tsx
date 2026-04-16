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
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  DeviceEventEmitter,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { syncPendingNdrrmcAlerts } from "@/lib/notificationService";

// ──────────────────────────────────────────────────
// Delete Confirmation Modal (bottom sheet)
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
              Delete Notification
            </Text>
            <Text className="text-md text-text-subtle text-center mb-4 font-text">
              {selectedTitle
                ? `Remove "${selectedTitle}"?`
                : "What would you like to delete?"}
            </Text>

            {/* Delete this notification */}
            <Button
              label="Delete This Notification"
              variant="cancel"
              onPress={() => handleClose(onDeleteOne)}
            />

            {/* Cancel */}
            <Pressable
              className="bg-gray-100 p-4 rounded-full items-center mt-2 active:opacity-80 active:scale-95 transition-all"
              onPress={() => handleClose()}
            >
              <Text className="text-text-subtle font-semibold text-lg">
                Cancel
              </Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

// ──────────────────────────────────────────────────
// Global Actions Modal (top right menu)
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
              Notification Options
            </Text>
            <Text className="text-md text-text-subtle text-center mb-4 font-text">
              Manage your notification history
            </Text>

            <Button
              label="Delete All Notifications"
              variant="cancel"
              onPress={() => handleClose(onDeleteAll)}
            />

            <Pressable
              className="bg-gray-100 p-4 rounded-full items-center mt-2 active:opacity-80 active:scale-95 transition-all"
              onPress={() => handleClose()}
            >
              <Text className="text-text-subtle font-semibold text-lg">
                Cancel
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
  const router = useRouter();
  const [groups, setGroups] = useState<GroupedNotifications[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<NotificationRow | null>(
    null,
  );

  // Refresh notifications from SQLite whenever the screen is focused
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

  // Tap → mark as read + navigate
  const handleNotificationPress = async (notif: NotificationRow) => {
    try {
      await markNotificationRead(notif.id);
      await loadNotifications();
    } catch (e) {
      console.warn("Failed to mark notification as read:", e);
    }

    // All notification clicks lead to the scanning instructions/camera
    router.push("/landscapeOrientation" as any);
  };

  // Long-press → open delete modal
  const handleLongPress = (notif: NotificationRow) => {
    setSelectedNotif(notif);
    setIsDeleteModalOpen(true);
  };

  // Delete single notification
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

  // Delete all notifications
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

  // 2. Live Update Listener: Refresh list automatically when a native alert arrives
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "onNewNDRRMCAlert",
      async () => {
        console.log("BantAI: Live Update Triggered!");
        await syncPendingNdrrmcAlerts();
        await loadNotifications();
      },
    );
    return () => subscription.remove();
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
              label="Notifications"
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
                No notifications yet
              </Text>
              <Text className="text-md text-text-subtle font-text mt-2 text-center">
                You'll see safety reminders and disaster alerts here.
              </Text>
            </View>
          )}

          {/* Render notification groups from SQLite */}
          {groups.map((group) => (
            <View key={group.title} className="mb-6">
              {/* Section Header */}
              <Text className="text-lg font-bold text-text-default mb-6">
                {group.title}
              </Text>

              {/* Notification cards */}
              {group.data.map((notif) => (
                <View key={notif.id}>
                  <NotificationCard
                    icon={getIcon(notif.type)}
                    title={notif.title}
                    desc={notif.body}
                    time={formatTime(notif.created_at)}
                    isOpened={!!notif.is_read}
                    onPress={() => handleNotificationPress(notif)}
                    onLongPress={() => handleLongPress(notif)}
                  />
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Delete Modal (for single items) */}
      <DeleteModal
        isVisible={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleteOne={handleDeleteOne}
        selectedTitle={selectedNotif?.title ?? ""}
      />

      {/* Global Actions Modal (for triple dot) */}
      <GlobalActionsModal
        isVisible={isGlobalModalOpen}
        onClose={() => setIsGlobalModalOpen(false)}
        onDeleteAll={handleDeleteAll}
      />
    </>
  );
}
