import { requireAdmin, parseBody, jsonResponse, errorResponse } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error, user } = await requireAdmin(request, db);
  if (error) return error;

  try {
    const { results } = await db.prepare(`
      SELECT u.id, u.email, u.role, cp.full_name
      FROM users u
      LEFT JOIN client_profiles cp ON u.id = cp.user_id
      WHERE u.id = ?
    `).bind(user.id).all();

    if (results.length === 0) {
      return errorResponse('Profile not found', 404);
    }

    return jsonResponse(results[0]);
  } catch (error) {
    console.error('Get admin profile error:', error);
    return errorResponse('Failed to fetch profile', 500);
  }
}

export async function onRequestPut({ request, env }) {
  const db = env.DB;
  const { error, user } = await requireAdmin(request, db);
  if (error) return error;

  const body = await parseBody(request);
  if (!body) {
    return errorResponse('Invalid request body', 400);
  }

  try {
    // Update users table email
    if (body.email && body.email !== user.email) {
      await db.prepare(`
        UPDATE users SET
          email = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(body.email, user.id).run();
    }

    // If admin has a client_profile entry, update that too
    const { results: profileCheck } = await db.prepare(`
      SELECT id FROM client_profiles WHERE user_id = ?
    `).bind(user.id).all();

    if (profileCheck.length > 0 && body.full_name) {
      await db.prepare(`
        UPDATE client_profiles SET
          full_name = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `).bind(body.full_name, user.id).run();
    }

    // Fetch updated user data to return
    const { results } = await db.prepare(`
      SELECT u.id, u.email, u.role, cp.full_name
      FROM users u
      LEFT JOIN client_profiles cp ON u.id = cp.user_id
      WHERE u.id = ?
    `).bind(user.id).all();

    if (results.length === 0) {
      return errorResponse('Failed to fetch updated profile', 500);
    }

    const updatedUser = {
      id: results[0].id,
      email: results[0].email,
      role: results[0].role,
      full_name: results[0].full_name || body.full_name || user.email.split('@')[0]
    };

    return jsonResponse({ 
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    if (error.message && error.message.includes('UNIQUE')) {
      return errorResponse('Email already exists', 400);
    }
    return errorResponse('Failed to update profile', 500);
  }
}
