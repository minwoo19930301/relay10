# Relay10

> Bounded, risk-aware, inspectable runs. Route explicitly. Keep handoffs
> inspectable. Separate correctness signals from report clarity.

Relay10 is a small agent harness with zero third-party npm runtime
dependencies. The same eight-skill pack loads on **Codex, Claude Code, and
Grok Build** host surfaces. An optional `r10` CLI can run a bounded stage
pipeline, map a local model catalog into `frontier` / `balanced` /
`economy` labels, record stage handoffs as files, keep command and reviewer
results separate from report-clarity checks, and render a standalone HTML
run report.

This is an early `0.1.1` release. The `frontier`, `balanced`, and
`economy` labels come from catalog metadata and user overrides. They are not
live price measurements, benchmarks, or guarantees that Relay10 selected the
cheapest, weakest, or strongest available model.

## What it does

- **Evidence-gated advisor routing:** five task dimensions select stage
  profiles, then the scout evidence decides whether an economy task needs the
  frontier architect. Version 0.1 still does not escalate after a failed stage.
- **Small multi-host surface:** repo skills for Codex, Claude Code, and Grok
  Build, plus one Node CLI built on Node builtins only (no third-party npm
  runtime deps).
- **Inspectable handoffs:** each completed stage has a declared role, effort,
  sandbox, output path, and event record.
- **Separate signals:** explicitly configured commands, a model reviewer, and
  Reader-10 results are shown separately instead of being presented as one
  proof of correctness.
- **Two Reader-10 modes:** the default deterministic mode checks document
  structure and accessibility heuristics. Live mode makes ten reader-model
  invocations per round; neither mode establishes factual correctness.

## Why Relay10 instead of a batteries-included harness

Most agent harnesses compete on abundance: more agents, more hooks, always-on
completion loops, and autonomous teams. Projects such as
[OMO](https://github.com/code-yeongyu/oh-my-openagent),
[OMC](https://github.com/Yeachan-Heo/oh-my-claudecode), and
[OMX](https://github.com/Yeachan-Heo/oh-my-codex) are excellent at that; see
[docs/korea-landscape.md](docs/korea-landscape.md) and
[docs/lineage-and-portability.md](docs/lineage-and-portability.md) for a
sourced comparison.

Relay10 competes on restraint: **bounded, risk-aware, inspectable runs.**
Pick it when you want:

- **Works where you already work.** The skill pack is the primary product
  surface: the same `relay10-*` skills load in Codex, Claude Code, and Grok
  Build. You do not have to be “on Codex only” to use the workflow discipline.
  The optional `r10` stage pipeline is available when you want a closed-budget
  run with on-disk handoffs; see
  [host-surface-verification.md](docs/host-surface-verification.md).
- **Risk-aware routing, not habit.** Five task dimensions
  (complexity, risk, blast radius, verifiability, reversibility) produce a
  score and an `economy` / `balanced` / `frontier` profile. That profile
  gates advisor activation and stage effort; stage model roles themselves
  stay on fixed contracts (for example scout stays `economy`, reviewer stays
  `frontier`). Labels come from catalog metadata, not live prices or a
  measured spend map.
- **A hard ceiling instead of a completion loop.** When you use `r10 run`,
  `--budget-calls` caps model-stage launches for that pipeline. There is no
  retry-until-done loop; Reader-10 may still revise the report for a
  config-bounded number of rounds. The budget counts Relay10 stage launches,
  not tokens, provider turns, or currency.
- **Verification you can disagree with.** Configured command results, the
  model reviewer, and Reader-10 clarity checks are reported side by side, so
  "the run finished" is never presented as proof the work is correct.
- **A surface one person can inspect.** Zero third-party runtime npm
  dependencies, host-facing skills as ordinary files under
  `plugins/relay10/skills`, and optional run handoffs under
  `.relay10/runs/<id>/`—not a full compliance audit trail.

If you want an autonomous team that keeps working until the task looks done,
a batteries-included harness is the better tool. Relay10 is for work where
scope and budget stay closed, the same skills run on Codex / Claude / Grok
hosts, and handoffs stay readable on disk.

## Quick start

**Skill hosts (Codex, Claude Code, Grok Build):** clone the repo (or install
the Claude marketplace plugin). The pack appears via `.agents/skills` /
`.claude/skills`. No separate Codex install is required just to load skills
and follow the workflows on the host you already use.

**Optional bounded CLI pipeline:** Node 20+ and, for live `r10 run` model
stages, an authenticated Codex CLI on `PATH` (catalog discovery still uses
`codex debug models` in 0.1.1).

```bash
git clone https://github.com/minwoo19930301/relay10.git
cd relay10
npm link

# optional CLI path
r10 doctor
r10 init
r10 route "research the API and build a small CLI"
r10 run "research the API and build a small CLI" --dry-run
r10 run "research the API and build a small CLI"
```

To request live Reader-10, which schedules ten separate reader invocations per
round:

```bash
r10 run "your task" --live-readers --budget-calls 30
```

Different reader roles may use the same model or models from the same family;
ten invocations do not guarantee ten independent judgments. The invocation
budget counts Relay10's Codex subprocess launches, not provider-internal model
turns, tokens, or currency cost.

The report is written under `.relay10/runs/<run-id>/report.html`.

## Current provider and app support

Relay10 0.1.1 is **host-first, not Codex-only**. The skill pack runs on the
coding agent you already use. The optional `r10` CLI pipeline is a separate
bounded-run surface.

| Target | Current status | What that means |
|---|---|---|
| Claude Code as a Skill and Plugin host | Preview, re-verified 2026-07-15 | Marketplace / `.claude/skills` load all eight skills. Primary product path for Claude users. |
| Grok Build / Grok CLI as a Skill host | Preview, verified 2026-07-15 | `.agents/skills` (and Claude-compat roots) load the same pack. Primary product path for Grok users. |
| Codex as a Skill host | Supported | Same pack via `.agents/skills` / Codex plugin layout. |
| Codex CLI as optional `r10 run` stage runtime | Supported and tested | Live model stages in the CLI pipeline still launch `codex exec` and discover models via `codex debug models` in 0.1.1. Skill-host use does not require this. |
| Codex with an xAI/Grok custom provider as a **stage executor** | Experimental candidate, untested | Not the same as Grok skill-host support. Do not treat as released Grok stage execution. |
| Anthropic/Claude or Google Gemini APIs as `r10` stage executors | Unsupported in 0.1.1 | Native APIs need a provider-specific stage executor; skill-host support for Claude Code is separate and already works. |
| Mixed providers inside one `r10 run` | Unsupported | Stage config holds a model, not a provider switch. |
| Codex desktop app or IDE | Indirect shell use only | Can invoke `r10`; no native Relay10 progress UI. |
| ChatGPT app/web or a standalone GUI | Not implemented | Needs MCP/Apps SDK or a local sidecar. |

Skills guide the host agent; they do not silently replace that host’s model
for every tool call. The current tree includes the eight-Skill pack plus Codex
and Claude Code plugin bundles. Evidence for host checks lives in
[host-surface-verification.md](https://github.com/minwoo19930301/relay10/blob/main/docs/host-surface-verification.md).
See also the full
[lineage and portability decision](https://github.com/minwoo19930301/relay10/blob/main/docs/lineage-and-portability.md).

## Relay10 Skill pack

Relay10 distills recurring patterns from current global coding agents and
Agent Skill collections into eight on-demand skills instead of installing a
large catalog:

| Skill | Job | Important boundary |
|---|---|---|
| `relay10-orchestrate` | choose the smallest useful workflow | does not switch the host agent's current task model |
| `relay10-research` | collect current read-only evidence | does not mutate a repository |
| `relay10-spec` | define outcome, non-goals, acceptance, and rollback | does not implement plan-only requests |
| `relay10-build` | implement an authorized change in small slices | does not publish |
| `relay10-debug` | reproduce and isolate root cause | diagnosis alone does not authorize repair |
| `relay10-review` | review a fixed baseline and report findings | remains read-only |
| `relay10-release` | prove package, artifact, hash, and support claims | requires explicit publication authority |
| `relay10-skill-lab` | tune triggers and compare against no-skill baseline | rejects skills without measured benefit |

The canonical pack lives under `plugins/relay10/skills`. `.agents/skills` and
`.claude/skills` are relative symlinks to that directory so a cloned repository
exposes the same skills to Codex, Claude Code, and Grok Build surfaces that
scan those roots. The plugin manifests are at
`plugins/relay10/.codex-plugin/plugin.json` and
`plugins/relay10/.claude-plugin/plugin.json`, and the repository root
`.claude-plugin/marketplace.json` makes this repository installable as a Claude
Code marketplace; all three pass their local validators but have not been
published to a curated marketplace. To install the pack in Claude Code:

```text
/plugin marketplace add minwoo19930301/relay10
/plugin install relay10@relay10
```

Installed Claude Code plugin skills appear namespaced as `relay10:<skill-name>`;
a session opened inside a clone of this repository loads the same skills through
`.claude/skills` or `.agents/skills` without installing anything. Grok Build
discovers the pack via `.agents/skills` (and optional Claude-compat skill
paths). Skills guide the host agent on Claude Code, Grok Build, or Codex
without requiring a separate Codex install. Calling optional `r10 run` model
stages in 0.1.1 still uses Codex CLI when that pipeline is chosen. The pack
follows progressive disclosure and contains original clean-room text. The
Skill-ecosystem
source subset and license cautions are recorded in
`plugins/relay10/provenance/sources.json`; the complete agent, harness,
workflow, and Skill lineage is recorded in `docs/prior-art.md`.

## Default pipeline

| Stage | Capability label | Effort | Access | Purpose |
|---|---|---:|---|---|
| scout | economy | low | read-only + optional search | inspect sources and collect context |
| architect/advisor | frontier | max | read-only | after scout, advise balanced/frontier work or economy work with unresolved questions |
| maker | balanced | medium | workspace-write | implement the plan |
| verification | no model | n/a | explicit argv commands | record opt-in command results |
| reviewer | frontier | high | read-only | review correctness and risk |
| explainer | balanced | low | read-only | write a newcomer-facing summary |
| Reader-10 | rules or configured model | low | read-only | check report structure or model-reported clarity |

These are role defaults, not a claim that one role always receives the
objectively best or cheapest model. The available catalog metadata and local
overrides determine the concrete model and supported effort.

The default `conditional` policy skips the architect call only when the initial
task is economy-tier and `scout.json` contains no open questions. The run still
keeps `architect.md` as a deterministic skip record, so the six-stage artifact
contract remains stable. Balanced/frontier work keeps the advisor, and an
economy run with unresolved questions stops before mutation if its invocation
budget has no advisor headroom.

## Commands

```text
r10 init [--force]
r10 doctor
r10 route <task> [--json]
r10 run <task> [--dry-run] [--live-readers] [--budget-calls N]
r10 inspect [run-id] [--json]
r10 report [run-id] [--output file]
r10 replay [run-id] --frozen [--output file]
```

In 0.1, `replay --frozen` verifies the recorded hashes and either reports the
saved `report.html` path or copies that exact file outside the run directory.
`report` is the separate model-free re-render command and writes a new file. A
frozen replay is not a full environment snapshot, resume facility, or proof
that remote model behavior can be reproduced.

## Configuration

`r10 init` writes `relay10.config.json`. Model roles are derived from
`codex debug models`; explicit model overrides take precedence. See the
[example configuration](https://github.com/minwoo19930301/relay10/blob/main/examples/relay10.config.json)
and [configuration schema](https://github.com/minwoo19930301/relay10/blob/main/schema/config.schema.json).

Verification commands are intentionally opt-in because project commands can
have side effects. They use an executable plus literal argv array, not a shell
command string:

```json
{
  "verification": {
    "commands": [
      { "command": "npm", "args": ["test"] },
      { "command": "npm", "args": ["run", "build"] }
    ]
  }
}
```

The default configuration runs no verification command. Configure commands
that are appropriate and safe for the current repository.

Advisor routing can be switched for comparison or compatibility:

```json
{
  "routing": {
    "advisorMode": "conditional"
  }
}
```

`conditional` is the default, `always` restores always-on architect invocation,
and `never` disables the architect checkpoint. Relay10
records invocation counts but does not currently observe provider tokens or
billed currency, so these modes must not be described as a measured percentage
cost saving without an external evaluation.

Live Reader-10 can use the discovered economy-labelled model or supplied model
slugs:

```json
{
  "readerGate": {
    "mode": "live",
    "models": ["small-model-a", "small-model-b"],
    "minPass": 9,
    "maxRounds": 2,
    "concurrency": 3
  }
}
```

## Version 0.1 limits

- Skill hosts (Codex, Claude Code, Grok Build) are supported. Optional `r10
  run` model stages in 0.1.1 still use Codex CLI; direct OpenAI / xAI /
  Anthropic / Gemini API stage adapters are not included, and providers
  cannot be mixed inside one `r10 run`. Grok skill-host support is separate
  from xAI stage execution.
- There is no MCP server, Apps SDK UI, or standalone GUI. Skills/plugins cover
  Codex and Claude Code, with Grok discovery via `.agents/skills`.
- The scout is a general read/search Codex stage, not a dedicated crawler,
  browser automation system, or site-specific extraction engine.
- Deterministic Reader-10 checks structure, length, terminology, links, and
  accessibility signals. It does not semantically understand the report.
- Live Reader-10 uses ten model invocations per round. Model names do not imply
  independent errors, and live readers check clarity rather than truth.
- There is no resume/checkpoint engine, `/goal` DSL, long-running scheduler, or
  durable workflow database.
- The only evidence-time checkpoint is the architect decision after scout.
  There is no mid-maker pause/resume advisor loop or automatic escalation after
  a failed stage.
- Runtime model routing uses catalog descriptions, priority, supported efforts,
  overrides, and the scout's open-question count; it does not query live prices
  or benchmark model quality.
- Verification commands are explicit opt-in configuration. No project command
  is inferred or run by default.
- Saved artifacts support inspection and model-free report regeneration, but
  they are not a complete frozen ledger of the machine, tools, or model service.

## Design and research

- [Architecture](https://github.com/minwoo19930301/relay10/blob/main/docs/architecture.md)
- [Harness trade-offs, selected patterns, provider and app portability](https://github.com/minwoo19930301/relay10/blob/main/docs/lineage-and-portability.md)
- [Korean harness landscape](https://github.com/minwoo19930301/relay10/blob/main/docs/korea-landscape.md)
- [Global harness landscape](https://github.com/minwoo19930301/relay10/blob/main/docs/global-landscape.md)
- [Top global repositories and distilled patterns](https://github.com/minwoo19930301/relay10/blob/main/docs/global-top-repos.md)
- [Conditional advisor evidence and routing decision](https://github.com/minwoo19930301/relay10/blob/main/docs/conditional-advisor-routing.md)
- [Clean-room prior art ledger](https://github.com/minwoo19930301/relay10/blob/main/docs/prior-art.md)
- [30/60/90 development and promotion playbook](https://github.com/minwoo19930301/relay10/blob/main/docs/growth-playbook.md)
- [Launch report](https://github.com/minwoo19930301/relay10/blob/main/docs/launch-report.html)

The latest research snapshot is dated 2026-07-14. Stars and project status change;
follow the linked primary sources before making adoption or licensing choices.

## Contributing and feedback

Use the repository issue forms for reproducible bugs, bounded use cases, and
Skill proposals. Each proposal asks for observable acceptance evidence and
clean-room provenance so the core does not grow from feature count alone. See
[CONTRIBUTING.md](https://github.com/minwoo19930301/relay10/blob/main/CONTRIBUTING.md)
for the development and review gates.

## License

Relay10 is MIT licensed and was implemented as a clean-room wrapper with zero
third-party npm runtime dependencies. No source code from the compared
harnesses is included.

The design selection is intentionally narrow. From the Korean projects it keeps
role-specific model tiers, plan/build/review separation, doctor and inspectable
evidence, an external wrapper boundary, and short onboarding. From global
projects it keeps on-demand skills, read-only plan roles, checkpoint and success
gates, architect/editor separation, stateless transcripts, provider/worker
ports, and independent review. It excludes swarms, nested completion loops,
always-on daemons, databases, vector memory, schedulers, native TUI/GUI stacks,
global injection, and telemetry from the core. Relay10's
risk/verifiability/reversibility router, separation of correctness from clarity,
hash-bound frozen replay, and Reader-10 gate are its own additions.
