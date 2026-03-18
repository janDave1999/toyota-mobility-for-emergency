import type { APIRoute } from 'astro';

const API_BASE = 'https://walrus-app-mtda9.ondigitalocean.app/api';

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const { phone, otp } = body;
  
  if (!phone || !otp) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Phone and OTP are required' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const response = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: data.message || 'Invalid OTP' 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Set HTTP-only cookies
    cookies.set('access_token', data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: data.expires_in || 3600,
      path: '/',
    });

    cookies.set('refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    // Determine redirect based on role
    const roles = data.user?.roles?.map((r: { name: string }) => r.name) || [];
    let redirect = '/dashboard';
    if (roles.includes('ADMIN')) redirect = '/admin/dashboard';
    else if (roles.includes('DISPATCHER')) redirect = '/dispatch/dashboard';
    else if (roles.includes('RESPONDER')) redirect = '/responder/dashboard';
    else if (roles.includes('FIRST_AIDER')) redirect = '/first-aider/dashboard';

    return new Response(JSON.stringify({ 
      success: true,
      redirect,
      user: data.user
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Network error. Please try again.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
