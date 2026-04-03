# Capability: UI & Visual System

## Description
Defines the visual language, design tokens, and animation standards for the Guandan Scoreboard. Ensures consistent aesthetics across all components and platforms (PWA).

## Design Tokens (Tailwind v4 Integration)

### Colors
- `team-red`: Primary color for the North/South team (`#ef4444`).
- `team-blue`: Primary color for the West/East team (`#3b82f6`).
- `accent-gold`: Used for round indicators and highlights (`#facc15`).
- `surface-modal`: Light gray background for modal headers and sub-surfaces (`#f9fafb`).

### Shape & Elevation
- `main` Radius: `1.5rem` (Used for Modals and large containers).
  - Class: `rounded-main`
- `button` Radius: `1.0rem` (Used for Player buttons and Swipe controls).
  - Class: `rounded-button`
- `elevated` Shadow: Deep shadow for modals and floating elements.
  - Class: `shadow-elevated`

## Animation & Motion

### Standard Pop
- **Easing**: `cubic-bezier(0.34, 1.56, 0.64, 1)` (Bounce effect).
- **Duration**: `200ms`.
- **Class**: `animate-pop`.
- **Usage**: Applied to all score triggers and swipe interactions.

### RGB Border
- A multi-color pulsing shadow used exclusively for the **Locked** state of the control FAB.

## Component Standards

### Modals
- Must use `rounded-main` and `shadow-elevated`.
- Background must have `backdrop-blur-sm`.

### Interaction Feedback
- Physical buttons should have `active:scale-95 transition-transform`.
- Swipe areas should use `active:brightness-90 transition-all`.
