import { authenticateRequest, parseBody, jsonResponse } from '../../../../_helpers';

// Apply voucher to invoice
export async function onRequestPost({ request, env, params }) {
  const db = env.DB;
  const { user, error } = await authenticateRequest(request, db);
  if (error) return error;
  
  const body = await parseBody(request);
  const { voucher_code } = body;
  
  if (!voucher_code) {
    return jsonResponse({ error: 'Voucher code is required' }, 400);
  }
  
  try {
    // Get invoice
    const invoice = await db.prepare(
      'SELECT * FROM invoices WHERE id = ? AND client_id = ?'
    ).bind(params.id, user.id).first();
    
    if (!invoice) {
      return jsonResponse({ error: 'Invoice not found' }, 404);
    }
    
    if (invoice.status === 'paid') {
      return jsonResponse({ error: 'Invoice already paid' }, 400);
    }
    
    // Validate voucher
    const reward = await db.prepare(`
      SELECT ri.*, rc.redemption_mode, rc.discount_type, rc.discount_value, rc.ends_at
      FROM rewards_issued ri
      JOIN reward_campaigns rc ON ri.campaign_id = rc.id
      WHERE ri.voucher_code = ?
        AND ri.client_user_id = ?
        AND ri.status = 'ACTIVE'
        AND ri.voucher_type = 'INTERNAL'
    `).bind(voucher_code, user.id).first();
    
    if (!reward) {
      return jsonResponse({ error: 'Invalid or inactive voucher' }, 400);
    }
    
    if (reward.ends_at && new Date(reward.ends_at) < new Date()) {
      return jsonResponse({ error: 'Voucher has expired' }, 400);
    }
    
    // Calculate discount
    let discountAmount = 0;
    if (reward.discount_type === 'FIXED') {
      discountAmount = Math.min(reward.discount_value, invoice.total_amount);
    } else if (reward.discount_type === 'PERCENT') {
      discountAmount = (invoice.total_amount * reward.discount_value) / 100;
    }
    
    const totalAfterDiscount = Math.max(0, invoice.total_amount - discountAmount);
    
    // Update invoice
    await db.prepare(`
      UPDATE invoices 
      SET applied_reward_issued_id = ?,
          applied_voucher_code = ?,
          discount_amount = ?,
          total_after_discount = ?
      WHERE id = ?
    `).bind(reward.id, voucher_code, discountAmount, totalAfterDiscount, params.id).run();
    
    return jsonResponse({ 
      success: true, 
      discount_amount: discountAmount,
      total_after_discount: totalAfterDiscount 
    });
  } catch (error) {
    console.error('Apply voucher error:', error);
    return jsonResponse({ error: 'Failed to apply voucher' }, 500);
  }
}
