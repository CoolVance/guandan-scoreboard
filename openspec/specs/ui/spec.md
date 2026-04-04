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

### Draggable Drawer Control FAB Layout
The Draggable Drawer's main Control FAB (Floating Action Button) group SHALL maintain a fixed vertical order for its primary buttons to ensure ergonomic consistency.

#### Scenario: Fixed button order regardless of vertical position
- **WHEN** the Draggable Drawer is located in the upper half of the screen
- **THEN** the "Lock" button SHALL be positioned vertically above the "Menu" button
- **WHEN** the Draggable Drawer is moved to the lower half of the screen
- **THEN** the "Lock" button SHALL remain positioned vertically above the "Menu" button

### Human-Friendly Documentation Tone
The project's primary documentation (READMEs) SHALL prioritize accessibility and "plain language" over technical jargon to ensure non-technical users can understand the project's value and deployment options.

#### Scenario: User reads README to understand the project
- **WHEN** a user opens the `README.md`
- **THEN** the primary introduction and features SHALL focus on user benefits (e.g., "easy scoring", "offline use") rather than technical implementation details (e.g., "React 18", "Service Worker").

### Centralized Deployment Links
All project documentation SHALL feature the Cloudflare deployment link as the recommended access point to ensure a consistent user experience.

#### Scenario: User looks for a demo link
- **WHEN** a user checks the "Demo" or "Live" section of any README
- **THEN** the link `https://guandan-scoreboard.inin.workers.dev/` SHALL be listed prominently as a primary option.


