# Unified Data Dictionary

**Document Title:** Unified Data Dictionary
**Version:** 1.0
**Date:** 2026-03-13
**Author:** Jan Dave Zamora
**Status:** Draft
**Related Documents:** 
- technical-architecture.md
- silent-sos-spec.md
- sms-ussd-fallback-spec.md
- multi-agency-escalation-spec.md

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-13 | Jan Dave Zamora | Initial consolidated version |

---

## 1. Overview

This document consolidates all data entities from all feature specifications into a unified data dictionary for database schema design.

---

## 2. Core Entities

### 2.1 User Entity

```typescript
interface User {
  id: string;                    // UUID
  phone: string;                 // +63XXXXXXXXXX
  email: string;                 // user@example.com
  password_hash: string;         // bcrypt hash
  first_name: string;
  last_name: string;
  role: UserRole;               // CITIZEN, RESPONDER, FIRST_AIDER, DISPATCHER, ADMIN
  profile_image_url: string;
  created_at: timestamp;
  updated_at: timestamp;
  is_verified: boolean;
  verification_method: string;   // PHONE, EMAIL, PHILID
  last_login_at: timestamp;
  is_active: boolean;
  
  // Citizen-specific
  emergency_contacts: EmergencyContact[];
  
  // First Aider-specific
  profession: string;           // NURSE, DOCTOR, LIFEGUARD, FIRE_TRAINED
  license_number: string;        // PRC number
  license_verified: boolean;
  
  // Settings
  notification_preferences: NotificationPreferences;
  language: string;             // en, tl
  accessibility_settings: AccessibilitySettings;
}

enum UserRole {
  CITIZEN = "CITIZEN",
  RESPONDER = "RESPONDER",
  FIRST_AIDER = "FIRST_AIDER",
  DISPATCHER = "DISPATCHER",
  ADMIN = "ADMIN"
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  is_primary: boolean;
}

interface NotificationPreferences {
  push_enabled: boolean;
  sms_enabled: boolean;
  email_enabled: boolean;
  silent_sos_enabled: boolean;
  first_aider_alerts: boolean;
}

interface AccessibilitySettings {
  large_text: boolean;
  high_contrast: boolean;
  voice_commands: boolean;
  gesture_free: boolean;
}
```

---

### 2.2 Agency Entity

```typescript
interface Agency {
  id: string;
  name: string;                 // Philippine National Police
  short_name: string;           // PNP
  type: AgencyType;             // POLICE, AMBULANCE, FIRE, LGU, OCD
  region: string;
  province: string;
  city: string;
  barangay: string;
  address: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  is_active: boolean;
  created_at: timestamp;
}

enum AgencyType {
  POLICE = "POLICE",
  AMBULANCE = "AMBULANCE",
  FIRE = "FIRE",
  LGU = "LGU",
  OCD = "OCD",
  COAST_GUARD = "COAST_GUARD",
  BARANGAY = "BARANGAY"
}
```

---

### 2.3 Responder Entity

```typescript
interface Responder {
  id: string;
  user_id: string;              // FK to User
  agency_id: string;            // FK to Agency
  badge_number: string;
  rank: string;                // Sgt., Lt., etc.
  unit: string;                // Ambulance 05
  role: ResponderRole;         // POLICE, AMBULANCE, FIRE, COMMANDER
  status: ResponderStatus;     // AVAILABLE, EN_ROUTE, ON_SCENE, OFF_DUTY
  current_latitude: number;
  current_longitude: number;
  last_location_update: timestamp;
  is_verified: boolean;
  supervisor_approved: boolean;
  supervisor_id: string;
  created_at: timestamp;
  updated_at: timestamp;
}

enum ResponderRole {
  POLICE = "POLICE",
  AMBULANCE = "AMBULANCE",
  FIRE = "FIRE",
  COMMANDER = "COMMANDER",
  DISPATCHER = "DISPATCHER"
}

enum ResponderStatus {
  AVAILABLE = "AVAILABLE",
  EN_ROUTE = "EN_ROUTE",
  ON_SCENE = "ON_SCENE",
  OFF_DUTY = "OFF_DUTY",
  BUSY = "BUSY"
}
```

---

### 2.4 First Aider Entity

```typescript
interface FirstAider {
  id: string;
  user_id: string;              // FK to User
  profession: FirstAiderProfession;
  license_number: string;
  license_expiry: date;
  license_verified: boolean;
  verification_status: VerificationStatus;
  max_distance_km: number;      // Alert radius
  is_available: boolean;
  current_latitude: number;
  current_longitude: number;
  total_responses: number;
  rating: number;               // 1-5 stars
  created_at: timestamp;
}

enum FirstAiderProfession {
  NURSE = "NURSE",
  DOCTOR = "DOCTOR",
  PARAMEDIC = "PARAMEDIC",
  LIFEGUARD = "LIFEGUARD",
  FIRE_TRAINED = "FIRE_TRAINED",
  EMT = "EMT"
}

enum VerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED"
}
```

---

### 2.5 Incident Entity

```typescript
interface Incident {
  id: string;                    // EMG-2026-XXXX
  incident_number: string;        // Incremental
  type: IncidentType;
  sub_type: string;
  priority: Priority;             // LOW, MEDIUM, HIGH, CRITICAL
  status: IncidentStatus;
  
  // Location
  latitude: number;
  longitude: number;
  address: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  landmark: string;
  location_accuracy: number;    // meters
  
  // Description
  title: string;
  description: string;
  
  // Source
  source: IncidentSource;       // APP, SMS, USSD, CALL
  reporter_id: string;           // FK to User
  reporter_phone: string;
  
  // Multi-Agency
  is_multi_agency: boolean;
  primary_agency_id: string;
  scene_commander_id: string;    // FK to Responder
  
  // Timing
  reported_at: timestamp;
  dispatched_at: timestamp;
  en_route_at: timestamp;
  arrived_at: timestamp;
  resolved_at: timestamp;
  closed_at: timestamp;
  
  // Status
  is_silent: boolean;            // Silent SOS
  is_anonymous: boolean;
  is_verified: boolean;
  false_report_count: number;
  
  created_at: timestamp;
  updated_at: timestamp;
}

enum IncidentType {
  MEDICAL = "MEDICAL",
  FIRE = "FIRE",
  POLICE = "POLICE",
  TRAFFIC = "TRAFFIC",
  DISASTER = "DISASTER",
  OTHER = "OTHER"
}

enum IncidentStatus {
  RECEIVED = "RECEIVED",
  DISPATCHED = "DISPATCHED",
  ACKNOWLEDGED = "ACKNOWLEDGED",
  EN_ROUTE = "EN_ROUTE",
  ON_SCENE = "ON_SCENE",
  RESOLVED = "RESOLVED",
  CANCELLED = "CANCELLED",
  FALSE_REPORT = "FALSE_REPORT"
}

enum IncidentSource {
  APP = "APP",
  SMS = "SMS",
  USSD = "USSD",
  CALL = "CALL",
  DISPATCHER = "DISPATCHER"
}

enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}
```

---

### 2.6 Incident Timeline Entity

```typescript
interface IncidentTimeline {
  id: string;
  incident_id: string;          // FK to Incident
  actor_type: ActorType;        // USER, RESPONDER, SYSTEM, DISPATCHER
  actor_id: string;
  action: TimelineAction;
  details: JSON;
  latitude: number;
  longitude: number;
  timestamp: timestamp;
}

enum ActorType {
  USER = "USER",
  RESPONDER = "RESPONDER",
  SYSTEM = "SYSTEM",
  DISPATCHER = "DISPATCHER"
}

enum TimelineAction {
  CREATED = "CREATED",
  DISPATCHED = "DISPATCHED",
  ACCEPTED = "ACCEPTED",
  EN_ROUTE = "EN_ROUTE",
  ARRIVED = "ARRIVED",
  STATUS_CHANGED = "STATUS_CHANGED",
  ESCALATED = "ESCALATED",
  COMMAND_TRANSFERRED = "COMMAND_TRANSFERRED",
  HANDOFF = "HANDOFF",
  RESOLVED = "RESOLVED",
  CANCELLED = "CANCELLED",
  COMMENT_ADDED = "COMMENT_ADDED"
}
```

---

### 2.7 Dispatch Entity

```typescript
interface Dispatch {
  id: string;
  incident_id: string;
  responder_id: string;
  agency_id: string;
  status: DispatchStatus;
  dispatched_at: timestamp;
  accepted_at: timestamp;
  declined_at: timestamp;
  declined_reason: string;
  en_route_at: timestamp;
  arrived_at: timestamp;
  completed_at: timestamp;
  
  // Tracking
  assigned_by: string;           // SYSTEM or dispatcher_id
  auto_assigned: boolean;
  
  // For multi-agency
  is_primary: boolean;
  scene_commander: boolean;
  
  created_at: timestamp;
  updated_at: timestamp;
}

enum DispatchStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  EN_ROUTE = "EN_ROUTE",
  ON_SCENE = "ON_SCENE",
  COMPLETED = "COMPLETED",
  TIMEOUT = "TIMEOUT"
}
```

---

### 2.8 Location Tracking Entity

```typescript
interface LocationUpdate {
  id: string;
  entity_type: string;          // INCIDENT, RESPONDER, USER
  entity_id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  speed: number;
  heading: number;
  timestamp: timestamp;
  source: string;               // GPS, NETWORK, WIFI
}

interface LocationHistory {
  id: string;
  entity_type: string;
  entity_id: string;
  route: LineString;            // GeoJSON
  started_at: timestamp;
  ended_at: timestamp;
}
```

---

### 2.9 Notification Entity

```typescript
interface Notification {
  id: string;
  user_id: string;
  incident_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: JSON;
  channel: NotificationChannel;  // PUSH, SMS, IN_APP
  status: NotificationStatus;
  sent_at: timestamp;
  delivered_at: timestamp;
  read_at: timestamp;
  created_at: timestamp;
}

enum NotificationType {
  DISPATCH = "DISPATCH",
  STATUS_UPDATE = "STATUS_UPDATE",
  SILENT_SOS = "SILENT_SOS",
  FIRST_AIDER_ALERT = "FIRST_AIDER_ALERT",
  ESCALATION = "ESCALATION",
  COMMAND_TRANSFER = "COMMAND_TRANSFER",
  SYSTEM = "SYSTEM"
}

enum NotificationChannel {
  PUSH = "PUSH",
  SMS = "SMS",
  IN_APP = "IN_APP",
  EMAIL = "EMAIL"
}

enum NotificationStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
  FAILED = "FAILED"
}
```

---

### 2.10 Message/Chat Entity

```typescript
interface Message {
  id: string;
  incident_id: string;
  sender_type: ActorType;
  sender_id: string;
  sender_name: string;
  content: string;
  message_type: MessageType;
  media_url: string;
  is_read: boolean;
  read_at: timestamp;
  created_at: timestamp;
}

enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  LOCATION = "LOCATION"
}
```

---

### 2.11 Media Entity

```typescript
interface Media {
  id: string;
  incident_id: string;
  uploader_id: string;
  type: MediaType;
  url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  thumbnail_url: string;
  
  // Metadata
  latitude: number;
  longitude: number;
  captured_at: timestamp;
  description: string;
  
  // Evidence chain
  is_evidence: boolean;
  evidence_hash: string;        // SHA-256 for integrity
  
  uploaded_at: timestamp;
}

enum MediaType {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  DOCUMENT = "DOCUMENT"
}
```

---

### 2.12 Schedule Entity

```typescript
interface Schedule {
  id: string;
  responder_id: string;
  agency_id: string;
  shift_type: ShiftType;
  start_time: timestamp;
  end_time: timestamp;
  status: ScheduleStatus;
  notes: string;
  created_by: string;
  created_at: timestamp;
}

enum ShiftType {
  REGULAR = "REGULAR",
  OVERTIME = "OVERTIME",
  ON_CALL = "ON_CALL",
  EMERGENCY = "EMERGENCY"
}

enum ScheduleStatus {
  SCHEDULED = "SCHEDULED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW"
}
```

---

### 2.13 Audit Log Entity

```typescript
interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values: JSON;
  new_values: JSON;
  ip_address: string;
  user_agent: string;
  timestamp: timestamp;
}
```

---

### 2.14 Broadcast/Mass Notification Entity

```typescript
interface Broadcast {
  id: string;
  sender_id: string;
  type: BroadcastType;
  title: string;
  message: string;
  
  // Recipients
  recipient_type: RecipientType;
  location_center: Point;
  location_radius_km: number;
  recipient_count: number;
  delivered_count: number;
  failed_count: number;
  
  status: BroadcastStatus;
  scheduled_at: timestamp;
  sent_at: timestamp;
  completed_at: timestamp;
  
  created_at: timestamp;
}

enum BroadcastType {
  EMERGENCY = "EMERGENCY",
  WARNING = "WARNING",
  INFO = "INFO",
  EVACUATION = "EVACUATION",
  ALL_CLEAR = "ALL_CLEAR"
}

enum RecipientType {
  ALL = "ALL",
  LOCATION_BASED = "LOCATION_BASED",
  AGENCY = "AGENCY",
  CUSTOM = "CUSTOM"
}

enum BroadcastStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  SENDING = "SENDING",
  SENT = "SENT",
  FAILED = "FAILED",
  PARTIAL = "PARTIAL"
}
```

---

## 3. Entity Relationships

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ENTITY RELATIONSHIPS                               │
└─────────────────────────────────────────────────────────────────────────────────┘

                         ┌──────────────┐
                         │    Agency    │
                         └──────┬───────┘
                                │ 1:N
                                ▼
┌──────────────┐          ┌──────────────┐
│    User      │          │  Responder   │
│   (1,1)      │◄────────│   (N,1)      │
└──────────────┘          └──────┬───────┘
                                 │
                                 │ 1:N
                                 ▼
                         ┌──────────────┐
                         │  Dispatch    │
                         └──────┬───────┘
                                │
           ┌─────────────────────┼─────────────────────┐
           │                     │                     │
           ▼                     ▼                     ▼
    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
    │   Incident   │     │   Incident   │     │  Schedule    │
    │   (1,N)      │     │   (1,N)      │     │   (N,1)      │
    └──────┬───────┘     └──────────────┘     └──────────────┘
           │
           │ 1:N
           ├────────────────────────────────────────┐
           │                │                       │
           ▼                ▼                       ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ Notification │ │   Message    │ │    Media     │
    └──────────────┘ └──────────────┘ └──────────────┘
```

---

## 4. Indexing Strategy

| Table | Index | Columns | Type |
|-------|-------|---------|------|
| users | idx_users_phone | phone | B-Tree |
| users | idx_users_email | email | B-Tree |
| users | idx_users_role | role | B-Tree |
| responders | idx_responders_agency | agency_id | B-Tree |
| responders | idx_responders_status | status | B-Tree |
| responders | idx_responders_location | (lat, lng) | GIST |
| incidents | idx_incidents_status | status | B-Tree |
| incidents | idx_incidents_type | type | B-Tree |
| incidents | idx_incidents_location | (lat, lng) | GIST |
| incidents | idx_incidents_created | created_at | B-Tree |
| incidents | idx_incidents_reporter | reporter_id | B-Tree |
| first_aiders | idx_first_aiders_profession | profession | B-Tree |
| first_aiders | idx_first_aiders_location | (lat, lng) | GIST |
| notifications | idx_notifications_user | user_id | B-Tree |
| notifications | idx_notifications_incident | incident_id | B-Tree |
| messages | idx_messages_incident | incident_id | B-Tree |
| location_updates | idx_location_entity | (entity_type, entity_id, timestamp) | Composite |

---

## 5. Data Retention

| Data Type | Retention Period | Reason |
|-----------|-----------------|--------|
| Incidents | 5 years | Legal/compliance |
| Messages | 2 years | Evidence |
| Location history | 30 days | Privacy |
| User data | Account lifetime | Service |
| Audit logs | 5 years | Compliance |
| Media/evidence | 5 years | Legal |
| Broadcast logs | 2 years | Records |

---

## 6. Related Documents

- [technical-architecture.md](technical-architecture.md)
- [database-schema-readiness.md](database-schema-readiness.md)
- [feature-specs/silent-sos-spec.md](../feature-specs/silent-sos-spec.md)
- [feature-specs/sms-ussd-fallback-spec.md](../feature-specs/sms-ussd-fallback-spec.md)
- [feature-specs/multi-agency-escalation-spec.md](../feature-specs/multi-agency-escalation-spec.md)

---

**Document Status:** Draft
**Last Updated:** 2026-03-13

---

*This document is part of the Toyota Emergency Response Platform project.*
