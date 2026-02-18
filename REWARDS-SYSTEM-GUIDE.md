# Rewards System Implementation Guide

## Overview

The comprehensive rewards system allows the dog walking app to offer three types of rewards:
1. **One-off Rewards** - Manual rewards for specific clients
2. **Campaign Rewards** - Time-bound promotional campaigns for all clients
3. **Loyalty Rewards** - Automated rewards based on walks completed or money spent

## Database Schema

### Tables Created

#### `reward_campaigns`
Stores all reward campaign configurations.

Key fields:
- `type`: ONE_OFF, CAMPAIGN, or LOYALTY
- `scope`: SINGLE_CLIENT or ALL_CLIENTS
- `redemption_mode`: INTERNAL_CODE (discount vouchers) or EXTERNAL_LINK (partner rewards)
- `loyalty_metric`: WALKS or SPEND (for loyalty campaigns)
- `loyalty_window`: MONTH, QUARTER, SIX_MONTH, or TWELVE_MONTH
- `is_active`: Only one loyalty campaign can be active at a time

#### `rewards_issued`
Tracks individual rewards issued to clients.

Key features:
- Idempotency: UNIQUE constraint on (campaign_id, client_user_id, window_key)
- Status tracking: ACTIVE, USED, or INVALIDATED
- Links to invoices when vouchers are used

#### `invoices` (altered)
Added columns to track reward application:
- `applied_reward_issued_id`: Links to the reward used
- `applied_voucher_code`: The voucher code applied
- `discount_amount`: Calculated discount
- `total_after_discount`: Final amount after discount

## Migration

Run the SQL commands in `database-migration-rewards-system.sql` in your Cloudflare D1 Console:

```bash
# Apply the migration
wrangler d1 execute <DATABASE_NAME> --file=database-migration-rewards-system.sql
```

## Backend API Endpoints

### Admin Endpoints

All require admin authentication.

#### List Campaigns
```
GET /api/admin/rewards
```
Returns all reward campaigns.

#### Create Campaign
```
POST /api/admin/rewards
```
Body:
```json
{
  "type": "LOYALTY|CAMPAIGN|ONE_OFF",
  "scope": "ALL_CLIENTS|SINGLE_CLIENT",
  "redemption_mode": "INTERNAL_CODE|EXTERNAL_LINK",
  "title": "Spring Loyalty Bonus",
  "description": "Get £5 off after 10 walks",
  "cta_label": "Redeem Now",
  "cta_url": "https://...",
  "image_url": "https://...",
  "starts_at": "2026-03-01T00:00:00",
  "ends_at": "2026-05-31T23:59:59",
  "loyalty_metric": "WALKS|SPEND",
  "loyalty_window": "MONTH|QUARTER|SIX_MONTH|TWELVE_MONTH",
  "loyalty_threshold": 10,
  "voucher_prefix": "SPRING",
  "discount_type": "PERCENT|FIXED",
  "discount_value": 5
}
```

#### Update Campaign
```
PUT /api/admin/rewards/:id
```
Same body as create.

#### Delete Campaign
```
DELETE /api/admin/rewards/:id
```

#### Activate Campaign
```
POST /api/admin/rewards/:id/activate
```
Activates the campaign. For loyalty campaigns, ensures only one is active.

#### Deactivate Campaign
```
POST /api/admin/rewards/:id/deactivate
```

#### Run Loyalty Calculation
```
POST /api/admin/rewards/:id/run-loyalty
```
Manually triggers loyalty eligibility calculation. Returns count of rewards issued.

### Client Endpoints

#### Get Active Rewards
```
GET /api/client/rewards
```
Returns all active rewards for the authenticated client.

#### Apply Voucher to Invoice
```
POST /api/client/invoices/:id/apply-voucher
```
Body:
```json
{
  "voucher_code": "SPRINGJOSM"
}
```
Returns:
```json
{
  "success": true,
  "discount_amount": 5.00,
  "total_after_discount": 55.00
}
```

#### Pay Invoice
```
POST /api/client/invoices/:id/pay
```
Marks invoice as paid and reward as USED.

## Frontend Components

### Client Portal

**Rewards Page** (`/client/rewards`)
- Displays all active rewards for the client
- Shows voucher codes with copy-to-clipboard functionality
- Shows validity dates
- External link button for partner rewards

### Admin Portal

**Rewards List** (`/admin/rewards`)
- Lists all campaigns with search
- Shows type badges (LOYALTY, CAMPAIGN, ONE_OFF)
- Shows active/inactive status
- Actions: Edit, Activate/Deactivate, Delete
- Run Loyalty button for active loyalty campaigns

**Reward Form** (`/admin/rewards/new`, `/admin/rewards/:id`)
- 3-step wizard:
  1. Choose reward type
  2. Choose redemption mode
  3. Configure details
- Full validation for required fields
- Date range validation
- Conditional fields based on selections

## Business Logic

### Loyalty Campaign Activation

Only one loyalty campaign can be active at a time. The system checks and prevents activation if another is already active.

### Voucher Code Generation

For loyalty rewards, codes are generated as:
```
[VOUCHER_PREFIX][CLIENT_INITIALS]
```

Example: 
- Prefix: "LOYAL"
- Client: "John Smith"
- Code: "LOYALJOS" (first 2 letters of first name + first 2 letters of last name, uppercased)

### Loyalty Calculation

The system calculates eligibility based on:
- **WALKS**: Count completed bookings in the window
- **SPEND**: Sum paid invoice amounts in the window

Windows are calculated as:
- MONTH: Current calendar month
- QUARTER: Current quarter (Q1-Q4)
- SIX_MONTH: Current half (H1: Jan-Jun, H2: Jul-Dec)
- TWELVE_MONTH: Current year

### Idempotency

The system ensures each client receives only one reward per campaign per window using a UNIQUE constraint on (campaign_id, client_user_id, window_key).

### Discount Calculation

For INTERNAL_CODE redemption:
- **PERCENT**: `discount = (invoice_total * discount_value) / 100`
- **FIXED**: `discount = min(discount_value, invoice_total)`

Final amount: `max(0, invoice_total - discount)`

## Testing Checklist

- [ ] Database migration runs successfully
- [ ] Only one loyalty campaign can be active
- [ ] Loyalty calculation generates correct voucher codes
- [ ] Voucher codes are idempotent per window
- [ ] Internal vouchers apply discounts correctly
- [ ] Vouchers marked as USED after payment
- [ ] Clients only see their own rewards
- [ ] External links work correctly
- [ ] Date range validation works
- [ ] Deleted campaigns cascade properly
- [ ] Single-name clients handled correctly
- [ ] Admin endpoints require admin role
- [ ] Client endpoints verify user identity

## Security Features

- All admin endpoints require admin authentication
- All client endpoints verify user identity
- Voucher validation happens server-side only
- SQL injection prevented via parameterized queries
- Cross-user data access prevented by user ID filtering
- Loyalty campaign constraint enforced server-side

## Future Enhancements

Potential improvements:
- Email notifications when rewards are issued
- Reward expiration reminders
- Analytics dashboard for reward effectiveness
- Bulk reward issuing for one-off campaigns
- Reward history for clients
- Admin audit log for reward actions
