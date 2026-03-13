# SMS/USSD Fallback Specification

**Document Title:** SMS/USSD Fallback Feature Specification
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

---

## 1. Feature Overview

### 1.1 Definition

SMS/USSD Fallback is an offline emergency reporting system that allows users to report emergencies and receive status updates via SMS (Short Message Service) and USSD (Unstructured Supplementary Service Data) when mobile data/internet is unavailable. This is critical infrastructure for the Philippines where natural disasters frequently knock out data networks, and many users rely on basic phones or have limited data connectivity.

### 1.2 Problem Solved

Current emergency reporting requires:
- Mobile data or internet connection
- Smartphone with the app installed
- App to be running/backgrounded

In the Philippines, these scenarios make current app unusable:
- Typhoon knocks out cell towers (data first to fail)
- User has no data load/prepaid exhausted
- Rural areas with poor data but voice/SMS works
- International roaming without data package
- Disaster scenarios where networks are congested

### 1.3 Value Proposition

- **Resilience:** Works when internet fails (common in Philippines disasters)
- **Accessibility:** Works on basic phones (no smartphone required)
- **Universal:** Works on all networks (Globe, Smart, DITO, Sun)
- **Cost-effective:** Uses existing SMS infrastructure
- **Reliable:** SMS has higher delivery rate during network congestion

### 1.4 Goals & Objectives

- Goal 1: Enable emergency reporting via SMS within 60 seconds of sending
- Goal 2: Achieve 99.9% SMS delivery rate during disasters
- Goal 3: Cover 100% of basic phone users in target areas

---

## 2. User Personas

### 2.1 Primary Users

| Persona | Name | Role | How They Use SMS/USSD |
|---------|------|------|----------------------|
| 1 | Mang Jose Reyes | Tricycle Driver | No smartphone, basic phone only |
| 2 | Arlene Martinez | Market Vendor | Prepaid data exhausted |
| 3 | Maria Santos | Citizen | Network down after typhoon |
| 4 | Sgt. Juan Dela Cruz | Police Responder | Data network congested |
| 5 | Elena Rivera | Dispatcher | Needs backup when system fails |
| 6 | Junjun Mañalac | Barangay Tanod | Remote area, weak data signal |
| 7 | Mary Anderson | Tourist | No roaming data |
| 8 | NEW: Aling Nena | Sari-sari Store Owner | Basic phone, low data literacy |
| 9 | NEW: Kapitan Boter | Barangay Captain | Mass notification to constituents |
| 10 | NEW: OFW Family | Family Members | Checking on loved ones |

### 2.2 User Needs

| Persona | Need | Priority |
|---------|------|----------|
| Mang Jose Reyes | Report emergency via SMS from basic phone | Must |
| Arlene Martinez | Send alert when prepaid has no data | Must |
| Maria Santos | Receive updates via SMS when app won't load | Must |
| Junjun Mañalac | Report and receive updates in remote area | Must |
| Mary Anderson | Use emergency when roaming without data | Must |
| Aling Nena | Simple SMS command she can remember | Must |
| Kapitan Boter | Broadcast alert to entire barangay | Should |
| Sgt. Juan Dela Cruz | Receive dispatch via SMS when app fails | Should |
| Elena Rivera | Send mass SMS to all responders | Could |
| OFW Family | Check status of reported emergency | Could |

### 2.3 User Scenarios

#### Scenario 1: Mang Jose Reports Accident via SMS
> Mang Jose witnesses an accident. He doesn't have a smartphone. Using his basic Nokia, he sends "AMBULANCE Taft Ave Manila" to 911-TOYOTA. System responds with confirmation and dispatches ambulance. He receives SMS updates: "Ambulance dispatched, ETA 10 min."

#### Scenario 2: Maria During Typhoon
> A typhoon hits Lucena City. Data networks are down but SMS still works. Maria's smartphone has no connection. She sends "EMERGENCY FLOOD Blue Ridge Subdivision" via SMS. System dispatches responders and sends status updates via SMS.

#### Scenario 3: Mary Tourist - No Roaming Data
> Mary is in El Nido, Palawan. Her data roaming is off. She gets a severe stomachache but can't use the app. She sends "EMERGENCY MEDICAL El Nito Town Proper" via SMS. System dispatches local ambulance.

#### Scenario 4: Arlene - Prepaid No Load
> Arlene's prepaid data is exhausted. She witnesses a fire. She sends "FIRE Tondo Market Street" via SMS. It goes through because she still has SMS credits. System dispatches fire department.

#### Scenario 5: Kapitan Boter - Mass Barangay Alert
> Kapitan Boter needs to alert all residents about an incoming flash flood. He sends "BROADCAST FLOOD WARNING All residents evacuate to designated areas" via special USSD command. System sends SMS to all registered barangay residents.

---

## 3. Process Flow

### 3.1 Main SMS Emergency Reporting Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 SMS EMERGENCY REPORTING FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

START: User needs to report emergency (no data/internet)
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Compose SMS                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ User opens SMS app on ANY phone (smartphone or basic)                       │
│                                                                             │
│ TO: 911-TOYOTA (or short code)                                             │
│                                                                             │
│ MESSAGE FORMAT:                                                             │
│ <EMERGENCY_TYPE> <LOCATION> [DESCRIPTION]                                  │
│                                                                             │
│ EXAMPLES:                                                                   │
│ • "AMBULANCE Taft Ave Manila"                                              │
│ • "FIRE Juan Luna St Tondo"                                                │
│ • "POLICE Robbery Divisoria Mall"                                          │
│ • "EMERGENCY ACCIDENT Cebu City"                                           │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Send SMS                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ User presses send                                                           │
│                                                                             │
│ SMS sent via:                                                               │
│ • Globe network → SMSC → TOYOTA SMS Gateway                                │
│ • Smart network → SMSC → TOYOTA SMS Gateway                                │
│ • DITO network → SMSC → TOYOTA SMS Gateway                                │
│ • Sun network → SMSC → TOYOTA SMS Gateway                                  │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: SMS Gateway Receives                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ TOYOTA SMS Gateway                                                      │ │
│ │ • Validates sender phone number                                         │ │
│ │ • Parses emergency type                                                │ │
│ │ • Extracts location from message                                       │ │
│ │ • Creates incident record                                             │ │
│ │ • Logs for audit trail                                                │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Parse & Classify                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ Message: "AMBULANCE Taft Ave Manila man having chest pain"                 │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ PARSED FIELDS:                                                         │ │
│ │ • Type: AMBULANCE (mapped to Medical Emergency)                        │ │
│ │ • Location: Taft Ave, Manila                                           │ │
│ │ • Description: "man having chest pain"                                │ │
│ │ • Phone: 0912XXX1234 (sender)                                          │ │
│ │ • Network: Globe                                                       │ │
│ │ • Timestamp: 2026-03-13T10:30:00Z                                     │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ IF location unclear:                                                        │
│ • Try to geocode from address                                              │
│ • If failed: Ask user for landmark via SMS                                 │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 5: Create Incident                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ System creates incident:                                                    │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Incident ID: #SMS-2026-0142                                            │ │
│ │ Type: MEDICAL EMERGENCY                                                 │ │
│ │ Source: SMS                                                            │ │
│ │ Location: Taft Ave, Manila                                             │ │
│ │ Reporter: 0912XXX1234                                                  │ │
│ │ Status: DISPATCHED                                                     │ │
│ │ Priority: HIGH (medical)                                               │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 6: Dispatch Responders                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ Standard dispatch flow (see Multi-Agency spec):                             │
│ • Find nearest available responders                                        │
│ • Send push notification to responder apps                                  │
│ • If no app responders: Send SMS to registered responders                  │
│ • Also notify first aiders if medical                                       │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 7: Send Confirmation to Reporter                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ System sends SMS to reporter:                                                │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [TOYOTA EMERGENCY]                                                     │ │
│ │                                                                          │ │
│ │ ✅ Emergency received!                                                 │ │
│ │ Incident: #SMS-2026-0142                                              │ │
│ │ Type: Medical Emergency                                                │ │
│ │ Location: Taft Ave, Manila                                             │ │
│ │                                                                          │ │
│ │ 🚑 Ambulance dispatched.                                               │ │
│ │ ETA: 8 minutes                                                         │ │
│ │                                                                          │ │
│ │ Reply with:                                                            │ │
│ │ • "STATUS" - Get update                                               │ │
│ │ • "STOP" - Cancel                                                     │ │
│ │ • "INFO" - More info                                                  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 8: Status Updates via SMS                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ As situation changes, system sends updates:                                 │
│                                                                             │
│ 8 min later:                                                                │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [TOYOTA EMERGENCY] #SMS-2026-0142                                     │ │
│ │ 🚑 Ambulance en route                                                  │ │
│ │ ETA: 3 minutes                                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ 3 min later:                                                                │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [TOYOTA EMERGENCY] #SMS-2026-0142                                     │ │
│ │ 🚑 Ambulance arrived at location                                       │ │
│ │ Responder: Paramedic Juan Santos                                       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ After resolution:                                                           │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [TOYOTA EMERGENCY] #SMS-2026-0142                                     │ │
│ │ ✅ Incident resolved                                                   │ │
│ │ Thank you for using Toyota Emergency Response                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
END: Emergency reported and managed via SMS
```

### 3.2 USSD Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      USSD EMERGENCY FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

USER DIALS: *123# (USSD Code)
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ USSD Session Initiated                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ TOYOTA EMERGENCY                                        Reply with #  │ │
│ │ ────────────────────────────────────                                   │ │
│ │ 1. Report Emergency                                                 │ │
│ │ 2. Check Status                                                     │ │
│ │ 3. Cancel Emergency                                                 │ │
│ │ 4. My Profile                                                       │ │
│ │ 5. Help                                                             │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
USER REPLIES: 1
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Select Emergency Type                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ SELECT EMERGENCY TYPE                                  Reply with #   │ │
│ │ ────────────────────────────────────                                   │ │
│ │ 1. Police (Crime, Robbery)                                           │ │
│ │ 2. Ambulance (Medical)                                               │ │
│ │ 3. Fire                                                              │ │
│ │ 4. Other Emergency                                                   │ │
│ │ 0. Back                                                              │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
USER REPLIES: 2 (Ambulance)
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Enter Location                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ENTER LOCATION                                                  Reply │ │
│ │ ────────────────────────────────────                                   │ │
│ │ Type your location or landmark:                                     │ │
│ │                                                                     │ │
│ │ Examples:                                                            │ │
│ │ • "Taft Ave Manila"                                                 │ │
│ │ • "SM Mall of Asia"                                                 │ │
│ │ • "Brgy. 10 Tondo"                                                 │ │
│ │                                                                     │ │
│ │ Reply with: 0 to go back                                             │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
USER REPLIES: "Taft Ave near Philippine Christian University"
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Enter Description (Optional)                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ DESCRIPTION (Optional)                                      Reply # │ │
│ │ ────────────────────────────────────                                   │ │
│ │ Briefly describe the emergency:                                       │ │
│ │                                                                     │ │
│ │ Leave blank if not urgent                                            │ │
│ │                                                                     │ │
│ │ Reply with: 0 to go back                                             │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
USER REPLIES: "man chest pain"
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Confirm & Submit                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ CONFIRM EMERGENCY                                        Reply with # │ │
│ │ ────────────────────────────────────                                   │ │
│ │ Type: Ambulance (Medical)                                            │ │
│ │ Location: Taft Ave, Manila                                           │ │
│ │ Description: man chest pain                                          │ │
│ │                                                                     │ │
│ │ 1. CONFIRM - Submit Emergency                                       │ │
│ │ 2. EDIT - Change details                                            │ │
│ │ 0. CANCEL - Go back                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
USER REPLIES: 1 (Confirm)
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 5: Submission & Response                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ✅ EMERGENCY SUBMITTED                                   [End Session]│ │
│ │ ────────────────────────────────────                                   │ │
│ │ Incident: #USSD-2026-0089                                            │ │
│ │ Type: Medical Emergency                                               │ │
│ │ Location: Taft Ave, Manila                                           │ │
│ │                                                                          │ │
│ │ 🚑 Ambulance dispatched                                              │ │
│ │ ETA: 8 minutes                                                        │ │
│ │                                                                          │ │
│ │ You will receive SMS updates.                                         │ │
│ │                                                                          │ │
│ │ Thank you!                                                            │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
END: USSD session complete, incident created
```

### 3.3 Responder Notification via SMS (Fallback)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│           RESPONDER SMS NOTIFICATION FLOW (FALLBACK)                       │
└─────────────────────────────────────────────────────────────────────────────┘

INCIDENT CREATED (from app or SMS)
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Check Responder Availability                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ Find nearest available responders:                                         │
│ • Check responder app status (online)                                       │
│ • If no app responders → Use SMS fallback                                  │
│                                                                             │
│ RESPONDER LIST:                                                             │
│ 1. Police Sgt. Juan - 0917XXX1234 (app online)                             │
│ 2. Ambulance Unit 5 - 0928XXX5678 (app offline - use SMS)                 │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Send SMS to Responder                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ TO: 0928XXX5678 (Ambulance Unit 5)                                         │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [TOYOTA DISPATCH]                                                     │ │
│ │                                                                          │ │
│ │ 🚨 NEW EMERGENCY DISPATCH                                             │ │
│ │ Incident: #EMG-2026-0142                                             │ │
│ │ Type: MEDICAL                                                          │ │
│ │ Location: Taft Ave, Manila                                            │ │
│ │ Landmark: Near PCU                                                     │ │
│ │ Description: man chest pain                                           │ │
│ │ Reporter: 0912XXX1234                                                 │ │
│ │                                                                          │ │
│ │ REPLY WITH:                                                            │ │
│ │ • "ACCEPT" - Accept dispatch                                          │ │
│ │ • "DECLINE" - Decline (provide reason)                                │ │
│ │ • "CALL" - Call reporter                                             │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Responder Response                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│ OPTIONS:                                                                    │
│                                                                             │
│ A) RESPONDS "ACCEPT"                                                       │
│    ┌──────────────────────────────────────────────────────────────────┐   │
│    │ System updates incident status to "ACCEPTED"                   │   │
│    │ Sends confirmation to reporter                                  │   │
│    │ Sends navigation info to responder                              │   │
│    └──────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│ B) RESPONDS "DECLINE"                                                      │
│    ┌──────────────────────────────────────────────────────────────────┐   │
│    │ System logs reason                                              │   │
│    │ Notifies next available responder                               │   │
│    │ If no more responders: notifies dispatcher                     │   │
│    └──────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│ C) NO RESPONSE (timeout 60 seconds)                                       │
│    ┌──────────────────────────────────────────────────────────────────┐   │
│    │ System sends reminder                                           │   │
│    │ After 2nd timeout: dispatch to next responder                    │   │
│    └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Mass Notification Flow (Barangay/Disaster)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MASS NOTIFICATION FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

TRIGGER: Barangay Captain or Dispatcher initiates mass alert
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Compose Message                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Sender: Authorized dispatcher/barangay captain                        │ │
│ │ Format: BROADCAST <type> <message>                                    │ │
│ │                                                                       │ │
│ │ Examples:                                                              │ │
│ │ • "BROADCAST FLOOD Evacuate to higher ground immediately"           │ │
│ │ • "BROADCAST FIRE Do not use elevators, exit building"               │ │
│ │ • "BROADCAST ALLCLEAR Situation normal, return home"                 │ │
│ │ • "BROADCAST MISSING Looking for child, last seen at..."            │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Select Recipients                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ RECIPIENT OPTIONS:                                                     │ │
│ │ 1. All registered users in barangay                                   │ │
│ │ 2. Users within radius (e.g., 1km of location)                        │ │
│ │ 3. Specific user group (first aiders, tanods)                        │ │
│ │ 4. Custom number list                                                 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Send Mass SMS                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ System sends SMS to all selected recipients:                                │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [TOYOTA ALERT]                                                        │ │
│ │ ⚠️ FLOOD WARNING - IMMEDIATE ACTION REQUIRED                          │ │
│ │                                                                          │ │
│ │ Water level rising in Pasig River.                                    │ │
│ │ All residents in Lawa, Binan, and Tunasan                            │ │
│ │ evacuate to designated centers IMMEDIATELY.                          │ │
│ │                                                                          │ │
│ │ Evacuation Centers:                                                   │ │
│ │ • Binan Municipal Hall                                                │ │
│ │ • San Jose Seminary                                                   │ │
│ │                                                                          │ │
│ │ For emergency assistance: 911-TOYOTA                                 │ │
│ │                                                                          │ │
│ │ Do not delay. Leave now.                                             │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ Send to: 5,000 recipients                                                   │
│ Delivery rate: ~98%                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Track Delivery                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ DELIVERY REPORT:                                                      │ │
│ │ • Sent: 5,000                                                         │ │
│ │ • Delivered: 4,890 (97.8%)                                           │ │
│ │ • Failed: 110                                                         │ │
│ │ • Pending: 0                                                          │ │
│ │                                                                          │ │
│ │ Failed numbers logged for retry via alternative channel              │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.5 Status Check Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STATUS CHECK FLOW                                         │
└─────────────────────────────────────────────────────────────────────────────┘

USER SENDS: "STATUS" or "STATUS #INCIDENT-ID"
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ System looks up incident                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ Find incident by:                                                           │
│ • Incident ID (if provided)                                                │
│ • Phone number (if no ID, show last 3 incidents)                          │
│ • OR Show "No recent incidents found"                                      │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Send status response                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [TOYOTA EMERGENCY] Status                                             │ │
│ │ ────────────────────────────────────                                   │ │
│ │ Incident: #SMS-2026-0142                                             │ │
│ │ Type: Medical                                                         │ │
│ │ Status: 🚑 EN ROUTE                                                   │ │
│ │ Location: Taft Ave, Manila                                            │ │
│ │ Responder: Paramedic Juan Santos                                     │ │
│ │ ETA: 3 minutes                                                       │ │
│ │ Last Update: 2 minutes ago                                           │ │
│ │                                                                          │ │
│ │ Reply: "MAP" for location link                                        │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
```

---

## 4. User Stories

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| US-SMS-001 | As a user with no data, I want to report emergency via SMS so that I can still get help | Given no internet, When user sends SMS to 911-TOYOTA, Then incident is created and help dispatched |
| US-SMS-002 | As a user who reported via SMS, I want to receive status updates via SMS so that I know when help is coming | Given emergency reported, When status changes, Then user receives SMS update |
| US-SMS-003 | As a responder without app access, I want to receive dispatch via SMS so that I can still respond | Given incident requires responder, When app offline, Then responder receives SMS dispatch |
| US-SMS-004 | As a user, I want to check emergency status via SMS so that I know what's happening | Given emergency reported, When user sends "STATUS", Then they receive current status |
| US-SMS-005 | As a barangay captain, I want to send mass alerts so that all residents are informed | Given emergency, When captain sends BROADCAST, Then SMS sent to all residents |
| US-SMS-006 | As a tourist without data, I want to use emergency via SMS so that I can get help | Given no roaming data, When tourist sends SMS, Then emergency is processed |
| US-SMS-007 | As a user who sent wrong location, I want to correct via SMS so that responders go to right place | Given incorrect location, When user sends "UPDATE location", Then incident location is updated |
| US-SMS-008 | As a user, I want to cancel false alarm via SMS so that responders aren't wasted | Given accidental report, When user sends "STOP", Then incident is cancelled |

---

## 5. Functional Requirements

### 5.1 Core Features

| ID | Requirement | Description | Priority |
|----|-------------|-------------|----------|
| FR-SMS-001 | SMS Reception | Receive emergency reports via SMS to designated number | Must |
| FR-SMS-002 | SMS Auto-Reply | Send automatic confirmation and status updates | Must |
| FR-SMS-003 | Location Parsing | Extract location from free-text SMS | Must |
| FR-SMS-004 | Emergency Classification | Parse emergency type from SMS content | Must |
| FR-SMS-005 | Status Command | Allow users to check status via SMS | Must |
| FR-SMS-006 | Cancel Command | Allow users to cancel false reports | Must |
| FR-SMS-007 | USSD Menu | Interactive USSD emergency reporting | Should |
| FR-SMS-008 | Responder SMS Dispatch | Notify responders via SMS when app unavailable | Should |
| FR-SMS-009 | Mass Notification | Broadcast to multiple users | Should |
| FR-SMS-010 | Location Link | Send Google Maps link in response | Could |

### 5.2 SMS Commands Reference

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SMS COMMAND REFERENCE                                │
└─────────────────────────────────────────────────────────────────────────────┘

TO: 911-TOYOTA (or short code)

EMERGENCY COMMANDS:
┌─────────────────────────────────────────────────────────────────────────────┐
│ COMMAND                    │ EXAMPLE                          │ DESCRIPTION │
├────────────────────────────┼──────────────────────────────────┼─────────────│
│ <TYPE> <LOCATION>          │ AMBULANCE Taft Ave Manila        │ Report     │
│                            │ FIRE Juan Luna St Tondo          │ emergency  │
│                            │ POLICE Robbery Divisoria         │             │
├────────────────────────────┼──────────────────────────────────┼─────────────│
│ EMERGENCY <TYPE>           │ EMERGENCY ACCIDENT Cebu City    │ Alternate  │
│ <LOCATION> [DESC]          │ EMERGENCY FIRE Binangonan       │ format     │
├────────────────────────────┼──────────────────────────────────┼─────────────│
│ BROADCAST <TYPE> <MSG>    │ BROADCAST FLOOD Evacuate now    │ Mass alert │
│ [LOCATION]                 │ BROADCAST FIRE Exit building    │ (authorized)│
├────────────────────────────┼──────────────────────────────────┼─────────────│
│ STATUS                     │ STATUS                           │ Check last │
│ STATUS <ID>                │ STATUS #SMS-2026-0142           │ incident   │
├────────────────────────────┼──────────────────────────────────┼─────────────│
│ STOP                       │ STOP                            │ Cancel     │
│ STOP <ID>                  │ STOP #SMS-2026-0142            │ emergency  │
├────────────────────────────┼──────────────────────────────────┼─────────────│
│ INFO <ID>                  │ INFO #SMS-2026-0142            │ Get more   │
│                            │                                 │ details    │
├────────────────────────────┼──────────────────────────────────┼─────────────│
│ MAP <ID>                   │ MAP #SMS-2026-0142              │ Get map    │
│                            │                                 │ link       │
├────────────────────────────┼──────────────────────────────────┼─────────────│
│ UPDATE <LOCATION>          │ UPDATE Taft Ave near MRT       │ Update     │
│ UPDATE <ID> <LOCATION>     │ UPDATE #SMS-2026-0142 Taft Ave │ location   │
├────────────────────────────┼──────────────────────────────────┼─────────────│
│ HELP                       │ HELP                            │ Get help   │
│                            │                                 │ commands   │
└────────────────────────────┴──────────────────────────────────┴─────────────┘

EMERGENCY TYPES MAPPED:
┌─────────────────────────────────────────────────────────────────────────────┐
│ KEYWORD          │ MAPPED TO          │ PRIORITY                          │
├──────────────────┼────────────────────┼───────────────────────────────────│
│ AMBULANCE        │ Medical Emergency  │ High                              │
│ MEDICAL          │ Medical Emergency   │ High                              │
│ MED              │ Medical Emergency   │ High                              │
├──────────────────┼────────────────────┼───────────────────────────────────│
│ FIRE             │ Fire Emergency      │ High                              │
│ BURN             │ Fire Emergency      │ High                              │
│ FLAME            │ Fire Emergency      │ High                              │
├──────────────────┼────────────────────┼───────────────────────────────────│
│ POLICE           │ Police Emergency    │ Medium                            │
│ ROBBERY          │ Police Emergency    │ Medium                            │
│ CRIME            │ Police Emergency    │ Medium                            │
│ THEFT            │ Police Emergency    │ Medium                            │
├──────────────────┼────────────────────┼───────────────────────────────────│
│ ACCIDENT         │ Traffic Accident    │ Medium                            │
│ CRASH            │ Traffic Accident    │ Medium                            │
│ VEHICLE          │ Traffic Accident    │ Medium                            │
├──────────────────┼────────────────────┼───────────────────────────────────│
│ FLOOD            │ Natural Disaster    │ High                              │
│ EARTHQUAKE       │ Natural Disaster    │ High                              │
│ TYPHOON          │ Natural Disaster    │ High                              │
└──────────────────┴────────────────────┴───────────────────────────────────┘
```

### 5.3 Data Handling

| Data Element | Source | Storage | Retention |
|--------------|--------|--------|----------|
| SMS Message | User SMS | SMS Log DB | 2 years |
| Parsed Incident | System | Incident DB | 5 years |
| Delivery Status | SMS Gateway | Delivery Log | 1 year |
| Mass Broadcast | Admin | Broadcast Log | 2 years |

---

## 6. UI/UX Requirements

### 6.1 SMS Response Templates

#### Confirmation (Immediate)
```
[TOYOTA EMERGENCY]
✅ Emergency received!
Incident: #SMS-2026-0142
Type: [TYPE]
Location: [LOCATION]

🚑 Dispatched: [YES/NO]
ETA: [TIME] minutes

Reply: STATUS, STOP, HELP
```

#### En Route Update
```
[TOYOTA EMERGENCY] #SMS-2026-0142
🚑 [AGENCY] EN ROUTE
ETA: [TIME] minutes
Responder: [NAME]

Reply: MAP for location
```

#### Arrived Update
```
[TOYOTA EMERGENCY] #SMS-2026-0142
✅ [AGENCY] ARRIVED AT LOCATION
Responder: [NAME]
Contact: [PHONE]

Incident being handled.
```

#### Resolved
```
[TOYOTA EMERGENCY] #SMS-2026-0142
✅ INCIDENT RESOLVED

Thank you for using
Toyota Emergency Response

Stay safe! 🙏
```

### 6.2 USSD Menu Screens

| Screen # | Title | Content | Navigation |
|----------|-------|---------|------------|
| 1 | Main Menu | 1.Report 2.Status 3.Cancel 4.Help | Reply 1-4 |
| 2 | Type Select | 1.Police 2.Ambulance 3.Fire 4.Other | Reply 1-4 |
| 3 | Location | "Enter location/landmark" | Free text |
| 4 | Description | "Brief description (optional)" | Free text |
| 5 | Confirm | Summary + 1.Confirm 2.Edit | Reply 1-2 |
| 6 | Submitted | Confirmation + incident ID | End session |

---

## 7. Technical Requirements

### 7.1 Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SMS/USSD TECHNICAL ARCHITECTURE                          │
└─────────────────────────────────────────────────────────────────────────────┘

                        ┌─────────────────────┐
                        │   Mobile Network     │
                        │   (Globe/Smart/      │
                        │    DITO/Sun)         │
                        └──────────┬────────────┘
                                   │
                    SMS/USSD       │
                    Traffic        │
                                   ▼
                        ┌─────────────────────┐
                        │    SMS Gateway       │
                        │  (Telecom Partner)   │
                        │                      │
                        │ • SMSC connection   │
                        │ • USSD handling     │
                        │ • Number validation  │
                        └──────────┬────────────┘
                                   │
                                   │ HTTPS/API
                                   ▼
                        ┌─────────────────────┐
                        │   TOYOTA Backend     │
                        │                      │
                        │ ┌─────────────────┐ │
                        │ │ SMS Parser       │ │
                        │ │ Service          │ │
                        │ └────────┬────────┘ │
                        │          │          │
                        │ ┌────────┴────────┐ │
                        │ │ Incident        │ │
                        │ │ Manager         │ │
                        │ └────────┬────────┘ │
                        │          │          │
                        │ ┌────────┴────────┐ │
                        │ │ Notification    │ │
                        │ │ Service         │ │
                        │ └────────┬────────┘ │
                        └─────────┼───────────┘
                                  │
           ┌──────────────────────┼──────────────────────┐
           │                      │                      │
           ▼                      ▼                      ▼
    ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
    │   Responder │       │   Reporter  │       │   Mass      │
    │   App       │       │   Phone     │       │   Recipients│
    │   (push)    │       │   (SMS)     │       │   (SMS)     │
    └─────────────┘       └─────────────┘       └─────────────┘
```

### 7.2 SMS Gateway Specification

| Component | Specification |
|-----------|---------------|
| Protocol | SMPP 3.4 / HTTP API |
| Encoding | UTF-8, GSM 7-bit |
| Max Message Length | 160 characters (single) / 459 (concatenated) |
| Delivery Receipts | Yes (DLR required) |
| Throughput | 1000 SMS/second minimum |
| Uptime | 99.99% |

### 7.3 USSD Specification

| Component | Specification |
|-----------|---------------|
| Protocol | MAP / SS7 |
| Session Timeout | 60 seconds |
| Menu Depth | Maximum 5 screens |
| Input Type | Numeric / Alphanumeric |
| Character Limit | 182 per screen |

### 7.4 APIs Required

| API | Endpoint | Method | Purpose |
|-----|----------|--------|---------|
| Receive SMS | /api/v1/sms/incoming | POST | Receive from gateway |
| Send SMS | /api/v1/sms/outgoing | POST | Send to users |
| USSD Request | /api/v1/ussd/handle | POST | Handle USSD session |
| Create Incident | /api/v1/incidents | POST | Create from SMS |
| Update Incident | /api/v1/incidents/{id} | PUT | Update from SMS command |
| Broadcast | /api/v1/broadcast | POST | Mass notification |

### 7.5 Network Carrier Requirements

| Carrier | SMS Support | USSD Support | Notes |
|---------|-------------|--------------|-------|
| Globe | ✓ | ✓ | Primary partner |
| Smart | ✓ | ✓ | Primary partner |
| DITO | ✓ | ✓ | Secondary |
| Sun | ✓ | ✓ | Secondary |

---

## 8. Data Models

### 8.1 Incoming SMS Model

```json
{
  "sms": {
    "id": "sms-uuid",
    "from": "639123456789",
    "to": "911TOYOTA",
    "message": "AMBULANCE Taft Ave Manila",
    "timestamp": "2026-03-13T10:30:00Z",
    "network": "Globe",
    "encoding": "GSM7"
  }
}
```

### 8.2 Parsed Incident Model

```json
{
  "incident": {
    "id": "SMS-2026-0142",
    "source": "SMS",
    "type": "MEDICAL_EMERGENCY",
    "location": {
      "raw": "Taft Ave Manila",
      "parsed": {
        "street": "Taft Avenue",
        "city": "Manila",
        "barangay": null
      },
      "coordinates": {
        "lat": 14.5650,
        "lng": 120.9930
      }
    },
    "description": null,
    "reporter": {
      "phone": "639123456789",
      "network": "Globe"
    },
    "status": "DISPATCHED",
    "priority": "HIGH"
  }
}
```

### 8.3 Broadcast Model

```json
{
  "broadcast": {
    "id": "BCAST-2026-0142",
    "type": "FLOOD_WARNING",
    "message": "All residents evacuate to higher ground immediately",
    "sender": "barangay-captain-001",
    "recipients": {
      "type": "LOCATION_RADIUS",
      "center": {"lat": 14.5650, "lng": 120.9930},
      "radius_km": 2
    },
    "counts": {
      "total": 5000,
      "delivered": 4890,
      "failed": 110
    },
    "createdAt": "2026-03-13T10:30:00Z"
  }
}
```

---

## 9. Edge Cases & Error Handling

### 9.1 Edge Cases

| Scenario | Expected Behavior | Priority |
|----------|-------------------|----------|
| SMS sent to wrong format | Reply with help message, suggest correct format | High |
| Location unparseable | Ask user for landmark via SMS | High |
| Phone number blocked | Log error, alert admin | Medium |
| SMS gateway down | Queue messages, retry when restored | High |
| Duplicate report | Detect by phone + time, ask to confirm | Medium |
| Very long message | Truncate, ask for details | Low |
| Non-emergency message | Reply with instructions | Low |
| Responder SMS fails | Retry 3x, then notify by app/push | Medium |

### 9.2 Error Responses

| Error | User Message |
|-------|--------------|
| Invalid format | "Invalid format. Reply: TYPE LOCATION. Example: AMBULANCE Taft Ave Manila" |
| Location unclear | "Location unclear. Please provide landmark or street name." |
| No responders | "Dispatching... No responders immediately available. Please wait." |
| Network error | "Technical issue. Please try again or call emergency services directly." |
| Rate limit | "Too many requests. Please wait 1 minute before retrying." |

---

## 10. Security & Privacy

### 10.1 Security Measures

- Phone number validation
- Sender authentication for broadcasts
- Rate limiting per number (10 SMS/hour)
- SMS content filtering for spam
- Encrypted database storage
- Audit logging for all commands

### 10.2 Privacy Considerations

- Phone numbers stored securely
- Message content retained per legal requirements
- Broadcast recipients protected
- No third-party data sharing

---

## 11. Success Metrics

### 11.1 KPIs

| Metric | Target | Timeline |
|--------|--------|----------|
| SMS delivery rate | >99% | 6 months |
| Average response time | <60 seconds | 6 months |
| User satisfaction | >4.0 | 6 months |
| Broadcast success rate | >95% | 6 months |
| False report rate | <10% | 6 months |

---

## 12. Dependencies

### 12.1 Internal Dependencies

| Dependency | Relationship |
|------------|--------------|
| Incident Management System | Required for incident creation/tracking |
| Responder Database | Required for responder lookup |
| Location Services | Required for address geocoding |

### 12.2 External Dependencies

| Dependency | Provider | Status |
|------------|----------|--------|
| SMS Gateway | Telecom partner | Required |
| USSD Service | Telecom partner | Required |
| SMS Short Code | Government/Telecom | Required |

---

## 13. Implementation Phases

### 13.1 MVP (Phase 1) - Month 1-2

| Feature | Deliverable |
|---------|-------------|
| SMS reception | Receive emergency SMS |
| Basic parsing | Extract type and location |
| Auto-reply | Send confirmation |
| Status command | Reply with status |
| Stop command | Cancel emergency |

### 13.2 Phase 2 - Month 3-4

| Feature | Deliverable |
|---------|-------------|
| USSD menu | Interactive emergency reporting |
| Responder SMS | Notify responders via SMS |
| Broadcast | Mass notification |
| Location link | Google Maps link in response |

### 13.3 Phase 3 - Month 5-6

| Feature | Deliverable |
|---------|-------------|
| Two-way chat | SMS-based communication |
| Multi-language | Support for English/Tagalog |
| Analytics | SMS/USSD usage dashboard |

---

## 14. Testing Requirements

### 14.1 Test Scenarios

| Test | Scenario | Expected |
|------|----------|----------|
| TC-SMS-001 | Send "AMBULANCE Taft Ave" | Incident created, reply sent |
| TC-SMS-002 | Send "STATUS" | Current status returned |
| TC-SMS-003 | Send "STOP" | Incident cancelled |
| TC-SMS-004 | Send invalid format | Error message returned |
| TC-SMS-005 | Send broadcast (admin) | All recipients receive SMS |
| TC-SMS-006 | USSD *123# menu | Menu displayed |
| TC-SMS-007 | Complete USSD flow | Incident created via USSD |

---

## 15. Costs (Reference)

### 15.1 SMS Cost Model

| Item | Cost | Notes |
|------|------|-------|
| Incoming SMS | PHP 0.10-0.15 | Per message received |
| Outgoing SMS | PHP 0.20-0.50 | Per message sent |
| Short Code | PHP 50,000/year | Dedicated number |
| USSD Session | PHP 0.05 | Per session |

### 15.2 Cost Mitigation

- Government partnership for subsidized rates
- Bulk SMS contracts with carriers
- Premium SMS short code option

---

## 16. Appendix

### 16.1 Supported Emergency Types

See Section 5.2 for complete keyword mapping.

### 16.2 Sample Messages

All templates provided in Section 6.1.

---

**Document Status:** Draft
**Last Updated:** 2026-03-13

---

*This specification is part of the Toyota Emergency Response Platform project.*
