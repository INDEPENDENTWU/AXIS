# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.27** · **Production-sealed** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Flow describes intended continuity, Encounters freeze what actually happened, Evidence anchors those facts, and Evolution reveals reality without inventing a second history.

Exact Production product/runtime SHA:

```text
d6044f0b30a92c007dd2fbab5792c2aa62dfd485
```

Release PR: **#160**.

## AXIS 8.27 — Reality Route

8.27 begins the product convergence line:

```text
Intent → Execution → Evidence → Evolution
```

Reality Route derives the current continuation from reusable Flow intent, actual execution facts, and temporary real-world constraints.

Its first visible action is **稍后**: a not-yet-started current Flow item can move behind the immediate route for this run without rewriting the saved Flow or fabricating an Encounter.

```text
Intent:   下拉 → 划船 → 肩推
Reality:  下拉暂时不可用
Route:    划船 → 肩推 → 下拉
```

The temporary constraint lives only in the existing `axis_v60_state.flowRun` owner. There is no new storage namespace, Session writer, Encounter writer, recorder, Active owner, network dependency, or AI authority.

The exact merged-main runtime is certified on Vercel, EdgeOne, and `axis.juele.fun`, with Chromium and iPhone-like WebKit production proof across the provider chain.

## Product rules

**Reality is authoritative.** Intent never overwrites what actually happened.

**Local first.** Core practice remains usable without account, network, or model calls.

**One fact, one owner.** Derived runtime projection cannot create a second factual writer.

**Evidence before interpretation.** Historical truth remains immutable.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

Release build:

```bash
node build-release.mjs
```
