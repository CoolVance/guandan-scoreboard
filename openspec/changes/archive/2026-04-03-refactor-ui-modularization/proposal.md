# Proposal: Refactor UI Modularization

## Context
The `App.tsx` file is currently overcrowded with over 1500 lines of code, containing business logic, multiple state-heavy components, and primitive UI elements. This makes maintenance difficult and hinders the scalability of the project.

## Goals
1.  **Decompose App.tsx**: Extract functional and UI components into a structured directory under `src/components/`.
2.  **Improve Readability**: Reduce `App.tsx` to a high-level container that orchestrates state and layout.
3.  **Enhance Reusability**: Create atomic and composite components that can be easily tested and reused.
4.  **Enforce Prop-Typing**: Introduce proper TypeScript interfaces for all component props.

## Scope
-   Creating `src/components/` with subdirectories: `Common`, `Scoring`, `History`, `Tutorial`, `Layout`.
-   Migrating `Modal`, `PlayerButton`, `SwipeControl`, `TopModeIcon`, `BottomModeIcon` to `Common`.
-   Migrating `ManualScoreContent` and `ScoreInputContent` to `Scoring`.
-   Migrating `HistoryContent` to `History`.
-   Migrating `TutorialOverlay` to `Tutorial`.
-   Migrating `DraggableDrawer` to `Layout`.

## Non-Goals
-   Rewriting business logic (keeping existing Hooks as is).
-   Changing the visual design or CSS (keeping existing Tailwind classes).
-   Introducing new global state management (sticking with existing custom Hooks).

## Strategy
1.  Define atomic components in `Common` and export them.
2.  Port functional components one by one, ensuring they receive all necessary props.
3.  Update `App.tsx` to use the new components.
4.  Verify the build and ensure no regressions in layout or behavior.
