-- Migration: Make username nullable for wallet-only authentication
-- Run this on existing Supabase projects to update the schema

-- Remove NOT NULL constraint from username
ALTER TABLE players ALTER COLUMN username DROP NOT NULL;

-- Add comment for clarity
COMMENT ON COLUMN players.username IS 'Auto-generated from wallet address (0x1234...5678). Nullable for backwards compatibility.';
