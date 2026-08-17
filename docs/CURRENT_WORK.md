# AXIS Current Work

> Canonical engineering handoff. Read this before modifying AXIS. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Verified Production baseline

- Public product: AXIS 8.12
- Verified `main` at Stage 2 base: `7d2c703ec85abc8a01ee43de4d99ea9402695fbf`
- Architecture: `canonical-single-runtime`
- Production release hash: `ad14cad78a8d`
- Canonical runtime marker: `74c57baa7159`
- CSS marker: `b59f3946c3e5`
- Fixed Production endpoint: `axis-five-puce.vercel.app`
- Vercel Production for the base is `READY` and reports that exact `main` SHA.
- `AXIS Production Deployment Gate` passed on that baseline with real Chromium inherited product, 8.11 Experience and 8.12 Language Studio checks.
- PR #36 field hardening is merged Production behavior: Group Plan uses the recording owner, active adjustment resolves the current event, set completion does not imply rest, pause owns cumulative rest, first paused frame is final rest presentation, and standalone learning remount is event-driven.

## Current milestone

**AXIS 8.13 Stage 2 — Shadow Runtime is implemented and validated in PR #37.**

Stage 2 remains non-owning. AXIS 8.12 is still the only product/browser authority.

The Shadow Runtime exists to answer one engineering question before any UI transfer:

> given real authoritative 8.12 facts, does the pure Runtime produce deterministic continuation projections without fabricating history or affecting recording?

## Stage 2 implementation

### Authoritative 8.12 adapter

`runtime/compat/axis-812-adapter.mjs` now follows actual Production semantics:

- `done`, `doneAt`, or authoritative `activity.completedSets` may establish performed strength work;
- `assumed` is unfinished/planned work and must not become phantom completion;
- active/paused cardio planned duration is not completion;
- archived sessions remain historical facts;
- pause/rest (`status`, `restStartedAt`, `restAccumulatedMs`) is separate from completion;
- explicit observed current event id takes priority; otherwise current activity state is used conservatively.

When evidence is incomplete, live work stays unfinished rather than being invented as completed.

### Pure Shadow Runtime

`runtime/shadow/axis-shadow-runtime.mjs` is platform-neutral and deterministic. It produces only:

- normalized Runtime input;
- factual active-session diagnostics;
- pure Runtime projection;
- stable input fingerprint;
- projection-vs-next-observed-state alignment diagnostics.

It has no DOM, LocalStorage, IndexedDB, network, media, AI or timer ownership. It writes nothing and is not authoritative.

Observation errors fail open into diagnostic results with `projection: null`; Runtime exceptions cannot affect recording because no Runtime module is loaded by the 8.12 product.

### Real browser Shadow harness

`scripts/axis-813-shadow-browser.mjs` runs outside the product bundle.

The unchanged 8.12 product performs real transitions; the harness only reads parsed `axis_v60_state`, `axis_v8_meta` and current event id at narrow boundaries, then runs the Shadow Runtime in the test process.

Real browser coverage includes:

- three `assumed` strength rows -> zero performed sets;
- real `完成一组` -> one factual performed set and no automatic rest;
- real pause -> rest facts with no fabricated set;
- real resume -> accumulated rest with no fabricated work;
- active cardio planned duration -> still unfinished.

This is exercised in Chromium and iPhone-like WebKit.

## Stage 2 validation evidence

The implementation/documentation candidate `9f5bdae5c1d9fc9da2a1744a3a47787407df409b` passed **all 9 workflows triggered for PR #37**:

- AXIS 8.13 Shadow Runtime;
- AXIS 8.13 Runtime Core;
- AXIS Runtime Gate;
- AXIS 8.12 Field Hardening Gate;
- AXIS 8.10.3 Gate;
- AXIS Home Transition Gate;
- AXIS 8.8 Reminder Layout Gate;
- AXIS Repository Contract;
- AXIS Work Continuity Contract.

Dedicated Shadow evidence on that candidate:

- pure Shadow invariants PASS;
- Chromium authoritative Shadow observation PASS;
- iPhone-like WebKit authoritative Shadow observation PASS;
- Stage 0/1 retains 600 seeded randomized Runtime cases;
- Stage 2 adds 500 seeded randomized Shadow cases;
- combined seeded randomized evidence: 1,100 cases;
- same snapshot -> identical fingerprint and observation;
- malformed observation -> deterministic fail-open diagnostic;
- no Runtime/adapter/shadow browser/storage/network ownership APIs;
- PR changed-file self-audit found only `.github/`, `docs/`, `runtime/`, and `scripts/axis-813-*` scope; no 8.12 product owner or build orchestrator changed.

### Exact Production parity

Stage 2 remains outside `build-release.mjs`.

`AXIS 8.13` parity rebuilt exact base `7d2c703ec85abc8a01ee43de4d99ea9402695fbf` in a detached worktree and passed byte-for-byte Production parity:

- release: `8.12`;
- release hash: `ad14cad78a8d`;
- canonical runtime marker: `74c57baa7159`;
- CSS marker: `b59f3946c3e5`;
- raw generated core parity fingerprint: `1483c663fda3`;
- architecture: `canonical-single-runtime`;
- one initial JavaScript request;
- zero dynamic historical runtime chunks.

Any Stage 2 Runtime/test/docs/CI-only change that alters the actual 8.12 Production artifact fails CI.

## Ownership boundary after Stage 2

Still unchanged:

- Home UI owner;
- recording owner;
- strength/set editor owner;
- pause/resume/finish owner;
- LocalStorage / IndexedDB schema and writers;
- camera/media/watermark owners;
- AI/network owners;
- Language Studio;
- current route/recommendation presentation;
- public release identity 8.12.

No `Continue + Live Route` UI has been transferred to the Runtime yet.

The 8.12 field-hardening compatibility transform also remains in place until a later explicit owner-transfer change can prove equivalent semantics and retire an old owner in the same controlled change.

## Final PR #37 seal

This status-only documentation commit is the final intended Stage 2 change. Because it becomes the PR head, **the exact final head must rerun and pass the same Shadow, Runtime, inherited product, Repository, Continuity and exact-parity gates before merge.** Earlier green runs are evidence but are not reused as the final merge decision.

After that exact-head pass, PR #37 should be squash-merged. Stage 2 is then closed; do not add user-visible Runtime ownership to the same PR.

## Next controlled stage

**AXIS 8.13 Stage 3 — Continue + Live Route**

Stage 3 may transfer only the narrow ownership of continuation / remaining-route presentation.

Required boundary:

- existing recording remains authoritative;
- no new storage writer;
- no Runtime mutation of history;
- route UI must render from deterministic Runtime projection;
- any fallback returns cleanly to existing 8.12 behavior;
- owner transfer is explicit and reversible;
- Reality Actions, durable event journal, storage migration and broader recording ownership remain later stages.

Start Stage 3 from the verified Stage 2 `main`, not from chat history or an old feature branch.
