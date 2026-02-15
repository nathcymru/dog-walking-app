import { requireAdmin, parseBody, jsonResponse } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const { results } = await db.prepare(`
      SELECT i.*, cp.full_name as client_name
      FROM invoices i
      JOIN client_profiles cp ON i.client_id = cp.user_id
      ORDER BY i.issue_date DESC
    `).all();

    for (const invoice of results) {
      const { results: lineItems } = await db.prepare(
        'SELECT * FROM invoice_line_items WHERE invoice_id = ?'
      ).bind(invoice.id).all();
      invoice.line_items = lineItems;
    }

    return jsonResponse(results);
  } catch (error) {
    console.error('Get invoices error:', error);
    return jsonResponse({ error: 'Failed to fetch invoices' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const body = await parseBody(request);

  if (!body || !body.client_id || !body.invoice_number || !body.due_date || !body.line_items) {
    return jsonResponse({ error: 'Client ID, invoice number, due date, and line items are required' }, 400);
  }

  try {
    const total = body.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    const { results } = await db.prepare(`
      INSERT INTO invoices (
        client_id, invoice_number, issue_date, due_date, period, total_amount, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'unpaid')
      RETURNING id
    `).bind(
      body.client_id,
      body.invoice_number,
      body.issue_date || new Date().toISOString().split('T')[0],
      body.due_date,
      body.period || null,
      total
    ).all();

    const invoiceId = results[0].id;

    for (const item of body.line_items) {
      await db.prepare(`
        INSERT INTO invoice_line_items (
          invoice_id, description, quantity, unit_price, total
        ) VALUES (?, ?, ?, ?, ?)
      `).bind(
        invoiceId,
        item.description,
        item.quantity,
        item.unit_price,
        item.quantity * item.unit_price
      ).run();
    }

    return jsonResponse({ success: true, id: invoiceId });
  } catch (error) {
    console.error('Create invoice error:', error);
    if (error.message && error.message.includes('UNIQUE')) {
      return jsonResponse({ error: 'Invoice number already exists' }, 400);
    }
    return jsonResponse({ error: 'Failed to create invoice' }, 500);
  }
}
