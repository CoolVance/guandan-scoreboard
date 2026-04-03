# Design: Refactor Scoring Engine

## Architecture Overview

The scoring logic will be encapsulated within a custom React hook `useScoring`. This hook will manage the state for game progress (levels, rounds) and the scoring history, providing a clean API for the UI to interact with.

```ascii
┌──────────────────────────────────────────────────────────┐
│                      App.tsx (UI)                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   Calls:                                  Reads:         │
│   - addScore()                            - totalScores  │
│   - deleteRecord()                        - history      │
│   - updateLevel()                         - levels       │
│                                                          │
└─────────────┬──────────────────────────────▲─────────────┘
              │                              │
              ▼                              │
┌────────────────────────────────────────────┴─────────────┐
│                   useScoring Hook                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   State Management:           Logic & Rules:             │
│   - history: ScoreRecord[]    - Zero-sum Validation      │
│   - levels: {L, R}            - Solo/Duo Distribution    │
│   - round: number             - Score Aggregation        │
│                                                          │
└─────────────┬──────────────────────────────▲─────────────┘
              │                              │
              ▼                              │
┌────────────────────────────────────────────┴─────────────┐
│                 Persistence Layer                        │
│                (LocalStorage Adapter)                    │
└──────────────────────────────────────────────────────────┘
```

## Hook API Definition

### State (Returned by Hook)
- `history: ScoreRecord[]`: The full list of scoring events.
- `totalScores: Record<PlayerId, number>`: Memoized calculation of total scores derived from history.
- `aggregatedRemarks: Record<PlayerId, string>`: Memoized summary of remarks for each player.
- `levels: { left: number, right: number }`: Current level indices for Red and Blue teams.
- `round: number`: The current round number.

### Actions (Returned by Hook)
- `addScore(mode: 'solo' | 'duo', winnerIds: PlayerId[], score: number, remark: string)`: 
  - Automates loser calculation based on `specs/scoring/spec.md`.
- `addManualScore(deltas: Record<PlayerId, number>, remark: string)`: 
  - Validates zero-sum before adding to history.
- `deleteRecord(id: string)`: Removes a record and triggers re-calculation.
- `clearHistory()`: Resets history and round count.
- `updateLevel(side: 'left' | 'right', delta: number)`: Updates the level index for a team.
- `setRound(num: number)`: Direct control over the round number.

## Implementation Details

### 1. Data Integrity & Precision
- All calculations for `Solo Mode` (`score / 3`) will be performed at the time of aggregation to ensure precision.
- Total scores will be calculated using `useMemo` to prevent redundant computations on every render.

### 2. Migration Strategy
- **Step 1**: Create `src/hooks/useScoring.ts`.
- **Step 2**: Port existing `localStorage` loading/saving logic into the hook.
- **Step 3**: Replace `useState` calls in `App.tsx` for `history`, `leftCardIdx`, `rightCardIdx`, and `middleNum` with a single call to `useScoring()`.
- **Step 4**: Update UI event handlers to call hook methods.

### 3. Validation Logic
- The `addManualScore` method will throw an error or return a failure status if the sum of deltas is not exactly `0`.
- The UI must handle this validation to keep the "Confirm" button disabled.

## Persistence
The hook will use a standardized JSON structure for persistence, ensuring backward compatibility with the existing `v5` storage format used in `App.tsx`.
