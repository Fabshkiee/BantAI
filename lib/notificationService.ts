import {
  getLastScanTimestamp,
  insertNotification,
  NotificationType,
} from "@/db/db";
import * as Notifications from "expo-notifications";
import { NativeModules, PermissionsAndroid, Platform } from "react-native";

// ⚠️ IMPORTANT: Adjust this import path to point to your actual i18n config file
// where your i18next instance is initialized and exported.
import i18n from "i18next";

const { SmsSyncModule } = NativeModules;

// ──────────────────────────────────────────────────
// Notification handler — controls foreground behavior
// ──────────────────────────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ──────────────────────────────────────────────────
// Initialization — called once from _layout.tsx
// ──────────────────────────────────────────────────

export async function initializeNotifications(): Promise<void> {
  // 1. Request notification permissions
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.log("Notification permission not granted");
    return;
  }

  // 2. Request SMS permission for NDRRMC alerts (Android only)
  await requestSmsPermission();

  // 3. Cancel all previous schedules (idempotent reschedule on every app boot)
  await Notifications.cancelAllScheduledNotificationsAsync();

  // 4. Schedule the monthly reminder
  await scheduleMonthlyReminder();

  // 5. Schedule seasonal reminders based on current month
  await scheduleSeasonalReminders();

  // 6. Check if a scan is overdue and notify the user
  await checkScanReminder();

  // 7. Sync any alerts received by the native listener while app was closed
  await syncPendingNdrrmcAlerts();

  console.log("Notifications initialized successfully");
}

// ──────────────────────────────────────────────────
// Monthly: 1st of every month at 9:00 AM
// ──────────────────────────────────────────────────

async function scheduleMonthlyReminder(): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t("notifications.monthly.title"),
        body: i18n.t("notifications.monthly.body"),
        data: { type: "monthly" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        day: 1,
        hour: 9,
        minute: 0,
      },
    });
    console.log("Monthly reminder scheduled: 1st of each month at 9:00 AM");
  } catch (e) {
    console.warn("Failed to schedule monthly reminder:", e);
  }
}

// ──────────────────────────────────────────────────
// Seasonal: Summer (Mar–Apr), Typhoon (Sep–Dec)
// ──────────────────────────────────────────────────

async function scheduleSeasonalReminders(): Promise<void> {
  const currentMonth = new Date().getMonth() + 1; // 1-indexed

  try {
    if (currentMonth >= 3 && currentMonth <= 4) {
      // Summer safety — schedule for the 15th at 10:00 AM
      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t("notifications.seasonal_summer.title"),
          body: i18n.t("notifications.seasonal_summer.body"),
          data: { type: "seasonal", season: "summer" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
          day: 15,
          hour: 10,
          minute: 0,
        },
      });
      console.log("Summer seasonal reminder scheduled");
    }

    if (currentMonth >= 9 && currentMonth <= 12) {
      // Typhoon season — schedule for the 15th at 10:00 AM
      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t("notifications.seasonal_typhoon.title"),
          body: i18n.t("notifications.seasonal_typhoon.body"),
          data: { type: "seasonal", season: "typhoon" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
          day: 15,
          hour: 10,
          minute: 0,
        },
      });
      console.log("Typhoon seasonal reminder scheduled");
    }
  } catch (e) {
    console.warn("Failed to schedule seasonal reminders:", e);
  }
}

// ──────────────────────────────────────────────────
// NDRRMC SMS trigger — called from the SMS listener
// ──────────────────────────────────────────────────

export async function triggerNDRRMCNotification(
  smsBody: string,
): Promise<void> {
  try {
    // Fire an immediate local notification
    // The listener below will handle saving this to the DB
    await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t("notifications.ndrrmc.title"),
        body: i18n.t("notifications.ndrrmc.body"),
        data: { type: "ndrrmc", smsBody },
      },
      trigger: null, // immediate
    });

    console.log("NDRRMC notification triggered");
  } catch (e) {
    console.warn("Failed to trigger NDRRMC notification:", e);
  }
}

// ──────────────────────────────────────────────────
// Listener for received notifications — stores in DB
// ──────────────────────────────────────────────────

export function setupNotificationReceivedListener(): Notifications.EventSubscription {
  return Notifications.addNotificationReceivedListener(async (notification) => {
    const data = notification.request.content.data;
    const type = (data?.type as NotificationType) ?? "monthly";
    const title = notification.request.content.title ?? "";
    const body = notification.request.content.body ?? "";
    const smsBody = (data?.smsBody as string) ?? undefined;

    try {
      // All notifications are now persisted here to avoid duplicates
      await insertNotification(type, title, body, smsBody);
    } catch (e) {
      console.warn("Failed to store notification in DB:", e);
    }
  });
}

// ──────────────────────────────────────────────────
// SMS Permission — required for NDRRMC BroadcastReceiver
// ──────────────────────────────────────────────────

async function requestSmsPermission(): Promise<void> {
  if (Platform.OS !== "android") return;

  try {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
    );

    if (!granted) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        {
          title: i18n.t("notifications.sms_permission.title"),
          message: i18n.t("notifications.sms_permission.message"),
          buttonPositive: i18n.t("notifications.sms_permission.allow"),
          buttonNegative: i18n.t("notifications.sms_permission.deny"),
        },
      );
    }
  } catch (e) {
    console.warn("Failed to request SMS permission:", e);
  }
}

// ──────────────────────────────────────────────────
// Scan Reminder — notify if last scan was > 30 days ago
// ──────────────────────────────────────────────────

const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;

async function checkScanReminder(): Promise<void> {
  try {
    const lastScan = await getLastScanTimestamp();
    const now = Math.floor(Date.now() / 1000);

    const isOverdue = lastScan === null || now - lastScan > THIRTY_DAYS_SECONDS;

    if (isOverdue) {
      // Fire an immediate notification
      // The listener will handle the DB insertion
      await Notifications.scheduleNotificationAsync({
        content: {
          title: i18n.t("notifications.scan_overdue.title"),
          body: i18n.t("notifications.scan_overdue.body"),
          data: { type: "monthly" },
        },
        trigger: null, // immediate
      });

      console.log(
        lastScan === null
          ? "No scans ever done — overdue notification sent"
          : `Last scan was ${Math.floor((now - lastScan) / 86400)} days ago — overdue notification sent`,
      );
    }
  } catch (e) {
    console.warn("Failed to check scan reminder:", e);
  }
}

// ──────────────────────────────────────────────────
// Sync NDRRMC alerts from Native (SharedPreferences) to JS (SQLite)
// ──────────────────────────────────────────────────

export async function syncPendingNdrrmcAlerts(): Promise<void> {
  const { SmsSyncModule } = NativeModules;
  if (Platform.OS !== "android") return;

  if (!SmsSyncModule) {
    console.error(
      "SmsSyncModule is NOT defined in NativeModules. Native bridge may have failed to register.",
    );
    return;
  }

  try {
    const pending: string[] = await SmsSyncModule.getPendingAlerts();
    if (!pending || pending.length === 0) {
      console.log("No pending NDRRMC alerts found in native queue.");
      return;
    }

    console.log(
      `BantAI: Syncing ${pending.length} pending NDRRMC alerts to DB...`,
    );

    for (const alertJson of pending) {
      try {
        const alert = JSON.parse(alertJson);
        const { title, body, smsBody } = alert;

        // Force 'ndrrmc' type to satisfy DB check constraint
        // Fallback to translated text if native push lacks title/body
        await insertNotification(
          "ndrrmc",
          title || i18n.t("notifications.ndrrmc.title"),
          body || i18n.t("notifications.ndrrmc.body"),
          smsBody || undefined,
        );
      } catch (e) {
        console.error(
          "BantAI: Failed to parse or insert synced notification:",
          e,
        );
      }
    }
    console.log("BantAI: NDRRMC synchronization complete.");
  } catch (e) {
    console.error("BantAI: Failed to sync pending NDRRMC alerts:", e);
  }
}
