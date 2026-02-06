-- Supabase Database Schema for Androniki's Cretan House
-- Run this in your Supabase SQL Editor to create the required tables

-- Create recipes table with JSONB for flexible recipe data
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes ((data->>'slug'));
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes ((data->>'category'));

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read recipes (public)
CREATE POLICY "Public read" ON recipes
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert
CREATE POLICY "Auth insert" ON recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can update
CREATE POLICY "Auth update" ON recipes
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can delete
CREATE POLICY "Auth delete" ON recipes
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row updates
DROP TRIGGER IF EXISTS update_recipes_updated_at ON recipes;
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Preferences & Booking Availability
-- ============================================

-- Single-row table for site-wide booking preferences
CREATE TABLE IF NOT EXISTS preferences (
  id INTEGER PRIMARY KEY DEFAULT 1,
  season_start_month INTEGER NOT NULL DEFAULT 4,
  season_start_day INTEGER NOT NULL DEFAULT 20,
  season_end_month INTEGER NOT NULL DEFAULT 10,
  season_end_day INTEGER NOT NULL DEFAULT 9,
  available_days INTEGER[] NOT NULL DEFAULT '{0,1,2,3,4,5,6}',
  default_spots INTEGER NOT NULL DEFAULT 8,
  monthly_time_slots JSONB DEFAULT '[{"label":"Default","months":[1,2,3,4,5,6,7,8,9,10,11,12],"start_time":"17:30","end_time":"21:30"}]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Per-date availability overrides
CREATE TABLE IF NOT EXISTS date_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  available_spots INTEGER,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies for preferences (public read, auth write)
ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read preferences" ON preferences FOR SELECT USING (true);
CREATE POLICY "Auth update preferences" ON preferences FOR ALL TO authenticated USING (true);

-- RLS policies for date_overrides (public read, auth write)
ALTER TABLE date_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read overrides" ON date_overrides FOR SELECT USING (true);
CREATE POLICY "Auth manage overrides" ON date_overrides FOR ALL TO authenticated USING (true);

-- Migration: Add monthly_time_slots to existing preferences table
-- ALTER TABLE preferences ADD COLUMN IF NOT EXISTS monthly_time_slots JSONB
--   DEFAULT '[{"label":"Default","months":[1,2,3,4,5,6,7,8,9,10,11,12],"start_time":"17:30","end_time":"21:30"}]';

-- Note: After running this script, you also need to:
-- 1. Create a storage bucket named 'recipe-images' with public access
-- 2. Create an admin user via Authentication > Users > Add User
