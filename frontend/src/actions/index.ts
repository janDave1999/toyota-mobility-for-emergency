import { defineAction, ActionError } from 'astro:actions';
import { z } from 'zod';
import { verifyTurnstile } from '../lib/turnstile';
import { decodeJWT } from '../lib/auth';

function getUserIdFromToken(accessToken: string): string {
  const payload = decodeJWT(accessToken);
  if (!payload?.sub) throw new ActionError({ code: 'UNAUTHORIZED', message: 'Invalid session token.' });
  return payload.sub;
}

const API_VERSION = import.meta.env.API_VERSION ?? 'v1';
export const server = {
  auth: {
    register: defineAction({
      accept: 'json',
      input: z.object({
        first_name: z.string().min(1, 'First name is required'),
        last_name: z.string().min(1, 'Last name is required'),
        phone: z.string().min(1, 'Phone number is required'),
        email: z.email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        turnstileToken: z.string().optional(),
      }),
      handler: async ({ first_name, last_name, phone, email, password, turnstileToken }, context) => {
        const ip = context.request.headers.get('CF-Connecting-IP') ?? undefined;
        const { success: captchaOk } = await verifyTurnstile(turnstileToken, ip);
        if (!captchaOk) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'Bot verification failed. Please try again.',
          });
        }

        let res: Response;
        try {
          const apiBase = import.meta.env.API_BASE_URL;
          res = await fetch(`${apiBase}/${API_VERSION}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name, last_name, phone, email, password }),
          });
        } catch {
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Unable to reach the server. Please try again.',
          });
        }

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: data?.message ?? 'Registration failed. Please try again.',
          });
        }

        return { success: true };
      },
    }),

    login: defineAction({
      accept: 'json',
      input: z.object({
        email: z.string().min(1, 'Email is required'),
        password: z.string().min(1, 'Password is required'),
        turnstileToken: z.string().optional(),
      }),
      handler: async ({ email, password, turnstileToken }, context) => {
        // Verify Turnstile before touching the backend
        const ip = context.request.headers.get('CF-Connecting-IP') ?? undefined;
        const { success: captchaOk } = await verifyTurnstile(turnstileToken, ip);
        if (!captchaOk) {
          throw new ActionError({
            code: 'BAD_REQUEST',
            message: 'Bot verification failed. Please try again.',
          });
        }

        // Call backend
        let res: Response;
        try {
          const apiBase = import.meta.env.API_BASE_URL;
          res = await fetch(`${apiBase}/${API_VERSION}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim(), password }),
          });
        } catch {
          throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Unable to reach the server. Please try again.',
          });
        }

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new ActionError({
            code: 'UNAUTHORIZED',
            message: data?.message ?? 'Invalid email or password.',
          });
        }

        // Set HTTP-only cookies — tokens never reach client JS
        context.cookies.set('access_token', data.access_token, {
          httpOnly: true,
          secure: import.meta.env.PROD,
          sameSite: 'strict',
          maxAge: data.expires_in,
          path: '/',
        });

        context.cookies.set('refresh_token', data.refresh_token, {
          httpOnly: true,
          secure: import.meta.env.PROD,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
        });

        // Non-httpOnly: public user info only, no tokens — same lifetime as refresh_token
        context.cookies.set('user', JSON.stringify(data.user), {
          httpOnly: false,
          secure: import.meta.env.PROD,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
        });

        // Role-based redirect
        // const roles: string[] = data.user?.roles?.map((r: { name: string }) => r.name) ?? [];
        let redirect = '/sos';
        // if (roles.includes('ADMIN')) redirect = '/admin/dashboard';
        // else if (roles.includes('DISPATCHER')) redirect = '/dispatch/dashboard';
        // else if (roles.includes('RESPONDER')) redirect = '/responder/dashboard';
        // else if (roles.includes('FIRST_AIDER')) redirect = '/first-aider/dashboard';

        return { redirect };
      },
    }),
  },

  emergencyContacts: {
    add: defineAction({
      accept: 'json',
      input: z.object({
        name: z.string().min(1, 'Name is required'),
        phone: z.string().min(1, 'Phone is required'),
        relationship: z.string().min(1, 'Relationship is required'),
      }),
      handler: async ({ name, phone, relationship }, context) => {
        const accessToken = context.cookies.get('access_token')?.value;
        if (!accessToken) throw new ActionError({ code: 'UNAUTHORIZED', message: 'Not authenticated.' });
        const userId = getUserIdFromToken(accessToken);

        let res: Response;
        try {
          const apiBase = import.meta.env.API_BASE_URL;
          res = await fetch(`${apiBase}/${API_VERSION}/users/${userId}/emergency-contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({ name, phone, relationship }),
          });
        } catch {
          throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to reach the server.' });
        }

        const data = await res.json().catch(() => null);
        if (!res.ok) throw new ActionError({ code: 'BAD_REQUEST', message: data?.message ?? 'Failed to add contact.' });
        return { success: true };
      },
    }),

    update: defineAction({
      accept: 'json',
      input: z.object({
        id: z.string().min(1),
        name: z.string().min(1, 'Name is required'),
        phone: z.string().min(1, 'Phone is required'),
        relationship: z.string().min(1, 'Relationship is required'),
      }),
      handler: async ({ id, name, phone, relationship }, context) => {
        const accessToken = context.cookies.get('access_token')?.value;
        if (!accessToken) throw new ActionError({ code: 'UNAUTHORIZED', message: 'Not authenticated.' });
        const userId = getUserIdFromToken(accessToken);

        let res: Response;
        try {
          const apiBase = import.meta.env.API_BASE_URL;
          res = await fetch(`${apiBase}/${API_VERSION}/users/${userId}/emergency-contacts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({ name, phone, relationship }),
          });
        } catch {
          throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to reach the server.' });
        }

        const data = await res.json().catch(() => null);
        if (!res.ok) throw new ActionError({ code: 'BAD_REQUEST', message: data?.message ?? 'Failed to update contact.' });
        return { success: true };
      },
    }),

    delete: defineAction({
      accept: 'json',
      input: z.object({
        id: z.string().min(1),
      }),
      handler: async ({ id }, context) => {
        const accessToken = context.cookies.get('access_token')?.value;
        if (!accessToken) throw new ActionError({ code: 'UNAUTHORIZED', message: 'Not authenticated.' });
        const userId = getUserIdFromToken(accessToken);

        let res: Response;
        try {
          const apiBase = import.meta.env.API_BASE_URL;
          res = await fetch(`${apiBase}/${API_VERSION}/users/${userId}/emergency-contacts/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        } catch {
          throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to reach the server.' });
        }

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new ActionError({ code: 'BAD_REQUEST', message: data?.message ?? 'Failed to delete contact.' });
        }
        return { success: true };
      },
    }),
  },
};
