import { requireAdmin, parseBody, jsonResponse } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const url = new URL(request.url);
    const date_from = url.searchParams.get('date_from');
    const date_to = url.searchParams.get('date_to');
    const walker_id = url.searchParams.get('walker_id');
    const status = url.searchParams.get('status');
    const walk_type = url.searchParams.get('walk_type');

    let query = `
      SELECT 
        s.*,
        w.first_name || ' ' || w.last_name as walker_name,
        w.phone_mobile as walker_phone,
        COUNT(DISTINCT CASE WHEN b.booking_status IN ('APPROVED', 'PENDING_APPROVAL') THEN b.id END) as booked_count
      FROM walk_slots s
      LEFT JOIN walkers w ON s.walker_id = w.walker_id
      LEFT JOIN bookings b ON s.id = b.slot_id
    `;
    const params = [];
    const conditions = [];

    // Default: next 30 days if no date range provided
    if (date_from) {
      conditions.push('s.start_at >= ?');
      params.push(date_from);
    } else {
      const now = new Date().toISOString();
      conditions.push('s.start_at >= ?');
      params.push(now);
    }

    if (date_to) {
      conditions.push('s.start_at <= ?');
      params.push(date_to);
    } else {
      // Default to 30 days from now
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      conditions.push('s.start_at <= ?');
      params.push(thirtyDaysFromNow.toISOString());
    }

    if (walker_id) {
      conditions.push('s.walker_id = ?');
      params.push(walker_id);
    }

    if (status) {
      conditions.push('s.status = ?');
      params.push(status);
    }

    if (walk_type) {
      conditions.push('s.walk_type = ?');
      params.push(walk_type);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY s.id ORDER BY s.start_at ASC';

    const { results } = await db.prepare(query).bind(...params).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get slots error:', error);
    return jsonResponse({ error: 'Failed to fetch slots' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const body = await parseBody(request);

  if (!body || !body.start_at || !body.end_at || !body.walk_type || !body.capacity_dogs || !body.walker_id) {
    return jsonResponse({ 
      error: 'start_at, end_at, walk_type, capacity_dogs, and walker_id are required' 
    }, 400);
  }

  // Validate end_at > start_at
  if (new Date(body.end_at) <= new Date(body.start_at)) {
    return jsonResponse({ error: 'end_at must be after start_at' }, 400);
  }

  // Validate walk_type
  if (!['GROUP', 'PRIVATE'].includes(body.walk_type)) {
    return jsonResponse({ error: 'walk_type must be GROUP or PRIVATE' }, 400);
  }

  // Validate capacity
  if (body.capacity_dogs < 1 || body.capacity_dogs > 10) {
    return jsonResponse({ error: 'capacity_dogs must be between 1 and 10' }, 400);
  }

  try {
    const slotId = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.prepare(`
      INSERT INTO walk_slots (
        id, start_at, end_at, walk_type, capacity_dogs, walker_id,
        status, location_label, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      slotId,
      body.start_at,
      body.end_at,
      body.walk_type,
      body.capacity_dogs,
      body.walker_id,
      body.status || 'AVAILABLE',
      body.location_label || null,
      body.notes || null,
      now,
      now
    ).run();

    return jsonResponse({ success: true, id: slotId });
  } catch (error) {
    console.error('Create slot error:', error);
    if (error.message && error.message.includes('FOREIGN KEY')) {
      return jsonResponse({ error: 'Walker not found' }, 400);
    }
    return jsonResponse({ error: 'Failed to create slot' }, 500);
  }
}
