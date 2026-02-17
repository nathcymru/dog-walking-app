import { authenticateRequest, parseBody, jsonResponse } from '../../_helpers';

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

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { user, error } = await authenticateRequest(request, db);

  if (error) return error;

  if (user.role !== 'client') {
    return jsonResponse({ error: 'Access denied' }, 403);
  }

  const body = await parseBody(request);

  // Validation
  if (!body || !body.name || !body.breed) {
    return jsonResponse({ error: 'Name and breed are required' }, 400);
  }

  // Force client_id to be the authenticated user's ID
  const client_id = user.id;

  // Convert microchipped to text enum
  const microchippedValue = body.microchipped === 'Yes' || body.microchipped === 'No' || body.microchipped === 'Unknown' 
    ? body.microchipped 
    : (body.microchipped ? 'Yes' : 'Unknown');

  try {
    const { results } = await db.prepare(`
      INSERT INTO pets (
        client_id, profile_photo_url, name, nickname, breed, sex, neutered, date_of_birth, age, colour_markings,
        microchipped, microchip_number, collar_tag_present,
        handling_requirement, walk_type_preference, eligible_for_group_walk, eligible_for_private_walk,
        recall_reliability, reactivity_flags, reactivity_other_details, handling_notes,
        medical_conditions, medications, allergies, vet_practice_name, vet_phone,
        insurance_status, insurance_provider, insurance_policy_number,
        group_walk_eligible, max_group_size, around_other_dogs, around_puppies, around_small_dogs, around_large_dogs,
        play_style, resource_guarding, resource_guarding_details, muzzle_required_for_group, muzzle_trained,
        allergy_details, condition_details, medication_details,
        mobility_limits, heat_sensitivity, vaccination_status, parasite_control,
        lead_type, harness_type, pulling_level, escape_risk, door_darter,
        bite_history, bite_history_details, reactivity_triggers, trigger_details,
        treats_allowed, approved_treats, do_not_give_list, food_guarding,
        preferred_walk_type, preferred_duration, environment_restrictions, other_restriction, routine_notes
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      ) RETURNING id
    `).bind(
      client_id, 
      body.profile_photo_url || '', 
      body.name, 
      body.nickname || '', 
      body.breed, 
      body.sex || '', 
      body.neutered ? 1 : 0, 
      body.date_of_birth || null,
      body.age ? parseInt(body.age) : null,
      body.colour_markings || '',
      microchippedValue,
      body.microchip_number || '', 
      body.collar_tag_present ? 1 : 0,
      // New wizard fields
      body.handling_requirement || null,
      body.walk_type_preference || null,
      body.eligible_for_group_walk ? 1 : 0,
      body.eligible_for_private_walk ? 1 : 0,
      body.recall_reliability || null,
      body.reactivity_flags || '[]',
      body.reactivity_other_details || '',
      body.handling_notes || '',
      body.medical_conditions || '',
      body.medications || '',
      body.allergies || '',
      body.vet_practice_name || '',
      body.vet_phone || '',
      body.insurance_status || null,
      body.insurance_provider || '',
      body.insurance_policy_number || '',
      // Legacy fields (maintain compatibility)
      body.group_walk_eligible ? 1 : 0, 
      body.max_group_size || 4, 
      body.around_other_dogs || 'Unknown', 
      body.around_puppies || 'Unknown', 
      body.around_small_dogs || 'Unknown', 
      body.around_large_dogs || 'Unknown',
      body.play_style || 'Unknown', 
      body.resource_guarding || 'Unknown', 
      body.resource_guarding_details || '', 
      body.muzzle_required_for_group || 'No', 
      body.muzzle_trained || 'No',
      body.allergy_details || '', 
      body.condition_details || '', 
      body.medication_details || '',
      body.mobility_limits || 'None', 
      body.heat_sensitivity || 'Unknown', 
      body.vaccination_status || 'Unknown', 
      body.parasite_control || 'Unknown',
      body.lead_type || 'Standard', 
      body.harness_type || 'None', 
      body.pulling_level || 5,
      body.escape_risk || 'Unknown', 
      body.door_darter || 'Unknown',
      body.bite_history || 'Unknown', 
      body.bite_history_details || '', 
      body.reactivity_triggers || '', 
      body.trigger_details || '',
      body.treats_allowed || 'Yes', 
      body.approved_treats || '', 
      body.do_not_give_list || '', 
      body.food_guarding || 'Unknown',
      body.preferred_walk_type || 'Any', 
      body.preferred_duration || 30, 
      body.environment_restrictions || '', 
      body.other_restriction || '', 
      body.routine_notes || ''
    ).all();

    return jsonResponse({ success: true, id: results[0].id });
  } catch (error) {
    console.error('Create pet error:', error);
    return jsonResponse({ error: 'Failed to create pet' }, 500);
  }
}
