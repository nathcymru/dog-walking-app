import { requireAdmin, jsonResponse } from '../../../../_helpers';

// Activate reward campaign (with loyalty check)
export async function onRequestPost({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const rewardId = params.id;

  try {
    // Get the campaign
    const campaign = await db.prepare(
      'SELECT * FROM reward_campaigns WHERE id = ?'
    ).bind(rewardId).first();

    if (!campaign) {
      return jsonResponse({ error: 'Campaign not found' }, 404);
    }

    // Check if this is a loyalty campaign
    if (campaign.type === 'LOYALTY') {
      // Check for existing active loyalty campaign
      const existingActiveLoyalty = await db.prepare(
        'SELECT id FROM reward_campaigns WHERE type = ? AND is_active = 1 AND id != ?'
      ).bind('LOYALTY', rewardId).first();

      if (existingActiveLoyalty) {
        return jsonResponse({ 
          error: 'Only one loyalty campaign can be active at a time. Please deactivate the existing campaign first.' 
        }, 400);
      }
    }

    // Activate the campaign
    await db.prepare(
      'UPDATE reward_campaigns SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(rewardId).run();

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Activate reward error:', error);
    return jsonResponse({ error: 'Failed to activate reward' }, 500);
  }
}
