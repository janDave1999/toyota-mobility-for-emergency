const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileVerifyResult {
  success: boolean;
  errorCodes?: string[];
}

/**
 * Verifies a Cloudflare Turnstile token server-side.
 * Call this in any API route before processing the request.
 *
 * @param token   The `cf-turnstile-response` value from the client
 * @param ip      Optional: the visitor's IP for extra validation
 */
export async function verifyTurnstile(
  token: string | null | undefined,
  ip?: string
): Promise<TurnstileVerifyResult> {
  if (!token) {
    return { success: false, errorCodes: ['missing-input-response'] };
  }

  const secret = import.meta.env.CF_TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('[Turnstile] CF_TURNSTILE_SECRET_KEY is not set');
    return { success: false, errorCodes: ['missing-secret'] };
  }

  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body });
    if (!res.ok) return { success: false, errorCodes: ['network-error'] };

    const data = await res.json() as {
      success: boolean;
      'error-codes'?: string[];
    };

    return {
      success: data.success === true,
      errorCodes: data['error-codes'],
    };
  } catch {
    return { success: false, errorCodes: ['network-error'] };
  }
}

/**
 * Throws a 400 Response if the Turnstile token is invalid.
 * Convenience wrapper for API routes.
 */
export async function requireTurnstile(
  token: string | null | undefined,
  ip?: string
): Promise<void> {
  const result = await verifyTurnstile(token, ip);
  if (!result.success) {
    throw new Response(
      JSON.stringify({ success: false, message: 'Bot verification failed. Please try again.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
