export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(password, hash) {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export function generateSessionToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getSessionFromCookie(request) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});

  return cookies.session_token || null;
}

export async function verifySession(db, sessionToken) {
  if (!sessionToken) return null;

  try {
    const { results } = await db.prepare(`
      SELECT u.id, u.email, u.role, cp.full_name
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN client_profiles cp ON u.id = cp.user_id
      WHERE s.session_token = ? AND s.expires_at > datetime('now')
    `).bind(sessionToken).all();

    if (results.length === 0) return null;
    
    // For admin users without client profiles, use email as fallback
    const user = results[0];
    if (!user.full_name && user.role === 'admin') {
      user.full_name = user.email.split('@')[0];
    }
    
    return user;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export function errorResponse(message, status = 400) {
  return jsonResponse({ error: message }, status);
}

export function setSessionCookie(token, maxAge = 604800) {
  return `session_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`;
}

export function clearSessionCookie() {
  return 'session_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0';
}

export function formatDate(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export async function parseBody(request) {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
}

export async function authenticateRequest(request, db) {
  const sessionToken = getSessionFromCookie(request);
  if (!sessionToken) {
    return { error: errorResponse('Unauthorized', 401), user: null };
  }

  const user = await verifySession(db, sessionToken);
  if (!user) {
    return { error: errorResponse('Invalid or expired session', 401), user: null };
  }

  return { user, error: null };
}

export async function requireAdmin(request, db) {
  const { user, error } = await authenticateRequest(request, db);
  if (error) return { error, user: null };

  if (user.role !== 'admin') {
    return { error: errorResponse('Forbidden - Admin access required', 403), user: null };
  }

  return { user, error: null };
}

export function normalizeMicrochippedValue(value) {
  // Convert various microchipped values to text enum
  if (value === 'Yes' || value === 'No' || value === 'Unknown') {
    return value;
  }
  // Handle boolean or numeric values
  return value ? 'Yes' : 'Unknown';
}
