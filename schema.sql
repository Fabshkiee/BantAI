
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

--===========================================================================================
-- BantAI saves room photos to your phone's private app storage folder, 
-- stores only the file path in the database,
-- and displays them directly using that path without saving them to your device gallery.
--===========================================================================================


-- photo_path: full URI to the saved image file (e.g. file:///data/user/0/com.bantai.app/files/scans/scan_1720000000.jpg)

CREATE TABLE IF NOT EXISTS scan_sessions (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,

    -- We store the full URI (including file://) because that's what Expo Image components expect. 
    -- This also allows us to easily display the photo later without needing to reconstruct the path.
    photo_path      TEXT NOT NULL,

    room_score      INTEGER,                    -- 0-100, shown in MascotReporter
    risk_variant    TEXT                        -- 'low' | 'medium' | 'high' from getRiskVariant()
                    CHECK (risk_variant IN ('low', 'medium', 'high', NULL)),
    status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    scanned_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    completed_at    INTEGER                     -- NULL until scan finishes
);

-- Each hazard type has a default severity and recommendation text, 
-- but these can be overridden for each detected hazard in detected_hazards. 
-- This allows us to have a library of common hazard types while still supporting 
-- custom hazards that may not fit into predefined categories.

CREATE TABLE IF NOT EXISTS hazard_types (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    name             TEXT NOT NULL UNIQUE,      -- e.g. 'Exposed Wiring'
    category         TEXT NOT NULL,             -- 'electrical' | 'fire' | 'trip' | 'chemical' etc.
    default_severity TEXT NOT NULL DEFAULT 'medium'
                     CHECK (default_severity IN ('low', 'medium', 'high', 'critical')),
    description      TEXT,
    recommendation   TEXT                       -- default fix text for HazardCard
);

-- Detected hazards are linked to both the scan 
-- session they were found in and the hazard type they belong to (if any).

CREATE TABLE IF NOT EXISTS detected_hazards (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id      INTEGER NOT NULL REFERENCES scan_sessions(id) ON DELETE CASCADE,
    hazard_type_id  INTEGER REFERENCES hazard_types(id) ON DELETE SET NULL,
    severity        TEXT NOT NULL DEFAULT 'medium'
                    CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    label           TEXT NOT NULL,              -- title shown on HazardCard
    description     TEXT,
    recommendation  TEXT,                       -- overrides hazard_types.recommendation if set
    is_assessed     INTEGER NOT NULL DEFAULT 0  -- 0 = open, 1 = assessed (user confirmed fix)
                    CHECK (is_assessed IN (0, 1)),
    assessed_at     INTEGER,                    -- set when user taps "Hazard Assessed"
    detected_at     INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);


-- Indexes

CREATE INDEX IF NOT EXISTS idx_hazards_session_id  ON detected_hazards (session_id);
CREATE INDEX IF NOT EXISTS idx_hazards_assessed    ON detected_hazards (is_assessed);
CREATE INDEX IF NOT EXISTS idx_sessions_scanned_at ON scan_sessions (scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_status     ON scan_sessions (status);


-- Seed: hazard types (common home safety categories)
-- We use "INSERT OR IGNORE" to avoid duplicates if the app is updated and the seed runs again. 
-- This way we can safely add new hazard types in future updates without affecting existing data.

INSERT OR IGNORE INTO hazard_types (name, category, default_severity, description, recommendation) VALUES
    ('Exposed Wiring',            'electrical', 'critical', 'Bare or damaged electrical wires visible in the room.',        'Cover or replace exposed wiring immediately. Consult an electrician.'),
    ('Overloaded Outlet',         'electrical', 'high',     'Too many devices plugged into a single outlet or strip.',      'Distribute devices across outlets. Use a surge protector.'),
    ('Blocked Fire Exit',         'fire',       'critical', 'An exit or doorway is obstructed.',                            'Clear all items blocking exits and keep pathways free at all times.'),
    ('Flammable Items Near Heat', 'fire',       'high',     'Combustible objects placed too close to a heat source.',       'Move flammable materials at least 1 metre away from heat sources.'),
    ('Trip Hazard',               'trip',       'medium',   'Objects or cords on the floor that could cause a fall.',       'Secure cords with cable ties and remove floor clutter.'),
    ('Unsecured Heavy Object',    'structural', 'high',     'Tall or heavy furniture that could tip over.',                 'Anchor furniture to the wall using safety straps.'),
    ('Poor Lighting',             'visibility', 'low',      'Area is insufficiently lit, increasing accident risk.',        'Add adequate lighting or replace faulty bulbs.'),
    ('Chemical Storage Risk',     'chemical',   'high',     'Hazardous substances stored improperly or within reach.',      'Store chemicals in a locked cabinet away from children.');