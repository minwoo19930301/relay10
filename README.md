# Relay10

> Route explicitly. Keep handoffs inspectable. Separate correctness signals
> from report clarity.

Relay10 is a small Codex harness with zero third-party npm runtime
dependencies. It maps the local Codex model catalog into three capability
labels, records stage handoffs as files, keeps command and reviewer results
separate from report-clarity checks, and renders a standalone HTML run report.

This is an early `0.1.1` release. The `frontier`, `balanced`, and
`economy` labels come from catalog metadata and user overrides. They are not
live price measurements, benchmarks, or guarantees that Relay10 selected the
cheapest, weakest, or strongest available model.

## What it does

- **Deterministic initial routing:** five task dimensions select stage profiles
  before a run starts. Version 0.1 does not automatically escalate a failed
  stage to another model.
- **Small execution surface:** one Node CLI, built-in Node modules, and the
  installed Codex CLI.
- **Inspectable handoffs:** each completed stage has a declared role, effort,
  sandbox, output path, and event record.
- **Separate signals:** explicitly configured commands, a model reviewer, and
  Reader-10 results are shown separately instead of being presented as one
  proof of correctness.
- **Two Reader-10 modes:** the default deterministic mode checks document
  structure and accessibility heuristics. Live mode makes ten reader-model
  invocations per round; neither mode establishes factual correctness.

## Quick start

Requirements: Node 20+ and an authenticated Codex CLI.

```bash
git clone https://github.com/minwoo19930301/relay10.git
cd relay10
npm link

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

Relay10 0.1.1 is a **Codex CLI runtime harness**, not a direct
multi-provider API client.

| Target | Current status | What that means |
|---|---|---|
| Codex CLI with the locally discovered OpenAI models | Supported and tested | This is the release path. Every model stage launches `codex exec`, and model discovery uses `codex debug models`. |
| Codex with an xAI/Grok custom provider | Experimental candidate, untested | Codex and xAI both expose a Responses-compatible path, but Relay10 cannot select providers per stage and has not completed end-to-end tool, schema, search, or Reader-10 tests. Do not treat this as released Grok support. |
| Anthropic/Claude or Google Gemini APIs as stage executors | Unsupported | Their native APIs and current OpenAI-compatibility surfaces need provider-specific executors or a verified translation layer plus an agent tool runtime. |
| Claude Code as a Skill and Plugin host | Preview on `main`, verified locally | The `.claude/skills` symlink, `.claude-plugin` plugin manifest, and repository marketplace let Claude Code load the eight skills and invoke the `r10` CLI. Every Relay10 model stage still launches Codex CLI subprocesses; Claude Code does not become a stage executor. |
| Mixed providers in one run | Unsupported | Stage configuration contains a model, not a provider or profile. |
| Codex desktop app or IDE | Indirect shell use only | A task can invoke `r10`, but Relay10 then starts separate Codex CLI subprocesses. There is no native progress UI or current-task model switching. |
| ChatGPT app/web or a standalone GUI | Not implemented | These need a remote MCP/Apps SDK backend or a local sidecar/App Server client. |

The repo-scoped Skills make the existing commands easier to invoke from the
Codex and Claude Code apps, but a Skill by itself does not switch the current
app task's model for every Relay10 stage. The current `main` branch includes an
eight-Skill pack plus Codex and Claude Code plugin bundles as a preview; the
immutable `v0.1.1` tag does not. The preview has no MCP server or custom UI, so
native progress and stage execution still use the existing CLI. See the full
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
exposes the same skills to Codex and Claude Code surfaces that support
repository skills. The plugin manifests are at
`plugins/relay10/.codex-plugin/plugin.json` and
`plugins/relay10/.claude-plugin/plugin.json`, and the repository root
`.claude-plugin/marketplace.json` makes this repository installable as a Claude
Code marketplace; all three pass their local validators but have not been
published to a curated marketplace. To install the pack in Claude Code:

```text
/plugin marketplace add minwoo19930301/relay10
/plugin install relay10@relay10
```

Installed plugin skills appear namespaced as `relay10:<skill-name>`; a session
opened inside a clone of this repository loads the same skills through
`.claude/skills` without installing anything. Skills guide the host agent and
can call the `r10` CLI, which still requires an authenticated Codex CLI for
model stages. The pack follows progressive disclosure and contains original
clean-room text. The Skill-ecosystem source subset and license cautions are
recorded in `plugins/relay10/provenance/sources.json`; the complete agent,
harness, workflow, and Skill lineage is recorded in `docs/prior-art.md`.

## Default pipeline

| Stage | Capability label | Effort | Access | Purpose |
|---|---|---:|---|---|
| scout | economy | low | read-only + optional search | inspect sources and collect context |
| architect | frontier | max | read-only | produce a plan |
| maker | balanced | medium | workspace-write | implement the plan |
| verification | no model | n/a | explicit argv commands | record opt-in command results |
| reviewer | frontier | high | read-only | review correctness and risk |
| explainer | balanced | low | read-only | write a newcomer-facing summary |
| Reader-10 | rules or configured model | low | read-only | check report structure or model-reported clarity |

These are role defaults, not a claim that one role always receives the
objectively best or cheapest model. The available catalog metadata and local
overrides determine the concrete model and supported effort.

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

- The verified runtime is Codex CLI. Direct OpenAI, xAI/Grok, Anthropic/Claude,
  and Gemini API adapters are not included, and providers cannot be mixed by
  stage.
- Codex desktop can invoke the CLI indirectly, but there is no Relay10 Skill,
  Plugin, MCP server, Apps SDK UI, or standalone GUI in the immutable v0.1.1
  release. Current `main` has a Skill/Plugin preview for Codex and Claude Code,
  without MCP or a custom UI.
- The scout is a general read/search Codex stage, not a dedicated crawler,
  browser automation system, or site-specific extraction engine.
- Deterministic Reader-10 checks structure, length, terminology, links, and
  accessibility signals. It does not semantically understand the report.
- Live Reader-10 uses ten model invocations per round. Model names do not imply
  independent errors, and live readers check clarity rather than truth.
- There is no resume/checkpoint engine, `/goal` DSL, long-running scheduler, or
  durable workflow database.
- Runtime model routing uses catalog descriptions, priority, supported efforts,
  and overrides; it does not query live prices or benchmark model quality.
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
