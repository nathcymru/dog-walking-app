-- ADMIN PORTAL DATABASE MIGRATION
-- Run these commands ONE AT A TIME in Cloudflare D1 Console

-- WARNING: This will recreate tables with new fields
-- Make sure you've backed up your data first!

-- Step 1: Drop existing tables (this preserves foreign key integrity)
DROP TABLE IF EXISTS booking_pets;
DROP TABLE IF EXISTS invoice_line_items;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS incidents;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS client_profiles;

-- Step 2: Recreate client_profiles with ALL new fields
CREATE TABLE client_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    -- Identity & Contact
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    preferred_contact_method TEXT DEFAULT 'Email',
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    -- Address & Pickup
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    town TEXT NOT NULL,
    county TEXT NOT NULL,
    postcode TEXT NOT NULL,
    pickup_notes TEXT,
    -- Access & Keyholding
    access_required INTEGER DEFAULT 0,
    entry_method TEXT,
    key_reference_id TEXT,
    lockbox_location TEXT,
    lockbox_code TEXT,
    alarm_present INTEGER DEFAULT 0,
    alarm_instructions TEXT,
    alarm_code TEXT,
    parking_notes TEXT,
    equipment_storage_location TEXT,
    -- Vet Details
    vet_practice_name TEXT NOT NULL,
    vet_phone TEXT NOT NULL,
    vet_address TEXT,
    -- Consents
    terms_accepted INTEGER DEFAULT 0,
    privacy_accepted INTEGER DEFAULT 0,
    emergency_treatment_consent TEXT,
    emergency_spend_limit DECIMAL(10, 2),
    transport_consent INTEGER DEFAULT 0,
    photo_consent INTEGER DEFAULT 0,
    group_walk_consent INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 3: Recreate pets with ALL new fields
CREATE TABLE pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    -- Identity
    profile_photo_url TEXT,
    name TEXT NOT NULL,
    nickname TEXT,
    breed TEXT NOT NULL,
    sex TEXT NOT NULL,
    neutered INTEGER DEFAULT 0,
    date_of_birth DATE,
    colour_markings TEXT,
    -- Microchip
    microchipped INTEGER NOT NULL DEFAULT 0,
    microchip_number TEXT,
    collar_tag_present INTEGER DEFAULT 0,
    -- Group Walk Compatibility
    group_walk_eligible INTEGER NOT NULL DEFAULT 1,
    max_group_size INTEGER DEFAULT 4,
    around_other_dogs TEXT NOT NULL DEFAULT 'Unknown',
    around_puppies TEXT DEFAULT 'Unknown',
    around_small_dogs TEXT DEFAULT 'Unknown',
    around_large_dogs TEXT DEFAULT 'Unknown',
    play_style TEXT DEFAULT 'Unknown',
    resource_guarding TEXT NOT NULL DEFAULT 'Unknown',
    resource_guarding_details TEXT,
    muzzle_required_for_group TEXT DEFAULT 'No',
    muzzle_trained TEXT DEFAULT 'No',
    -- Health
    allergies TEXT NOT NULL DEFAULT 'Unknown',
    allergy_details TEXT,
    medical_conditions TEXT NOT NULL DEFAULT 'Unknown',
    condition_details TEXT,
    medications TEXT NOT NULL DEFAULT 'Unknown',
    medication_details TEXT,
    mobility_limits TEXT DEFAULT 'None',
    heat_sensitivity TEXT DEFAULT 'Unknown',
    vaccination_status TEXT NOT NULL DEFAULT 'Unknown',
    parasite_control TEXT DEFAULT 'Unknown',
    -- Behaviour & Handling
    lead_type TEXT NOT NULL DEFAULT 'Standard',
    harness_type TEXT DEFAULT 'None',
    pulling_level INTEGER DEFAULT 5,
    recall_reliability INTEGER DEFAULT 5,
    escape_risk TEXT NOT NULL DEFAULT 'Unknown',
    door_darter TEXT DEFAULT 'Unknown',
    bite_history TEXT NOT NULL DEFAULT 'Unknown',
    bite_history_details TEXT,
    reactivity_triggers TEXT,
    trigger_details TEXT,
    -- Feeding
    treats_allowed TEXT NOT NULL DEFAULT 'Yes',
    approved_treats TEXT,
    do_not_give_list TEXT,
    food_guarding TEXT DEFAULT 'Unknown',
    -- Walk Preferences
    preferred_walk_type TEXT NOT NULL DEFAULT 'Any',
    preferred_duration INTEGER NOT NULL DEFAULT 30,
    environment_restrictions TEXT,
    other_restriction TEXT,
    routine_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 4: Recreate bookings with workflow fields
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    datetime_start DATETIME NOT NULL,
    datetime_end DATETIME NOT NULL,
    service_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'approved', 'denied', 'cancelled', 'completed')) DEFAULT 'pending',
    walker_name TEXT,
    notes TEXT,
    admin_comment TEXT,
    time_window_start TIME,
    time_window_end TIME,
    recurrence TEXT DEFAULT 'One-off',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 5: Recreate booking_pets junction table
CREATE TABLE booking_pets (
    booking_id INTEGER NOT NULL,
    pet_id INTEGER NOT NULL,
    PRIMARY KEY (booking_id, pet_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE
);

-- Step 6: Create incidents table
CREATE TABLE incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_datetime DATETIME NOT NULL,
    incident_type TEXT NOT NULL,
    related_pet_id INTEGER NOT NULL,
    related_booking_id INTEGER,
    location TEXT,
    summary TEXT NOT NULL,
    actions_taken TEXT NOT NULL,
    owner_informed INTEGER DEFAULT 0,
    attachments TEXT,
    follow_up_required INTEGER DEFAULT 0,
    follow_up_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (related_pet_id) REFERENCES pets(id) ON DELETE CASCADE,
    FOREIGN KEY (related_booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Step 7: Recreate invoices (optional - if you want to keep invoice history, skip this)
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

-- Step 8: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_client_profiles_user_id ON client_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_pets_client_id ON pets(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_datetime_start ON bookings(datetime_start);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_incidents_pet_id ON incidents(related_pet_id);

-- Step 9: Insert demo data
INSERT INTO client_profiles (user_id, full_name, mobile, email, emergency_contact_name, emergency_contact_phone, address_line1, town, county, postcode, vet_practice_name, vet_phone, terms_accepted, privacy_accepted, group_walk_consent) VALUES (1, 'Admin User', '020 1234 5678', 'admin@pawwalkers.com', 'Emergency Contact', '020 9999 9999', '1 Admin Street', 'London', 'Greater London', 'SW1A 1AA', 'Admin Vet', '020 1111 1111', 1, 1, 1);

INSERT INTO client_profiles (user_id, full_name, mobile, email, emergency_contact_name, emergency_contact_phone, address_line1, town, county, postcode, vet_practice_name, vet_phone, terms_accepted, privacy_accepted, group_walk_consent) VALUES (2, 'John Smith', '020 9876 5432', 'client@example.com', 'Jane Smith', '020 9876 5433', '123 Dog Street', 'London', 'Greater London', 'N1 1AA', 'City Vets', '020 5555 5555', 1, 1, 1);

INSERT INTO client_profiles (user_id, full_name, mobile, email, emergency_contact_name, emergency_contact_phone, address_line1, town, county, postcode, vet_practice_name, vet_phone, terms_accepted, privacy_accepted, group_walk_consent) VALUES (3, 'Test User', '123456789', 'test@test.com', 'Test Emergency', '987654321', '456 Test Ave', 'London', 'Greater London', 'E1 1AA', 'Test Vet', '020 3333 3333', 1, 1, 1);

INSERT INTO pets (client_id, name, breed, sex, microchipped, around_other_dogs, resource_guarding, allergies, medical_conditions, medications, vaccination_status, lead_type, escape_risk, bite_history, treats_allowed, preferred_walk_type, preferred_duration, group_walk_eligible) VALUES (2, 'Max', 'Golden Retriever', 'Male', 1, 'Friendly', 'No', 'No', 'No', 'No', 'Up to date', 'Standard', 'Low', 'No', 'Yes', 'Group', 45, 1);

INSERT INTO bookings (client_id, datetime_start, datetime_end, service_type, status, walker_name) VALUES (2, datetime('now', '+1 day'), datetime('now', '+1 day', '+1 hour'), 'Solo Walk', 'approved', 'Sarah Walker');

INSERT INTO booking_pets (booking_id, pet_id) VALUES (1, 1);

-- DONE! Your database is now updated with all new fields.
-- Next: Upload the backend and frontend files to GitHub.
