# Design: Refactor UI Modularization

## Architecture Overview

The UI will be organized into a multi-layered structure of components to promote separation of concerns and reusability.

```ascii
src/
├── components/
│   ├── Common/             # Stateless UI primitives
│   │   ├── Modal.tsx
│   │   ├── SwipeControl.tsx
│   │   ├── PlayerButton.tsx
│   │   └── Icons.tsx (TopModeIcon, BottomModeIcon)
│   ├── Scoring/            # Functional scoring-related components
│   │   ├── ManualScoreModal.tsx
│   │   └── ScoreInputModal.tsx
│   ├── History/            # History log management
│   │   └── HistoryContent.tsx
│   ├── Tutorial/           # User onboarding
│   │   └── TutorialOverlay.tsx
│   └── Layout/             # Main layout and persistent interactive elements
│       └── DraggableDrawer.tsx
├── hooks/                  # Business Logic (useScoring, useI18n)
└── App.tsx                 # Top-level coordinator
```

## Component Interfacing

### 1. Common Components
These will be highly reusable and mostly stateless, receiving all data and handlers as props.
- `Modal`: Handles z-indexing, background blur, and title/action headers.
- `SwipeControl`: Encapsulates touch event logic for swipes.
- `PlayerButton`: Simple button for displaying player scores and triggering actions.

### 2. Functional Components (Scoring, History, Tutorial)
These are composite components that contain specific UI for game features.
- They will take the `t` (translation) function as a prop.
- They will receive relevant state and callbacks from the parent (`App.tsx`).

### 3. DraggableDrawer
This component manages its own internal dragging and locking state but informs the parent of position changes.

## Refactoring Steps

1.  **Phase 1: Common Library**: Create atomic components and replace their inline definitions.
2.  **Phase 2: Feature Modularization**: Extract `HistoryContent`, `ManualScoreContent`, `ScoreInputContent`, and `TutorialOverlay`.
3.  **Phase 3: Layout & Drawer**: Move `DraggableDrawer` to its own file.
4.  **Phase 4: App.tsx Cleanup**: Re-organize imports and remove the 1000+ lines of extracted code.

## Verification
- Run `npm run build` after each phase.
- Ensure `localStorage` state is preserved.
- Verify that `isLocked` prevents all interactions including drawer dragging.
