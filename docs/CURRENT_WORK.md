# Current Work

## Production baseline at start of this work

The baseline for this bounded correction is merged main `85ed0ad6ce7d37eef6ec3e8f46eec7e378333328`.

The fixed public endpoints remain:

- Vercel: `https://axis-five-puce.vercel.app`
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`

The public release identity remains deliberately **8.20.1** while 8.21 product semantics are still being corrected and re-sealed.

The governed active milestone remains **AXIS 8.21 — Flow / Session Blueprint** and the governed active branch remains `product/821-flow-session-blueprint`. PR #99 is a bounded correction branch inside that milestone; it does not replace the parent governance identity.

Cross-platform continuity remains anchored by `axis-native-foundation-0`, `INDEPENDENTWU/AXIS-iOS`, `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1` and `axis.flow-provenance.v1`.

The inherited architecture remains single-owner:

- Flow definitions + one FlowRun: existing `axis_v60_state` app owner;
- Object identity/schema: existing Object Truth;
- Object picker: existing canonical `eqSheet`;
- standalone Quick Record / Group Plan: existing `v61.js` + app lifecycle;
- Session/Encounter truth: existing app writer;
- Active truth: existing Active owners;
- media/evidence: existing source-first/media owners.

No 8.21 correction may add a second persistence namespace, picker, recorder, Active owner, Session writer or Encounter writer.

## Active change

**AXIS 8.21 — Item-Unit Flow Convergence**

- branch: `axis-821-item-unit-flow-convergence`
- PR: **#99**
- base: `85ed0ad6ce7d37eef6ec3e8f46eec7e378333328`

Real iPhone product testing demonstrated that the previous Flow implementation used the wrong execution abstraction. It routed a Flow step into standalone Quick Record and then into the Object's set/timed Active lifecycle. That produced the observed path:

`Flow → 记下 → Quick Record/property surface → 记下 → 单项/组执行 → 完成一组`

and did not reliably advance to the next Flow Object.

The corrected governed rule is:

> **Flow sequences Objects; one Object/item is the minimum completion unit inside Flow.**

The target physical lifecycle is:

`start A→B→C → A current → 完成此项 → B current → 完成此项 → C current → 完成此项 → Flow complete`

This slice therefore:

- starts/reuses the containing Session when Flow starts;
- goes directly to item 1 without opening Quick Record;
- changes the Flow primary action to `完成此项`;
- commits exactly one one-shot factual Encounter for each completed Flow item through the existing app-owned Encounter append boundary;
- freezes Flow provenance on that item Encounter;
- does not fabricate historical weight/reps/sets or other unconfirmed metrics;
- immediately increments the Flow cursor after completion;
- keeps skip intent-only with no Encounter;
- keeps `临时记录其他` as ordinary standalone Quick Record with no Flow provenance and no cursor movement;
- prevents generic Encounters from advancing Flow;
- derives the next item from the running Flow snapshot rather than stale UI hints;
- keeps Group Plan / `完成一组` semantics only in standalone compatible Object execution, not in Flow;
- reduces the Today no-Flow state to a compact row instead of a feature-education block;
- avoids duplicate unnamed Flow title/chain text;
- permits zero-property Objects in Flow provenance;
- updates the 8.21 architecture blueprint to the corrected item-unit boundary.

The new physical proof is `scripts/axis-821-item-unit-flow-smoke.mjs`. The late convergence prep redirects both the current-release Flow runtime smoke entry and the nested recording-property physical lane to this final item-unit scenario after all earlier 8.21 assembly passes have completed.

## Validation for this work

PR #99 is not mergeable until its exact latest head proves all of the following:

- deterministic build succeeds after the late item-unit convergence pass;
- Work Continuity includes this handoff in the same executable-code PR;
- repository, Runtime, Runtime Foundation, Deep Compatibility, Cross-Platform Foundation, Current Release and UPO gates remain green;
- the final source still contains exactly one authoritative `state.active.events.push(` Encounter append;
- starting Flow creates/reuses one containing Session but no Encounter;
- item 1 appears immediately as `1 / 3` with the correct next item;
- the first item cannot incorrectly display `最后一项`;
- `完成此项` does not open `scanSheet` and does not create `完成一组` / set-level Active metadata;
- completing an item writes exactly one one-shot Encounter with exact Flow provenance and immediately makes the next item current;
- ordinary standalone Quick Record during an active Flow writes a normal Encounter with no Flow provenance and leaves the current Flow cursor unchanged;
- skip creates no Encounter;
- final item completion moves FlowRun to `complete`;
- zero-property provenance validates;
- standalone Quick Record remains usable after Flow completion;
- Chromium and iPhone-like WebKit execute the same physical lifecycle without page errors.

After PR merge, the exact main artifact must be verified on the fixed Vercel Production URL, then the same exact prebuilt artifact must be mirrored to EdgeOne and re-run through the same Chromium + iPhone-like WebKit product path before this semantic correction is considered Production-sealed.

## Next planned stage

Only after PR #99 is merged and Production-sealed should 8.21 continue to final release convergence.

Before changing the public version, do one final product pass over:

1. Flow composer touch/reorder and optional `开始` vs `保存` friction;
2. active Flow typography/spacing on real iPhone widths;
3. optional inline factual metric entry, only if it genuinely reduces friction and never becomes mandatory for Flow progression;
4. fixed Vercel + EdgeOne exact-artifact dual-engine verification.

Then advance the public identity from **8.20.1 → 8.21** as a release-only convergence change, without relabeling historical 8.18 / 8.19 / 8.20 / 8.20.1 provenance and without introducing 8.22 adaptive behavior.

Chat history is not authoritative project memory. Conversation history is supplemental only. GitHub governance, contracts, tests, current main and Production evidence are authoritative.
