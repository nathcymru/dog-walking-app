import { authenticateRequest, jsonResponse } from '../../../_helpers';

// GET /api/client/slots/available - list available slots for client booking
export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { user, error } = await authenticateRequest(request, db);
  if (error) return error;

  if (user.role !== 'client') {
    return jsonResponse({ error: 'Access denied' }, 403);
  }

  const url = new URL(request.url);
  const dateFrom = url.searchParams.get('date_from');
  const dateTo = url.searchParams.get('date_to');
  const walkType = url.searchParams.get('walk_type');

  // 48-hour rule: clients can't book slots starting within 48 hours
  const minBookingTime = new Date();
  minBookingTime.setHours(minBookingTime.getHours() + 48);

  try {
    let query = `
      SELECT 
        s.id,
        s.start_at,
        s.end_at,
        s.walk_type,
        s.capacity_dogs,
        s.location_label,
        s.notes,
        w.first_name || ' ' || w.last_name as walker_name,
        (s.capacity_dogs - COUNT(DISTINCT CASE WHEN b.booking_status IN ('APPROVED', 'PENDING_APPROVAL') THEN b.id END)) as spots_remaining
      FROM walk_slots s
      LEFT JOIN walkers w ON s.walker_id = w.walker_id
      LEFT JOIN bookings b ON s.id = b.slot_id
      WHERE s.status = 'AVAILABLE'
        AND s.start_at > ?
    `;

    const params = [minBookingTime.toISOString()];

    if (dateFrom) {
      query += ' AND s.start_at >= ?';
      params.push(dateFrom);
    }
    if (dateTo) {
      query += ' AND s.start_at <= ?';
      params.push(dateTo);
    }
    if (walkType) {
      query += ' AND s.walk_type = ?';
      params.push(walkType);
    }

    query += `
      GROUP BY s.id
      HAVING spots_remaining > 0
      ORDER BY s.start_at ASC
    `;

    const { results } = await db.prepare(query).bind(...params).all();
    return jsonResponse(results);
  } catch (error) {
    console.error('Get available slots error:', error);
    return jsonResponse({ error: 'Failed to fetch available slots' }, 500);
  }
}
