# Proposal: UI Visual & Animation Specification

## Context
The current UI relies on scattered Tailwind utility classes with hardcoded values for colors (`blue-600`, `red-500`), spacing, and shadows (`shadow-2xl`, `rounded-2xl`). While functional, this lacks a unified "Design System," making it difficult to maintain visual consistency across components and complicating future branding updates.

## Goals
1.  **Establish Design Tokens**: Define a central set of CSS variables for colors, radius, and elevation.
2.  **Unify Animations**: Formalize easing curves and durations for all interactive elements (Swipes, Modals, Charging effects).
3.  **Semantic Styling**: Move from utility-only styling to semantic styling (e.g., replace `bg-red-500` with `bg-team-red`).
4.  **Consistency**: Ensure all components (Modals, Buttons, Drawers) share the same visual language.

## Scope
-   Creating `src/styles/tokens.css` and integrating it with Tailwind.
-   Refactoring core components: `Modal`, `PlayerButton`, `SwipeControl`, `DraggableDrawer`.
-   Centralizing `@keyframes` and animation utility classes in `src/index.css`.

## Non-Goals
-   Introducing a CSS-in-JS library.
-   Redesigning the entire UI layout (keeping the current UX flow).

## Strategy
1.  Define CSS variables for colors, shadows, and radii.
2.  Extend Tailwind theme to use these variables.
3.  Batch replace utility classes in components with semantic equivalents.
