import { requireAdmin, parseBody, jsonResponse } from '../../../_helpers';

// GET /api/admin/walkers/:id - Get single walker with full details
export async function onRequestGet({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const walkerId = params.id;

  try {
    // Get walker basic info
    const { results: walkerResults } = await db.prepare(`
      SELECT * FROM walkers WHERE walker_id = ?
    `).bind(walkerId).all();

    if (walkerResults.length === 0) {
      return jsonResponse({ error: 'Walker not found' }, 404);
    }

    const walker = walkerResults[0];

    // Get compliance items
    const { results: complianceItems } = await db.prepare(`
      SELECT * FROM walker_compliance_items 
      WHERE walker_id = ?
      ORDER BY item_type
    `).bind(walkerId).all();

    // Get upcoming leave
    const { results: leaveRequests } = await db.prepare(`
      SELECT * FROM walker_leave_requests 
      WHERE walker_id = ? 
      AND status = 'approved'
      AND end_at >= datetime('now')
      ORDER BY start_at
    `).bind(walkerId).all();

    // Get recent compliance events (last 10)
    const { results: recentEvents } = await db.prepare(`
      SELECT * FROM walker_compliance_events 
      WHERE walker_id = ?
      ORDER BY event_at DESC
      LIMIT 10
    `).bind(walkerId).all();

    return jsonResponse({
      ...walker,
      compliance_items: complianceItems,
      leave_requests: leaveRequests,
      recent_events: recentEvents
    });
  } catch (error) {
    console.error('Get walker error:', error);
    return jsonResponse({ error: 'Failed to fetch walker' }, 500);
  }
}

// PUT /api/admin/walkers/:id - Update walker
export async function onRequestPut({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const walkerId = params.id;

  try {
    const body = await parseBody(request);
    const now = new Date().toISOString();

    // Validate required fields
    if (!body.first_name || !body.last_name || !body.email || !body.phone_mobile || 
        !body.employment_status || !body.start_date) {
      return jsonResponse({ error: 'Missing required fields' }, 400);
    }

    await db.prepare(`
      UPDATE walkers SET
        first_name = ?, last_name = ?, preferred_name = ?, date_of_birth = ?,
        email = ?, phone_mobile = ?, phone_alternative = ?,
        address_line_1 = ?, address_line_2 = ?, town_city = ?, county = ?, postcode = ?,
        emergency_contact_name = ?, emergency_contact_relationship = ?, emergency_contact_phone = ?,
        national_insurance_number = ?, employment_status = ?, contract_type = ?, job_title = ?,
        start_date = ?, end_date = ?, hourly_rate = ?, account_status = ?, 
        photo_url = ?, notes_internal = ?, updated_at = ?
      WHERE walker_id = ?
    `).bind(
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
      walkerId
    ).run();

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Update walker error:', error);
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return jsonResponse({ error: 'Email already exists' }, 400);
    }
    return jsonResponse({ error: 'Failed to update walker' }, 500);
  }
}

// DELETE /api/admin/walkers/:id - Soft delete (set status to 'left')
export async function onRequestDelete({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const walkerId = params.id;

  try {
    const now = new Date().toISOString();

    await db.prepare(`
      UPDATE walkers 
      SET account_status = 'left', updated_at = ?
      WHERE walker_id = ?
    `).bind(now, walkerId).run();

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Delete walker error:', error);
    return jsonResponse({ error: 'Failed to delete walker' }, 500);
  }
}
