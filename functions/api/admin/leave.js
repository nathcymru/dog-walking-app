import { requireAdmin, parseBody, jsonResponse } from '../../../_helpers';

// GET /api/admin/leave - list all leave requests
export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const walkerId = url.searchParams.get('walker_id');

  try {
    let query = `
      SELECT 
        l.*,
        w.first_name || ' ' || w.last_name as walker_name,
        w.email as walker_email
      FROM walker_leave l
      JOIN walkers w ON l.walker_id = w.walker_id
    `;
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push('l.status = ?');
      params.push(status);
    }
    if (walkerId) {
      conditions.push('l.walker_id = ?');
      params.push(walkerId);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY l.start_date DESC';

    const { results } = await db.prepare(query).bind(...params).all();
    return jsonResponse(results);
  } catch (error) {
    console.error('Get leave error:', error);
    return jsonResponse({ error: 'Failed to fetch leave requests' }, 500);
  }
}

// POST /api/admin/leave - create leave request (admin-initiated)
export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { user, error } = await requireAdmin(request, db);
  if (error) return error;

  const body = await parseBody(request);
  if (!body || !body.walker_id || !body.start_date || !body.end_date || !body.leave_type) {
    return jsonResponse({ error: 'walker_id, start_date, end_date, and leave_type are required' }, 400);
  }

  if (new Date(body.end_date) < new Date(body.start_date)) {
    return jsonResponse({ error: 'end_date must be on or after start_date' }, 400);
  }

  try {
    const { results } = await db.prepare(`
      INSERT INTO walker_leave (
        walker_id, leave_type, start_date, end_date, status, notes,
        created_by_user_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'approved', ?, ?, datetime('now'), datetime('now'))
      RETURNING id
    `).bind(
      body.walker_id,
      body.leave_type,
      body.start_date,
      body.end_date,
      body.notes || null,
      String(user.id)
    ).all();

    return jsonResponse({ success: true, id: results[0].id });
  } catch (error) {
    console.error('Create leave error:', error);
    return jsonResponse({ error: 'Failed to create leave request' }, 500);
  }
}
