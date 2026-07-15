# Host surface verification

Verification date: **2026-07-15**

This note records evidence for **Skill and Plugin host surfaces**. It does not
claim stage-executor support. Every Relay10 model stage still launches Codex
CLI subprocesses (`codex exec` / `codex debug models`).

## Scope

| Surface | What was verified | What was not verified |
|---|---|---|
| Claude Code Skill + Plugin | Manifest validation, local marketplace install, eight skills listed | Claude as a stage executor, MCP, custom UI, GitHub marketplace shorthand on unmerged `main` |
| Grok Build / Grok CLI Skill host | Repo skills loaded from `.agents/skills` (and Claude-compat paths) in a live session | Grok as a stage executor, xAI custom-provider E2E, Reader-10 through Grok |
| Codex CLI runtime | `npm run check`, skill-pack validator | Live Codex model stages in this verifier environment (Codex CLI was not on PATH) |

## Claude Code (re-check)

Commands and results on branch with the Claude Code plugin preview:

```text
claude plugin validate plugins/relay10   → Validation passed
claude plugin validate .                 → Validation passed
claude plugin details relay10@relay10    → Skills (8): relay10-build … relay10-spec
npm run check                            → 85+ tests pass; skill pack validation: pass (8 skills)
```

Install surface observed earlier and still present:

- Marketplace source: local clone (`claude plugin marketplace` lists `relay10`)
- Plugin: `relay10@relay10` version `0.1.1`, scope user, status enabled
- Component inventory: 8 skills, 0 agents/hooks/MCP/LSP
- Project clone surface: `.claude/skills` → `../plugins/relay10/skills` resolves to the canonical pack

Boundary reminder: Claude Code loads skills and can shell out to `r10`. It does
**not** replace Codex as the stage executor.

## Grok Build / Grok CLI (first host-surface check)

Grok discovers repository skills from `.agents/skills` (and walks Claude-compat
skill roots). In a live Grok Build session opened in this repository:

- All eight `relay10-*` skills appeared as available skills (paths under
  `plugins/relay10/skills` and the `.agents/skills` symlink)
- Skill instructions were loadable (`relay10-review`, `relay10-research`, and
  related pack entries)
- Symlink integrity:

```text
.agents/skills  → ../plugins/relay10/skills  (resolves)
.claude/skills  → ../plugins/relay10/skills  (resolves)
skills: relay10-build, relay10-debug, relay10-orchestrate, relay10-release,
        relay10-research, relay10-review, relay10-skill-lab, relay10-spec
```

Boundary reminder:

- **Skill host (verified):** Grok can load and follow the pack when working
  inside a clone that exposes `.agents/skills`.
- **Stage executor (not verified):** Grok / xAI is still only an experimental
  Codex custom-provider candidate. Do not advertise “Grok-supported stages”.

## Runtime dependency observed during verification

On this machine (2026-07-15):

```text
node src/cli.mjs doctor
# before doctor UX fix: relay10: spawn codex ENOENT
# after doctor UX fix:  FAIL Codex codex not found on PATH …
```

`r10 doctor` and catalog discovery require an authenticated Codex CLI on PATH.
Skill-host verification does not require Codex; end-to-end `r10 run` does.

## How to re-run

```bash
# Pack integrity
npm run check
npm run validate:skills

# Claude Code
claude plugin validate plugins/relay10
claude plugin validate .
claude plugin details relay10@relay10   # when installed

# Grok Build / Grok CLI
# open a session in the repo root and confirm the eight relay10-* skills load
# from .agents/skills (or installed Claude-compat skill paths)

# Runtime
r10 doctor
```

## Claim language

| Allowed | Not allowed |
|---|---|
| “Claude Code can install/load the eight-skill pack (preview)” | “Claude runs Relay10 stages natively” |
| “Grok Build can load the eight skills from `.agents/skills`” | “Grok is a supported stage provider” |
| “Codex CLI remains the verified stage runtime” | “Multi-provider stage mixing works” |

See also [`lineage-and-portability.md`](./lineage-and-portability.md).
