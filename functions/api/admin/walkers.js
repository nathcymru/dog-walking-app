import { requireAdmin, parseBody, jsonResponse } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');

    let query = 'SELECT * FROM walkers';
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('account_status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push('(first_name LIKE ? OR last_name LIKE ? OR preferred_name LIKE ? OR email LIKE ? OR phone_mobile LIKE ?)');
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY first_name, last_name';

    const { results } = await db.prepare(query).bind(...params).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get walkers error:', error);
    return jsonResponse({ error: 'Failed to fetch walkers' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const body = await parseBody(request);

  if (!body || !body.first_name || !body.last_name || !body.email || !body.phone_mobile || !body.employment_status || !body.start_date) {
    return jsonResponse({ error: 'first_name, last_name, email, phone_mobile, employment_status, and start_date are required' }, 400);
  }

  try {
    const walkerId = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.prepare(`
      INSERT INTO walkers (
        walker_id, first_name, last_name, preferred_name, email, phone_mobile, phone_alternative,
        address_line_1, town_city, postcode,
        emergency_contact_name, emergency_contact_phone,
        employment_status, start_date, account_status,
        photo_url, notes_internal,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      walkerId,
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
      body.account_status || 'active',
      body.photo_url || null,
      body.notes_internal || null,
      now,
      now
    ).run();

    return jsonResponse({ success: true, walker_id: walkerId });
  } catch (error) {
    console.error('Create walker error:', error);
    if (error.message && error.message.includes('UNIQUE')) {
      return jsonResponse({ error: 'Email already exists' }, 400);
    }
    return jsonResponse({ error: 'Failed to create walker' }, 500);
  }
}
