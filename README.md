# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.26** · **release candidate; Production certification pending** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution reveals reality without inventing a second history.

## Release truth

AXIS **8.26 — Active Continuity** is the current release candidate. It fixes four connected field issues without creating another factual owner: record-save now settles as one visual transaction instead of flashing an intermediate Home state; ongoing Flow items enter the existing Active lifecycle when `開始此項` is tapped while one-shot items stay canonical-recorder-owned; a bounded non-interactive `+1 組` cue gives set completion more presence without covering content; and Home uses fewer duplicate cards/dividers.

The last fully Production-sealed runtime is AXIS **8.25.1 — Inline Set Morph** at exact main `f4d3d02e1a7b655185806b2dbb3bface804d93cc`:

- product/release PR: **#151**
- canonical Vercel deployment `dpl_DUuJiQoy8VnxRwcQLoGqCDckj1UX` — READY / Production / exact main SHA
- Current Release Gate `34761564240` — Chromium + iPhone-like WebKit success
- Deep Compatibility Gate `34761564210` — success
- EdgeOne Production run `34761564206` — exact-prebuilt deploy + Vercel parity + Chromium/WebKit success
- `axis.juele.fun` run `34761564467` — exact parity + Chromium/WebKit success
- combined Vercel + EdgeOne Production status — success

Those provider records remain the AXIS 8.25.1 seal snapshot while 8.26 is a candidate. They are not 8.26 evidence.

## What 8.26 changes

Saving a record no longer paints the committed-but-not-yet-Active state. The established Encounter writer commits first; the recorder resets locally; the existing v82 admission decides whether Active truth exists; then Home renders once into the truthful next state. The old floating saving pill is retired in favor of button-local pending state and dock-safe undo feedback.

Flow execution is now explicit. Ongoing modes (`sets`, `rounds`, `timed`, `hold`) start through the existing v82/v87 Active owners. One-shot modes (`single`, `complete`) remain in the canonical recorder because the record itself is their completion fact. If another Active item exists, the established switch path pauses/preserves it before starting the Flow item.

The Production-sealed 8.25.1 inline set-progress morph remains the factual completion presentation. 8.26 adds one small post-fact `+1 組` kinetic cue at the safe edge of the existing stage. It is pointer-inert, non-layout, reduced-motion-safe and release-tested against the clock, controls, Capture dock, navigation, stage height and viewport overflow.

Home also drops duplicate Active summary/compact metric surfaces and reduces repeated full-width separator density. Hierarchy comes from spacing, typography and subtle tonal grouping rather than more cards.

No Session, Encounter, storage, recorder, media, Active lifecycle, network or AI owner is added.

## Current engineering state

Active milestone: **AXIS 8.26 — Active Continuity**

Governed target branch: `main`

Bounded delivery branch: `release/826-active-continuity` · PR **#152**.

Version decision: **8.25.1 → 8.26 / bump / sequence 13 / product-ui**.

The deterministic release remains `canonical-single-runtime`, one initial JavaScript request and zero dynamic runtime chunks. The candidate graph is **88 deterministic top-level steps**. The exact PR head must pass Chromium + iPhone-like WebKit proof for atomic save settlement, Flow admission semantics, non-overlapping set cue and Home hierarchy before merge. The exact merged main artifact must then pass Vercel, EdgeOne and `axis.juele.fun` Production certification.

## Product rules

**Reality is authoritative.** Intent never overwrites what actually happened.

**Local first.** Core practice remains usable without account, network or model calls.

**One action, one owner.** Derived presentation can delegate but cannot create a second factual writer.

**Evidence before interpretation.** AXIS may reveal recorded change but does not manufacture progress scores as fact.

**Quiet interfaces.** Better intelligence should remove ambiguity and taps rather than add setup burden.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. Existing portable backup compatibility remains protected.

Release build:

```bash
node build-release.mjs
```

Vercel builds `main`; EdgeOne mirrors the exact verified prebuilt artifact. Chromium and iPhone-like WebKit remain release-blocking where the Production gate requires them.
