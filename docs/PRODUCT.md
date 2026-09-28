# Product

AXIS is local-first human-performance execution software built around what actually happened.

It is not defined by a camera, dashboard, AI model, training plan or cloud account. Those are capabilities. The durable product contract is:

> Turn intent into executable activity, preserve performed reality as factual history, attach evidence to the exact encounter, and reduce the amount of management required to keep performance work useful.

The long-range program is defined in [`PRODUCT_PROGRAM.md`](PRODUCT_PROGRAM.md). Current capability status is defined in [`CAPABILITY_MANIFEST.md`](CAPABILITY_MANIFEST.md). Release truth remains governed by `governance/project-state.json` and `CURRENT_RELEASE.md`.

## Current product shape

The current AXIS product already contains the foundations of five durable layers:

```text
Object
  ↓
Protocol / Flow
  ↓
Runtime
  ↓
Encounter + Evidence
  ↓
Evolution
```

### Object

Objects describe reusable practice/activity and the metrics that make sense for that activity. The recording system is not limited to one strength or cardio form: current metric/execution infrastructure supports schema-driven recording and multiple execution modes.

### Protocol / Flow

Flow represents intended continuity over Objects. Effective metrics and execution behavior can be resolved with explicit provenance so a temporary Flow override does not silently become the permanent Object definition.

### Runtime

Active execution owns the live session state: start, pause/resume/rest, adjustment, completion and continuation. The runtime must follow performed reality rather than force the user to satisfy an obsolete plan.

### Encounter + Evidence

Actual performed activity is preserved as factual history. Media and other evidence belong to exact factual encounters; a missing artifact must remain an explicit no-evidence state rather than borrow evidence from another occurrence.

### Evolution

Trends, Replay and reporting reveal longitudinal change from recorded history. Evolution may support interpretation and future decisions but may not manufacture a second factual history.

## North-star chain

AXIS is converging around:

```text
Intent → Execution → Encounter → Evidence → Evolution
```

For organizations this can extend to:

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

Intent and performed reality are different facts. They must remain different facts even when they disagree.

## Principles

### Reality is authoritative

Actual action is the source of truth. Suggestions, Protocols and projections are intent; they do not overwrite what happened.

An early finish is a valid Session. A manually chosen Object is valid. An equipment substitution is a factual deviation, not a reason to rewrite history. A gap in training is data, not a failure state.

### Local first

Core execution must remain available without sign-in, connectivity or AI. Network services may synchronize or enrich state, but may not own the ability to record, continue or finish core work.

### Interaction should decay

Repeated use should remove work from the participant. Known equipment, values, structures and preferences should be reused when confidence is sufficient.

A durable internal metric is **interaction cost per completed useful session**. Over time that cost should fall rather than grow.

### One action, one owner

Duplicate factual state, duplicate controls and delayed cleanup are product defects. If a new owner replaces an old one, retirement is part of the same change.

### Evidence before interpretation

Prefer concrete records, source-labelled observations and behavior shapes over opaque scores, motivational copy or speculative health/recovery claims.

### AI handles ambiguity, not authority

AI is appropriate for fuzzy input such as recognition, natural-language constraint extraction, summarization and bounded recommendations.

AI may not fabricate completed work, silently rewrite Encounter history, silently mutate authoritative Protocol intent, infer injury/diagnosis without an appropriate product/legal basis, or override an explicit human decision.

Product state distinguishes:

```text
Observed → Inferred → Recommended → Decided
```

These layers may inform one another but may not be collapsed into a single model-generated truth.

### Fail open

Optional capability failure must degrade to a usable path:

- visual recognition → local memory/manual selection;
- cloud → local facts;
- model insight → deterministic evidence/history;
- speech → available non-speech or system path;
- uncertain recommendation → no forced recommendation;
- missing media → explicit no-evidence state.

### Small outside, rigorous inside

The visible Participant product should remain restrained even as the internal system becomes more capable. More settings, cards, dashboards and explanatory text are not evidence of a better system.

### Geometry is product state

A bad intermediate frame is a product defect. Empty residual geometry, state-dependent layout jumps and duplicate transient controls must be treated as correctness failures, not merely visual polish.

## Product shells

### Participant

The existing quiet execution surface remains the primary individual experience: Today, recording, Active execution, History, Evidence, Trends/Evolution and deliberately bounded settings.

### Workspace

A future coach/organization shell will own people, Protocols, assignments, exceptions, review, Evidence workflows, decisions and audit history. It must remain separate from the Participant execution UI while sharing the same domain truth.

## Intelligence direction

AXIS should not compete primarily as a generic AI fitness coach. The stronger role is the trustworthy execution/evidence layer that AI, coaches, participants, devices and organizational systems can build decisions on top of.

A future recommendation may propose a change, but authoritative mutation should retain a decision record containing the proposal, evidence/state basis and explicit accept/modify/reject outcome.

## Platform direction

The long-term architectural form is a platform-neutral domain runtime surrounded by adapters:

```text
product shells
     ↓
events → reducer → state → projection → decisions
     ↓
storage / sync / AI / media / OS adapters
```

Migration remains incremental. Current working owners are not replaced in a big-bang rewrite.

## Commercial direction

The most credible sequence is:

1. coaches/studios and small performance organizations where prescribed-versus-performed execution is a daily operational problem;
2. larger performance organizations where AXIS acts as the last-mile execution/evidence layer and integrates with established management systems;
3. AXIS Runtime/API/SDK for third-party and OEM use;
4. enterprise identity, policy, integration and support capabilities once real organizational workflows justify them.

Enterprise scope and claim boundaries are defined in [`ENTERPRISE_BOUNDARIES.md`](ENTERPRISE_BOUNDARIES.md).

## Product boundaries

AXIS should not drift into:

- a mandatory planner that treats the plan as reality;
- a social feed;
- streak/XP-centered gamification;
- a generic AI coach chat surface;
- opaque readiness/recovery scores presented as fact;
- a giant content-library competition;
- a cloud-dependent workout client;
- a medical diagnosis product;
- a second unrelated product that owns training navigation;
- a simultaneous rewrite across every platform.

A new capability requires a direct relationship to execution continuity, recording friction, factual evidence, longitudinal evolution, organizational review or an explicitly isolated optional channel.

## Definition of progress

AXIS is improving when one or more of these move in the right direction without weakening factual integrity:

- fewer user interactions for the same useful completed Session;
- fewer authoritative owners;
- less historical source/build indirection;
- more domain logic testable without a browser;
- stronger provenance and deterministic replay;
- clearer separation of intent, reality, inference and decision;
- better portability through explicit contracts;
- smaller blast radius when AI/cloud/providers fail;
- measurable reduction in organizational review and data-reconstruction work.

The target is not a larger app. It is a simpler visible product sitting on top of a more trustworthy execution system.
