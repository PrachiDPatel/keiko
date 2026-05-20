-- CodeNinjas Scheduler — Supabase schema
-- Paste this into the Supabase SQL editor and click Run

CREATE TABLE IF NOT EXISTS sessions (
  id              BIGSERIAL PRIMARY KEY,
  date            DATE        NOT NULL,
  time_slot       TEXT        NOT NULL DEFAULT 'afternoon',  -- morning | afternoon | evening
  kids_count      INTEGER     NOT NULL CHECK (kids_count >= 0),
  senseis_count   INTEGER     NOT NULL CHECK (senseis_count >= 0),
  duration_hours  NUMERIC(4,2) NOT NULL DEFAULT 1.5,
  commute_score   SMALLINT    CHECK (commute_score BETWEEN 1 AND 5),  -- 1=easy 5=rough
  notes           TEXT,
  -- weather (auto-filled from Open-Meteo)
  weather_temp_f  NUMERIC(5,1),
  weather_code    INTEGER,
  weather_precip  NUMERIC(6,2),
  weather_desc    TEXT,
  -- school context (auto-filled from calendar)
  is_school_day   BOOLEAN,
  school_event    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sessions_date_idx ON sessions(date);

-- Enable public read/write (no auth for personal use)
-- If you want password protection, set up Supabase Auth and adjust these policies
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON sessions FOR ALL USING (true) WITH CHECK (true);
