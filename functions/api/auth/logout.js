import { getSessionFromCookie, jsonResponse, clearSessionCookie } from '../../_helpers';

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const sessionToken = getSessionFromCookie(request);

  if (sessionToken) {
    try {
      await db.prepare('DELETE FROM sessions WHERE session_token = ?').bind(sessionToken).run();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  const response = jsonResponse({ success: true });
  response.headers.set('Set-Cookie', clearSessionCookie());
  return response;
}
