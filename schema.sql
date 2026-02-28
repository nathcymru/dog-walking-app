-- Dog Walking App - Complete D1 Database Schema

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('client', 'admin')) DEFAULT 'client',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS client_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    breed TEXT,
    date_of_birth DATE,
    photo_url TEXT,
    vet_name TEXT,
    vet_contact TEXT,
    medical_notes TEXT,
    medications TEXT,
    behaviour_notes TEXT,
    access_instructions TEXT,
    feeding_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS walkers (
    walker_id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    preferred_name TEXT,
    email TEXT NOT NULL UNIQUE,
    phone_mobile TEXT NOT NULL,
    phone_alternative TEXT,
    address_line_1 TEXT,
    town_city TEXT,
    postcode TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    employment_status TEXT NOT NULL CHECK(employment_status IN ('employee', 'worker', 'contractor')),
    start_date TEXT NOT NULL,
    account_status TEXT NOT NULL DEFAULT 'active' CHECK(account_status IN ('active', 'suspended', 'left')),
    photo_url TEXT,
    notes_internal TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_walkers_status ON walkers(account_status);
CREATE INDEX IF NOT EXISTS idx_walkers_email ON walkers(email);

CREATE TABLE IF NOT EXISTS walk_slots (
    id TEXT PRIMARY KEY,
    start_at TEXT NOT NULL,
    end_at TEXT NOT NULL,
    walk_type TEXT NOT NULL CHECK(walk_type IN ('GROUP', 'PRIVATE')),
    capacity_dogs INTEGER NOT NULL,
    walker_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK(status IN ('AVAILABLE', 'CANCELLED', 'LOCKED')),
    location_label TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (walker_id) REFERENCES walkers(walker_id)
);

CREATE INDEX IF NOT EXISTS idx_slots_start ON walk_slots(start_at);
CREATE INDEX IF NOT EXISTS idx_slots_walker ON walk_slots(walker_id);
CREATE INDEX IF NOT EXISTS idx_slots_status ON walk_slots(status);

CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    datetime_start DATETIME NOT NULL,
    datetime_end DATETIME NOT NULL,
    service_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
    walker_name TEXT,
    notes TEXT,
    slot_id TEXT,
    booking_status TEXT DEFAULT 'PENDING_APPROVAL' CHECK(booking_status IN ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'CANCELLED_BY_CLIENT', 'CANCELLED_BY_ADMIN')),
    requested_at TEXT NOT NULL DEFAULT (datetime('now')),
    decided_at TEXT,
    decided_by_user_id TEXT,
    decision_notes TEXT,
    cancellation_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES walk_slots(id)
);

CREATE TABLE IF NOT EXISTS booking_pets (
    booking_id INTEGER NOT NULL,
    pet_id INTEGER NOT NULL,
    PRIMARY KEY (booking_id, pet_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    period TEXT,
    status TEXT NOT NULL CHECK(status IN ('unpaid', 'paid', 'part_paid')) DEFAULT 'unpaid',
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT CHECK(payment_method IN ('cash', 'bank_transfer', 'other')),
    payment_date DATE,
    payment_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS invoice_line_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payment_proofs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_client_profiles_user_id ON client_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_pets_client_id ON pets(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_datetime_start ON bookings(datetime_start);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- Insert demo admin user (password: admin123)
-- Note: This is a simple hash for demo - in production use proper bcrypt
INSERT OR IGNORE INTO users (id, email, password_hash, role) 
VALUES (1, 'admin@pawwalkers.com', 'b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342', 'admin');

INSERT OR IGNORE INTO client_profiles (user_id, full_name, phone) 
VALUES (1, 'Admin User', '020 1234 5678');

-- Insert demo client user (password: client123)
INSERT OR IGNORE INTO users (id, email, password_hash, role) 
VALUES (2, 'client@example.com', '8d23b08d44e5b2d1b4b3d7b8c5f6a7e9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', 'client');

INSERT OR IGNORE INTO client_profiles (user_id, full_name, phone, address) 
VALUES (2, 'John Smith', '020 9876 5432', '123 Dog Street, London, N1 1AA');

-- Insert demo pet
INSERT OR IGNORE INTO pets (id, client_id, name, breed, medical_notes, behaviour_notes, access_instructions)
VALUES (1, 2, 'Max', 'Golden Retriever', 'No known allergies', 'Friendly with other dogs', 'Key under mat, alarm code 1234');

-- Insert demo booking
INSERT OR IGNORE INTO bookings (id, client_id, datetime_start, datetime_end, service_type, status, walker_name)
VALUES (1, 2, datetime('now', '+1 day'), datetime('now', '+1 day', '+1 hour'), 'Solo Walk', 'scheduled', 'Sarah Walker');

INSERT OR IGNORE INTO booking_pets (booking_id, pet_id) VALUES (1, 1);

-- Insert demo invoice
INSERT OR IGNORE INTO invoices (id, client_id, invoice_number, issue_date, due_date, period, status, total_amount)
VALUES (1, 2, 'INV-001', date('now'), date('now', '+14 days'), 'January 2026', 'unpaid', 60.00);

INSERT OR IGNORE INTO invoice_line_items (invoice_id, description, quantity, unit_price, total)
VALUES (1, 'Solo Walk - Max', 4, 15.00, 60.00);

-- Walker Compliance Tracking (Phase 4)
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

-- Walker Leave Management (Phase 5)
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
