import { calculateRoomRisk, type Detection } from "@/lib/riskEngine";
import * as SQLite from "expo-sqlite";
import { hazardDictionary } from "../hazardDictionary";
import {
    type DisasterType,
    HAZARD_DISPLAY_NAMES,
    HAZARD_TYPES,
} from "./hazards";

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

const getRiskVariantFromScore = (
  score: number,
): "low" | "medium" | "high" | "critical" => {
  if (score >= 0 && score <= 10) return "critical";
  if (score > 10 && score < 40) return "high";
  if (score >= 40 && score < 80) return "medium";
  return "low";
};

export type HazardData = {
  id: number;
  title: string;
  variant: "low" | "medium" | "high" | "critical";
  disasterTypes: DisasterType[];
  reason: string;
  suggestedFix: string;
  earthquake_reason?: string;
  typhoon_reason?: string;
  fire_reason?: string;
  earthquake_fixes?: string[];
  typhoon_fixes?: string[];
  fire_fixes?: string[];
  bbox?: [number, number, number, number];
  isAssessed?: boolean;
  internalName?: string;
};

export type ScanStatus = "pending" | "processing" | "completed" | "failed";

export type ScanSessionSummary = {
  id: number;
  photoPath: string;
  roomScore: number | null;
  riskVariant: HazardData["variant"] | null;
  status: ScanStatus;
  scannedAt: number;
  completedAt: number | null;
  hazardCount: number;
  assessedCount: number;
};

export type ScanSessionDetails = ScanSessionSummary & {
  hazards: HazardData[];
};

type HazardRow = {
  id: number;
  name: string;
  default_severity: "low" | "medium" | "high" | "critical";
  description: string | null;
  recommendation: string | null;
};

type ScanSessionRow = {
  id: number;
  photo_path: string;
  room_score: number | null;
  risk_variant: HazardData["variant"] | null;
  status: ScanStatus;
  scanned_at: number;
  completed_at: number | null;
  hazard_count: number;
  assessed_count: number | null;
};

type SessionHazardRow = {
  id: number;
  severity: HazardData["variant"];
  label: string;
  description: string | null;
  recommendation: string | null;
  is_assessed: 0 | 1;
  detected_at: number;
  x1: number | null;
  y1: number | null;
  x2: number | null;
  y2: number | null;
  internalName?: string;
};

async function recalculateSessionRisk(sessionId: number): Promise<void> {
  await initDatabase();
  const db = await dbPromise;

  const unassessedRows = await db.getAllAsync<{
    name: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>(
    `
      SELECT ht.name, dh.x1, dh.y1, dh.x2, dh.y2
      FROM detected_hazards dh
      JOIN hazard_types ht ON dh.hazard_type_id = ht.id
      WHERE dh.session_id = ?
        AND dh.is_assessed = 0
    `,
    sessionId,
  );

  const detections: Detection[] = unassessedRows.map((r) => ({
    class: r.name,
    confidence: 1.0,
    bbox: [r.x1, r.y1, r.x2, r.y2],
  }));

  const scoreResult =
    detections.length > 0
      ? calculateRoomRisk(detections)
      : {
          safetyScore: 100,
          mascotVariant: "low" as const,
        };

  await db.runAsync(
    `
      UPDATE scan_sessions
      SET room_score = ?,
          risk_variant = ?
      WHERE id = ?
    `,
    scoreResult.safetyScore,
    scoreResult.mascotVariant,
    sessionId,
  );
}

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
          risk_variant    TEXT CHECK (risk_variant IN ('low', 'medium', 'high', 'critical')),
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
          detected_at     INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
          x1              REAL,
          y1              REAL,
          x2              REAL,
            y2              REAL
      );

      CREATE INDEX IF NOT EXISTS idx_hazards_session_id  ON detected_hazards (session_id);
      CREATE INDEX IF NOT EXISTS idx_hazards_assessed    ON detected_hazards (is_assessed);
      CREATE INDEX IF NOT EXISTS idx_sessions_scanned_at ON scan_sessions (scanned_at DESC);
      CREATE INDEX IF NOT EXISTS idx_sessions_status     ON scan_sessions (status);

        INSERT OR IGNORE INTO hazard_types (name, category, default_severity, description, recommendation) VALUES
          ${HAZARD_TYPES.map((hazard) => `('${sqlQuote(hazard.name)}', '${sqlQuote(hazard.category)}', '${sqlQuote(hazard.default_severity)}', '${sqlQuote(hazard.description ?? "")}', '${sqlQuote(hazard.recommendation ?? "")}')`).join(",\n          ")};
    `);
  })();

  return initPromise;
}

export async function fetchDataFromDB(): Promise<HazardData[]> {
  await initDatabase();
  const db = await dbPromise;
  const rows = await db.getAllAsync<HazardRow>(
    "SELECT id, name, default_severity FROM hazard_types",
  );

  return rows.map((row) => {
    const entry = hazardDictionary.find(
      (h: { id: string }) => h.id === `HAZARD_LABELS.${row.name.toUpperCase()}`,
    );
    return {
      id: row.id,
      title:
        HAZARD_DISPLAY_NAMES[row.name as keyof typeof HAZARD_DISPLAY_NAMES] ??
        formatHazardTitle(row.name),
      variant: row.default_severity,
      reason: entry?.description ?? "No reason available.",
      suggestedFix: entry?.fire_fixes?.[0] ?? "No recommendation available.",
      disasterTypes:
        HAZARD_TYPES.find((h) => h.name === row.name)?.disasterTypes ?? [],
      earthquake_reason:
        entry?.earthquake_reason ?? "No information available.",
      typhoon_reason: entry?.typhoon_reason ?? "No information available.",
      fire_reason: entry?.fire_reason ?? "No information available.",
      earthquake_fixes: entry?.earthquake_fixes ?? [],
      typhoon_fixes: entry?.typhoon_fixes ?? [],
      fire_fixes: entry?.fire_fixes ?? [],
    };
  });
}

export async function createScanSession(photoPath: string): Promise<number> {
  await initDatabase();
  const db = await dbPromise;
  const result = await db.runAsync(
    "INSERT INTO scan_sessions (photo_path, status) VALUES (?, 'pending')",
    photoPath,
  );

  return Number(result.lastInsertRowId);
}

export async function getRecentScanSessions(
  limit = 10,
): Promise<ScanSessionSummary[]> {
  await initDatabase();
  const db = await dbPromise;
  const rows = await db.getAllAsync<ScanSessionRow>(
    `
      SELECT
        s.id,
        s.photo_path,
        s.room_score,
        s.risk_variant,
        s.status,
        s.scanned_at,
        s.completed_at,
        COUNT(d.id) AS hazard_count,
        COALESCE(SUM(CASE WHEN d.is_assessed = 1 THEN 1 ELSE 0 END), 0) AS assessed_count
      FROM scan_sessions s
      LEFT JOIN detected_hazards d ON d.session_id = s.id
      GROUP BY s.id
      ORDER BY s.scanned_at DESC
      LIMIT ?
    `,
    limit,
  );

  return rows.map((row) => ({
    id: row.id,
    photoPath: row.photo_path,
    roomScore: row.room_score,
    riskVariant: row.risk_variant,
    status: row.status,
    scannedAt: row.scanned_at,
    completedAt: row.completed_at,
    hazardCount: row.hazard_count,
    assessedCount: row.assessed_count ?? 0,
  }));
}

export async function getScanSessionDetails(
  sessionId: number,
): Promise<ScanSessionDetails | null> {
  await initDatabase();
  const db = await dbPromise;

  const session = await db.getFirstAsync<ScanSessionRow>(
    `
      SELECT
        s.id,
        s.photo_path,
        s.room_score,
        s.risk_variant,
        s.status,
        s.scanned_at,
        s.completed_at,
        COUNT(d.id) AS hazard_count,
        COALESCE(SUM(CASE WHEN d.is_assessed = 1 THEN 1 ELSE 0 END), 0) AS assessed_count
      FROM scan_sessions s
      LEFT JOIN detected_hazards d ON d.session_id = s.id
      WHERE s.id = ?
      GROUP BY s.id
    `,
    sessionId,
  );

  if (!session) {
    return null;
  }

  const hazards = await db.getAllAsync<SessionHazardRow>(
    `
      SELECT
        d.id,
        d.severity,
        d.label,
        d.description,
        d.recommendation,
        d.is_assessed,
        d.detected_at,
        d.x1,
        d.y1,
        d.x2,
        d.y2,
        ht.name as internalName
      FROM detected_hazards d
      JOIN hazard_types ht ON d.hazard_type_id = ht.id
      WHERE d.session_id = ?
      ORDER BY d.detected_at DESC, d.id DESC
    `,
    sessionId,
  );

  return {
    id: session.id,
    photoPath: session.photo_path,
    roomScore: session.room_score,
    riskVariant: session.risk_variant,
    status: session.status,
    scannedAt: session.scanned_at,
    completedAt: session.completed_at,
    hazardCount: session.hazard_count,
    assessedCount: session.assessed_count ?? 0,
    hazards: hazards.map((row) => {
      const seed = HAZARD_TYPES.find(
        (h) =>
          HAZARD_DISPLAY_NAMES[h.name as keyof typeof HAZARD_DISPLAY_NAMES] ===
            row.label || h.name === row.label,
      );
      const entry = hazardDictionary.find(
        (h: { id: string }) =>
          h.id === `HAZARD_LABELS.${seed?.name.toUpperCase()}`,
      );

      return {
        id: row.id,
        title: row.label,
        variant: row.severity,
        reason: row.description ?? entry?.description ?? "No reason available.",
        suggestedFix:
          row.recommendation ??
          entry?.fire_fixes?.[0] ??
          "No recommendation available.",
        isAssessed: !!row.is_assessed,
        internalName: row.internalName,
        bbox:
          row.x1 !== null &&
          row.y1 !== null &&
          row.x2 !== null &&
          row.y2 !== null
            ? [row.x1, row.y1, row.x2, row.y2]
            : undefined,
        disasterTypes: seed?.disasterTypes ?? [],
        earthquake_reason:
          entry?.earthquake_reason ?? "No information available.",
        typhoon_reason: entry?.typhoon_reason ?? "No information available.",
        fire_reason: entry?.fire_reason ?? "No information available.",
        earthquake_fixes: entry?.earthquake_fixes ?? [],
        typhoon_fixes: entry?.typhoon_fixes ?? [],
        fire_fixes: entry?.fire_fixes ?? [],
      };
    }),
  };
}

export async function getHazardsForSession(
  sessionId: number,
): Promise<HazardData[]> {
  const session = await getScanSessionDetails(sessionId);
  return session?.hazards ?? [];
}

export async function insertDetectedHazards(
  sessionId: number,
  detections: Detection[],
): Promise<ScanSessionDetails | null> {
  await initDatabase();
  const db = await dbPromise;

  if (detections.length === 0) {
    await db.runAsync(
      `
        UPDATE scan_sessions
        SET room_score = 100,
            risk_variant = 'low',
            status = 'completed',
            completed_at = strftime('%s', 'now')
        WHERE id = ?
      `,
      sessionId,
    );
    return getScanSessionDetails(sessionId);
  }

  const scoreResult =
    detections.length > 0
      ? calculateRoomRisk(detections)
      : {
          safetyScore: 100,
          mascotVariant: "low" as const,
        };

  for (const det of detections) {
    const seed = HAZARD_TYPES.find((hazard) => hazard.name === det.class);
    const title =
      HAZARD_DISPLAY_NAMES[det.class as keyof typeof HAZARD_DISPLAY_NAMES] ??
      formatHazardTitle(det.class);

    const hazardRows = await db.getAllAsync<{ id: number }>(
      "SELECT id FROM hazard_types WHERE name = ?",
      det.class,
    );
    const hazardTypeId = hazardRows.length > 0 ? hazardRows[0].id : null;

    await db.runAsync(
      `
        INSERT INTO detected_hazards (
          session_id,
          hazard_type_id,
          severity,
          label,
          description,
          recommendation,
          x1, y1, x2, y2
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      sessionId,
      hazardTypeId,
      seed?.default_severity ?? "medium",
      title,
      seed?.description ?? null,
      seed?.recommendation ?? null,
      det.bbox[0],
      det.bbox[1],
      det.bbox[2],
      det.bbox[3],
    );
  }

  await db.runAsync(
    `
      UPDATE scan_sessions
      SET room_score = ?,
          risk_variant = ?,
          status = 'completed',
          completed_at = strftime('%s', 'now')
      WHERE id = ?
    `,
    scoreResult.safetyScore,
    scoreResult.mascotVariant,
    sessionId,
  );

  return getScanSessionDetails(sessionId);
}

export async function markHazardAsAssessed(
  hazardId: number,
): Promise<ScanSessionDetails | null> {
  await initDatabase();
  const db = await dbPromise;

  // 1. Get the session ID before updating
  const row = await db.getFirstAsync<{ session_id: number }>(
    "SELECT session_id FROM detected_hazards WHERE id = ?",
    hazardId,
  );
  if (!row) return null;

  const sessionId = row.session_id;

  // 2. Mark as assessed
  await db.runAsync(
    `
      UPDATE detected_hazards
      SET is_assessed = 1,
          assessed_at = strftime('%s', 'now')
      WHERE id = ?
    `,
    hazardId,
  );

  // 3. Re-calculate room risk based on remaining confirmed hazards
  await recalculateSessionRisk(sessionId);

  return getScanSessionDetails(sessionId);
}
