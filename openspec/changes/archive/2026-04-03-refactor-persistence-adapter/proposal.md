# Proposal: Refactor Persistence Adapter

## Context
Currently, the application state is persisted in `localStorage` under the key `scoreboard_v5`. However, the logic for reading and writing this data is duplicated across `useScoring.ts`, `useI18n.ts`, and `App.tsx`. Each module performs a manual "read-merge-write" operation, which is error-prone and can lead to data loss if multiple modules write simultaneously.

## Goals
1.  **Unified Storage Manager**: Create a central utility to handle all `localStorage` interactions.
2.  **Type-Safe Schema**: Define a comprehensive TypeScript interface for the entire storage object.
3.  **Atomic Partial Updates**: Support updating specific keys (e.g., just `lang` or just `history`) without manually merging the entire object in business logic.
4.  **Error Handling**: Centralize try-catch logic for JSON parsing and quota-exceeded errors.

## Scope
-   Creating `src/types/storage.ts` for schema definitions.
-   Implementing `src/utils/storage.ts` with `loadStorage`, `saveStorage`, and `updateStorage` methods.
-   Refactoring `useScoring`, `useI18n`, and `App.tsx` to use the new utility.

## Non-Goals
-   Migrating to a different storage engine (staying with `localStorage`).
-   Changing the storage key (staying with `scoreboard_v5` for backward compatibility).

## Strategy
1.  Define the `ScoreboardStorage` interface.
2.  Implement a robust `StorageAdapter` utility.
3.  Replace all direct `localStorage.setItem` and `JSON.stringify` calls with `storageAdapter.update()`.
