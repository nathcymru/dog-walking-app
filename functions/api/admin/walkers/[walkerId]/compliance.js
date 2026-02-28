import { requireAdmin, parseBody, jsonResponse } from '../../../../_helpers';

// GET /api/admin/walkers/:walkerId/compliance
export async function onRequestGet({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const { walkerId } = params;

  try {
    const { results } = await db.prepare(`
      SELECT * FROM walker_compliance
      WHERE walker_id = ?
      ORDER BY expires_at ASC
    `).bind(walkerId).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get compliance error:', error);
    return jsonResponse({ error: 'Failed to fetch compliance records' }, 500);
  }
}

// POST /api/admin/walkers/:walkerId/compliance
export async function onRequestPost({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const { walkerId } = params;
  const body = await parseBody(request);

  if (!body || !body.item_type) {
    return jsonResponse({ error: 'item_type is required' }, 400);
  }

  try {
    const { results } = await db.prepare(`
      INSERT INTO walker_compliance (
        walker_id, item_type, status, issued_at, expires_at, reference_number, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      RETURNING id
    `).bind(
      walkerId,
      body.item_type,
      body.status || 'valid',
      body.issued_at || null,
      body.expires_at || null,
      body.reference_number || null,
      body.notes || null
    ).all();

    return jsonResponse({ success: true, id: results[0].id });
  } catch (error) {
    console.error('Create compliance error:', error);
    return jsonResponse({ error: 'Failed to create compliance record' }, 500);
  }
}
