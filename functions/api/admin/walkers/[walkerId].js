import { requireAdmin, parseBody, jsonResponse } from '../../../_helpers';

export async function onRequestGet({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const walkerId = params.walkerId;

  try {
    const { results } = await db.prepare(
      'SELECT * FROM walkers WHERE walker_id = ?'
    ).bind(walkerId).all();

    if (results.length === 0) {
      return jsonResponse({ error: 'Walker not found' }, 404);
    }

    return jsonResponse(results[0]);
  } catch (error) {
    console.error('Get walker error:', error);
    return jsonResponse({ error: 'Failed to fetch walker' }, 500);
  }
}

export async function onRequestPut({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const walkerId = params.walkerId;
  const body = await parseBody(request);

  if (!body) {
    return jsonResponse({ error: 'Request body is required' }, 400);
  }

  try {
    const now = new Date().toISOString();

    await db.prepare(`
      UPDATE walkers SET
        first_name = ?,
        last_name = ?,
        preferred_name = ?,
        email = ?,
        phone_mobile = ?,
        phone_alternative = ?,
        address_line_1 = ?,
        town_city = ?,
        postcode = ?,
        emergency_contact_name = ?,
        emergency_contact_phone = ?,
        employment_status = ?,
        start_date = ?,
        account_status = ?,
        photo_url = ?,
        notes_internal = ?,
        updated_at = ?
      WHERE walker_id = ?
    `).bind(
      body.first_name,
      body.last_name,
      body.preferred_name || null,
      body.email,
      body.phone_mobile,
      body.phone_alternative || null,
      body.address_line_1 || null,
      body.town_city || null,
      body.postcode || null,
      body.emergency_contact_name || null,
      body.emergency_contact_phone || null,
      body.employment_status,
      body.start_date,
      body.account_status,
      body.photo_url || null,
      body.notes_internal || null,
      now,
      walkerId
    ).run();

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Update walker error:', error);
    if (error.message && error.message.includes('UNIQUE')) {
      return jsonResponse({ error: 'Email already exists' }, 400);
    }
    return jsonResponse({ error: 'Failed to update walker' }, 500);
  }
}
