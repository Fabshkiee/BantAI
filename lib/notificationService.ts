import { getLastScanTimestamp, insertNotification } from "@/db/db";
import * as Notifications from "expo-notifications";
import { PermissionsAndroid, Platform } from "react-native";

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
// Message templates
// ──────────────────────────────────────────────────

const MONTHLY_NOTIFICATION = {
  title: "Time for a Safety Check! 🏠",
  body: "It's a new month! Take a quick scan of your home to make sure everything is safe.",
};

const SEASONAL_SUMMER = {
  title: "Summer Safety Reminder ☀️",
  body: "Summer heat can increase fire risks. Check your electrical connections and keep flammable items away from heat sources.",
};

const SEASONAL_TYPHOON = {
  title: "Typhoon Season Prep 🌊",
  body: "Ber months are here — typhoon season! Scan your home for loose items, check for cracks, and secure your windows.",
};

const NDRRMC_NOTIFICATION = {
  title: "Disaster Alert Received ⚠️",
  body: "An NDRRMC alert was detected. Open BantAI for a quick home safety check.",
};

const SCAN_OVERDUE = {
  title: "Your Home Needs a Check-up 🔍",
  body: "It's been over 30 days since your last safety scan. Your space might have changed — run a quick check today.",
};

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

  console.log("Notifications initialized successfully");
}

// ──────────────────────────────────────────────────
// Monthly: 1st of every month at 9:00 AM
// ──────────────────────────────────────────────────

async function scheduleMonthlyReminder(): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: MONTHLY_NOTIFICATION.title,
        body: MONTHLY_NOTIFICATION.body,
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
          title: SEASONAL_SUMMER.title,
          body: SEASONAL_SUMMER.body,
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
          title: SEASONAL_TYPHOON.title,
          body: SEASONAL_TYPHOON.body,
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
    await Notifications.scheduleNotificationAsync({
      content: {
        title: NDRRMC_NOTIFICATION.title,
        body: NDRRMC_NOTIFICATION.body,
        data: { type: "ndrrmc", smsBody },
      },
      trigger: null, // immediate
    });

    // Persist to SQLite for the notifications screen
    await insertNotification(
      "ndrrmc",
      NDRRMC_NOTIFICATION.title,
      NDRRMC_NOTIFICATION.body,
      smsBody,
    );

    console.log("NDRRMC notification triggered and stored");
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
    const type = (data?.type as string) ?? "monthly";
    const title = notification.request.content.title ?? "";
    const body = notification.request.content.body ?? "";

    // Only store scheduled notifications (NDRRMC ones are already stored in triggerNDRRMCNotification)
    if (type !== "ndrrmc") {
      try {
        await insertNotification(
          type as "monthly" | "seasonal",
          title,
          body,
        );
      } catch (e) {
        console.warn("Failed to store notification in DB:", e);
      }
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
          title: "SMS Alert Permission",
          message:
            "BantAI needs to listen for NDRRMC disaster alerts so it can remind you to check your home's safety. BantAI only reads messages starting with 'NDRRMC' and ignores all other messages.",
          buttonPositive: "Allow",
          buttonNegative: "Deny",
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

    const isOverdue =
      lastScan === null || now - lastScan > THIRTY_DAYS_SECONDS;

    if (isOverdue) {
      // Fire an immediate notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: SCAN_OVERDUE.title,
          body: SCAN_OVERDUE.body,
          data: { type: "monthly" },
        },
        trigger: null, // immediate
      });

      // Persist to SQLite
      await insertNotification("monthly", SCAN_OVERDUE.title, SCAN_OVERDUE.body);

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
