import type { APIRoute } from 'astro';

const COOKIE_OPTS = { path: '/' } as const;

function clearSession(cookies: Parameters<APIRoute>[0]['cookies']) {
  cookies.delete('access_token', COOKIE_OPTS);
  cookies.delete('refresh_token', COOKIE_OPTS);
  cookies.delete('user', COOKIE_OPTS);
}

export const POST: APIRoute = ({ cookies, redirect }) => {
  clearSession(cookies);
  return redirect('/auth/login');
};

export const GET: APIRoute = ({ cookies, redirect }) => {
  clearSession(cookies);
  return redirect('/auth/login');
};
