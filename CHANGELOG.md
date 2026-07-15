# Changelog

## Unreleased

- Document Claude Code and Grok Build as **Skill hosts** (not stage executors),
  with dated evidence in `docs/host-surface-verification.md`.
- Make `r10 doctor` report a structured FAIL with PATH guidance when the Codex
  CLI is missing, instead of crashing on `spawn codex ENOENT`.
- Format top-level CLI errors for missing executables with the same guidance.

## 0.1.1 - 2026-07-13

- Include `examples/relay10.config.json` in the Git repository and release tag.
- Mark the initial v0.1.0 tag as superseded after a clean-clone test exposed the omission.

## 0.1.0 - 2026-07-13

- Initial Codex CLI harness with dynamic model-role discovery.
- Risk-aware routing contracts for scout, architect, maker, reviewer, explainer,
  and Reader-10.
- Deterministic and optional live Reader-10 clarity gates.
- Self-contained HTML run reports and frozen run artifacts.
