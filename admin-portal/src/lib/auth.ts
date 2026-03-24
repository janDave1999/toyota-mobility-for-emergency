export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  profile_image_url?: string | null;
  roles: { id: string; name: string }[];
}

export interface OrgMembership {
  id: string;
  organization_id: string;
  org_role: 'RESPONDER' | 'DISPATCHER' | 'ORG_ADMIN';
  org_type: string;
  status: 'INVITED' | 'ACTIVE' | 'DECLINED' | 'SUSPENDED';
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: string;
  user: User;
}

interface JWTPayload {
  sub: string;
  username: string;
  roles: string[];
  exp: number;
  iat: number;
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload as JWTPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;
  return Math.floor(Date.now() / 1000) >= payload.exp;
}

export function getUserFromCookie(userCookie: string | undefined): User | null {
  if (!userCookie) return null;
  try { return JSON.parse(userCookie) as User; } catch { /* fall through */ }
  try { return JSON.parse(decodeURIComponent(userCookie)) as User; } catch { return null; }
}
