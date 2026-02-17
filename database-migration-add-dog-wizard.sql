-- Database Migration for Multi-Step Dog Add Wizard
-- This migration adds all required fields for the redesigned add dog form

-- Step 1: Dog Profile Fields (mostly already exist, but ensuring consistency)
-- Ensure these columns exist with proper types
-- name, breed, date_of_birth, sex, microchipped, microchip_number already handled in schema
-- Adding age field for age-based input option
ALTER TABLE pets ADD COLUMN age INTEGER CHECK(age >= 0 AND age <= 30);

-- Ensure sex has proper constraint
-- Note: This may need to be recreated if existing constraint is different
-- sex TEXT CHECK(sex IN ('Male', 'Female'))

-- Ensure microchipped uses proper enum
-- microchipped TEXT CHECK(microchipped IN ('Yes', 'No', 'Unknown'))

-- Step 2: Walk Setup Fields (NEW)
ALTER TABLE pets ADD COLUMN handling_requirement TEXT CHECK(handling_requirement IN ('Off-Lead Approved', 'Long-Line Required', 'Lead Required'));
ALTER TABLE pets ADD COLUMN walk_type_preference TEXT CHECK(walk_type_preference IN ('Group Walk', 'Private Walk', 'Any Walk'));
ALTER TABLE pets ADD COLUMN eligible_for_group_walk INTEGER DEFAULT 0;
ALTER TABLE pets ADD COLUMN eligible_for_private_walk INTEGER DEFAULT 1;
ALTER TABLE pets ADD COLUMN recall_reliability TEXT CHECK(recall_reliability IN ('Reliable', 'Mixed', 'Unreliable', 'Unknown'));
ALTER TABLE pets ADD COLUMN reactivity_flags TEXT; -- JSON array: ["Dogs", "People", "Children", "Traffic", "Bikes-Scooters", "Other"]
ALTER TABLE pets ADD COLUMN reactivity_other_details TEXT;
ALTER TABLE pets ADD COLUMN handling_notes TEXT;

-- Step 3: Health, Vet & Insurance Fields (NEW - some may conflict with existing)
-- Note: medical_notes and medications already exist in base schema
-- Renaming/repurposing existing fields to match new spec:
-- medical_notes -> medical_conditions (broader term)
-- medications already exists

-- Since we can't easily rename in SQLite, we'll add new columns
-- and handle migration in application code if needed
ALTER TABLE pets ADD COLUMN medical_conditions TEXT;
ALTER TABLE pets ADD COLUMN allergies TEXT;
ALTER TABLE pets ADD COLUMN vet_practice_name TEXT;
ALTER TABLE pets ADD COLUMN vet_phone TEXT;
ALTER TABLE pets ADD COLUMN insurance_status TEXT CHECK(insurance_status IN ('Yes', 'No', 'Unknown'));
ALTER TABLE pets ADD COLUMN insurance_provider TEXT;
ALTER TABLE pets ADD COLUMN insurance_policy_number TEXT;

-- Note: Existing schema has vet_name and vet_contact which we're replacing with
-- vet_practice_name and vet_phone for clarity

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pets_handling_requirement ON pets(handling_requirement);
CREATE INDEX IF NOT EXISTS idx_pets_eligible_for_group_walk ON pets(eligible_for_group_walk);
CREATE INDEX IF NOT EXISTS idx_pets_insurance_status ON pets(insurance_status);
