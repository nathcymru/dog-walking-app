import { requireAdmin, parseBody, jsonResponse } from '../../../_helpers';

export async function onRequestGet({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const incidentId = params.id;

  try {
    const { results } = await db.prepare(`
      SELECT 
        i.*,
        p.name as pet_name,
        cp.full_name as client_name
      FROM incidents i
      JOIN pets p ON i.related_pet_id = p.id
      JOIN client_profiles cp ON p.client_id = cp.user_id
      WHERE i.id = ?
    `).bind(incidentId).all();

    if (results.length === 0) {
      return jsonResponse({ error: 'Incident not found' }, 404);
    }

    return jsonResponse(results[0]);
  } catch (error) {
    console.error('Get incident error:', error);
    return jsonResponse({ error: 'Failed to fetch incident' }, 500);
  }
}

export async function onRequestPut({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const incidentId = params.id;
  const body = await parseBody(request);

  try {
    await db.prepare(`
      UPDATE incidents SET
        incident_datetime = ?, incident_type = ?, related_pet_id = ?, related_booking_id = ?,
        location = ?, summary = ?, actions_taken = ?, owner_informed = ?, attachments = ?,
        follow_up_required = ?, follow_up_notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      body.incident_datetime,
      body.incident_type,
      body.related_pet_id,
      body.related_booking_id || null,
      body.location || null,
      body.summary,
      body.actions_taken,
      body.owner_informed ? 1 : 0,
      body.attachments || null,
      body.follow_up_required ? 1 : 0,
      body.follow_up_notes || null,
      incidentId
    ).run();

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Update incident error:', error);
    return jsonResponse({ error: 'Failed to update incident' }, 500);
  }
}

export async function onRequestDelete({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const incidentId = params.id;

  try {
    await db.prepare('DELETE FROM incidents WHERE id = ?').bind(incidentId).run();
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Delete incident error:', error);
    return jsonResponse({ error: 'Failed to delete incident' }, 500);
  }
}
