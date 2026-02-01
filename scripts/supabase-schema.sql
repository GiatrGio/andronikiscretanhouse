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

-- Note: After running this script, you also need to:
-- 1. Create a storage bucket named 'recipe-images' with public access
-- 2. Create an admin user via Authentication > Users > Add User
