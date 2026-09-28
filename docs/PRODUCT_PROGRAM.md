# AXIS Product Program

## Purpose

This document is the long-range product and engineering program for AXIS. It does not replace release truth in `governance/project-state.json` or `docs/CURRENT_RELEASE.md`. It defines what AXIS is becoming, what must remain true while it evolves, and the order in which the work should be carried out.

## North star

AXIS is evolving from a local-first training product into **human-performance execution and evidence infrastructure**.

The product is built around one chain:

```text
Intent → Execution → Encounter → Evidence → Evolution
```

The commercial form may later include a participant product, coach/organization workspace, APIs and a runtime SDK, but all of those surfaces must share the same factual domain model.

AXIS should not compete by becoming another generic AI coach. Its differentiated job is to preserve execution truth: what was intended, what actually happened, what evidence exists, what changed, and what a human or bounded intelligence proposes next.

## Product model

### Object

An Object describes something that can be performed. It owns stable identity and the recording/execution capabilities that make sense for that activity.

### Protocol / Flow

A Protocol describes intended execution. Flow remains the current foundation and evolves toward portable protocol definitions with explicit steps, constraints, overrides, substitutions, priorities and completion rules.

### Runtime

Runtime turns intent into a live, low-friction execution experience. It must respond to reality without rewriting history or forcing the user to obey a plan that no longer fits.

### Encounter

An Encounter freezes what actually happened. It is factual history, not a recommendation and not an inferred idealized session.

### Evidence

Evidence anchors observations to an exact Encounter. Evidence may come from user input, camera/media, a device, a machine or an import. Its source and provenance must remain explicit.

### Evolution

Evolution derives longitudinal understanding from factual Encounters and Evidence. It may reveal change and support decisions, but it may not manufacture an opaque score and call it fact.

## Product shells

AXIS should keep execution and administration separate.

**Participant** is the quiet mobile execution shell. It should remain fast, local-first and focused on doing, recording, continuing and finishing.

**Workspace** is the future coach/organization shell. It may contain people, protocols, assignments, exceptions, evidence review, outcomes and audit history. Workspace complexity must not leak into Participant.

Both shells must use the same domain contracts rather than duplicate truth.

## Intelligence contract

AXIS intelligence is divided into four layers:

```text
Observed     factual input or recorded behavior
Inferred     a bounded interpretation of evidence
Recommended  a proposal for what to do next
Decided      an explicit authoritative human/product decision
```

These layers must not collapse into one another. AI may help normalize ambiguous input, identify candidates, summarize evidence and produce recommendations. AI may not silently fabricate completed work, rewrite Encounter history, or become the authoritative writer of a Protocol change.

An authoritative recommendation workflow should preserve at least:

- recommendation identity;
- input/state fingerprint;
- model/provider/version where applicable;
- reason codes or evidence references;
- confidence or uncertainty when meaningful;
- proposed change;
- human accept/modify/reject decision;
- resulting Protocol version.

## Commercial sequence

The first business surface should be **coach/studio performance operations**, where the gap between prescribed work and actual execution is concrete and frequent.

The second surface should be **performance organizations**, with AXIS positioned as the execution/evidence layer rather than another analytics dashboard.

The long-term platform surface is **AXIS Runtime / API / SDK**, allowing third parties to define Objects and Protocols while AXIS handles execution, recording, continuity, evidence, replay and deterministic state.

Consumer subscription can remain a product line, but it is not the only or highest-ceiling commercial model.

## Enterprise value chain

The target organizational chain is:

```text
Protocol
  ↓
Assignment
  ↓
Execution
  ↓
Encounter
  ↓
Observation
  ↓
Evidence
  ↓
Deviation
  ↓
Outcome
  ↓
Recommendation
  ↓
Human Decision
  ↓
Next Protocol Version
```

The system must preserve both intent and reality. A prescribed `3 × 10 × 40 kg` and a performed `8 / 8 / 6 × 37.5 kg` are different facts and must never be collapsed into one convenient record.

## Durable design rules

1. **Reality is authoritative.** Actual behavior is never rewritten to match a plan.
2. **Local first.** Core execution remains usable without an account, network or model.
3. **One action, one owner.** A semantic action cannot have competing factual writers.
4. **Evidence before interpretation.** Factual observations and interpretation remain distinct.
5. **AI handles ambiguity, not authority.** Model output is advisory until an authoritative decision accepts it.
6. **Quiet interfaces.** Intelligence should reduce ambiguity and interaction cost rather than add dashboards and configuration.
7. **Geometry is product state.** Unexpected layout shifts, empty residual geometry and delayed correction are product defects.
8. **Fail open.** Optional AI, cloud, media or speech failures must preserve a usable path.
9. **Portability through contracts.** New platforms reuse domain contracts rather than fork truth.
10. **Compatibility protects history.** Existing user data is not collateral damage of source cleanup.

## Program stages

### Stage 01 — Release Integrity & Program Foundation

Establish a trustworthy baseline before adding another product slice. Resolve or explicitly hold any incomplete Production certification, converge product documentation, create a capability manifest and make this program repository-authoritative.

### Stage 02 — Capability & Source Convergence

Reduce historical version-shaped ownership. Map every critical capability to a current owner, move tests toward permanent capability contracts, and make the build chain shorter over time.

### Stage 03 — Semantic Design System

Define semantic UI primitives and state geometry. Running, paused, resting, complete, review, saving, offline and optional-capability failure become explicit state contracts rather than CSS accidents.

### Stage 04 — Platform-neutral Domain Runtime

Extract deterministic domain decisions from DOM, localStorage and platform APIs using strangler migration. Begin with continuation and remaining-route decisions.

### Stage 05 — Event Journal & Provenance

Introduce append-only event lineage for new runtime actions. Add explicit evidence provenance and deterministic replay while compatibility snapshots remain until reconstruction is proven.

### Stage 06 — Protocol Runtime

Evolve Flow into a portable protocol system with intent, execution modes, constraints, bounded substitutions, priority and completion rules. Intent remains separate from performed reality.

### Stage 07 — Evidence & Evolution Graph

Connect Person/Goal/Capability/Object/Protocol/Encounter/Observation/Evidence/Outcome without inventing a second truth. Make longitudinal review evidence-aware and source-aware.

### Stage 08 — Sync, Identity & Portability

Productize optional identity and durable cross-device sync. The network remains a convergence layer, never the live workout owner. Define export and deletion lifecycle.

### Stage 09 — Workspace & Enterprise Foundation

Add Organization, tenancy, roles, protocol assignment, review workflow, audit events and administration in a separate Workspace shell.

### Stage 10 — Bounded Intelligence

Add auditable proposal agents over factual state. Recommendations remain reviewable; protocol changes require explicit authority.

### Stage 11 — API, SDK & Open-source Runtime

Stabilize Object, Protocol, Runtime, Encounter and Evidence contracts as an integration surface. Provide reference schemas, SDK behavior and deterministic fixtures suitable for third-party use.

### Stage 12 — Pilots, Security, Compliance & Scale

Validate the system with real coaches/studios and performance organizations before broad scaling. Use pilot evidence to prioritize integrations, security hardening, retention controls, SSO/SCIM and operational SLOs.

## Stage gates

No stage is complete because files exist or a UI renders. A stage closes only when its factual owner, migration path, tests, failure behavior, documentation and release evidence agree.

Product changes must distinguish:

- implemented;
- locally verified;
- CI verified;
- merged;
- deployed;
- Production-certified;
- real-device accepted.

Those states are not interchangeable.

## CI and release discipline

AXIS keeps exact-SHA release evidence and cross-engine verification. During the current constrained Actions period, development should use an Actions-sparing sequence:

```text
static inspection
→ local/deterministic contracts
→ batched branch changes
→ one candidate PR
→ required Chromium/WebKit gates
→ exact merged-main Production certification
```

Repeated CI runs are not a substitute for understanding a failing contract.

## Explicit non-goals

AXIS is not being optimized toward a social feed, streak/XP game, generic AI chat surface, opaque recovery score, mandatory cloud client, medical diagnosis product, giant content library, or a simultaneous rewrite across web/iOS/Android/desktop.

Features outside the execution/evidence/evolution chain require a concrete reason to exist.

## Program-level success measures

Useful measures include:

- interaction cost per completed useful session;
- protocol-to-execution variance capture;
- evidence coverage and provenance completeness;
- manual entry and review time;
- continuation success after interruption;
- recommendation accept/modify/reject rate;
- data completeness without forced input;
- number of authoritative owners and historical transforms;
- deterministic replay/restore coverage;
- organizational time-to-review.

The program is succeeding when the visible product becomes simpler while its factual model, portability and organizational usefulness become stronger.
