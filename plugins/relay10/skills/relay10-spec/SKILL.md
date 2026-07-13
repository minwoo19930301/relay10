---
name: relay10-spec
description: Turn an ambiguous or high-impact change request into a small executable specification. Use when scope, trade-offs, acceptance checks, or rollback are unclear; do not use to delay a narrow reversible edit.
---

# Relay10 Spec

Design the smallest change that can prove the requested outcome.

## Build the specification

1. Inspect the existing behavior, conventions, tests, and user-owned changes.
2. State the user outcome in one sentence.
3. List non-goals and constraints, including provider, app, platform, and licensing boundaries.
4. Describe two alternatives only when the choice materially affects scope or risk.
5. Select one approach and explain the rejected alternative briefly.
6. Define observable acceptance criteria before listing implementation files.
7. Add a verification plan, rollback path, and unresolved questions.

Ask only questions whose answers would materially change the result. Otherwise state the assumption and continue.

## Risk routing

Assess each dimension from low to high:

- complexity;
- blast radius;
- security or data sensitivity;
- verification difficulty;
- irreversibility.

Use stronger planning and review only where these dimensions justify it. A small, reversible, well-tested edit should stay small.

## Output contract

Produce:

- outcome and user-visible behavior;
- current-state evidence;
- non-goals and constraints;
- chosen design and key interfaces;
- file-level implementation map;
- acceptance tests;
- risks, rollback, and follow-ups.

For plan-only requests, stop after the specification. Do not implement or publish.
