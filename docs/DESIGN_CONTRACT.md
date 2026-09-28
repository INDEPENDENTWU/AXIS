# AXIS Design Contract

AXIS design is not a decorative layer over domain state. Critical interface geometry, state visibility, motion and hierarchy are part of product correctness.

This contract guides future UI work and the convergence of historical presentation code.

## 1. Design objective

AXIS should feel smaller than the system behind it.

The interface should expose the minimum information and controls necessary to understand the current state, perform the next meaningful action, and inspect evidence when requested. Additional intelligence should reduce ambiguity and repeated input rather than create more permanent cards, dashboards and settings.

## 2. Semantic components

New UI work should be described by semantic responsibility rather than historical selector names.

Canonical semantic primitives are:

- `PrimaryAction` — the single dominant action in the current state;
- `SecondaryAction` — useful but non-dominant action;
- `SessionState` — current execution state such as running, paused, resting, complete;
- `SecondaryState` — subordinate factual status such as rest elapsed time;
- `ElapsedTime` — factual duration owned by its domain source;
- `MetricField` — one schema-defined observation/control;
- `EvidenceArtifact` — a source-linked piece of factual evidence;
- `ReviewSurface` — inspection or confirmation without becoming a second writer;
- `DecisionSurface` — explicit accept/modify/reject authority;
- `SystemNotice` — failure/degraded-mode information that does not masquerade as product content.

Selectors may change. These responsibilities should not.

## 3. Geometry is product state

A layout is wrong if a state transition causes unrelated controls to move unexpectedly, leaves empty residual geometry, reveals a transient duplicate control, or becomes correct only after a timeout.

Critical transitions must have measurable geometry contracts. Examples include:

```text
running → paused
paused → running
active → plan-complete
capture → review
review field expansion → save
online → offline
AI available → unavailable
media present → absent
normal motion → reduced motion
```

For each critical transition, tests should capture the positions and sizes of anchors that are expected to remain stable and enforce a small explicit tolerance.

A hidden or empty semantic component must contribute zero unintended geometry unless reserved space is itself an explicit state contract.

## 4. State hierarchy

A state should not be represented multiple times merely because different implementation layers can render it.

For example, a paused/resting state should not simultaneously appear as a primary state label, a decorative pill, a separate empty placeholder and a second timer unless each surface has a distinct product responsibility.

The hierarchy is:

1. current factual state;
2. primary action;
3. necessary secondary state/action;
4. details on demand.

## 5. Primary action rule

Each actionable screen should have a clear primary action. Multiple visually equivalent primary buttons are a defect unless the product is intentionally presenting a choice with equal authority.

The primary action should remain spatially predictable across adjacent states when practical. State transitions should change meaning before they change geometry.

## 6. Information density

Prefer progressive disclosure over permanent explanation.

Do not add a card because a capability exists. Do not add instructional copy when state, labels or interaction can make the behavior self-evident. Do not expose diagnostics or reason codes as compulsory user-facing prose; keep them available for tests, support and advanced inspection.

## 7. Typography

Typography must preserve hierarchy, numeric legibility and multilingual layout integrity.

Requirements:

- tabular numerals for timers and rapidly changing numeric values where alignment matters;
- stable line-height across state changes;
- no clipping or wrapping that moves primary controls on supported mobile widths;
- Chinese and English strings must be treated as first-class layouts rather than translated afterthoughts;
- units remain visually subordinate to values while still readable;
- status emphasis is weaker than primary action emphasis unless the status requires immediate safety/attention.

## 8. Motion

Motion may communicate continuity but may not hide correctness.

Rules:

- no state relies on animation completion to become valid;
- no decorative entrance animation for high-frequency factual updates such as timers;
- reduced-motion mode must preserve information and interaction order;
- movement should be small and purposeful, especially during active execution;
- spring/bounce effects require a functional reason and must not make controls feel unstable.

## 9. Empty, loading and degraded states

An optional capability that is unavailable should fail to a usable deterministic state.

Examples:

- AI unavailable → deterministic/manual path remains;
- cloud unavailable → local facts remain available;
- media missing → explicit no-evidence state, never another Encounter's media;
- recognition uncertain → candidate/manual selection, never fabricated certainty;
- empty optional component → no unexplained frame, badge or reserved gap.

## 10. Accessibility and input

Critical actions should remain usable with touch, keyboard where relevant, and platform accessibility semantics.

Requirements include:

- touch targets sized for real mobile use;
- visible focus for keyboard-capable surfaces;
- semantic labels that do not depend solely on icon shape;
- no color-only distinction for factual state;
- predictable long-press behavior with explicit feedback where long-press is the authoritative interaction;
- no accidental gesture ownership conflict between scrolling and execution controls.

## 11. Localization and units

Product strings should come from semantic message keys rather than being duplicated across historical modules.

The system must support locale-safe formatting for:

- dates/times;
- decimal separators;
- measurement units;
- pluralization/count labels;
- activity and metric labels.

Localization must not change factual storage identity. A metric such as `weight` remains the same domain metric even when the displayed label/unit changes.

## 12. Participant versus Workspace visual language

Participant remains execution-first and intentionally quiet.

Workspace may support denser tables, filters, review queues and audit detail because its job is administration and analysis. It must not force that density into Participant.

Both shells should share semantic state and evidence language so that `Protocol`, `Encounter`, `Evidence`, `Deviation` and `Decision` mean the same thing everywhere.

## 13. Review checklist

A visual change is not complete until it answers:

- What semantic state or action does this represent?
- Who owns the underlying fact/action?
- Does it create a duplicate owner or duplicate representation?
- What happens when the value is empty?
- What happens on 390px-class iPhone-like WebKit?
- What happens in English and Chinese?
- What happens with reduced motion?
- Which surrounding anchors are allowed to move, and by how much?
- Does failure leave a usable path?
- Can the behavior be expressed as a deterministic browser assertion?

The purpose of this contract is not to freeze visual style. It is to make visual refinement safer because the product semantics and geometry expectations are explicit.
