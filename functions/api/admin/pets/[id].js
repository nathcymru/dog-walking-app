import { requireAdmin, parseBody, jsonResponse } from '../../../_helpers';

export async function onRequestGet({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const petId = params.id;

  try {
    const { results } = await db.prepare(`
      SELECT p.*, cp.full_name as client_name
      FROM pets p
      JOIN client_profiles cp ON p.client_id = cp.user_id
      WHERE p.id = ?
    `).bind(petId).all();

    if (results.length === 0) {
      return jsonResponse({ error: 'Pet not found' }, 404);
    }

    return jsonResponse(results[0]);
  } catch (error) {
    console.error('Get pet error:', error);
    return jsonResponse({ error: 'Failed to fetch pet' }, 500);
  }
}

export async function onRequestPut({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const petId = params.id;
  const body = await parseBody(request);

  try {
    await db.prepare(`
      UPDATE pets SET
        profile_photo_url = ?, name = ?, nickname = ?, breed = ?, sex = ?, neutered = ?, date_of_birth = ?, colour_markings = ?,
        microchipped = ?, microchip_number = ?, collar_tag_present = ?,
        group_walk_eligible = ?, max_group_size = ?, around_other_dogs = ?, around_puppies = ?, around_small_dogs = ?, around_large_dogs = ?,
        play_style = ?, resource_guarding = ?, resource_guarding_details = ?, muzzle_required_for_group = ?, muzzle_trained = ?,
        allergies = ?, allergy_details = ?, medical_conditions = ?, condition_details = ?, medications = ?, medication_details = ?,
        mobility_limits = ?, heat_sensitivity = ?, vaccination_status = ?, parasite_control = ?,
        lead_type = ?, harness_type = ?, pulling_level = ?, recall_reliability = ?, escape_risk = ?, door_darter = ?,
        bite_history = ?, bite_history_details = ?, reactivity_triggers = ?, trigger_details = ?,
        treats_allowed = ?, approved_treats = ?, do_not_give_list = ?, food_guarding = ?,
        preferred_walk_type = ?, preferred_duration = ?, environment_restrictions = ?, other_restriction = ?, routine_notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      body.profile_photo_url || '', body.name, body.nickname || '', body.breed, body.sex, body.neutered ? 1 : 0, body.date_of_birth || null, body.colour_markings || '',
      body.microchipped ? 1 : 0, body.microchip_number || '', body.collar_tag_present ? 1 : 0,
      body.group_walk_eligible ? 1 : 0, body.max_group_size, body.around_other_dogs, body.around_puppies, body.around_small_dogs, body.around_large_dogs,
      body.play_style, body.resource_guarding, body.resource_guarding_details || '', body.muzzle_required_for_group, body.muzzle_trained,
      body.allergies, body.allergy_details || '', body.medical_conditions, body.condition_details || '', body.medications, body.medication_details || '',
      body.mobility_limits, body.heat_sensitivity, body.vaccination_status, body.parasite_control,
      body.lead_type, body.harness_type, body.pulling_level, body.recall_reliability, body.escape_risk, body.door_darter,
      body.bite_history, body.bite_history_details || '', body.reactivity_triggers || '', body.trigger_details || '',
      body.treats_allowed, body.approved_treats || '', body.do_not_give_list || '', body.food_guarding,
      body.preferred_walk_type, body.preferred_duration, body.environment_restrictions || '', body.other_restriction || '', body.routine_notes || '',
      petId
    ).run();

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Update pet error:', error);
    return jsonResponse({ error: 'Failed to update pet' }, 500);
  }
}

export async function onRequestDelete({ request, env, params }) {
  const db = env.DB;
  const { error } = await requireAdmin(request, db);
  if (error) return error;

  const petId = params.id;

  try {
    await db.prepare('DELETE FROM pets WHERE id = ?').bind(petId).run();
    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Delete pet error:', error);
    return jsonResponse({ error: 'Failed to delete pet' }, 500);
  }
}
