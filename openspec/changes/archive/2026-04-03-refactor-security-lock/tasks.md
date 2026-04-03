# Tasks: Refactor Security Lock & Haptics

## Phase 1: Infrastructure
- [ ] Create `src/utils/haptics.ts`:
  - [ ] Implement `vibrateLock`, `vibrateCharging`, `vibrateUnlock`.
  - [ ] Port the environment-safe `safeVibrate` helper.

## Phase 2: Security Hook
- [ ] Create `src/hooks/useSecurity.ts`:
  - [ ] Initialize `isLocked`, `lockProgress`, and `unlockProgress` states.
  - [ ] Implement idle timer logic (10s default).
  - [ ] Implement long-press unlock logic (800ms).
  - [ ] Integrate haptic feedback into hook actions.

## Phase 3: Migration
- [ ] Refactor `App.tsx`:
  - [ ] Replace manual idle timer `useEffect`.
  - [ ] Remove `lastActivity` ref and `AUTO_LOCK_TIME`.
  - [ ] Use `recordActivity()` in window event listeners.
- [ ] Refactor `DraggableDrawer.tsx`:
  - [ ] Remove local `unlockProgress` and `progressTimer`.
  - [ ] Use `startUnlocking()` and `stopUnlocking()` in handlers.
  - [ ] Pass `lockProgress` and `unlockProgress` to UI elements.

## Phase 4: Verification
- [ ] Ensure 10s idle leads to auto-lock.
- [ ] Ensure long-press (800ms) successfully unlocks.
- [ ] Verify haptic feedback on mobile (if possible) or ensure no errors on desktop.
- [ ] Run `npm run build`.
