import type { User, OrgMembership } from './lib/auth';

type Role = 'CITIZEN' | 'RESPONDER' | 'ADMIN' | 'DISPATCHER' | 'ORG_ADMIN';

declare global {
  namespace App {
    interface Locals {
      user?: User | null;
      accessToken?: string | null;
      activeRole?: Role | null;
      orgMemberships?: OrgMembership[];
      activeOrgId?: string | null;
    }
  }
}

export {};
