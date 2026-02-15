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
      SELECT * FROM pets WHERE client_id = ? ORDER BY name
    `).bind(user.id).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get pets error:', error);
    return jsonResponse({ error: 'Failed to fetch pets' }, 500);
  }
}
