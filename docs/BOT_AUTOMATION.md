# Bot automation notes

## Placeholder open-issue bot (`takealook-bot`)

This repository has an external automation (author shows as `takealook-bot`) that creates placeholder issues such as:

- `Chore: Keep tracker non-empty (heartbeat)`

### Why this exists

The goal is to avoid the issue tracker becoming completely empty, and to nudge us to keep a backlog of actionable work.

### Current observed problem

- Placeholder issues are created even when the tracker is intentionally empty (all work done).
- The automation may also auto-close issues shortly after creation.

### Important

This behavior is **not controlled by this repo's GitHub Actions workflows** (there is no workflow here that creates issues).
If you want to change it, you must update/disable the automation at the source (bot service / org-level automation).

### Recommended approach

- Prefer keeping a small set of real, actionable issues open instead of placeholder issues.
- If placeholders are not desired, disable or adjust the automation to:
  - consider recently closed issues (e.g., within 24h), or
  - only create placeholders when there are *no* issues of certain labels (feat/bug), or
  - stop auto-closing immediately.
