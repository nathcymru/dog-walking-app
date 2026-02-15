import { getSessionFromCookie, verifySession, jsonResponse } from '../../_helpers';

export async function onRequestGet({ request, env }) {
  const db = env.DB;
  const sessionToken = getSessionFromCookie(request);

  if (!sessionToken) {
    return jsonResponse({ user: null });
  }

  const user = await verifySession(db, sessionToken);
  return jsonResponse({ user });
}
