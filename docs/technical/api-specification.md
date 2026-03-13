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

---

## 1. Overview

This document defines the REST API specification for the Toyota Emergency Response Platform. All endpoints follow RESTful conventions and return JSON responses.

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

### 3.4 Register

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
  "role": "CITIZEN",
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

### 4.5 Delete Emergency Contact

```
DELETE /users/me/emergency-contacts/{id}
```

---

## 5. Incident API

### 5.1 Create Incident

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
  "is_anonymous": false
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

### 5.2 Get Incident

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

### 5.3 Get Active Incidents

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

### 5.4 Update Incident Status

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

### 5.5 Get Incident Timeline

```
GET /incidents/{id}/timeline
```

### 5.6 Add Incident Comment

```
POST /incidents/{id}/comments
```

**Request:**
```json
{
  "content": "Additional information about the incident"
}
```

### 5.7 Cancel Incident

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

## 6. Responder API

### 6.1 Get Available Incidents

```
GET /responders/incidents?latitude=14.5995&longitude=120.9842&type=MEDICAL
```

### 6.2 Accept Dispatch

```
POST /dispatch/{dispatch_id}/accept
```

### 6.3 Decline Dispatch

```
POST /dispatch/{dispatch_id}/decline
```

**Request:**
```json
{
  "reason": "Currently handling another incident"
}
```

### 6.4 Update Status

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

### 6.5 Update Location

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

### 6.6 Request Backup

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

## 7. First Aider API

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

## 8. Dispatcher API

### 8.1 Get All Active Incidents

```
GET /dispatcher/incidents?status=ACTIVE
```

### 8.2 Get All Responders

```
GET /dispatcher/responders?agency=PNP&status=AVAILABLE
```

### 8.3 Manual Dispatch

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

### 8.4 Escalate Incident

```
POST /dispatcher/incidents/{id}/escalate
```

**Request:**
```json
{
  "additional_agencies": ["AMBULANCE", "FIRE"]
}
```

### 8.5 Transfer Command

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

## 9. Notification API

### 9.1 Get Notifications

```
GET /notifications?limit=20&unread=true
```

### 9.2 Mark as Read

```
PUT /notifications/{id}/read
```

### 9.3 Update Notification Preferences

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

## 10. Message/Chat API

### 10.1 Get Messages

```
GET /incidents/{id}/messages
```

### 10.2 Send Message

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

## 11. Media API

### 11.1 Upload Media

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

### 11.2 Get Media

```
GET /media/{id}
```

---

## 12. Broadcast API

### 12.1 Create Broadcast

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

### 12.2 Get Broadcast Status

```
GET /broadcasts/{id}
```

---

## 13. Location API

### 13.1 Reverse Geocode

```
GET /location/reverse?latitude=14.5995&longitude=120.9842
```

### 13.2 Geocode Address

```
GET /location/geocode?address=Taft+Avenue+Manila
```

### 13.3 Get Directions

```
GET /location/directions?origin_lat=14.5&origin_lng=120.9&dest_lat=14.6&dest_lng=121.0
```

---

## 14. Report/Analytics API

### 14.1 Get Dashboard Stats

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

### 14.2 Get Response Time Report

```
GET /reports/response-time?group_by=day&date_from=2026-01-01&date_to=2026-03-13
```

### 14.3 Get Heat Map Data

```
GET /reports/heatmap?date_from=2026-01-01&date_to=2026-03-13&type=MEDICAL
```

---

## 15. WebSocket Events

### 15.1 Connect

```
WS /ws?token=<access_token>
```

### 15.2 Subscribe to Incident

```json
{
  "action": "subscribe",
  "incident_id": "EMG-2026-0142"
}
```

### 15.3 Location Update (Client → Server)

```json
{
  "action": "location_update",
  "latitude": 14.5995,
  "longitude": 120.9842,
  "accuracy": 5
}
```

### 15.4 Incident Update (Server → Client)

```json
{
  "event": "incident:update",
  "data": {
    "id": "EMG-2026-0142",
    "status": "EN_ROUTE",
    "responder": {
      "id": "responder-uuid",
      "name": "Sgt. Juan",
      "eta_minutes": 5
    }
  }
}
```

---

## 16. Error Responses

### 16.1 Standard Error Format

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

### 16.2 Error Codes

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

## 17. Rate Limits

| Endpoint | Limit |
|----------|-------|
| Authentication | 10 requests/minute |
| Create Incident | 5 requests/minute |
| General API | 60 requests/minute |
| Bulk Operations | 10 requests/minute |

---

## 18. Related Documents

- [technical-architecture.md](technical-architecture.md)
- [unified-data-dictionary.md](unified-data-dictionary.md)

---

**Document Status:** Draft
**Last Updated:** 2026-03-13

---

*This specification is part of the Toyota Emergency Response Platform project.*
