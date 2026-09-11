# Current Release — AXIS 8.23

**Status: Release candidate — Production seal pending**

AXIS **8.23 — Replay Evidence Continuity** is the current Web release candidate. It is not Production-sealed until the exact merged `main` SHA completes the Vercel → EdgeOne → `axis.juele.fun` certification chain.

## Exact candidate identity

- release: **AXIS 8.23 — Replay Evidence Continuity**
- release PR: **#146**
- exact certified starting `main`: `cbcecfe9f7bfd18c8f05ced2bd760a60a03b15b5`
- delivery branch: `product/823-replay-evidence-continuity`
- version decision: **8.22 → 8.23 / bump / sequence 7 / product-runtime**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate build graph: **86 deterministic top-level steps**
- topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## Last sealed runtime baseline

AXIS **8.22 — Truthful Evolution Replay** remains the last fully Production-sealed runtime until 8.23 is certified.

- sealed product PR: **#144**
- runtime seal baseline SHA: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`
- Vercel Production gate `34612916951` — success
- Vercel Public Production Alias Gate `34612916591` — success
- EdgeOne deployment `dpp90dvhamrl`, verification run `34612882892` — success
- `axis.juele.fun` verification run `34612882890` — success

That 8.22 SHA is the durable **runtime seal baseline**, **not a self-referential requirement** that the 8.23 candidate use the same SHA. Provider evidence is replaced only after exact 8.23 merged-main certification.

## What 8.23 changes

Replay selection now anchors the existing Media Evidence presentation to the exact selected Encounter.

- v822 emits transient exact Encounter identity (`eventId`, `sessionId`, `time`).
- existing v815 Media Evidence consumes that identity and remains the only Evidence read/presentation owner.
- a selected Encounter with media displays that Encounter's real saved evidence.
- a selected Encounter without media explicitly says **“这一次没有留下影像证据”** when the same Object has evidence elsewhere.
- AXIS does not silently substitute a different evidence-bearing date.
- wholly no-media Objects keep the prior data-only/no-capture-pressure behavior.
- the user can deliberately inspect another Evidence rail item; Replay remains unchanged, and the next Replay selection re-anchors Evidence.

## Ownership boundary

AXIS 8.23 adds no factual owner:

- no Session writer;
- no Encounter writer;
- no media writer;
- no new storage namespace or database;
- no network or AI owner;
- no scoring/ranking/prediction/advice authority;
- no historical rewrite;
- no persisted Replay/Evidence cursor.

v822 remains Replay chronology/selection presentation. v815 remains Media Evidence resolution/presentation.

## Release-blocking proof

The exact PR head must prove inherited behavior plus 8.23 in Chromium and iPhone-like WebKit, including exact Encounter alignment, explicit selected no-evidence truth, manual Evidence inspection, storage byte-for-byte stability, no API calls, mobile geometry and reduced-motion behavior.

After merge, the exact merged SHA must prove fixed Vercel Production parity and Chromium 8.23 flow, exact-prebuilt EdgeOne Chromium/WebKit 8.23 flow, and `axis.juele.fun` Chromium/WebKit 8.23 flow. Final combined Vercel + EdgeOne Production status and all relevant main-push workflows must settle without unresolved failure.

Existing real user stores `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media` remain protected. Backup/account expansion remains deferred.
