# Prototype Prompt: Dispatcher Dashboard (Emergency Response Platform)

---

## 1. Role Definition

You are a world-class UI/UX engineer and frontend developer, specializing in enterprise dashboard design and real-time monitoring systems using React and Tailwind CSS.

---

## 2. Task Description

Create a **dispatcher dashboard prototype** for the Toyota Emergency Response Platform - a web-based monitoring interface used by barangay-level station monitors and dispatchers to oversee emergency response operations in the Philippines.

**Scope:** Single barangay operation - MVP pilot for Brgy. Zone 1, Tondo, Manila

**Design Style:** WeChat Work Style - simple, professional, tech blue primary color (#3478F6), clear information hierarchy, efficiency-oriented.

**Core Keywords:** Real-time monitoring, Command center, Professional, Data-dense, Responsive

---

## 3. Tech Stack Specifications

- **Framework:** React 18 with Vite
- **CSS:** Tailwind CSS 3.x via CDN
- **Icons:** Material Icons (Google Fonts)
- **Viewport:** Desktop-first (1280px min-width), responsive down to tablet (768px)
- **Font:** System sans-serif (Inter fallback)
- **Map Placeholder:** Static map image or CSS-based map visualization
- **No external images required** - use colored divs and icons for all visual elements

---

## 4. Visual Design Requirements

### 4.1 Color Palette

```
Primary Colors:
- Tech Blue: #3478F6 (primary actions, active states, links)
- Link Blue: #576B95 (secondary links)
- Alert Red: #FA5151 (urgent alerts, critical incidents)
- Warning Orange: #FF976A (warnings, pending status)
- Success Green: #52C41A (resolved, available)

Neutral Colors:
- Title Black: #191919 (headings)
- Text Gray: #333333 (body text)
- Secondary Text: #666666 (subtitles)
- Light Text: #999999 (captions, timestamps)
- Divider: #E5E5E5 (borders, separators)
- Background Area: #F7F8FA (page backgrounds)
- Card Background: #FFFFFF (cards, panels)

Emergency Type Colors:
- Police Blue: #4169E1
- Ambulance Green: #52C41A  
- Fire Red: #FA5151
- Other Orange: #FA8C16
```

### 4.2 UI Component Specifications

#### Cards
- Background: White (#FFFFFF)
- Border Radius: 8px
- Shadow: shadow-sm (0 1px 2px rgba(0,0,0,0.05))
- Padding: 16px
- Border: 1px solid #E5E5E5

#### Buttons
- Primary: #3478F6 background, white text, 36px height, 4px radius
- Secondary: White background, #3478F6 border and text
- Danger: #FA5151 background, white text
- Hover: darken 10%
- Active: opacity 90%

#### Status Badges
- Available: Green (#52C41A) background, white text
- En Route: Blue (#3478F6) background, white text
- On Scene: Orange (#FF976A) background, white text
- Pending: Gray (#999999) background, white text

#### List Items
- Height: 56px minimum
- Left icon/avatar: 40px
- Divider: 1px #E5E5E5, inset from left

---

## 5. Layout Structure

### 5.1 Main Dashboard Layout (Desktop - 1280px+)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ HEADER (56px height)                                                         │
│ ┌─────────────────────────────────────────┬───────────────────────────────┐ │
│ │ 🚨 Toyota Emergency Response     Station: Brgy. Zone 1, Tondo        │ │
│ │                                          │ 👤 Admin User  │ 🔔 3        │ │
│ └─────────────────────────────────────────┴───────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ STATS BAR (100px height)                                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│ │ Active   │ │ En Route │ │ On Scene │ │ Resolved │ │ Avg Resp │            │
│ │   12     │ │    8     │ │    4     │ │   156    │ │  8.5 min │            │
│ │ incidents│ │ responders│ │  today   │ │  today   │ │          │            │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘            │
├─────────────────────────────────────────────────────────────────────────────┤
│ MAIN CONTENT AREA                                                            │
│ ┌───────────────────────────────────────┬─────────────────────────────────┐ │
│ │ MAP VIEW (60% width)                  │ SIDE PANEL (40% width)          │ │
│ │ ┌─────────────────────────────────┐   │ ┌─────────────────────────────┐ │ │
│ │ │                                 │   │ │ 🔔 ALERTS (2 urgent)        │ │ │
│ │ │    [Interactive Map]           │   │ │ ─────────────────────────── │ │ │
│ │ │                                 │   │ │ ⚠️ No responders assigned   │ │ │
│ │ │   📍 Emergency A               │   │ │ to Fire at Tayuman         │ │ │
│ │ │       🚑                        │   │ │ ⏰ 3 min ago               │ │ │
│ │ │         📍 Emergency B          │   │ │                             │ │ │
│ │ │           🚒                   │   │ │ ⚠️ Delayed response >15min  │ │ │
│ │ │   👮 Responders: 3             │   │ │ at Quezon Ave incident      │ │ │
│ │ │                                 │   │ │                             │ │ │
│ │ └─────────────────────────────────┘   │ └─────────────────────────────┘ │ │
│ └───────────────────────────────────────┴─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ BOTTOM PANEL - TABS                                                          │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [Active Incidents (12)] [Responders on Duty (24)] [All Incidents]      │ │
│ │ ─────────────────────────────────────────────────────────────────────── │ │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │ │
│ │ │🚑 EMERG-1│ │🚒 EMERG-2│ │🚑 EMERG-3│ │👮 EMERG-4│ │🚑 EMERG-5│       │ │
│ │ │Medical   │ │Fire       │ │Medical   │ │Police    │ │Medical   │       │ │
│ │ │Tayuman  │ │Espanya    │ │quezon Ave│ │Rizal Ave │ │Mabini    │       │ │
│ │ │12 min   │ │8 min      │ │15 min ⚠️ │ │En Route  │ │Pending   │       │ │
│ │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Responsive Breakpoints

- **Desktop (1280px+):** Full layout as shown above
- **Tablet (768px-1279px):** Stack map above side panel, reduce stats to 3 columns
- **Mobile (below 768px):** Single column, tabs become horizontal scroll, stats as horizontal scroll cards

---

## 6. Page Content & Data

### 6.1 Header
- Logo/App name: "Toyota Emergency Response" with alert icon
- Current station: "Brgy. Zone 1, Tondo - Dispatch Center"
- Notification bell with count badge (3)
- User avatar with dropdown

### 6.2 Stats Cards (5 cards)
| Card | Value | Label | Color |
|------|-------|-------|-------|
| 1 | 12 | Active Incidents | #3478F6 |
| 2 | 8 | En Route | #52C41A |
| 3 | 4 | On Scene Today | #FF976A |
| 4 | 156 | Resolved Today | #52C41A |
| 5 | 8.5 min | Avg Response | #3478F6 |

### 6.3 Alert Section (Top right panel)
```
🔔 ALERTS (2 urgent)

⚠️ No responders assigned
Fire incident atJuan Luna St, Brgy. 105, Tondo
Assigned: None | Reported: 3 min ago
[MANUALLY ASSIGN]

⚠️ Delayed response (>15 min)
Medical emergency at Magsaysay Blvd
Responder: Paramedic Reyes (ETA: 5 min)
[FOLLOW UP]
```

### 6.4 Active Incidents Tab (Sample Data - 5 items)
```
| Type | ID | Location | Status | Time |
|------|-----|----------|--------|------|
| 🚑 Medical | #EMG-2026-0142 | Juan Luna St, Brgy. 105, Tondo | En Route | 12 min |
| 🚒 Fire | #EMG-2026-0141 | Magsaysay Blvd, Brgy. 98, Tondo | En Route | 8 min |
| 🚑 Medical | #EMG-2026-0140 | C. M. Recto Ave, Brgy. 100, Tondo | ⚠️ Delayed | 15 min |
| 👮 Police | #EMG-2026-0139 | Evangelista St, Brgy. 101, Tondo | En Route | 6 min |
| 🚑 Medical | #EMG-2026-0138 | Antipolo St, Brgy. 103, Tondo | ⏳ Pending | 2 min |
```

### 6.5 Responders on Duty Tab (Sample Data - 4 items)
```
| Name | Unit | Status | Current Incident | ETA |
|------|------|--------|------------------|-----|
| Sgt. Juan Dela Cruz | Police Unit 12 | En Route | #EMG-2026-0139 | 4 min |
| Paramedic Maria Santos | Ambulance 05 | En Route | #EMG-2026-0140 | 5 min |
| Firefighter Pedro Reyes | Fire Truck 08 | On Scene | #EMG-2026-0141 | -- |
| Nurse Elena Rivera | First Aider | Available | -- | -- |
```

---

## 7. Implementation Details

### 7.1 Layout
- Use CSS Grid for main layout (header, stats, content, bottom)
- Use Flexbox for internal component layouts
- Fixed header (sticky top)
- Bottom panel with fixed tabs, scrollable content

### 7.2 Typography
- Font: Inter, -apple-system, BlinkMacSystemFont, sans-serif
- Header title: 18px bold
- Section headers: 14px semibold
- Body text: 14px regular
- Captions: 12px regular
- Stats numbers: 28px bold

### 7.3 Interactive Elements
- Tab switching (click to change active tab)
- Alert action buttons (hover effect)
- Incident row hover state (light gray background)
- Map markers clickable (show tooltip)

### 7.4 Responsive Behavior
- Desktop: Full multi-column layout
- Tablet: Stack map above, reduce stats columns
- Mobile: Single column, horizontal scroll for stats and lists

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
      }
    }
  }
}
```

---

## 9. Content Structure Hierarchy

```
Dispatcher Dashboard
├─ Header
│  ├─ Logo & App Name
│  ├─ Station Info
│  ├─ Notifications (badge count)
│  └─ User Menu
├─ Stats Bar (5 cards)
│  ├─ Active Incidents
│  ├─ En Route
│  ├─ On Scene
│  ├─ Resolved Today
│  └─ Avg Response Time
├─ Main Content
│  ├─ Map View Panel
│  │  ├─ Map placeholder/visualization
│  │  ├─ Emergency markers
│  │  └─ Responder markers
│  └─ Alerts Panel
│     ├─ Alert Item 1
│     └─ Alert Item 2
└─ Bottom Panel (Tabs)
   ├─ Tab: Active Incidents
   │  └─ Incident List (scrollable)
   ├─ Tab: Responders on Duty
   │  └─ Responder List (scrollable)
   └─ Tab: All Incidents
      └─ Historical List
```

---

## 10. Special Requirements

### 10.1 Emergency Type Indicators
- Police: Blue badge with 👮 emoji or shield icon
- Ambulance: Green badge with 🚑 emoji or medical cross
- Fire: Red badge with 🚒 emoji or flame icon
- Other: Orange badge with ⚠️ emoji

### 10.2 Status States
- Pending: Gray, waiting for assignment
- Assigned: Blue, responder notified
- En Route: Blue, responder traveling
- On Scene: Orange, responder at location
- Resolved: Green, incident closed

### 10.3 Alert Urgency Levels
- Critical (red): No responders assigned >5 min
- Warning (orange): Response delayed >15 min
- Info (blue): General notifications

### 10.4 Map Visualization
Since no external map API, create a CSS-based schematic map:
- Light gray background (#F0F0F0)
- Darker gray roads (CSS lines or divs)
- Colored dots for emergency locations
- Different shapes for responder locations

---

## 11. Output Format

**Output:** Complete HTML file with embedded Tailwind CSS and React components (using CDN for React/Babel if needed, or pure HTML/CSS/JS)

**Deliverable Requirements:**
1. Single HTML file that opens directly in browser
2. Desktop viewport: 1280px width (centered, max-width: 1440px)
3. Responsive down to 768px tablet
4. All interactive elements functional (tabs, hover states, buttons)
5. No placeholder text - use realistic Philippine location names
6. Clean, professional appearance matching WeChat Work style
7. Use Material Icons font for all icons
8. Include sample data as specified above

**File name:** dispatcher-dashboard.html

---

## 12. Sample Tondo, Manila Location Names (Barangay-Level)

- Juan Luna St, Brgy. 105, Tondo, Manila
- Magsaysay Blvd, Brgy. 98, Tondo, Manila
- C. M. Recto Ave, Brgy. 100, Tondo, Manila
- Evangelista St, Brgy. 101, Tondo, Manila
- Antipolo St, Brgy. 103, Tondo, Manila
- D. Tuazon St, Brgy. 104, Tondo, Manila
-quezon Blvd, Brgy. Zone 1, Tondo, Manila
- Tayuman St, Brgy. 106, Tondo, Manila
- Dagupan St, Brgy. 99, Tondo, Manila
- Aurora Blvd, Brgy. 102, Tondo, Manila
