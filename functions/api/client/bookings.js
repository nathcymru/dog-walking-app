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
      SELECT 
        b.*,
        GROUP_CONCAT(p.name, ', ') as pet_names
      FROM bookings b
      LEFT JOIN booking_pets bp ON b.id = bp.booking_id
      LEFT JOIN pets p ON bp.pet_id = p.id
      WHERE b.client_id = ?
      GROUP BY b.id
      ORDER BY b.datetime_start DESC
    `).bind(user.id).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get bookings error:', error);
    return jsonResponse({ error: 'Failed to fetch bookings' }, 500);
  }
}
