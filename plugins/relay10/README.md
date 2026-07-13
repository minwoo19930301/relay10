# Relay10 Codex Plugin

This preview bundles eight focused, on-demand skills:

- `relay10-orchestrate`: choose the smallest safe workflow;
- `relay10-research`: gather current read-only evidence;
- `relay10-spec`: define an executable change specification;
- `relay10-build`: implement an authorized change in small slices;
- `relay10-debug`: isolate a root cause before repair;
- `relay10-review`: review a fixed baseline without editing;
- `relay10-release`: produce release and artifact proof;
- `relay10-skill-lab`: test triggers and compare a skill with its baseline.

The pack follows the Agent Skills layout and Codex Plugin manifest conventions. It can guide work in Codex and call an installed `r10` CLI, but it does not switch the model of the current Codex task, add a provider, or provide a native app UI or MCP server.

All skill text and scripts are clean-room Relay10 work. `provenance/sources.json`
records the Skill-ecosystem source subset; `../../docs/prior-art.md` records the
complete lineage. See `THIRD_PARTY_NOTICES.md` for the licensing boundary.
