## ADDED Requirements

### Requirement: Human-Friendly Documentation Tone
The project's primary documentation (READMEs) SHALL prioritize accessibility and "plain language" over technical jargon to ensure non-technical users can understand the project's value and deployment options.

#### Scenario: User reads README to understand the project
- **WHEN** a user opens the `README.md`
- **THEN** the primary introduction and features SHALL focus on user benefits (e.g., "easy scoring", "offline use") rather than technical implementation details (e.g., "React 18", "Service Worker").

### Requirement: Centralized Deployment Links
All project documentation SHALL feature the Cloudflare deployment link as the recommended access point to ensure a consistent user experience.

#### Scenario: User looks for a demo link
- **WHEN** a user checks the "Demo" or "Live" section of any README
- **THEN** the link `https://guandan-scoreboard.inin.workers.dev/` SHALL be listed prominently as a primary option.
