## Why

The project's documentation is currently a bit technical and "stiff," focusing heavily on developer tools and badges. With the new deployment on Cloudflare, we have an opportunity to make the documentation more approachable for ordinary users who just want to use the scoreboard or set it up easily on their own devices (like a NAS).

## What Changes

- **Update Cloudflare Link**: Add `https://guandan-scoreboard.inin.workers.dev/` as the primary/recommended demo link in all README files.
- **Human-Friendly READMEs**: Rewrite `README.md`, `README_zh-TW.md`, and `README_en.md` to focus on user experience and value. Reduce the prominence of technical badges and "build tools" for non-developers.
- **Refactor FUNCTIONAL_SPEC.md**: Retain this file but refine its tone to be a "Product Concept & Rules Manual." It will serve as the "Source of Truth" for how the game logic works, which is useful for both curious users and future contributors, without being overly "code-heavy."
- **Consistency**: Ensure all three language versions of the README share the same simplified structure and updated links.

## Capabilities

### New Capabilities
- None (This is a documentation-only change).

### Modified Capabilities
- `ui`: While no code changes are planned, the *description* of UI features in the documentation will be simplified to match the "human-friendly" goal.

## Impact

- `README.md`, `README_zh-TW.md`, `README_en.md`: Significant content rewrite.
- `FUNCTIONAL_SPEC.md`: Tone refinement and structural cleanup.
- No impact on application code or logic.
