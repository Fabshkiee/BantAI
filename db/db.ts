import * as SQLite from "expo-sqlite";

const dbPromise = SQLite.openDatabaseAsync("app.db");

export type HazardData = {
  id: number;
  title: string;
  variant: "low" | "medium" | "high" | "critical";
  reason: string;
  suggestedFix: string;
};

type HazardRow = {
  id: number;
  name: string;
  default_severity: "low" | "medium" | "high" | "critical";
  description: string | null;
  recommendation: string | null;
};

export async function fetchDataFromDB(): Promise<HazardData[]> {
  const db = await dbPromise;
  const rows = await db.getAllAsync<HazardRow>(
    "SELECT id, name, default_severity, description, recommendation FROM hazard_types",
  );

  return rows.map((row) => ({
    id: row.id,
    title: row.name,
    variant: row.default_severity,
    reason: row.description ?? "No reason available.",
    suggestedFix: row.recommendation ?? "No recommendation available.",
  }));
}
