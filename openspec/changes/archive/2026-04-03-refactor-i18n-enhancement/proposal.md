# Proposal: Refactor i18n Enhancement

## Context
The current internationalization (i18n) logic is scattered inside `App.tsx`. The `t` function is manually defined, lacks strict type-checking for keys, and manually manages state and persistence. This makes the codebase harder to maintain and prone to "missing key" runtime errors.

## Goals
1.  **Create a dedicated `useI18n` hook**: Extract language state, switching logic, and translation execution into a reusable hook.
2.  **Ensure strict type safety**: Use TypeScript's `keyof` to provide auto-completion and compile-time validation for all translation keys.
3.  **Automate persistence**: Handle `localStorage` synchronization within the hook to simplify `App.tsx`.
4.  **Support complex interpolation**: Improve the interpolation logic to handle multiple parameters more robustly.

## Scope
-   Formalizing the i18n Capability Spec.
-   Implementing the `useI18n` hook in `src/hooks/useI18n.ts`.
-   Updating `src/i18n/index.ts` to export strict types.
-   Refactoring `App.tsx` and all child components (Modal, etc.) to use the new hook.

## Non-Goals
-   Adding new languages (staying with zh, en, tw).
-   Changing the current translation strings (content stays the same).
-   Using external i18n libraries (like i18next) to keep the bundle size small.

## Strategy
1.  Define `openspec/specs/i18n/spec.md` with formalized language structure.
2.  Export `TranslationKey` type from `src/i18n/index.ts`.
3.  Implement `src/hooks/useI18n.ts` with state and persistence.
4.  Replace the manual `t` function in `App.tsx`.
