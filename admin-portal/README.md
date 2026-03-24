# Toyota Emergency Admin Portal

Admin and Organization management portal for the Toyota Emergency Response Platform.
Built with Astro using actions pattern for type-safe API calls.

## Project Structure

```
admin-portal/
├── src/
│   ├── actions/              # Astro actions (type-safe API calls)
│   │   └── index.ts
│   ├── components/
│   │   ├── admin/            # Admin-specific components
│   │   │   ├── AdminSidebar.astro
│   │   │   └── AdminHeader.astro
│   │   └── common/           # Reusable UI components
│   │       ├── Button.astro
│   │       ├── Badge.astro
│   │       ├── Card.astro
│   │       ├── StatCard.astro
│   │       ├── NavItem.astro
│   │       ├── Table.astro
│   │       └── index.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro  # Base HTML layout
│   │   └── AdminLayout.astro  # Admin dashboard layout
│   ├── lib/
│   │   └── auth.ts           # JWT decode, cookie helpers
│   ├── middleware.ts         # Auth guard & role-based access
│   ├── pages/
│   │   ├── admin/            # System Admin pages (ADMIN role)
│   │   ├── org/              # Organization Admin pages (DISPATCHER role)
│   │   └── auth/             # Login/logout pages
│   ├── styles/
│   │   └── global.css        # Tailwind theme & global styles
│   └── env.d.ts
├── astro.config.mjs
└── package.json
```

## Components

### Layouts

| Component | Description |
|-----------|-------------|
| `BaseLayout.astro` | Base HTML layout with fonts, meta tags |
| `AdminLayout.astro` | Admin dashboard layout with sidebar + header |

### Admin Components

| Component | Description |
|-----------|-------------|
| `AdminSidebar.astro` | Left sidebar navigation |
| `AdminHeader.astro` | Top header with title, notifications, user menu |

### Common Components

| Component | Description |
|-----------|-------------|
| `Button.astro` | Button with variants (primary, secondary, outline, ghost, danger) |
| `Badge.astro` | Status badges with color variants |
| `Card.astro` | Card container with padding options |
| `StatCard.astro` | Statistics card with icon, value, and optional change indicator |
| `NavItem.astro` | Navigation item with icon support |
| `Table.astro` | Table wrapper component |

## User Roles

| Role | Description | Access |
|------|-------------|--------|
| ADMIN | System Administrator | `/admin/*` - Full system access |
| DISPATCHER | Organization Admin | `/org/*` - Organization management |

## Astro Actions

Actions are defined in `src/actions/index.ts`:

```typescript
export const server = {
  auth: {
    login: defineAction({ ... }),
    logout: defineAction({ ... }),
  },
  admin: {
    getStats: defineAction({ ... }),
    getOrganizations: defineAction({ ... }),
    createOrganization: defineAction({ ... }),
    getUsers: defineAction({ ... }),
  },
  org: {
    getStats: defineAction({ ... }),
    getIncidents: defineAction({ ... }),
    dispatch: defineAction({ ... }),
    getMembers: defineAction({ ... }),
    inviteMember: defineAction({ ... }),
    removeMember: defineAction({ ... }),
  },
};
```

## Environment Variables

```env
API_BASE_URL=https://api.example.com
API_VERSION=v1
SITE_URL=https://admin.example.com
```

## Getting Started

```bash
cd admin-portal
npm install
npm run dev
```

## Routes

### Auth Routes
- `/auth/login` - Login page
- `/auth/logout` - Logout action

### Admin Routes (ADMIN only)
- `/admin/dashboard` - System overview
- `/admin/organizations` - Manage organizations
- `/admin/organizations/new` - Create organization
- `/admin/users` - Manage users
- `/admin/incidents` - View all incidents

### Organization Routes (DISPATCHER only)
- `/org/dashboard` - Organization overview
- `/org/members` - Manage team members
- `/org/members/invite` - Invite member
- `/org/incidents` - View incidents
- `/org/dispatch` - Dispatch center
- `/org/settings` - Organization settings
