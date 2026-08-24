# AXIS Current Work

> Canonical active-work handoff. Read [`HANDOFF.md`](HANDOFF.md) first; machine truth starts at [`../governance/project-state.json`](../governance/project-state.json).

## Production baseline at start of this work

- Public Production was **AXIS 8.18** at the start of this release-finalization work.
- AXIS 8.19 product capability PR **#80** is already merged to `main` as merge SHA `d97b483f5b297e4bc9483a7484da5587cc4f17d8`.
- That merged code passed the 8.19 Universal Practice Object contract plus real Chromium and iPhone-like WebKit candidate flows.
- The remaining defect was release identity/deployment truth: the Vercel artifact for that merge still reported `version/baseVersion = 8.18`, so 8.19 was not yet allowed to be called a formal Production release.
- Stable public endpoint remains `https://axis-five-puce.vercel.app`; EdgeOne mirror endpoint remains `https://axisfitness-mirror-9x91gveo.edgeone.cool`.

## Active change

**AXIS 8.19 — formal Production release seal** · branch `release/819-production` · PR **#81**.

The governed product milestone remains **AXIS 8.19 — Universal Practice Objects**. Its original implementation branch `product/819-universal-practice-objects` is merged via PR #80; PR #81 is the release-finalization continuation, not a competing milestone.

The native/cross-platform handoff remains anchored by `axis-native-foundation-0` and repository `INDEPENDENTWU/AXIS-iOS`, with shared portable contracts `axis.domain.v1` and `axis.data.v1`. Web release finalization must not alter native-domain semantics or durable exchange contracts.

This PR does not invent another product layer. It closes the release contract around the already-merged 8.19 product work:

- advances only the current public/base identity from `8.18` to `8.19` after the inherited deterministic assembly chain;
- preserves historical 8.18 Object Truth / Focus / media / freshness / schema provenance rather than relabeling old capability owners;
- keeps the 8.17 and 8.18 regression suites running against the new 8.19 public artifact with their historical module markers intact;
- requires EdgeOne to wait for the exact Vercel `main` SHA with `version/baseVersion = 8.19` before publishing;
- adds the 8.19 Object → Recording → authoritative Encounter browser smoke to both Chromium and iPhone-like WebKit Production verification.

8.19 product truth remains:

`Object → Metric Schema → Recording Surface → authoritative metric facts → immutable Encounter schema snapshot → History / Evolution`

Authoritative ownership remains unchanged: `app.js` owns base Encounter/session persistence and canonical media; `v61.js` owns classic high-frequency strength set facts; schema resolution is semantic/pure; History/Evolution remain consumers rather than competing writers.

**Chat history is not authoritative project memory.** GitHub governance, contracts, tests and deployment truth remain authoritative.

## Validation for this work

A merge is allowed only when the exact PR head can build a canonical 8.19 artifact and the repository gates remain green. Formal Production is allowed only after the merged `main` SHA is served by the canonical Vercel endpoint and the EdgeOne mirror verifies that same artifact.

Required release proof:

- `node build-release.mjs` emits `version = 8.19` and `baseVersion = 8.19`;
- historical 8.18 capability markers remain 8.18 where they describe provenance rather than current public identity;
- Current Release, Runtime Foundation, Deep Compatibility, Repository, Work Continuity and affected specialist gates pass;
- Universal Practice Object real flow passes Chromium and iPhone-like WebKit;
- Vercel Production manifest `sourceCommit` equals the final merged-main SHA;
- EdgeOne deploys only after exact local/Vercel artifact parity;
- EdgeOne live verification plus Chromium and iPhone-like WebKit Production flows pass, including the 8.19 Object → Recording → Encounter smoke;
- no destructive user-data migration and no second writer/store is introduced by the release seal.

## Next planned stage

1. Finish PR #81 with all candidate gates green; fix release-contract regressions rather than weakening assertions.
2. Merge only the exact tested head.
3. Confirm `https://axis-five-puce.vercel.app/axis-build.json` reports the final merge SHA and `8.19 / 8.19`.
4. Let the EdgeOne Production Mirror publish the exact prebuilt artifact, then require live parity plus Chromium/WebKit success.
5. Record the final Vercel deployment, EdgeOne workflow/run and merged SHA in the durable release/handoff state.
6. Only after that seal is complete may new product work start from AXIS 8.19 as the rollback/reference baseline.

**Conversation history is supplemental only. GitHub handoff/contracts/tests are authoritative for this work.**
