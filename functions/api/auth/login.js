import {
  parseBody,
  verifyPassword,
  generateSessionToken,
  jsonResponse,
  errorResponse,
  setSessionCookie,
  formatDate,
} from '../../_helpers';

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const body = await parseBody(request);

  if (!body || !body.email || !body.password) {
    return errorResponse('Email and password are required');
  }

  try {
    const { results } = await db.prepare(`
      SELECT u.*, cp.full_name as client_full_name 
      FROM users u 
      LEFT JOIN client_profiles cp ON u.id = cp.user_id 
      WHERE u.email = ?
    `).bind(body.email).all();

    if (results.length === 0) {
      return errorResponse('Invalid credentials', 401);
    }

    const user = results[0];
    const isValid = await verifyPassword(body.password, user.password_hash);
    if (!isValid) {
      return errorResponse('Invalid credentials', 401);
    }

    // Determine full_name based on role
    let fullName = user.client_full_name; // from client_profiles
    if (user.role === 'admin') {
      // For admin, try to get name from a potential admin_profiles table, or use email
      // For now, use email username as fallback
      fullName = fullName || user.email.split('@')[0];
    }

    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.prepare(
      'INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)'
    ).bind(user.id, sessionToken, formatDate(expiresAt)).run();

    const response = jsonResponse({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: fullName,
      },
    });

    response.headers.set('Set-Cookie', setSessionCookie(sessionToken));
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Login failed', 500);
  }
}
