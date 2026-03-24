# API Specification

**Document Title:** API Specification
**Version:** 1.0
**Date:** 2026-03-13
**Author:** Jan Dave Zamora
**Status:** Draft
**Related Documents:** 
- technical-architecture.md
- unified-data-dictionary.md

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-13 | Jan Dave Zamora | Initial version |
| 1.1 | 2026-03-13 | Jan Dave Zamora | Added Supabase PostGIS, SMS/USSD, Silent SOS, Cloudflare R2 endpoints |
| 1.2 | 2026-03-13 | Jan Dave Zamora | Added Agency API section, updated User role to object, fixed section numbering |
| 1.3 | 2026-03-13 | Jan Dave Zamora | Added Organization API (hierarchical structure), updated section numbering |
| 1.4 | 2026-03-13 | Jan Dave Zamora | Updated registration flow: Citizens self-register, First Aiders/Responders registered by Organizations |
| 1.5 | 2026-03-13 | Jan Dave Zamora | Added Organization API with availability management, schedule management for Responders |
| 1.6 | 2026-03-19 | Jan Dave Zamora | Added POST /auth/login (email+password). Added org membership invite/revoke endpoints. Added citizen membership accept/decline endpoints. Roles now returned as array. |
| 1.7 | 2026-03-19 | Jan Dave Zamora | Added allowed_roles to org creation. Updated auth on membership endpoints (OrgAdminGuard). Added responder_type to invite/member responses. Added promote member, create dispatcher staff, sub-organization endpoints. Fixed auth descriptions (DISPATCHER → ORG_ADMIN). |
| 1.8 | 2026-03-19 | Jan Dave Zamora | Added optional initial_admin to POST /organizations and POST /organizations/:id/sub-organizations — creates the first ORG_ADMIN account in one call. |
| 1.9 | 2026-03-19 | Jan Dave Zamora | GET /organizations now requires auth (JwtAuthGuard). Added type and level query filters. |

---

## 1. Overview

This document defines the REST API specification for the Toyota Emergency Response Platform. All endpoints follow RESTful conventions and return JSON responses.

### Authentication Note

This API uses **custom JWT authentication** (not Supabase Auth). Tokens are issued via the Authentication API (Section 3) and must be included in the `Authorization` header for all protected endpoints.

---

## 2. Base URL & Headers

### 2.1 Base URLs

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:3000/api` |
| Staging | `https://staging-api.emergency.ph/api` |
| Production | `https://api.emergency.ph/api` |

### 2.2 Request Headers

```
Content-Type: application/json
Authorization: Bearer <access_token>
X-Request-ID: <uuid>
X-Device-ID: <device_uuid>
X-Platform: <ios|android|web>
X-App-Version: 1.0.0
```

### 2.3 Response Headers

```
Content-Type: application/json
X-Request-ID: <uuid>
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

---

## 3. Authentication API

### 3.1 Send OTP

```
POST /auth/otp/send
```

**Request:**
```json
{
  "phone": "+639123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expires_in": 300
}
```

### 3.2 Verify OTP

```
POST /auth/otp/verify
```

**Request:**
```json
{
  "phone": "+639123456789",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1...",
  "refresh_token": "eyJhbGciOiJIUzI1...",
  "expires_in": 3600,
  "user": {
    "id": "user-uuid",
    "phone": "+639123456789",
    "role": "CITIZEN"
  }
}
```

### 3.3 Refresh Token

```
POST /auth/refresh
```

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1..."
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1...",
  "expires_in": 3600
}
```

### 3.4 Login (Email + Password)

> Used by all actors: Citizens, Responders, Org Admins (DISPATCHER), and System Admin (ADMIN).
> Same endpoint for everyone — the JWT `roles` array determines access.

```
POST /auth/login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1...",
  "refresh_token": "eyJhbGciOiJIUzI1...",
  "expires_at": "2026-03-19T11:00:00Z",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "roles": ["CITIZEN"]
  }
}
```

> **JWT roles examples:**
> - Citizen: `"roles": ["CITIZEN"]`
> - Responder accepted into PNP: `"roles": ["CITIZEN", "RESPONDER"]`
> - Org Admin (DISPATCHER): `"roles": ["CITIZEN", "DISPATCHER"]`
> - System Admin: `"roles": ["ADMIN"]`

---

### 3.5 Register (Citizen Self-Registration)

```
POST /auth/register
```

**Request:**
```json
{
  "phone": "+639123456789",
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "Juan",
  "last_name": "Dela Cruz"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-uuid",
    "phone": "+639123456789",
    "email": "user@example.com",
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "role": "CITIZEN"
  }
}
```

---

## 4. User API

### 4.1 Get Current User

```
GET /users/me
```

**Response:**
```json
{
  "id": "user-uuid",
  "phone": "+639123456789",
  "email": "user@example.com",
  "first_name": "Juan",
  "last_name": "Dela Cruz",
  "role": {
    "primary": "CITIZEN",
    "is_first_aider": true,
    "first_aider_profession": "NURSE",
    "first_aider_license": "PRC-123456",
    "is_verified_first_aider": true
  },
  "emergency_contacts": [
    {
      "id": "contact-uuid-1",
      "name": "Maria Dela Cruz",
      "phone": "+639123456789",
      "relationship": "Spouse",
      "is_primary": true
    },
    {
      "id": "contact-uuid-2",
      "name": "Pedro Zamora",
      "phone": "+639987654321",
      "relationship": "Friend",
      "is_primary": false
    }
  ],
  "profile_image_url": "https://...",
  "is_verified": true,
  "created_at": "2026-01-01T00:00:00Z"
}
```

### 4.2 Update Profile

```
PUT /users/me
```

**Request:**
```json
{
  "first_name": "Juan",
  "last_name": "Dela Cruz",
  "profile_image_url": "https://..."
}
```

### 4.3 Get Emergency Contacts

```
GET /users/me/emergency-contacts
```

**Response:**
```json
{
  "data": [
    {
      "id": "contact-uuid-1",
      "name": "Maria Dela Cruz",
      "phone": "+639123456789",
      "relationship": "Spouse",
      "is_primary": true
    },
    {
      "id": "contact-uuid-2",
      "name": "Pedro Zamora",
      "phone": "+639987654321",
      "relationship": "Friend",
      "is_primary": false
    },
    {
      "id": "contact-uuid-3",
      "name": "Juan Luna",
      "phone": "+639555123456",
      "relationship": "Colleague",
      "is_primary": false
    }
  ],
  "total": 3,
  "primary_contact_id": "contact-uuid-1"
}

### 4.4 Add Emergency Contact

```
POST /users/me/emergency-contacts
```

**Request:**
```json
{
  "name": "Maria Dela Cruz",
  "phone": "+639123456789",
  "relationship": "Spouse",
  "is_primary": true
}
```

### 4.5 Update Emergency Contact

```
PUT /users/me/emergency-contacts/{id}
```

**Request:**
```json
{
  "name": "Maria Updated",
  "phone": "+639123456789",
  "relationship": "Parent",
  "is_primary": false
}
```

**Response:**
```json
{
  "id": "contact-uuid",
  "name": "Maria Updated",
  "phone": "+639123456789",
  "relationship": "Parent",
  "is_primary": false,
  "updated_at": "2026-03-13T10:30:00Z"
}
```

### 4.6 Delete Emergency Contact

```
DELETE /users/me/emergency-contacts/{id}
```

### 4.7 Get Relationship Types

```
GET /users/relationship-types
```

**Response:**
```json
{
  "data": [
    { "id": "spouse", "name": "Spouse" },
    { "id": "parent", "name": "Parent" },
    { "id": "child", "name": "Child" },
    { "id": "sibling", "name": "Sibling" },
    { "id": "friend", "name": "Friend" },
    { "id": "colleague", "name": "Colleague" },
    { "id": "neighbor", "name": "Neighbor" },
    { "id": "other", "name": "Other" }
  ]
}
```

### 4.8 Notify Emergency Contacts

```
POST /users/me/emergency-contacts/notify
```

**Request:**
```json
{
  "incident_id": "EMG-2026-0142",
  "message": "I have reported an emergency and need help"
}
```

**Response:**
```json
{
  "success": true,
  "notified": ["contact-1", "contact-2"],
  "failed": []
}
```

---

## 5. Public Emergency Contacts API

### 5.1 Get Emergency Hotlines

```
GET /public/emergency-contacts
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| region | string | Filter by region (e.g., NCR, CALABARZON) |
| city | string | Filter by city |

**Response:**
```json
{
  "data": [
    {
      "id": "hotline-uuid",
      "name": "PNP Emergency Hotline",
      "type": "POLICE",
      "phone": "911",
      "region": "NCR",
      "city": "Manila",
      "is_24h": true
    },
    {
      "id": "hotline-uuid",
      "name": "BFP Fire Hotline",
      "type": "FIRE",
      "phone": "911",
      "region": "NCR",
      "city": "Manila",
      "is_24h": true
    },
    {
      "id": "hotline-uuid",
      "name": "RDRRMC Central Visayas",
      "type": "AMBULANCE",
      "phone": "(032) 123-4567",
      "region": "Region VII",
      "city": "Cebu City",
      "is_24h": true
    }
  ]
}
```

### 5.2 Get Emergency Contact by Type

```
GET /public/emergency-contacts/type/{type}
```

**Types:** `POLICE`, `AMBULANCE`, `FIRE`, `DISASTER`

```
GET /public/emergency-contacts/type/POLICE
```

### 5.3 Search Emergency Contacts

```
GET /public/emergency-contacts/search?q=Manila
```

---

## 6. Incident API

### 6.1 Create Incident Report

```
POST /incidents
```

**Request:**
```json
{
  "type": "MEDICAL",
  "title": "Road accident victim",
  "description": "Man lying on road, bleeding from head",
  "latitude": 14.5995,
  "longitude": 120.9842,
  "address": "Taft Avenue, Manila",
  "landmark": "Near 7-Eleven",
  "is_silent": false,
  "is_anonymous": false,
  "reporter_id": "user-uuid"
}
```

**Response:**
```json
{
  "id": "EMG-2026-0142",
  "type": "MEDICAL",
  "title": "Road accident victim",
  "status": "RECEIVED",
  "priority": "HIGH",
  "reported_at": "2026-03-13T10:30:00Z",
  "location": {
    "latitude": 14.5995,
    "longitude": 120.9842,
    "address": "Taft Avenue, Manila"
  }
}
```

### 6.2 Get Incident

```
GET /incidents/{id}
```

**Response:**
```json
{
  "id": "EMG-2026-0142",
  "type": "MEDICAL",
  "title": "Road accident victim",
  "description": "Man lying on road, bleeding from head",
  "status": "DISPATCHED",
  "priority": "HIGH",
  "is_silent": false,
  "is_multi_agency": true,
  "location": {
    "latitude": 14.5995,
    "longitude": 120.9842,
    "address": "Taft Avenue, Manila",
    "landmark": "Near 7-Eleven"
  },
  "reporter": {
    "id": "user-uuid",
    "name": "Maria Santos",
    "phone": "+639123456789"
  },
  "dispatched_responders": [
    {
      "id": "responder-uuid",
      "name": "Sgt. Juan Dela Cruz",
      "agency": "PNP",
      "status": "EN_ROUTE",
      "eta_minutes": 5
    }
  ],
  "timeline": [
    {
      "action": "CREATED",
      "timestamp": "2026-03-13T10:30:00Z",
      "actor": "Maria Santos"
    },
    {
      "action": "DISPATCHED",
      "timestamp": "2026-03-13T10:30:15Z",
      "actor": "System"
    }
  ],
  "reported_at": "2026-03-13T10:30:00Z",
  "dispatched_at": "2026-03-13T10:30:15Z"
}
```

### 6.3 Get Active Incidents

```
GET /incidents?status=ACTIVE&latitude=14.5995&longitude=120.9842&radius=5
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | RECEIVED, DISPATCHED, EN_ROUTE, ON_SCENE |
| type | string | MEDICAL, FIRE, POLICE, TRAFFIC, DISASTER |
| latitude | number | User latitude |
| longitude | number | User longitude |
| radius | number | Search radius in km |
| page | number | Page number |
| limit | number | Items per page (default 20) |

### 6.4 Update Incident Status

```
PUT /incidents/{id}/status
```

**Request:**
```json
{
  "status": "RESOLVED",
  "notes": "Patient transported to hospital"
}
```

### 6.5 Get Incident Timeline

```
GET /incidents/{id}/timeline
```

### 6.6 Add Incident Comment

```
POST /incidents/{id}/comments
```

**Request:**
```json
{
  "content": "Additional information about the incident"
}
```

### 6.7 Cancel Incident

```
POST /incidents/{id}/cancel
```

**Request:**
```json
{
  "reason": "False report - resolved itself"
}
```

---

## 7. Organization API

### 7.1 Create Organization (System Admin only)

```
POST /organizations
```

> **Auth:** Requires `ADMIN` role (System Admin). The System Admin account is seeded — no public registration.
> Creates a top-level organization (e.g., PNP, BFP). Sub-org creation is handled by Org Admins via `POST /organizations/:id/sub-organizations`.

**Request:**
```json
{
  "name": "Philippine National Police",
  "short_name": "PNP",
  "code": "PNP",
  "type": "POLICE",
  "level": "NATIONAL",
  "address": "Camp Crame, Quezon City",
  "phone": "+63287211111",
  "website": "https://pnp.gov.ph",
  "allowed_roles": ["RESPONDER", "DISPATCHER"],
  "initial_admin": {
    "first_name": "Maria",
    "last_name": "Santos",
    "email": "admin@pnp.gov.ph",
    "phone": "+639171234567",
    "password": "TemporaryPass123!"
  }
}
```

> `allowed_roles` defines which roles this org may grant to members. Must be a non-empty subset of what the org type permits (see Permission Matrix in data dictionary). `ORG_ADMIN` is never in `allowed_roles` — it is granted via the promote endpoint only.

> `initial_admin` is optional. When provided, a new user account is created and immediately added as an ACTIVE `ORG_ADMIN` member of the organization in one atomic call. The email uniqueness check runs **before** the org is created, so a conflicting email fails the entire request. Omit `initial_admin` if you plan to appoint the ORG_ADMIN separately via `POST /organizations/:id/members/invite`.

**Response:** `201 Created` — organization object (same as `GET /organizations/:id`).

**Errors:**
- `400` — validation error (missing required field, invalid enum, etc.)
- `401` — missing or invalid JWT
- `403` — ADMIN role required
- `409` — organization code already exists, or `initial_admin.email` already in use

### 7.3 List Organizations

```
GET /organizations
```

**Auth:** Requires valid JWT (`JwtAuthGuard`)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page, max 100 (default: 10) |
| type | string | Filter by type: `POLICE`, `AMBULANCE`, `FIRE`, `LGU`, `OCD`, `COAST_GUARD`, `BARANGAY`, `PRIVATE` |
| level | string | Filter by level: `NATIONAL`, `REGIONAL`, `PROVINCIAL`, `CITY`, `MUNICIPAL`, `BARANGAY` |

Only `is_active = true` organizations are returned.

### 7.4 Get Organization Details

```
GET /organizations/{id}
```

### 7.5 Get Organization Hierarchy

```
GET /organizations/{id}/hierarchy
```

### 7.6 Get Responders by Organization

```
GET /organizations/{id}/responders
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| include_children | boolean | Include responders from child organizations |
| status | string | Filter: AVAILABLE, BUSY, OFF_DUTY, EN_ROUTE, ON_SCENE |

**Response:**
```json
{
  "data": [
    {
      "id": "responder-uuid",
      "user_id": "user-uuid",
      "name": "Sgt. Juan Dela Cruz",
      "badge_number": "PNP-12345",
      "rank": "Sergeant",
      "unit": "Mobile Force Company",
      "status": "AVAILABLE",
      "current_incident_id": null,
      "last_location_update": "2026-03-13T10:30:00Z"
    }
  ],
  "statistics": {
    "total": 50,
    "available": 25,
    "busy": 15,
    "off_duty": 10
  }
}
```

### 7.7 Manage Responder Availability (Organization Admin)

```
PUT /organizations/{id}/responders/{responder_id}/availability
```

**Request:**
```json
{
  "status": "AVAILABLE",
  "reason": "Starting shift",
  "effective_from": "2026-03-13T06:00:00Z"
}
```

### 7.8 Get Available Responders

```
GET /organizations/{id}/responders/available
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | POLICE, FIRE, AMBULANCE |
| unit | string | Filter by unit |
| radius_km | number | Within distance |

**Response:**
```json
{
  "data": [
    {
      "id": "responder-uuid",
      "name": "Sgt. Juan Dela Cruz",
      "badge_number": "PNP-12345",
      "unit": "Mobile Force Company",
      "distance_km": 1.5,
      "eta_minutes": 5,
      "current_status": "AVAILABLE"
    }
  ]
}
```

### 7.9 Register First Aider (Organization Admin)

```
POST /organizations/{id}/first-aiders
```

> Organizations (hospitals, Red Cross) register their staff as First Aiders.

**Request:**
```json
{
  "user_id": "user-uuid",
  "profession": "NURSE",
  "license_number": "PRC-123456",
  "license_expiry": "2027-12-31",
  "max_distance_km": 5,
  "specializations": ["ICU", "ER"]
}
```

### 7.10 Register Responder (Organization Admin)

```
POST /organizations/{id}/responders
```

> Organizations (PNP, BFP) register their staff as Responders.

**Request:**
```json
{
  "user_id": "user-uuid",
  "badge_number": "PNP-12345",
  "rank": "Sergeant",
  "unit": "Mobile Force Company"
}
```

### 7.11 Update Responder

```
PUT /organizations/{id}/responders/{responder_id}
```

### 7.12 Remove Responder

```
DELETE /organizations/{id}/responders/{responder_id}
```

---

### 7.13 Invite Member (System Admin or Org Admin)

> **The primary way citizens join an organization.** Citizens cannot apply — only a System Admin or an active ORG_ADMIN of the org can invite.
> System Admin uses this to appoint the first ORG_ADMIN of a newly created org.
> Org Admin invites citizens as `RESPONDER` or `DISPATCHER` only — `ORG_ADMIN` is not grantable via invite.

```
POST /organizations/{id}/members/invite
```

**Auth:** `ADMIN` system role OR active `ORG_ADMIN` membership in this org (`OrgAdminGuard`)

**Request:**
```json
{
  "user_id": "user-uuid",
  "org_role": "RESPONDER",
  "responder_type": null
}
```

> `responder_type` is a string stored at invite time. Valid values are scoped per org type:
> - `POLICE` → `PATROL_OFFICER`, `DETECTIVE`, `SWAT`, `K9_OFFICER`, `TRAFFIC_OFFICER`
> - `FIRE` → `FIREFIGHTER`, `FIRE_INVESTIGATOR`, `HAZMAT_SPECIALIST`, `RESCUE_TECHNICIAN`
> - `AMBULANCE` → `PARAMEDIC`, `EMT`, `NURSE`, `DOCTOR`
> - `COAST_GUARD` → `RESCUE_SWIMMER`, `BOAT_OPERATOR`, `AVIATION_RESCUE`, `MARITIME_OFFICER`
> - `BARANGAY` → `TANOD`, `HEALTH_WORKER`, `DISASTER_VOLUNTEER`
> - `LGU` → `DISASTER_COORDINATOR`, `RELIEF_COORDINATOR`, `HEALTH_OFFICER`
> - `OCD` → `DISASTER_COORDINATOR`, `EMERGENCY_MANAGER`, `LOGISTICS_OFFICER`
> - `PRIVATE` → `SECURITY_OFFICER`, `FIRST_AIDER`, `SAFETY_OFFICER` — **required**, no default
>
> `FIRST_AIDER` may be used in any org for Red Cross chapters / BHW volunteers.

**Response:**
```json
{
  "id": "member-uuid",
  "user_id": "user-uuid",
  "organization_id": "org-uuid",
  "org_type": "POLICE",
  "org_role": "RESPONDER",
  "responder_type": "POLICE",
  "status": "INVITED",
  "invited_by": "admin-user-uuid",
  "created_at": "2026-03-19T10:00:00Z",
  "updated_at": "2026-03-19T10:00:00Z",
  "user": {
    "id": "user-uuid",
    "email": "juan@example.com",
    "first_name": "Juan",
    "last_name": "Dela Cruz"
  }
}
```

**Errors:**
- `400` — `responder_type` required for `PRIVATE` org but not supplied
- `400` — `responder_type` value not valid for this org type
- `400` — requested `org_role` not in this org's `allowed_roles`
- `401` — missing or invalid JWT
- `403` — requester is not ORG_ADMIN of this org and not System ADMIN
- `404` — target user not found or inactive
- `409` — user already has INVITED or ACTIVE membership in this org

---

### 7.14 List Members (Org Admin)

```
GET /organizations/{id}/members
```

**Auth:** `ADMIN` system role OR active `ORG_ADMIN` membership in this org (`OrgAdminGuard`)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter: `INVITED`, `ACTIVE`, `DECLINED`, `SUSPENDED`. Omit for all. |

**Response:**
```json
[
  {
    "id": "member-uuid",
    "user_id": "user-uuid",
    "organization_id": "org-uuid",
    "org_role": "RESPONDER",
    "org_type": "POLICE",
    "responder_type": "POLICE",
    "status": "ACTIVE",
    "invited_by": "admin-uuid",
    "reason": null,
    "created_at": "2026-03-19T10:00:00Z",
    "updated_at": "2026-03-19T10:00:00Z",
    "user": {
      "id": "user-uuid",
      "email": "juan@example.com",
      "first_name": "Juan",
      "last_name": "Dela Cruz",
      "phone": "+639171234567",
      "profile_image_url": null
    }
  }
]
```

---

### 7.15 Revoke Member (Org Admin)

```
PUT /organizations/{id}/members/{memberId}/revoke
```

**Auth:** `ADMIN` system role OR active `ORG_ADMIN` membership in this org (`OrgAdminGuard`)

**Request:**
```json
{
  "reason": "No longer part of the unit"
}
```

**Response:**
```json
{
  "id": "member-uuid",
  "status": "SUSPENDED",
  "reason": "No longer part of the unit",
  "updated_at": "2026-03-19T12:00:00Z"
}
```

> **Side effect:** If the user has no other ACTIVE memberships with the same `org_role`, the global role is removed from `user_roles`.

---

### 7.16 Promote Member (Org Admin)

```
PUT /organizations/{id}/members/{memberId}/promote
```

**Auth:** `ADMIN` system role OR active `ORG_ADMIN` membership in this org (`OrgAdminGuard`)

> Changes the `org_role` of an ACTIVE member. Only `DISPATCHER` and `ORG_ADMIN` are valid promotion targets.
> `responder_type` is cleared on promotion — DISPATCHER and ORG_ADMIN members do not field-respond.

**Request:**
```json
{
  "org_role": "ORG_ADMIN"
}
```

**Response:**
```json
{
  "id": "member-uuid",
  "org_role": "ORG_ADMIN",
  "responder_type": null,
  "status": "ACTIVE",
  "updated_at": "2026-03-19T12:00:00Z"
}
```

**Errors:**
- `400` — member is not ACTIVE or already has that role
- `403` — requester not ORG_ADMIN of this org and not System ADMIN
- `404` — membership not found in this organization

---

### 7.17 Create Dispatcher Staff Account (Org Admin)

```
POST /organizations/{id}/staff/dispatcher
```

**Auth:** `ADMIN` system role OR active `ORG_ADMIN` membership in this org (`OrgAdminGuard`)

> Creates a new user with the `DISPATCHER` system role and immediately adds them as an ACTIVE `DISPATCHER` member of this organization. Distinct from the invite flow — the account is created directly, not invited.

**Request:**
```json
{
  "first_name": "Maria",
  "last_name": "Santos",
  "email": "dispatcher@pnp.gov.ph",
  "phone": "+639171234567",
  "password": "TemporaryPass123!"
}
```

**Response:** `201 Created`
```json
{
  "id": "member-uuid",
  "user_id": "new-user-uuid",
  "organization_id": "org-uuid",
  "org_type": "POLICE",
  "org_role": "DISPATCHER",
  "responder_type": null,
  "status": "ACTIVE",
  "created_at": "2026-03-19T10:00:00Z",
  "updated_at": "2026-03-19T10:00:00Z",
  "user": {
    "id": "new-user-uuid",
    "email": "dispatcher@pnp.gov.ph",
    "first_name": "Maria",
    "last_name": "Santos",
    "phone": "+639171234567"
  }
}
```

**Errors:**
- `403` — requester not ORG_ADMIN of this org and not System ADMIN
- `409` — email already in use

---

### 7.18 Create Sub-Organization (Org Admin)

```
POST /organizations/{id}/sub-organizations
```

**Auth:** `ADMIN` system role OR active `ORG_ADMIN` membership in this org (`OrgAdminGuard`)

> Creates a new organization as a direct child of this one. `parent_organization_id` is automatically set to `:id`.

**Request:** Same shape as `POST /organizations` (Section 7.1) including the optional `initial_admin` field. `parent_organization_id` in the body is ignored — it is always set to `:id`.

**Response:** `201 Created` — same shape as org detail response.

**Errors:**
- `403` — requester not ORG_ADMIN of parent org and not System ADMIN
- `404` — parent organization not found
- `409` — organization code already exists

---

### 7.19 List Sub-Organizations

```
GET /organizations/{id}/sub-organizations
```

**Auth:** Public endpoint

**Response:** `200 OK` — array of organization objects (direct children only, `is_active = true`).

---

## 7B. Citizen Membership API

### 7B.1 Get My Memberships

```
GET /users/me/memberships
```

**Auth:** Any authenticated user

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter: `INVITED`, `ACTIVE`, `DECLINED`, `SUSPENDED` |

**Response:**
```json
{
  "data": [
    {
      "id": "member-uuid",
      "organization": {
        "id": "org-uuid",
        "name": "Philippine National Police",
        "type": "POLICE",
        "city": "Quezon City"
      },
      "org_role": "RESPONDER",
      "status": "INVITED",
      "invited_by": {
        "id": "admin-uuid",
        "first_name": "Maria",
        "last_name": "Santos"
      },
      "created_at": "2026-03-19T10:00:00Z"
    }
  ],
  "total": 1
}
```

---

### 7B.2 Accept Invitation

```
PUT /users/me/memberships/{id}/accept
```

**Auth:** Any authenticated user (must own this membership)

**Response:**
```json
{
  "id": "member-uuid",
  "org_role": "RESPONDER",
  "status": "ACTIVE",
  "updated_at": "2026-03-19T10:30:00Z"
}
```

> **Side effect:** If user does not yet have the global role (`RESPONDER` or `DISPATCHER`), it is inserted into `user_roles`.

---

### 7B.3 Decline Invitation

```
PUT /users/me/memberships/{id}/decline
```

**Auth:** Any authenticated user (must own this membership)

**Response:**
```json
{
  "id": "member-uuid",
  "status": "DECLINED",
  "updated_at": "2026-03-19T10:30:00Z"
}
```

> **Side effect:** None — `user_roles` unchanged, citizen retains `CITIZEN` role only.

---

## 8. Agency API ⚠️ Legacy

### 7.1 List Agencies

```
GET /agencies
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter by type: POLICE, FIRE, AMBULANCE, DISASTER |
| region | string | Filter by region |
| is_active | boolean | Filter active agencies |

**Response:**
```json
{
  "data": [
    {
      "id": "agency-uuid",
      "name": "PNP National Headquarters",
      "type": "POLICE",
      "code": "PNP",
      "region": "NCR",
      "city": "Quezon City",
      "phone": "+63287211111",
      "email": "info@pnp.gov.ph",
      "is_active": true,
      "responder_count": 150,
      "available_responders": 45
    },
    {
      "id": "agency-uuid-2",
      "name": "BFP National Headquarters",
      "type": "FIRE",
      "code": "BFP",
      "region": "NCR",
      "city": "Manila",
      "phone": "+63284261111",
      "email": "bfp@bfp.gov.ph",
      "is_active": true,
      "responder_count": 80,
      "available_responders": 20
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20
}
```

### 7.2 Get Agency Details

```
GET /agencies/{id}
```

**Response:**
```json
{
  "id": "agency-uuid",
  "name": "PNP National Headquarters",
  "type": "POLICE",
  "code": "PNP",
  "region": "NCR",
  "city": "Quezon City",
  "address": "Camp Crame, Quezon City",
  "phone": "+63287211111",
  "email": "info@pnp.gov.ph",
  "website": "https://pnp.gov.ph",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "statistics": {
    "total_incidents": 1500,
    "resolved_incidents": 1450,
    "average_response_time_minutes": 8.5,
    "total_responders": 150,
    "available_responders": 45
  }
}
```

### 7.3 Get Agency Responders

```
GET /agencies/{id}/responders
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | AVAILABLE, BUSY, OFF_DUTY |
| unit | string | Filter by unit name |

**Response:**
```json
{
  "data": [
    {
      "id": "responder-uuid",
      "user_id": "user-uuid",
      "name": "Sgt. Juan Dela Cruz",
      "badge_number": "PNP-12345",
      "rank": "Sergeant",
      "unit": "Mobile Force Company",
      "status": "AVAILABLE",
      "current_incident_id": null,
      "latitude": 14.5995,
      "longitude": 120.9842,
      "last_status_update": "2026-03-13T10:30:00Z"
    }
  ],
  "total": 1
}
```

### 7.4 Add Responder (Agency Admin)

```
POST /agencies/{id}/responders
```

**Request:**
```json
{
  "user_id": "user-uuid",
  "badge_number": "PNP-12345",
  "rank": "Sergeant",
  "unit": "Mobile Force Company",
  "status": "AVAILABLE"
}
```

**Response:**
```json
{
  "id": "responder-uuid",
  "agency_id": "agency-uuid",
  "user_id": "user-uuid",
  "name": "Sgt. Juan Dela Cruz",
  "badge_number": "PNP-12345",
  "rank": "Sergeant",
  "unit": "Mobile Force Company",
  "status": "AVAILABLE",
  "created_at": "2026-03-13T10:30:00Z"
}
```

### 7.5 Update Responder (Agency Admin)

```
PUT /agencies/{id}/responders/{responder_id}
```

**Request:**
```json
{
  "rank": "Staff Sergeant",
  "unit": "Special Action Force",
  "status": "OFF_DUTY"
}
```

### 7.6 Remove Responder (Agency Admin)

```
DELETE /agencies/{id}/responders/{responder_id}
```

### 7.7 Get Agency Incidents

```
GET /agencies/{id}/incidents
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | RECEIVED, DISPATCHED, EN_ROUTE, ON_SCENE, RESOLVED |
| date_from | date | Filter from date |
| date_to | date | Filter to date |

### 7.8 Get Agency Statistics

```
GET /agencies/{id}/statistics
```

**Response:**
```json
{
  "today": {
    "incidents_handled": 15,
    "responders_deployed": 25,
    "average_response_time_minutes": 7.2
  },
  "this_week": {
    "incidents_handled": 95,
    "responders_deployed": 150,
    "average_response_time_minutes": 8.1
  },
  "this_month": {
    "incidents_handled": 420,
    "responders_deployed": 680,
    "average_response_time_minutes": 8.5
  }
}
```

### 7.9 Agency Admin Management

```
POST /agencies/{id}/admins
```

**Request:**
```json
{
  "user_id": "user-uuid",
  "role": "ADMIN"
}
```

---

## 9. Responder API

### 8.1 Get Available Incidents

```
GET /responders/incidents?latitude=14.5995&longitude=120.9842&type=MEDICAL
```

### 8.2 Accept Dispatch

```
POST /dispatch/{dispatch_id}/accept
```

### 8.3 Decline Dispatch

```
POST /dispatch/{dispatch_id}/decline
```

**Request:**
```json
{
  "reason": "Currently handling another incident"
}
```

### 8.4 Update My Availability Status

```
PUT /responders/me/status
```

> **Note:** Responder can only set to AVAILABLE or OFF_DUTY. Other statuses (EN_ROUTE, ON_SCENE) are set by the system during dispatch.

**Request:**
```json
{
  "status": "AVAILABLE",
  "latitude": 14.5995,
  "longitude": 120.9842
}
```

Or to go off duty:
```json
{
  "status": "OFF_DUTY"
}
```

**Response:**
```json
{
  "id": "responder-uuid",
  "user_id": "user-uuid",
  "status": "AVAILABLE",
  "current_incident_id": null,
  "last_status_update": "2026-03-13T10:30:00Z",
  "next_available_at": null
}
```

### 8.5 Get My Availability Schedule

```
GET /responders/me/schedule
```

**Response:**
```json
{
  "data": [
    {
      "day_of_week": "MONDAY",
      "shift_type": "REGULAR",
      "start_time": "06:00",
      "end_time": "18:00",
      "is_active": true
    },
    {
      "day_of_week": "TUESDAY",
      "shift_type": "REGULAR",
      "start_time": "06:00",
      "end_time": "18:00",
      "is_active": true
    }
  ],
  "current_shift": {
    "day_of_week": "FRIDAY",
    "shift_type": "REGULAR",
    "start_time": "06:00",
    "end_time": "18:00",
    "is_active": true
  },
  "is_on_duty": true
}
```

### 8.6 Set My Availability Schedule

```
PUT /responders/me/schedule
```

**Request:**
```json
{
  "schedules": [
    {
      "day_of_week": "MONDAY",
      "shift_type": "REGULAR",
      "start_time": "06:00",
      "end_time": "18:00",
      "is_active": true
    },
    {
      "day_of_week": "TUESDAY",
      "shift_type": "REGULAR",
      "start_time": "06:00",
      "end_time": "18:00",
      "is_active": true
    }
  ]
}
```

### 8.7 Update Location

```
PUT /responders/me/location
```

**Request:**
```json
{
  "latitude": 14.5995,
  "longitude": 120.9842,
  "accuracy": 5,
  "altitude": 10,
  "speed": 30,
  "heading": 180
}
```

### 8.6 Request Backup

```
POST /incidents/{id}/backup
```

**Request:**
```json
{
  "reason": "Need additional units",
  "agency_type": "POLICE"
}
```

---

## 10. First Aider API

### 7.1 Register as First Aider

```
POST /first-aiders/register
```

**Request:**
```json
{
  "profession": "NURSE",
  "license_number": "PRC-123456",
  "license_expiry": "2027-12-31",
  "max_distance_km": 5,
  "specializations": ["ICU", "ER"]
}
```

### 7.2 Get First Aider Incidents

```
GET /first-aiders/incidents?latitude=14.5995&longitude=120.9842
```

### 7.3 Respond to Incident

```
POST /first-aiders/incidents/{id}/respond
```

### 7.4 Decline to Respond

```
POST /first-aiders/incidents/{id}/decline
```

---

## 11. Dispatcher API

### 10.1 Get All Active Incidents

```
GET /dispatcher/incidents?status=ACTIVE
```

### 10.2 Get All Responders

```
GET /dispatcher/responders?agency=PNP&status=AVAILABLE
```

### 10.3 Manual Dispatch

```
POST /dispatcher/incidents/{id}/dispatch
```

**Request:**
```json
{
  "responder_ids": ["responder-1", "responder-2"],
  "notes": "Priority dispatch"
}
```

### 10.4 Escalate Incident

```
POST /dispatcher/incidents/{id}/escalate
```

**Request:**
```json
{
  "additional_agencies": ["AMBULANCE", "FIRE"]
}
```

### 10.5 Transfer Command

```
POST /dispatcher/incidents/{id}/transfer-command
```

**Request:**
```json
{
  "new_commander_id": "responder-uuid",
  "reason": "Medical priority - patient condition critical"
}
```

---

## 12. Notification API

### 11.1 Get Notifications

```
GET /notifications?limit=20&unread=true
```

### 11.2 Mark as Read

```
PUT /notifications/{id}/read
```

### 11.3 Update Notification Preferences

```
PUT /users/me/notification-preferences
```

**Request:**
```json
{
  "push_enabled": true,
  "sms_enabled": true,
  "first_aider_alerts": true,
  "silent_sos_enabled": true
}
```

---

## 13. Message/Chat API

### 12.1 Get Messages

```
GET /incidents/{id}/messages
```

### 12.2 Send Message

```
POST /incidents/{id}/messages
```

**Request:**
```json
{
  "content": "On my way, ETA 5 minutes",
  "type": "TEXT"
}
```

---

## 14. Media API

### 13.1 Upload Media

```
POST /incidents/{id}/media
```

**Request:** multipart/form-data

**Response:**
```json
{
  "id": "media-uuid",
  "url": "https://storage.emergency.ph/media/xxx.jpg",
  "type": "IMAGE"
}
```

### 13.2 Get Media

```
GET /media/{id}
```

---

## 15. Broadcast API

### 14.1 Create Broadcast

```
POST /broadcasts
```

**Request:**
```json
{
  "type": "EVACUATION",
  "title": "Flood Warning",
  "message": "All residents in low-lying areas must evacuate immediately",
  "recipient_type": "LOCATION_BASED",
  "latitude": 14.5995,
  "longitude": 120.9842,
  "radius_km": 5
}
```

### 14.2 Get Broadcast Status

```
GET /broadcasts/{id}
```

---

## 16. Location API

### 15.1 Reverse Geocode

```
GET /location/reverse?latitude=14.5995&longitude=120.9842
```

### 15.2 Geocode Address

```
GET /location/geocode?address=Taft+Avenue+Manila
```

### 15.3 Get Directions

```
GET /location/directions?origin_lat=14.5&origin_lng=120.9&dest_lat=14.6&dest_lng=121.0
```

---

## 17. Supabase PostGIS API

### 16.1 Find Nearby Incidents (PostGIS RPC)

```
POST /rpc/find_nearby_incidents
```

**Request:**
```json
{
  "lat": 14.5995,
  "lng": 120.9842,
  "radius_km": 5,
  "status_filter": ["RECEIVED", "DISPATCHED"]
}
```

**Response:**
```json
{
  "data": [
    {
      "id": "EMG-2026-0142",
      "type": "MEDICAL",
      "distance_km": 0.8,
      "status": "DISPATCHED"
    }
  ]
}
```

### 16.2 Find Nearby Responders (PostGIS RPC)

```
POST /rpc/find_nearby_responders
```

**Request:**
```json
{
  "lat": 14.5995,
  "lng": 120.9842,
  "radius_km": 10,
  "agency_type": "AMBULANCE",
  "status": "AVAILABLE"
}
```

### 16.3 Find Nearby First Aiders (PostGIS RPC)

```
POST /rpc/find_nearby_first_aiders
```

**Request:**
```json
{
  "lat": 14.5995,
  "lng": 120.9842,
  "radius_km": 5,
  "profession": "NURSE"
}
```

### 16.4 Get Incidents in Polygon (PostGIS)

```
POST /rpc/find_incidents_in_area
```

**Request:**
```json
{
  "polygon": [[120.9, 14.5], [121.0, 14.5], [121.0, 14.6], [120.9, 14.6]],
  "start_date": "2026-01-01",
  "end_date": "2026-03-13"
}
```

### 16.5 Get Heat Map Data (PostGIS)

```
POST /rpc/get_incidents_heatmap
```

**Request:**
```json
{
  "incident_type": "MEDICAL",
  "start_date": "2026-01-01",
  "end_date": "2026-03-13",
  "grid_size_km": 1
}
```

---

## 18. SMS/USSD API

### 17.1 Receive Incoming SMS (Webhook)

```
POST /sms/webhook
```

**Request (from SMS Gateway):**
```json
{
  "from": "+639123456789",
  "to": "911TOYOTA",
  "message": "AMBULANCE Taft Avenue Manila",
  "timestamp": "2026-03-13T10:30:00Z"
}
```

**Internal Processing:**
- Parse emergency type
- Extract location
- Create incident

**Response to Gateway:**
```json
{
  "success": true,
  "message_id": "sms-uuid"
}
```

### 17.2 Send SMS to User

```
POST /sms/send
```

**Request:**
```json
{
  "to": "+639123456789",
  "template": "EMERGENCY_CONFIRMATION",
  "data": {
    "incident_id": "EMG-2026-0142",
    "type": "Medical Emergency",
    "eta": "8 minutes"
  }
}
```

### 17.3 Get SMS Delivery Status

```
GET /sms/{message_id}/status
```

### 17.4 USSD Session Start (Webhook)

```
POST /ussd/session
```

**Request:**
```json
{
  "session_id": "ussd-session-uuid",
  "phone_number": "+639123456789",
  "ussd_code": "*123#"
}
```

### 17.5 USSD Input (Webhook)

```
POST /ussd/input
```

**Request:**
```json
{
  "session_id": "ussd-session-uuid",
  "input": "1",
  "step": "MENU_MAIN"
}
```

### 17.6 SMS Command Parser

```
POST /sms/parse
```

**Request:**
```json
{
  "message": "AMBULANCE Taft Ave Manila man having chest pain"
}
```

**Response:**
```json
{
  "type": "MEDICAL",
  "location": "Taft Avenue, Manila",
  "description": "man having chest pain",
  "confidence": 0.95
}
```

---

## 19. Silent SOS API

### 18.1 Activate Silent SOS

```
POST /silent-sos/activate
```

**Request:**
```json
{
  "user_id": "user-uuid",
  "latitude": 14.5995,
  "longitude": 120.9842,
  "accuracy": 5,
  "battery_level": 34,
  "network_type": "4G",
  "trigger_method": "LONG_PRESS_POWER",
  "include_location_updates": true
}
```

**Response:**
```json
{
  "success": true,
  "incident_id": "SILENT-2026-0142",
  "message": "Emergency services dispatched silently"
}
```

### 18.2 Update Silent SOS Location

```
PUT /silent-sos/{incident_id}/location
```

**Request:**
```json
{
  "latitude": 14.6000,
  "longitude": 120.9850,
  "accuracy": 5,
  "movement_status": "MOVING",
  "direction": "NORTHBOUND"
}
```

### 18.3 Confirm Safety (Post-Incident)

```
POST /silent-sos/{incident_id}/confirm
```

**Request:**
```json
{
  "status": "SAFE",
  "method": "APP"
}
```

### 18.4 Cancel Silent SOS (False Alarm)

```
POST /silent-sos/{incident_id}/cancel
```

**Request:**
```json
{
  "reason": "Accidental activation"
}
```

### 18.5 Get Silent SOS Status

```
GET /silent-sos/{incident_id}/status
```

**Response:**
```json
{
  "incident_id": "SILENT-2026-0142",
  "status": "ACTIVE",
  "location": {
    "latitude": 14.6000,
    "longitude": 120.9850,
    "last_update": "2026-03-13T10:35:00Z",
    "movement_status": "MOVING"
  },
  "responders_notified": ["responder-1", "responder-2"]
}
```

---

## 20. Storage API (Cloudflare R2)

### 19.1 Get Upload URL

```
POST /storage/upload-url
```

**Request:**
```json
{
  "file_name": "photo.jpg",
  "content_type": "image/jpeg",
  "folder": "incidents/2026-03"
}
```

**Response:**
```json
{
  "upload_url": "https://storage.emergency.ph/upload/xxx",
  "file_url": "https://storage.emergency.ph/files/photo.jpg",
  "expires_at": "2026-03-13T10:35:00Z"
}
```

### 19.2 Confirm Upload

```
POST /storage/{file_id}/confirm
```

**Request:**
```json
{
  "incident_id": "EMG-2026-0142",
  "upload_type": "EVIDENCE"
}
```

### 19.3 Get File

```
GET /storage/{file_id}
```

### 19.4 Delete File

```
DELETE /storage/{file_id}
```

---

## 21. Report/Analytics API

### 20.1 Get Dashboard Stats

```
GET /reports/dashboard?date_from=2026-01-01&date_to=2026-03-13
```

**Response:**
```json
{
  "total_incidents": 1250,
  "by_type": {
    "MEDICAL": 650,
    "FIRE": 200,
    "POLICE": 300,
    "TRAFFIC": 100
  },
  "average_response_time_minutes": 8.5,
  "resolved_count": 1180,
  "false_report_count": 45
}
```

### 20.2 Get Response Time Report

```
GET /reports/response-time?group_by=day&date_from=2026-01-01&date_to=2026-03-13
```

### 20.3 Get Heat Map Data

```
GET /reports/heatmap?date_from=2026-01-01&date_to=2026-03-13&type=MEDICAL
```

---

## 22. WebSocket Events (Socket.io)

### 21.1 Connect

```
Socket.io Client: io('https://api.emergency.ph')
```

**Authentication:**
```javascript
io.connect('https://api.emergency.ph', {
  auth: {
    token: '<access_token>'
  }
})
```

### 21.2 Connection Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connect` | Server→Client | Successful connection |
| `disconnect` | Server→Client | Disconnected from server |
| `connect_error` | Server→Client | Connection error |

### 21.3 Client Events (Send to Server)

```javascript
// Subscribe to incident
socket.emit('incident:subscribe', { incident_id: 'EMG-2026-0142' });

// Unsubscribe from incident
socket.emit('incident:unsubscribe', { incident_id: 'EMG-2026-0142' });

// Update location
socket.emit('location:update', {
  latitude: 14.5995,
  longitude: 120.9842,
  accuracy: 5,
  incident_id: 'EMG-2026-0142'
});

// Join room (agency-specific)
socket.emit('room:join', { room: 'agency:POLICE' });

// Send chat message
socket.emit('chat:message', {
  incident_id: 'EMG-2026-0142',
  content: 'On my way, ETA 5 minutes'
});
```

### 21.4 Server Events (Receive from Server)

```javascript
// New incident alert
socket.on('incident:new', (data) => {
  // New emergency in area
});

// Incident update
socket.on('incident:update', (data) => {
  // Status changed, responder added, etc.
});

// Location update (responder)
socket.on('location:update', (data) => {
  // Responder or reporter location changed
});

// Chat message
socket.on('chat:message', (data) => {
  // New message in incident
});

// Silent SOS alert (responders only)
socket.on('sos:alert', (data) => {
  // Silent emergency nearby
});

// Broadcast alert (dispatchers)
socket.on('broadcast:alert', (data) => {
  // Mass notification received
});
```

### 21.5 Rooms & Channels

| Room | Description | Access |
|------|-------------|--------|
| `user:{user_id}` | Personal notifications | All authenticated |
| `incident:{incident_id}` | Incident-specific | Involved users |
| `agency:{agency_type}` | Agency-wide | Responders |
| `dispatcher` | Dispatchers only | Dispatchers |
| `location:{lat},{lng}` | Geographic (future) | All |

---

## 23. Error Responses

### 22.1 Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "INCIDENT_NOT_FOUND",
    "message": "Incident not found",
    "details": {}
  },
  "request_id": "req-uuid"
}
```

### 22.2 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Invalid or missing token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 422 | Invalid request body |
| RATE_LIMITED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |
| SERVICE_UNAVAILABLE | 503 | Service temporarily unavailable |

---

## 24. Rate Limits

| Endpoint | Limit |
|----------|-------|
| Authentication | 10 requests/minute |
| Create Incident | 5 requests/minute |
| General API | 60 requests/minute |
| Bulk Operations | 10 requests/minute |

---

## 25. Related Documents

- [technical-architecture.md](technical-architecture.md)
- [unified-data-dictionary.md](unified-data-dictionary.md)

---

**Document Status:** Draft
**Last Updated:** 2026-03-19

---

*This specification is part of the Toyota Emergency Response Platform project.*
