# Capability: Scoring Engine

## Description
Provides core logic for tracking Guandan game progress, including player scoring across different modes and level tracking.

## Core Data Model

### Players & Teams
- Positions: `N` (North), `S` (South), `W` (West), `E` (East).
- Teams:
  - Red: `N + S`
  - Blue: `W + E`

### Cards Sequence
- `2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A1, A2, A3`
- Tracked independently for Red and Blue teams.

### Score Record
Each record in the history represents a scoring event:
- `id`: Unique string
- `timestamp`: Number
- `type`: `solo` | `duo` | `manual`
- `score`: Total points assigned (for solo/duo)
- `winnerIds`: Array of winner IDs
- `loserIds`: Array of loser IDs
- `remark`: String
- `manualScores`: Optional map for custom scores per player

## Rules & Logic

### Total Score Calculation
- The `TotalScore` for any player is always derived by summing all `Delta` values from history records.
- **Rule**: Intermediate state MUST NOT be stored separately.

### Solo Mode (1 vs 3)
- `WinnerScore = X`
- `EachLoserScore = -(X / 3)`
- **Rule**: Round result to 1 decimal place for display.

### Duo Mode (2 vs 2)
- `WinnerScore = X` (for each winner)
- `LoserScore = -X` (for each loser)

### Manual Mode (Custom)
- Input: Each player's specific delta.
- **Rule (Hard Constraint)**: $\sum \text{Delta} = 0$.
- Validation MUST be performed before committing the record.

### Level Tracking
- Level updates are MANUAL and triggered by user interaction (Swipe).
- The system simply pointers to the current index in `CARD_SEQUENCE`.
