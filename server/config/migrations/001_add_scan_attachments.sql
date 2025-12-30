-- Migration: Add attachments column to scans table
-- Run this in Supabase SQL Editor
-- Date: 2024-12-30

-- Add attachments JSONB column to store image/file references
-- Structure: [{ filename, url, type, uploaded_at, size }]
ALTER TABLE scans ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]';

-- Create index for better query performance on attachments
CREATE INDEX IF NOT EXISTS idx_scans_attachments ON scans USING GIN (attachments);

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'scans' AND column_name = 'attachments';
