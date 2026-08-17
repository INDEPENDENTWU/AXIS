# AXIS Current Work

> Canonical engineering handoff. Read this before modifying AXIS. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12
- Verified Stage 2 `main`: `22d59ce3de448c33b7140c5432dee17c6e669fd0`
- Architecture: `canonical-single-runtime`
- Production release hash: `ad14cad78a8d`
- Canonical runtime marker: `74c57baa7159`
- CSS marker: `b59f3946c3e5`
- Fixed Production endpoint: `axis-five-puce.vercel.app`
- Vercel Production deployment for `22d59ce3…` is `READY` and reports that exact Git source SHA.
- Fixed Production alias serves `canonical-8.12` with the same 8.12 release/runtime/CSS hashes as the Stage 2 base.
- `AXIS Production Deployment Gate` passed against the fixed Production URL with real Chromium inherited product, AXIS 8.11 Experience and AXIS 8.12 Language Studio checks.
- Main push has zero failed or in-progress workflows after Stage 2 merge; full Runtime Chromium/WebKit and the dedicated Shadow Runtime gates are green.
- PR #37 is merged. Stage 2 Shadow Runtime is now the verified non-owning foundation in `main`.

## Active change

**AXIS 8.13 Stage 3 — Continue + Live Route** is active on `feat/813-continue-live-route`.

Stage 3 is the first intentionally user-visible Reality Runtime ownership transfer, but the transfer is deliberately narrow:

> the Runtime may own continuation / remaining-route presentation; existing 8.12 recording remains authoritative.

This stage is not allowed to become a second workout database, second recording owner, or automatic training controller.

### Product objective

When a real workout is already in progress, AXIS should be able to answer, clearly and immediately:

- what has already happened;
- what is still worth doing now;
- what should come next;
- what realistic alternatives exist if the next item is unavailable;
- how the remaining route changes when the user has less time or explicitly skips/changes the current route later.

Stage 3 does **not** judge the user for deviating from a plan. The route is a continuation from facts, not a compliance checklist.

### Presentation ownership boundary

Allowed Stage 3 ownership:

- a single `Continue + Live Route` presentation surface on Today / active workout;
- deterministic rendering from the Stage 2 Runtime projection;
- current / next / remaining / alternative route information;
- explicit empty/fallback states when projection is unavailable or unnecessary;
- visual updates triggered by existing authoritative recording/activity changes;
- read-only time-budget / temporary-constraint input if it can be introduced without taking recording/storage ownership.

Forbidden Stage 3 ownership:

- writing `axis_v60_state` or `axis_v8_meta`;
- completing sets, pausing/resuming, finishing items or sessions;
- changing the current event automatically;
- writing a new durable route/history database;
- rewriting history when a projection changes;
- camera/media/watermark/AI ownership;
- network-required route generation;
- automatic Reality Actions;
- durable event journal;
- storage migration;
- broad Home redesign unrelated to the route surface.

### Required failure behavior

The Runtime route surface must fail cleanly:

- Runtime unavailable/error -> existing 8.12 workout UI remains fully usable;
- insufficient evidence -> hide or show a concise neutral empty state, never invent work;
- no active workout -> no active route ownership;
- active session with no useful continuation -> do not fabricate a next item;
- browser reload / Home Screen resume -> recompute from authoritative facts; no route persistence is required for correctness.

### Intended owner model

Stage 3 should introduce **one** presentation owner, not another chain of historical patches.

Preferred structure:

1. existing 8.12 recording owners write facts;
2. a narrow browser adapter reads those facts after authoritative events;
3. pure Reality Runtime computes a projection;
4. one route presenter renders the projection;
5. presenter never writes training facts.

The Stage 2 external Shadow harness remains evidence infrastructure. Stage 3 may add a browser-side read-only Runtime bridge only if its ownership and failure boundary are explicit and single-owner.

## Validation for this work

Stage 3 is not complete until the exact final candidate proves all of the following:

### Ownership and safety

- exactly one `Continue + Live Route` presentation owner;
- no new writer to `axis_v60_state`, `axis_v8_meta`, IndexedDB media, learning store, or any new route persistence store;
- Runtime presentation code contains no training mutation path;
- existing completion/pause/resume/finish controls remain owned by the 8.12 runtime;
- malformed Runtime input or projection exception cannot block or corrupt recording;
- public release identity remains 8.12 unless a later explicit promotion decision changes it.

### Product behavior

- no active workout -> route surface absent/neutral and existing Home remains intact;
- active strength before first set -> current item is factual, unperformed `assumed` sets are not shown as completed;
- completing one set -> route updates without entering rest or replacing recording controls;
- explicit pause/resume -> route remains stable and does not fabricate progress;
- current-event change -> route updates to the new factual current item;
- active cardio planned duration -> remains active/uncompleted;
- occupied/excluded/time/intensity constraints affect only projected remaining route, never historical facts;
- zero-time / early-finish projection can resolve to no remaining work without fabricating completion;
- reload/reopen from same authoritative snapshot -> identical route presentation;
- iPhone-like WebKit and Chromium render the same route semantics without geometry flicker.

### Visual / interaction quality

- active Today hierarchy remains disciplined; the route does not compete with the current recording card;
- current / next / remaining information is scannable without verbose coaching copy;
- no nested card soup, duplicated timeline, oversized text, or new persistent modal flow;
- route updates do not cause active-card geometry jump or dock/navigation instability;
- Safari Home Screen / standalone lifecycle remains safe.

### Regression and architecture

- Stage 2 pure Runtime + Shadow gates stay green;
- existing Runtime, Home, Field Hardening, Reminder, 8.10.3, 8.11/8.12 inherited gates stay green;
- Repository Contract and Work Continuity Contract stay green;
- Stage 3 has a dedicated Chromium + iPhone-like WebKit gate covering route presentation and failure fallback;
- Production build topology remains `canonical-single-runtime`, one initial JS, zero dynamic historical runtime chunks.

## Next planned stage

After Stage 3 is merged and Production-verified, the next stage must be chosen from verified field evidence. The default migration sequence remains:

**AXIS 8.13 Stage 4 — Reality Actions**

Stage 4 may introduce explicit user actions such as “这个器械有人 / 我只剩 20 分钟 / 今天到这里” that alter **temporary Runtime constraints or continuation intent**, while historical workout facts remain authoritative and immutable.

Do not begin Stage 4 inside the Stage 3 PR. Durable event journal, storage migration and broad recording-owner transfer remain later, separate stages.
