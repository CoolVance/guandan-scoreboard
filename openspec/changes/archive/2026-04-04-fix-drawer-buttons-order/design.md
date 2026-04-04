## Context

The `DraggableDrawer` component currently uses a `flex-col-reverse` class for its main button container when positioned in the bottom half of the screen. This is part of the "Mirror Menu" logic intended to improve ergonomics by keeping frequently used buttons close to the bottom when the drawer is at the bottom. However, user feedback indicates a preference for a fixed button order.

## Goals / Non-Goals

**Goals:**
- Fix the vertical order of the "Lock" and "Menu" buttons to be always "Lock on top, Menu below".
- Maintain the existing positioning and animation logic for the drawer itself.

**Non-Goals:**
- Removing the "Mirror Menu" logic for the *expanded menu items* (the extra buttons that appear when clicking Menu), unless it's necessary for visual consistency.
- Changing the drawer's automatic snapping or drag-and-drop behavior.

## Decisions

### 1. Fix Main Button Container Flex Direction
- **Decision**: Always use `flex-col` for the main button container in `DraggableDrawer.tsx`.
- **Rationale**: This is the simplest way to ensure "Lock" (the first child) stays on top and "Menu" (the second child) stays below.
- **Alternatives Considered**: 
  - Using absolute positioning for buttons (too complex, breaks flex-gap).
  - Swapping the DOM elements (too much logic in JSX, `flex-col` is cleaner).

### 2. Scope of Change
- **Decision**: Only fix the order of the two primary FAB buttons (Lock and Menu). The expanded menu items container will retain its mirroring logic (reversing direction at the bottom).
- **Rationale**: The user specifically requested fixing "these 2 buttons". Keeping the menu items mirrored might still be beneficial for ergonomics (keeping items closer to the trigger button), though we should monitor if this feels inconsistent.

## Risks / Trade-offs

- **[Risk]** Inconsistency with expanded menu items ➔ **Mitigation**: If the user finds it inconsistent, we can also fix the items' order in a follow-up or after further feedback.
- **[Risk]** Breaking the vertical gap or layout ➔ **Mitigation**: Ensure the `flex-col` class is correctly applied and the gap remains consistent.
