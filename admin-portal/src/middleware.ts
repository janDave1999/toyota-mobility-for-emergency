import { defineMiddleware, sequence } from 'astro:middleware';
import { isTokenExpired, getUserFromCookie, decodeJWT } from './lib/auth';
import type { User, OrgMembership } from './lib/auth';

type Role = 'CITIZEN' | 'RESPONDER' | 'ADMIN' | 'DISPATCHER' | 'ORG_ADMIN';

// Highest-privilege role wins for UI routing
const ROLE_PRIORITY: Role[] = ['ADMIN', 'DISPATCHER', 'ORG_ADMIN', 'RESPONDER', 'CITIZEN'];

interface RouteRule {
  pattern: string;
  roles?: Role[];
}

const PROTECTED_ROUTES: RouteRule[] = [
  { pattern: '/admin', roles: ['ADMIN'] },
  { pattern: '/org',   roles: ['DISPATCHER', 'ORG_ADMIN'] },
];

const AUTH_ONLY_ROUTES = ['/auth/login'];
const PUBLIC_AUTH_ROUTES = ['/auth/unauthorized', '/auth/logout'];

// Roles permitted to access the admin portal at all
const PORTAL_ROLES: Role[] = ['ADMIN', 'DISPATCHER', 'ORG_ADMIN'];

const COOKIE_BASE = {
  secure: import.meta.env.PROD,
  sameSite: 'strict' as const,
  path: '/',
};

const session = defineMiddleware(async ({ cookies, locals }, next) => {
  locals.user = null;
  locals.accessToken = null;
  locals.orgMemberships = [];
  locals.activeOrgId = null;

  let accessToken = cookies.get('access_token')?.value ?? null;
  const refreshToken = cookies.get('refresh_token')?.value;
  const userCookie = cookies.get('user')?.value;
  // if access token don't exist or is expired, try refreshing
  if (!accessToken && refreshToken) {
    const refreshed = await tryRefreshToken(refreshToken);
    if (refreshed) {
      accessToken = refreshed.access_token;

      const maxAge = refreshed.expires_at
        ? Math.max(1, Math.floor((new Date(refreshed.expires_at).getTime() - Date.now()) / 1000))
        : 60 * 15; // fallback: 15 min

      cookies.set('access_token', refreshed.access_token, {
        ...COOKIE_BASE, httpOnly: true, maxAge,
      });

      // Rotate refresh token if backend returned a new one
      if (refreshed.refresh_token) {
        cookies.set('refresh_token', refreshed.refresh_token, {
          ...COOKIE_BASE, httpOnly: true, maxAge: 60 * 60 * 24 * 30,
        });
      }

      // Keep user cookie fresh
      if (refreshed.user) {
        cookies.set('user', JSON.stringify(refreshed.user), {
          ...COOKIE_BASE, httpOnly: false, maxAge: 60 * 60 * 24 * 30,
        });
      }
    } else {
      // Refresh failed — clear every auth cookie
      accessToken = null;
      for (const name of ['access_token', 'refresh_token', 'user', 'org_memberships', 'active_org_id', 'active_role']) {
        cookies.delete(name, { path: '/' });
      }
    }
  }

  if (accessToken && isTokenExpired(accessToken)) {
    if (refreshToken) {
      const refreshed = await tryRefreshToken(refreshToken);
      if (refreshed) {
        accessToken = refreshed.access_token;

        const maxAge = refreshed.expires_at
          ? Math.max(1, Math.floor((new Date(refreshed.expires_at).getTime() - Date.now()) / 1000))
          : 60 * 15; // fallback: 15 min

        cookies.set('access_token', refreshed.access_token, {
          ...COOKIE_BASE, httpOnly: true, maxAge,
        });

        // Rotate refresh token if backend returned a new one
        if (refreshed.refresh_token) {
          cookies.set('refresh_token', refreshed.refresh_token, {
            ...COOKIE_BASE, httpOnly: true, maxAge: 60 * 60 * 24 * 30,
          });
        }

        // Keep user cookie fresh
        if (refreshed.user) {
          cookies.set('user', JSON.stringify(refreshed.user), {
            ...COOKIE_BASE, httpOnly: false, maxAge: 60 * 60 * 24 * 30,
          });
        }
      } else {
        // Refresh failed — clear every auth cookie
        accessToken = null;
        for (const name of ['access_token', 'refresh_token', 'user', 'org_memberships', 'active_org_id', 'active_role']) {
          cookies.delete(name, { path: '/' });
        }
      }
    } else {
      // No refresh token at all — clear everything
      accessToken = null;
      for (const name of ['access_token', 'user', 'org_memberships', 'active_org_id', 'active_role']) {
        cookies.delete(name, { path: '/' });
      }
    }
  }

  if (accessToken) {
    locals.accessToken = accessToken;
    locals.user = getUserFromCookie(userCookie) ?? userFromJWT(accessToken);
  }

  // Read active org ID from cookie (stored at login)
  locals.activeOrgId = cookies.get('active_org_id')?.value ?? null;

  // Read org memberships from cookie (stored at login for ORG_ADMIN detection)
  const orgMembershipsCookie = cookies.get('org_memberships')?.value;
  if (orgMembershipsCookie) {
    try {
      locals.orgMemberships = JSON.parse(decodeURIComponent(orgMembershipsCookie));
    } catch { /* ignore malformed cookie */ }
  }

  // Build effective role list: JWT roles + synthetic ORG_ADMIN if they have active memberships
  const userRoleNames = (locals.user?.roles.map(r => r.name) ?? []) as Role[];
  const hasOrgAdmin = (locals.orgMemberships ?? []).some(
    m => m.org_role === 'ORG_ADMIN' && m.status === 'ACTIVE',
  );
  const effectiveRoles: Role[] = hasOrgAdmin
    ? [...userRoleNames, 'ORG_ADMIN']
    : userRoleNames;

  const activeRoleCookie = cookies.get('active_role')?.value as Role | undefined;
  if (activeRoleCookie && effectiveRoles.includes(activeRoleCookie)) {
    locals.activeRole = activeRoleCookie;
  } else {
    locals.activeRole = ROLE_PRIORITY.find(r => effectiveRoles.includes(r)) ?? null;
  }

  return next();
});

const guard = defineMiddleware(({ url, locals, redirect }, next) => {
  const { pathname } = url;

  const isAuthPage   = AUTH_ONLY_ROUTES.some(r => pathname.startsWith(r));
  const isPublicAuth = PUBLIC_AUTH_ROUTES.some(r => pathname.startsWith(r));

  if (isPublicAuth) return next();

  // Non-auth pages require a portal role
  if (!isAuthPage && !PORTAL_ROLES.includes(locals.activeRole as Role)) {
    return locals.accessToken ? redirect('/auth/unauthorized') : redirect('/auth/login');
  }

  // Check route-specific role requirements
  const matched = PROTECTED_ROUTES.find(r => pathname.startsWith(r.pattern));
  if (matched?.roles?.length) {
    const hasRole = matched.roles.includes(locals.activeRole as Role);
    if (!hasRole) return redirect('/auth/unauthorized');
  }

  // Already logged-in users hitting auth pages get routed to their dashboard
  if (isAuthPage && locals.accessToken) {
    if (locals.activeRole === 'ADMIN') return redirect('/admin/dashboard');
    if (locals.activeRole === 'DISPATCHER') return redirect('/org/dashboard');
    if (locals.activeRole === 'ORG_ADMIN') return redirect('/org/dashboard');
    return redirect('/');
  }

  return next();
});

export const onRequest = sequence(session, guard);

async function tryRefreshToken(
  refreshToken: string,
): Promise<{ access_token: string; expires_at: string; refresh_token?: string; user?: User } | null> {
  try {
    const apiVersion = import.meta.env.API_VERSION ?? 'v1';
    const res = await fetch(`${import.meta.env.API_BASE_URL}/${apiVersion}/auth/refresh`, {
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
