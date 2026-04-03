# Design: UI Visual & Animation Specification

## Architecture Overview

We will leverage Tailwind CSS v4's `@theme` extension to map internal CSS variables (tokens) to utility classes.

```ascii
┌──────────────────────────┐      ┌──────────────────────────┐
│    src/index.css         │      │    Core Components       │
├──────────────────────────┤      ├──────────────────────────┤
│  @theme {                │      │  <div className="        │
│    --color-team-red: ... │◀─────┤    bg-team-red           │
│    --radius-xl: ...      │      │    shadow-elevated       │
│    --animate-pop: ...    │      │  " />                    │
│  }                       │      │                          │
└─────────────┬────────────┘      └──────────────────────────┘
              │
              ▼
      ┌────────────────┐
      │ Browser Render │
      └────────────────┘
```

## Design Tokens (Proposed)

### Colors
- `team-red`: `#ef4444` (Red team primary)
- `team-blue`: `#3b82f6` (Blue team primary)
- `accent-yellow`: `#facc15` (Round/Gold color)
- `surface-bg`: `#ffffff` (Main background)
- `surface-modal`: `#f9fafb` (Modal header/sub-surfaces)

### Elevation & Radius
- `radius-main`: `1rem` (`rounded-2xl` equivalent)
- `radius-button`: `0.75rem` (`rounded-xl` equivalent)
- `shadow-elevated`: `0 25px 50px -12px rgb(0 0 0 / 0.25)` (`shadow-2xl` equivalent)

### Animations
- `ease-bounce`: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- `duration-pop`: `200ms`

## Refactoring Strategy

1.  **CSS Variables**: Define all tokens at the root of `src/index.css`.
2.  **Tailwind Integration**: Use `@theme` block to expose these variables as Tailwind utilities.
3.  **Atomic Replacement**:
    - Replace `rounded-2xl` with `rounded-radius-main`.
    - Replace `bg-red-500` with `bg-team-red` in player buttons and swipe controls.
4.  **Haptics & Visual Sync**: Ensure the `animate-bounce-pop` is applied consistently to all score triggers.
