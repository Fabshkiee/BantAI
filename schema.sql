
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;


-- Hazard type reference table
-- Seed this with known hazard categories at app install time.

CREATE TABLE IF NOT EXISTS hazard_types (
    id               TEXT PRIMARY KEY,                        -- e.g. 'open_port', 'malware_sig'
    name             TEXT NOT NULL,
    category         TEXT NOT NULL,                          -- e.g. 'network', 'file', 'permission'
    default_severity TEXT NOT NULL DEFAULT 'medium'
                     CHECK (default_severity IN ('low', 'medium', 'high', 'critical')),
    description      TEXT
);


-- Scan reports — one row per scan session

CREATE TABLE IF NOT EXISTS scan_reports (
    id               TEXT PRIMARY KEY,                        -- UUID generated locally
    scan_type        TEXT NOT NULL,                          -- 'network' | 'file' | 'permission' | 'full'
    status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    started_at       INTEGER NOT NULL,                       -- Unix epoch (seconds)
    completed_at     INTEGER,                                -- NULL while in progress
    hazard_count     INTEGER NOT NULL DEFAULT 0,
    summary          TEXT,                                   -- Short human-readable result note
    raw_data_path    TEXT,                                   -- Optional: path to full dump on disk
    created_at       INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);


-- Detected hazards — one row per hazard found in a scan

CREATE TABLE IF NOT EXISTS detected_hazards (
    id               TEXT PRIMARY KEY,                        -- UUID generated locally
    report_id        TEXT NOT NULL REFERENCES scan_reports(id) ON DELETE CASCADE,
    hazard_type_id   TEXT REFERENCES hazard_types(id) ON DELETE SET NULL,
    severity         TEXT NOT NULL DEFAULT 'medium'
                     CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title            TEXT NOT NULL,
    description      TEXT,
    location_hint    TEXT,                                   -- e.g. file path, port number, package name
    recommendation   TEXT,
    is_resolved      INTEGER NOT NULL DEFAULT 0              -- 0 = open, 1 = resolved (SQLite bool)
                     CHECK (is_resolved IN (0, 1)),
    resolved_at      INTEGER,                                -- NULL if not yet resolved
    detected_at      INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);


-- Scan tags — flexible labels on reports (e.g. 'scheduled', 'manual')

CREATE TABLE IF NOT EXISTS scan_tags (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id        TEXT NOT NULL REFERENCES scan_reports(id) ON DELETE CASCADE,
    tag              TEXT NOT NULL,
    UNIQUE (report_id, tag)
);


-- App settings — key/value store for local preferences

CREATE TABLE IF NOT EXISTS app_settings (
    key              TEXT PRIMARY KEY,
    value            TEXT,
    updated_at       INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);


-- Indexes

CREATE INDEX IF NOT EXISTS idx_hazards_report_id   ON detected_hazards (report_id);
CREATE INDEX IF NOT EXISTS idx_hazards_severity    ON detected_hazards (severity);
CREATE INDEX IF NOT EXISTS idx_hazards_is_resolved ON detected_hazards (is_resolved);
CREATE INDEX IF NOT EXISTS idx_reports_status      ON scan_reports (status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at  ON scan_reports (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tags_report_id      ON scan_tags (report_id);


-- Seed: built-in hazard types

INSERT OR IGNORE INTO hazard_types (id, name, category, default_severity, description) VALUES
    ('open_port',         'Open Port',              'network',    'medium',   'A network port is exposed and reachable'),
    ('weak_protocol',     'Weak Protocol',          'network',    'high',     'Insecure protocol in use (e.g. HTTP, TLS 1.0)'),
    ('malware_sig',       'Malware Signature',      'file',       'critical', 'File matches a known malware signature'),
    ('suspicious_file',   'Suspicious File',        'file',       'high',     'File exhibits suspicious properties or location'),
    ('excess_permission', 'Excessive Permission',   'permission', 'medium',   'App or process holds unnecessary permissions'),
    ('outdated_package',  'Outdated Package',       'software',   'low',      'Installed package has a newer version available'),
    ('config_flaw',       'Misconfiguration',       'config',     'high',     'Security-relevant setting is misconfigured'),
    ('leaked_credential', 'Leaked Credential',      'data',       'critical', 'Credential or secret found in an unsafe location');