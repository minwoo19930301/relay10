---
name: relay10-orchestrate
description: Route a multi-stage repository task through the smallest useful Relay10 workflow. Use for work that mixes research, planning, implementation, review, or release; do not use for a single obvious read or edit.
---

# Relay10 Orchestrate

Coordinate the other Relay10 skills without turning every request into a large process.

## Preflight

1. Restate the requested outcome, constraints, and forbidden actions.
2. Inspect the repository and current git state before proposing edits.
3. If `r10` is available, run `r10 doctor` and preview routing with `r10 route "<task>" --json`.
4. Treat `r10 run "<task>" --dry-run` as a preview. Run a mutating pipeline only when the user authorized implementation.

This skill helps choose a workflow. It does not change the model of the host agent's current task, whether that host is Codex or Claude Code, and does not make unsupported providers available.

## Choose the smallest path

- Read-only evidence gathering: use `relay10-research` only.
- Ambiguous or high-impact change: use `relay10-spec`, then `relay10-build`.
- Approved, well-specified edit: use `relay10-build` directly.
- Failure or regression: use `relay10-debug`; edit only when a fix is authorized.
- Review request: use `relay10-review` without editing.
- Publication or handoff: use `relay10-release` after implementation checks pass.
- Skill creation or trigger tuning: use `relay10-skill-lab`.

Skip stages whose output cannot change the decision. Add review depth as risk, blast radius, irreversibility, or verification difficulty rises.

## Handoff contract

For every active stage, record:

- goal and non-goals;
- inputs and evidence locations;
- allowed mutations;
- result and unresolved risks;
- deterministic checks and semantic review;
- next owner or next action.

Separate observed facts, inferences, and proposals. Never call a stage complete from intention alone.

## Safety boundaries

- Preserve unrelated work in a dirty worktree.
- Do not broaden authorization from diagnosis to repair, or from local changes to publication.
- Do not hide destructive actions behind a recipe, subagent, hook, or retry loop.
- Stop repeated repair attempts after three materially similar failures and reassess the hypothesis.
- Keep databases, daemons, worktrees, swarms, and GUIs optional rather than core requirements.
