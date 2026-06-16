import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';

const COOKIE_NAME = 'mm_session';
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

// Get the anonymous session token from the cookie, minting a new one if
// missing. Auth is optional in MoodMeal, so this token is how we tie a string
// of mood check-ins to a single (logged-out) person.
export function getOrCreateSessionToken(): string {
  const store = cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const token = nanoid();
  store.set(COOKIE_NAME, token, {
    maxAge: THIRTY_DAYS_SECONDS,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });
  return token;
}
