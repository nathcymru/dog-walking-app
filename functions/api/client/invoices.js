import { authenticateRequest, jsonResponse } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { user, error } = await authenticateRequest(request, db);

  if (error) return error;

  if (user.role !== 'client') {
    return jsonResponse({ error: 'Access denied' }, 403);
  }

  try {
    const { results } = await db.prepare(`
      SELECT * FROM invoices WHERE client_id = ? ORDER BY issue_date DESC
    `).bind(user.id).all();

    for (const invoice of results) {
      const { results: lineItems } = await db.prepare(`
        SELECT * FROM invoice_line_items WHERE invoice_id = ?
      `).bind(invoice.id).all();

      invoice.line_items = lineItems;
    }

    return jsonResponse(results);
  } catch (error) {
    console.error('Get invoices error:', error);
    return jsonResponse({ error: 'Failed to fetch invoices' }, 500);
  }
}
