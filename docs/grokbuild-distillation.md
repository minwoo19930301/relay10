# Grok Build pattern distillation

Evidence snapshot: **2026-07-17T17:30:00+09:00**

## Decision

DisciplinedRun adopts a small set of narrow findings from the newly
open-sourced [xai-org/grok-build](https://github.com/xai-org/grok-build)
(Apache-2.0, Rust): two documentation corrections that keep existing host
claims exactly matched to source, one distilled lockfile-reclaim behavior,
and one pinned design note that constrains a future Grok stage-executor
adapter. It does not import Grok Build code, add a dependency, or change
what DisciplinedRun claims to support.

Grok Build was open-sourced after earlier versions synced user repositories
to cloud storage without clear consent; the upload feature is disabled and
the full source is now public. That history is why the privacy findings
below are treated as user-facing documentation, not trivia.

## Current primary evidence

All references are pinned to commit
[`c68e39f`](https://github.com/xai-org/grok-build/commit/c68e39f60462f28d9be5e683d9cbe2c57b1a5027).
Paths are relative to `crates/codegen/`.

| Claim | Primary source | Observed value | Confidence |
|---|---|---|---|
| Skill discovery order | [`xai-grok-tools/src/types/compat.rs`](https://github.com/xai-org/grok-build/blob/c68e39f60462f28d9be5e683d9cbe2c57b1a5027/crates/codegen/xai-grok-tools/src/types/compat.rs#L367-L376), [`.../skills/discovery.rs`](https://github.com/xai-org/grok-build/blob/c68e39f60462f28d9be5e683d9cbe2c57b1a5027/crates/codegen/xai-grok-tools/src/implementations/skills/discovery.rs#L852-L857) | `.grok` and `.agents` skill roots are always scanned, in that order; `.claude` is gated on a `[compat]` cell that defaults **on** but is user-disableable; the file-path discovery walk excludes `.cursor` by design | High; read directly from source. |
| Coding-data retention default | [`xai-grok-pager/src/settings/defs.rs`](https://github.com/xai-org/grok-build/blob/c68e39f60462f28d9be5e683d9cbe2c57b1a5027/crates/codegen/xai-grok-pager/src/settings/defs.rs#L1107-L1132) | Account-level "Coding data sharing" privacy setting defaults to `opt-in` — "Controls whether SpaceXAI may retain and train on coding session data"; persisted in auth metadata, not `config.toml` | High for the shipped default; server-side behavior not independently verified. |
| Headless output channel | [`xai-grok-pager/src/headless.rs`](https://github.com/xai-org/grok-build/blob/c68e39f60462f28d9be5e683d9cbe2c57b1a5027/crates/codegen/xai-grok-pager/src/headless.rs#L459-L465) | Headless mode (`grok -p`) emits one terminal JSON blob on stdout under `--output-format json`; there is no `--output-last-message`-style file side channel, and the prompt arrives via `-p`/`--prompt-json` flags, not stdin | High for the inspected paths. |
| Sandbox failure behavior | [`xai-grok-sandbox/src/lib.rs`](https://github.com/xai-org/grok-build/blob/c68e39f60462f28d9be5e683d9cbe2c57b1a5027/crates/codegen/xai-grok-sandbox/src/lib.rs#L144-L193) | Sandbox application is **fail-open**: unsupported platform or apply error logs a warning and continues without a sandbox; a stub applies when the `enforce` feature is compiled out | High; both fallback paths read directly. |
| Stale-lock reclaim protocol | [`xai-grok-memory/src/dream_lock.rs`](https://github.com/xai-org/grok-build/blob/c68e39f60462f28d9be5e683d9cbe2c57b1a5027/crates/codegen/xai-grok-memory/src/dream_lock.rs#L53-L149) | Lock holder is reclaimed only when its PID is dead or the lock exceeds a staleness threshold; write-then-verify acquisition; in-code comment states this is "best-effort coordination, not mutual exclusion" | High for documented behavior; no wording or code copied. |

## What DisciplinedRun adopts now

1. **Doc precision on Grok skill discovery**
   ([host-surface-verification.md](host-surface-verification.md)): the
   existing verified claim gains the source-level precedence facts — `.grok`
   before `.agents`, Claude-compat gated by a default-on toggle a user can
   turn off.
2. **Data-retention caveat in the provider table** ([README](../README.md)):
   users who host the skill pack in Grok Build are pointed at the `opt-in`
   default of the "Coding data sharing" setting. DisciplinedRun never
   launches Grok and cannot see or change that setting.
3. **Stale-lock reclaim for `workspace.lock`** (separate PR): on `EEXIST`,
   read the recorded `{runId, pid, createdAt}`; reclaim only when the holder
   PID is provably dead or the lock exceeds a staleness threshold, verify the
   win by re-reading, and document the mechanism as best-effort coordination.
   Today a crashed mutating run leaves the lock stuck until a human deletes
   it.
4. **Pinned executor-adapter constraints**
   ([lineage-and-portability.md](lineage-and-portability.md)): a future
   `GrokExecutorAdapter` must consume one stdout JSON blob instead of an
   output file, pass the prompt by flag instead of stdin, and must not
   present Grok's fail-open sandbox as an enforced read-only guarantee.

## Deferred (real, not yet scheduled)

- **Artifact redaction module** (`src/redact.mjs`): zero-dependency secret
  and home-path redaction at the events/manifest/report write seams,
  following the tripwire-test discipline in `xai-grok-secrets`. Deferred to
  its own PR with tests.
- **Golden wire-contract tests** for persisted JSON surfaces, following the
  golden/negative-test pattern in `xai-prompt-queue`.
- **Effort-key normalization breadth** in `catalog.mjs` (camelCase
  `reasoningEfforts`, object-menu `value`/`id`/`label` keys) — pointless
  until a non-Codex adapter exists.

## What stays out

- the full `GrokExecutorAdapter` implementation (two structural contract
  changes; premature before v0.3);
- ACP client integration for model metadata;
- vendoring any sandbox enforcement (Landlock/Seatbelt) — DisciplinedRun
  never runs privileged enforcement code;
- per-file hunk attribution actors, worktree pooling, embeddings memory,
  background consolidation loops, codebase-graph indexing — each is a
  resident state owner or daemon shape the Ouroboros exclusions already
  forbid;
- all telemetry/Sentry/Mixpanel scaffolding — directly opposite the
  zero-telemetry core;
- a `.grok-plugin/` manifest mirror — Grok Build already discovers the
  existing `.claude-plugin` files third in both lookup orders.

## License note

Grok Build is Apache-2.0 at the repository level. DisciplinedRun adopts
behavior descriptions only; no source code, wording, or assets were copied,
so no attribution obligations attach. Dependencies and external services of
Grok Build carry their own terms.

This document is a technical comparison, not legal advice.
