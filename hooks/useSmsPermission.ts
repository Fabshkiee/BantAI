import { useCallback, useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

/**
 * Hook to manage the RECEIVE_SMS Android permission.
 * Returns the current grant status and a function to request it.
 */
export function useSmsPermission() {
  const [granted, setGranted] = useState(false);

  const checkPermission = useCallback(async () => {
    if (Platform.OS !== "android") {
      setGranted(false);
      return;
    }

    try {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      );
      setGranted(result);
    } catch (e) {
      console.warn("Failed to check SMS permission:", e);
      setGranted(false);
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== "android") return false;

    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        {
          title: "SMS Alert Permission",
          message:
            "BantAI needs to listen for NDRRMC disaster alerts so it can remind you to check your home's safety when a disaster warning is issued. BantAI only reads messages starting with 'NDRRMC' and ignores all other messages.",
          buttonPositive: "Allow",
          buttonNegative: "Deny",
        },
      );
      const isGranted = result === PermissionsAndroid.RESULTS.GRANTED;
      setGranted(isGranted);
      return isGranted;
    } catch (e) {
      console.warn("Failed to request SMS permission:", e);
      return false;
    }
  }, []);

  return { granted, requestPermission };
}
