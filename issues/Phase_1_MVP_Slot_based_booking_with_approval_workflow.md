## Overview
Implement foundational slot-based booking system with walker management and approval workflow.

## Database Tables to Create

### 1. walkers
```sql
CREATE TABLE walkers (
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
  employment_status TEXT NOT NULL,
  start_date TEXT NOT NULL,
  account_status TEXT DEFAULT 'active',
  photo_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### 2. walk_slots
```sql
CREATE TABLE walk_slots (
  id TEXT PRIMARY KEY,
  start_at TEXT NOT NULL,
  end_at TEXT NOT NULL,
  walk_type TEXT NOT NULL CHECK(walk_type IN ('GROUP', 'PRIVATE')),
  capacity_dogs INTEGER NOT NULL,
  walker_id TEXT NOT NULL,
  status TEXT DEFAULT 'AVAILABLE',
  location_label TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (walker_id) REFERENCES walkers(walker_id)
);
```

### 3. Extend bookings table
```sql
ALTER TABLE bookings ADD COLUMN slot_id TEXT REFERENCES walk_slots(id);
ALTER TABLE bookings ADD COLUMN booking_status TEXT DEFAULT 'PENDING_APPROVAL';
ALTER TABLE bookings ADD COLUMN requested_at TEXT NOT NULL;
ALTER TABLE bookings ADD COLUMN decided_at TEXT;
ALTER TABLE bookings ADD COLUMN decided_by_user_id TEXT;
ALTER TABLE bookings ADD COLUMN decision_notes TEXT;
```

## Backend API Endpoints

### Walkers
- GET /api/admin/walkers
- POST /api/admin/walkers
- GET /api/admin/walkers/:walkerId
- PUT /api/admin/walkers/:walkerId

### Slots
- GET /api/admin/slots
- POST /api/admin/slots
- GET /api/admin/slots/:slotId
- POST /api/admin/slots/:slotId/cancel

### Bookings
- GET /api/admin/bookings/requests
- PUT /api/admin/bookings/:id/approve
- PUT /api/admin/bookings/:id/reject
- POST /api/client/bookings
- GET /api/client/slots/available

## Frontend Pages

### Admin Walkers
- /admin/walkers - List page
- /admin/walkers/new - Create form
- /admin/walkers/:id - Detail view
- /admin/walkers/:id/edit - Edit form

### Admin Slots
- /admin/slots - List with filters
- /admin/slots/new - Create form
- /admin/slots/:id - Detail with capacity

### Admin Bookings
- /admin/bookings/requests - Approval queue
- /admin/bookings/:id/decide - Approve/reject form

### Client Bookings
- /client/bookings/new - Request booking (multi-step: select pets → select slot → confirm)

## Business Rules
1. **Capacity:** remaining = capacity_dogs - (approved + pending)
2. **48h rule:** Clients can't book slots starting within 48 hours
3. **Pet overlap:** Prevent same pet in overlapping slots
4. **Cascade:** Cancelling slot marks bookings as CANCELLED_BY_ADMIN

## Implementation Notes
- Use simple non-modal forms
- Follow existing Flutter patterns
- Store UTC datetimes, display in Europe/London timezone