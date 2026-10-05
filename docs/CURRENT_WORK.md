# AXIS Current Work

AXIS **8.27 — Reality Route** is **Production-sealed**.

Governed target branch: `main`.

## Production authority

Exact Production runtime SHA:

```text
d6044f0b30a92c007dd2fbab5792c2aa62dfd485
```

Release PR: **#160**.

The exact PR head `f79a25f10ac723ac7f6775a8b5c817b8fd884767` completed **30 / 30** workflow runs successfully before merge. The exact merged-main runtime then completed **29 / 29** merged-main/deployment certification workflow runs successfully.

Certification evidence:

- Current Release Gate `37333415838`
- Deep Compatibility Gate `37333415780`
- Vercel Production Gate `37333475667`
- Public Production Alias Gate `37333475632`
- Vercel deployment `dpl_5dNTyZpuRcqV8vDGRvYi9GC8KGYm`
- EdgeOne Production run `37333415798`, deployment `dpmrug23mtim`
- `axis.juele.fun` Production run `37333415692`

Provider URLs all converged to the exact 8.27 runtime. EdgeOne and the custom domain passed Chromium and iPhone-like WebKit. Seven API contracts matched the fixed Vercel Production source.

## Closed 8.27 product scope

Reality Route now deterministically projects:

```text
Flow intent
+ actual execution / Encounter evidence
+ temporary FlowRun constraints
        ↓
current / next / remaining / deferred / dropped / reasonCodes
```

The first bounded user capability is **稍后**.

A not-yet-started current item may be deferred for the current run. This writes only `temporaryConstraints.deferredStepRefs` inside the existing `axis_v60_state.flowRun` owner.

The following remain unchanged:

- reusable `axis.flow.v1` intent;
- historical Encounter and `axis.flow-provenance.v1` facts;
- Session, Encounter, recorder, and Active ownership;
- authoritative stores `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`;
- local-first operation;
- network and AI remain optional and non-authoritative.

A manual detour remains a real standalone record and does not consume the Flow step. An already-active item remains authoritative and cannot be deferred.

## Debt governance closed with 8.27

The 8.27 release also removed several release-line fragilities without creating product behavior outside the bounded slice:

- recorder lifecycle certification now follows capability presence instead of a hard-coded 8.26.x version family;
- inherited release identity assertions were carried forward explicitly to 8.27 instead of being silently stale;
- Reality Route persistence checks distinguish existing Media IndexedDB ownership from forbidden new route storage;
- Flow launch continues to use the canonical Profile / Goal Session truth owner;
- Reality Route integration stays inside the established Flow runtime boundary rather than creating a parallel runtime scope.

These are governance and compatibility repairs. They do not create new factual owners.

## Cross-platform continuity

Foundation remains `axis-native-foundation-0` in `INDEPENDENTWU/AXIS-iOS`.

Portable contracts now include `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.reality-route.v1`, `axis.execution-constraints.v1`, and `axis.report-range.v1`.

## Next bounded stage

Do not reopen 8.27. The next product stage must begin with a fresh version decision and may broaden Reality Route temporary constraints while preserving immutable intent/history, one factual owner per fact, and a pure platform-neutral continuation projection.
