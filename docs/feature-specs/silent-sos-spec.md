# Silent SOS Specification

**Document Title:** Silent SOS Feature Specification
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

Silent SOS is a covert emergency activation system that allows users to send emergency alerts without making sound or visible interactions. When activated, the system captures and transmits critical data (location, status, optional audio/image) to emergency responders while maintaining complete silence and discretion.

### 1.2 Problem Solved

Current emergency reporting requires users to:
- Make phone calls (impossible when being monitored or in danger)
- Speak aloud (dangerous in abduction/hostage scenarios)
- Unlock phone and navigate apps (too slow in critical situations)
- Touch screen visibly (risky in dangerous situations)

### 1.3 Value Proposition

- **Life-saving:** Enables emergency reporting when voice/sound is impossible or dangerous
- **Discreet:** No visible indicators that emergency is being reported
- **Fast:** Activates in under 2 seconds with single gesture
- **Comprehensive:** Sends location, status, and contextual data automatically

### 1.4 Goals & Objectives

- Goal 1: Enable emergency reporting in 100% of dangerous situations where user cannot speak
- Goal 2: Achieve sub-3-second activation time from gesture to dispatch
- Goal 3: Maintain zero false activations while allowing ease of legitimate use

---

## 2. User Personas

### 2.1 Primary Users

| Persona | Name | Role | How They Use Silent SOS |
|---------|------|------|--------------------------|
| 1 | Maria Santos | Citizen/Mother | Being followed, suspicious vehicle |
| 2 | Marites Bulalakaw | Witness to Abuse | Needs to stay hidden while reporting |
| 3 | Mang Jose Reyes | Tricycle Driver | Robbed at knifepoint |
| 4 | Junjun Mañalac | Barangay Tanod | Outnumbered, cannot call for backup |
| 5 | Dr. Sarah Binay | First Aider | Attacked while helping victim |
| 6 | Mary Anderson | Tourist | Abducted or being followed |
| 7 | NEW: Lolo Juan | Elderly Citizen | Cannot run, cannot speak loudly |
| 8 | NEW: Ana | Hearing Impaired | Cannot call, uses text only |
| 9 | NEW: Paolo | Student | School emergency, silent panic button |
| 10 | NEW: Jennifer | Solo Traveler | Dangerous situation abroad |

### 2.2 User Needs

| Persona | Need | Priority |
|---------|------|----------|
| Marites Bulalakaw | Report domestic violence without abuser knowing | Must |
| Mang Jose Reyes | Send location when robbed at gun/knife point | Must |
| Junjun Mañalac | Call for backup silently when outnumbered | Must |
| Maria Santos | Alert police when being followed | Must |
| Lolo Juan | Press single button for help after fall | Must |
| Ana | Silent vibration + text alert capability | Must |
| Jennifer | Send location to authorities when in danger | Must |
| Dr. Sarah Binay | Silent alert when attacked while helping | Should |
| Mary Anderson | Silent SOS works internationally | Should |
| Paolo | Discreet panic button in school | Could |

### 2.3 User Scenarios

#### Scenario 1: Marites Reports DV Anonymously
> Marites hears violence next door but the abuser is just outside. She cannot speak or make a call. Using Silent SOS, she activates with a quick triple-tap pattern. System sends her location, marks it as SILENT EMERGENCY, and dispatches WCPD (Women's and Children's Protection Desk) silently.

#### Scenario 2: Mang Jose Robbed
> Mang Jose is held up at knifepoint. When the robber looks away momentarily, he shakes his phone vigorously (Silent SOS activation). System captures his location, sends silent alert to police with his exact position.

#### Scenario 3: Junjun Outnumbered
> Junjun encounters 3 armed suspects. His radio is dead. He taps the hidden power button 3 times. System sends his location to nearby tanods and PNP without making any sound.

#### Scenario 4: Lolo Juan Falls
> Lolo Juan (75 years old) falls in his bathroom. He cannot reach his phone to call. He uses voice command "Help me" (if phone is nearby). System recognizes emergency voice pattern and sends alert.

#### Scenario 5: Student Emergency
> Paolo sees a fight escalating in school. He activates Silent SOS under his desk with a quick double-tap pattern. School security receives silent alert with location in school building.

---

## 3. Process Flow

### 3.1 Main Silent SOS Activation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SILENT SOS ACTIVATION FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

START: User in Dangerous Situation
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Activate Silent SOS                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ User performs activation gesture:                                          │
│ • Long press power button (3 seconds)                                      │
│ • OR Shake phone vigorously (3 shakes in 2 seconds)                        │
│ • OR Quick tap pattern (3-5 taps)                                          │
│ • OR Voice command "Help me" / "Emergency"                                 │
│ • OR Hardware button (if configured)                                       │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Background Activation (No UI Change)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ • App activates in background (if not running)                             │
│ • Screen remains OFF or shows normal lock screen                           │
│ • NO haptic feedback (or subtle single vibration)                          │
│ • NO sound                                                                  │
│ • NO notification to user                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Data Capture                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ System captures (automatically, silently):                                  │
│ ┌──────────────────┬──────────────────┬──────────────────┐                  │
│ │  LOCATION        │  DEVICE STATUS   │  USER PROFILE    │                  │
│ │  • Current GPS   │  • Battery level │  • Name          │                  │
│ │  • Accuracy      │  • Signal strength│ • Phone         │                  │
│ │  • Altitude      │  • Network type  │  • Role          │                  │
│ │  • Movement      │  • Timestamp     │  • Medical ID    │                  │
│ └──────────────────┴──────────────────┴──────────────────┘                  │
│                                                                             │
│ OPTIONAL (if user configured):                                              │
│ ┌──────────────────┬──────────────────┐                                      │
│ │  CAMERA          │  AUDIO           │                                      │
│ │  • Single frame  │  • 10 sec ambient│                                      │
│ │  • Front camera  │  • Microphone    │                                      │
│ │  • No flash      │  • Background    │                                      │
│ └──────────────────┴──────────────────┘                                      │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Silent Alert Transmission                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Compress and encrypt captured data                                        │
│ • Send via most available channel (WiFi > Mobile Data > SMS)                │
│ • If no network: Queue and retry every 30 seconds                          │
│ • Mark incident as: SILENT/SUSPICIOUS PRIORITY                              │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 5: Server Processing                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ Server receives:                                                             │
│ • Decrypt and parse payload                                                │
│ • Extract location, classify emergency type                                │
│ • Check for previous similar incidents (pattern detection)                  │
│ • Assign priority level based on:                                          │
│   - Location accuracy                                                       │
│   - Movement pattern (stationary vs moving)                                 │
│   - Number of Silent SOS activations in area                               │
│   - Time of day                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 6: Dispatch                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────────────────┐   │
│ │ DISPATCH RULES FOR SILENT SOS                                        │   │
│ ├───────────────────────────────────────────────────────────────────────┤   │
│ │ 1. ALWAYS dispatch Police (silent approach preferred)                │   │
│ │ 2. If medical emergency suspected → also dispatch Ambulance         │   │
│ │ 3. If fire/rescue → dispatch Fire + Ambulance                       │   │
│ │ 4. ALWAYS include nearest First Aider (if medical)                  │   │
│ │ 5. If moving (abduction suspicion) → track location continuously    │   │
│ └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│ Notify responders with:                                                     │
│ ⚠️ SILENT EMERGENCY - DO NOT APPROACH WITH SIRENS                          │
│ Location: [coordinates]                                                     │
│ User Status: [stationary/moving/unknown]                                   │
│ Last Update: [timestamp]                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 7: Responder Notification                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Responders receive alert:                                                   │
│ • SILENT MODE indicator (no siren until scene is safe)                    │
│ • Exact GPS location                                                       │
│ • User movement pattern (if tracking)                                      │
│ • Approach instructions                                                    │
│ • Contact method: Silent call option                                        │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 8: Continuous Tracking (If Moving)                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ IF user is moving (abduction suspicion):                                    │
│ ┌──────────────────┐                                                       │
│ │ • Update location│                                                       │
│ │   every 30 sec   │                                                       │
│ │ • Notify nearest │                                                       │
│ │   responders    │                                                       │
│ │ • Maintain       │                                                       │
│ │   tracking log  │                                                       │
│ └──────────────────┘                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
END: Emergency Services Dispatched
```

### 3.2 Responder View Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   RESPONDER SILENT SOS VIEW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

RECEIVER: Responder Phone/App
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ ALERT TYPE: ⚠️ SILENT EMERGENCY (HIGH PRIORITY)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ⚠️  SILENT EMERGENCY - DO NOT USE SIRENS                              │ │
│ │                                                                           │ │
│ │ Incident ID: #SILENT-2026-0142                                         │ │
│ │ Type: SUSPICIOUS / ABDUCTION / DANGER                                  │ │
│ │ Priority: 🔴 HIGH                                                        │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ LOCATION                                                                    │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 📍 14.5995°N, 120.9842°E                                               │ │
│ │ Street: Taft Avenue, Malate, Manila                                     │ │
│ │ Landmark: Near 7-Eleven                                                │ │
│ │ Distance: 0.8 km away                                                  │ │
│ │ Accuracy: ±5 meters                                                    │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ USER STATUS                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Status: MOVING (last 2 min)                                            │ │
│ │ Direction: Northbound on Taft Ave                                       │ │
│ │ Last Update: 45 seconds ago                                           │ │
│ │ Battery: 34%                                                          │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ RECOMMENDED APPROACH                                                        │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 1. Approach quietly, no sirens                                         │ │
│ │ 2. Observe from distance before engaging                               │ │
│ │ 3. Look for user at exact coordinates                                 │ │
│ │ 4. If user moving, follow tracking updates                            │ │
│ │ 5. Use silent communication when in contact                           │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ACTIONS                                                                     │
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐           │
│ │  📞 SILENT CALL │ │  📍 NAVIGATE    │ │  ✓ ACKNOWLEDGE  │           │
│ └──────────────────┘ └──────────────────┘ └──────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 User Confirmation Flow (Post-Safety)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              POST-SAFETY CONFIRMATION FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

SCENARIO: User is now safe and wants to confirm/deactivate
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ User opens app (normal mode)                                                │
│ OR                                                                             │
│ User replies to confirmation SMS: "IM SAFE"                                 │
│ OR                                                                             │
│ User enters PIN to deactivate                                               │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ System shows:                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ "We detected a Silent SOS alert. Are you safe?"                        │ │
│ │                                                                           │ │
│ │ [YES, I'M SAFE]    [NO, STILL NEED HELP]    [CALL ME]                  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ├─────────────────────────┬─────────────────────────┐
      ▼                         ▼                         ▼
┌──────────────┐        ┌──────────────┐         ┌──────────────┐
│ YES Selected │        │ NO Selected  │         │ CALL ME     │
└──────────────┘        └──────────────┘         └──────────────┘
      │                         │                         │
      ▼                         ▼                         ▼
┌──────────────┐        ┌──────────────┐         ┌──────────────┐
│ Close incident│        │ Re-alert    │         │ Connect to  │
│ Log duration │        │ responders  │         │ support     │
└──────────────┘        └──────────────┘         └──────────────┘
```

### 3.4 False Activation Detection Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              FALSE ACTIVATION DETECTION FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

Activation Detected
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Check Activation Context                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ Factors to evaluate:                                                        │
│ ┌─────────────────────┬────────────────────────────────────────────────┐  │
│ │ Factor              │ Check                                          │  │
│ ├─────────────────────┼────────────────────────────────────────────────┤  │
│ │ Location history   │ At home/known safe location?                   │  │
│ │ Time of activation │ Late night vs daytime?                        │  │
│ │ Device movement    │ In pocket, walking, or stationary?             │  │
│ │ Recent app usage   │ Accidental trigger while using phone?         │  │
│ │ User history       │ Previous false activations?                     │  │
│ └─────────────────────┴────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Decision Point                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐      High Risk       ┌─────────────┐                        │
│ │ LOW RISK   │ ◄──────────────────► │ HIGH RISK   │                        │
│ │ (Proceed)  │      (Verify First)   │ (Dispatch)  │                        │
│ └─────────────┘                       └─────────────┘                        │
│      │                                   │                                    │
│      ▼                                   ▼                                    │
│ ┌──────────────┐                  ┌──────────────┐                           │
│ │ Send prompt: │                  │ Dispatch     │                           │
│ │ "Accidental? │                  │ immediately  │                           │
│ │ Reply YES"   │                  │ + send       │                           │
│ └──────────────┘                  │ confirmation │                           │
│                                   │ request      │                           │
│                                   └──────────────┘                           │
```

### 3.5 Edge Case: No Network Connectivity

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              OFFLINE SILENT SOS FLOW                                         │
└─────────────────────────────────────────────────────────────────────────────┘

Activation Detected
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Check Network Availability                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│      │                                                                   │
│      ├──────────────────┬──────────────────┐                              │
│      ▼                  ▼                  ▼                              │
│  ┌────────┐         ┌────────┐         ┌────────┐                         │
│  │  WiFi  │         │Mobile  │         │  NONE  │                         │
│  │ Online │         │  Data  │         │Offline │                         │
│  └────┬───┘         └────┬───┘         └────┬───┘                         │
│       │                 │                  │                              │
│       ▼                 ▼                  ▼                              │
│ ┌──────────┐      ┌──────────┐       ┌──────────────────┐                 │
│ │ Send     │      │ Send     │       │ Queue alert      │                 │
│ │ immediately│     │ immediately│       │ Store locally   │                 │
│ └──────────┘      └──────────┘       │ Retry every 30s  │                 │
│                                     │ Show: "Attempting │                 │
│                                     │ to send..."     │                 │
│                                     │ (silent, no UI)  │                 │
│                                     └────────┬─────────┘                 │
│                                              │                             │
│                                     ┌────────┴─────────┐                   │
│                                     ▼                 ▼                    │
│                               ┌──────────┐      ┌──────────┐              │
│                               │ Network  │      │ Still    │              │
│                               │ restored │      │ offline  │              │
│                               │ Send NOW │      │ after 5m │              │
│                               └──────────┘      └────┬─────┘              │
│                                                     │                      │
│                                                     ▼                      │
│                                            ┌──────────────────┐            │
│                                            │ Switch to SMS    │            │
│                                            │ as fallback      │            │
│                                            └──────────────────┘            │
```

---

## 4. User Stories

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| US-001 | As a user in danger, I want to activate emergency alert without making sound so that I can get help without alerting my attacker | Given user is in silent danger, When they perform silent gesture, Then alert is sent within 3 seconds with no sound |
| US-002 | As a user who accidentally triggered Silent SOS, I want to cancel the alert so that responders aren't dispatched unnecessarily | Given accidental activation, When user replies "CANCEL" or "YES" (to accidental prompt), Then incident is cancelled |
| US-003 | As a responder, I want to know if a Silent SOS user is moving so that I can track them | Given Silent SOS activated with movement, When user is moving, Then responder sees movement direction and updates |
| US-004 | As a user who is now safe, I want to confirm my status so that responders know I no longer need urgent help | Given Silent SOS dispatched, When user confirms "SAFE", Then responders are notified and incident is marked resolved |
| US-005 | As a hearing-impaired user, I want Silent SOS to work with vibration only so that I can use it | Given user has hearing impairment, When Silent SOS activates, Then only vibration feedback is used |
| US-006 | As a user in area with no network, I want my Silent SOS to queue and send when network returns | Given no network at activation, When network becomes available, Then alert is sent automatically |
| US-007 | As a responder, I want to approach a Silent SOS location without sirens so that I don't alert suspects | Given Silent SOS dispatch, When responder receives alert, Then alert indicates SILENT APPROACH required |

---

## 5. Functional Requirements

### 5.1 Core Features

| ID | Requirement | Description | Priority |
|----|-------------|-------------|----------|
| FR-SS-001 | Gesture Activation | Allow emergency activation via long-press power, shake, or tap pattern without unlocking phone | Must |
| FR-SS-002 | Background Operation | Silent SOS must work even when app is not running or phone is locked | Must |
| FR-SS-003 | Silent Transmission | Alert must be sent without any sound, vibration (or minimal), or visual indication | Must |
| FR-SS-004 | Location Capture | Capture and transmit precise GPS coordinates automatically | Must |
| FR-SS-005 | Continuous Tracking | If user is moving, update location every 30 seconds | Should |
| FR-SS-006 | Silent Dispatch | Mark incidents as silent approach required for responders | Must |
| FR-SS-007 | Post-Safety Confirmation | Allow user to confirm safety after incident | Must |
| FR-SS-008 | False Activation Prevention | Detect and prompt for accidental activations | Should |
| FR-SS-009 | Offline Queue | Queue alerts when no network, retry when available | Must |
| FR-SS-010 | Optional Audio/Photo | Allow optional capture of 10-second audio or single photo | Could |

### 5.2 Feature Behavior

#### Activation Methods

| Method | Trigger | Configuration | Availability |
|--------|---------|---------------|--------------|
| Power Button Long Press | Press 3 seconds | Default enabled | All users |
| Shake Vigorously | 3 shakes in 2 seconds | Default enabled | All users |
| Quick Tap Pattern | 3-5 rapid taps | Configurable pattern | Optional |
| Voice Command | "Help" or "Emergency" | Requires permission | Optional |
| Hardware Button | Physical button press | Device-specific | Optional |

#### Data Captured Per Activation

| Data Field | Required | Source | Format |
|------------|----------|--------|--------|
| GPS Latitude | Yes | Device GPS | Decimal degrees |
| GPS Longitude | Yes | Device GPS | Decimal degrees |
| Accuracy | Yes | Device GPS | Meters |
| Altitude | No | Device GPS | Meters |
| Timestamp | Yes | System | ISO 8601 |
| Battery Level | Yes | System | Percentage |
| Network Type | Yes | System | WiFi/4G/3G/2G/None |
| Movement Status | Yes | Device sensors | Stationary/Moving/Unknown |
| User ID | If registered | App data | UUID |
| User Name | If registered | App data | String |
| Medical ID | If configured | App data | JSON |

### 5.3 Data Handling

| Data Element | Source | Storage | Retention |
|--------------|--------|--------|----------|
| Silent SOS Alert | User device | Emergency DB | 2 years |
| Location History | User device | Tracking DB | 30 days |
| Responder Actions | Responder app | Incident DB | 5 years |
| Audio/Photo (optional) | User device | Secure Storage | Until resolved + 30 days |

---

## 6. UI/UX Requirements

### 6.1 Screen Structure

| Screen | Purpose | Key Elements |
|--------|---------|--------------|
| Silent Settings | Configure activation methods | Toggle switches, test button |
| Silent Alert (system) | Minimal/confirmation after safety | Safe/Cancel/Call buttons |
| Responder Silent View | Display Silent SOS details | Map, location, approach instructions |

### 6.2 UI Components

#### Responder Alert Card

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚠️ SILENT EMERGENCY                                                        │
│ ─────────────────────────────────                                          │
│ ID: #SILENT-2026-0142                                                      │
│ Type: SUSPICIOUS INCIDENT                                                  │
│ Priority: 🔴 HIGH                                                          │
│                                                                             │
│ 📍 Location: Taft Ave, Malate, Manila                                      │
│    14.5995°N, 120.9842°E                                                   │
│    Accuracy: ±5m | Distance: 0.8km                                         │
│                                                                             │
│ 👤 User Status: MOVING (Northbound)                                        │
│    Last Update: 45 sec ago | Battery: 34%                                 │
│                                                                             │
│ ⚠️ APPROACH WITHOUT SIRENS                                                 │
│                                                                             │
│ [📞 SILENT CALL]  [📍 NAVIGATE]  [✓ CONFIRM]                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Visual Design

| Element | Specification |
|---------|---------------|
| Primary Color | #FA5151 (Alert Red) |
| Secondary Color | #191919 (Dark) |
| Silent Indicator | ⚠️ Icon + Yellow warning |
| Status Colors | Stationary: Green, Moving: Orange, Unknown: Gray |
| Typography | System sans-serif, 14-18px |
| Animation | None (silent mode) |

### 6.4 Interactions

| Interaction | Behavior |
|-------------|----------|
| Responder views alert | Real-time map update every 30 seconds |
| User confirms safe | Single vibration confirmation |
| False activation prompt | Silent vibration only |
| Alert sent successfully | No feedback (by design) |

---

## 7. Technical Requirements

### 7.1 Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SILENT SOS TECHNICAL ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ┌─────────────────────┐
                                    │   Emergency Server   │
                                    │   (Cloud Backend)   │
                                    └──────────┬──────────┘
                                               │
                    ┌───────────────────────────┼───────────────────────────┐
                    │                           │                           │
                    ▼                           ▼                           ▼
        ┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
        │   Public App       │       │   Responder App   │       │   Dispatcher      │
        │   (Silent SOS)    │       │   (Alert View)    │       │   Dashboard       │
        └─────────┬─────────┘       └─────────┬─────────┘       └─────────┬─────────┘
                  │                             │                             │
                  │                             │                             │
        ┌─────────┴─────────┐           ┌─────────┴─────────┐               │
        │ Background        │           │ Real-time          │               │
        │ Service           │           │ Notification        │               │
        │ (Always running)  │           │ + Map Update        │               │
        └───────────────────┘           └─────────────────────┘               │


SYSTEM COMPONENTS:
┌─────────────────────────────────────────────────────────────────────────────┐
│ COMPONENT                     │ RESPONSIBILITY                            │
├───────────────────────────────┼────────────────────────────────────────────┤
│ Background Service (Android)  │ Monitor gestures, capture data            │
│ Background Task (iOS)         │ Monitor gestures, capture data            │
│ Location Manager              │ GPS capture, continuous tracking          │
│ Network Monitor               │ Detect connectivity, queue offline        │
│ Encryption Module             │ E2E encrypt payload                       │
│ SMS Gateway (fallback)        │ Send via SMS if data fails                │
│ Push Notification Service     │ FCM/APNs for responder alerts              │
│ Incident Manager              │ Create, track, resolve incidents           │
│ Tracking Service              │ Update location for moving users           │
└───────────────────────────────┴────────────────────────────────────────────┘
```

### 7.2 APIs Required

| API | Endpoint | Method | Purpose |
|-----|----------|--------|---------|
| Create Incident | /api/v1/incidents | POST | Create silent SOS incident |
| Update Location | /api/v1/incidents/{id}/location | PUT | Update user location |
| Confirm Safety | /api/v1/incidents/{id}/confirm | POST | User confirms safe |
| Cancel Incident | /api/v1/incidents/{id}/cancel | POST | Cancel false activation |
| Get Incident | /api/v1/incidents/{id} | GET | Fetch incident details |
| Notify Responders | /api/v1/notifications/silent | POST | Alert responders |

### 7.3 Integrations

| Integration | Purpose | Data Exchanged |
|-------------|---------|----------------|
| FCM/APNs | Push notifications to responders | Incident details, location |
| Google Maps | Location display | Coordinates, directions |
| SMS Gateway | Offline fallback | Incident via SMS |
| Device Sensors | Movement detection | Accelerometer, gyroscope |

### 7.4 Platform-Specific Requirements

#### Android
- Background service with foreground notification (required for Android 8+)
- Accessibility service for gesture detection
- Location permission with "always" access
- Wake lock for background processing

#### iOS
- Background app refresh
- LocationAlways permission
- Push notification with content-available
- Significant location change monitoring

### 7.5 Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Activation to Send | <3 seconds | Time from gesture to network request |
| Location Accuracy | <10 meters | GPS accuracy when available |
| Notification to Responder | <5 seconds | Server push to responder device |
| Location Update Rate | 30 seconds | When user is moving |
| Offline Queue Retry | 30 seconds | Retry interval when offline |

---

## 8. Data Models

### 8.1 Silent SOS Incident

```json
{
  "incident": {
    "id": "SILENT-2026-0142",
    "type": "SILENT_SOS",
    "priority": "HIGH",
    "status": "ACTIVE",
    "createdAt": "2026-03-13T10:30:00Z",
    "updatedAt": "2026-03-13T10:30:45Z",
    "resolvedAt": null,
    "source": "SILENT_ACTIVATION"
  },
  "location": {
    "latitude": 14.5995,
    "longitude": 120.9842,
    "accuracy": 5.0,
    "altitude": 10.0,
    "movementStatus": "MOVING",
    "direction": "NORTHBOUND",
    "lastUpdate": "2026-03-13T10:30:45Z"
  },
  "user": {
    "id": "user-uuid",
    "name": "Maria Santos",
    "phone": "09123456789",
    "role": "CITIZEN"
  },
  "device": {
    "batteryLevel": 34,
    "networkType": "4G",
    "isOffline": false
  },
  "response": {
    "dispatchedAgencies": ["POLICE"],
    "respondersNotified": ["responder-1", "responder-2"],
    "silentApproachRequired": true,
    "continuousTracking": true
  },
  "confirmation": {
    "userConfirmedSafe": false,
    "confirmationMethod": null,
    "confirmationTime": null
  }
}
```

### 8.2 Activation Event

```json
{
  "event": {
    "id": "event-uuid",
    "incidentId": "SILENT-2026-0142",
    "type": "ACTIVATION",
    "timestamp": "2026-03-13T10:30:00Z",
    "triggerMethod": "LONG_PRESS_POWER",
    "payload": {
      "location": {...},
      "device": {...}
    }
  }
}
```

---

## 9. Edge Cases & Error Handling

### 9.1 Edge Cases

| Scenario | Expected Behavior | Priority |
|----------|-------------------|----------|
| User activated but then makes regular call | Cancel silent SOS, use regular dispatch | High |
| Phone battery dies before confirmation | Keep incident active, last known location | High |
| GPS unavailable (indoors) | Use last known location + WiFi positioning | Medium |
| Multiple rapid activations | Debounce, use first activation only | Medium |
| User is passenger in vehicle | Track movement, not misleading | Medium |
| Responder cannot locate user | Call user (if safe), update instructions | High |
| Silent SOS during regular emergency call | Prioritize voice call, cancel silent | Low |

### 9.2 Error Messages

| Error Condition | System Action |
|-----------------|---------------|
| Network unavailable | Queue locally, retry automatically |
| Location unavailable | Use WiFi positioning, show accuracy warning |
| Too many activations (spam) | Rate limit, require CAPTCHA |
| Server error | Retry 3x, then switch to SMS fallback |
| Invalid activation gesture | Ignore, no response |

### 9.3 Fallback Scenarios

| Scenario | Fallback Mechanism |
|----------|-------------------|
| No mobile data | Switch to WiFi (if available), then SMS |
| No network at all | Queue locally, SMS when any network returns |
| App killed by system | Background service restarts, sends queued |
| Location permission denied | Use cell tower positioning |

---

## 10. Security & Privacy

### 10.1 Data Classification

| Data Type | Classification | Handling |
|-----------|----------------|----------|
| User location | Confidential | E2E encrypted, auto-delete after 30 days |
| Silent SOS audio | Highly Confidential | Encrypted, access-controlled, delete after resolution |
| Silent SOS photo | Highly Confidential | Encrypted, access-controlled, delete after resolution |
| Incident logs | Internal | Retained per legal requirements |

### 10.2 Security Measures

- All data encrypted in transit (TLS 1.3)
- End-to-end encryption for audio/photo
- Location data encrypted at rest (AES-256)
- Access control: Role-based permissions
- Audit logging for all data access
- Automatic data deletion after retention period

### 10.3 Privacy Considerations

- Silent SOS data used ONLY for emergency response
- No marketing or third-party sharing
- User can request data deletion (after incident closure)
- Photo/audio never shared with media or public
- Location history auto-deleted after 30 days

### 10.4 Consent Requirements

| Action | Consent Required | Type |
|--------|----------------|------|
| Activate Silent SOS | Implicit | (User initiates) |
| Capture audio | Explicit (pre-configured) | Opt-in setting |
| Capture photo | Explicit (pre-configured) | Opt-in setting |
| Continuous tracking | Explicit | Opt-in, can disable anytime |
| Share with responders | Implicit | For emergency response |

---

## 11. Success Metrics

### 11.1 Key Performance Indicators

| Metric | Target | Timeline | Measurement |
|--------|--------|----------|-------------|
| Activation to dispatch time | <30 seconds | 6 months | Server timestamps |
| Successful delivery rate | >99% | 6 months | Incidents sent / total |
| False activation rate | <15% | 6 months | Cancelled / total |
| Responder acknowledgment | <60 seconds | 6 months | Time to first ack |
| User confirmation rate | >80% | 6 months | Confirmed safe / dispatched |
| Silent SOS incidents resolved | 100% | Ongoing | Resolved / dispatched |

### 11.2 Success Criteria

- [ ] Silent SOS feature deployed to production
- [ ] 1000+ users enabled feature
- [ ] Average activation-to-dispatch <30 seconds
- [ ] False activation rate <15%
- [ ] No privacy breaches related to Silent SOS data
- [ ] Responder satisfaction score >4.0

### 11.3 Monitoring Dashboard

| Dashboard | Metrics Shown | Refresh Rate |
|-----------|---------------|--------------|
| Silent SOS Overview | Total activations, success rate, response time | Real-time |
| Activation Methods | Usage by gesture type | Daily |
| Response Tracking | Dispatch time, responder ack time | Real-time |
| False Activation Analysis | Cancellation rate, patterns | Weekly |

---

## 12. Dependencies

### 12.1 Internal Dependencies

| Dependency | Feature/System | Relationship |
|------------|----------------|--------------|
| Location Services | Core | Required for all features |
| Push Notifications | Core | Required for responder alerts |
| Incident Management | Core | Required for tracking |
| User Authentication | Core | Required for user profile |

### 12.2 External Dependencies

| Dependency | Provider | Status |
|------------|----------|--------|
| FCM | Google | Required |
| APNs | Apple | Required |
| SMS Gateway | Telco partner | Required (fallback) |
| Map Services | Mapbox/Google | Required |

### 12.3 Blockers

| Blocker | Impact | Mitigation |
|---------|--------|------------|
| Background location restrictions | HIGH | Use significant location changes, explain to users |
| iOS background limits | HIGH | Test thoroughly, use available APIs |
| Battery optimization blocking | MEDIUM | Guide users to whitelist app |

---

## 13. Implementation Phases

### 13.1 MVP (Phase 1) - Month 1-2

| Feature | Deliverable | Timeline |
|---------|-------------|----------|
| Power button long press | Basic activation | Week 1-2 |
| Shake activation | Basic activation | Week 2-3 |
| Location capture | Automatic GPS | Week 3 |
| Silent dispatch | Mark as silent approach | Week 4 |
| Responder alert view | Display Silent SOS details | Week 5-6 |
| Post-safety confirmation | User confirms safe | Week 6-7 |
| Offline queue | Basic retry mechanism | Week 7-8 |

### 13.2 Phase 2 - Month 3-4

| Feature | Deliverable | Timeline |
|---------|-------------|----------|
| Continuous tracking | Movement updates | Week 9-10 |
| SMS fallback | Send via SMS if data fails | Week 10-11 |
| False activation detection | Prompt for confirmation | Week 11-12 |
| Tap pattern configuration | User-configurable patterns | Week 12-13 |

### 13.3 Phase 3 - Month 5-6

| Feature | Deliverable | Timeline |
|---------|-------------|----------|
| Voice activation | "Help" command | Week 14-15 |
| Optional audio capture | 10-second ambient | Week 15-16 |
| Optional photo capture | Single frame | Week 16-17 |
| Hardware button support | Device-specific | Week 17-18 |

---

## 14. Testing Requirements

### 14.1 Test Cases

| Test Case | Scenario | Expected Result | Priority |
|-----------|----------|-----------------|----------|
| TC-SS-001 | Long press power button | Alert sent within 3s | High |
| TC-SS-002 | Shake phone 3 times | Alert sent silently | High |
| TC-SS-003 | Phone locked, activate | Works in background | High |
| TC-SS-004 | No network, activate | Alert queued and sent when online | High |
| TC-SS-005 | Responder receives alert | Sees SILENT indicator | High |
| TC-SS-006 | User confirms safe | Incident marked resolved | Medium |
| TC-SS-007 | Accidental activation | Can cancel within 30s | Medium |
| TC-SS-008 | GPS unavailable | Uses WiFi positioning | Medium |
| TC-SS-009 | Battery low | Alert still sent | Low |
| TC-SS-010 | Multiple rapid activations | Debounced, single alert | Low |

### 14.2 Testing Environments

| Environment | Purpose | Data |
|-------------|---------|------|
| Development | Feature development | Test accounts, simulated locations |
| Staging | Integration testing | Sample incidents |
| Production | Live usage | Real incidents |

---

## 15. Risks & Mitigation

### 15.1 Identified Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Users forget Silent SOS exists | Medium | High | In-app reminders, tutorials |
| False activations overwhelm system | Medium | Medium | Confirmation prompts, rate limiting |
| Privacy breach of sensitive data | Low | Very High | Encryption, access controls, audit logs |
| Background service killed by OS | High | High | User education, battery whitelist |
| Location inaccuracy in urban areas | Medium | Medium | WiFi positioning backup |

### 15.2 Assumptions

- Users will grant location "always" permission
- Users will understand importance of background service
- Responders will follow silent approach protocol
- Network coverage is sufficient in target areas

---

## 16. Appendix

### 16.1 Glossary

| Term | Definition |
|------|------------|
| Silent SOS | Emergency activation without sound or visible interaction |
| Silent Approach | Responder protocol to approach without sirens |
| Background Service | App process running without visible UI |
| E2E Encryption | End-to-end encryption for data in transit |
| Continuous Tracking | Regular location updates for moving users |

### 16.2 References

- Product Brief: product-brief-emergency-response-platform.md
- Personas: personas-detailed.md
- User Journeys: user-journey-maps.md
- Responder App Spec: responder-mobile-app-prompt.md
- Dispatcher Dashboard: dispatcher-dashboard-prompt.md

### 16.3 Emergency Scenarios Covered by Silent SOS

| # | Scenario | Applicable |
|---|----------|-------------|
| 1 | Being followed | ✓ |
| 2 | Abduction | ✓ |
| 3 | Domestic violence (witness) | ✓ |
| 4 | Robbed at gun/knife point | ✓ |
| 5 | Hostage situation | ✓ |
| 6 | Being surveilled | ✓ |
| 7 | Danger but cannot speak | ✓ |
| 8 | Threatened by authority abuse | ✓ |
| 9 | Stalking | ✓ |
| 10 | Kidnapping attempt | ✓ |

---

**Document Status:** Draft
**Last Updated:** 2026-03-13
**Next Review Date:** 2026-03-20

---

*This specification is part of the Toyota Emergency Response Platform project.*
