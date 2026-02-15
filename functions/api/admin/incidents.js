import { requireAdmin, parseBody, jsonResponse } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const { results } = await db.prepare(`
      SELECT 
        i.*,
        p.name as pet_name,
        cp.full_name as client_name
      FROM incidents i
      JOIN pets p ON i.related_pet_id = p.id
      JOIN client_profiles cp ON p.client_id = cp.user_id
      ORDER BY i.incident_datetime DESC
    `).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get incidents error:', error);
    return jsonResponse({ error: 'Failed to fetch incidents' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const body = await parseBody(request);

  if (!body || !body.incident_datetime || !body.incident_type || !body.related_pet_id || !body.summary || !body.actions_taken) {
    return jsonResponse({ error: 'Datetime, type, pet, summary, and actions taken are required' }, 400);
  }

  try {
    const { results } = await db.prepare(`
      INSERT INTO incidents (
        incident_datetime, incident_type, related_pet_id, related_booking_id,
        location, summary, actions_taken, owner_informed, attachments,
        follow_up_required, follow_up_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id
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
      body.follow_up_notes || null
    ).all();

    return jsonResponse({ success: true, id: results[0].id });
  } catch (error) {
    console.error('Create incident error:', error);
    return jsonResponse({ error: 'Failed to create incident' }, 500);
  }
}
