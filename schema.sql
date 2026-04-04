
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
    risk_variant    TEXT                        -- 'low' | 'medium' | 'high' | 'critical' from getRiskVariant()
                    CHECK (risk_variant IN ('low', 'medium', 'high', 'critical')),
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
    name             TEXT NOT NULL UNIQUE,      -- canonical model label, e.g. 'overloaded_socket'
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
    ('overloaded_socket',        'electrical', 'high',     'Too many devices plugged into a single socket or extension strip.', 'Distribute devices across outlets and avoid overloading a single socket.'),
    ('damaged_wire',             'electrical', 'critical', 'Bare, frayed, or visibly damaged wiring is present.',              'Replace or isolate damaged wiring immediately and consult an electrician.'),
    ('floor_appliance',          'trip',       'medium',   'An appliance or its cable is placed where people may trip over it.', 'Move the appliance and route cables away from walkways.'),
    ('major_crack',              'structural', 'critical', 'A large crack is visible in a wall, ceiling, or foundation surface.', 'Restrict access and have the structure assessed by a qualified professional.'),
    ('minor_crack',              'structural', 'medium',   'A smaller crack is visible and may require monitoring or repair.',   'Monitor the crack and repair it before it worsens.'),
    ('collapsed_structure',      'structural', 'critical', 'A structural element appears collapsed, broken, or unstable.',      'Keep clear of the area and contact emergency or structural support services.'),
    ('broken_glass',             'trip',       'medium',   'Broken glass or sharp fragments are visible on the floor or surfaces.', 'Clean up the broken glass carefully and dispose of it safely.'),
    ('electronic_hazard',        'electrical', 'high',     'An electronic device, charger, or power source looks unsafe or misused.', 'Disconnect the device and inspect it before using it again.'),
    ('elevated_breakables',      'structural', 'medium',   'Breakable objects are stored in a high position where they may fall.', 'Move breakables to a secure, lower location.'),
    ('exposed_breaker',         'electrical', 'critical', 'A breaker panel or electrical distribution component is exposed.',  'Restrict access and have the electrical panel covered or repaired immediately.'),
    ('exposed_ceiling_lights',  'electrical', 'high',     'Ceiling lights or fixtures are exposed, loose, or damaged.',        'Repair or cover the fixture before using the area normally.'),
    ('heavy_wooden_furniture',  'structural', 'high',     'Tall or heavy wooden furniture could tip over or fall.',           'Anchor the furniture securely to prevent tipping.'),
    ('open_flame_hazard',       'fire',       'critical', 'An open flame or ignition source is present near combustibles.',   'Extinguish the flame and keep combustible materials away from heat sources.');