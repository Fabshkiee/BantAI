import ArrowLeftIcon from "@/assets/icons/ArrowLeftIcon";
import Button from "@/components/Button";
import {
  getScanReportBySession,
  type ScanReportDetails,
  type ScanReportItem,
} from "@/db/db";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";

function formatDate(timestampSeconds: number): string {
  return new Date(timestampSeconds * 1000).toLocaleString();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildReportHtml(report: ScanReportDetails): string {
  const summary = report.summary;
  const rowsHtml = report.items
    .map((item: ScanReportItem, index: number) => {
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.hazardLabel)}</td>
          <td>${escapeHtml(item.severity.toUpperCase())}</td>
          <td>${item.isAssessed ? "Resolved" : "Open"}</td>
          <td>${escapeHtml(item.recommendation)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
          h1 { margin-bottom: 4px; }
          .meta { margin-bottom: 16px; color: #4b5563; font-size: 12px; }
          .cards { margin-bottom: 16px; }
          .card { display: inline-block; margin-right: 16px; margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #d1d5db; padding: 8px; vertical-align: top; }
          th { background: #f3f4f6; text-align: left; }
        </style>
      </head>
      <body>
        <h1>BantAI Scan Report</h1>
        <div class="meta">Session #${summary.sessionId} | Generated ${escapeHtml(formatDate(summary.generatedAt))}</div>

        <div class="cards">
          <div class="card"><strong>Room Score:</strong> ${summary.roomScore}</div>
          <div class="card"><strong>Risk:</strong> ${escapeHtml(summary.riskVariant.toUpperCase())}</div>
          <div class="card"><strong>Total:</strong> ${summary.totalHazards}</div>
          <div class="card"><strong>Resolved:</strong> ${summary.resolvedHazards}</div>
          <div class="card"><strong>Open:</strong> ${summary.openHazards}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Hazard</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || '<tr><td colspan="5">No hazards found for this scan.</td></tr>'}
          </tbody>
        </table>
      </body>
    </html>
  `;
}

export default function ScanReportScreen() {
  const router = useRouter();
  const { sessionId: sessionIdParam } = useLocalSearchParams();
  const sessionIdValue = Array.isArray(sessionIdParam)
    ? sessionIdParam[0]
    : sessionIdParam;
  const sessionId = sessionIdValue ? Number(sessionIdValue) : null;

  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [report, setReport] = useState<ScanReportDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadReport = useCallback(async () => {
    if (!Number.isFinite(sessionId ?? Number.NaN) || (sessionId ?? 0) <= 0) {
      setError("Invalid scan session.");
      setReport(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const details = await getScanReportBySession(sessionId as number);

      if (!details) {
        setError("No saved report found for this session.");
        setReport(null);
        return;
      }

      setReport(details);
    } catch (loadError) {
      console.error("Failed to load scan report:", loadError);
      setError("Could not load scan report.");
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    void loadReport();
  }, [loadReport]);

  const handleExportPdf = useCallback(async () => {
    if (!report || !sessionId) {
      Alert.alert("Export failed", "No report is available to export.");
      return;
    }

    if (Platform.OS !== "android") {
      Alert.alert(
        "Unsupported",
        "Saving to Downloads is currently Android-only.",
      );
      return;
    }

    try {
      setIsExporting(true);

      const html = buildReportHtml(report);
      const pdfFile = await Print.printToFileAsync({ html });

      Alert.alert(
        "Select Downloads Folder",
        "Choose your Downloads folder to save the report PDF.",
      );

      const permission =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission required",
          "Downloads folder access is required.",
        );
        return;
      }

      const selectedDirectory = permission.directoryUri;
      if (!/download/i.test(decodeURIComponent(selectedDirectory))) {
        Alert.alert(
          "Downloads not selected",
          "Please select your Downloads folder to complete the export.",
        );
        return;
      }

      const fileName = `bantai_scan_report_${sessionId}_${Date.now()}.pdf`;
      const outputFileUri =
        await FileSystem.StorageAccessFramework.createFileAsync(
          selectedDirectory,
          fileName,
          "application/pdf",
        );

      const pdfBase64 = await FileSystem.readAsStringAsync(pdfFile.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.writeAsStringAsync(outputFileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.deleteAsync(pdfFile.uri, { idempotent: true });

      ToastAndroid.show(
        `PDF downloaded to: ${outputFileUri}`,
        ToastAndroid.LONG,
      );
    } catch (exportError) {
      console.error("Failed to export PDF:", exportError);
      Alert.alert("Export failed", "Could not export report PDF.");
    } finally {
      setIsExporting(false);
    }
  }, [report, sessionId]);

  return (
    <ScrollView
      className="flex-1 px-7 mt-9 bg-surface-default"
      contentContainerClassName="pb-32"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center">
        <Button
          label=""
          variant="return"
          icon={<ArrowLeftIcon color="black" size={18} />}
          iconPosition="left"
          onPress={() => router.back()}
        />
        <Text className="text-h3 font-bold text-center -ml-2">Scan Report</Text>
      </View>

      {isLoading ? (
        <View className="py-10 items-center justify-center">
          <ActivityIndicator size="large" color="#0f172a" />
          <Text className="text-text-subtle mt-4">Loading report...</Text>
        </View>
      ) : error ? (
        <View className="py-10 rounded-2xl bg-surface-light px-6 mt-6">
          <Text className="text-lg font-semibold text-center">
            Report unavailable
          </Text>
          <Text className="text-text-subtle text-center mt-2">{error}</Text>
        </View>
      ) : report ? (
        <View className="mt-6 gap-4">
          <View className="rounded-xl border border-border-secondary bg-surface-default px-4 py-4">
            <Text className="text-lg font-bold">
              Session #{report.summary.sessionId}
            </Text>
            <Text className="text-text-subtle mt-1">
              Generated {formatDate(report.summary.generatedAt)}
            </Text>
            <Text className="mt-3">Room Score: {report.summary.roomScore}</Text>
            <Text>Risk Level: {report.summary.riskVariant.toUpperCase()}</Text>
            <Text>Total Hazards: {report.summary.totalHazards}</Text>
            <Text>Resolved Hazards: {report.summary.resolvedHazards}</Text>
            <Text>Open Hazards: {report.summary.openHazards}</Text>
          </View>

          <View className="rounded-xl border border-border-secondary overflow-hidden">
            <View className="flex-row bg-surface-light px-2 py-3">
              <Text className="w-9 font-semibold">#</Text>
              <Text className="flex-1 font-semibold">Hazard</Text>
              <Text className="w-20 font-semibold">Severity</Text>
              <Text className="w-20 font-semibold">Status</Text>
            </View>

            {report.items.length === 0 ? (
              <View className="px-2 py-4 bg-surface-default">
                <Text className="text-text-subtle">
                  No hazards found for this scan.
                </Text>
              </View>
            ) : (
              report.items.map((item, index) => (
                <View
                  key={item.id}
                  className="flex-row px-2 py-3 bg-surface-default border-t border-border-secondary"
                >
                  <Text className="w-9">{index + 1}</Text>
                  <Text className="flex-1">{item.hazardLabel}</Text>
                  <Text className="w-20">{item.severity}</Text>
                  <Text className="w-20">
                    {item.isAssessed ? "Resolved" : "Open"}
                  </Text>
                </View>
              ))
            )}
          </View>

          <Button
            label={
              isExporting ? "Exporting PDF..." : "Save/Export PDF to Downloads"
            }
            variant="save"
            onPress={handleExportPdf}
            loading={isExporting}
            disabled={isExporting}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}
