# Changelog

## Unreleased

- **Product rename: DisciplinedRun** (formerly Relay10). npm package
  `disciplinedrun@0.2.0`, primary CLI `disciplinedrun`, short alias **`dpr`**
  (Disciplined Process Run),
  and legacy aliases `r10` / `relay10`. Identity: a lightweight execution
  discipline for coding agents; explicit scope, risk-aware effort, inspectable
  evidence, and separate verdicts. The routing and invocation-budget subsystem
  is the **Effort Governor**.
- Keep on-disk compatibility: `.relay10/`, `relay10.config.json`, skill ids
  `relay10-*`, plugin package name `relay10`, GitHub path unchanged in this
  release.
- Gate the frontier architect after scout evidence for economy-tier work while
  preserving always/never controls and the existing artifact contract.
- Record advisor decisions, reason codes, evidence counts, and invocation
  budgets in run events, manifests, and HTML reports.
- Document the Fable/Sonnet role correction, source limitations, Artificial
  Analysis graph caveats, and a forward evaluation protocol without claiming
  unmeasured token or currency savings.
- Document Claude Code and Grok Build as **Skill hosts** (not stage executors),
  with dated evidence in `docs/host-surface-verification.md`.
- Make `r10 doctor` report a structured FAIL with PATH guidance when the Codex
  CLI is missing, instead of crashing on `spawn codex ENOENT`.
- Format top-level CLI errors for missing executables with the same guidance.
- Add an opt-in/automatic short-task fast lane with an overall time budget,
  maker-first execution, medium effort caps, a declared primary-artifact
  content gate, deterministic reporting, and safety fallback to the full lane.
- Teach the host skills to prefer a runnable source slice over broad test-first
  work under an explicit deadline, with a lower-effort fast lane for 15-minute-or-shorter work.

## 0.1.1 - 2026-07-13

- Include `examples/relay10.config.json` in the Git repository and release tag.
- Mark the initial v0.1.0 tag as superseded after a clean-clone test exposed the omission.

## 0.1.0 - 2026-07-13

- Initial Codex CLI harness with dynamic model-role discovery.
- Risk-aware routing contracts for scout, architect, maker, reviewer, explainer,
  and Reader-10.
- Deterministic and optional live Reader-10 clarity gates.
- Self-contained HTML run reports and frozen run artifacts.
