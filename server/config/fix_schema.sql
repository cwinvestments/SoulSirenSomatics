-- ============================================
-- SoulSirenSomatics Database Schema Fix
-- Run this in Supabase SQL Editor
-- ============================================

-- ===================
-- FIX SCANS TABLE
-- ===================

-- Add scan_date column (used by routes for when scan was performed)
ALTER TABLE scans ADD COLUMN IF NOT EXISTS scan_date DATE DEFAULT CURRENT_DATE;

-- Add findings column (used instead of report_content)
ALTER TABLE scans ADD COLUMN IF NOT EXISTS findings TEXT;

-- Add recommendations column
ALTER TABLE scans ADD COLUMN IF NOT EXISTS recommendations TEXT;

-- Add updated_at column
ALTER TABLE scans ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Ensure created_at exists
ALTER TABLE scans ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


-- ===================
-- FIX MEMBERSHIPS TABLE
-- ===================

-- Add created_at column
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add updated_at column
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add start_date column (routes use this instead of started_at)
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add end_date column (routes use this instead of next_billing_date)
ALTER TABLE memberships ADD COLUMN IF NOT EXISTS end_date TIMESTAMP;

-- Copy data from old columns to new if they exist
-- (These will fail silently if old columns don't exist)
DO $$
BEGIN
  -- Copy started_at to start_date if started_at exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'started_at') THEN
    UPDATE memberships SET start_date = started_at WHERE start_date IS NULL AND started_at IS NOT NULL;
  END IF;

  -- Copy next_billing_date to end_date if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'next_billing_date') THEN
    UPDATE memberships SET end_date = next_billing_date WHERE end_date IS NULL AND next_billing_date IS NOT NULL;
  END IF;
END $$;


-- ===================
-- FIX BOOKINGS TABLE (ensure all columns exist)
-- ===================

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


-- ===================
-- FIX USERS TABLE (ensure all columns exist)
-- ===================

ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'client';
ALTER TABLE users ADD COLUMN IF NOT EXISTS membership_tier VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


-- ===================
-- VERIFY TABLES EXIST
-- ===================

-- Create scans table if it doesn't exist
CREATE TABLE IF NOT EXISTS scans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  scan_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'pending',
  findings TEXT,
  recommendations TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create memberships table if it doesn't exist
CREATE TABLE IF NOT EXISTS memberships (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  service_type VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER DEFAULT 60,
  status VARCHAR(20) DEFAULT 'pending',
  price DECIMAL(10,2),
  zoom_link VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ===================
-- CREATE INDEXES
-- ===================

CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_scan_date ON scans(scan_date);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);


-- ===================
-- DONE!
-- ===================
SELECT 'Schema fix complete!' as result;
