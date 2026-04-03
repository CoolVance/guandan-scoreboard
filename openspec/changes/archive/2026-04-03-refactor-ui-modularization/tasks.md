# Tasks: Refactor UI Modularization

## Phase 1: Atomic Components (Common)
- [ ] Create `src/components/Common/` directory.
- [ ] Extract `TopModeIcon` and `BottomModeIcon` to `src/components/Common/Icons.tsx`.
- [ ] Extract `SwipeControl` to `src/components/Common/SwipeControl.tsx`.
- [ ] Extract `PlayerButton` to `src/components/Common/PlayerButton.tsx`.
- [ ] Extract `Modal` to `src/components/Common/Modal.tsx`.
- [ ] Update `App.tsx` to use these common components.

## Phase 2: Feature Components
- [ ] Create `src/components/Scoring/` directory.
- [ ] Extract `ManualScoreContent` to `src/components/Scoring/ManualScoreContent.tsx`.
- [ ] Extract `ScoreInputContent` to `src/components/Scoring/ScoreInputContent.tsx`.
- [ ] Create `src/components/History/` directory.
- [ ] Extract `HistoryContent` to `src/components/History/HistoryContent.tsx`.
- [ ] Create `src/components/Tutorial/` directory.
- [ ] Extract `TutorialOverlay` to `src/components/Tutorial/TutorialOverlay.tsx`.
- [ ] Update `App.tsx` imports.

## Phase 3: Layout & System Components
- [ ] Create `src/components/Layout/` directory.
- [ ] Extract `DraggableDrawer` to `src/components/Layout/DraggableDrawer.tsx`.
- [ ] Update `App.tsx` imports.

## Phase 4: Integration & Cleanup
- [ ] Verify that all components have proper TypeScript prop definitions.
- [ ] Ensure `App.tsx` is clean and contains only orchestration logic.
- [ ] Remove all redundant component definitions from `App.tsx`.
- [ ] Run `npm run build` to ensure no errors.
- [ ] Final manual verification of UI behavior (locking, swiping, persistence).
