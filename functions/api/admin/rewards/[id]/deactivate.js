import { requireAdmin, jsonResponse } from '../../../../_helpers';

// Deactivate reward campaign
export async function onRequestPost({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const rewardId = params.id;

  try {
    await db.prepare(
      'UPDATE reward_campaigns SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(rewardId).run();

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Deactivate reward error:', error);
    return jsonResponse({ error: 'Failed to deactivate reward' }, 500);
  }
}
