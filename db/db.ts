import * as SQLite from "expo-sqlite";

const dbPromise = SQLite.openDatabaseAsync("app.db");
let initPromise: Promise<void> | null = null;

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
          ('Exposed Wiring',            'electrical', 'critical', 'Bare or damaged electrical wires visible in the room.',        'Cover or replace exposed wiring immediately. Consult an electrician.'),
          ('Overloaded Outlet',         'electrical', 'high',     'Too many devices plugged into a single outlet or strip.',      'Distribute devices across outlets. Use a surge protector.'),
          ('Blocked Fire Exit',         'fire',       'critical', 'An exit or doorway is obstructed.',                            'Clear all items blocking exits and keep pathways free at all times.'),
          ('Flammable Items Near Heat', 'fire',       'high',     'Combustible objects placed too close to a heat source.',       'Move flammable materials at least 1 metre away from heat sources.'),
          ('Trip Hazard',               'trip',       'medium',   'Objects or cords on the floor that could cause a fall.',       'Secure cords with cable ties and remove floor clutter.'),
          ('Unsecured Heavy Object',    'structural', 'high',     'Tall or heavy furniture that could tip over.',                 'Anchor furniture to the wall using safety straps.'),
          ('Poor Lighting',             'visibility', 'low',      'Area is insufficiently lit, increasing accident risk.',        'Add adequate lighting or replace faulty bulbs.'),
          ('Chemical Storage Risk',     'chemical',   'high',     'Hazardous substances stored improperly or within reach.',      'Store chemicals in a locked cabinet away from children.');
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
    title: row.name,
    variant: row.default_severity,
    reason: row.description ?? "No reason available.",
    suggestedFix: row.recommendation ?? "No recommendation available.",
  }));
}
