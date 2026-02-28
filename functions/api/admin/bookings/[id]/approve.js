import { requireAdmin, parseBody, jsonResponse } from '../../../../../_helpers';

// PUT /api/admin/bookings/:id/approve
export async function onRequestPut({ request, env, params }) {
  const db = env.DB;
  const { user, error } = await requireAdmin(request, db);
  if (error) return error;

  const bookingId = params.id;
  const body = await parseBody(request);
  const decisionNotes = body?.decision_notes || null;

  try {
    // Check booking exists and is pending
    const { results } = await db.prepare(
      'SELECT id, booking_status, slot_id FROM bookings WHERE id = ?'
    ).bind(bookingId).all();

    if (results.length === 0) {
      return jsonResponse({ error: 'Booking not found' }, 404);
    }

    const booking = results[0];
    if (booking.booking_status !== 'PENDING_APPROVAL') {
      return jsonResponse({ error: 'Booking is not pending approval' }, 400);
    }

    await db.prepare(`
      UPDATE bookings SET
        booking_status = 'APPROVED',
        status = 'scheduled',
        decided_at = datetime('now'),
        decided_by_user_id = ?,
        decision_notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(String(user.id), decisionNotes, bookingId).run();

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Approve booking error:', error);
    return jsonResponse({ error: 'Failed to approve booking' }, 500);
  }
}
