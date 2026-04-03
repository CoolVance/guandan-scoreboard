# Capability: Internationalization (i18n)

## Description
Provides translation and language management services across the application. Supports multiple locales, fallback mechanisms, and parameter interpolation.

## Core Data Model

### Supported Locales
- `zh` (Simplified Chinese)
- `en` (English)
- `tw` (Traditional Chinese)

### Translation Record
A map where keys are unique identifiers and values are the corresponding localized strings.
- Example key: `scoreValue`
- Example value: `分值 (+/-)`

## Rules & Logic

### Translation Lookup
1.  Attempt to find the key in the current active locale.
2.  If not found, fall back to the default locale (`zh`).
3.  If still not found, return the key itself as a fallback.

### Parameter Interpolation
Strings may contain placeholders in the format `{variableName}`.
- Logic: `t('actionTitle', { name: 'Player1' })` -> `"Player1 的操作"`
- Parameters should be passed as an optional key-value map.

### Language Detection & Persistence
1.  On initial load, check `localStorage` for the last used language.
2.  If no saved preference, detect browser language (`navigator.language`).
3.  Persist any manual language changes to `localStorage` under a consistent key (e.g., `scoreboard_v5.lang`).

### Type Safety (TypeScript Integration)
- The system MUST export a `TranslationKey` type that includes all possible keys across all locales.
- The `t` function MUST enforce this type for its first argument.
