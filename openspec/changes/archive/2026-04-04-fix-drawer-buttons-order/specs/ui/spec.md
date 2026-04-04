## ADDED Requirements

### Requirement: Draggable Drawer Control FAB Layout
The Draggable Drawer's main Control FAB (Floating Action Button) group SHALL maintain a fixed vertical order for its primary buttons to ensure ergonomic consistency.

#### Scenario: Fixed button order regardless of vertical position
- **WHEN** the Draggable Drawer is located in the upper half of the screen
- **THEN** the "Lock" button SHALL be positioned vertically above the "Menu" button
- **WHEN** the Draggable Drawer is moved to the lower half of the screen
- **THEN** the "Lock" button SHALL remain positioned vertically above the "Menu" button
