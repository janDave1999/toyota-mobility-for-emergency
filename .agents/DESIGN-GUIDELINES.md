# Design Guidelines for AI Agents

**Instructions for all AI agents working on this project**

---

## Quick Reference

When working on ANY frontend code (components, pages, styles), you MUST follow these rules:

### Colors (Use These Exact Values)

```css
/* Primary */
--color-toyota-red: #EB0A1E;
--color-black: #000000;
--color-white: #FFFFFF;
--color-gray: #58595B;

/* Semantic */
--color-critical: #DC2626;
--color-warning: #F59E0B;
--color-success: #10B981;
--color-info: #3B82F6;

/* Agency */
--color-police: #1E40AF;
--color-fire: #B91C1C;
--color-medical: #059669;
--color-disaster: #EA580C;
```

### Typography

- Font family: `Inter` (NOT Toyota Type - it's licensed)
- Headlines: Bold (700), Semibold (600)
- Body: Regular (400)
- Line height: 1.1 for headlines, 1.6 for body

### Spacing

- Base unit: 4px
- Common values: 4, 8, 16, 24, 32, 48, 64, 96

### Emergency Button Spec

```css
background: #EB0A1E;
height: 56px;
border-radius: 8px;
text: white, uppercase, bold;
```

---

## Rules

1. **ALWAYS use the color variables** - Never hardcode colors
2. **Use Inter font** - Never use custom fonts without approval
3. **Toyota Red for CTAs** - All primary buttons use #EB0A1E
4. **Semantic status colors** - Use critical/warning/success for status
5. **Agency colors for responders** - Police=blue, Fire=red, Ambulance=green
6. **Touch-friendly** - Min 44px touch targets, 56px buttons
7. **Accessible contrast** - Min 4.5:1 for text

---

## Before Writing Code

1. Check `docs/design-guidelines.md` for full specs
2. Use the color variables defined in global CSS
3. Follow the component patterns already established

## File Locations

- Global styles: `frontend/src/styles/global.css`
- Layout: `frontend/src/layouts/`
- Components: `frontend/src/components/`
