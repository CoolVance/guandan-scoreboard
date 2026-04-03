# Tasks: Refactor Scoring Engine

## Phase 1: Preparation & Type Definitions
- [x] Create `src/types/scoring.ts` and migrate common types:
  - `PlayerId`, `PlayerConfig`, `ScoreRecord`, `CardSequence`.
  - [x] Identify types in `App.tsx`.
  - [x] Move types to the new file and update exports.

## Phase 2: Core Implementation
- [x] Implement `src/hooks/useScoring.ts`:
  - [x] Initialize state for `history`, `levels` (left/right), and `round`.
  - [x] Implement `totalScores` memoized calculation.
  - [x] Implement `aggregatedRemarks` memoized calculation.
  - [x] Add `addScore` method with Solo/Duo logic.
  - [x] Add `addManualScore` method with zero-sum validation.
  - [x] Add `deleteRecord`, `clearHistory`, and `updateLevel` methods.
- [x] Migrate Persistence Logic:
  - [x] Add `useEffect` to `useScoring` to handle `localStorage` loading/saving.
  - [x] Ensure backward compatibility with `v5` storage format.

## Phase 3: Integration into App.tsx
- [x] Replace local states in `App.tsx` with `useScoring()` hook:
  - [x] Remove `history`, `leftCardIdx`, `rightCardIdx`, `middleNum` `useState` calls.
  - [x] Remove redundant calculation logic for `totalScores` and `aggregatedRemarks`.
- [x] Update Event Handlers:
  - [x] Update `handleCardChange` and `handleResetLevels`.
  - [x] Update `handleClearHistory`, `handleAddScore`, `handleManualScore`, and `handleDeleteHistory`.
- [x] Clean up `App.tsx` imports and redundant helper functions.

## Phase 4: Validation & Testing
- [ ] Verify Scoring Modes:
  - [ ] Test Solo Mode: Winner +15, Losers -5.
  - [ ] Test Duo Mode: Winners +15, Losers -15.
  - [ ] Test Manual Mode: Ensure non-zero sums are rejected.
- [ ] Verify Persistence:
  - [ ] Confirm state survives page refresh.
- [ ] Verify UI Responsiveness:
  - [ ] Ensure level/round changes trigger "Bounce Pop" animation.
