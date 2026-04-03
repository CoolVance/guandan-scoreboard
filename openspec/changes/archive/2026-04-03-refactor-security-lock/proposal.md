# Proposal: Refactor Security Lock & Haptics

## Context
The "Touch Protection" (Lock) mechanism is a core user experience feature. Currently, its logic is split between `App.tsx` (auto-lock timer, state) and `DraggableDrawer.tsx` (long-press unlock algorithm, vibration helper). This coupling makes it hard to tweak timing parameters and reuse the locking logic in other components.

## Goals
1.  **Centralize Haptic Feedback**: Create a dedicated utility for vibration patterns to ensure consistency across the app.
2.  **Abstract Security Logic**: Implement a `useSecurity` hook that manages the `isLocked` state, idle detection, and the "charging" unlock algorithm.
3.  **Formalize Timing**: Define constants for `AUTO_LOCK_TIME` (10s) and `UNLOCK_DURATION` (800ms) in a single place.
4.  **Simplify Components**: Remove low-level timing and vibration code from UI components.

## Scope
-   Implementing `src/utils/haptics.ts` with predefined patterns.
-   Implementing `src/hooks/useSecurity.ts` to replace manual state management in `App.tsx`.
-   Refactoring `DraggableDrawer.tsx` to use the progress state from the hook.
-   Updating `App.tsx` to orchestrate security via the new hook.

## Non-Goals
-   Changing the visual neon effect (keeping the SVG rings).
-   Implementing biometric lock (keeping it purely software-based).

## Strategy
1.  Extract `safeVibrate` to `src/utils/haptics.ts`.
2.  Design and implement `useSecurity` hook with internal `setInterval` for idle checking and progress calculation.
3.  Replace scattered logic in `App.tsx` and `DraggableDrawer.tsx`.
