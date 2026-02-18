-- Database Migration: Slot-Based Scheduling + Booking Approval + Walkers Module
-- This migration creates all tables required for the slot-based booking system with approval workflow
-- and comprehensive walker management with compliance tracking

-- ============================================================================
-- TABLE 1: WALKERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS walkers (
  walker_id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  preferred_name TEXT,
  date_of_birth DATE,
  email TEXT NOT NULL UNIQUE,
  phone_mobile TEXT NOT NULL,
  phone_alternative TEXT,
  address_line_1 TEXT,
  address_line_2 TEXT,
  town_city TEXT,
  county TEXT,
  postcode TEXT,
  emergency_contact_name TEXT,
  emergency_contact_relationship TEXT,
  emergency_contact_phone TEXT,
  national_insurance_number TEXT,
  employment_status TEXT NOT NULL CHECK(employment_status IN ('employee', 'worker', 'contractor')),
  contract_type TEXT CHECK(contract_type IN ('full_time', 'part_time', 'zero_hours')),
  job_title TEXT DEFAULT 'Dog Walker',
  start_date DATE NOT NULL,
  end_date DATE,
  hourly_rate DECIMAL(10,2),
  account_status TEXT NOT NULL CHECK(account_status IN ('active', 'suspended', 'left')) DEFAULT 'active',
  photo_url TEXT,
  notes_internal TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_walkers_status ON walkers(account_status);
CREATE INDEX IF NOT EXISTS idx_walkers_email ON walkers(email);

-- ============================================================================
-- TABLE 2: WALK_SLOTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS walk_slots (
  id TEXT PRIMARY KEY,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  walk_type TEXT NOT NULL CHECK(walk_type IN ('GROUP', 'PRIVATE')),
  capacity_dogs INTEGER NOT NULL,
  walker_id TEXT NOT NULL REFERENCES walkers(walker_id),
  status TEXT NOT NULL CHECK(status IN ('AVAILABLE', 'CANCELLED', 'LOCKED')) DEFAULT 'AVAILABLE',
  location_label TEXT,
  notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_slots_start ON walk_slots(start_at);
CREATE INDEX IF NOT EXISTS idx_slots_walker ON walk_slots(walker_id);
CREATE INDEX IF NOT EXISTS idx_slots_status ON walk_slots(status);
CREATE INDEX IF NOT EXISTS idx_slots_type_start ON walk_slots(walk_type, start_at);

-- ============================================================================
-- TABLE 3: WALKER_COMPLIANCE_ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS walker_compliance_items (
  id TEXT PRIMARY KEY,
  walker_id TEXT NOT NULL REFERENCES walkers(walker_id),
  item_type TEXT NOT NULL CHECK(item_type IN ('RIGHT_TO_WORK', 'DBS', 'DRIVING_LICENCE', 
    'BUSINESS_INSURANCE', 'FIRST_AID', 'MANUAL_HANDLING', 'SAFEGUARDING', 'H_S_INDUCTION')),
  status TEXT NOT NULL CHECK(status IN ('valid', 'due_soon', 'expired', 'pending', 'not_required')) DEFAULT 'pending',
  valid_from DATE,
  valid_until DATE,
  renewal_interval_months INTEGER,
  current_reference TEXT,
  last_verified_at DATETIME,
  last_verified_by_user_id TEXT,
  notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(walker_id, item_type)
);

CREATE INDEX IF NOT EXISTS idx_compliance_status ON walker_compliance_items(status);
CREATE INDEX IF NOT EXISTS idx_compliance_valid ON walker_compliance_items(valid_until);
CREATE INDEX IF NOT EXISTS idx_compliance_type ON walker_compliance_items(item_type);

-- ============================================================================
-- TABLE 4: WALKER_COMPLIANCE_EVENTS (Append-Only)
-- ============================================================================
CREATE TABLE IF NOT EXISTS walker_compliance_events (
  id TEXT PRIMARY KEY,
  walker_id TEXT NOT NULL REFERENCES walkers(walker_id),
  item_type TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK(event_type IN ('checked', 'renewed', 'uploaded', 'expired', 'revoked', 'waived')),
  event_at DATETIME NOT NULL,
  performed_by_user_id TEXT NOT NULL,
  result TEXT NOT NULL CHECK(result IN ('pass', 'fail', 'conditional', 'info_only')),
  reference_number TEXT,
  valid_from DATE,
  valid_until DATE,
  evidence_file_id TEXT,
  comments TEXT,
  immutable_hash TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_walker ON walker_compliance_events(walker_id, item_type, event_at DESC);

-- ============================================================================
-- TABLE 5: EVIDENCE_FILES
-- ============================================================================
CREATE TABLE IF NOT EXISTS evidence_files (
  id TEXT PRIMARY KEY,
  owner_type TEXT NOT NULL DEFAULT 'walker',
  owner_id TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK(file_type IN ('certificate', 'insurance_policy', 'dbs', 'licence_check', 'other')),
  url TEXT,
  storage_key TEXT,
  original_filename TEXT,
  uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  uploaded_by_user_id TEXT NOT NULL,
  retention_until DATE NOT NULL,
  deleted_at DATETIME
);

-- ============================================================================
-- TABLE 6: WALKER_LEAVE_REQUESTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS walker_leave_requests (
  id TEXT PRIMARY KEY,
  walker_id TEXT NOT NULL REFERENCES walkers(walker_id),
  leave_type TEXT NOT NULL CHECK(leave_type IN ('holiday', 'sick', 'unpaid', 'training', 'other')),
  status TEXT NOT NULL CHECK(status IN ('requested', 'approved', 'rejected', 'cancelled')) DEFAULT 'requested',
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  all_day INTEGER NOT NULL DEFAULT 0,
  requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  requested_by_user_id TEXT NOT NULL,
  approved_at DATETIME,
  approved_by_user_id TEXT,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_leave_walker ON walker_leave_requests(walker_id, start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_leave_status ON walker_leave_requests(status);

-- ============================================================================
-- TABLE 7: EXTEND BOOKINGS TABLE
-- ============================================================================
-- Add new fields to existing bookings table for slot-based booking with approval

-- Add slot reference
ALTER TABLE bookings ADD COLUMN slot_id TEXT REFERENCES walk_slots(id);

-- Add booking status for approval workflow
ALTER TABLE bookings ADD COLUMN booking_status TEXT 
  CHECK(booking_status IN ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 
                            'CANCELLED_BY_CLIENT', 'CANCELLED_BY_ADMIN')) DEFAULT 'APPROVED';

-- Add approval workflow timestamps and metadata
ALTER TABLE bookings ADD COLUMN requested_at DATETIME;
ALTER TABLE bookings ADD COLUMN decided_at DATETIME;
ALTER TABLE bookings ADD COLUMN decided_by_user_id TEXT;
ALTER TABLE bookings ADD COLUMN decision_notes TEXT;
ALTER TABLE bookings ADD COLUMN cancellation_reason TEXT;

-- Create index for slot_id lookups
CREATE INDEX IF NOT EXISTS idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_requested_at ON bookings(requested_at);

-- ============================================================================
-- DEMO DATA: Walkers
-- ============================================================================
-- Insert demo walkers for testing
INSERT OR IGNORE INTO walkers (
  walker_id, first_name, last_name, email, phone_mobile, 
  employment_status, start_date, account_status
) VALUES (
  'walker-001',
  'Sarah',
  'Walker',
  'sarah.walker@pawwalkers.com',
  '07700900001',
  'employee',
  date('2024-01-15'),
  'active'
);

INSERT OR IGNORE INTO walkers (
  walker_id, first_name, last_name, email, phone_mobile, 
  employment_status, start_date, account_status
) VALUES (
  'walker-002',
  'James',
  'Brown',
  'james.brown@pawwalkers.com',
  '07700900002',
  'employee',
  date('2024-03-01'),
  'active'
);

-- Seed compliance items for demo walkers (all 8 types, status='pending')
-- Walker 1 compliance items
INSERT OR IGNORE INTO walker_compliance_items (id, walker_id, item_type, status)
VALUES 
  ('comp-001-rtw', 'walker-001', 'RIGHT_TO_WORK', 'pending'),
  ('comp-001-dbs', 'walker-001', 'DBS', 'pending'),
  ('comp-001-dl', 'walker-001', 'DRIVING_LICENCE', 'pending'),
  ('comp-001-ins', 'walker-001', 'BUSINESS_INSURANCE', 'pending'),
  ('comp-001-fa', 'walker-001', 'FIRST_AID', 'pending'),
  ('comp-001-mh', 'walker-001', 'MANUAL_HANDLING', 'pending'),
  ('comp-001-sg', 'walker-001', 'SAFEGUARDING', 'pending'),
  ('comp-001-hs', 'walker-001', 'H_S_INDUCTION', 'pending');

-- Walker 2 compliance items
INSERT OR IGNORE INTO walker_compliance_items (id, walker_id, item_type, status)
VALUES 
  ('comp-002-rtw', 'walker-002', 'RIGHT_TO_WORK', 'pending'),
  ('comp-002-dbs', 'walker-002', 'DBS', 'pending'),
  ('comp-002-dl', 'walker-002', 'DRIVING_LICENCE', 'pending'),
  ('comp-002-ins', 'walker-002', 'BUSINESS_INSURANCE', 'pending'),
  ('comp-002-fa', 'walker-002', 'FIRST_AID', 'pending'),
  ('comp-002-mh', 'walker-002', 'MANUAL_HANDLING', 'pending'),
  ('comp-002-sg', 'walker-002', 'SAFEGUARDING', 'pending'),
  ('comp-002-hs', 'walker-002', 'H_S_INDUCTION', 'pending');

-- ============================================================================
-- DEMO DATA: Walk Slots
-- ============================================================================
-- Insert some demo walk slots for the next week
INSERT OR IGNORE INTO walk_slots (
  id, start_at, end_at, walk_type, capacity_dogs, walker_id, status, location_label
) VALUES 
  ('slot-001', datetime('now', '+1 day', '09:00'), datetime('now', '+1 day', '10:00'), 'GROUP', 6, 'walker-001', 'AVAILABLE', 'Hampstead Heath'),
  ('slot-002', datetime('now', '+1 day', '11:00'), datetime('now', '+1 day', '12:00'), 'PRIVATE', 1, 'walker-001', 'AVAILABLE', 'Richmond Park'),
  ('slot-003', datetime('now', '+2 days', '09:00'), datetime('now', '+2 days', '10:00'), 'GROUP', 6, 'walker-002', 'AVAILABLE', 'Clapham Common'),
  ('slot-004', datetime('now', '+2 days', '14:00'), datetime('now', '+2 days', '15:00'), 'GROUP', 4, 'walker-001', 'AVAILABLE', 'Hyde Park'),
  ('slot-005', datetime('now', '+3 days', '10:00'), datetime('now', '+3 days', '11:00'), 'PRIVATE', 1, 'walker-002', 'AVAILABLE', 'Regent\'s Park');
