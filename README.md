# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.26.5** · **Production-sealed** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Flow describes intended continuity, Encounters freeze what actually happened, Evidence anchors those facts, and Evolution reveals reality without inventing a second history.

## Release truth

AXIS **8.26.5 — Recording Review Geometry Stability** is Production-sealed at exact product/runtime merge:

```text
5bf575730c5c8de542c603d40b0f8b780204a342
```

Release PR: **#158**.

Exact Production evidence:

- Vercel deployment `dpl_D4FC1ro8RZV6hGu1Kqm9LrJcqMRn` — READY / Production / exact sealed SHA
- Current Release Gate `37187139856` — success
- Deep Compatibility Gate `37187139889` — success
- Vercel Production Deployment Gate `37187159342` — success
- Vercel Public Production Alias Gate `37187159392` — success
- EdgeOne Production run `37187139894` — exact-prebuilt deployment, Vercel parity, Chromium + iPhone-like WebKit success
- `axis.juele.fun` Production run `37187139864` — exact parity, Chromium + iPhone-like WebKit success

All **28 / 28** post-merge/deployment workflow runs for the exact merged SHA completed successfully.

`latestDeploymentIsAuthority` remains false: later governance-only commits or provider redeploys do not replace the exact product/runtime seal above.

## What 8.26.5 sealed

The existing `#v82Estimate` row is structural before Review becomes interactive. Its established v82 owner binds and updates the existing row instead of inserting it after the first metric edit.

The physical contract remains strict:

- `#axisSetControls` retains DOM identity and geometry within **0.5px** through the first metric edit;
- `#v82Estimate` retains DOM identity and geometry within **0.5px**;
- factual metric ownership is unchanged;
- Session, Encounter, Flow, Active, persistence, media, network and AI ownership are unchanged.

AXIS 8.26.4 Active Rest Utility Rail behavior is inherited by the sealed 8.26.5 artifact. 8.26.2 through 8.26.4 remain merged-but-unsealed provenance, not independent Production seals.

## Next product stage

The corrective 8.26.x line is closed.

The next bounded product stage is **AXIS 8.27 — Reality Route**, the first productized Domain Runtime slice under:

```text
Intent → Execution → Evidence → Evolution
```

8.27 will make current-session continuation follow reality without mutating reusable Flow intent or historical Encounter truth. The first capability is deterministic deferral/reprojection of an unavailable Flow item, with no new Session, Encounter, Active, recorder, persistence, network or AI owner.

## Product rules

**Reality is authoritative.** Intent never overwrites what actually happened.

**Local first.** Core practice remains usable without account, network or model calls.

**One action, one owner.** Derived presentation can delegate but cannot create a second factual writer.

**Evidence before interpretation.** AXIS may reveal recorded change but does not manufacture progress scores as fact.

**Quiet interfaces.** Better intelligence should remove ambiguity and taps rather than add setup burden.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

Release build:

```bash
node build-release.mjs
```
