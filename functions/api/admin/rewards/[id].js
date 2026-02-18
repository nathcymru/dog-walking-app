import { requireAdmin, parseBody, jsonResponse } from '../../../_helpers';

// Get single reward campaign
export async function onRequestGet({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const rewardId = params.id;

  try {
    const reward = await db.prepare(
      'SELECT * FROM reward_campaigns WHERE id = ?'
    ).bind(rewardId).first();

    if (!reward) {
      return jsonResponse({ error: 'Reward not found' }, 404);
    }

    return jsonResponse(reward);
  } catch (error) {
    console.error('Get reward error:', error);
    return jsonResponse({ error: 'Failed to fetch reward' }, 500);
  }
}

// Update reward campaign
export async function onRequestPut({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const rewardId = params.id;
  const body = await parseBody(request);

  // Validate required fields
  if (!body.type || !body.scope || !body.title || !body.description || !body.redemption_mode || !body.cta_label) {
    return jsonResponse({ error: 'Missing required fields' }, 400);
  }

  // Validate type-specific fields
  if (body.type === 'LOYALTY') {
    if (!body.loyalty_metric || !body.loyalty_window || !body.loyalty_threshold || !body.voucher_prefix) {
      return jsonResponse({ error: 'Loyalty campaigns require metric, window, threshold, and prefix' }, 400);
    }
  }

  if (body.redemption_mode === 'INTERNAL_CODE' && !body.discount_type) {
    return jsonResponse({ error: 'Internal code redemption requires discount type' }, 400);
  }

  if (body.redemption_mode === 'EXTERNAL_LINK' && !body.cta_url) {
    return jsonResponse({ error: 'External link redemption requires CTA URL' }, 400);
  }

  // Validate date range
  if (body.starts_at && body.ends_at && new Date(body.starts_at) >= new Date(body.ends_at)) {
    return jsonResponse({ error: 'Start date must be before end date' }, 400);
  }

  try {
    await db.prepare(`
      UPDATE reward_campaigns SET
        type = ?, scope = ?, title = ?, description = ?, 
        redemption_mode = ?, cta_label = ?, cta_url = ?,
        image_url = ?, starts_at = ?, ends_at = ?,
        loyalty_metric = ?, loyalty_window = ?, loyalty_threshold = ?, voucher_prefix = ?,
        discount_type = ?, discount_value = ?, shared_voucher_code = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      body.type,
      body.scope,
      body.title,
      body.description,
      body.redemption_mode,
      body.cta_label,
      body.cta_url || null,
      body.image_url || null,
      body.starts_at || null,
      body.ends_at || null,
      body.loyalty_metric || null,
      body.loyalty_window || null,
      body.loyalty_threshold || null,
      body.voucher_prefix ? body.voucher_prefix.toUpperCase() : null,
      body.discount_type || null,
      body.discount_value || null,
      body.shared_voucher_code || null,
      rewardId
    ).run();

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Update reward error:', error);
    return jsonResponse({ error: 'Failed to update reward' }, 500);
  }
}

// Delete reward campaign
export async function onRequestDelete({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const rewardId = params.id;

  try {
    await db.prepare('DELETE FROM reward_campaigns WHERE id = ?').bind(rewardId).run();
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Delete reward error:', error);
    return jsonResponse({ error: 'Failed to delete reward' }, 500);
  }
}
