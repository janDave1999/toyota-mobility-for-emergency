# Figma Prototype Specifications
## Emergency Response Platform - Public App (Citizen)

**Date:** 2026-03-06  
**Scope:** Public App - Core MVP Features (Barangay-Level Pilot)
**Service Area:** Brgy. Zone 1, Tondo, Manila
**Time Estimate:** 2 hours for wireframes + 2 hours for interactive prototype

---

## Screen Flow Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PUBLIC APP - SCREEN FLOW                         │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐     ┌─────────────┐     ┌─────────────┐
    │ SCREEN 1│     │  SCREEN 2   │     │  SCREEN 3   │
    │  HOME   │────▶│ EMERGENCY   │────▶│   REPORT    │
    │         │     │    TYPE     │     │    FORM     │
    └─────────┘     └─────────────┘     └──────┬──────┘
                                                │
    ┌─────────┐     ┌─────────────┐              │
    │ SCREEN 6│     │  SCREEN 5   │              │
    │   POST- │◀────│  TRACKING   │◀─────────────┘
    │RESOLUTION│    │    MAP      │
    └─────────┘     └─────────────┘
```

---

## Screen Specifications

### SCREEN 1: HOME (One-Tap Emergency)

**Purpose:** Immediate access to report emergency

**Layout:**
```
┌─────────────────────────────────────────┐
│  Toyota Emergency        [Settings ⚙️] │
│                                         │
│                                         │
│           ┌───────────────┐             │
│           │               │             │
│           │     🚨        │             │
│           │   TAP TO      │             │
│           │   REPORT     │             │
│           │  EMERGENCY   │             │
│           │               │             │
│           └───────────────┘             │
│                                         │
│                                         │
│  Recent: No active emergencies          │
│                                         │
│                                         │
│  [My Profile]          [First Aider]    │
└─────────────────────────────────────────┘
```

**Specifications:**

| Element | Details |
|---------|---------|
| **Header** | App name left, Settings icon right |
| **Main Button** | 200x200px circle, Red (#FA5151), white icon |
| **Button Text** | "TAP TO REPORT" - White, Bold, 18pt |
| **Button Animation** | Subtle pulse (scale 1.0 → 1.05, 2s loop) |
| **Recent Status** | Gray text (#999999), 14pt, bottom area |
| **Bottom Nav** | Profile left, First Aider toggle right |
| **Background** | White (#FFFFFF) |

**Interactions:**
- Tap main button → Navigate to Screen 2 (Emergency Type)
- Tap Settings → (Out of scope for prototype)
- Tap Profile → (Out of scope for prototype)
- Tap First Aider → (Out of scope for prototype)

---

### SCREEN 2: EMERGENCY TYPE SELECTION

**Purpose:** Select type of emergency

**Layout:**
```
┌─────────────────────────────────────────┐
│  [< Back]     Select Type               │
│                                         │
│  What's the emergency?                  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 👮  POLICE                       │   │
│  │    Crime, Theft, Danger          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🚑  AMBULANCE                    │   │
│  │    Medical, Injury, Accident      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔥  FIRE                         │   │
│  │    Fire, Gas Leak, Explosion     │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ⚠️  OTHER                        │   │
│  │    Other emergency               │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Specifications:**

| Element | Details |
|---------|---------|
| **Header** | Back arrow + "Select Type" title |
| **Question** | "What's the emergency?" - 20pt, Bold, Dark Gray |
| **Option Cards** | Full width, 72px height, White with shadow |
| **Card Icon** | 24x24px, left aligned, 16px padding |
| **Card Title** | 16pt, Bold, Dark Gray |
| **Card Subtitle** | 12pt, Regular, Gray |
| **Card Selected State** | Blue border (#3478F6), light blue bg |
| **Selection Logic** | Auto-advance after selection (no confirm button) |
| **Colors:** Police=Blue (#4169E1), Ambulance=Green (#52C41A), Fire=Red (#FA5151), Other=Orange (#FA8C16) |

**Interactions:**
- Tap any option → Navigate to Screen 3 (Report Form), passing selected type
- Tap Back → Return to Screen 1

---

### SCREEN 3: REPORT FORM

**Purpose:** Capture emergency details

**Layout:**
```
┌─────────────────────────────────────────┐
│  [< Back]     Report Emergency    [✓]  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🚑  AMBULANCE                    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📍 Location                            │
│  ┌─────────────────────────────────┐   │
│  │ 📍 Juan Luna St, Brgy. 105     │   │
│  │    Tondo, Manila [Change]       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📷 Photo/Video (Optional)              │
│  ┌─────────────────────────────────┐   │
│  │                                   │   │
│  │       [ + Add Photo ]            │   │
│  │                                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📝 Description (Optional)             │
│  ┌─────────────────────────────────┐   │
│  │                                   │   │
│  │  Describe what happened...       │   │
│  │                                   │   │
│  │                                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│                                         │
│         ┌───────────────┐               │
│         │   SUBMIT NOW  │               │
│         └───────────────┘               │
│                                         │
└─────────────────────────────────────────┘
```

**Specifications:**

| Element | Details |
|---------|---------|
| **Header** | Back + "Report Emergency" + Checkmark (done) |
| **Type Badge** | Selected type shown at top, colored badge |
| **Location Section** | Label + auto-filled address + Change button |
| **Location Auto-detect** | Show "Detecting location..." while loading |
| **Photo Button** | 120x120px dashed border box, + icon center |
| **Description Field** | Multi-line text, 4 lines visible, placeholder text |
| **Submit Button** | Full width, 56px height, Red (#FA5151), White text |
| **Submit Button State** | Disabled until location detected |

**Interactions:**
- Tap Submit → Navigate to Screen 4 (Tracking Map)
- Tap Photo → (Out of scope - just show button state)
- Tap Location Change → (Out of scope - just show button)
- Tap Back → Return to Screen 2

**Auto-Advance:** After submit, show loading state (1s), then advance

---

### SCREEN 4: TRACKING MAP

**Purpose:** Show emergency status and responder location

**Layout:**
```
┌─────────────────────────────────────────┐
│  [< Close]      Status                  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🚑 AMBULANCE - EN ROUTE         │   │
│  │  ETA: 8 minutes                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ████████████████████████████████████░ │ Progress bar
│                                         │
│              🗺️                         │
│         ┌─────────┐                     │
│         │   🚑   │  <- Responder       │
│         └─────────┘                     │
│                                         │
│        📍 <- You                       │
│     ┌───────────┐                       │
│     │  Hospital │  <- Destination      │
│     └───────────┘                       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📞 Call Responder              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  💬 Chat with Responder         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📍 Update My Location          │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Specifications:**

| Element | Details |
|---------|---------|
| **Header** | Close (X) + "Status" title |
| **Status Card** | Full width, shows type icon + status + ETA |
| **Progress Bar** | Horizontal, 8px height, animated fill |
| **Map Area** | 50% of screen height, placeholder map |
| **Map Markers** | You (blue dot), Responder (ambulance icon), Destination (hospital icon) |
| **Action Buttons** | Full width, 48px height, outlined style |
| **Button Icons** | 20x20px, left of text |

**Status States (for prototype):**

| State | Progress Bar | Status Text | ETA |
|-------|-------------|-------------|-----|
| Submitted | 10% | "Report Submitted" | -- |
| Dispatched | 25% | "Ambulance Dispatched" | 12 min |
| En Route | 50% | "Ambulance En Route" | 8 min |
| Arriving | 75% | "Almost There" | 2 min |
| Arrived | 90% | "Responder Arrived" | 0 min |
| Resolved | 100% | "Incident Resolved" | -- |

**Interactions:**
- Tap Close → Navigate to Screen 1 (or Screen 6 if resolved)
- Tap Call → (Out of scope - show toast "Calling...")
- Tap Chat → (Out of scope - show toast "Opening chat...")
- Auto-advance through states every 5 seconds for demo

---

### SCREEN 5: TRACKING - ARRIVED STATE

**Purpose:** Show responder has arrived

**Layout:**
```
┌─────────────────────────────────────────┐
│  [< Close]      Status                  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ✅ AMBULANCE - ARRIVED          │   │
│  │  Responder is on scene          │   │
│  └─────────────────────────────────┘   │
│                                         │
│              🗺️                         │
│         ┌─────────┐                     │
│         │   🚑   │  <- Same location   │
│         └─────────┘        as you      │
│                                         │
│        📍                               │
│     ┌───────────┐                       │
│     │  You     │                        │
│     └───────────┘                       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Responder: Paramedic Reyes     │   │
│  │  Badge: #FM-2024-889            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Stay connected for updates     │   │
│  └─────────────────────────────────┘   │
│                                         │
│         [ MONITOR STATUS ]              │
│                                         │
└─────────────────────────────────────────┘
```

**Specifications:**

| Element | Details |
|---------|---------|
| **Status Card** | Green checkmark icon, "ARRIVED" badge |
| **Responder Info** | Name + badge number from Maria's journey |
| **Map** | Markers at same location |
| **Monitor Button** | Returns to tracking state |

**Interactions:**
- Tap Close → Navigate to Screen 6 (Post-Resolution)
- Tap Monitor Status → Return to Screen 4

---

### SCREEN 6: POST-RESOLUTION

**Purpose:** Confirm incident resolved

**Layout:**
```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│           ┌───────────────┐             │
│           │               │             │
│           │      ✅       │             │
│           │               │             │
│           │   RESOLVED    │             │
│           │               │             │
│           └───────────────┘             │
│                                         │
│     Thank you for using                 │
│     Toyota Emergency                    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Summary                        │   │
│  │  Type: Ambulance               │   │
│  │  Reported: 6:31 AM             │   │
│  │  Resolved: 6:52 AM             │   │
│  │  Response: 21 minutes           │   │
│  └─────────────────────────────────┘   │
│                                         │
│                                         │
│         [ BACK TO HOME ]                │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

**Specifications:**

| Element | Details |
|---------|---------|
| **Center Icon** | Large checkmark, 80x80px, Green (#52C41A) |
| **Title** | "RESOLVED" - 24pt, Bold, Green (#52C41A) |
| **Subtitle** | "Thank you for using Toyota Emergency" - 14pt, Gray (#666666) |
| **Summary Card** | White with shadow, shows incident details |
| **Response Time** | Calculate from submit to resolved |
| **Home Button** | Full width, 56px height, Red (#FA5151) |

**Interactions:**
- Tap Back to Home → Navigate to Screen 1

---

## Prototype Interactions Summary

### Clickable Hotspots

| From Screen | To Screen | Trigger |
|-------------|-----------|---------|
| Screen 1: Home | Screen 2: Type Select | Tap emergency button |
| Screen 2: Type | Screen 3: Report Form | Tap any emergency type |
| Screen 3: Report | Screen 4: Tracking | Tap Submit |
| Screen 4: Tracking | Screen 5: Arrived | Auto-advance after 5s |
| Screen 5: Arrived | Screen 6: Resolved | Auto-advance after 3s |
| Screen 6: Resolved | Screen 1: Home | Tap "Back to Home" |
| Screen 4/5: Close | Screen 6: Resolved | Tap X (for demo, go to resolved) |

### Demo Flow Timing

For stakeholder presentation, use auto-advances:

```
Screen 1 (Home)     → Wait for tap
Screen 2 (Type)    → Wait for tap (1s)
Screen 3 (Report)  → Wait for tap, show loading (1s)
Screen 4 (Tracking)→ Auto-advance every 5s through states
Screen 5 (Arrived) → Auto-advance after 3s
Screen 6 (Resolved)→ Wait for tap to exit
```

---

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue (Tech) | #3478F6 | Primary actions, headers |
| Primary Red (Emergency) | #FA5151 | Emergency button, Submit |
| Police Blue | #4169E1 | Police type |
| Ambulance Green | #52C41A | Ambulance type |
| Fire Red | #FA5151 | Fire type |
| Other Orange | #FA8C16 | Other type |
| Success Green | #52C41A | Resolved, Arrived |
| Warning Orange | #FF976A | Warnings |
| Background | #F7F8FA | Screen backgrounds |
| White | #FFFFFF | Cards, buttons |
| Text Dark | #191919 | Headlines |
| Text Gray | #666666 | Subtitles |
| Text Light | #999999 | Captions |
| Divider | #E5E5E5 | Borders |

---

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Screen Title | System | 18pt | Bold |
| Section Header | System | 16pt | Bold |
| Body Text | System | 14pt | Regular |
| Button Text | System | 16pt | Bold |
| Caption | System | 12pt | Regular |

---

## Next Steps

1. **Create Figma file** with these 6 screens
2. **Add interactions** using Figma's prototype mode
3. **Test with stakeholder** (Project Manager)
4. **Gather feedback** and iterate if needed

---

## Design System Notes

- **Design System:** WeChat Work Style
- **Primary Color:** Tech Blue (#3478F6)
- **Emergency Colors:** Consistent with WeChat Work palette
- **Service Area:** Brgy. Zone 1, Tondo, Manila (Barangay-Level MVP)
- **Sample Locations Used:** Juan Luna St, Magsaysay Blvd, C. M. Recto Ave (all in Tondo, Manila)

---

**Document Version:** 1.0  
**Created:** 2026-03-06
