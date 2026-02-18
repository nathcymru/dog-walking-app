-- REWARDS SYSTEM DATABASE MIGRATION
-- Run these commands in Cloudflare D1 Console to add comprehensive rewards system

-- Step 1: Create reward_campaigns table
CREATE TABLE IF NOT EXISTS reward_campaigns (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  type TEXT NOT NULL CHECK (type IN ('ONE_OFF', 'CAMPAIGN', 'LOYALTY')),
  scope TEXT NOT NULL CHECK (scope IN ('SINGLE_CLIENT', 'ALL_CLIENTS')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  redemption_mode TEXT NOT NULL CHECK (redemption_mode IN ('INTERNAL_CODE', 'EXTERNAL_LINK')),
  
  cta_label TEXT NOT NULL,
  cta_url TEXT,
  
  image_url TEXT,
  
  starts_at DATETIME,
  ends_at DATETIME,
  is_active INTEGER DEFAULT 0,
  
  -- Loyalty fields
  loyalty_metric TEXT CHECK (loyalty_metric IN ('WALKS', 'SPEND')),
  loyalty_window TEXT CHECK (loyalty_window IN ('MONTH', 'QUARTER', 'SIX_MONTH', 'TWELVE_MONTH')),
  loyalty_threshold REAL,
  voucher_prefix TEXT,
  
  -- Internal voucher fields
  discount_type TEXT CHECK (discount_type IN ('PERCENT', 'FIXED')),
  discount_value REAL,
  shared_voucher_code TEXT,
  
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_rewards_active ON reward_campaigns(is_active, type);
CREATE INDEX IF NOT EXISTS idx_rewards_dates ON reward_campaigns(starts_at, ends_at);

-- Step 2: Create rewards_issued table
CREATE TABLE IF NOT EXISTS rewards_issued (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  campaign_id TEXT NOT NULL,
  client_user_id TEXT NOT NULL,
  voucher_code TEXT,
  voucher_type TEXT CHECK (voucher_type IN ('INTERNAL', 'EXTERNAL')),
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'USED', 'INVALIDATED')),
  issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  window_key TEXT,
  used_at DATETIME,
  used_invoice_id TEXT,
  
  FOREIGN KEY (campaign_id) REFERENCES reward_campaigns(id) ON DELETE CASCADE,
  FOREIGN KEY (client_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (used_invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
  
  -- Idempotency: one voucher per campaign/client/window
  UNIQUE (campaign_id, client_user_id, window_key)
);

CREATE INDEX IF NOT EXISTS idx_issued_client ON rewards_issued(client_user_id, status);
CREATE INDEX IF NOT EXISTS idx_issued_campaign ON rewards_issued(campaign_id);
CREATE INDEX IF NOT EXISTS idx_voucher_code ON rewards_issued(voucher_code);

-- Step 3: Alter invoices table to add reward columns
-- Note: SQLite doesn't support adding multiple columns in one statement
ALTER TABLE invoices ADD COLUMN applied_reward_issued_id TEXT;
ALTER TABLE invoices ADD COLUMN applied_voucher_code TEXT;
ALTER TABLE invoices ADD COLUMN discount_amount REAL DEFAULT 0;
ALTER TABLE invoices ADD COLUMN total_after_discount REAL;

CREATE INDEX IF NOT EXISTS idx_invoices_reward ON invoices(applied_reward_issued_id);

-- Migration complete!
-- Note: The single_active_loyalty constraint is enforced at the application level
-- due to SQLite limitations with cross-row constraints.
