# Roadmap

This is a product and architecture roadmap, not a feature backlog.

## Current baseline — 8.12

8.12 is the compatibility baseline for the next cycle. Existing training, recording, media, State Field, Vision, cloud/AI foundations and Language Studio remain supported.

The next cycle does not expand the Language Studio corpus or add another top-level product area.

## 8.13 · Runtime

Goal: make the remaining workout adapt to real conditions without turning AXIS into a planner or chat coach.

### Stage 0 — freeze and characterize 8.12

- Keep current training owners unchanged.
- Capture deterministic fixtures for representative session/history states.
- Document existing owner boundaries and storage contracts.
- Add regression cases for refresh, reopen, incomplete sets, early finish and offline operation.

Exit condition: current behavior can be reproduced and tested without relying on screenshots alone.

### Stage 1 — pure runtime core

Add a UI-independent module that receives normalized state/context and emits a remaining-workout projection.

Initial inputs:

- current session;
- completed work;
- recent history;
- user goal when known;
- remaining time / leave time;
- current exercise;
- temporary constraints.

Initial outputs:

- current;
- next;
- small set of alternatives;
- remaining route;
- dropped work;
- reason codes.

No production writes in this stage.

Exit condition: deterministic unit/property tests cover identical-input reproducibility and illegal-state prevention.

### Stage 2 — shadow runtime

Feed real current-state snapshots into the runtime while existing AXIS remains authoritative.

Compare projected decisions against fixtures and real test sequences. Runtime failures must have zero effect on recording.

Exit condition: repeated randomized event sequences do not create invalid projections or require a page refresh.

### Stage 3 — Continue + Live Route

The runtime gains narrow ownership of continuation and remaining-route presentation.

The user still records through existing recording owners. The route is not a mandatory checklist.

Exit condition: refresh/reopen can restore the same visible route from authoritative state without duplicate completion or shadow ownership.

### Stage 4 — Reality actions

Introduce four compact runtime actions:

- occupied;
- replace;
- less;
- end.

They change constraints or route state, not historical facts.

Exit condition: each action has one owner, one deterministic transition and a fail-open fallback.

### Stage 5 — Time budget

Leave time becomes a first-class session constraint. Changing it immediately recomputes the remaining route using observed/estimated task duration, transition cost, completed work and redundancy.

Exit condition: aggressive time changes cannot produce impossible work, negative time or phantom completion.

### Stage 6 — interaction decay

Use repeated history to prefill known weights, settings and common structures when confidence is high enough.

Track interaction cost per completed useful workout. The expected long-term direction is down.

Exit condition: automation reduces taps without making corrections harder or hiding uncertainty.

### Stage 7 — durable event journal

Only after the runtime is stable, add an append-only domain journal for runtime actions and replay. Preserve compatibility snapshots until replay equivalence is proven across existing user data.

Exit condition: crash/reload/reopen sequences reconstruct the same authoritative state and no action is applied twice.

## Source convergence after 8.13

The current compatibility compiler should shrink, not grow indefinitely.

For every historical transform:

1. identify what compatibility requirement it still protects;
2. move stable behavior into a current canonical source owner;
3. keep explicit data migration if old user data needs it;
4. prove final artifact and browser behavior;
5. remove the historical source and rewrite together.

Do not reorganize the entire repository before ownership is clear. A clean directory tree is not worth a regression in user data or interaction behavior.

## Multi-platform

Platform expansion follows domain extraction:

1. browser-independent runtime tests;
2. stable storage/media/platform ports;
3. iOS shell with direct Photos/haptics/background support;
4. Android only after the same core can be reused without forked product logic;
5. desktop only if a concrete workflow justifies it.

The success criterion is shared behavior and data semantics, not the number of shells shipped.

## Things deliberately not on this roadmap

- streaks, XP, badges or punishment for gaps;
- a mandatory account before training;
- generic AI chat as the primary UI;
- automatic medical/recovery claims from weak evidence;
- another large learning-content expansion;
- a big-bang framework rewrite.
