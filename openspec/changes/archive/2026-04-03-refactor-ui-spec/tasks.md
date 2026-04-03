# Tasks: UI Visual & Animation Specification

## Phase 1: Design Tokens Foundation
- [ ] Update `src/index.css`:
  - [ ] Define `@theme` extension.
  - [ ] Add semantic colors: `team-red`, `team-blue`, `accent-gold`.
  - [ ] Add semantic radii and shadows.
  - [ ] Formalize `ease-bounce` and `animate-pop` utilities.

## Phase 2: Refactor Atomic Components
- [ ] Refactor `src/components/Common/PlayerButton.tsx`:
  - [ ] Use `bg-team-red` and `bg-team-blue`.
- [ ] Refactor `src/components/Common/Modal.tsx`:
  - [ ] Use semantic shadows and radii.
- [ ] Refactor `src/components/Common/SwipeControl.tsx`:
  - [ ] Verify `animate-bounce-pop` consistency.

## Phase 3: Refactor Layout & Feature Components
- [ ] Refactor `src/components/Layout/DraggableDrawer.tsx`:
  - [ ] Use semantic colors for locking states.
  - [ ] Unify transition durations.
- [ ] Refactor `src/components/History/HistoryContent.tsx`:
  - [ ] Update table styles and tag colors to use tokens.

## Phase 4: Verification
- [ ] Ensure all 10+ core colors are tokenized.
- [ ] Verify build.
- [ ] Check UI consistency across different `uiMode` settings.
- [ ] Run `npm run build`.
