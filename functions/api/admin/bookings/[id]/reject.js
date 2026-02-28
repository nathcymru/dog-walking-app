import { requireAdmin, parseBody, jsonResponse } from '../../../../_helpers';

// PUT /api/admin/bookings/:id/reject
export async function onRequestPut({ request, env, params }) {
  const db = env.DB;
  const { user, error } = await requireAdmin(request, db);
  if (error) return error;

  const bookingId = params.id;
  const body = await parseBody(request);
  const decisionNotes = body?.decision_notes || null;

  try {
    const { results } = await db.prepare(
      'SELECT id, booking_status FROM bookings WHERE id = ?'
    ).bind(bookingId).all();

    if (results.length === 0) {
      return jsonResponse({ error: 'Booking not found' }, 404);
    }

    if (results[0].booking_status !== 'PENDING_APPROVAL') {
      return jsonResponse({ error: 'Booking is not pending approval' }, 400);
    }

    await db.prepare(`
      UPDATE bookings SET
        booking_status = 'REJECTED',
        status = 'cancelled',
        decided_at = datetime('now'),
        decided_by_user_id = ?,
        decision_notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(String(user.id), decisionNotes, bookingId).run();

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Reject booking error:', error);
    return jsonResponse({ error: 'Failed to reject booking' }, 500);
  }
}
