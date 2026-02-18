import { requireAdmin, parseBody, jsonResponse } from '../../../_helpers';

export async function onRequestGet({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const slotId = params.slotId;

  try {
    const { results } = await db.prepare(`
      SELECT 
        s.*,
        w.first_name || ' ' || w.last_name as walker_name,
        w.phone_mobile as walker_phone,
        w.email as walker_email,
        COUNT(DISTINCT CASE WHEN b.booking_status IN ('APPROVED', 'PENDING_APPROVAL') THEN b.id END) as booked_count
      FROM walk_slots s
      LEFT JOIN walkers w ON s.walker_id = w.walker_id
      LEFT JOIN bookings b ON s.id = b.slot_id
      WHERE s.id = ?
      GROUP BY s.id
    `).bind(slotId).all();

    if (results.length === 0) {
      return jsonResponse({ error: 'Slot not found' }, 404);
    }

    return jsonResponse(results[0]);
  } catch (error) {
    console.error('Get slot error:', error);
    return jsonResponse({ error: 'Failed to fetch slot' }, 500);
  }
}

export async function onRequestPut({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const slotId = params.slotId;
  const body = await parseBody(request);

  if (!body) {
    return jsonResponse({ error: 'Request body is required' }, 400);
  }

  // Validate end_at > start_at if both provided
  if (body.start_at && body.end_at && new Date(body.end_at) <= new Date(body.start_at)) {
    return jsonResponse({ error: 'end_at must be after start_at' }, 400);
  }

  // Validate walk_type if provided
  if (body.walk_type && !['GROUP', 'PRIVATE'].includes(body.walk_type)) {
    return jsonResponse({ error: 'walk_type must be GROUP or PRIVATE' }, 400);
  }

  // Validate capacity if provided
  if (body.capacity_dogs && (body.capacity_dogs < 1 || body.capacity_dogs > 10)) {
    return jsonResponse({ error: 'capacity_dogs must be between 1 and 10' }, 400);
  }

  try {
    const now = new Date().toISOString();

    await db.prepare(`
      UPDATE walk_slots SET
        start_at = COALESCE(?, start_at),
        end_at = COALESCE(?, end_at),
        walk_type = COALESCE(?, walk_type),
        capacity_dogs = COALESCE(?, capacity_dogs),
        walker_id = COALESCE(?, walker_id),
        status = COALESCE(?, status),
        location_label = ?,
        notes = ?,
        updated_at = ?
      WHERE id = ?
    `).bind(
      body.start_at || null,
      body.end_at || null,
      body.walk_type || null,
      body.capacity_dogs || null,
      body.walker_id || null,
      body.status || null,
      body.location_label !== undefined ? body.location_label : null,
      body.notes !== undefined ? body.notes : null,
      now,
      slotId
    ).run();

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Update slot error:', error);
    if (error.message && error.message.includes('FOREIGN KEY')) {
      return jsonResponse({ error: 'Walker not found' }, 400);
    }
    return jsonResponse({ error: 'Failed to update slot' }, 500);
  }
}
