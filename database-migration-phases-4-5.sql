-- Phase 4: Compliance Tracking
-- Run this migration to add walker compliance tracking

CREATE TABLE IF NOT EXISTS walker_compliance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    walker_id TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK(item_type IN (
        'DBS Check',
        'First Aid Certificate',
        'Public Liability Insurance',
        'Pet First Aid',
        'Driving Licence',
        'Vehicle Insurance',
        'Dog Walking Licence',
        'Other'
    )),
    status TEXT NOT NULL DEFAULT 'valid' CHECK(status IN ('valid', 'expired', 'pending', 'not_required')),
    issued_at TEXT,
    expires_at TEXT,
    reference_number TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (walker_id) REFERENCES walkers(walker_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_compliance_walker ON walker_compliance(walker_id);
CREATE INDEX IF NOT EXISTS idx_compliance_expires ON walker_compliance(expires_at);

-- Phase 5: Leave Management

CREATE TABLE IF NOT EXISTS walker_leave (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    walker_id TEXT NOT NULL,
    leave_type TEXT NOT NULL CHECK(leave_type IN (
        'Annual Leave',
        'Sick Leave',
        'Maternity/Paternity',
        'Compassionate',
        'Unpaid',
        'Training',
        'Other'
    )),
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'approved' CHECK(status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    created_by_user_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (walker_id) REFERENCES walkers(walker_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_leave_walker ON walker_leave(walker_id);
CREATE INDEX IF NOT EXISTS idx_leave_dates ON walker_leave(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_leave_status ON walker_leave(status);
