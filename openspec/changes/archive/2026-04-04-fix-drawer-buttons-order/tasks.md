## 1. UI Implementation

- [x] 1.1 Modify `src/components/Layout/DraggableDrawer.tsx` to fix the flex direction of the main button container to `flex-col`.

## 2. Documentation

- [x] 2.1 Update `FUNCTIONAL_SPEC.md` to reflect the change in the Mirror Menu logic for the primary buttons.

## 3. Verification

- [x] 3.1 Verify that the "Lock" button is always above the "Menu" button when the drawer is in the top half of the screen.
- [x] 3.2 Verify that the "Lock" button remains above the "Menu" button when the drawer is dragged to the bottom half of the screen.
- [x] 3.3 Verify that the expanded menu items still correctly mirror (grow upwards when at the bottom) and don't overlap awkwardly.
