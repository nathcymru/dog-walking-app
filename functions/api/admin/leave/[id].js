import { requireAdmin, parseBody, jsonResponse } from '../../../_helpers';

// GET /api/admin/leave/:id
export async function onRequestGet({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const { results } = await db.prepare(`
      SELECT l.*, w.first_name || ' ' || w.last_name as walker_name
      FROM walker_leave l
      JOIN walkers w ON l.walker_id = w.walker_id
      WHERE l.id = ?
    `).bind(params.id).all();

    if (results.length === 0) {
      return jsonResponse({ error: 'Leave record not found' }, 404);
    }
    return jsonResponse(results[0]);
  } catch (error) {
    return jsonResponse({ error: 'Failed to fetch leave record' }, 500);
  }
}

// PUT /api/admin/leave/:id
export async function onRequestPut({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const body = await parseBody(request);
  if (!body) return jsonResponse({ error: 'Body required' }, 400);

  if (body.end_date && body.start_date && new Date(body.end_date) < new Date(body.start_date)) {
    return jsonResponse({ error: 'end_date must be on or after start_date' }, 400);
  }

  try {
    await db.prepare(`
      UPDATE walker_leave SET
        leave_type = ?, start_date = ?, end_date = ?, status = ?, notes = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      body.leave_type,
      body.start_date,
      body.end_date,
      body.status || 'approved',
      body.notes || null,
      params.id
    ).run();

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ error: 'Failed to update leave record' }, 500);
  }
}

// DELETE /api/admin/leave/:id
export async function onRequestDelete({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    await db.prepare('DELETE FROM walker_leave WHERE id = ?').bind(params.id).run();
    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse({ error: 'Failed to delete leave record' }, 500);
  }
}
