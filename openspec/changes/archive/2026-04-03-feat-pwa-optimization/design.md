# Design: PWA & Offline Optimization

## Architecture Overview

The PWA lifecycle and network health will be managed by two dedicated hooks, with a global UI overlay for critical updates.

```ascii
┌──────────────────────────────────────────────────────────┐
│                      App.tsx (Root)                      │
├──────────────────────┬───────────────────────────────────┤
│                      │                                   │
│   ┌──────────────┐   │   ┌───────────────────────────┐   │
│   │  useNetwork  │◀──┼───┤  useRegisterSW (PWA Hook) │   │
│   └──────┬───────┘   │   └─────────────┬─────────────┘   │
│          │           │                 │                 │
│          ▼           │                 ▼                 │
│   ┌──────────────┐   │   ┌───────────────────────────┐   │
│   │ Offline Badge│   │   │   PWAUpdatePrompt (UI)    │   │
│   └──────────────┘   │   └───────────────────────────┘   │
│                      │                                   │
└──────────────────────┴───────────────────────────────────┘
```

## Functional Components

### 1. `useNetwork` Hook
- Listen to `window.ononline` and `window.onoffline`.
- Return `isOnline: boolean`.
- **Value**: Allows UI to show a "Cloud with Slash" icon when the user is disconnected.

### 2. `PWAUpdatePrompt` Component
- Triggered when `needRefresh` is true from `vite-plugin-pwa`.
- Display a bottom-fixed or central toast: "New version available! [Update now]".
- Handle `updateServiceWorker(true)` upon user confirmation.

### 3. Workbox Cache Strategy
- Change `registerType` to `'promptUpdate'`.
- Set `skipWaiting: false` to ensure we don't reload while the user is mid-round.

## UI Integration

- **Offline Indicator**: A small amber banner or pulsing dot next to the "v1.0.5" version text in the drawer or footer.
- **Update Modal**: A high-z-index prompt that blurs the background to ensure visibility.

## Migration Strategy
1.  **Vite Config**: Flip the registration switch and refine glob patterns.
2.  **Hooks**: Implement network listener.
3.  **UI Components**: Create the update prompt.
4.  **Entry Point**: Integrate into `App.tsx` and `main.tsx` (if needed).
