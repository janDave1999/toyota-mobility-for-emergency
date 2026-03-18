import type { APIRoute } from 'astro';
import { requireTurnstile } from '../../../lib/turnstile';

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: { email?: string; password?: string; turnstileToken?: string };
  console.log('Received login request');
  try {
    body = await request.json();
  } catch {
    return json({ success: false, message: 'Invalid request body' }, 400);
  }

  const { email, password, turnstileToken } = body;

  if (!email?.trim() || !password) {
    return json({ success: false, message: 'Email and password are required.' }, 400);
  }

  // Verify Turnstile before hitting the backend
  const ip = request.headers.get('CF-Connecting-IP') ?? undefined;
  try {
    await requireTurnstile(turnstileToken, ip);
  } catch (res) {
    return res as Response;
  }

  try {
    const apiBase = import.meta.env.API_BASE_URL;
    const res = await fetch(`${apiBase}auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email.trim(), password }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return json(
        { success: false, message: data?.message ?? 'Invalid email or password.' },
        res.status
      );
    }

    // HTTP-only cookies — tokens never reach client JS
    cookies.set('access_token', data.access_token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: data.expires_in,
      path: '/',
    });

    cookies.set('refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    // Non-httpOnly: only public user info, no tokens
    cookies.set('user', encodeURIComponent(JSON.stringify(data.user)), {
      httpOnly: false,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: data.expires_in,
      path: '/',
    });

    // Role-based redirect
    const roles: string[] = data.user?.roles?.map((r: { name: string }) => r.name) ?? [];
    let redirect = '/dashboard';
    if (roles.includes('ADMIN')) redirect = '/admin/dashboard';
    else if (roles.includes('DISPATCHER')) redirect = '/dispatch/dashboard';
    else if (roles.includes('RESPONDER')) redirect = '/responder/dashboard';
    else if (roles.includes('FIRST_AIDER')) redirect = '/first-aider/dashboard';

    return json({ success: true, redirect });
  } catch {
    return json({ success: false, message: 'Server error. Please try again.' }, 500);
  }
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
