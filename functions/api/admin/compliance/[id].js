import { requireAdmin, parseBody, jsonResponse } from '../../../_helpers';

// GET /api/admin/compliance/:id - get single compliance record
// PUT /api/admin/compliance/:id - update compliance record
// DELETE /api/admin/compliance/:id - delete compliance record

export async function onRequestGet({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const { results } = await db.prepare(
      'SELECT * FROM walker_compliance WHERE id = ?'
    ).bind(params.id).all();

    if (results.length === 0) {
      return jsonResponse({ error: 'Record not found' }, 404);
    }
    return jsonResponse(results[0]);
  } catch (error) {
    return jsonResponse({ error: 'Failed to fetch record' }, 500);
  }
}

export async function onRequestPut({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const body = await parseBody(request);
  if (!body) return jsonResponse({ error: 'Body required' }, 400);

  try {
    await db.prepare(`
      UPDATE walker_compliance SET
        item_type = ?, status = ?, issued_at = ?, expires_at = ?,
        reference_number = ?, notes = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      body.item_type,
      body.status || 'valid',
      body.issued_at || null,
      body.expires_at || null,
      body.reference_number || null,
      body.notes || null,
      params.id
    ).run();

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ error: 'Failed to update record' }, 500);
  }
}

export async function onRequestDelete({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    await db.prepare('DELETE FROM walker_compliance WHERE id = ?').bind(params.id).run();
    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ error: 'Failed to delete record' }, 500);
  }
}
