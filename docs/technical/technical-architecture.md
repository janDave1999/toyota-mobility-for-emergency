# Technical Architecture Document

**Document Title:** Technical Architecture Specification
**Version:** 1.0
**Date:** 2026-03-13
**Author:** Jan Dave Zamora
**Status:** Draft
**Related Product Brief:** product-brief-emergency-response-platform.md

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-13 | Jan Dave Zamora | Initial version |
| 1.1 | 2026-03-13 | Jan Dave Zamora | Updated: AstroJS frontend, NestJS backend |
| 1.2 | 2026-03-13 | Jan Dave Zamora | Updated: Beta = Web-first, Mobile = Future |
| 1.3 | 2026-03-13 | Jan Dave Zamora | Updated: Pure AstroJS (no React), Supabase PostGIS |
| 1.4 | 2026-03-13 | Jan Dave Zamora | Updated: Cloudflare + DigitalOcean deployment, Cloudflare KV/R2 for cache/storage |
| 1.5 | 2026-03-19 | Jan Dave Zamora | Updated: 2-frontend model (Citizen App + Admin Portal), org-driven invite flow, System Admin bootstrap, JWT roles |
| 1.6 | 2026-03-19 | Jan Dave Zamora | Updated: ORG_ADMIN org-scoped role added. Two-actor model clarified. OrgAdminGuard. responder_type stored on membership. |

---

## 1. Executive Summary

### 1.1 Purpose

This document defines the technical architecture for the Toyota Emergency Response Platform - a decentralized emergency response system serving the Philippines. The architecture supports real-time emergency reporting, multi-agency dispatch, and offline-capable response coordination.

### 1.2 Scope

**Frontend (2 separate applications):**
- **Citizen App** (AstroJS PWA) — Self-registration, incident reporting, silent SOS, invitation response - **Beta: Web first, Mobile post-beta**
- **Admin Portal** (AstroJS) — Used by both System Admin and Org Admins (DISPATCHER role). Organization management, member invitations, incident dispatch — **Beta: Web only**

**Backend:**
- Backend API services (NestJS) — Single API serving both frontends
- Real-time location tracking (Socket.io)
- SMS/USSD fallback system
- Integration with external services

**Note:** Citizen mobile apps (iOS/Android React Native) will be built after beta web validation. Both frontends use the same `POST /auth/login` endpoint — roles in the JWT determine access levels and UI routing.

### 1.3 Technical Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | AstroJS (Pure) |
| **Styling** | TailwindCSS |
| **Frontend Deploy** | Cloudflare Pages |
| **Session/Cache** | Cloudflare KV / Durable Objects |
| **File Storage** | Cloudflare R2 |
| Backend API | NestJS (TypeScript) |
| Backend Deploy | DigitalOcean (App Platform) |
| Real-time | Socket.io (NestJS plugin) |
| Database | **Supabase PostgreSQL + PostGIS** |
| Maps | Mapbox or Google Maps |
| SMS Gateway | Twilio or telecom partner |
| Push Notifications | FCM (Android) + APNs (iOS) + Web Push |
| Containerization | Docker |

### 1.4 Deployment Architecture

| Layer | Provider | Technology |
|-------|----------|------------|
| Frontend | Cloudflare Pages | AstroJS + TailwindCSS |
| Frontend Assets/CDN | Cloudflare | Cloudflare CDN |
| Session/Cache | Cloudflare KV | Key-Value storage |
| File Storage | Cloudflare R2 | S3-compatible |
| Backend API | DigitalOcean | NestJS + Socket.io |
| Database | Supabase | PostgreSQL + PostGIS |
| Realtime | DigitalOcean | Socket.io |

---

## 2. System Architecture Overview

### 2.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    TOYOTA EMERGENCY RESPONSE PLATFORM                       │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────────────────────────────┐
                                    │         EXTERNAL SERVICES            │
                                    │  ┌───────────┐  ┌───────────────┐  │
                                    │  │  Mapbox   │  │   SMS/USSD   │  │
                                    │  │   /Google │  │   Gateway    │  │
                                    │  └───────────┘  └───────────────┘  │
                                    │  ┌───────────┐  ┌───────────────┐  │
                                    │  │    FCM    │  │   PhilID     │  │
                                    │  │   /APNs   │  │  Verification│  │
                                    │  └───────────┘  └───────────────┘  │
                                    └──────────────────┬──────────────────┘
                                                       │
                                    ┌────────────────┴────────────────┐
                                    │         API GATEWAY / LOAD BALANCER │
                                    │         (AWS ALB / Cloudflare)       │
                                    └────────────────┬────────────────┘
                                                       │
        ┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
        │                                               │                                               │
        ▼                                               ▼                                               ▼
┌───────────────────────┐               ┌───────────────────────┐               ┌───────────────────────┐
│    PUBLIC APP         │               │   RESPONDER APP      │               │   DISPATCHER DASHBOARD│
│   (AstroJS PWA)   │               │   (AstroJS PWA)   │               │     (AstroJS Web)    │
│                       │               │                       │               │                       │
│ • Report Emergency    │               │ • View Incidents     │               │ • Monitor All         │
│ • Track Response     │               │ • Accept Dispatch   │               │ • Assign Responders   │
│ • Silent SOS         │               │ • Navigate          │               │ • Generate Reports    │
│ • First Aider Mode   │               │ • Update Status     │               │ • Mass Notification   │
└───────────┬───────────┘               └───────────┬───────────┘               └───────────┬───────────┘
            │                                   │                                   │
            └───────────────────────────────────┼───────────────────────────────────┘
                                                │
                                    ┌───────────┴───────────┐
                                    │    REAL-TIME LAYER    │
                                    │   (WebSocket/Socket.io)│
                                    └───────────┬───────────┘
                                                │
        ┌───────────────────────────────────────┼───────────────────────────────────────┐
        │                                       │                                       │
        ▼                                       ▼                                       ▼
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│   USER SERVICE        │   │  INCIDENT SERVICE    │   │  DISPATCH SERVICE    │
│                       │   │                       │   │                       │
│ • Authentication      │   │ • Create Incident     │   │ • Find Responders     │
│ • User Management     │   │ • Update Status       │   │ • Assign Dispatch    │
│ • Profile Management │   │ • Location Tracking   │   │ • Multi-Agency       │
│ • First Aider Registry│   │ • Timeline Events     │   │ • Escalation Rules   │
└───────────┬───────────┘   └───────────┬───────────┘   └───────────┬───────────┘
            │                           │                           │
            │                           │                           │
            ▼                           ▼                           ▼
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│  NOTIFICATION SERVICE │   │   SMS/USSD SERVICE   │   │  LOCATION SERVICE    │
│                       │   │                       │   │                       │
│ • Push Notifications  │   │ • Receive SMS         │   │ • GPS Tracking       │
│ • In-App Messages     │   │ • Send SMS           │   │ • Geofencing         │
│ • Email Alerts        │   │ • USSD Menu          │   │ • Proximity Search   │
└───────────┬───────────┘   └───────────┬───────────┘   └───────────┬───────────┘
            │                           │                           │
            └───────────────────────────┼───────────────────────────┘
                                        │
                            ┌───────────┴───────────┐
                            │      DATABASE           │
                            │  (Supabase PostGIS)   │
                            │                       │
                            │  • Users              │
                            │  • Organizations     │
                            │  • Incidents          │
                            │  • Responders         │
                            │  • Locations (GIS)   │
                            │  • Notifications      │
                            │  • Messages          │
                            │  • Schedules          │
                            └───────────────────────┘
```

---

## 3. Frontend Architecture

### 3.1 Application Structure (Beta - Web Based)

> **Two-frontend model.** One NestJS API serves both. Role in JWT determines access.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│              FRONTEND APP 1: CITIZEN APP (AstroJS PWA)                         │
│              Users: Citizens (CITIZEN role) + Responders (RESPONDER role)       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────┐  ┌────────────────────────────────────┐
│     CITIZEN PAGES                  │  │    RESPONDER PAGES (role-gated)  │
├────────────────────────────────────┤  ├────────────────────────────────────┤
│                                    │  │                                    │
│  /pages                           │  │  /pages/responder                 │
│  ├── index.astro                 │  │  ├── dashboard.astro             │
│  ├── register.astro              │  │  ├── incidents.astro             │
│  ├── login.astro                 │  │  ├── incident/[id].astro        │
│  ├── report.astro                │  │  ├── map.astro                  │
│  ├── track.astro                 │  │  └── profile.astro               │
│  ├── invitations.astro           │  │                                    │
│  ├── profile.astro               │  │  /components (Astro)             │
│  └── settings.astro              │  │  ├── IncidentCard.astro          │
│                                    │  │  ├── MapView.astro              │
│  /components (Astro)             │  │  ├── StatusToggle.astro         │
│  ├── EmergencyButton.astro       │  │  └── ActionButtons.astro        │
│  ├── LocationPicker.astro        │  │                                    │
│  ├── InvitationCard.astro        │  │  Role: RESPONDER                 │
│  ├── StatusCard.astro            │  │  Sees: org-scoped incidents only │
│  └── ChatBox.astro               │  │  (POLICE resp → POLICE incidents)│
│                                    │  │                                    │
│  PWA: Service Worker enabled     │  │  PWA: Service Worker enabled     │
│  Offline support (future)        │  │  Offline-capable (future)        │
└────────────────────────────────────┘  └────────────────────────────────────┘

After login → read JWT roles → route to CITIZEN or RESPONDER view
```

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│              FRONTEND APP 2: ADMIN PORTAL (AstroJS)                            │
│              Users: System Admin (ADMIN role) + Org Admins (DISPATCHER role)   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────┐  ┌────────────────────────────────────┐
│   SYSTEM ADMIN PAGES               │  │    ORG ADMIN (DISPATCHER) PAGES  │
│   role: ADMIN                      │  │    role: DISPATCHER              │
├────────────────────────────────────┤  ├────────────────────────────────────┤
│                                    │  │                                    │
│  /pages/admin                     │  │  /pages/org                       │
│  ├── dashboard.astro             │  │  ├── dashboard.astro             │
│  ├── organizations.astro         │  │  ├── members.astro               │
│  ├── organizations/new.astro     │  │  ├── members/invite.astro        │
│  ├── organizations/[id].astro    │  │  ├── incidents.astro             │
│  └── users.astro                 │  │  ├── dispatch.astro              │
│                                    │  │  └── settings.astro             │
│  Can: create orgs,                │  │                                    │
│       invite first DISPATCHER    │  │  Can: invite members,            │
│       view all system data        │  │       revoke members,            │
│                                    │  │       dispatch responders,       │
│                                    │  │       view org incidents only    │
└────────────────────────────────────┘  └────────────────────────────────────┘

After login → read JWT roles → route to ADMIN or DISPATCHER (Org Admin) view
```

### 3.2 Mobile Apps (Future Phase)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         MOBILE APPS (Post-Beta)                               │
└─────────────────────────────────────────────────────────────────────────────────┘

Consider React Native for mobile after beta validation:
- Single codebase for iOS/Android
- Native performance for location tracking
- Offline-first capabilities
- Background notifications
```

### 3.3 Web Dashboard Structure

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DISPATCHER DASHBOARD STRUCTURE                      │
└─────────────────────────────────────────────────────────────────────────────────┘

/src
├── /components
│   ├── /common
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── /layout
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── /dashboard
│   │   ├── StatsCard.tsx
│   │   ├── AlertPanel.tsx
│   │   └── QuickActions.tsx
│   ├── /incidents
│   │   ├── IncidentList.tsx
│   │   ├── IncidentDetail.tsx
│   │   ├── IncidentMap.tsx
│   │   └── IncidentTimeline.tsx
│   ├── /responders
│   │   ├── ResponderList.tsx
│   │   ├── ResponderMap.tsx
│   │   └── ResponderStatus.tsx
│   └── /reports
│       ├── ReportBuilder.tsx
│       └── ExportButton.tsx
│
├── /screens
│   ├── DashboardScreen.tsx
│   ├── IncidentsScreen.tsx
│   ├── RespondersScreen.tsx
│   ├── ReportsScreen.tsx
│   ├── SettingsScreen.tsx
│   └── LoginScreen.tsx
│
├── /services
│   ├── api.ts
│   ├── websocket.ts
│   └── analytics.ts
│
├── /stores
│   ├── incidentStore.ts
│   ├── responderStore.ts
│   └── authStore.ts
│
├── /hooks
│   ├── useWebSocket.ts
│   ├── useIncidents.ts
│   └── useResponders.ts
│
└── /types
    ├── incident.ts
    ├── responder.ts
    └── user.ts
```

---

## 4. Backend Architecture

### 4.1 Microservices Design

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            BACKEND MICROSERVICES                                │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────────────────┐
                                    │     API GATEWAY         │
                                    │   (NestJS)         │
                                    │                         │
                                    │ • Rate Limiting         │
                                    │ • Authentication        │
                                    │ • Request Routing      │
                                    │ • SSL Termination      │
                                    └───────────┬─────────────┘
                                                │
        ┌───────────────────────────────────────┼───────────────────────────────────────┐
        │                                       │                                       │
        ▼                                       ▼                                       ▼
┌───────────────────┐               ┌───────────────────┐               ┌───────────────────┐
│  USER SERVICE     │               │ INCIDENT SERVICE  │               │ DISPATCH SERVICE  │
│                   │               │                   │               │                   │
│ Port: 3001       │               │ Port: 3002       │               │ Port: 3003        │
│                   │               │                   │               │                   │
│ /api/users        │               │ /api/incidents   │               │ /api/dispatch     │
│ /api/auth         │               │ /api/locations    │               │ /api/assignments │
│ /api/profiles     │               │ /api/timeline     │               │ /api/escalation   │
│ /api/first-aiders │               │ /api/media        │               │ /api/responders   │
└─────────┬─────────┘               └─────────┬─────────┘               └─────────┬─────────┘
          │                                   │                                   │
          │                                   │                                   │
          ▼                                   ▼                                   ▼
┌───────────────────┐               ┌───────────────────┐               ┌───────────────────┐
│ NOTIFICATION SVC  │               │  SMS/USSD SVC     │               │  LOCATION SVC     │
│                   │               │                   │               │                   │
│ Port: 3004        │               │ Port: 3005        │               │ Port: 3006        │
│                   │               │                   │               │                   │
│ /api/notifications│               │ /api/sms/incoming │               │ /api/geo          │
│ /api/push         │               │ /api/sms/outgoing │               │ /api/tracking     │
│ /api/email        │               │ /api/ussd         │               │ /api/proximity    │
└───────────────────┘               └───────────────────┘               └───────────────────┘
```

### 4.2 Service Communication

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          SERVICE COMMUNICATION PATTERN                          │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────────────┐
                                    │   MESSAGE QUEUE     │
                                    │   (RabbitMQ/       │
                                    │    AWS SQS)        │
                                    └──────────┬──────────┘
                                               │
                    ┌───────────────────────────┼───────────────────────────┐
                    │                           │                           │
                    ▼                           ▼                           ▼
            ┌──────────────┐           ┌──────────────┐           ┌──────────────┐
            │  SYNC (REST) │           │ ASYNC (Queue)│           │REALTIME (WS) │
            ├──────────────┤           ├──────────────┤           ├──────────────┤
            │ • Auth       │           │ • New        │           │ • Location   │
            │ • User Get  │           │   Incident   │           │   Updates    │
            │ • Incident  │           │ • Status     │           │ • Chat      │
            │   CRUD      │           │   Change     │           │ • Alerts    │
            │ • Reports   │           │ • Dispatch   │           │ • Notify    │
            └──────────────┘           │ • Escalate   │           └──────────────┘
                                       └──────────────┘
```

---

## 5. Database Architecture

### 5.1 Database Design

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA OVERVIEW                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────┐    ┌────────────────────────────────┐
│         PRIMARY DB             │    │         CACHE (Redis)          │
│   (Supabase PostgreSQL +      │    │                                │
│        PostGIS)               │    │  • Session data               │
├────────────────────────────────┤    │  • Active incidents           │
│                                │    │  • Online responders          │
│  ┌─────────┐  ┌─────────┐     │    │  • Location cache             │
│  │ users   │  │agencies │     │    │  • Rate limits                │
│  └────┬────┘  └────┬────┘     │    │  • WebSocket state           │
│       │            │           │    └────────────────────────────────┘
│  ┌────┴────┐  ┌────┴────┐     │
│  │responders│ │incidents │     │
│  └────┬────┘  └────┬────┘     │
│       │            │           │
│  ┌────┴────┐  ┌────┴────┐     │
│  │first_aid│  │locatons │     │
│  │_ers     │  │ (GIS)   │     │
│  └─────────┘  └─────────┘     │
│                               │
│  ┌─────────────────────┐      │
│  │ notification_log    │      │
│  └─────────────────────┘      │
│                               │
│  ┌─────────────────────┐      │
│  │ messages/chat       │      │
│  └─────────────────────┘      │
│                               │
│  ┌─────────────────────┐      │
│  │ schedules/shifts    │      │
│  └─────────────────────┘      │
│                               │
│  ┌─────────────────────┐      │
│  │ audit_logs          │      │
│  └─────────────────────┘      │
└────────────────────────────────┘
```

### 5.2 Key Tables

| Table | Purpose | Key Indexes |
|-------|---------|-------------|
| users | Citizen users | phone, email |
| responders | Verified responders | agency_id, status |
| agencies | Police, Ambulance, Fire | agency_type |
| incidents | Emergency incidents | status, location, created_at |
| incident_locations | Location data | incident_id |
| first_aiders | Registered first aiders | profession, status, location |
| notifications | Push/SMS notifications | user_id, incident_id |
| messages | Chat messages | incident_id, sender_id |
| schedules | Responder shifts | responder_id, date |
| audit_logs | System audit trail | created_at, action |

---

## 6. External Integrations

### 6.1 Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            EXTERNAL INTEGRATIONS                               │
└─────────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────────────────┐
                                    │   EXTERNAL SERVICES      │
                                    └───────────┬─────────────┘
                                                │
        ┌─────────────────────────────┬───────────┴─────────────────────────────┐
        │                             │                                     │
        ▼                             ▼                                     ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│   MAP SERVICES    │   │  SMS / USSD      │   │  PUSH NOTIFICATIONS│
│                   │   │    GATEWAY       │   │                    │
│ • Mapbox SDK      │   │                   │   │ • FCM (Google)     │
│ • Google Maps     │   │ • Twilio         │   │ • APNs (Apple)     │
│                   │   │ • Custom SMSC    │   │ • Web Push         │
│ Features:         │   │ • USSD Handler  │   │                    │
│ • Map display     │   │                   │   │ Features:          │
│ • Geocoding       │   │ Features:         │   │ • Push alerts      │
│ • Directions      │   │ • Send SMS       │   │ • Background       │
│ • Geofencing      │   │ • Receive SMS    │   │   notifications    │
│                   │   │ • USSD menus    │   │ • Silent alerts   │
└───────────────────┘   └───────────────────┘   └───────────────────┘
        │                             │                             │
        └─────────────────────────────┼─────────────────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────┐
                    │     INTEGRATION LAYER           │
                    │                                 │
                    │ • Authentication                │
                    │ • Retry logic                  │
                    │ • Rate limiting                │
                    │ • Error handling               │
                    │ • Logging                      │
                    └─────────────────────────────────┘
```

### 6.2 Integration Details

| Service | Integration Type | Data Exchanged |
|---------|-----------------|----------------|
| Mapbox/Google Maps | REST API + SDK | Geocoding, directions, map tiles |
| SMS Gateway | SMPP/HTTP API | Send/receive SMS |
| USSD | MAP Protocol | Interactive menus |
| FCM | HTTP/SDK | Push notifications |
| APNs | HTTP/SDK | Push notifications |
| PhilID API | REST API | User verification |
| Government Systems | REST API | Dispatch integration |

---

## 7. Infrastructure Architecture

### 7.1 Cloud Deployment

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT: CLOUDFLARE + DIGITALOCEAN                    │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                            CLOUDFLARE (Frontend)                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │                         Cloudflare Pages                               │    │
│  │                    (Static site hosting)                              │    │
│  │                                                                       │    │
│  │  • Public Web App (AstroJS)                                          │    │
│  │  • Responder Web App (AstroJS)                                       │    │
│  │  • Dispatcher Dashboard (AstroJS)                                      │    │
│  │                                                                       │    │
│  │  Features: CDN, DDoS protection, SSL, Edge computing                 │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │                         Cloudflare Workers                            │    │
│  │                    (Edge functions, if needed)                        │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          DIGITALOCEAN (Backend)                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │                    DigitalOcean App Platform                           │    │
│  │                    (Docker containers)                                │    │
│  │                                                                       │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │    │
│  │  │    NestJS      │  │    NestJS      │  │    NestJS      │         │    │
│  │  │  (API Server)  │  │ (Socket.io)    │  │   (Workers)    │         │    │
│  │  │                 │  │  (Real-time)   │  │  (SMS Handler) │         │    │
│  │  └────────────────┘  └────────────────┘  └────────────────┘         │    │
│  │                                                                       │    │
│  │  Features: Auto-scaling, SSL, load balancing                        │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│  ┌────────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │   Supabase     │  │    Redis      │  │   Spaces S3   │               │
│  │  (PostgreSQL + │  │   Cloudflare  │  │   Cloudflare  │               │
│  │   PostGIS)     │  │     KV        │  │      R2       │               │
│  │                 │  │               │  │               │               │
│  │ • Primary DB    │  │ • Cache      │  │ • Media files │               │
│  │ • GIS Features │  │ • Sessions   │  │ • Backups     │               │
│  │ • PostGIS      │  │ • Rate limit │  │               │               │
│  └────────────────┘  └───────────────┘  └───────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Infrastructure Components

| Component | Primary | Fallback | Purpose |
|-----------|---------|----------|---------|
| Compute | DigitalOcean | - | NestJS Docker containers |
| **Database** | **Supabase** | - | PostgreSQL + PostGIS |
| **Cache/Session** | **Cloudflare KV** | Redis | Session, caching |
| **File Storage** | **Cloudflare R2** | S3 | Media, backups |
| Realtime | Socket.io | Supabase | WebSocket |
| CDN | Cloudflare | CloudFront | Static assets |
| SMS/USSD | Twilio | Telecom partner | Messaging |
| DNS | Cloudflare | Route53 | DNS management |

---

## 8. Security Architecture

### 8.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SECURITY ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  LAYER 1: NETWORK SECURITY                                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ • VPC with public/private subnets                                            │
│ • Security groups / firewall rules                                           │
│ • DDoS protection (CloudFlare/AWS Shield)                                   │
│ • WAF (Web Application Firewall)                                            │
│ • SSL/TLS everywhere                                                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  LAYER 2: APPLICATION SECURITY                                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│ • JWT authentication                                                         │
│ • Role-based access control (RBAC)                                          │
│ • API rate limiting                                                          │
│ • Input validation & sanitization                                            │
│ • CSRF protection                                                            │
│ • XSS prevention                                                            │
│ • SQL injection prevention                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  LAYER 3: DATA SECURITY                                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│ • Encryption at rest (AES-256)                                              │
│ • Encryption in transit (TLS 1.3)                                           │
│ • Database access controls                                                   │
│ • Field-level encryption for sensitive data                                 │
│ • Secure key management (AWS KMS / GCP KMS)                                 │
│ • Data masking in logs                                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  LAYER 4: COMPLIANCE                                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│ • Data Privacy Act compliance                                                │
│ • Audit logging (all data access)                                           │
│ • Data retention policies                                                    │
│ • Right to deletion support                                                 │
│ • Incident response plan                                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION & AUTHORIZATION                          │
└─────────────────────────────────────────────────────────────────────────────────┘

                           ┌─────────────────────┐
                           │      USER           │
                           │  (Citizen/Responder)│
                           └──────────┬──────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────┐
                    │     AUTHENTICATION              │
                    │                                 │
                    │  ┌─────────────────────────┐   │
                    │  │   Login / Register      │   │
                    │  │   • Phone + OTP         │   │
                    │  │   • Email + Password    │   │
                    │  │   • PhilID (future)     │   │
                    │  └───────────┬─────────────┘   │
                    └──────────────┬────────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────────┐
                    │      JWT TOKEN                  │
                    │                                 │
                    │  {                              │
                    │    "sub": "user_id",           │
                    │    "roles": ["RESPONDER"],     │
                    │    "email": "user@example.com",│
                    │    "expires_at": timestamp     │
                    │  }                              │
                    └──────────────┬────────────────┘
                                    │
                                    ▼
                     ┌─────────────────────────────────┐
                     │    AUTHORIZATION (RBAC)         │
                     │                                 │
                     │  GLOBAL ROLES (JWT roles[])      │
                     │  ┌──────────┐ ┌────────────────┐  │
                     │  │  CITIZEN │ │   RESPONDER    │  │
                     │  ├──────────┼─┼────────────────┤  │
                     │  │• report  │ │• accept invite │  │
                     │  │• track   │ │• view org-     │  │
                     │  │• invites │ │  scoped alerts │  │
                     │  │• profile │ │• update status │  │
                     │  └──────────┘ └────────────────┘  │
                     │                                    │
                     │  ┌──────────┐ ┌────────────────┐  │
                     │  │DISPATCHER│ │     ADMIN      │  │
                     │  │(global)  │ │ (System Admin) │  │
                     │  ├──────────┼─┼────────────────┤  │
                     │  │• dispatch│ │• create orgs   │  │
                     │  │• manage  │ │• deactivate    │  │
                     │  │  org-    │ │  orgs          │  │
                     │  │  scoped  │ │• system-wide   │  │
                     │  │  view    │ │  oversight     │  │
                     │  └──────────┘ └────────────────┘  │
                     │                                    │
                     │  ORG-SCOPED ROLE (OrgAdminGuard)   │
                     │  ┌──────────────────────────────┐  │
                     │  │  ORG_ADMIN (membership role) │  │
                     │  ├──────────────────────────────┤  │
                     │  │• invite / promote / revoke   │  │
                     │  │  members in their org        │  │
                     │  │• create dispatcher accounts  │  │
                     │  │• create sub-organizations    │  │
                     │  │• update org profile fields   │  │
                     │  │  (not structural fields)     │  │
                     │  │                              │  │
                     │  │ Checked via OrgAdminGuard    │  │
                     │  │ System ADMIN bypasses it     │  │
                     │  └──────────────────────────────┘  │
                     │                                    │
                     │  Single POST /auth/login for all.  │
                     │  JWT roles[] drives global access. │
                     │  ORG_ADMIN checked per-org via     │
                     │  organization_members table.       │
                     └─────────────────────────────────┘
```

---

## 9. Real-Time Architecture

### 9.1 WebSocket Design

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           REAL-TIME COMMUNICATION                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐                         ┌─────────────────────┐
│   MOBILE APP        │                         │   DASHBOARD         │
│                     │                         │                     │
│  ┌───────────────┐  │                         │  ┌───────────────┐  │
│  │ Socket.io     │◄─┼──────┐                │  │ Socket.io     │◄─┼──┐
│  │ Client        │  │      │                │  │ Client        │  │  │
│  └───────────────┘  │      │                │  └───────────────┘  │  │
│                     │      │                │                     │  │
│                     │      │                │                     │  │
└─────────────────────┘      │      ┌─────────┴─────────────┐      │  │
                            │      │                       │      │  │
                            │      ▼                       │      │  │
                            │ ┌───────────────┐           │      │  │
                            │ │ WebSocket     │◄──────────┘      │  │
                            │ │ Server        │                │  │
                            │ └───────┬───────┘                │  │
                            │         │                        │  │
                            │         │                        │  │
                            │         ▼                        │  │
                            │ ┌───────────────┐                │  │
                            │ │ Real-time     │                │  │
                            │ │ Events:       │                │  │
                            │ │ • location    │────────────────┘  │
                            │ │ • status      │                   │
                            │ │ • incident    │                   │
                            │ │ • chat        │                   │
                            │ │ • alert       │                   │
                            │ └───────────────┘                   │
                            │                                      │
                            │      ┌──────────────────────────┐    │
                            │      │    REDIS PUB/SUB        │    │
                            │      │                          │    │
                            │      │  • incident:new        │    │
                            │      │  • location:update     │    │
                            │      │  • status:change      │    │
                            │      │  • chat:message       │    │
                            │      └──────────────────────────┘    │
                            │                                      │
                            └──────────────────────────────────────┘
```

### 9.2 Real-Time Events

| Event | Direction | Payload |
|-------|-----------|---------|
| incident:new | Server → Client | Incident details |
| incident:update | Server → Client | Updated incident |
| location:update | Client → Server | GPS coordinates |
| location:broadcast | Server → Client | Responder locations |
| status:change | Client → Server | Status update |
| chat:message | Bidirectional | Chat text |
| alert:new | Server → Client | Silent SOS alert |

---

## 10. Scalability & Performance

### 10.1 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time | <200ms (p95) | Server-side |
| App Launch | <3 seconds | Client-side |
| Location Update | <1 second | End-to-end |
| WebSocket Latency | <100ms | Real-time |
| Push Notification | <2 seconds | End-to-end |
| SMS Delivery | <30 seconds | Gateway |
| Concurrent Users | 10,000+ | Platform |
| Incidents/Day | 50,000+ | Platform |
| Uptime | 99.9% | SLA |

### 10.2 Scalability Strategy

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SCALABILITY STRATEGY                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────────┐
                        │   HORIZONTAL        │
                        │   SCALING           │
                        └──────────┬──────────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌───────────────┐          ┌───────────────┐          ┌───────────────┐
│  STATELESS    │          │   DATABASE    │          │   CACHING     │
│  SERVICES     │          │   SCALING     │          │   LAYER       │
│               │          │               │          │               │
│ • Add more    │          │ • Read         │          │ • Redis       │
│   instances   │          │   replicas    │          │   cluster     │
│ • Auto-scale  │          │ • Sharding    │          │               │
│   based on    │          │ • Connection  │          │ • Cache:      │
│   load        │          │   pooling     │          │   - Sessions  │
│               │          │               │          │   - Locations │
│ • Health      │          │ • Partition   │          │   - Incidents │
│   checks      │          │   by region   │          │   - Users     │
└───────────────┘          └───────────────┘          └───────────────┘
```

---

## 11. Disaster Recovery & Backup

### 11.1 Backup Strategy

| Data Type | Backup Frequency | Retention | Storage |
|-----------|-----------------|-----------|---------|
| Database | Hourly + daily | 30 days | S3/Cloud Storage |
| User uploads | Daily | 90 days | S3/Cloud Storage |
| Logs | Daily | 1 year | CloudWatch/Stackdriver |
| Config | On change | 30 versions | Git |

### 11.2 Recovery Plan

- **RTO (Recovery Time Objective):** 4 hours
- **RPO (Recovery Point Objective):** 1 hour
- **Multi-region deployment:** Active-passive failover
- **Regular DR drills:** Quarterly

---

## 12. Related Documents

| Document | Description |
|----------|-------------|
| [product-brief-emergency-response-platform.md](../product-brief-emergency-response-platform.md) | Main product brief |
| [feature-specs/silent-sos-spec.md](../feature-specs/silent-sos-spec.md) | Silent SOS specification |
| [feature-specs/sms-ussd-fallback-spec.md](../feature-specs/sms-ussd-fallback-spec.md) | SMS/USSD specification |
| [feature-specs/multi-agency-escalation-spec.md](../feature-specs/multi-agency-escalation-spec.md) | Multi-Agency specification |
| [personas-detailed.md](../personas-detailed.md) | User personas |
| [technical/database-schema-readiness.md](database-schema-readiness.md) | Schema readiness analysis |

---

**Document Status:** Draft
**Last Updated:** 2026-03-19
**Next Review Date:** 2026-04-19

---

*This specification is part of the Toyota Emergency Response Platform project.*
