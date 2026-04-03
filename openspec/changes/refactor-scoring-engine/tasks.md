# Tasks: Refactor Scoring Engine

## Phase 1: Preparation & Type Definitions
- [ ] Create `src/types/scoring.ts` and migrate common types:
  - `PlayerId`, `PlayerConfig`, `ScoreRecord`, `CardSequence`.
  - [x] Identify types in `App.tsx`.
  - [ ] Move types to the new file and update exports.

## Phase 2: Core Implementation
- [ ] Implement `src/hooks/useScoring.ts`:
  - [ ] Initialize state for `history`, `levels` (left/right), and `round`.
  - [ ] Implement `totalScores` memoized calculation.
  - [ ] Implement `aggregatedRemarks` memoized calculation.
  - [ ] Add `addScore` method with Solo/Duo logic.
  - [ ] Add `addManualScore` method with zero-sum validation.
  - [ ] Add `deleteRecord`, `clearHistory`, and `updateLevel` methods.
- [ ] Migrate Persistence Logic:
  - [ ] Add `useEffect` to `useScoring` to handle `localStorage` loading/saving.
  - [ ] Ensure backward compatibility with `v5` storage format.

## Phase 3: Integration into App.tsx
- [ ] Replace local states in `App.tsx` with `useScoring()` hook:
  - [ ] Remove `history`, `leftCardIdx`, `rightCardIdx`, `middleNum` `useState` calls.
  - [ ] Remove redundant calculation logic for `totalScores` and `aggregatedRemarks`.
- [ ] Update Event Handlers:
  - [ ] Update `handleCardChange` and `handleResetLevels`.
  - [ ] Update `handleClearHistory`, `handleAddScore`, `handleManualScore`, and `handleDeleteHistory`.
- [ ] Clean up `App.tsx` imports and redundant helper functions.

## Phase 4: Validation & Testing
- [ ] Verify Scoring Modes:
  - [ ] Test Solo Mode: Winner +15, Losers -5.
  - [ ] Test Duo Mode: Winners +15, Losers -15.
  - [ ] Test Manual Mode: Ensure non-zero sums are rejected.
- [ ] Verify Persistence:
  - [ ] Confirm state survives page refresh.
- [ ] Verify UI Responsiveness:
  - [ ] Ensure level/round changes trigger "Bounce Pop" animation.
