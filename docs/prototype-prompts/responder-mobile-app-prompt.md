# Prototype Prompt: Responder Mobile App (Emergency Response Platform)

---

## 1. Role Definition

You are a world-class UI/UX engineer and frontend developer, specializing in mobile app design for emergency services and field operations using React Native and Tailwind CSS.

---

## 2. Task Description

Create a **responder mobile app prototype** for the Toyota Emergency Response Platform - a mobile interface used by Police, Ambulance, and Fire responders to receive emergency dispatch notifications, view incident details, navigate to locations, and communicate with dispatchers.

**Scope:** Single barangay operation - MVP pilot for Brgy. Zone 1, Tondo, Manila

**Design Style:** WeChat Work Style - simple, professional, tech blue primary color (#3478F6), clear information hierarchy, optimized for one-handed field use.

**Core Keywords:** Field ops, Quick response, Map-focused, One-tap actions, Professional

---

## 3. Tech Stack Specifications

- **Framework:** React Native (Expo) or React with mobile-optimized CSS
- **CSS:** Tailwind CSS 3.x via CDN
- **Icons:** Material Icons (Google Fonts)
- **Viewport:** Mobile-first (375px width, iPhone simulation)
- **Font:** System sans-serif (San Francisco on iOS, Roboto on Android)
- **Map Placeholder:** CSS-based map visualization or static map image
- **Orientation:** Portrait only (primary)

---

## 4. Visual Design Requirements

### 4.1 Color Palette

```
Primary Colors:
- Tech Blue: #3478F6 (primary actions, active states)
- Link Blue: #576B95 (secondary elements)
- Alert Red: #FA5151 (urgent, emergency button)
- Warning Orange: #FF976A (warnings, delayed status)
- Success Green: #52C41A (available, resolved)

Neutral Colors:
- Title Black: #191919 (headings)
- Text Gray: #333333 (body text)
- Secondary Text: #666666 (subtitles)
- Light Text: #999999 (captions, timestamps)
- Divider: #E5E5E5 (borders)
- Background: #F7F8FA (page background)
- Card Background: #FFFFFF (cards)

Emergency Type Colors:
- Police: #4169E1 (Royal Blue)
- Ambulance: #52C41A (Green)
- Fire: #FA5151 (Red)
- Other: #FA8C16 (Orange)
```

### 4.2 UI Component Specifications

#### Header
- Height: 56px
- Background: White with bottom border (#E5E5E5)
- Title: 18px bold, centered
- Left: Back arrow (if applicable)
- Right: Status indicator, settings icon

#### Status Toggle Bar
- Height: 60px
- Background: White
- Three status options: Available | En Route | On Scene
- Active state: Tech blue (#3478F6) background, white text
- Inactive: Gray text (#999999), light gray background

#### Emergency Card
- Background: White
- Border Radius: 12px
- Shadow: shadow-md (0 4px 12px rgba(0,0,0,0.08))
- Padding: 16px
- Border-left: 4px solid (emergency type color)

#### Action Buttons
- Primary: #3478F6 background, white text, 48px height, 8px radius
- Danger: #FA5151 background, white text
- Secondary: White background, #3478F6 border and text
- Full-width for main actions

#### Map Container
- Height: 45% of screen
- Background: #F0F0F0 (placeholder gray)
- Border radius: 12px at top corners
- Markers: Colored dots with icons

#### Bottom Action Bar
- Height: 80px (including safe area)
- Background: White with top border
- Two main buttons: Accept/Decline or Call/Chat

---

## 5. Screen Structure

### 5.1 Main Screen Layout (Default View - Available)

```
┌─────────────────────────────────────────┐
│ ≡  Emergency Response    [⚙️] [🔔 2]   │ <- Header (56px)
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         🗺️ MAP VIEW             │   │
│  │                                 │   │
│  │    📍 Your Location (blue)     │   │
│  │                                 │   │
│  │   🚑 2 nearby emergencies      │   │
│  │      • Quezon Ave - 0.8km      │   │
│  │      • Mabini St - 1.2km       │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │ <- Map (45%)
│                                         │
├─────────────────────────────────────────┤
│  🚨 NEARBY EMERGENCY                    │
│  ┌─────────────────────────────────┐   │
│  │ 🚑 Medical Emergency            │   │
│  │ 📍 Quezon Ave, Cubao           │   │
│  │ ⏰ 3 min ago | 👤 Maria Santos  │   │
│  │ 📏 0.8 km away                  │   │
│  │                                 │   │
│  │ [ACCEPT]  [DECLINE]            │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Available  │  En Route  │  On Scene   │ <- Status Toggle (60px)
└─────────────────────────────────────────┘
```

### 5.2 En Route View (After Accepting)

```
┌─────────────────────────────────────────┐
│ ←  En Route to Emergency        [🔔]   │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │         🗺️ MAP VIEW             │   │
│  │                                 │   │
│  │   🚑 ← You (moving)             │   │
│  │        ════════                 │   │
│  │              📍                 │   │
│  │           Destination           │   │
│  │                                 │   │
│  │   ETA: 5 min | 2.3 km          │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  🚑 MEDICAL EMERGENCY                   │
│  #EMG-2026-0142                         │
│  📍 Juan Luna St, Brgy. 105, Tondo      │
│  👤 Maria Santos | 📱 0912-345-6789    │
│  ─────────────────────────────────────  │
│  "Patient having chest pain,           │
│   conscious but difficulty breathing"  │
├─────────────────────────────────────────┤
│  ┌───────────────┐ ┌───────────────┐    │
│  │    📞 CALL    │ │    💬 CHAT   │    │
│  └───────────────┘ └───────────────┘    │
├─────────────────────────────────────────┤
│  Available  │  En Route  │  On Scene   │
└─────────────────────────────────────────┘
```

### 5.3 On Scene View

```
┌─────────────────────────────────────────┐
│ ←  On Scene                 [🔔]       │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │         🗺️ MAP VIEW             │   │
│  │                                 │   │
│  │           📍                    │   │
│  │        You & Patient            │   │
│  │                                 │   │
│  │   ✅ Arrived at location        │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  🚑 ON SCENE - MEDICAL                  │
│  Patient: Maria Santos                  │
│  Status: Receiving treatment            │
│  ─────────────────────────────────────  │
│  [REQUEST BACKUP] [UPDATE STATUS]       │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │  Dispatch: 0917-111-2233       │   │
│  │  Reporter: 0912-345-6789       │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Available  │  En Route  │  On Scene   │
└─────────────────────────────────────────┘
```

---

## 6. Page Content & Data

### 6.1 Sample Emergency Data

```
EMERGENCY 1:
- Type: Medical (Ambulance)
- ID: #EMG-2026-0142
- Location: Juan Luna St, Brgy. 105, Tondo, Manila
- Landmark: Near 7-Eleven
- Reporter: Maria Santos
- Phone: 0912-345-6789
- Description: "Patient having chest pain, conscious but difficulty breathing"
- Time reported: 3 minutes ago
- Distance: 0.8 km

EMERGENCY 2:
- Type: Fire
- ID: #EMG-2026-0143
- Location: Magsaysay Blvd, Brgy. 98, Tondo, Manila
- Landmark: Near Tondo Public Market
- Reporter: Juan dela Cruz
- Phone: 0918-222-3344
- Description: "Kitchen fire on 2nd floor, smoke visible"
- Time reported: 5 minutes ago
- Distance: 1.2 km
```

### 6.2 Responder Profile (Hardcoded)

```
Name: Paramedic Pedro Reyes
Badge: #AMB-2024-889
Unit: Ambulance 05
Station: Quezon City Emergency Response
Status: Available
```

### 6.3 Status Toggle States

| Status | Color | Actions Available |
|--------|-------|-------------------|
| Available | Green dot | Accept/Decline emergencies |
| En Route | Blue dot | Call Reporter, Chat, Navigate |
| On Scene | Orange dot | Update Status, Request Backup |

---

## 7. Implementation Details

### 7.1 Layout
- Single page app with view switching based on status
- Fixed header (56px)
- Map takes 45% of viewport height
- Scrollable content below map
- Fixed bottom status toggle bar (60px)
- Safe area padding for notched devices

### 7.2 Typography
- Font: System sans-serif
- Screen title: 18px bold
- Section headers: 16px semibold
- Body text: 14px regular
- Captions: 12px regular
- Emergency ID: 12px, monospace

### 7.3 Interactive Elements
- Status toggle: Tap to switch status (with confirmation for Available)
- Accept/Decline buttons: Primary and secondary styling
- Call button: Opens dialer (href="tel:")
- Chat button: Placeholder for in-app chat
- Map markers: Clickable for details

### 7.4 View States
1. **Available View:** Shows map + nearby emergencies + Accept/Decline buttons
2. **En Route View:** Shows map with route + emergency details + Call/Chat
3. **On Scene View:** Shows map at destination + status actions + contact info

### 7.5 Animations
- Status toggle: Smooth color transition (200ms)
- Button tap: Scale down to 0.98 + opacity change
- Card appearance: Fade in (300ms)

---

## 8. Tailwind Configuration

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'brand-primary': '#3478F6',
        'brand-link': '#576B95',
        'brand-alert': '#FA5151',
        'brand-warning': '#FF976A',
        'brand-success': '#52C41A',
        'text-primary': '#191919',
        'text-secondary': '#333333',
        'text-muted': '#666666',
        'text-light': '#999999',
        'divider': '#E5E5E5',
        'bg-area': '#F7F8FA',
        'emergency-police': '#4169E1',
        'emergency-ambulance': '#52C41A',
        'emergency-fire': '#FA5151',
        'emergency-other': '#FA8C16',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
      }
    }
  }
}
```

---

## 9. Content Structure Hierarchy

```
Responder Mobile App
├─ Header
│  ├─ Menu icon (hamburger)
│  ├─ Title: "Emergency Response"
│  ├─ Notification bell (with badge)
│  └─ Settings icon
├─ Map Section (45vh)
│  ├─ Map placeholder/visualization
│  ├─ User location marker
│  ├─ Emergency markers
│  └─ ETA display
├─ Emergency Details Card
│  ├─ Emergency type badge (color-coded)
│  ├─ Location with landmark
│  ├─ Reporter info
│  ├─ Description
│  └─ Action buttons (context-dependent)
│     ├─ Available: Accept + Decline
│     ├─ En Route: Call + Chat
│     └─ On Scene: Request Backup + Update Status
└─ Status Toggle Bar
   ├─ Available (green)
   ├─ En Route (blue)
   └─ On Scene (orange)
```

---

## 10. Special Requirements

### 10.1 Emergency Type Visual Indicators
- Left border: 4px solid emergency type color
- Icon: Corresponding emoji (🚑🚒👮⚠️)
- Badge: Small rounded pill with type name

### 10.2 Status Toggle Behavior
- Only "Available" allows accepting new emergencies
- Tapping "Available" while on emergency shows confirmation dialog
- Status persists across app restarts (localStorage)

### 10.3 Map Placeholder
Create a CSS-based map visualization:
- Light gray background (#E8E8E8)
- Gray curved lines for roads
- Blue dot for user location
- Colored dots for emergencies (different colors by type)
- "Navigate" indicator showing direction to destination

### 10.4 Phone Number Links
- Call button: `href="tel:09123456789"`
- All Philippine mobile number format: 09XX-XXX-XXXX

### 10.5 Responsive Behavior
- Primary: 375px width (iPhone SE/standard)
- Max-width: 430px (iPhone Max), centered on larger screens
- Safe area insets for notched devices

---

## 11. Output Format

**Output:** Complete HTML file with embedded Tailwind CSS (simulating React Native mobile app)

**Deliverable Requirements:**
1. Single HTML file that opens directly in browser
2. Mobile viewport: 375px width (centered on desktop)
3. Fixed to portrait orientation (no landscape)
4. All status toggle states functional
5. Accept/Decline/Call/Chat buttons with visual feedback
6. No placeholder text - use realistic Philippine data
7. Clean, professional WeChat Work style appearance
8. Use Material Icons for all icons
9. Include sample data as specified above
10. Smooth animations for state transitions

**File name:** responder-mobile-app.html

---

## 12. Philippine Context Data - Tondo, Manila (Barangay-Level)

### Sample Responder Names
- Paramedic Pedro Reyes
- Police Sgt. Juan dela Cruz
- Firefighter Maria Santos
- Nurse Elena Rivera

### Sample Phone Numbers
- 0912-345-6789
- 0917-111-2233
- 0928-444-5566

### Sample Locations (Brgy. Zone 1, Tondo, Manila)
- Juan Luna St, Brgy. 105, Tondo, Manila
- Magsaysay Blvd, Brgy. 98, Tondo, Manila
- C. M. Recto Ave, Brgy. 100, Tondo, Manila
- Evangelista St, Brgy. 101, Tondo, Manila
- Antipolo St, Brgy. 103, Tondo, Manila
- D. Tuazon St, Brgy. 104, Tondo, Manila
- Tayuman St, Brgy. 106, Tondo, Manila
- Dagupan St, Brgy. 99, Tondo, Manila
