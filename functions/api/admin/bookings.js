import { requireAdmin, parseBody, jsonResponse } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const { results } = await db.prepare(`
      SELECT b.*, cp.full_name as client_name
      FROM bookings b
      JOIN client_profiles cp ON b.client_id = cp.user_id
      ORDER BY b.datetime_start DESC
    `).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get bookings error:', error);
    return jsonResponse({ error: 'Failed to fetch bookings' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const body = await parseBody(request);

  if (!body || !body.client_id || !body.datetime_start || !body.datetime_end || !body.service_type) {
    return jsonResponse({ error: 'Client ID, start time, end time, and service type are required' }, 400);
  }

  try {
    const { results } = await db.prepare(`
      INSERT INTO bookings (
        client_id, datetime_start, datetime_end, service_type, walker_name, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING id
    `).bind(
      body.client_id,
      body.datetime_start,
      body.datetime_end,
      body.service_type,
      body.walker_name || null,
      body.notes || null,
      body.status || 'scheduled'
    ).all();

    const bookingId = results[0].id;

    if (body.pet_ids && body.pet_ids.length > 0) {
      for (const petId of body.pet_ids) {
        await db.prepare(
          'INSERT INTO booking_pets (booking_id, pet_id) VALUES (?, ?)'
        ).bind(bookingId, petId).run();
      }
    }

    return jsonResponse({ success: true, id: bookingId });
  } catch (error) {
    console.error('Create booking error:', error);
    return jsonResponse({ error: 'Failed to create booking' }, 500);
  }
}
