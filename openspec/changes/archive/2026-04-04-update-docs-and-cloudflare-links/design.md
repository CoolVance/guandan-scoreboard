## Context

The current project documentation uses a standard developer-centric layout, leading with technical badges and tool names. This change aims to pivot towards a "User-First" content strategy, making the project more accessible and clearly presenting the new Cloudflare hosting option.

## Goals / Non-Goals

**Goals:**
- Present the Cloudflare link as the definitive demo environment.
- Rewrite all README files (zh, tw, en) using approachable, descriptive language.
- Refine `FUNCTIONAL_SPEC.md` into a "User Manual & Product Concepts" document.
- Make self-hosting instructions (Docker, NAS) extremely clear for non-technical users.

**Non-Goals:**
- Deleting technical documentation entirely (just restructuring it).
- Changing any application code or feature set.

## Decisions

### 1. README Structure Overhaul
- **Decision**: Start with a value proposition and the live demo link, followed by user-centric feature descriptions.
- **Rationale**: Users want to know *what it is* and *how to use it* before knowing *how it's built*.
- **Structure**:
  1. Title & Value Prop
  2. 📱 Live Demo (Cloudflare)
  3. ✨ Key Benefits (Simplified "Features")
  4. 🚀 Quick Start (One-liners)
  5. 🐳 Home Lab / NAS (Simplified Docker instructions)
  6. 🛠️ Tech Info (Moved to bottom)

### 2. Multi-language Synchronization
- **Decision**: Update all three README versions (`README.md`, `README_zh-TW.md`, `README_en.md`) simultaneously to ensure parity in tone and link updates.

### 3. FUNCTIONAL_SPEC.md Positioning
- **Decision**: Maintain this file as the "Source of Truth" for game logic but rewrite its intro and sections to feel like a "Game Official's Manual" rather than a software spec.
- **Rationale**: It helps bridge the gap between high-level README and low-level code/OpenSpec.

## Risks / Trade-offs

- **[Risk]** Potential loss of technical detail for developers ➔ **Mitigation**: Preserve a "Tech Info" section at the bottom or reference OpenSpec files.
- **[Risk]** Translation drift between READMEs ➔ **Mitigation**: Translate the simplified core concepts consistently across all three files.
