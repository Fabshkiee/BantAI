import * as SQLite from "expo-sqlite";
import { HAZARD_DISPLAY_NAMES, HAZARD_TYPES } from "./hazards";

const dbPromise = SQLite.openDatabaseAsync("app.db");
let initPromise: Promise<void> | null = null;

const sqlQuote = (value: string) => value.replaceAll("'", "''");
const formatHazardTitle = (value: string) =>
  value.includes("_")
    ? value
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
    : value;

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

export async function initDatabase(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    const db = await dbPromise;
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS scan_sessions (
          id              INTEGER PRIMARY KEY AUTOINCREMENT,
          photo_path      TEXT NOT NULL,
          room_score      INTEGER,
          risk_variant    TEXT CHECK (risk_variant IN ('low', 'medium', 'high', NULL)),
          status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
          scanned_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          completed_at    INTEGER
      );

      CREATE TABLE IF NOT EXISTS hazard_types (
          id               INTEGER PRIMARY KEY AUTOINCREMENT,
          name             TEXT NOT NULL UNIQUE,
          category         TEXT NOT NULL,
          default_severity TEXT NOT NULL DEFAULT 'medium' CHECK (default_severity IN ('low', 'medium', 'high', 'critical')),
          description      TEXT,
          recommendation   TEXT
      );

      CREATE TABLE IF NOT EXISTS detected_hazards (
          id              INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id      INTEGER NOT NULL REFERENCES scan_sessions(id) ON DELETE CASCADE,
          hazard_type_id  INTEGER REFERENCES hazard_types(id) ON DELETE SET NULL,
          severity        TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
          label           TEXT NOT NULL,
          description     TEXT,
          recommendation  TEXT,
          is_assessed     INTEGER NOT NULL DEFAULT 0 CHECK (is_assessed IN (0, 1)),
          assessed_at     INTEGER,
          detected_at     INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      );

      CREATE INDEX IF NOT EXISTS idx_hazards_session_id  ON detected_hazards (session_id);
      CREATE INDEX IF NOT EXISTS idx_hazards_assessed    ON detected_hazards (is_assessed);
      CREATE INDEX IF NOT EXISTS idx_sessions_scanned_at ON scan_sessions (scanned_at DESC);
      CREATE INDEX IF NOT EXISTS idx_sessions_status     ON scan_sessions (status);

        INSERT OR IGNORE INTO hazard_types (name, category, default_severity, description, recommendation) VALUES
          ${HAZARD_TYPES.map((hazard) => `('${sqlQuote(hazard.name)}', '${sqlQuote(hazard.category)}', '${sqlQuote(hazard.default_severity)}', '${sqlQuote(hazard.description)}', '${sqlQuote(hazard.recommendation)}')`).join(",\n          ")};
    `);
  })();

  return initPromise;
}

export async function fetchDataFromDB(): Promise<HazardData[]> {
  await initDatabase();
  const db = await dbPromise;
  const rows = await db.getAllAsync<HazardRow>(
    "SELECT id, name, default_severity, description, recommendation FROM hazard_types",
  );

  return rows.map((row) => ({
    id: row.id,
    title:
      HAZARD_DISPLAY_NAMES[row.name as keyof typeof HAZARD_DISPLAY_NAMES] ??
      formatHazardTitle(row.name),
    variant: row.default_severity,
    reason: row.description ?? "No reason available.",
    suggestedFix: row.recommendation ?? "No recommendation available.",
  }));
}
