import { requireAdmin, parseBody, jsonResponse, hashPassword } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const { results } = await db.prepare(`
      SELECT u.id, u.email, u.role, cp.full_name, cp.phone, cp.address, cp.created_at
      FROM users u
      JOIN client_profiles cp ON u.id = cp.user_id
      WHERE u.role = 'client'
      ORDER BY cp.full_name
    `).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get clients error:', error);
    return jsonResponse({ error: 'Failed to fetch clients' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const body = await parseBody(request);

  if (!body || !body.email || !body.password || !body.full_name) {
    return jsonResponse({ error: 'Email, password, and full name are required' }, 400);
  }

  try {
    const passwordHash = await hashPassword(body.password);

    const { results: userResult } = await db.prepare(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, "client") RETURNING id'
    ).bind(body.email, passwordHash).all();

    const userId = userResult[0].id;

    await db.prepare(
      'INSERT INTO client_profiles (user_id, full_name, phone, address) VALUES (?, ?, ?, ?)'
    ).bind(userId, body.full_name, body.phone || null, body.address || null).run();

    return jsonResponse({ success: true, id: userId });
  } catch (error) {
    console.error('Create client error:', error);
    if (error.message && error.message.includes('UNIQUE')) {
      return jsonResponse({ error: 'Email already exists' }, 400);
    }
    return jsonResponse({ error: 'Failed to create client' }, 500);
  }
}
