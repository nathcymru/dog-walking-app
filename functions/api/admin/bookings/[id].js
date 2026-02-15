import { requireAdmin, parseBody, jsonResponse } from '../../../_helpers';

export async function onRequestGet({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const bookingId = params.id;

  try {
    const { results } = await db.prepare(`
      SELECT 
        b.*,
        cp.full_name as client_name,
        GROUP_CONCAT(p.id) as pet_ids,
        GROUP_CONCAT(p.name, ', ') as pet_names
      FROM bookings b
      JOIN client_profiles cp ON b.client_id = cp.user_id
      LEFT JOIN booking_pets bp ON b.id = bp.booking_id
      LEFT JOIN pets p ON bp.pet_id = p.id
      WHERE b.id = ?
      GROUP BY b.id
    `).bind(bookingId).all();

    if (results.length === 0) {
      return jsonResponse({ error: 'Booking not found' }, 404);
    }

    const booking = results[0];
    if (booking.pet_ids) {
      booking.pet_ids = booking.pet_ids.split(',').map(id => parseInt(id));
    } else {
      booking.pet_ids = [];
    }

    return jsonResponse(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    return jsonResponse({ error: 'Failed to fetch booking' }, 500);
  }
}

export async function onRequestPut({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const bookingId = params.id;
  const body = await parseBody(request);

  try {
    await db.prepare(`
      UPDATE bookings SET
        datetime_start = ?, datetime_end = ?, service_type = ?, status = ?,
        walker_name = ?, notes = ?, admin_comment = ?, time_window_start = ?, time_window_end = ?, recurrence = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      body.datetime_start,
      body.datetime_end,
      body.service_type,
      body.status,
      body.walker_name || null,
      body.notes || null,
      body.admin_comment || null,
      body.time_window_start || null,
      body.time_window_end || null,
      body.recurrence || 'One-off',
      bookingId
    ).run();

    // Update pet assignments
    await db.prepare('DELETE FROM booking_pets WHERE booking_id = ?').bind(bookingId).run();
    
    if (body.pet_ids && body.pet_ids.length > 0) {
      for (const petId of body.pet_ids) {
        await db.prepare(
          'INSERT INTO booking_pets (booking_id, pet_id) VALUES (?, ?)'
        ).bind(bookingId, petId).run();
      }
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Update booking error:', error);
    return jsonResponse({ error: 'Failed to update booking' }, 500);
  }
}

export async function onRequestDelete({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const bookingId = params.id;

  try {
    await db.prepare('DELETE FROM bookings WHERE id = ?').bind(bookingId).run();
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Delete booking error:', error);
    return jsonResponse({ error: 'Failed to delete booking' }, 500);
  }
}
