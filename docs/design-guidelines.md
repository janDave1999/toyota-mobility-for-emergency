# Design Guidelines - Toyota Mobility for Emergency

**Project:** Toyota Mobility for Emergency  
**Based on:** Toyota Brand Guidelines (brand.toyota.com)  
**Version:** 1.0  
**Date:** 2026-03-18

---

## 1. Brand Foundation

### 1.1 Core Brand Values
- **Excitement** - Energy and confidence in every interaction
- **Clarity** - Clear and legible communication
- **Trust** - Approachable yet professional
- **Reliability** - Emergency services demand instant reliability

---

## 2. Color Palette

### 2.1 Primary Colors

| Name | HEX | RGB | Usage |
|------|-----|-----|-------|
| Toyota Red | `#EB0A1E` | 235, 10, 30 | Primary CTAs, emergency indicators, brand accent |
| Black | `#000000` | 0, 0, 0 | Primary text, dark backgrounds |
| White | `#FFFFFF` | 255, 255, 255 | Backgrounds, primary text on dark |
| Gray | `#58595B` | 88, 89, 91 | Secondary text, borders, dividers |

### 2.2 Semantic Colors (Emergency Context)

| Name | HEX | RGB | Usage |
|------|-----|-----|-------|
| Critical Red | `#DC2626` | 220, 38, 38 | Life-threatening emergencies |
| Warning Amber | `#F59E0B` | 245, 158, 11 | Moderate urgency |
| Success Green | `#10B981` | 16, 185, 129 | Resolved, safe status |
| Info Blue | `#3B82F6` | 59, 130, 246 | Information, neutral status |

### 2.3 Functional Colors

| Name | HEX | RGB | Usage |
|------|-----|-----|-------|
| Police Blue | `#1E40AF` | 30, 64, 175 | Police/PNP indicators |
| Fire Red | `#B91C1C` | 185, 28, 28 | Fire/BFP indicators |
| Medical Green | `#059669` | 5, 150, 105 | Ambulance/Medical indicators |
| Disaster Orange | `#EA580C` | 234, 88, 12 | Disaster response |

---

## 3. Typography

### 3.1 Primary Font Family
**Toyota Type** - Official brand font
- Available weights: Light, Book, Regular, Semibold, Bold, Black

### 3.2 Web Font Alternatives
Since Toyota Type requires licensing, use these alternatives:

| Usage | Font | Weight |
|-------|------|--------|
| Headlines | Inter | 600-800 |
| Body | Inter | 400-500 |
| Emergency Display | Inter | 800 |
| UI Labels | Inter | 500 |
| Legal/Micro | Inter | 400 |

### 3.3 Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Page Title) | 48px / 3rem | Bold (700) | 1.1 |
| H2 (Section) | 36px / 2.25rem | Semibold (600) | 1.2 |
| H3 (Subsection) | 24px / 1.5rem | Semibold (600) | 1.3 |
| H4 (Card Title) | 20px / 1.25rem | Semibold (600) | 1.4 |
| Body Large | 18px / 1.125rem | Regular (400) | 1.6 |
| Body | 16px / 1rem | Regular (400) | 1.6 |
| Body Small | 14px / 0.875rem | Regular (400) | 1.5 |
| Caption | 12px / 0.75rem | Regular (400) | 1.4 |
| Button | 16px / 1rem | Semibold (600) | 1 |
| Label | 14px / 0.875rem | Medium (500) | 1 |

### 3.4 Typesetting Rules
- **Uppercase headlines**: Max 7 words, Bold or Semibold, 90% line-height
- **Sentence case headlines**: Semibold, 110% line-height for print, 90% for digital
- **Body text**: 145% line-height, Book weight
- **Alignment**: Flush left or centered. Never flush right.

---

## 4. Spacing System

### 4.1 Base Unit
**4px** - All spacing multiples of 4

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |
| 4xl | 96px |

### 4.2 Component Spacing
- **Card padding**: 24px
- **Section margin**: 48px (desktop), 24px (mobile)
- **Button padding**: 16px horizontal, 12px vertical
- **Input padding**: 12px 16px

---

## 5. UI Components

### 5.1 Emergency Button (Primary CTA)
- **Background**: Toyota Red (#EB0A1E)
- **Size**: Full width on mobile, min 200px on desktop
- **Height**: 56px (touch-friendly)
- **Border-radius**: 8px
- **Text**: White, uppercase, Bold
- **Icon**: Warning icon, white, 24px
- **States**:
  - Hover: Darken 10%
  - Active: Darken 20%
  - Disabled: 50% opacity

### 5.2 Cards
- **Background**: White
- **Border**: 1px solid #E5E7EB
- **Border-radius**: 12px
- **Shadow**: 0 1px 3px rgba(0,0,0,0.1)
- **Padding**: 24px

### 5.3 Status Badges
- **Border-radius**: Full (pill shape)
- **Padding**: 4px 12px
- **Font**: Caption, Semibold

| Status | Background | Text |
|--------|-----------|------|
| Critical | #FEE2E2 | #DC2626 |
| Active | #FEF3C7 | #D97706 |
| Resolved | #D1FAE5 | #059669 |
| Pending | #E0E7FF | #4F46E5 |

### 5.4 Input Fields
- **Height**: 48px
- **Border**: 1px solid #D1D5DB
- **Border-radius**: 8px
- **Focus**: 2px Toyota Red outline
- **Error**: Red border, error message below

### 5.5 Navigation
- **Primary**: Bottom nav on mobile (5 items max)
- **Secondary**: Top bar with logo + actions
- **Height**: 64px (desktop), 56px (mobile)

---

## 6. Layout

### 6.1 Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

### 6.2 Max Content Width
- **Content**: 1200px centered
- **Cards**: 400px max
- **Sidebar**: 320px fixed

### 6.3 Grid
- **Desktop**: 12-column grid, 24px gutters
- **Mobile**: 4-column grid, 16px gutters

---

## 7. Iconography

### 7.1 Style
- **Type**: Outlined icons
- **Size**: 24px standard, 20px compact, 32px emphasis
- **Stroke**: 1.5px or 2px

### 7.2 Emergency Icons Required
- Police (PNP)
- Ambulance (Medical)
- Fire (BFP)
- Disaster
- Location/GPS
- Phone/Call
- Warning/Alert
- Check/Verified
- Clock/Time
- Map/Route
- Message/Chat

---

## 8. Accessibility

### 8.1 Color Contrast
- **Text on white**: Min 4.5:1 ratio
- **Large text**: Min 3:1 ratio
- **UI components**: Min 3:1 ratio

### 8.2 Focus States
- Visible focus indicator (Toyota Red outline)
- Keyboard navigation support

### 8.3 Touch Targets
- Min 44x44px for all interactive elements

---

## 9. Animations & Motion

### 9.1 Timing
- **Fast**: 150ms (status changes)
- **Normal**: 300ms (transitions)
- **Slow**: 500ms (page transitions)

### 9.2 Easing
- **Ease out**: For entering elements
- **Ease in**: For exiting elements
- **Ease in-out**: For transforms

### 9.3 Emergency Animations
- Pulse animation for critical alerts
- Shake animation for SOS activation

---

## 10. Application to Emergency Context

### 10.1 Priority Colors
1. **Critical/Life-threatening**: Critical Red (#DC2626)
2. **Urgent**: Warning Amber (#F59E0B)
3. **Standard**: Toyota Red (#EB0A1E)
4. **Resolved**: Success Green (#10B981)

### 10.2 Emergency Flow Colors
- **Report Screen**: White background, Toyota Red accents
- **Live Tracking**: Map-centric, agency-colored markers
- **Status Updates**: Semantic colors per status

### 10.3 Agency Color Coding
- **Police (PNP)**: Police Blue (#1E40AF)
- **Fire (BFP)**: Fire Red (#B91C1C)
- **Ambulance**: Medical Green (#059669)
- **Disaster**: Disaster Orange (#EA580C)

---

## 11. Dos and Don'ts

### DO
- Use Toyota Red for primary CTAs
- Use Inter as Toyota Type alternative
- Maintain high contrast for readability
- Use semantic colors for status
- Keep emergency buttons prominent
- Follow 4px spacing system

### DON'T
- Use gradients on Toyota Red
- Add shadows to typography
- Use more than 7 words in uppercase headlines
- Mix font families
- Use Toyota Red at less than full opacity
- Create visual clutter in emergency interfaces

---

## References
- [Toyota Brand Guidelines](https://brand.toyota.com/guidelines/visual)
- [Toyota Brand Colors](https://brand.toyota.com/guidelines/visual/brand-colors)
- [Toyota Typography](https://brand.toyota.com/guidelines/visual/typography)
