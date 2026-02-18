import { requireAdmin, jsonResponse } from '../../../../_helpers';

export async function onRequestPost({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const slotId = params.slotId;

  try {
    const now = new Date().toISOString();

    // Update slot status to CANCELLED
    await db.prepare(`
      UPDATE walk_slots 
      SET status = 'CANCELLED', updated_at = ?
      WHERE id = ?
    `).bind(now, slotId).run();

    return jsonResponse({ success: true, message: 'Slot cancelled successfully' });
  } catch (error) {
    console.error('Cancel slot error:', error);
    return jsonResponse({ error: 'Failed to cancel slot' }, 500);
  }
}
