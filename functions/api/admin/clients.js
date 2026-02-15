import { requireAdmin, parseBody, jsonResponse, hashPassword } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const { results } = await db.prepare(`
      SELECT u.id, u.email, u.role, cp.*, u.created_at as user_created_at
      FROM users u
      JOIN client_profiles cp ON u.id = cp.user_id
      WHERE u.role = 'client'
      ORDER BY cp.full_name
    `).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get clients error:', error);
    return jsonResponse({ error: 'Failed to fetch clients' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const body = await parseBody(request);

  if (!body || !body.email || !body.password || !body.full_name) {
    return jsonResponse({ error: 'Email, password, and full name are required' }, 400);
  }

  try {
    const passwordHash = await hashPassword(body.password);

    const { results: userResult } = await db.prepare(
      'INSERT INTO users (email, password_hash, role) VALUES (?, ?, "client") RETURNING id'
    ).bind(body.email, passwordHash).all();

    const userId = userResult[0].id;

    await db.prepare(`
      INSERT INTO client_profiles (
        user_id, full_name, mobile, email, preferred_contact_method,
        emergency_contact_name, emergency_contact_phone,
        address_line1, address_line2, town, county, postcode, pickup_notes,
        access_required, entry_method, key_reference_id, lockbox_location, lockbox_code,
        alarm_present, alarm_instructions, alarm_code, parking_notes, equipment_storage_location,
        vet_practice_name, vet_phone, vet_address,
        terms_accepted, privacy_accepted, emergency_treatment_consent, emergency_spend_limit,
        transport_consent, photo_consent, group_walk_consent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      userId,
      body.full_name,
      body.mobile || '',
      body.email,
      body.preferred_contact_method || 'Email',
      body.emergency_contact_name || '',
      body.emergency_contact_phone || '',
      body.address_line1 || '',
      body.address_line2 || '',
      body.town || '',
      body.county || '',
      body.postcode || '',
      body.pickup_notes || '',
      body.access_required ? 1 : 0,
      body.entry_method || '',
      body.key_reference_id || '',
      body.lockbox_location || '',
      body.lockbox_code || '',
      body.alarm_present ? 1 : 0,
      body.alarm_instructions || '',
      body.alarm_code || '',
      body.parking_notes || '',
      body.equipment_storage_location || '',
      body.vet_practice_name || '',
      body.vet_phone || '',
      body.vet_address || '',
      body.terms_accepted ? 1 : 0,
      body.privacy_accepted ? 1 : 0,
      body.emergency_treatment_consent || '',
      body.emergency_spend_limit || null,
      body.transport_consent ? 1 : 0,
      body.photo_consent ? 1 : 0,
      body.group_walk_consent ? 1 : 0
    ).run();

    return jsonResponse({ success: true, id: userId });
  } catch (error) {
    console.error('Create client error:', error);
    if (error.message && error.message.includes('UNIQUE')) {
      return jsonResponse({ error: 'Email already exists' }, 400);
    }
    return jsonResponse({ error: 'Failed to create client' }, 500);
  }
}

export async function onRequestPut({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const clientId = params.id;
  const body = await parseBody(request);

  try {
    await db.prepare(`
      UPDATE client_profiles SET
        full_name = ?, mobile = ?, email = ?, preferred_contact_method = ?,
        emergency_contact_name = ?, emergency_contact_phone = ?,
        address_line1 = ?, address_line2 = ?, town = ?, county = ?, postcode = ?, pickup_notes = ?,
        access_required = ?, entry_method = ?, key_reference_id = ?, lockbox_location = ?, lockbox_code = ?,
        alarm_present = ?, alarm_instructions = ?, alarm_code = ?, parking_notes = ?, equipment_storage_location = ?,
        vet_practice_name = ?, vet_phone = ?, vet_address = ?,
        terms_accepted = ?, privacy_accepted = ?, emergency_treatment_consent = ?, emergency_spend_limit = ?,
        transport_consent = ?, photo_consent = ?, group_walk_consent = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).bind(
      body.full_name,
      body.mobile,
      body.email,
      body.preferred_contact_method,
      body.emergency_contact_name,
      body.emergency_contact_phone,
      body.address_line1,
      body.address_line2 || '',
      body.town,
      body.county,
      body.postcode,
      body.pickup_notes || '',
      body.access_required ? 1 : 0,
      body.entry_method || '',
      body.key_reference_id || '',
      body.lockbox_location || '',
      body.lockbox_code || '',
      body.alarm_present ? 1 : 0,
      body.alarm_instructions || '',
      body.alarm_code || '',
      body.parking_notes || '',
      body.equipment_storage_location || '',
      body.vet_practice_name,
      body.vet_phone,
      body.vet_address || '',
      body.terms_accepted ? 1 : 0,
      body.privacy_accepted ? 1 : 0,
      body.emergency_treatment_consent || '',
      body.emergency_spend_limit || null,
      body.transport_consent ? 1 : 0,
      body.photo_consent ? 1 : 0,
      body.group_walk_consent ? 1 : 0,
      clientId
    ).run();

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Update client error:', error);
    return jsonResponse({ error: 'Failed to update client' }, 500);
  }
}

export async function onRequestDelete({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const clientId = params.id;

  try {
    await db.prepare('DELETE FROM users WHERE id = ?').bind(clientId).run();
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Delete client error:', error);
    return jsonResponse({ error: 'Failed to delete client' }, 500);
  }
}
