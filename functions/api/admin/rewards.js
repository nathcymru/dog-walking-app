import { requireAdmin, parseBody, jsonResponse } from '../../_helpers';

// List all reward campaigns
export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const { results } = await db.prepare(`
      SELECT * FROM reward_campaigns 
      ORDER BY created_at DESC
    `).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get rewards error:', error);
    return jsonResponse({ error: 'Failed to fetch rewards' }, 500);
  }
}

// Create new reward campaign
export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { user, error } = await requireAdmin(request, db);
  if (error) return error;

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
    const { results } = await db.prepare(`
      INSERT INTO reward_campaigns (
        type, scope, title, description, redemption_mode, cta_label, cta_url,
        image_url, starts_at, ends_at, is_active,
        loyalty_metric, loyalty_window, loyalty_threshold, voucher_prefix,
        discount_type, discount_value, shared_voucher_code, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
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
      0, // is_active defaults to false
      body.loyalty_metric || null,
      body.loyalty_window || null,
      body.loyalty_threshold || null,
      body.voucher_prefix ? body.voucher_prefix.toUpperCase() : null,
      body.discount_type || null,
      body.discount_value || null,
      body.shared_voucher_code || null,
      user.id
    ).all();

    return jsonResponse(results[0], 201);
  } catch (error) {
    console.error('Create reward error:', error);
    return jsonResponse({ error: 'Failed to create reward' }, 500);
  }
}
