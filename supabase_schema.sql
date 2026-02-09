-- ═══════════════════════════════════════════════════════════════════
-- RhythmTap — Supabase Database Schema
-- Run this in the Supabase SQL Editor (supabase.com → your project → SQL Editor)
-- ═══════════════════════════════════════════════════════════════════

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  musical_training BOOLEAN NOT NULL,
  condition_order  TEXT NOT NULL CHECK (condition_order IN ('visual_first', 'auditory_first')),
  user_agent       TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Trials table (one row per round — practice and real)
CREATE TABLE IF NOT EXISTS trials (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id  UUID NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  condition       TEXT NOT NULL CHECK (condition IN ('visual', 'auditory')),
  is_practice     BOOLEAN NOT NULL DEFAULT FALSE,
  bpm             INTEGER NOT NULL CHECK (bpm BETWEEN 80 AND 120),
  beat_timestamps JSONB NOT NULL DEFAULT '[]'::jsonb,   -- array of ms values
  tap_timestamps  JSONB NOT NULL DEFAULT '[]'::jsonb,   -- array of ms values
  duration_ms     DOUBLE PRECISION,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trials_participant ON trials(participant_id);
CREATE INDEX IF NOT EXISTS idx_participants_created ON participants(created_at);

-- ── Row Level Security ──────────────────────────────────────────
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE trials       ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (the app uses the Supabase anon key)
CREATE POLICY "anon_insert_participants" ON participants FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_insert_trials"      ON trials       FOR INSERT WITH CHECK (true);

-- Allow reads so you can query / export the data later
CREATE POLICY "anon_select_participants" ON participants FOR SELECT USING (true);
CREATE POLICY "anon_select_trials"      ON trials       FOR SELECT USING (true);
