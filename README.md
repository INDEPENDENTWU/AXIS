# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.23** · **release candidate; Production certification pending** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution reveals reality without inventing a second history.

## Release truth

AXIS **8.23 — Replay Evidence Continuity** is the current release candidate. It is not Production-sealed until its exact merged `main` SHA completes the Vercel → EdgeOne → `axis.juele.fun` certification chain.

The last fully Production-sealed runtime remains AXIS **8.22 — Truthful Evolution Replay**:

- sealed product PR: **#144**
- runtime seal baseline: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`
- Vercel Production gate `34612916951` — success
- Vercel Public Production Alias Gate `34612916591` — success
- EdgeOne deployment `dpp90dvhamrl`, verification run `34612882892` — success
- `axis.juele.fun` verification run `34612882890` — success
- combined status: Vercel success + EdgeOne Production success

Those provider records remain the AXIS 8.22 seal snapshot while 8.23 is a candidate. They are not 8.23 evidence.

## What 8.23 changes

Replay and Media Evidence now share exact transient Encounter context. When the user moves Replay to a real Encounter, the established v815 Evidence owner aligns to that same Encounter. If the selected Encounter has no media but the Object has evidence elsewhere, AXIS explicitly shows **“这一次没有留下影像证据”** instead of silently showing another date's media. A wholly no-media Object remains data-only and receives no capture pressure.

The user can still deliberately inspect another evidence-bearing Encounter in the Evidence rail. Any later Replay choice re-anchors Evidence to the exact Replay point.

This remains a read-only Reveal refinement:

- no new Session or Encounter writer;
- no media writer or new storage/database;
- no network or AI owner;
- no progress score, prediction or advice;
- no historical rewrite;
- selection is transient and never persisted.

v822 remains the Replay chronology owner. v815 remains the Media Evidence read/presentation owner.

## Current engineering state

Active milestone: **AXIS 8.23 — Replay Evidence Continuity**

Governed target branch: `main`

Bounded delivery branch: `product/823-replay-evidence-continuity` · PR **#146**.

Version decision: **8.22 → 8.23 / bump / sequence 7 / product-runtime**.

The deterministic release remains `canonical-single-runtime`; the 8.23 candidate uses one initial JavaScript request, zero dynamic runtime chunks, and adds one explicit postbuild product contract to the sealed 85-step graph.

## Product rules

**Reality is authoritative.** Intent never overwrites what actually happened.

**Local first.** Core practice remains usable without account, network or model calls.

**One action, one owner.** Derived presentation can delegate but cannot create a second factual writer.

**Evidence before interpretation.** AXIS may reveal recorded change but does not manufacture progress scores as fact.

**Quiet interfaces.** Better intelligence should remove ambiguity and taps rather than add setup burden.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. Backup/account expansion remains deferred; existing portable backup compatibility remains protected.

Release build:

```bash
node build-release.mjs
```

Vercel builds `main`; EdgeOne mirrors the exact verified prebuilt artifact. Chromium and iPhone-like WebKit remain release-blocking.
