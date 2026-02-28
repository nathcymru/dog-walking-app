import { authenticateRequest, parseBody, jsonResponse } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { user, error } = await authenticateRequest(request, db);

  if (error) return error;

  if (user.role !== 'client') {
    return jsonResponse({ error: 'Access denied' }, 403);
  }

  try {
    const { results } = await db.prepare(`
      SELECT 
        b.*,
        GROUP_CONCAT(p.name, ', ') as pet_names,
        ws.start_at as slot_start_at,
        ws.end_at as slot_end_at,
        ws.walk_type as slot_walk_type,
        ws.location_label as slot_location,
        w.first_name || ' ' || w.last_name as walker_name
      FROM bookings b
      LEFT JOIN booking_pets bp ON b.id = bp.booking_id
      LEFT JOIN pets p ON bp.pet_id = p.id
      LEFT JOIN walk_slots ws ON b.slot_id = ws.id
      LEFT JOIN walkers w ON ws.walker_id = w.walker_id
      WHERE b.client_id = ?
      GROUP BY b.id
      ORDER BY b.datetime_start DESC
    `).bind(user.id).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get bookings error:', error);
    return jsonResponse({ error: 'Failed to fetch bookings' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { user, error } = await authenticateRequest(request, db);

  if (error) return error;

  if (user.role !== 'client') {
    return jsonResponse({ error: 'Access denied' }, 403);
  }

  const body = await parseBody(request);

  if (!body || !body.slot_id || !body.pet_ids || body.pet_ids.length === 0) {
    return jsonResponse({ error: 'slot_id and at least one pet are required' }, 400);
  }

  try {
    // Validate slot exists and is available
    const { results: slotResults } = await db.prepare(`
      SELECT s.*, 
        (s.capacity_dogs - COUNT(DISTINCT CASE WHEN b.booking_status IN ('APPROVED', 'PENDING_APPROVAL') THEN b.id END)) as spots_remaining
      FROM walk_slots s
      LEFT JOIN bookings b ON s.id = b.slot_id
      WHERE s.id = ? AND s.status = 'AVAILABLE'
      GROUP BY s.id
    `).bind(body.slot_id).all();

    if (slotResults.length === 0) {
      return jsonResponse({ error: 'Slot not found or not available' }, 404);
    }

    const slot = slotResults[0];

    // 48-hour rule
    const minBookingTime = new Date();
    minBookingTime.setHours(minBookingTime.getHours() + 48);
    if (new Date(slot.start_at) <= minBookingTime) {
      return jsonResponse({ error: 'Slots must be booked at least 48 hours in advance' }, 400);
    }

    if (slot.spots_remaining < 1) {
      return jsonResponse({ error: 'This slot is fully booked' }, 400);
    }

    // Validate pets belong to this client
    const petPlaceholders = body.pet_ids.map(() => '?').join(', ');
    const { results: petResults } = await db.prepare(
      `SELECT id FROM pets WHERE id IN (${petPlaceholders}) AND client_id = ?`
    ).bind(...body.pet_ids, user.id).all();

    if (petResults.length !== body.pet_ids.length) {
      return jsonResponse({ error: 'One or more pets not found' }, 400);
    }

    // Create booking
    const { results: bookingResults } = await db.prepare(`
      INSERT INTO bookings (
        client_id, slot_id, datetime_start, datetime_end, service_type,
        status, booking_status, requested_at, notes
      ) VALUES (?, ?, ?, ?, ?, 'scheduled', 'PENDING_APPROVAL', datetime('now'), ?)
      RETURNING id
    `).bind(
      user.id,
      body.slot_id,
      slot.start_at,
      slot.end_at,
      slot.walk_type === 'GROUP' ? 'Group Walk' : 'Private Walk',
      body.notes || null
    ).all();

    const bookingId = bookingResults[0].id;

    for (const petId of body.pet_ids) {
      await db.prepare(
        'INSERT INTO booking_pets (booking_id, pet_id) VALUES (?, ?)'
      ).bind(bookingId, petId).run();
    }

    return jsonResponse({ success: true, id: bookingId });
  } catch (error) {
    console.error('Create client booking error:', error);
    return jsonResponse({ error: 'Failed to create booking' }, 500);
  }
}
