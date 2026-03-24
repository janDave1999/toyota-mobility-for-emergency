/// <reference types="astro/client" />

import type { User } from './lib/auth';

declare global {
  namespace App {
    interface Locals {
      /** Populated by middleware for every authenticated request. Null on public pages. */
      user: User | null;
      /** Raw access token, available on authenticated pages. */
      accessToken: string | null;
      /** The currently active role selected by the user. Defaults to their highest-priority role. */
      activeRole: string | null;
    }
  }
}

export {};
