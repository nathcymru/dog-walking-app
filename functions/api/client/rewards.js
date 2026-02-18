import { authenticateRequest, jsonResponse } from '../../_helpers';

// Get client's active rewards
export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { user, error } = await authenticateRequest(request, db);
  if (error) return error;
  
  const now = new Date().toISOString();
  
  try {
    const { results } = await db.prepare(`
      SELECT 
        ri.*,
        rc.title,
        rc.description,
        rc.redemption_mode,
        rc.cta_label,
        rc.cta_url,
        rc.image_url,
        rc.starts_at,
        rc.ends_at,
        rc.discount_type,
        rc.discount_value
      FROM rewards_issued ri
      JOIN reward_campaigns rc ON ri.campaign_id = rc.id
      WHERE ri.client_user_id = ?
        AND ri.status = 'ACTIVE'
        AND rc.is_active = 1
        AND (rc.starts_at IS NULL OR rc.starts_at <= ?)
        AND (rc.ends_at IS NULL OR rc.ends_at >= ?)
      ORDER BY ri.issued_at DESC
    `).bind(user.id, now, now).all();
    
    return jsonResponse(results);
  } catch (error) {
    console.error('Get client rewards error:', error);
    return jsonResponse({ error: 'Failed to fetch rewards' }, 500);
  }
}
