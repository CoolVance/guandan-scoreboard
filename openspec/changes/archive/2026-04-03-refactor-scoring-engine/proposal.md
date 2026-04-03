# Proposal: Refactor Scoring Engine

## Context
The current scoring logic in the Guandan Scoreboard is tightly coupled with the UI in `App.tsx`. This makes it difficult to maintain, test, and extend. The scoring logic includes complex rules such as Solo Win (1 vs 3), Duo Win (2 vs 2), and Manual Mode with zero-sum validation.

## Goals
1.  **Decouple logic from UI**: Move scoring calculations and history management into a dedicated, testable module or hook.
2.  **Formalize rules**: Define strict mathematical rules for scoring modes in a dedicated Spec.
3.  **Ensure data integrity**: Enforce zero-sum validation in Manual Mode and handle floating-point precision consistently.
4.  **Stateless recalculation**: Ensure total scores are always derived from the history log to prevent synchronization issues.

## Scope
-   Creating a formal Capability Spec for Scoring.
-   Refactoring `App.tsx` to use the new scoring module.
-   Adding unit tests for the scoring logic (if applicable).
-   Migrating level-tracking logic to the new module while maintaining manual control.

## Non-Goals
-   Redesigning the UI layout.
-   Changing the persistence mechanism (staying with LocalStorage).
-   Implementing automated level-up logic.

## Strategy
1.  Define `specs/scoring/spec.md` with formalized rules.
2.  Implement a `useScoring` hook that encapsulates state and logic.
3.  Replace inline calculations in `App.tsx` with calls to the new hook.
4.  Verify consistency with existing data.
