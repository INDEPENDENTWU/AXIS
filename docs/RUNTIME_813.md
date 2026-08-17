# AXIS 8.13 Runtime — Stage 0/1

8.13 is an architecture and product migration cycle. **AXIS 8.12 remains the current production release.**

This stage establishes the first executable form of the Reality Runtime without changing current product ownership or user-visible behavior.

## Product contract

AXIS is moving from “a workout record with many capabilities” toward a fault-tolerant workout runtime:

> reality can interrupt training without forcing a restart.

The runtime exists to answer a narrow question: given what actually happened and what is true right now, what can still happen next without invalidating history?

This is not a static plan generator. It is not a generic AI coach. It does not punish gaps or define an incomplete workout as failure.

## What lands in Stage 0/1

### Pure domain runtime

`runtime/axis-runtime.mjs` is deterministic and independent of:

- DOM/UI;
- LocalStorage / IndexedDB;
- network;
- AI providers;
- camera/media;
- Vercel or another deployment platform.

Its initial inputs are current session, recent history, current exercise, optional goal, explicit time budget and temporary constraints.

Its initial output is a projection with current, next, alternatives, remaining route, dropped work, normalized constraints, budget facts and reason codes.

### Read-only 8.12 adapter

`runtime/compat/axis-812-adapter.mjs` translates parsed snapshots from the two current recording authorities:

- `app.js` / `axis_v60_state`;
- `v61.js` / `axis_v8_meta`.

It does not read storage itself and exposes `writes: 0` in diagnostics. Set metadata preserves the distinction between performed and unfinished sets so the runtime cannot infer phantom completion.

### Characterization fixtures

The fixture set covers:

- normal continuation;
- occupied next equipment;
- an eight-minute remaining budget;
- partially performed sets;
- returning after a long gap;
- ending immediately / zero remaining time.

These are executable examples of the “Never Restart + Reality Runtime” product contract, not screenshots.

### Deterministic and property tests

The Runtime Core gate checks:

- identical input -> identical output;
- no mutation of 8.12 snapshot input;
- no duplicate route IDs;
- no occupied/excluded equipment leaking into the route;
- no negative time or over-budget projection;
- `less` and `minimum` physically shrink work rather than changing history;
- removing an occupancy constraint can naturally reinsert the item;
- leave-time conversion is deterministic;
- refresh/reopen from the same authoritative snapshot restores the same projection;
- long gaps create no restart, streak or failure semantics;
- zero-time early finish fabricates no work;
- 600 seeded randomized real-world constraint sequences preserve invariants;
- the pure runtime never gains browser/storage/network ownership.

## Production non-impact contract

Stage 0/1 is intentionally outside the production build graph.

`build-release.mjs` does not reference the new runtime or adapter. The new CI gate builds the PR candidate and then independently rebuilds the exact PR base SHA in a detached Git worktree. It requires the generated browser product to be byte-for-byte equivalent at the user-facing asset layer:

- raw `axis-core.js`;
- raw `axis-style.css`;
- generated `index.html`;
- release/base version and release hash;
- manifest core/CSS/canonical runtime hashes;
- JavaScript/stylesheet request topology;
- dynamic chunk topology.

The candidate must also remain release `8.12`, architecture `canonical-single-runtime`, one initial JavaScript runtime and zero dynamic historical runtime chunks. Source-commit metadata is deliberately excluded because the candidate and base necessarily have different Git SHAs.

For reference, the inherited canonical 8.12 runtime marker remains `faf1d2f88421`, CSS marker `b59f3946c3e5`, and release hash `66d8097f7b56`. If Stage 0/1 changes the actual production artifact relative to its base, CI fails.

## What does **not** change yet

- Home UI;
- recording UI;
- set editor;
- pause/resume/finish ownership;
- LocalStorage/IndexedDB schema;
- media/watermark behavior;
- Language Studio;
- cloud/AI behavior;
- current Production release identity.

There is no shadow runtime in the browser yet. That is Stage 2 and must be introduced separately so runtime failure remains guaranteed to have zero effect on recording.

## Next migration boundary

The next safe step is **Shadow Runtime**:

1. capture normalized read-only snapshots at narrow event boundaries;
2. feed them to this pure runtime;
3. compare projections without rendering or persisting them;
4. collect deterministic diagnostics;
5. prove randomized/reopen sequences before transferring any UI ownership.

Only after that evidence is green should AXIS expose `Continue + Live Route`. Recording remains with the existing owners until a later explicit owner-transfer change retires the old writer in the same commit.
