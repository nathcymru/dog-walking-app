import { requireAdmin, jsonResponse } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);

  if (error) return error;

  try {
    const stats = {};

    const { results: clientCount } = await db.prepare(
      'SELECT COUNT(*) as count FROM users WHERE role = "client"'
    ).all();
    stats.clients = clientCount[0].count;

    const { results: petCount } = await db.prepare(
      'SELECT COUNT(*) as count FROM pets'
    ).all();
    stats.pets = petCount[0].count;

    const { results: unpaidCount } = await db.prepare(
      'SELECT COUNT(*) as count FROM invoices WHERE status = "unpaid"'
    ).all();
    stats.unpaidInvoices = unpaidCount[0].count;

    const today = new Date().toISOString().split('T')[0];
    const { results: todayBookings } = await db.prepare(`
      SELECT b.*, cp.full_name as client_name
      FROM bookings b
      JOIN client_profiles cp ON b.client_id = cp.user_id
      WHERE DATE(b.datetime_start) = ?
      ORDER BY b.datetime_start
    `).bind(today).all();
    stats.todayBookings = todayBookings.length;
    stats.todayBookingsList = todayBookings;

    return jsonResponse(stats);
  } catch (error) {
    console.error('Dashboard error:', error);
    return jsonResponse({ error: 'Failed to fetch dashboard data' }, 500);
  }
}
