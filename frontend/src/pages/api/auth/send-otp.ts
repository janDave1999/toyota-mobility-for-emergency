import type { APIRoute } from 'astro';

const API_BASE = 'https://walrus-app-mtda9.ondigitalocean.app/api';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { phone } = body;
  
  if (!phone) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Phone number is required' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const response = await fetch(`${API_BASE}/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: data.message || 'Failed to send OTP' 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'OTP sent successfully',
      expires_in: data.expires_in 
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
