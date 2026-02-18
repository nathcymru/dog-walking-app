import { authenticateRequest, jsonResponse } from '../../../../_helpers';

// Pay invoice (for testing)
export async function onRequestPost({ request, env, params }) {
  const db = env.DB;
  const { user, error } = await authenticateRequest(request, db);
  if (error) return error;
  
  try {
    const invoice = await db.prepare(
      'SELECT * FROM invoices WHERE id = ? AND client_id = ?'
    ).bind(params.id, user.id).first();
    
    if (!invoice) {
      return jsonResponse({ error: 'Invoice not found' }, 404);
    }
    
    const now = new Date().toISOString();
    
    // Mark invoice as paid
    await db.prepare(`
      UPDATE invoices 
      SET status = 'paid', payment_date = ?
      WHERE id = ?
    `).bind(now, params.id).run();
    
    // Mark reward as used if applied
    if (invoice.applied_reward_issued_id) {
      await db.prepare(`
        UPDATE rewards_issued 
        SET status = 'USED', used_at = ?, used_invoice_id = ?
        WHERE id = ?
      `).bind(now, params.id, invoice.applied_reward_issued_id).run();
    }
    
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Pay invoice error:', error);
    return jsonResponse({ error: 'Failed to process payment' }, 500);
  }
}
