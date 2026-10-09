# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.29** · **Production-sealed: AXIS 8.29** · [Open AXIS](https://axis.juele.fun) · [Current release](docs/CURRENT_RELEASE.md) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md)

AXIS is a **Personal Evolution Engine**. Object holds reusable practice semantics; Flow is intent; Reality Route adapts to actual constraints; Active is present execution; Encounter is confirmed fact; Evidence is attached to history; Evolution is a read-only projection of change.

## AXIS 8.29 — Recording Friction Collapse

- Suggest previously confirmed metric values only when the source Encounter schema is compatible; never silently convert a past value into a present fact.
- Preserve current unsaved edits when the same recorder re-renders, without carrying them across incompatible schemas.
- Guard against overlapping save transactions without introducing another Encounter writer.
- Keep the canonical `app.js` Encounter writer, classic `v61` path and existing storage authorities unchanged.

Pure portable contract: `axis.recording-continuity.v1`.

**Release status:** 8.29 Production-certified, product PR #164, exact product/runtime SHA:

```text
4a9c73b2ea5330b9cffad3f9e322eb6970dfe171
```

Exact PR head `8dc4d80f17c061b81a294963c4723f1d6d7e826e`: 33 / 33 successful PR runs. Exact merged-main: 27 successful, 1 cancelled (Branch hygiene), 0 failed across 28 push workflows. Vercel git deployment `dpl_BJz2iaThLqFnPbTDJ4RTQdDPKNY1` READY; EdgeOne `dpfctvvd321b` verified; [axis.juele.fun](https://axis.juele.fun) exact parity plus Chromium/WebKit validated. Detailed immutable provider evidence: [8.29 certificate](governance/production-certifications/8.29.json).

AXIS 8.28 was the previous Production-sealed release (product PR #162, governance PR #163), product/runtime SHA `df67fc0a20c0c34a79341315c8c85b5461acfe44`. Historical release evidence remains attached to its own exact runtime. Later governance-only commits are not product-runtime authority.

## Product rules

**Reality before intent.** Prior values are suggestions; current facts require explicit confirmation.

**Local first.** Core practice, Object and Encounter history do not require login, network or cloud AI.

**One fact, one owner.** No new Encounter writer, Active owner or storage namespace is introduced by 8.29.

Authoritative stores: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`.

Build: `node build-release.mjs`.

## Next bounded delivery

**AXIS 8.30 — Object Identity Integrity.** Correct display/search/picker/record Object ID consistency and historical compatibility before developing **Playable Practice**: PLAY THIS, AIR, then TAKE and FORK. These future capabilities are approved directions, not implemented 8.29 features. See [handoff](docs/HANDOFF.md) for the actual gate and authority boundaries.
