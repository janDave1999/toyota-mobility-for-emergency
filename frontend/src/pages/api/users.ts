import type { APIRoute } from 'astro';

const API_BASE = 'https://walrus-app-mtda9.ondigitalocean.app/api';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  
  const phone = formData.get('phone')?.toString() || '';
  const email = formData.get('email')?.toString() || '';
  const password = formData.get('password')?.toString() || '';
  const first_name = formData.get('first_name')?.toString() || '';
  const last_name = formData.get('last_name')?.toString() || '';
  
  if (!phone || !email || !password || !first_name || !last_name) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'All fields are required' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const apiFormData = new FormData();
    apiFormData.append('phone', phone);
    apiFormData.append('email', email);
    apiFormData.append('password', password);
    apiFormData.append('first_name', first_name);
    apiFormData.append('last_name', last_name);
    
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      body: apiFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: data.message || 'Registration failed' 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user: data.user || data 
    }), {
      status: 201,
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
