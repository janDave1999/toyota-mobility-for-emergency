import { defineMiddleware, sequence } from 'astro:middleware';
import { isTokenExpired, getUserFromCookie, decodeJWT } from './lib/auth';
import type { User } from './lib/auth';

type Role = 'CITIZEN' | 'RESPONDER' | 'ADMIN' | 'DISPATCHER' | 'FIRST_AIDER';

interface RouteRule {
  pattern: string;
  roles?: Role[];
}

// Routes that require authentication (and optionally a specific role)
const PROTECTED_ROUTES: RouteRule[] = [
  { pattern: '/sos' },
  { pattern: '/dashboard' },
  { pattern: '/report' },
  { pattern: '/profile' },
  { pattern: '/incidents' },
  { pattern: '/map',          roles: ['ADMIN', 'DISPATCHER', 'RESPONDER', 'FIRST_AIDER'] },
  { pattern: '/organization', roles: ['ADMIN', 'DISPATCHER'] },
  { pattern: '/admin',        roles: ['ADMIN'] },
  { pattern: '/dispatch',     roles: ['ADMIN', 'DISPATCHER'] },
  { pattern: '/responder',    roles: ['ADMIN', 'RESPONDER'] },
  { pattern: '/first-aider',  roles: ['ADMIN', 'FIRST_AIDER'] },
];

// Routes only accessible when NOT authenticated
const AUTH_ONLY_ROUTES = ['/auth/login', '/auth/register', '/auth/verify'];

// Shared cookie options
const COOKIE_BASE = {
  secure: import.meta.env.PROD,
  sameSite: 'strict' as const,
  path: '/',
};

// ── Middleware 1: session ─────────────────────────────────────────────────────
// Runs on every request. Resolves the access token (refreshing if needed)
// and populates locals.user + locals.accessToken.
const session = defineMiddleware(async ({ cookies, locals }, next) => {
  locals.user = null;
  locals.accessToken = null;

  let accessToken = cookies.get('access_token')?.value ?? null;
  const refreshToken = cookies.get('refresh_token')?.value;
  const userCookie = cookies.get('user')?.value;

  // Silently refresh an expired access token when a refresh token exists
  if (accessToken && isTokenExpired(accessToken)) {
    if (refreshToken) {
      const refreshed = await tryRefreshToken(refreshToken);
      if (refreshed) {
        accessToken = refreshed.access_token;
        cookies.set('access_token', refreshed.access_token, {
          ...COOKIE_BASE,
          httpOnly: true,
          maxAge: refreshed.expires_in,
        });
      } else {
        // Refresh failed — log the user out by clearing all session cookies
        accessToken = null;
        cookies.delete('access_token', { path: '/' });
        cookies.delete('refresh_token', { path: '/' });
        cookies.delete('user', { path: '/' });
      }
    } else {
      // No refresh token available — clear the stale access token
      accessToken = null;
      cookies.delete('access_token', { path: '/' });
      cookies.delete('user', { path: '/' });
    }
  }

  if (accessToken) {
    locals.accessToken = accessToken;
    // Prefer the user cookie (full profile); fall back to JWT claims (minimal info)
    locals.user = getUserFromCookie(userCookie) ?? userFromJWT(accessToken);
  }

  return next();
});

// ── Middleware 2: guard ───────────────────────────────────────────────────────
// Enforces authentication and role-based access on protected routes,
// and redirects authenticated users away from auth pages.
const guard = defineMiddleware(({ url, locals, redirect }, next) => {
  const { pathname } = url;

  const matched = PROTECTED_ROUTES.find(r => pathname.startsWith(r.pattern));
  const isAuthPage = AUTH_ONLY_ROUTES.some(r => pathname.startsWith(r));

  if (matched) {
    // Must be authenticated
    if (!locals.accessToken) {
      return redirect(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }

    // Must have at least one of the required roles (if the route is role-restricted)
    if (matched.roles?.length) {
      const userRoles = locals.user?.roles.map(r => r.name) ?? [];
      const hasRole = matched.roles.some(role => userRoles.includes(role));
      if (!hasRole) return redirect('/unauthorized');
    }
  }

  // Authenticated users should not see login/register screens
  if (isAuthPage && locals.accessToken) {
    return redirect('/sos');
  }

  return next();
});

export const onRequest = sequence(session, guard);

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Attempts to exchange a refresh token for a new access token. */
async function tryRefreshToken(
  refreshToken: string,
): Promise<{ access_token: string; expires_in: number } | null> {
  try {
    const res = await fetch(`${import.meta.env.API_BASE_URL}api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** Reconstructs a minimal User object from JWT claims when the user cookie is absent. */
function userFromJWT(accessToken: string): User | null {
  const payload = decodeJWT(accessToken);
  if (!payload) return null;
  return {
    id: payload.sub,
    email: payload.username,
    first_name: '',
    last_name: '',
    roles: payload.roles.map(name => ({ id: '', name })),
  };
}
