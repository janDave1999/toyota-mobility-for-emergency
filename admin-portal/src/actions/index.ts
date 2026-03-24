import { defineAction, ActionError } from 'astro:actions';
import { z } from 'zod';

const API_VERSION = import.meta.env.API_VERSION ?? 'v1';

function getAccessToken(context: { cookies: { get: (name: string) => { value: string } | undefined } }): string {
  const accessToken = context.cookies.get('access_token')?.value;
  if (!accessToken) throw new ActionError({ code: 'UNAUTHORIZED', message: 'Not authenticated.' });
  return accessToken;
}


async function apiFetch(endpoint: string, options: RequestInit, accessToken?: string) {
  const apiBase = import.meta.env.API_BASE_URL;
  console.log(`API Request: ${options.method ?? 'GET'} ${endpoint}`);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers,
  };

  let res: Response;
  try {
    res = await fetch(`${apiBase}/${API_VERSION}${endpoint}`, { ...options, headers });
  } catch {
    throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to reach the server.' });
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ActionError({ code: 'BAD_REQUEST', message: data?.message ?? 'Request failed.' });
  }
  return data;
}

const ORG_TYPE = z.enum([
  'POLICE', 'FIRE', 'AMBULANCE', 'COAST_GUARD',
  'BARANGAY', 'LGU', 'OCD', 'PRIVATE',
]);

const ORG_LEVEL = z.enum(['NATIONAL', 'REGIONAL', 'PROVINCIAL', 'CITY', 'MUNICIPAL', 'BARANGAY']);

const ORG_ROLE = z.enum(['RESPONDER', 'DISPATCHER']);

export const server = {
  auth: {
    login: defineAction({
      accept: 'json',
      input: z.object({
        email: z.string().min(1, 'Email is required'),
        password: z.string().min(1, 'Password is required'),
      }),
      handler: async ({ email, password }, context) => {
        const data = await apiFetch('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: email.trim(), password }),
        });

        const accessTokenMaxAge = Math.floor(
          (new Date(data.expires_at).getTime() - Date.now()) / 1000,
        );

        const cookieBase = {
          secure: import.meta.env.PROD,
          sameSite: 'strict' as const,
          path: '/',
        };

        context.cookies.set('access_token', data.access_token, {
          ...cookieBase,
          httpOnly: true,
          maxAge: accessTokenMaxAge,
        });

        context.cookies.set('refresh_token', data.refresh_token, {
          ...cookieBase,
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 30,
        });

        context.cookies.set('user', JSON.stringify(data.user), {
          ...cookieBase,
          httpOnly: false,
          maxAge: 60 * 60 * 24 * 30,
        });

        const roles: string[] = data.user?.roles?.map((r: { name: string }) => r.name) ?? [];

        // Fetch full profile for any portal user (DISPATCHER or potential ORG_ADMIN)
        // to resolve org memberships and active organization_id
        let isOrgAdmin = false;
        let activeOrgId: string | null = null;

        if (!roles.includes('ADMIN')) {
          try {
            const me = await apiFetch('/users/me', { method: 'GET' }, data.access_token);
            const memberships: Array<{
              org_role: string;
              status: string;
              id: string;
              organization_id: string;
              org_type: string;
            }> = me.organizations ?? [];

            const activeMemberships = memberships.filter(m => m.status === 'ACTIVE');

            // Prefer ORG_ADMIN membership, then DISPATCHER
            const orgAdminMemberships = activeMemberships.filter(m => m.org_role === 'ORG_ADMIN');
            const dispatcherMemberships = activeMemberships.filter(m => m.org_role === 'DISPATCHER');

            const portalMemberships = orgAdminMemberships.length > 0
              ? orgAdminMemberships
              : dispatcherMemberships;

            if (orgAdminMemberships.length > 0) {
              isOrgAdmin = true;
            }

            if (portalMemberships.length > 0) {
              activeOrgId = portalMemberships[0].organization_id;

              context.cookies.set('org_memberships', encodeURIComponent(JSON.stringify(portalMemberships)), {
                ...cookieBase,
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 30,
              });

              context.cookies.set('active_org_id', activeOrgId, {
                ...cookieBase,
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 30,
              });
            }
          } catch { /* non-fatal — ADMIN users don't need org memberships */ }
        }

        let redirect = '/auth/unauthorized';
        if (roles.includes('ADMIN')) redirect = '/admin/dashboard';
        else if (roles.includes('DISPATCHER') || isOrgAdmin) redirect = '/org/dashboard';

        return { redirect, org_id: activeOrgId };
      },
    }),

    logout: defineAction({
      handler: async (_, context) => {
        context.cookies.delete('access_token', { path: '/' });
        context.cookies.delete('refresh_token', { path: '/' });
        context.cookies.delete('user', { path: '/' });
        context.cookies.delete('org_memberships', { path: '/' });
        context.cookies.delete('active_org_id', { path: '/' });
        context.cookies.delete('active_role', { path: '/' });
        return { redirect: '/auth/login' };
      },
    }),
  },

  admin: {
    getStats: defineAction({
      handler: async (_, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch('/reports/dashboard', { method: 'GET' }, accessToken);
      },
    }),

    // --- Organization CRUD ---

    getOrganizations: defineAction({
      accept: 'json',
      input: z.object({
        page:      z.number().int().min(1).optional().default(1),
        limit:     z.number().int().min(1).max(100).optional().default(10),
        type:      ORG_TYPE.optional(),
        level:     ORG_LEVEL.optional(),
        parent_id: z.string().optional(),
      }),
      handler: async ({ page, limit, type, level, parent_id }, context) => {
        const accessToken = getAccessToken(context);
        const query = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (type)      query.set('type', type);
        if (level)     query.set('level', level);
        if (parent_id) query.set('parent_id', parent_id);
        return apiFetch(`/organizations?${query.toString()}`, { method: 'GET' }, accessToken);
      },
    }),

    getOrganization: defineAction({
      accept: 'json',
      input: z.object({ id: z.string().min(1) }),
      handler: async ({ id }, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch(`/organizations/${id}`, { method: 'GET' }, accessToken);
      },
    }),

    createOrganization: defineAction({
      accept: 'json',
      input: z.object({
        name: z.string().min(1, 'Name is required'),
        short_name: z.string().min(1, 'Short name is required'),
        code: z.string().min(1, 'Code is required'),
        type: ORG_TYPE,
        level: ORG_LEVEL,
        address: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        region:   z.string().optional(),
        province: z.string().optional(),
        city:     z.string().optional(),
        barangay: z.string().optional(),
        parent_organization_id: z.string().optional(),
        allowed_roles: z.array(ORG_ROLE).min(1, 'At least one role is required'),
        allowed_responder_types: z.array(z.string()).optional(),
        initial_admin: z.object({
          user_id: z.string().min(1),
        }).optional(),
      }),
      handler: async (input, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch('/organizations', {
          method: 'POST',
          body: JSON.stringify(input),
        }, accessToken);
      },
    }),

    updateOrganization: defineAction({
      accept: 'json',
      input: z.object({
        id: z.string().min(1),
        name: z.string().optional(),
        short_name: z.string().optional(),
        code: z.string().optional(),
        type: ORG_TYPE.optional(),
        level: ORG_LEVEL.optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        region:   z.string().optional(),
        province: z.string().optional(),
        city:     z.string().optional(),
        barangay: z.string().optional(),
        parent_organization_id: z.string().optional(),
        allowed_roles: z.array(ORG_ROLE).optional(),
        allowed_responder_types: z.array(z.string()).optional(),
      }),
      handler: async ({ id, ...updates }, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch(`/organizations/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates),
        }, accessToken);
      },
    }),

    deleteOrganization: defineAction({
      accept: 'json',
      input: z.object({ id: z.string().min(1) }),
      handler: async ({ id }, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch(`/organizations/${id}`, { method: 'DELETE' }, accessToken);
      },
    }),

    getOrgAdmins: defineAction({
      accept: 'json',
      input: z.object({ org_id: z.string().min(1) }),
      handler: async ({ org_id }, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch(`/organizations/${org_id}/members?org_role=ORG_ADMIN&limit=100`, { method: 'GET' }, accessToken);
      },
    }),

    addOrgAdmin: defineAction({
      accept: 'json',
      input: z.object({
        org_id:  z.string().min(1),
        user_id: z.string().min(1),
      }),
      handler: async ({ org_id, user_id }, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch(`/organizations/${org_id}/admins`, {
          method: 'POST',
          body: JSON.stringify({ user_id }),
        }, accessToken);
      },
    }),

    searchUsers: defineAction({
      accept: 'json',
      input: z.object({
        q:      z.string(),
        org_id: z.string().optional(),
      }),
      handler: async ({ q, org_id }, context) => {
        const accessToken = getAccessToken(context);
        const query = new URLSearchParams({ q });
        if (org_id) query.set('org_id', org_id);
        return apiFetch(`/users/search?${query.toString()}`, { method: 'GET' }, accessToken);
      },
    }),

    getUsers: defineAction({
      accept: 'json',
      input: z.object({
        page:  z.number().int().min(1).optional().default(1),
        limit: z.number().int().min(1).max(100).optional().default(10),
        role:  z.string().optional(),
      }),
      handler: async ({ page, limit, role }, context) => {
        const accessToken = getAccessToken(context);
        const query = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (role) query.set('role', role);
        return apiFetch(`/admin/users?${query.toString()}`, { method: 'GET' }, accessToken);
      },
    }),
  },

  org: {
    getStats: defineAction({
      accept: 'json',
      input: z.object({ org_id: z.string().min(1) }),
      handler: async ({ org_id }, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch(`/organizations/${org_id}/stats`, { method: 'GET' }, accessToken);
      },
    }),

    getMyMembership: defineAction({
      accept: 'json',
      handler: async (_, context) => {
        const accessToken = getAccessToken(context);
        const orgId = context.cookies.get('active_org_id')?.value;
        if (!orgId) throw new ActionError({ code: 'NOT_FOUND', message: 'No active organization found.' });
        return apiFetch(`/organizations/${orgId}/members?status=ACTIVE`, { method: 'GET' }, accessToken);
      },
    }),

    getIncidents: defineAction({
      accept: 'json',
      input: z.object({
        page:   z.number().int().min(1).optional().default(1),
        limit:  z.number().int().min(1).max(100).optional().default(10),
        status: z.string().optional(),
        type:   z.string().optional(),
      }),
      handler: async ({ page, limit, status, type }, context) => {
        const accessToken = getAccessToken(context);
        const query = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status) query.set('status', status);
        if (type)   query.set('type', type);
        return apiFetch(`/dispatcher/incidents?${query.toString()}`, { method: 'GET' }, accessToken);
      },
    }),

    dispatch: defineAction({
      accept: 'json',
      input: z.object({
        incident_id: z.string().min(1),
        responder_ids: z.array(z.string().min(1)).min(1),
        notes: z.string().optional(),
      }),
      handler: async ({ incident_id, responder_ids, notes }, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch(`/dispatcher/incidents/${incident_id}/dispatch`, {
          method: 'POST',
          body: JSON.stringify({ responder_ids, notes }),
        }, accessToken);
      },
    }),

    getMembers: defineAction({
      accept: 'json',
      input: z.object({
        org_id: z.string().min(1),
        page:   z.number().int().min(1).optional().default(1),
        limit:  z.number().int().min(1).max(100).optional().default(10),
        status: z.string().optional(),
      }),
      handler: async ({ org_id, page, limit, status }, context) => {
        const accessToken = getAccessToken(context);
        const query = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status) query.set('status', status);
        return apiFetch(`/organizations/${org_id}/members?${query.toString()}`, { method: 'GET' }, accessToken);
      },
    }),

    getUser: defineAction({
      accept: 'json',
      input: z.object({ id: z.string().min(1) }),
      handler: async ({ id }, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch(`/users/${id}`, { method: 'GET' }, accessToken);
      },
    }),

    inviteMember: defineAction({
      accept: 'json',
      input: z.object({
        org_id: z.string().min(1),
        user_id: z.string().min(1),
        org_role: ORG_ROLE,
        responder_type: z.string().nullable().optional(),
      }),
      handler: async ({ org_id, user_id, org_role, responder_type }, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch(`/organizations/${org_id}/members/invite`, {
          method: 'POST',
          body: JSON.stringify({ user_id, org_role, responder_type }),
        }, accessToken);
      },
    }),

    createDispatcher: defineAction({
      accept: 'json',
      input: z.object({
        org_id: z.string().min(1),
        first_name: z.string().min(1, 'First name is required'),
        last_name: z.string().min(1, 'Last name is required'),
        email: z.string().email('Valid email is required'),
        phone: z.string().min(1, 'Phone is required'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
      }),
      handler: async ({ org_id, ...staff }, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch(`/organizations/${org_id}/staff/dispatcher`, {
          method: 'POST',
          body: JSON.stringify(staff),
        }, accessToken);
      },
    }),

    revokeMember: defineAction({
      accept: 'json',
      input: z.object({
        org_id: z.string().min(1),
        member_id: z.string().min(1),
        reason: z.string().optional(),
      }),
      handler: async ({ org_id, member_id, reason }, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch(`/organizations/${org_id}/members/${member_id}/revoke`, {
          method: 'PUT',
          body: JSON.stringify({ reason }),
        }, accessToken);
      },
    }),

    kickMember: defineAction({
      accept: 'json',
      input: z.object({
        org_id: z.string().min(1),
        member_id: z.string().min(1),
      }),
      handler: async ({ org_id, member_id }, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch(`/organizations/${org_id}/members/${member_id}`, {
          method: 'DELETE',
        }, accessToken);
      },
    }),

    cancelInvite: defineAction({
      accept: 'json',
      input: z.object({
        org_id: z.string().min(1),
        member_id: z.string().min(1),
      }),
      handler: async ({ org_id, member_id }, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch(`/organizations/${org_id}/members/${member_id}/invite`, {
          method: 'DELETE',
        }, accessToken);
      },
    }),

    promoteMember: defineAction({
      accept: 'json',
      input: z.object({
        org_id: z.string().min(1),
        member_id: z.string().min(1),
        org_role: z.enum(['DISPATCHER', 'ORG_ADMIN']),
      }),
      handler: async ({ org_id, member_id, org_role }, context) => {
        const accessToken = getAccessToken(context);
        return apiFetch(`/organizations/${org_id}/members/${member_id}/promote`, {
          method: 'PUT',
          body: JSON.stringify({ org_role }),
        }, accessToken);
      },
    }),
  },
};
