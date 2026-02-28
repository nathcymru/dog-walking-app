import { requireAdmin, jsonResponse } from '../../../../_helpers';

// GET /api/admin/bookings/requests - list bookings pending approval
export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const { results } = await db.prepare(`
      SELECT 
        b.*,
        cp.full_name as client_name,
        cp.phone as client_phone,
        GROUP_CONCAT(p.id) as pet_ids,
        GROUP_CONCAT(p.name, ', ') as pet_names,
        ws.start_at as slot_start_at,
        ws.end_at as slot_end_at,
        ws.walk_type as slot_walk_type,
        ws.location_label as slot_location,
        w.first_name || ' ' || w.last_name as walker_name
      FROM bookings b
      JOIN client_profiles cp ON b.client_id = cp.user_id
      LEFT JOIN booking_pets bp ON b.id = bp.booking_id
      LEFT JOIN pets p ON bp.pet_id = p.id
      LEFT JOIN walk_slots ws ON b.slot_id = ws.id
      LEFT JOIN walkers w ON ws.walker_id = w.walker_id
      WHERE b.booking_status = 'PENDING_APPROVAL'
      GROUP BY b.id
      ORDER BY b.requested_at ASC
    `).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get booking requests error:', error);
    return jsonResponse({ error: 'Failed to fetch booking requests' }, 500);
  }
}
