# Multi-Agency Escalation Specification

**Document Title:** Multi-Agency Escalation Feature Specification
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

Multi-Agency Escalation is an intelligent dispatch system that automatically detects when an emergency requires response from multiple agencies and coordinates the dispatch, communication, and resolution across all involved agencies. Instead of single-agency responses, the system identifies complex emergencies and triggers a coordinated multi-agency response with unified command and communication.

### 1.2 Problem Solved

Current emergency response often requires:
- Manual dispatcher to contact multiple agencies
- Time wasted making separate calls to each agency
- No unified incident tracking across agencies
- Confused command structure when multiple agencies arrive
- Duplicate responses (e.g., both police and ambulance dispatched separately)
- Citizens repeating information to multiple agencies

### 1.3 Value Proposition

- **Faster Response:** Simultaneous dispatch of all required agencies
- **Better Coordination:** Unified incident command across agencies
- **No Duplicate Response:** Single dispatch prevents resource waste
- **Complete Coverage:** Automatically identifies all agencies needed
- **Clear Handoffs:** Defined protocols for agency transitions

### 1.4 Goals & Objectives

- Goal 1: Automatically detect multi-agency scenarios with 95% accuracy
- Goal 2: Reduce dispatch time for multi-agency incidents by 50%
- Goal 3: Zero duplicate dispatches for all incidents
- Goal 4: Clear scene commander designation for all multi-agency incidents

---

## 2. User Personas

### 2.1 Primary Users

| Persona | Name | Role | How Multi-Agency Affects Them |
|---------|------|------|------------------------------|
| 1 | Maria Santos | Citizen/Witness | Reports accident → Police + Ambulance dispatched together |
| 2 | Sgt. Juan Dela Cruz | Police Responder | Sees fire at crime scene → Fire also dispatched |
| 3 | Elena Rivera | Dispatcher/Monitor | Monitors multi-agency incident on dashboard |
| 4 | Dr. Sarah Binay | First Aider | Medical emergency → Ambulance + First Aider dispatched |
| 5 | Arlene Martinez | Fire Witness | Fire with injuries → Fire + Ambulance dispatched |
| 6 | Junjun Mañalac | Barangay Tanod | Dispute with injury → Police + Ambulance |
| 7 | NEW: Chief Torres | Fire Chief | Coordinates fire + rescue operations |
| 8 | NEW: Dr. Reyes | Hospital Director | Coordinates hospital transfer for mass casualties |
| 9 | NEW: Commander Lopez | PNP Commander | Coordinates police + traffic + ambulance |
| 10 | NEW: Dir. Mendoza | OCD Director | Coordinates disaster response |

### 2.2 User Needs

| Persona | Need | Priority |
|---------|------|----------|
| Maria Santos | Single report triggers all needed agencies | Must |
| Sgt. Juan Dela Cruz | Know when other agencies are en route | Must |
| Elena Rivera | Monitor unified incident with all agencies | Must |
| Junjun Mañalac | Clear command when police + ambulance arrive together | Must |
| Chief Torres | Lead scene when fire is primary | Should |
| Dr. Reyes | Get patient info before ambulance arrives | Should |
| Commander Lopez | Coordinate response with traffic and medical | Should |
| Dir. Mendoza | Full disaster coordination | Could |

### 2.3 User Scenarios

#### Scenario 1: Road Traffic Accident with Injuries
> Maria witnesses a jeepney collision. There are injured victims and one vehicle is smoking. She reports via app: "Accident - jeepney collision, injuries, possible fire." System automatically dispatches: Police (traffic + crime), Ambulance (medical), Fire (fire risk).

#### Scenario 2: Fire with Trapped Victims
> Arlene sees a house fire with people trapped on the second floor. She reports: "Fire in house, people trapped!" System dispatches: Fire (extinguish + rescue), Ambulance (medical standby), Police (traffic + crowd control).

#### Scenario 3: Domestic Violence with Injury
> Marites reports domestic violence. Her report includes: "Woman beaten, bleeding, children crying." System dispatches: Police WCPD (Women's and Children's Protection Desk), Ambulance (for injuries).

#### Scenario 4: Crime Scene with Hostages
> Witness reports: "Armed men in building, hostages inside." System dispatches: Police (SWAT + negotiators), Ambulance (medical standby), Fire (rescue preparation).

#### Scenario 5: Earthquake with Collapsed Building
> Major earthquake hits. Multiple building collapses reported. System identifies mass casualty event and dispatches: Fire + Rescue, Ambulance (multiple units), Police (traffic + security), OCD/NDRRMC (coordination).

---

## 3. Process Flow

### 3.1 Main Escalation Detection Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│               MULTI-AGENCY ESCALATION DETECTION FLOW                       │
└─────────────────────────────────────────────────────────────────────────────┘

START: Emergency Report Received
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Parse Report                                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Extract key information:                                               │ │
│ │ • Emergency type reported                                             │ │
│ │ • Keywords detected                                                    │ │
│ │ • Location context                                                    │ │
│ │ • Reporter description                                                │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Apply Escalation Rules                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ SYSTEM CHECKS:                                                              │
│ ┌───────────────────────────────────────────────────────────────────────┐   │
│ │ RULE CATEGORY              │ CHECK                                    │   │
│ ├────────────────────────────┼──────────────────────────────────────────┤   │
│ │ INJURY CHECK              │ Any "injury", "bleeding", "hurt",       │   │
│ │                            │ "wounded", "unconscious", "pain"       │   │
│ ├────────────────────────────┼──────────────────────────────────────────┤   │
│ │ FIRE RISK CHECK           │ Any "fire", "smoke", "burning",        │   │
│ │                            │ "explosion", "gas", "chemical"         │   │
│ ├────────────────────────────┼──────────────────────────────────────────┤   │
│ │ CRIME CHECK               │ Any "robbery", "theft", "assault",     │   │
│ │                            │ "murder", "rape", "abduction"         │   │
│ ├────────────────────────────┼──────────────────────────────────────────┤   │
│ │ MULTI-PERSON CHECK        │ Any "crowd", "mass", "group",         │   │
│ │                            │ "several", "many", "children"          │   │
│ ├────────────────────────────┼──────────────────────────────────────────┤   │
│ │ LOCATION RISK             │ "building", "school", "mall",         │   │
│ │                            │ "hospital", "market"                   │   │
│ ├────────────────────────────┼──────────────────────────────────────────┤   │
│ │ DISASTER CHECK            │ "earthquake", "flood", "typhoon",     │   │
│ │                            │ "landslide", "tsunami"                │   │
│ └────────────────────────────┴──────────────────────────────────────────┘   │
│                                                                             │
│ RESULT: LIST OF REQUIRED AGENCIES                                           │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Determine Agency Combination                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ BASED ON RULES, SELECT AGENCIES:                                           │
│                                                                             │
│ ┌───────────────────────────────────────────────────────────────────────┐   │
│ │ PRIMARY AGENCY  │ SECONDARY AGENCIES (Auto-added)                    │   │
│ ├────────────────┼────────────────────────────────────────────────────┤   │
│ │ MEDICAL        │ + First Aider (if available)                        │   │
│ │ MEDICAL + FIRE │ + Ambulance (always)                               │   │
│ │ MEDICAL + CRIME│ + Police (always)                                  │   │
│ │ FIRE           │ + Ambulance (if occupied/people)                   │   │
│ │ FIRE + INJURY  │ + Ambulance (always)                              │   │
│ │ FIRE + CRIME   │ + Police (always)                                  │   │
│ │ CRIME          │ + Ambulance (if injury mentioned)                 │   │
│ │ CRIME + HOSTAGE│ + Ambulance + Fire (standby)                      │   │
│ │ TRAFFIC        │ + Ambulance (if injuries)                         │   │
│ │ TRAFFIC + FIRE │ + Ambulance + Fire (always)                       │   │
│ │ DISASTER       │ + All agencies + NDRRMC                            │   │
│ └────────────────┴────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Create Unified Incident                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ SYSTEM CREATES SINGLE INCIDENT:                                             │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ Incident ID: #MULTI-2026-0142                                        │ │
│ │ Type: MULTI-AGENCY INCIDENT                                          │ │
│ │ Agencies: POLICE + AMBULANCE + FIRE                                   │ │
│ │ Primary Agency: FIRE (based on fire being primary risk)             │ │
│ │ Scene Commander: To be designated                                    │ │
│ │ Unified Timeline: Started                                            │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
END: Multi-Agency Incident Created
```

### 3.2 Unified Dispatch Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     UNIFIED DISPATCH FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

MULTI-AGENCY INCIDENT CREATED
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Find Available Responders (Per Agency)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ FOR EACH AGENCY:                                                            │
│                                                                             │
│ ┌─────────────────────┐  ┌─────────────────────┐                          │
│ │ FIND POLICE        │  │ FIND AMBULANCE      │                          │
│ │ Nearest 3 units    │  │ Nearest 3 units    │                          │
│ │ Status: Available │  │ Status: Available  │                          │
│ └─────────────────────┘  └─────────────────────┘                          │
│                                                                             │
│ ┌─────────────────────┐                                                    │
│ │ FIND FIRE           │                                                    │
│ │ Nearest 2 units    │                                                    │
│ │ Status: Available  │                                                    │
│ └─────────────────────┘                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Send Simultaneous Dispatch                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ALL AGENCIES DISPATCHED SIMULTANEOUSLY:                                    │
│                                                                             │
│ ┌───────────────────────────────────────────────────────────────────────┐   │
│ │ TIME: T+0 (All at same moment)                                      │   │
│ │                                                                       │   │
│ │ TO: Police Unit 12                                                  │   │
│ │ Dispatch: MULTI-2026-0142 - CRIME SCENE                            │   │
│ │ Location: [GPS] - Divisoria Mall                                     │   │
│ │ Agencies responding: Police, Ambulance, Fire                        │   │
│ │ Scene Commander: Pending (first on scene)                          │   │
│ │ Note: Coordinate with other agencies                               │   │
│ └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│ ┌───────────────────────────────────────────────────────────────────────┐   │
│ │ TO: Ambulance Unit 5                                                │   │
│ │ Dispatch: MULTI-2026-0142 - MEDICAL STANDBY                        │   │
│ │ Location: [GPS] - Divisoria Mall                                     │   │
│ │ Agencies responding: Police, Ambulance, Fire                        │   │
│ │ Primary: Fire (fire risk), Medical standby                          │   │
│ │ Note: Be ready for medical triage                                   │   │
│ └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│ ┌───────────────────────────────────────────────────────────────────────┐   │
│ │ TO: Fire Truck 8                                                    │   │
│ │ Dispatch: MULTI-2026-0142 - FIRE SUPPRESSION                       │   │
│ │ Location: [GPS] - Divisoria Mall                                     │   │
│ │ Agencies responding: Police, Ambulance, Fire                        │   │
│ │ Primary: This incident (FIRE is primary risk)                       │   │
│ │ Note: Coordinate with Police for scene security                    │   │
│ └───────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Notify Dispatcher/Monitor                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Elena (Dispatcher) receives notification:                                  │
│                                                                             │
│ ┌───────────────────────────────────────────────────────────────────────┐   │
│ │ ⚠️ MULTI-AGENCY INCIDENT                                            │   │
│ │ ID: #MULTI-2026-0142                                               │   │
│ │ Location: Divisoria Mall                                             │   │
│ │                                                                       │   │
│ │ Agencies Dispatched:                                                 │   │
│ │ • 🚔 Police Unit 12 - En Route                                     │   │
│ │ • 🚑 Ambulance Unit 5 - En Route                                   │   │
│ │ • 🚒 Fire Truck 8 - En Route                                       │   │
│ │                                                                       │   │
│ │ Status: All agencies en route                                       │   │
│ │ Primary: Fire (Fire Truck 8 is scene commander)                     │   │
│ └───────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Responder View (Multi-Agency)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              RESPONDER VIEW - MULTI-AGENCY INCIDENT                          │
└─────────────────────────────────────────────────────────────────────────────┘

SCREEN: Police Responder App
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER: ⚠️ MULTI-AGENCY INCIDENT                          [MAP] [DETAILS] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ INCIDENT: #MULTI-2026-0142                                                 │
│ Type: FIRE AT BUILDING WITH INJURIES                                        │
│ Location: Divisoria Mall, Manila                                           │
│ Distance: 1.2 km                                                            │
│                                                                             │
│ ────────────────────────────────────────────────────────────────────────   │
│                                                                             │
│ RESPONDING AGENCIES:                                                        │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│ │ 🚔 POLICE      │ │ 🚑 AMBULANCE   │ │ 🚒 FIRE        │               │
│ │ Unit 12        │ │ Unit 5         │ │ Truck 8        │               │
│ │ En Route       │ │ En Route       │ │ En Route       │               │
│ │ ETA: 4 min     │ │ ETA: 5 min     │ │ ETA: 3 min     │               │
│ └────────────────┘ └────────────────┘ └────────────────┘               │
│                                                                             │
│ SCENE COMMANDER: 🚒 Fire Truck 8 (Arrives first)                          │
│                                                                             │
│ ────────────────────────────────────────────────────────────────────────   │
│                                                                             │
│ YOUR ROLE: Traffic Control + Security                                       │
│                                                                             │
│ ACTIONS:                                                                    │
│ [📞 CALL AMBULANCE]  [💬 CHAT GROUP]  [📍 NAVIGATE]                      │
│                                                                             │
│ COORDINATION NOTES:                                                         │
│ • Fire is primary - follow their lead                                      │
│ • Ambulance staging: 50m from building                                     │
│ • Police: Secure perimeter, control crowd                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Scene Commander Designation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  SCENE COMMANDER DESIGNATION FLOW                           │
└─────────────────────────────────────────────────────────────────────────────┘

INCIDENT DISPATCHED
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ All Responders En Route                                                    │
│                                                                             │
│ Monitor arrival times:                                                     │
│ • Fire Truck 8 - ETA 3 min                                               │
│ • Police Unit 12 - ETA 4 min                                             │
│ • Ambulance Unit 5 - ETA 5 min                                           │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ FIRST RESPONDER ARRIVES                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Fire Truck 8 arrives first                                                 │
│                                                                             │
│ SYSTEM automatically designates:                                            │
│                                                                             │
│ ┌───────────────────────────────────────────────────────────────────────┐   │
│ │ ✅ SCENE COMMANDER DESIGNATED                                        │   │
│ │                                                                       │   │
│ │ Commander: Fire Capt. Pedro Santos                                    │   │
│ │ Unit: Fire Truck 8                                                   │   │
│ │ Agency: BFP (Fire)                                                  │   │
│ │ Reason: First on scene, fire is primary hazard                      │   │
│ └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│ NOTIFICATION SENT TO ALL RESPONDERS:                                       │
│ "Fire Capt. Pedro Santos designated as Scene Commander"                   │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ SCENE COMMANDER RESPONSIBILITIES                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ The designated Scene Commander:                                            │
│                                                                             │
│ ✓ Has final authority on scene decisions                                  │
│ ✓ Can request additional resources                                        │
│ ✓ Coordinates all agencies on scene                                       │
│ ✓ Determines when incident is resolved                                   │
│ ✓ Provides status updates to dispatcher                                   │
│                                                                             │
│ ✓ CAN transfer command if:                                                │
│   • More senior responder from another agency arrives                      │
│   • Situation changes (e.g., medical becomes primary)                     │
│   • Hand-off to hospital/other facility                                   │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ COMMAND TRANSFER (If Needed)                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Scenario: Ambulance crew assesses patient is critical,                    │
│ now medical becomes priority                                               │
│                                                                             │
│ Fire Capt. Santos transfers command:                                        │
│                                                                             │
│ ┌───────────────────────────────────────────────────────────────────────┐   │
│ │ 🔄 COMMAND TRANSFER                                                   │   │
│ │                                                                       │   │
│ │ From: Fire Capt. Pedro Santos (Fire)                                 │   │
│ │ To: Dr. Maria Cruz (Ambulance - Medical)                             │   │
│ │ Reason: Patient condition requires medical priority                   │   │
│ │ Time: 2026-03-13T10:45:00Z                                          │   │
│ └───────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│ All responders notified of command transfer                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.5 Handoff Protocol Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AGENCY HANDOFF PROTOCOL                             │
└─────────────────────────────────────────────────────────────────────────────┘

SCENARIO: Patient stabilized, need hospital transfer
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Scene Commander Determines Handoff Needed                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Fire Capt. Santos assesses:                                                │
│ • Fire extinguished                                                       │
│ • Patients stabilized by ambulance                                        │
│ • Need hospital transport                                                 │
│                                                                             │
│ Decision: Transfer command to Ambulance for transport                      │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Execute Handoff                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌───────────────────────────────────────────────────────────────────────┐   │
│ │ 🔄 HANDOFF PROTOCOL                                                  │   │
│ │                                                                       │   │
│ │ FROM: Fire Capt. Pedro Santos (Fire) - OUTGOING                       │   │
│ │ TO: Paramedic Juan dela Cruz (Ambulance) - INCOMING                  │   │
│ │                                                                       │   │
│ │ INCIDENT SUMMARY:                                                    │   │
│ │ • Fire: 100% extinguished                                           │   │
│ │ • Patients: 2, both stable                                           │   │
│ │ • Location: Ready for transport                                      │   │
│ │                                                                       │   │
│ │ PATIENT INFO:                                                        │   │
│ │ • Patient 1: Male, 45y, smoke inhalation, stable                     │   │
│ │ • Patient 2: Female, 28y, minor burns (10%), stable                 │   │
│ │                                                                       │   │
│ │ TRANSPORT: Required to Jose Reyes Memorial Hospital                  │   │
│ │                                                                       │   │
│ │ ALL CLEAR: Fire units can clear scene                                │   │
│ └───────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Confirm Handoff                                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ Paramedic Juan confirms:                                                   │
│ "Copy. Ambulance assumes command. Taking over patient care."              │
│                                                                             │
│ System logs:                                                               │
│ • Handoff time                                                            │
│ • Command transfer confirmation                                           │
│ • Remaining resources                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Post-Handoff                                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ • Fire units clear scene (return to station)                              │
│ • Police maintains scene security                                          │
│ • Ambulance transports patients to hospital                               │
│ • Dispatcher updates incident status                                       │
│                                                                             │
│ INCIDENT STATUS: AMBULANCE COMMAND - TRANSPORTING                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.6 Unified Incident Timeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              UNIFIED INCIDENT TIMELINE (All Agencies)                       │
└─────────────────────────────────────────────────────────────────────────────┘

#MULTI-2026-0142 - Fire at Building with Injuries
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 10:30:00 - REPORT RECEIVED (Maria Santos via App)                        │
│ "Fire at Divisoria Mall, smoke visible, people may be inside"              │
│ ───────────────────────────────────────────────────────────────────────   │
│ ESCALATION TRIGGERED: Fire + Injury keywords detected                     │
│ AGENCIES DISPATCHED: Fire, Ambulance, Police                              │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 10:31:15 - ALL RESPONDERS EN ROUTE                                        │
│ • Fire Truck 8 - En Route - ETA 3 min                                    │
│ • Ambulance Unit 5 - En Route - ETA 5 min                                │
│ • Police Unit 12 - En Route - ETA 4 min                                  │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 10:33:00 - FIRE TRUCK 8 ARRIVES (First)                                  │
│ ───────────────────────────────────────────────────────────────────────   │
│ Fire Capt. Pedro Santos designated as SCENE COMMANDER                     │
│ Status: Assessing fire situation                                           │
│ Action: Deploys hoses, begins fire attack                                 │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 10:34:00 - AMBULANCE ARRIVES                                              │
│ ───────────────────────────────────────────────────────────────────────   │
│ Stage: 50m from building                                                 │
│ Status: Standing by for medical needs                                     │
│ Action: Preparing medical equipment                                       │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 10:35:00 - POLICE ARRIVES                                                 │
│ ───────────────────────────────────────────────────────────────────────   │
│ Action: Securing perimeter, controlling crowd                            │
│ Traffic: Divisoria Street closed                                         │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 10:38:00 - FIRE CONTAINED                                                 │
│ ───────────────────────────────────────────────────────────────────────   │
│ Scene Commander: Fire under control                                       │
│ Finding: 2 civilians found, smoke inhalation                              │
│ Request: Ambulance to treat patients                                     │
│ Handoff: Fire → Ambulance for medical care                               │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 10:42:00 - MEDICAL HANDOFF COMPLETE                                       │
│ ───────────────────────────────────────────────────────────────────────   │
│ Ambulance assumes command                                                 │
│ Patients: 2, both stable, ready for transport                            │
│ Fire units: Cleared to return                                            │
│ Police: Maintaining scene security                                        │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 10:50:00 - TRANSPORTING                                                   │
│ ───────────────────────────────────────────────────────────────────────   │
│ Ambulance transporting to Jose Reyes Memorial Hospital                     │
│ Police: Clearing traffic for ambulance passage                            │
└─────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 11:00:00 - INCIDENT RESOLVED                                              │
│ ───────────────────────────────────────────────────────────────────────   │
│ Final Status: All patients transported, scene secured                     │
│ Commander: Paramedic Juan dela Cruz                                       │
│ Resolution: Fire extinguished, 2 patients transported                    │
│ Follow-up: Police investigation ongoing                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Comprehensive Emergency Scenario Matrix

### 40+ Scenarios with Agency Combinations

| # | Scenario | Primary Agency | Auto-Added Agencies | Priority |
|---|----------|----------------|---------------------|----------|
| 1 | Road accident - injuries | Ambulance | + Police (traffic) | HIGH |
| 2 | Road accident - vehicle fire | Fire | + Ambulance + Police | HIGH |
| 3 | Road accident - trapped victims | Fire | + Ambulance + Police | HIGH |
| 4 | Road accident - multiple casualties | Ambulance | + Police + Fire + Hospital | CRITICAL |
| 5 | Robbery in progress | Police | + (Ambulance if injury) | HIGH |
| 6 | Robbery with injury | Police | + Ambulance | HIGH |
| 7 | Robbery with hostages | Police | + Ambulance + Fire | CRITICAL |
| 8 | Crime scene - shooting | Police | + Ambulance | HIGH |
| 9 | Crime scene - stabbing | Police | + Ambulance | HIGH |
| 10 | Domestic violence | Police (WCPD) | + (Ambulance if injury) | HIGH |
| 11 | Child abuse | Police (WCPD) | + Ambulance + DSWD | HIGH |
| 12 | Fire in residence | Fire | + (Ambulance if occupied) | HIGH |
| 13 | Fire in apartment building | Fire | + Ambulance + Police | HIGH |
| 14 | Fire in commercial building | Fire | + Ambulance + Police + Evacuation | HIGH |
| 15 | Fire with trapped civilians | Fire | + Ambulance + Police | CRITICAL |
| 16 | Fire with casualties | Fire | + Ambulance + Police + Hospital | CRITICAL |
| 17 | Chemical spill | Fire (Hazmat) | + Ambulance + Police + Environment | CRITICAL |
| 18 | Gas leak | Fire | + Ambulance + Police | HIGH |
| 19 | Electrical emergency | Fire | + Electric company + (Ambulance) | MEDIUM |
| 20 | Building collapse | Fire | + Ambulance + Police + Engineering | CRITICAL |
| 21 | Landslide | Fire | + Ambulance + Police + Mines | HIGH |
| 22 | Flood - vehicle | Police | + Ambulance + Fire | HIGH |
| 23 | Flood - area evacuation | Police | + Fire + LGU + OCD | HIGH |
| 24 | Drowning | Lifeguard | + Ambulance + Police | HIGH |
| 25 | Near drowning | Lifeguard | + Ambulance | HIGH |
| 26 | Medical emergency - home | Ambulance | + (First Aider) | HIGH |
| 27 | Medical emergency - public | Ambulance | + First Aider | HIGH |
| 28 | Medical emergency - workplace | Ambulance | + DOLE + (First Aider) | HIGH |
| 29 | Cardiac arrest | Ambulance | + First Aider + Hospital | CRITICAL |
| 30 | Mass casualty - accident | Ambulance | + Police + Fire + Hospital + OCD | CRITICAL |
| 31 | Mass casualty - disaster | OCD | + All agencies | CRITICAL |
| 32 | Earthquake | OCD | + Fire + Police + Ambulance + LGU | CRITICAL |
| 33 | Tsunami warning | OCD | + All agencies + LGU | CRITICAL |
| 34 | Storm surge | OCD | + Fire + Police + Ambulance + LGU | CRITICAL |
| 35 | Wildfire | Fire | + Police + (Ambulance) + DENR | HIGH |
| 36 | Explosion | Fire | + Police + Ambulance + (Hospital) | CRITICAL |
| 37 | Bomb threat | Police | + Fire + (Ambulance) | HIGH |
| 38 | Suspicious package | Police | + Fire (Bomb) | HIGH |
| 39 | Hazmat incident | Fire (Hazmat) | + Police + Ambulance + DENR + LGU | CRITICAL |
| 40 | School emergency | Police | + Fire + Ambulance + DepEd | HIGH |
| 41 | Hospital emergency | Hospital | + Police + (Ambulance) | HIGH |
| 42 | Prison emergency | Police | + (Ambulance) | HIGH |
| 43 | Tourist emergency | Police | + Ambulance + DOT | MEDIUM |
| 44 | Lost child | Police | + (Ambulance if conditions) | MEDIUM |
| 45 | Missing elderly | Police | + Ambulance + LGU | MEDIUM |
| 46 | Animal attack | Police | + (Ambulance if injury) | MEDIUM |
| 47 | Suicide attempt | Police | + Ambulance + (Fire for rescue) | HIGH |
| 48 | Public disturbance | Police | + (Ambulance if injury) | MEDIUM |
| 49 | Traffic collision | Police | + Ambulance + (Fire if fuel leak) | HIGH |
| 50 | Train/Jeepney accident | Police | + Ambulance + Fire + LTFRB | HIGH |

---

## 5. User Stories

| ID | User Story | Acceptance Criteria |
|----|------------|---------------------|
| US-MAE-001 | As a reporter, I want to make one report and have all needed agencies dispatched so that I don't need to call multiple numbers | Given complex emergency, When user reports once, Then all required agencies dispatched simultaneously |
| US-MAE-002 | As a responder, I want to know what other agencies are responding so that I can coordinate | Given multi-agency dispatch, When responder receives alert, Then sees all responding agencies |
| US-MAE-003 | As a dispatcher, I want to monitor a single unified incident so that I can track all agencies in one view | Given multi-agency incident, When dispatcher views dashboard, Then sees unified timeline |
| US-MAE-004 | As a scene commander, I want to designate command to another agency when situation changes so that response is optimized | Given scene conditions change, When commander initiates transfer, Then command smoothly transfers |
| US-MAE-005 | As a responder, I want clear handoff information when taking over so that patient care continues seamlessly | Given handoff from another agency, When I accept, Then I receive full patient/incident info |
| US-MAE-006 | As a system, I want to auto-detect multi-agency scenarios so that dispatch is always correct | Given emergency report, When system analyzes, Then correct agencies dispatched |

---

## 6. Functional Requirements

### 6.1 Core Features

| ID | Requirement | Description | Priority |
|----|-------------|-------------|----------|
| FR-MAE-001 | Auto-Detection | Automatically detect multi-agency scenarios from report keywords | Must |
| FR-MAE-002 | Simultaneous Dispatch | Dispatch all agencies at the same moment | Must |
| FR-MAE-003 | Unified Incident | Create single incident visible to all agencies | Must |
| FR-MAE-004 | Scene Commander | Auto-designate scene commander based on arrival time + agency priority | Must |
| FR-MAE-005 | Command Transfer | Allow scene commander to transfer command to another agency | Must |
| FR-MAE-006 | Handoff Protocol | Structured handoff information between agencies | Must |
| FR-MAE-007 | Unified Timeline | Single timeline showing all agency actions | Must |
| FR-MAE-008 | Agency-Specific Views | Each agency sees relevant info for their role | Must |
| FR-MAE-009 | Cross-Agency Chat | Communication channel for all responders | Should |
| FR-MAE-010 | NDRRMC Integration | Connect with OCD/NDRRMC for disasters | Should |

### 6.2 Agency Priority Matrix

| Agency | Primary Scenarios | Commander Priority | Notes |
|--------|------------------|-------------------|-------|
| Fire | Fire, Hazmat, Rescue | 1 (highest) | Always commander for fire incidents |
| Police | Crime, Security, Traffic | 2 | Commander for law enforcement |
| Ambulance | Medical, Transport | 3 | Commander when medical is priority |
| Lifeguard | Water emergencies | 3 | Commander for water incidents |
| OCD/NDRRMC | Disasters | 0 (overall) | Strategic command only |

---

## 7. Technical Requirements

### 7.1 Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│               MULTI-AGENCY ESCALATION ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────────────┘

                         ┌─────────────────────┐
                         │   Escalation Rules   │
                         │      Engine          │
                         └──────────┬──────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DISPATCH COORDINATION LAYER                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                   │
│  │ Police       │  │ Ambulance     │  │ Fire         │                   │
│  │ Dispatch API │  │ Dispatch API  │  │ Dispatch API │                   │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘                   │
│          │                  │                  │                            │
│          └──────────────────┼──────────────────┘                            │
│                             │                                               │
│                    ┌────────┴────────┐                                      │
│                    │ Unified       │                                       │
│                    │ Incident      │                                       │
│                    │ Manager       │                                       │
│                    └────────┬───────┘                                      │
│                             │                                               │
└─────────────────────────────┼───────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Police      │      │ Ambulance    │      │ Fire        │
│ System      │      │ System       │      │ System      │
└──────────────┘      └──────────────┘      └──────────────┘
```

### 7.2 API Requirements

| API | Endpoint | Purpose |
|-----|----------|---------|
| Escalate | /api/v1/incidents/{id}/escalate | Add agencies to incident |
| Transfer Command | /api/v1/incidents/{id}/transfer-command | Transfer scene command |
| Handoff | /api/v1/incidents/{id}/handoff | Execute handoff protocol |
| Unified Timeline | /api/v1/incidents/{id}/timeline | Get all agency actions |
| Agency Status | /api/v1/agencies/status | Agency availability |

### 7.3 Dashboard Requirements

| Component | Description |
|-----------|-------------|
| Incident Overview | Single incident with all agencies |
| Agency Status | Who is responding |
| Timeline | Unified action log |
| Map View | All units on map |
| Commander Card | Current scene commander |
| Chat | Cross-agency communication |

---

## 8. Data Models

### 8.1 Multi-Agency Incident

```json
{
  "incident": {
    "id": "MULTI-2026-0142",
    "type": "MULTI_AGENCY",
    "status": "ACTIVE",
    "primaryAgency": "FIRE",
    "sceneCommander": {
      "id": "responder-123",
      "name": "Fire Capt. Pedro Santos",
      "agency": "BFP",
      "unit": "Fire Truck 8",
      "designatedAt": "2026-03-13T10:33:00Z"
    },
    "agencies": [
      {
        "agency": "FIRE",
        "status": "ON_SCENE",
        "unit": "Fire Truck 8",
        "responder": "Fire Capt. Pedro Santos"
      },
      {
        "agency": "AMBULANCE",
        "status": "ON_SCENE",
        "unit": "Ambulance Unit 5",
        "responder": "Paramedic Juan dela Cruz"
      },
      {
        "agency": "POLICE",
        "status": "EN_ROUTE",
        "unit": "Police Unit 12",
        "responder": "Sgt. Maria Santos"
      }
    ],
    "timeline": [
      {
        "timestamp": "2026-03-13T10:30:00Z",
        "action": "REPORT_RECEIVED",
        "agency": "SYSTEM",
        "details": "Fire at Divisoria Mall"
      },
      {
        "timestamp": "2026-03-13T10:30:15Z",
        "action": "AGENCIES_DISPATCHED",
        "agency": "SYSTEM",
        "details": "Fire, Ambulance, Police dispatched"
      },
      {
        "timestamp": "2026-03-13T10:33:00Z",
        "action": "COMMANDER_DESIGNATED",
        "agency": "FIRE",
        "details": "Fire Capt. Pedro Santos designated"
      }
    ]
  }
}
```

---

## 9. Edge Cases

| Scenario | Handling |
|----------|----------|
| No responders available for one agency | Dispatch available, notify dispatcher for manual |
| Scene commander becomes incapacitated | Auto-designate next arrived |
| Agencies disagree on command | Follow priority matrix |
| All agencies from one area busy | Dispatch from neighboring areas |
| Communication failure between agencies | Fallback to dispatcher relay |

---

## 10. Success Metrics

| Metric | Target | Timeline |
|--------|--------|----------|
| Multi-agency detection accuracy | >95% | 6 months |
| Average dispatch time reduction | 50% | 6 months |
| Duplicate dispatch rate | 0% | Ongoing |
| Scene commander designation time | <60 seconds | 6 months |
| Handoff satisfaction score | >4.0 | 6 months |

---

## 11. Implementation Phases

### Phase 1 (Month 1-2)
- Auto-detection rules engine
- Basic multi-agency dispatch
- Scene commander auto-designation

### Phase 2 (Month 3-4)
- Command transfer protocol
- Handoff workflow
- Unified timeline

### Phase 3 (Month 5-6)
- Cross-agency chat
- NDRRMC integration
- Advanced analytics

---

**Document Status:** Draft
**Last Updated:** 2026-03-13

---

*This specification is part of the Toyota Emergency Response Platform project.*
