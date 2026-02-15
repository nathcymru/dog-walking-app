import { requireAdmin, parseBody, jsonResponse } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const { results } = await db.prepare(`
      SELECT p.*, cp.full_name as client_name
      FROM pets p
      JOIN client_profiles cp ON p.client_id = cp.user_id
      ORDER BY p.name
    `).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get pets error:', error);
    return jsonResponse({ error: 'Failed to fetch pets' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const body = await parseBody(request);

  if (!body || !body.client_id || !body.name) {
    return jsonResponse({ error: 'Client ID and name are required' }, 400);
  }

  try {
    const { results } = await db.prepare(`
      INSERT INTO pets (
        client_id, name, breed, date_of_birth, vet_name, vet_contact,
        medical_notes, medications, behaviour_notes, access_instructions, feeding_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `).bind(
      body.client_id,
      body.name,
      body.breed || null,
      body.date_of_birth || null,
      body.vet_name || null,
      body.vet_contact || null,
      body.medical_notes || null,
      body.medications || null,
      body.behaviour_notes || null,
      body.access_instructions || null,
      body.feeding_notes || null
    ).all();

    return jsonResponse({ success: true, id: results[0].id });
  } catch (error) {
    console.error('Create pet error:', error);
    return jsonResponse({ error: 'Failed to create pet' }, 500);
  }
}
