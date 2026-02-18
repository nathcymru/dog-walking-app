import { requireAdmin, jsonResponse } from '../../../../_helpers';

export async function onRequestPost({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const slotId = params.slotId;

  try {
    // Check if slot exists and is cancellable
    const { results } = await db.prepare(`
      SELECT status FROM walk_slots WHERE id = ?
    `).bind(slotId).all();

    if (results.length === 0) {
      return jsonResponse({ error: 'Slot not found' }, 404);
    }

    const currentStatus = results[0].status;
    if (currentStatus === 'CANCELLED') {
      return jsonResponse({ error: 'Slot is already cancelled' }, 400);
    }

    if (currentStatus === 'LOCKED') {
      return jsonResponse({ error: 'Cannot cancel a locked slot' }, 400);
    }

    const now = new Date().toISOString();

    // Update slot status to CANCELLED
    await db.prepare(`
      UPDATE walk_slots 
      SET status = 'CANCELLED', updated_at = ?
      WHERE id = ? AND status = 'AVAILABLE'
    `).bind(now, slotId).run();

    return jsonResponse({ success: true, message: 'Slot cancelled successfully' });
  } catch (error) {
    console.error('Cancel slot error:', error);
    return jsonResponse({ error: 'Failed to cancel slot' }, 500);
  }
}
