# Tasks: Refactor i18n Enhancement

## Phase 1: Type System Improvements
- [ ] Update `src/i18n/index.ts`:
  - [x] Export `Lang` type.
  - [ ] Export `TranslationKey` derived from `zh.translations`.
  - [ ] Add `DEFAULT_LANG` constant.

## Phase 2: Core Hook Implementation
- [ ] Implement `src/hooks/useI18n.ts`:
  - [ ] Initialize `lang` state using `localStorage` or `navigator.language`.
  - [ ] Implement the `t` function with robust interpolation logic (`{key}`).
  - [ ] Add `changeLang` method with `localStorage` persistence.
  - [ ] Ensure backward compatibility with `scoreboard_v5` key.

## Phase 3: Integration into App.tsx
- [ ] Refactor `App.tsx`:
  - [ ] Replace `lang` and `setLang` with `useI18n()`.
  - [ ] Remove the manual `t` function definition.
  - [ ] Clean up redundant `localStorage` logic related to language.
- [ ] Update child components if they were passed `t` as a prop.

## Phase 4: Validation & Testing
- [ ] Verify translation keys:
  - [ ] Ensure all 80+ `t()` calls in `App.tsx` compile correctly.
- [ ] Verify interpolation:
  - [ ] Test keys like `actionTitle` with dynamic names.
- [ ] Verify persistence:
  - [ ] Confirm language choice survives page refresh.
