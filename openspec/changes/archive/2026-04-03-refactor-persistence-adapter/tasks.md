# Tasks: Refactor Persistence Adapter

## Phase 1: Storage Infrastructure
- [ ] Create `src/types/storage.ts` with `ScoreboardStorage` interface.
- [ ] Create `src/utils/storage.ts`:
  - [ ] Implement `getStorage()` with error handling.
  - [ ] Implement `updateStorage(partial: Partial<ScoreboardStorage>)`.
  - [ ] Implement `setStorage(full: ScoreboardStorage)`.

## Phase 2: Refactor Hooks
- [ ] Refactor `src/hooks/useScoring.ts`:
  - [ ] Use `getStorage()` for initial state.
  - [ ] Use `updateStorage()` in persistence `useEffect`.
- [ ] Refactor `src/hooks/useI18n.ts`:
  - [ ] Use `getStorage()` for initial state.
  - [ ] Use `updateStorage()` in `changeLang` action.

## Phase 3: Refactor App.tsx
- [ ] Update `App.tsx` main persistence logic:
  - [ ] Replace `localStorage.getItem('scoreboard_v5')` with `getStorage()`.
  - [ ] Replace `localStorage.setItem('scoreboard_v5', ...)` with `updateStorage()`.

## Phase 4: Verification & Final Polish
- [ ] Verify that saving from `useScoring` does not overwrite `lang` from `useI18n`.
- [ ] Verify that saving from `App.tsx` does not overwrite `history`.
- [ ] Ensure backward compatibility with existing data.
- [ ] Run `npm run build`.
