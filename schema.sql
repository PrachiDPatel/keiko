-- CodeNinjas Scheduler — Supabase schema
-- Paste this into the Supabase SQL editor and click Run

CREATE TABLE IF NOT EXISTS sessions (
  id              BIGSERIAL PRIMARY KEY,
  date            DATE        NOT NULL UNIQUE,
  reporter        TEXT        NOT NULL,
  time_slot       TEXT        NOT NULL DEFAULT 'afternoon',  -- morning | afternoon | evening (auto-detected)
  kids_count      INTEGER     NOT NULL CHECK (kids_count >= 0),
  senseis_count   INTEGER     NOT NULL CHECK (senseis_count >= 0),
  duration_hours  NUMERIC(4,2) NOT NULL DEFAULT 1.5,         -- auto from config
  -- weather (auto-filled from Open-Meteo)
  weather_temp_f  NUMERIC(5,1),
  weather_code    INTEGER,
  weather_precip  NUMERIC(6,2),
  weather_desc    TEXT,
  -- school context (auto-filled from calendar)
  is_school_day        BOOLEAN,
  school_event         TEXT,
  -- traffic (auto-filled from TomTom Flow API at page-load time)
  traffic_congestion   NUMERIC(3,2),  -- 0 = free flow, 1 = standstill
  traffic_captured_at  TIMESTAMPTZ,   -- when the reading was taken (compare to session time)
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sessions_date_idx ON sessions(date);

-- Enable public read/write (no auth for personal use)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON sessions FOR ALL USING (true) WITH CHECK (true);

-- ── Traffic snapshots (written by GitHub Actions at session time) ──────────
CREATE TABLE IF NOT EXISTS traffic_snapshots (
  id              BIGSERIAL PRIMARY KEY,
  date            DATE        NOT NULL UNIQUE,
  session_time    TEXT        NOT NULL,
  congestion      NUMERIC(3,2),
  current_speed   NUMERIC(5,1),
  free_flow_speed NUMERIC(5,1),
  captured_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS traffic_snapshots_date_idx ON traffic_snapshots(date);
ALTER TABLE traffic_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all" ON traffic_snapshots FOR ALL USING (true) WITH CHECK (true);

-- ── Migration (run once if table already exists) ───────────────────────────
-- ALTER TABLE sessions DROP COLUMN IF EXISTS commute_score;
-- ALTER TABLE sessions DROP COLUMN IF EXISTS notes;
-- ALTER TABLE sessions ADD COLUMN IF NOT EXISTS reporter TEXT NOT NULL DEFAULT '';
-- ALTER TABLE sessions ADD CONSTRAINT sessions_date_unique UNIQUE (date);
-- ALTER TABLE sessions ADD COLUMN IF NOT EXISTS traffic_congestion NUMERIC(3,2);
-- ALTER TABLE sessions ADD COLUMN IF NOT EXISTS traffic_captured_at TIMESTAMPTZ;
-- (New) traffic_snapshots table: see CREATE TABLE above — run the full block

-- ── Prediction columns (run once) ────────────────────────────────────────────
-- ALTER TABLE sessions ADD COLUMN IF NOT EXISTS week_of_school_year SMALLINT;
-- ALTER TABLE sessions ADD COLUMN IF NOT EXISTS prev_session_kids SMALLINT;
-- ALTER TABLE sessions ADD COLUMN IF NOT EXISTS day_of_week SMALLINT;
