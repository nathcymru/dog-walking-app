import { parseBody, jsonResponse, errorResponse } from '../_helpers';

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const body = await parseBody(request);

  if (!body || !body.name || !body.email || !body.message) {
    return errorResponse('Name, email, and message are required');
  }

  try {
    await db.prepare(
      'INSERT INTO contact_submissions (name, email, phone, message) VALUES (?, ?, ?, ?)'
    ).bind(body.name, body.email, body.phone || null, body.message).run();

    return jsonResponse({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return errorResponse('Failed to send message', 500);
  }
}
