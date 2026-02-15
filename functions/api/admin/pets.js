import { requireAdmin, parseBody, jsonResponse } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const { results } = await db.prepare(`
      SELECT p.*, cp.full_name as client_name
      FROM pets p
      JOIN client_profiles cp ON p.client_id = cp.user_id
      ORDER BY p.name
    `).all();

    return jsonResponse(results);
  } catch (error) {
    console.error('Get pets error:', error);
    return jsonResponse({ error: 'Failed to fetch pets' }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const body = await parseBody(request);

  if (!body || !body.client_id || !body.name || !body.breed) {
    return jsonResponse({ error: 'Client ID, name, and breed are required' }, 400);
  }

  try {
    const { results } = await db.prepare(`
      INSERT INTO pets (
        client_id, profile_photo_url, name, nickname, breed, sex, neutered, date_of_birth, colour_markings,
        microchipped, microchip_number, collar_tag_present,
        group_walk_eligible, max_group_size, around_other_dogs, around_puppies, around_small_dogs, around_large_dogs,
        play_style, resource_guarding, resource_guarding_details, muzzle_required_for_group, muzzle_trained,
        allergies, allergy_details, medical_conditions, condition_details, medications, medication_details,
        mobility_limits, heat_sensitivity, vaccination_status, parasite_control,
        lead_type, harness_type, pulling_level, recall_reliability, escape_risk, door_darter,
        bite_history, bite_history_details, reactivity_triggers, trigger_details,
        treats_allowed, approved_treats, do_not_give_list, food_guarding,
        preferred_walk_type, preferred_duration, environment_restrictions, other_restriction, routine_notes
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      ) RETURNING id
    `).bind(
      body.client_id, body.profile_photo_url || '', body.name, body.nickname || '', body.breed, body.sex || '', body.neutered ? 1 : 0, body.date_of_birth || null, body.colour_markings || '',
      body.microchipped ? 1 : 0, body.microchip_number || '', body.collar_tag_present ? 1 : 0,
      body.group_walk_eligible ? 1 : 0, body.max_group_size || 4, body.around_other_dogs || 'Unknown', body.around_puppies || 'Unknown', body.around_small_dogs || 'Unknown', body.around_large_dogs || 'Unknown',
      body.play_style || 'Unknown', body.resource_guarding || 'Unknown', body.resource_guarding_details || '', body.muzzle_required_for_group || 'No', body.muzzle_trained || 'No',
      body.allergies || 'Unknown', body.allergy_details || '', body.medical_conditions || 'Unknown', body.condition_details || '', body.medications || 'Unknown', body.medication_details || '',
      body.mobility_limits || 'None', body.heat_sensitivity || 'Unknown', body.vaccination_status || 'Unknown', body.parasite_control || 'Unknown',
      body.lead_type || 'Standard', body.harness_type || 'None', body.pulling_level || 5, body.recall_reliability || 5, body.escape_risk || 'Unknown', body.door_darter || 'Unknown',
      body.bite_history || 'Unknown', body.bite_history_details || '', body.reactivity_triggers || '', body.trigger_details || '',
      body.treats_allowed || 'Yes', body.approved_treats || '', body.do_not_give_list || '', body.food_guarding || 'Unknown',
      body.preferred_walk_type || 'Any', body.preferred_duration || 30, body.environment_restrictions || '', body.other_restriction || '', body.routine_notes || ''
    ).all();

    return jsonResponse({ success: true, id: results[0].id });
  } catch (error) {
    console.error('Create pet error:', error);
    return jsonResponse({ error: 'Failed to create pet' }, 500);
  }
}
