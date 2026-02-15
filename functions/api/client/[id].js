import { requireAdmin, parseBody, jsonResponse } from '../../../_helpers';

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
      body.full_name, body.mobile, body.email, body.preferred_contact_method,
      body.emergency_contact_name, body.emergency_contact_phone,
      body.address_line1, body.address_line2 || '', body.town, body.county, body.postcode, body.pickup_notes || '',
      body.access_required ? 1 : 0, body.entry_method || '', body.key_reference_id || '', body.lockbox_location || '', body.lockbox_code || '',
      body.alarm_present ? 1 : 0, body.alarm_instructions || '', body.alarm_code || '', body.parking_notes || '', body.equipment_storage_location || '',
      body.vet_practice_name, body.vet_phone, body.vet_address || '',
      body.terms_accepted ? 1 : 0, body.privacy_accepted ? 1 : 0, body.emergency_treatment_consent || '', body.emergency_spend_limit || null,
      body.transport_consent ? 1 : 0, body.photo_consent ? 1 : 0, body.group_walk_consent ? 1 : 0,
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
