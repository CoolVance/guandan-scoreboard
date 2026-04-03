# Design: Refactor i18n Enhancement

## Architecture Overview

The i18n system will be refactored into a custom React hook `useI18n`. This hook will manage the `lang` state, handle translations with parameter interpolation, and synchronize the language preference with `localStorage`.

```ascii
┌──────────────────────────────────────────────────────────┐
│                      App.tsx (UI)                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   Calls:                                  Reads:         │
│   - t('key', {p})                         - lang         │
│   - setLang('en')                         - currentLang  │
│                                                          │
└─────────────┬──────────────────────────────▲─────────────┘
              │                              │
              ▼                              │
┌────────────────────────────────────────────┴─────────────┐
│                    useI18n Hook                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   State Management:           Logic & Rules:             │
│   - lang: Lang                - Interpolation Logic      │
│   - isLoaded: boolean         - Fallback Mechanism       │
│                               - Browser Detection        │
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
- `lang: Lang`: The currently active language code (`zh`, `en`, `tw`).
- `t(key: TranslationKey, params?: Record<string, string>): string`: 
  - The core translation function.
  - Enforces `TranslationKey` via TypeScript.
  - Automatically handles `{var}` interpolation.
- `isLoaded: boolean`: Indicates when the language has been loaded from storage.

### Actions (Returned by Hook)
- `changeLang(newLang: Lang)`: 
  - Switches the active language.
  - Persists the change to `localStorage`.

## Type Safety Implementation

We will modify `src/i18n/index.ts` to derive the `TranslationKey` type from the existing translation files:
```typescript
import zh from './zh';
export type TranslationKey = keyof typeof zh.translations;
```
This ensures that any key passed to `t()` must exist in the `zh.ts` file.

## Migration Strategy
1.  **Step 1**: Update `src/i18n/index.ts` to export the new types.
2.  **Step 2**: Create `src/hooks/useI18n.ts`.
3.  **Step 3**: Port `localStorage` and browser detection logic from `App.tsx` into the hook.
4.  **Step 4**: Replace the manual `t` function and `lang` state in `App.tsx` with a single call to `useI18n()`.
