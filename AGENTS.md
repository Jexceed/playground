# Agent Collaboration Guidelines

## Commit And Push Policy

- Do not make frequent commits or pushes to `main` while a design or implementation direction is still being discussed.
- Before pushing to `main`, wait for the user to confirm the方案 or explicitly ask for a release-style/big-version commit.
- Use `main` for confirmed milestones only. Keep intermediate exploration and rollback points off `main`.

## Local Checkpoint Policy

- Use a local `dev` branch for work-in-progress checkpoints.
- It is acceptable to commit locally on `dev` after meaningful steps so the project can be rolled back safely.
- Prefer small, descriptive local commits on `dev` over untracked or hard-to-recover changes.
- Do not push `dev` unless the user explicitly asks.

## Working Rules

- Keep the worktree clean before switching context when feasible.
- Never discard user changes unless explicitly asked.
- When unsure whether a change is ready for `main`, keep it on `dev` and report what has been changed and verified.
