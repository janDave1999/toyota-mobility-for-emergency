import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, locals, redirect }) => {
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const formData = await request.formData();
  const requestedRole = formData.get('role') as string;

  const userRoleNames = user.roles.map(r => r.name);
  if (!requestedRole || !userRoleNames.includes(requestedRole)) {
    return new Response(JSON.stringify({ error: 'Invalid role' }), { status: 400 });
  }

  cookies.set('active_role', requestedRole, {
    path: '/',
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  const referer = request.headers.get('referer');
  return redirect(referer || '/sos');
};
