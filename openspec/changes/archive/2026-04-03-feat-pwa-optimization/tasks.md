# Tasks: PWA & Offline Optimization

## Phase 1: PWA Configuration
- [ ] Modify `vite.config.ts`:
  - [ ] Set `registerType: 'promptUpdate'`.
  - [ ] Set `workbox.skipWaiting: false`.
  - [ ] Set `workbox.clientsClaim: true`.

## Phase 2: Hooks & Utilities
- [ ] Create `src/hooks/useNetwork.ts`:
  - [ ] Implement `isOnline` state with event listeners.
- [ ] Ensure `vite-plugin-pwa` types are available for `useRegisterSW`.

## Phase 3: UI Components
- [ ] Create `src/components/Layout/PWAUpdatePrompt.tsx`:
  - [ ] Implement UI for "Update available" toast.
  - [ ] Integrate with `useRegisterSW` hook.
- [ ] Update `src/components/Layout/DraggableDrawer.tsx`:
  - [ ] Add offline status indicator (icon + text).

## Phase 4: Integration
- [ ] Integrate `PWAUpdatePrompt` into `App.tsx`.
- [ ] Integrate `useNetwork` into `App.tsx` or `DraggableDrawer`.
- [ ] Verify build and Service Worker registration.

## Phase 5: Verification
- [ ] Test offline behavior: Toggle Chrome dev tools offline mode and check UI indicator.
- [ ] Verify no automatic reload occurs on code change (requires manual simulation of SW update).
- [ ] Run `npm run build`.
