# User Journey Maps: Emergency Response Platform

**Date:** 2026-03-05
**Version:** 1.0

---

## Journey 1: Maria Reports a Road Accident

### Persona: Maria Santos, 35-year-old Mother
### Scenario: Witnessed motorcycle accident

---

### Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MARIA'S JOURNEY: Reporting an Accident                  │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: DISCOVERY
━━━━━━━━━━━━━━━━━━

   6:30 AM                    Gap                      6:31 AM
   ─────────                  ────                      ─────────
   Maria hears                What                      Maria grabs
   loud crash from            number                    her phone
   street                    to call?


   Pain Point: Can't remember emergency numbers, panicking
   ───────────────────────────────────────────────────────


PHASE 2: ACTION
━━━━━━━━━━━━━━━━

   6:31 AM          6:32 AM          6:33 AM          6:34 AM
   ─────────        ─────────        ─────────        ─────────
   Opens app        Taps "Report    Selects "Road    App shows
   (one tap        Emergency"      Accident"        exact location
   from home)                       category         (auto-filled)


   ✓ One tap access
   ✓ Auto-categorizes emergency
   ✓ GPS location captured automatically


PHASE 3: DETAILS
━━━━━━━━━━━━━━━━

   6:35 AM          6:36 AM          6:37 AM
   ─────────        ─────────        ─────────
   Adds photo:      Adds voice       Taps "Send"
   injured man      note: "Man      Report
   on road         unconscious,
                    bleeding from
                    head"


   ✓ Photo upload
   ✓ Voice note (easier than typing)
   ✓ One-tap submit


PHASE 4: ACKNOWLEDGMENT
━━━━━━━━━━━━━━━━━━━━━━

   6:38 AM          6:40 AM          6:42 AM
   ─────────        ─────────        ─────────
   Receives         Dispatcher       System shows:
   push:            reviews          "Police and
   "Report          report,          Ambulance
   received!"       assigns          dispatched"
                    nearest units


   ✓ Confirmation that report was received
   ✓ Real-time assignment visible


PHASE 5: TRACKING
━━━━━━━━━━━━━━━━━━

   6:45 AM          6:50 AM          7:00 AM
   ─────────        ─────────        ─────────
   Push: "Police   Map shows:       Push: "Police
   en route"       Police car       arrived at
   ETA: 10 min     icon moving      location"
                    toward her


   ✓ Live location tracking
   ✓ ETA display
   ✓ Status notifications


PHASE 6: RESOLUTION
━━━━━━━━━━━━━━━━━━━

   7:05 AM          7:10 AM          7:15 AM
   ─────────        ─────────        ─────────
   Push:            Push:            Push:
   "Ambulance      "Patient        "Incident
   en route"       transported"    resolved"
   ETA: 5 min


   ✓ Complete visibility to end
   ✓ Can share status with family


─────────────────────────────────────────────────────────────────────────────
TOTAL TIME: ~45 minutes from report to resolution
             (vs ~1.5 hours in original scenario)
─────────────────────────────────────────────────────────────────────────────
```

---

## Journey 2: Sgt. Juan Responds to Robbery

### Persona: Sgt. Juan Dela Cruz, 42-year-old Police Sergeant
### Scenario: Dispatched to robbery in progress

---

### Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              JUAN'S JOURNEY: Responding to Robbery Call                   │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: DISPATCH RECEIVED
━━━━━━━━━━━━━━━━━━━━━━━━━━

   2:00 AM          2:01 AM          2:02 AM
   ─────────        ─────────        ─────────
   Radio:           Phone            App shows:
   "Robbery at      vibrates:       Full details
   convenience     "New             including:
   store near       emergency!"      - Exact GPS
   City Hall"                         location
                                     - Photo from
                                       caller
                                     - Description
                                     - Caller contact


   ✓ Exact location (not "near church")
   ✓ Caller photo available
   ✓ Direct contact number


PHASE 2: EN ROUTE
━━━━━━━━━━━━━━━━━

   2:03 AM          2:05 AM          2:07 AM
   ─────────        ─────────        ─────────
   Taps "Accept"    Map shows:      Navigates
   assignment       optimal route    with turn-by-
                    to scene        turn GPS


   ✓ One-tap acceptance
   ✓ Best route calculated
   ✓ Turn-by-turn navigation


PHASE 3: ON SCENE
━━━━━━━━━━━━━━━━━

   2:10 AM          2:15 AM          2:20 AM
   ─────────        ─────────        ─────────
   Arrives,         Sees store       Taps "On
   checks scene    owner on         Scene"
                   ground

   Sends chat to
   caller: "Kan-
   to kami, may
   nadagdag na
   details?"


   ✓ Quick status update
   ✓ Can message caller for more info


PHASE 4: UPDATES
━━━━━━━━━━━━━━━━

   2:25 AM          2:30 AM          2:45 AM
   ─────────        ─────────        ─────────
   Suspects         Taps "Request   Taps
   fled.           backup" -        "Incident
   Calls PNP:      sends alert     Resolved"
   "Suspects       to nearby
   fled north"     units


   ✓ Can request backup instantly
   ✓ Real-time coordination


─────────────────────────────────────────────────────────────────────────────
RESULT: Faster response, exact location, better coordination
─────────────────────────────────────────────────────────────────────────────
```

---

## Journey 3: Elena Monitors Fire Emergencies

### Persona: Elena Rivera, 38-year-old Fire Station Monitor
### Scenario: Multiple fires reported - but responders self-dispatch

---

### Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              ELENA'S JOURNEY: Monitoring Multiple Fire Emergencies        │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: MONITORING
━━━━━━━━━━━━━━━━━━━━

   5:02 PM          5:03 PM          5:04 PM
   ─────────        ─────────        ─────────
   New report       System           System
   appears on      shows:           shows:
   map              - Apartment      - Warehouse
                    fire, Tondo      fire, Navotas
                    STATUS:         STATUS:
                    "Engine 12      "Engine 8
                    EN ROUTE"       EN ROUTE"


   ✓ All reports visible on single map
   ✓ Responders self-dispatched - Elena doesn't need to assign!
   ✓ Real-time status: who is responding


PHASE 2: SUPPORT (Only When Needed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   5:08 PM          5:09 PM          5:10 PM
   ─────────        ─────────        ─────────
   Third fire      System           Elena
   reported:       shows:           taps
   School in       "NO RESPONDER   "Assign
   Sta. Ana        IN RANGE"        Nearest"


   ✓ Elena only acts when no one responds
   ✓ Not overwhelmed - system handles most dispatch


PHASE 3: COORDINATION
━━━━━━━━━━━━━━━━━━━━

   5:15 PM          5:30 PM          5:45 PM
   ─────────        ─────────        ─────────
   Elena           All three       Fire trucks
   monitors:       fires have       arriving
   - Engine 12     responders       one by one
     at Tondo      en route
   - Engine 8      (self-
     at Navotas    dispatched)
   - Engine 7
     assigned to
     Sta. Ana


   ✓ Real-time tracking of all units
   ✓ Can see who is responding to what


PHASE 4: RESOLUTION
━━━━━━━━━━━━━━━━━━━━

   5:45 PM          6:00 PM          6:15 PM
   ─────────        ─────────        ─────────
   Engine 12:       All fires       Elena
   "Fire under      controlled       generates
   control"                          report with
                                    timestamps
   ✓ Status                     ✓ Auto-logged
     updates                     ✓ One-click
     auto-                         export
     logged
                                     for
                                     accountability


─────────────────────────────────────────────────────────────────────────────
RESULT: Coordinated response, real-time visibility, auto-logging
─────────────────────────────────────────────────────────────────────────────
```

---

## Journey 4: Dr. Sarah Responds as First Aider

### Persona: Dr. Sarah Binay, 29-year-old ICU Nurse
### Scenario: Medical emergency nearby while off-duty

---

### Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│         SARAH'S JOURNEY: First Aider Responding to Medical Emergency      │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: ALERT RECEIVED (Automatic - No Mode Switching Needed)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   9:15 AM          9:16 AM          9:17 AM
   ─────────        ─────────        ─────────
   While driving    Phone            Notification:
   home (normal     vibrates:       "Medical
   app usage),      "Medical         emergency
   push notification         emergency        500m away:
   arrives          nearby!"         Pedestrian
   automatically                     hit by jeepney"


   ✓ Alert arrives automatically (no switching modes)
   ✓ Alerted to emergencies within radius
   ✓ Details: exact location, type


PHASE 2: DECISION
━━━━━━━━━━━━━━━━━━

   9:17 AM          9:18 AM          9:19 AM
   ─────────        ─────────        ─────────
   Shows:           Sarah taps      Taps
   - Exact         "Accept         "Navigate"
   location       to Respond"
   - ETA to
     scene
   - "Need
     first aid?"


   ✓ Can accept or decline
   ✓ Shows distance and time


PHASE 3: RESPONSE
━━━━━━━━━━━━━━━━━━

   9:20 AM          9:25 AM          9:30 AM
   ─────────        ─────────        ─────────
   Arrives at      Checks          Sends
   scene,          patient         update:
   identifies      - Conscious     "On scene,
   herself to      - Bleeding      applying
   victim          from head       pressure"
                  wound


   ✓ Can communicate with reporter
   ✓ Status visible to ambulance


PHASE 4: COORDINATION
━━━━━━━━━━━━━━━━━━━━━━

   9:30 AM          9:40 AM          9:50 AM
   ─────────        ─────────        ─────────
   Chat with        Ambulance       Ambulance
   ambulance:       arrives         arrives:
   "Patient        - Sarah guides  - Patient
   stable,         them to         stable
   applying        exact           - Handed over
   pressure"         location       to EMTs


   ✓ Direct coordination with ambulance
   ✓ Seamless handoff


─────────────────────────────────────────────────────────────────────────────
RESULT: Faster medical attention before ambulance arrives
─────────────────────────────────────────────────────────────────────────────
```

---

## Journey 5: Marites Reports Domestic Violence (Anonymous)

### Persona: Marites Bulalakaw, 45-year-old Neighbor
### Scenario: Hearing domestic abuse next door

---

### Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│         MARITES' JOURNEY: Reporting Domestic Violence Anonymously         │
└─────────────────────────────────────────────────────────────────────────────┘

PHASE 1: WITNESSING
━━━━━━━━━━━━━━━━━━━━

   11:00 PM         11:10 PM         11:15 PM
   ─────────         ─────────        ─────────
   Hears             Frightened,     Decides to
   screaming         wants to        do something
   from next        help but
   door             scared


   Pain Point: Fear of retaliation


PHASE 2: ANONYMOUS REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━

   11:16 PM         11:17 PM         11:18 PM
   ─────────         ─────────        ─────────
   Opens app,       Selects          Selects
   taps "Report     "Domestic       "Witness"
   - What she       audio (if
    hears           safely)
   - "Woman and    recorded)
    children
    screaming"


   ✓ Can report without revealing identity
   ✓ Audio evidence option
   ✓ One-tap submit


PHASE 4: PROTECTION
━━━━━━━━━━━━━━━━━━━━

   11:25 PM         11:35 PM         11:45 PM
   ─────────         ─────────        ─────────
   Report            Police          Push:
   goes to          dispatched      "Police
   Women's &        (not sent to    arrived at
   Children's       address -       location"
   Protection       dispatched
   Desk (WCPD)      silently)


   ✓ Routed to specialized unit
   ✓ Silent dispatch for safety


─────────────────────────────────────────────────────────────────────────────
RESULT: Domestic violence can be reported safely without retaliation
─────────────────────────────────────────────────────────────────────────────
```

---

## Journey Summary Table

| Journey | Persona | Key Value |
|---------|---------|-----------|
| 1: Report Accident | Maria (Citizen) | One-tap report, live tracking |
| 2: Respond to Robbery | Sgt. Juan (Police) | Direct dispatch, exact location, navigation |
| 3: Monitor Fires | Elena (Station Monitor) | Support when no responders, real-time tracking |
| 4: First Aider | Dr. Sarah (Nurse) | Help before ambulance arrives |
| 5: DV Report | Marites (Witness) | Anonymous, safe reporting |

---

## System Architecture: Decentralized Model

```
                    ┌─────────────────┐
                    │   PUBLIC APP    │
                    │  (Report +      │
                    │   Track)        │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │      EMERGENCY REPORT        │
              │  (Type + Location + Photo)   │
              └──────────────┬───────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│    POLICE     │    │   AMBULANCE   │    │     FIRE     │
│   (Direct)    │    │   (Direct)    │    │   (Direct)   │
│  Self-dispatch│    │ Self-dispatch │    │Self-dispatch │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │           FIRST AIDERS (Direct)          │
        │  Based on profession:                    │
        │  - Nurses/Doctors → Medical             │
        │  - Fire-trained → Fire                   │
        │  - Lifeguards → Water                   │
        └────────────────────┬────────────────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │        DISPATCHER (Optional Support)     │
        │  - Monitor all incidents                 │
        │  - Assign if no responders self-dispatch │
        │  - Coordinate mass emergencies           │
        │  - Support barangay tanods               │
        └──────────────────────────────────────────┘
```

---

**Document Version:** 1.2  
**Last Updated:** 2026-03-05
