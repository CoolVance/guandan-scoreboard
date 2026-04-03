# Design: Refactor Security Lock & Haptics

## Architecture Overview

The security logic will be centralized into a `useSecurity` hook, while physical feedback will be delegated to a stateless `haptics` utility.

```ascii
┌──────────────────────────────────────────────────────────┐
│                      App.tsx / Drawer                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   Triggers:                               Reads:         │
│   - recordActivity()                      - isLocked     │
│   - startUnlocking()                      - progress     │
│   - stopUnlocking()                                      │
│                                                          │
└─────────────┬──────────────────────────────▲─────────────┘
              │                              │
              ▼                              │
┌────────────────────────────────────────────┴─────────────┐
│                   useSecurity Hook                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   Timers:                     Logic:                     │
│   - Idle Check (10s)          - Unlock Algorithm (800ms) │
│   - Interval (50ms)           - Auto-lock State          │
│                                                          │
└─────────────────────────────┬────────────────────────────┘
                              │
                              ▼
                ┌────────────────────────────┐
                │      Haptics Utility       │
                │    (Vibration Patterns)    │
                └────────────────────────────┘
```

## Hook API Definition (`useSecurity`)

### State
- `isLocked: boolean`: Global locking status.
- `lockProgress: number`: 0-100, progress towards auto-lock (idle time).
- `unlockProgress: number`: 0-100, progress towards manual unlock (charging).

### Actions
- `recordActivity()`: Resets the idle timer.
- `lock()`: Manually triggers locking.
- `startUnlocking()`: Begins the long-press countdown.
- `stopUnlocking()`: Cancels the long-press countdown.

## Haptic Patterns (`haptics.ts`)
- `vibrateLock()`: Single short burst (10ms).
- `vibrateCharging()`: Gentle tap (15ms).
- `vibrateUnlock()`: Success pattern ([30, 50, 30]).

## Implementation Strategy
1.  **Haptics**: Move `safeVibrate` from `DraggableDrawer.tsx` to `src/utils/haptics.ts`.
2.  **Hook Implementation**: Create `useSecurity.ts`. Use `useRef` for timing to prevent excessive re-renders.
3.  **App.tsx Integration**: Replace `lastActivity`, `AUTO_LOCK_TIME`, and idle `useEffect`.
4.  **Drawer Integration**: Replace `unlockProgress` state and `progressTimer` ref with actions from `useSecurity`.
