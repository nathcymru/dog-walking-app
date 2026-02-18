import { requireAdmin, jsonResponse } from '../../../../_helpers';

// Helper functions for loyalty calculation
function generateInitials(firstName, lastName) {
  const first2 = (firstName || '').substring(0, 2).toUpperCase();
  const last2 = (lastName || '').substring(0, 2).toUpperCase();
  return first2 + last2;
}

function getCurrentWindowKey(windowType) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  
  switch (windowType) {
    case 'MONTH':
      return `${year}-${String(month).padStart(2, '0')}`;
    case 'QUARTER':
      return `${year}-Q${Math.ceil(month / 3)}`;
    case 'SIX_MONTH':
      return `${year}-H${month <= 6 ? 1 : 2}`;
    case 'TWELVE_MONTH':
      return `${year}-Y`;
    default:
      return null;
  }
}

function getWindowStartDate(windowType) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  
  switch (windowType) {
    case 'MONTH':
      return new Date(year, month, 1).toISOString();
    case 'QUARTER':
      const quarterStart = Math.floor(month / 3) * 3;
      return new Date(year, quarterStart, 1).toISOString();
    case 'SIX_MONTH':
      const halfStart = month < 6 ? 0 : 6;
      return new Date(year, halfStart, 1).toISOString();
    case 'TWELVE_MONTH':
      return new Date(year, 0, 1).toISOString();
    default:
      return null;
  }
}

async function calculateLoyaltyEligibility(db, campaign) {
  const windowKey = getCurrentWindowKey(campaign.loyalty_window);
  const windowStart = getWindowStartDate(campaign.loyalty_window);
  
  let eligibleClients = [];
  
  if (campaign.loyalty_metric === 'WALKS') {
    const { results } = await db.prepare(`
      SELECT b.client_id, cp.full_name, u.email, COUNT(*) as walk_count
      FROM bookings b
      JOIN client_profiles cp ON b.client_id = cp.user_id
      JOIN users u ON cp.user_id = u.id
      WHERE b.status = 'completed' 
        AND b.datetime_start >= ?
      GROUP BY b.client_id
      HAVING walk_count >= ?
    `).bind(windowStart, campaign.loyalty_threshold).all();
    eligibleClients = results;
  } else if (campaign.loyalty_metric === 'SPEND') {
    const { results } = await db.prepare(`
      SELECT i.client_id, cp.full_name, u.email, SUM(i.total_amount) as total_spend
      FROM invoices i
      JOIN client_profiles cp ON i.client_id = cp.user_id
      JOIN users u ON cp.user_id = u.id
      WHERE i.status = 'paid'
        AND i.payment_date >= ?
      GROUP BY i.client_id
      HAVING total_spend >= ?
    `).bind(windowStart, campaign.loyalty_threshold).all();
    eligibleClients = results;
  }
  
  // Issue rewards (idempotent)
  for (const client of eligibleClients) {
    const [firstName, ...lastNameParts] = client.full_name.split(' ');
    const lastName = lastNameParts.join(' ');
    const initials = generateInitials(firstName, lastName);
    const voucherCode = `${campaign.voucher_prefix}${initials}`;
    
    // Try to insert, ignore if exists
    await db.prepare(`
      INSERT OR IGNORE INTO rewards_issued (
        campaign_id, client_user_id, voucher_code, voucher_type, 
        window_key, status
      ) VALUES (?, ?, ?, 'INTERNAL', ?, 'ACTIVE')
    `).bind(campaign.id, client.client_id, voucherCode, windowKey).run();
  }
  
  return eligibleClients.length;
}

// Run loyalty calculation
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

    if (campaign.type !== 'LOYALTY') {
      return jsonResponse({ error: 'Only loyalty campaigns can run calculations' }, 400);
    }

    if (!campaign.is_active) {
      return jsonResponse({ error: 'Campaign must be active to run calculations' }, 400);
    }

    const count = await calculateLoyaltyEligibility(db, campaign);

    return jsonResponse({ success: true, count });
  } catch (error) {
    console.error('Run loyalty error:', error);
    return jsonResponse({ error: 'Failed to run loyalty calculation' }, 500);
  }
}
