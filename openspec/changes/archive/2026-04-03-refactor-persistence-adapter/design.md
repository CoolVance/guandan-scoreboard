# Design: Refactor Persistence Adapter

## Architecture Overview

The persistence layer will be refactored into a singleton-like utility that provides a type-safe interface for partial state updates.

```ascii
┌──────────────────────────────────────────────────────────┐
│      useScoring      │      useI18n      │     App.tsx   │
├──────────────────────┴───────────────────┴───────────────┤
│                                                          │
│   Calls:                                                 │
│   - storageAdapter.get()                                 │
│   - storageAdapter.update({ lang: 'en' })                │
│                                                          │
└─────────────┬────────────────────────────────────────────┘
              │ (Type-Safe Schema)
              ▼
┌──────────────────────────────────────────────────────────┐
│                  StorageAdapter Utility                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   - JSON Serialization                                   │
│   - Key: 'scoreboard_v5'                                 │
│   - Merging Logic                                        │
│                                                          │
└─────────────┬────────────────────────────────────────────┘
              │ (Browser API)
              ▼
      ┌────────────────┐
      │  localStorage  │
      └────────────────┘
```

## Storage Schema Definition (`ScoreboardStorage`)

```typescript
export interface ScoreboardStorage {
  // Scoring
  history?: ScoreRecord[];
  leftCardIdx?: number;
  rightCardIdx?: number;
  middleNum?: number;
  
  // i18n
  lang?: Lang;
  
  // App State
  playerNames?: Record<PlayerId, string>;
  historyView?: 'list' | 'table';
  uiMode?: 'full' | 'top' | 'bottom';
  fabPos?: { x: number, y: number };
}
```

## Adapter Interface

- `get(): ScoreboardStorage`: Returns the parsed object or an empty object.
- `update(partial: Partial<ScoreboardStorage>)`: Reads current data, merges with partial, and saves back.
- `clear()`: Wipes the specific key.

## Migration Steps

1.  **Phase 1: Foundation**: Create `src/types/storage.ts` and `src/utils/storage.ts`.
2.  **Phase 2: Hook Refactoring**:
    - Update `useScoring.ts`: Remove local `STORAGE_KEY` and merge logic.
    - Update `useI18n.ts`: Use `storageAdapter.update({ lang })`.
3.  **Phase 3: App.tsx Integration**: Replace manual `localStorage` logic in `useEffect`.
4.  **Phase 4: Cleanup**: Remove any remaining direct `localStorage` calls related to scoreboard state.
