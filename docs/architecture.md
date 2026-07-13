# Relay10 architecture

Relay10 is a thin subprocess harness around the installed Codex CLI, built with
zero third-party npm runtime dependencies. It does not replace the agent
runtime, provide a second terminal interface, or maintain a hidden memory
database. A run writes inspectable artifacts beneath `.relay10/runs/<id>/`.

```text
request
  -> deterministic initial task assessment
  -> scout      catalog economy label / low / read-only
  -> architect  catalog frontier label / max / read-only
  -> maker      catalog balanced label / medium / workspace-write
  -> commands   only explicitly configured argv commands
  -> reviewer   model judgment / read-only
  -> explainer  plain-language summary / read-only
  -> Reader-10  structural rules by default, ten live calls per round on request
  -> self-contained HTML report
```

## Initial routing, not adaptive escalation

Task difficulty alone is a poor proxy for a suitable role. Relay10 records five
scores from 0 to 3:

- `complexity`: expected synthesis or decomposition;
- `risk`: security, privacy, money, or production sensitivity;
- `blastRadius`: impact if the result is wrong;
- `verifiability`: availability of schemas, tests, and objective checks;
- `reversibility`: expected ease of undoing the action.

The router uses these values to build the stage plan before execution. In
version 0.1, a test failure or model failure does not dynamically select a new
model tier. Failures are recorded and can stop or fail a run; adaptive retry and
escalation policy are future work.

## Model labels come from metadata

Relay10 reads `codex debug models` and maps visible entries to `frontier`,
`balanced`, and `economy` using catalog descriptions, priority, supported
efforts, and user overrides. These labels are routing hints. Relay10 does not
measure current token price, latency, benchmark performance, or relative
intelligence, so `economy` does not mean provably cheapest or weakest and
`frontier` does not mean provably best for every task.

## Correctness signals and clarity signals

The pipeline keeps three different kinds of signal separate:

1. Verification commands record exit codes and bounded output. Commands run
   only when the user explicitly configures `{ "command", "args" }` entries;
   the default list is empty.
2. The reviewer is a model judgment over the plan, changes, and available
   command results. It is not a formal proof.
3. Reader-10 evaluates report presentation. It does not replace tests or the
   reviewer.

Deterministic Reader-10 is a reproducible set of structural heuristics covering
headings, length, terminology, links, action cues, and HTML accessibility. It
does not semantically understand the report. Live Reader-10 schedules ten
separate reader-model invocations per round. Those invocations may reuse one
model or related models, so their errors are not guaranteed to be independent.
The configured invocation limit counts Relay10 subprocess launches, not hidden
provider turns, tokens, or monetary cost.

## Artifact contract

A completed run contains an artifact hash map in `run.json` and can contain:

- `run.json`: task, route, selected model metadata, timestamps, gate results,
  artifact hashes, and status;
- `scout.json`, `architect.md`, `maker.md`, `reviewer.json`, and `summary.md`;
- `verification.json`: configured command argv, exit codes, durations, bounded
  logs, and truncation indicators;
- `readers.json`: persona results and the aggregate Reader-10 decision;
- `report.html`: standalone HTML with no external JavaScript and a strict CSP;
- `events.jsonl`: stage events.

The list is an execution-artifact contract, not a complete audit ledger. A
completed run hashes its files so `replay --frozen` can reject missing or
changed artifacts and copy the already-saved report without model calls.
`r10 report` is the separate model-free re-render path and never overwrites the
frozen report. Neither command resumes a run or recreates its original machine,
toolchain, hooks, credentials, or remote model service.

## Process and safety boundary

Scout, architect, reviewer, explainer, and reader stages request read-only Codex
sandboxing. The maker requests workspace-write. Verification uses literal argv
without a shell, captures bounded output, and terminates the spawned process
group on POSIX timeout. Users must still choose verification executables they
trust.

Relay10 prompts do not authorize Git push, deployment, merge, purchase, or
other external publication. The effective boundary also depends on the local
Codex installation, configuration, hooks, MCP servers, credentials, and
operating system; Relay10 cannot independently constrain capabilities supplied
outside its subprocess arguments.

## Version 0.1 omissions

- Scout is not a dedicated crawler or browser-automation engine.
- There is no resume/checkpoint engine, `/goal` DSL, workflow scheduler, or
  durable state database.
- Routing does not automatically escalate after observed failures.
- Model roles do not use live price or benchmark data.
- Deterministic Reader-10 is structural rather than semantic.
- Live Reader-10 costs ten model invocations per round and does not guarantee
  model diversity.
- Verification is explicit opt-in; Relay10 does not infer safe project commands.
- Run artifacts do not snapshot the entire machine, toolchain, or remote model
  service.
