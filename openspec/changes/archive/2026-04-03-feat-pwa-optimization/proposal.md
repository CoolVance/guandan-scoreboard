# Proposal: PWA & Offline Optimization

## Context
The application currently uses a basic PWA configuration with `autoUpdate`. This causes the application to reload automatically when a new version is detected, which could lead to data loss or user confusion during an active game. Additionally, there is no visual indicator for the user's connection status, making it unclear if they are operating in offline mode.

## Goals
1.  **Implement controlled updates**: Change the PWA strategy to `promptUpdate` and create a "New Version Available" UI component.
2.  **Add network status awareness**: Implement a `useNetwork` hook and display an "Offline" indicator in the app header or status bar.
3.  **Improve caching robustness**: Optimize Workbox settings to ensure all localized assets and UI components are available without an internet connection.
4.  **Enhance installation awareness**: Provide an explicit "Install App" button in the settings drawer for supported browsers.

## Scope
-   Modifying `vite.config.ts` to support controlled updates.
-   Creating `src/hooks/useNetwork.ts`.
-   Implementing `src/components/Layout/PWAUpdatePrompt.tsx`.
-   Integrating network status into `App.tsx`.

## Non-Goals
-   Implementing background sync for remote servers (staying local-first).
-   Full multi-user real-time synchronization.

## Strategy
1.  Update PWA configuration to `promptUpdate`.
2.  Use the `virtual:pwa-register/react` entry to manage Service Worker state.
3.  Add a status badge to the UI showing connection health.
