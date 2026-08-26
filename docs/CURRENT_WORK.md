# Current Work

## Production baseline at start of this work

The baseline at the start of this slice is merged main `691e9043e061b14916d03015b0991fc08aceb016`.

That main includes:

- PR #88 — the AXIS 8.21 app-owned Flow runtime boundary;
- PR #89 — EdgeOne Production Flow gate seal;
- PR #90 — Canonical Recording Property Surface, merged as `691e9043e061b14916d03015b0991fc08aceb016`;
- explicit zero-property Object truth (`metricSchema: []`);
- one canonical Object-driven recording surface shared by Capture / Quick Record;
- Flow provenance attached at the existing Encounter writer;
- Chromium and iPhone-like WebKit physical proof for the Flow runtime and recording-property surface;
- exact Vercel/main artifact convergence followed by the exact prebuilt EdgeOne mirror.

Fixed Production URLs remain:

- Vercel: `https://axis-five-puce.vercel.app`
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`

The public release identity still reports the sealed 8.20.1 runtime identity while 8.21 capabilities are being added incrementally. Do not create a parallel runtime, recorder, Session writer, Encounter writer or persistence namespace merely to advance 8.21 product surfaces.

The previously red inherited main `webkit-compatibility` check was rerun without source changes and passed completely, confirming the earlier failure was transient rather than an 8.21 regression.

Cross-platform continuity remains anchored by `axis-native-foundation-0`, `INDEPENDENTWU/AXIS-iOS`, `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1` and `axis.flow-provenance.v1`.

## Governed parent milestone

The governed active milestone remains **AXIS 8.21 — Flow / Session Blueprint**.

The governed active branch remains `product/821-flow-session-blueprint`; PR #91 is a bounded child branch and does not replace that parent governance identity.

PR #91 is the Phase 3 child slice that turns the already-proved Flow runtime into a real user-facing Today interaction. It must remain a thin intent/orchestration surface over existing Object and recording owners rather than becoming a second training product architecture.

## Active change

**AXIS 8.21 — Flow User Surface**

- branch: `product/821-flow-user-surface`
- PR: **#91**
- base: merged/Production-sealed PR #90 main `691e9043e061b14916d03015b0991fc08aceb016`

### Product path

The intended physical interaction is now implemented as:

`Today → Flow → 新建流程 → 使用现有 Object picker 添加项目 → 调整顺序 → 保存 → 开始 → 显示当前 / 下一项 → 记录当前 → existing Quick Record → committed Encounter → 自动推进下一项`

The visible Flow surface deliberately does **not** show a completion percentage, score, streak, success ceremony or failure state for deviation.

### Composition

Flow composition reuses the established `eqSheet` Object picker. There is no Flow-specific catalog or duplicated Object store.

The editor supports:

- optional Flow name;
- adding existing Objects through the real picker;
- repeated Objects when desired;
- explicit ordered steps;
- up/down reordering with mobile-safe controls;
- removing a step;
- durable save/edit/delete through the existing app-owned Flow runtime;
- reload-safe definitions inside existing `axis_v60_state`.

Creating or editing intent must not create a Session, Active fact or Encounter.

### Running a Flow

Today shows one compact Flow rail rather than a new top-level product mode.

When a Flow is active it exposes only:

- current Object;
- next intended Object when present;
- `记录当前`;
- `跳过`;
- `临时记录其他`;
- `结束流程`.

`记录当前` selects the current Object through the existing Flow/Object handoff and opens the established v61/app Quick Record lifecycle through a small non-owning bridge. Flow does not render its own metric controls.

`临时记录其他` opens ordinary Quick Record. That Encounter remains ordinary factual history and the Flow stays on its current intended step unless the recorded Object is the actual current Flow step.

`跳过` changes FlowRun intent only and creates no Encounter.

`结束流程` is valid at any point and writes no completion score.

### Encounter-gated advance

The user surface listens only after the existing app Encounter writer has appended and saved the Encounter.

A Flow advances automatically only when the saved Encounter already carries matching immutable `flowProvenance` for the current `flowRef` and `flowStepRef`. A UI tap, picker selection or recorder open cannot advance intent by itself.

Editing, reordering or deleting the live Flow later must not mutate historical Encounter provenance, `metricSchemaSnapshot` or `executionModeSnapshot`.

### Ownership preserved

- Flow definitions / one FlowRun: existing app-owned `axis_v60_state`
- Object identity/schema: existing Object Truth
- Object picker: existing `eqSheet`
- Quick Record: existing `v61.js` + app recorder lifecycle
- Session/Object/Encounter truth: existing app writer
- classic repeated weight+reps facts: existing v61 / `axis_v8_meta` authority only
- ongoing Active: existing Active owners
- media: existing source-first/media owners

No new localStorage namespace, IndexedDB database, picker, recorder, Active owner, Session writer or Encounter writer is introduced. Flow styling is compiled into static CSS rather than injected by a runtime stylesheet owner.

## Validation for this work

PR #91 is not mergeable until its exact head proves all of the following:

- deterministic release build succeeds;
- Repository, Work Continuity, Runtime Foundation, Runtime, Deep Compatibility, Current Release and Universal Practice Object gates remain green;
- existing 8.21 Flow runtime physical smoke remains green;
- existing Canonical Recording Property Surface smoke remains green;
- new Flow user-surface smoke executes in the same Chromium and iPhone-like WebKit lane;
- composition physically uses the existing Object picker rather than a synthetic test-only selector;
- A/C/B can be composed, reordered to A/B/C, saved and reloaded;
- composing or launching Flow intent does not create factual training history;
- Today shows current and next intent without a completion percentage;
- `记录当前` opens the canonical Quick Record / Object-driven recorder;
- a `duration + intensity` Object records through the canonical value controls and advances only after the real Encounter commit;
- skipping a classic middle Object creates no Encounter and leaves a factual skip only in FlowRun intent;
- an explicit zero-property completion Object records with `metricSchemaSnapshot: []` and the expected execution snapshot;
- historical Flow provenance remains byte-for-byte unchanged after later Flow reorder and reload;
- no duplicate storage/recorder/picker/writer owner or page error appears.

After merge, the exact main artifact must converge on the fixed Vercel Production URL and the same exact prebuilt artifact must pass real Chromium and iPhone-like WebKit verification on EdgeOne before this slice is called Production-sealed.

## Next planned stage

After PR #91 is merged and Production-sealed, close the remaining **8.21 product-release boundary** rather than immediately adding more concepts.

The next bounded work should be:

1. inspect the live Flow surface on real mobile geometry and remove any unnecessary copy/controls exposed by field use;
2. prove the ordinary `临时记录其他 → 返回当前 Flow` path on real Production, including a non-Flow Encounter inserted between intended steps;
3. decide whether the completed FlowRun should remain visible until explicit dismissal or collapse automatically after a short factual handoff — without adding celebration/scoring semantics;
4. advance the public release identity to 8.21 only after the user-visible Flow path, recording-property surface, runtime contracts and Production mirrors are all sealed together;
5. only then begin 8.22 adaptive defaults from factual history.

Phase 4 must still reuse the same picker, recorder, storage and factual writers. It is a convergence/release slice, not permission for a new planner, calendar, coaching system or AI prescription layer.

Chat history is not authoritative project memory. GitHub governance, contracts, tests, current main and Production evidence are authoritative.
