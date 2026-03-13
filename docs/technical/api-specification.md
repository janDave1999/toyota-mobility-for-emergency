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

### 3.4 Register (Citizen)

```
POST /auth/register
```

> **Note:** This endpoint creates a **CITIZEN** account only. To become a First Aider or Responder, the user must be registered by an authorized Organization.

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
  "access_token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "user-uuid",
    "phone": "+639123456789",
    "email": "user@example.com",
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "role": {
      "primary": "CITIZEN",
      "is_first_aider": false,
      "is_responder": false
    }
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
    "is_verified_first_aider": true,
    "first_aider_organization_id": "hospital-org-uuid",
    "first_aider_organization_name": "Philippine General Hospital",
    "is_responder": true,
    "responder_organization_id": "pnp-org-uuid",
    "responder_organization_name": "PNP NCR",
    "responder_badge": "PNP-12345",
    "responder_rank": "Sergeant"
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

### 6.1 Create Incident

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

### 7.1 Create Organization (Super Admin)

```
POST /organizations
```

**Request:**
```json
{
  "name": "Philippine National Police",
  "short_name": "PNP",
  "code": "PNP",
  "type": "POLICE",
  "region": null,
  "province": null,
  "city": null,
  "address": "Camp Crame, Quezon City",
  "phone": "+63287211111",
  "email": "info@pnp.gov.ph",
  "website": "https://pnp.gov.ph"
}
```

**Response:**
```json
{
  "id": "org-uuid",
  "name": "Philippine National Police",
  "short_name": "PNP",
  "code": "PNP",
  "type": "POLICE",
  "parent_id": null,
  "level": 0,
  "region": null,
  "province": null,
  "city": null,
  "address": "Camp Crame, Quezon City",
  "phone": "+63287211111",
  "email": "info@pnp.gov.ph",
  "website": "https://pnp.gov.ph",
  "is_active": true,
  "created_at": "2026-03-13T10:30:00Z"
}
```

### 7.2 Create Branch/Unit (Organization Admin)

```
POST /organizations
```

**Request (creating regional office):**
```json
{
  "name": "PNP NCR",
  "short_name": "NCR",
  "code": "PNP-NCR",
  "type": "POLICE",
  "parent_id": "org-uuid",
  "level": 1,
  "region": "NCR",
  "address": "Camp Bagong Diwa, Taguig",
  "phone": "+63288811211"
}
```

**Request (creating district):**
```json
{
  "name": "Manila Police District",
  "short_name": "MPD",
  "code": "PNP-NCR-MPD",
  "type": "POLICE",
  "parent_id": "ncr-org-uuid",
  "level": 2,
  "region": "NCR",
  "city": "Manila",
  "address": "Murall-Bretones St., Manila"
}
```

### 7.3 List Organizations

```
GET /organizations
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| parent_id | uuid | Filter by parent organization |
| level | number | Filter by level (0=national, 1=regional, 2=provincial, 3=city) |
| type | string | Filter by type |
| region | string | Filter by region |

**Response:**
```json
{
  "data": [
    {
      "id": "org-uuid",
      "name": "Philippine National Police",
      "short_name": "PNP",
      "code": "PNP",
      "type": "POLICE",
      "parent_id": null,
      "level": 0,
      "children_count": 18,
      "is_active": true
    },
    {
      "id": "ncr-org-uuid",
      "name": "PNP NCR",
      "short_name": "NCR",
      "code": "PNP-NCR",
      "type": "POLICE",
      "parent_id": "org-uuid",
      "level": 1,
      "children_count": 5,
      "is_active": true
    }
  ]
}
```

### 7.4 Get Organization Details

```
GET /organizations/{id}
```

**Response:**
```json
{
  "id": "ncr-org-uuid",
  "name": "PNP NCR",
  "short_name": "NCR",
  "code": "PNP-NCR",
  "type": "POLICE",
  "parent_id": "org-uuid",
  "parent_name": "Philippine National Police",
  "level": 1,
  "region": "NCR",
  "province": null,
  "city": null,
  "address": "Camp Bagong Diwa, Taguig",
  "phone": "+63288811211",
  "email": "ncr@pnp.gov.ph",
  "is_active": true,
  "statistics": {
    "total_responders": 450,
    "available_responders": 120,
    "total_incidents": 1250,
    "resolved_incidents": 1200
  },
  "created_at": "2026-01-01T00:00:00Z"
}
```

### 7.5 Get Organization Hierarchy

```
GET /organizations/{id}/hierarchy
```

**Response:**
```json
{
  "id": "org-uuid",
  "name": "Philippine National Police",
  "level": 0,
  "children": [
    {
      "id": "ncr-org-uuid",
      "name": "PNP NCR",
      "level": 1,
      "children": [
        {
          "id": "mpd-org-uuid",
          "name": "Manila Police District",
          "level": 2,
          "children": [
            {
              "id": "station-org-uuid",
              "name": "Station 1 - Manila",
              "level": 3,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

### 7.6 Update Organization

```
PUT /organizations/{id}
```

**Request:**
```json
{
  "name": "PNP NCR Updated",
  "phone": "+63288819999",
  "is_active": true
}
```

### 7.7 Delete Organization

```
DELETE /organizations/{id}
```

### 7.8 Get Responders by Organization

```
GET /organizations/{id}/responders
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| include_children | boolean | Include responders from child organizations |
| status | string | Filter by status |

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
      "organization_id": "station-org-uuid",
      "organization_name": "Station 1 - Manila",
      "status": "AVAILABLE"
    }
  ],
  "total": 25
}
```

### 7.9 Register First Aider (Organization Admin)

```
POST /organizations/{id}/first-aiders
```

> **Note:** Organizations (hospitals, Red Cross, etc.) register their staff as First Aiders. The user must already exist as a CITIZEN.

**Request:**
```json
{
  "user_id": "user-uuid",
  "profession": "NURSE",
  "license_number": "PRC-123456",
  "license_expiry": "2027-12-31",
  "max_distance_km": 5,
  "specializations": ["ICU", "ER"],
  "is_verified": true
}
```

**Response:**
```json
{
  "id": "first-aider-uuid",
  "user_id": "user-uuid",
  "organization_id": "org-uuid",
  "profession": "NURSE",
  "license_number": "PRC-123456",
  "license_expiry": "2027-12-31",
  "license_verified": true,
  "verification_status": "VERIFIED",
  "max_distance_km": 5,
  "specializations": ["ICU", "ER"],
  "is_available": true,
  "created_at": "2026-03-13T10:30:00Z"
}
```

### 7.10 Remove First Aider (Organization Admin)

```
DELETE /organizations/{id}/first-aiders/{first_aider_id}
```

### 7.11 Register Responder (Organization Admin)

```
POST /organizations/{id}/responders
```

> **Note:** Organizations (PNP, BFP, etc.) register their staff as Responders. The user must already exist as a CITIZEN.

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
  "user_id": "user-uuid",
  "organization_id": "org-uuid",
  "name": "Sgt. Juan Dela Cruz",
  "badge_number": "PNP-12345",
  "rank": "Sergeant",
  "unit": "Mobile Force Company",
  "status": "AVAILABLE",
  "is_verified": true,
  "created_at": "2026-03-13T10:30:00Z"
}
```

### 7.12 Update Responder (Organization Admin)

```
PUT /organizations/{id}/responders/{responder_id}
```

**Request:**
```json
{
  "rank": "Staff Sergeant",
  "unit": "Special Action Force",
  "status": "OFF_DUTY"
}
```

### 7.13 Remove Responder (Organization Admin)

```
DELETE /organizations/{id}/responders/{responder_id}
```

---

## 9. Agency API

> **Note:** For new implementations, use the **Organization API (Section 7)** which provides hierarchical organization management. The Agency API is maintained for backward compatibility and represents organizations at the local level.

### 9.1 List Agencies

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

### 9.2 Get Agency Details

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

### 9.3 Get Agency Responders

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

### 9.4 Add Responder (Agency Admin)

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

### 9.5 Update Responder (Agency Admin)

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

### 9.6 Remove Responder (Agency Admin)

```
DELETE /agencies/{id}/responders/{responder_id}
```

### 9.7 Get Agency Incidents

```
GET /agencies/{id}/incidents
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | RECEIVED, DISPATCHED, EN_ROUTE, ON_SCENE, RESOLVED |
| date_from | date | Filter from date |
| date_to | date | Filter to date |

### 9.8 Get Agency Statistics

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

### 9.9 Agency Admin Management

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

## 10. Responder API

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

### 8.4 Update Status

```
PUT /responders/me/status
```

**Request:**
```json
{
  "status": "EN_ROUTE",
  "latitude": 14.5995,
  "longitude": 120.9842
}
```

### 8.5 Update Location

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

## 11. First Aider API

> **Note:** First Aider registration is handled by **Organizations** (hospitals, Red Cross, etc.) via `POST /organizations/{id}/first-aiders`. See Section 7.9 for registration endpoints.

### 11.1 Get First Aider Incidents

```
GET /first-aiders/incidents?latitude=14.5995&longitude=120.9842
```

### 11.3 Respond to Incident

```
POST /first-aiders/incidents/{id}/respond
```

### 11.3 Decline to Respond

```
POST /first-aiders/incidents/{id}/decline
```

---

## 12. Dispatcher API

### 12.1 Get All Active Incidents

```
GET /dispatcher/incidents?status=ACTIVE
```

### 12.2 Get All Responders

```
GET /dispatcher/responders?organization=PNP&status=AVAILABLE
```

### 12.3 Manual Dispatch

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

### 12.4 Escalate Incident

```
POST /dispatcher/incidents/{id}/escalate
```

**Request:**
```json
{
  "additional_agencies": ["AMBULANCE", "FIRE"]
}
```

### 12.5 Transfer Command

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

## 13. Notification API

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

## 14. Message/Chat API

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

## 15. Media API

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

## 16. Broadcast API

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

## 17. Location API

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

## 18. Supabase PostGIS API

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

## 19. SMS/USSD API

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

## 20. Silent SOS API

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

## 21. Storage API (Cloudflare R2)

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

## 22. Report/Analytics API

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

## 23. WebSocket Events (Socket.io)

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

## 24. Error Responses

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

## 25. Rate Limits

| Endpoint | Limit |
|----------|-------|
| Authentication | 10 requests/minute |
| Create Incident | 5 requests/minute |
| General API | 60 requests/minute |
| Bulk Operations | 10 requests/minute |

---

## 26. Related Documents

- [technical-architecture.md](technical-architecture.md)
- [unified-data-dictionary.md](unified-data-dictionary.md)

---

**Document Status:** Draft
**Last Updated:** 2026-03-13

---

*This specification is part of the Toyota Emergency Response Platform project.*
