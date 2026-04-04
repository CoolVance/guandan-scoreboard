## Why

Currently, the order of the "Lock" and "Menu" buttons in the draggable drawer reverses when the drawer is moved to the bottom half of the screen (following the "Mirror Menu" principle). This can be confusing for users who expect a consistent button layout regardless of the drawer's position.

## What Changes

- Fix the vertical order of the "Lock" and "Menu" buttons in the `DraggableDrawer` component.
- The "Lock" button will always be positioned above the "Menu" button, regardless of whether the drawer is in the upper or lower half of the screen.
- Disable the mirroring logic specifically for these two main buttons.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `ui`: Define the standard fixed order for the control FAB (Lock on top, Menu below), overriding the previous mirroring requirement for these specific buttons.

## Impact

- `src/components/Layout/DraggableDrawer.tsx`: Modification of the flexbox direction logic for the main FAB container.
- `FUNCTIONAL_SPEC.md`: This change partially overrides the "Mirror Menu" section regarding the two main buttons.
