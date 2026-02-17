import { authenticateRequest, parseBody, jsonResponse, errorResponse } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const { error, user } = await authenticateRequest(request, db);
  if (error) return error;

  // Only clients can access this endpoint
  if (user.role !== 'client') {
    return errorResponse('Forbidden - Client access required', 403);
  }

  try {
    const { results } = await db.prepare(`
      SELECT u.id, u.email, u.role, cp.*
      FROM users u
      JOIN client_profiles cp ON u.id = cp.user_id
      WHERE u.id = ?
    `).bind(user.id).all();

    if (results.length === 0) {
      return errorResponse('Profile not found', 404);
    }

    return jsonResponse(results[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse('Failed to fetch profile', 500);
  }
}

export async function onRequestPut({ request, env }) {
  const db = env.DB;
  const { error, user } = await authenticateRequest(request, db);
  if (error) return error;

  // Only clients can access this endpoint
  if (user.role !== 'client') {
    return errorResponse('Forbidden - Client access required', 403);
  }

  const body = await parseBody(request);
  if (!body) {
    return errorResponse('Invalid request body', 400);
  }

  // Validate required fields
  if (!body.full_name || !body.email) {
    return errorResponse('Full name and email are required', 400);
  }

  try {
    // Update client_profiles table
    // Note: email is stored in both users and client_profiles tables (existing schema design)
    await db.prepare(`
      UPDATE client_profiles SET
        full_name = ?,
        mobile = ?,
        email = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `).bind(
      body.full_name,
      body.phone ?? body.mobile ?? '',
      body.email,
      user.id
    ).run();

    // Update users table email if changed
    if (body.email !== user.email) {
      await db.prepare(`
        UPDATE users SET
          email = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(body.email, user.id).run();
    }

    // Fetch updated user data to return
    const { results } = await db.prepare(`
      SELECT u.id, u.email, u.role, cp.full_name, cp.mobile as phone, cp.email as profile_email
      FROM users u
      JOIN client_profiles cp ON u.id = cp.user_id
      WHERE u.id = ?
    `).bind(user.id).all();

    if (results.length === 0) {
      return errorResponse('Failed to fetch updated profile', 500);
    }

    const updatedUser = {
      id: results[0].id,
      email: results[0].email,
      role: results[0].role,
      full_name: results[0].full_name,
      phone: results[0].phone
    };

    // Note: photo_url is not stored in the database (not in client_profiles schema)
    // It will remain in localStorage only, which is acceptable for this optional field

    return jsonResponse({ 
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.message && error.message.includes('UNIQUE')) {
      return errorResponse('Email already exists', 400);
    }
    return errorResponse('Failed to update profile', 500);
  }
}
