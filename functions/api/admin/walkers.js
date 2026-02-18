import { requireAdmin, parseBody, jsonResponse } from '../../_helpers';
import { v4 as uuidv4 } from 'uuid';

// GET /api/admin/walkers - List all walkers
export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const { results } = await db.prepare(`
      SELECT 
        w.*,
        (SELECT COUNT(*) FROM walker_compliance_items 
         WHERE walker_id = w.walker_id AND status = 'expired') as expired_count,
        (SELECT COUNT(*) FROM walker_compliance_items 
         WHERE walker_id = w.walker_id AND status = 'due_soon') as due_soon_count,
        (SELECT COUNT(*) FROM walker_leave_requests 
         WHERE walker_id = w.walker_id 
         AND status = 'approved' 
         AND start_at <= datetime('now', '+14 days')
         AND end_at >= datetime('now')) as upcoming_leave_count
      FROM walkers w
      WHERE w.account_status != 'left'
      ORDER BY w.created_at DESC
    `).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get walkers error:', error);
    return jsonResponse({ error: 'Failed to fetch walkers' }, 500);
  }
}

// POST /api/admin/walkers - Create new walker
export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const body = await parseBody(request);
    const walkerId = uuidv4();
    const now = new Date().toISOString();

    // Validate required fields
    if (!body.first_name || !body.last_name || !body.email || !body.phone_mobile || 
        !body.employment_status || !body.start_date) {
      return jsonResponse({ error: 'Missing required fields' }, 400);
    }

    // Insert walker
    await db.prepare(`
      INSERT INTO walkers (
        walker_id, first_name, last_name, preferred_name, date_of_birth,
        email, phone_mobile, phone_alternative,
        address_line_1, address_line_2, town_city, county, postcode,
        emergency_contact_name, emergency_contact_relationship, emergency_contact_phone,
        national_insurance_number, employment_status, contract_type, job_title,
        start_date, end_date, hourly_rate, account_status, photo_url, notes_internal,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      walkerId,
      body.first_name,
      body.last_name,
      body.preferred_name || null,
      body.date_of_birth || null,
      body.email,
      body.phone_mobile,
      body.phone_alternative || null,
      body.address_line_1 || null,
      body.address_line_2 || null,
      body.town_city || null,
      body.county || null,
      body.postcode || null,
      body.emergency_contact_name || null,
      body.emergency_contact_relationship || null,
      body.emergency_contact_phone || null,
      body.national_insurance_number || null,
      body.employment_status,
      body.contract_type || null,
      body.job_title || 'Dog Walker',
      body.start_date,
      body.end_date || null,
      body.hourly_rate || null,
      body.account_status || 'active',
      body.photo_url || null,
      body.notes_internal || null,
      now,
      now
    ).run();

    // Seed 8 compliance items with status='pending'
    const complianceTypes = [
      'RIGHT_TO_WORK', 'DBS', 'DRIVING_LICENCE', 'BUSINESS_INSURANCE',
      'FIRST_AID', 'MANUAL_HANDLING', 'SAFEGUARDING', 'H_S_INDUCTION'
    ];

    for (const itemType of complianceTypes) {
      const complianceId = uuidv4();
      await db.prepare(`
        INSERT INTO walker_compliance_items (
          id, walker_id, item_type, status, created_at, updated_at
        ) VALUES (?, ?, ?, 'pending', ?, ?)
      `).bind(complianceId, walkerId, itemType, now, now).run();
    }

    return jsonResponse({ success: true, walker_id: walkerId }, 201);
  } catch (error) {
    console.error('Create walker error:', error);
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return jsonResponse({ error: 'Email already exists' }, 400);
    }
    return jsonResponse({ error: 'Failed to create walker' }, 500);
  }
}
