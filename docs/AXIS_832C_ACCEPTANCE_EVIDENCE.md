# AXIS 8.32c — Local acceptance evidence

## Authority and scope

Draft PR #174 remains unmerged. Sealed Production version remains AXIS 8.31. 8.32 is a candidate until all required checks and provider readbacks pass.

## Real execution (2026-10-12)

- First Vercel Preview for `1a214f8` **ERROR** with verified build failure at the 8.32 inherited local-memory adapter (generated-test anchor drift).
- Second Preview for `b78585c2f993b7e6ce680bad15618b74f9f99050` **READY**, git source is the existing `axis` Vercel project, HTTP 200 serves `data-axis-runtime="canonical-8.32"`. This is **Preview only**; Production remains 8.31.
- Vercel Sandbox exact `b78585c2` full `node build-release.mjs`, postbuild 8.32 contract and Production governance source contract **PASS**.
- Chromium + project-pinned Playwright 1.55: existing 8.32 PLAY THIS browser smoke **PASS**, 8.26 inherited Active continuity **PASS**. Extended 8.32c browser test **PASS**, including native/custom exact IDs, 320/360/390/430px Object CTA geometry, English action, real offline Object entry, foreign Flow rejection, and FlowRun after reload. Screenshots captured in /tmp for each viewport.
- WebKit with Playwright **1.64** on Ubuntu 26 sandbox: existing 8.32 PLAY THIS browser smoke **PASS**. This is a *different browser build* from mandated pinned 1.55, so cannot substitute for the final pinned WebKit CI proof.
- Inherited 8.8.2 replay: actual local vision generated a canonical `lat-pulldown` memory with complete multi-signal signature and `usable:true`, but visible label remained `请确认`, not `本地认出`; adapter now asserts actual identity/signature plus safe human-confirmation label. Subsequent inherited rest-mode test is still **BLOCKED**: canonical Active showed planComplete instead of immediate rest. Keep this red until product semantics versus historical scenario are independently resolved.

## Coverage classification

| Scenario | 8.32c status | Evidence boundary |
| --- | --- | --- |
| P01 native Object | automated Chromium 1.55 + WebKit 1.64 | Existing picker, exact ID, no synthetic Encounter |
| P02 custom Object | automated Chromium 1.55 | Exact custom ID, existing Recorder, no synthetic Encounter |
| P03 same-name identity | not yet verified | Needs identity-collision browser fixture |
| P04 saved Flow | automated Chromium 1.55 + WebKit 1.64 | Existing Home single action to canonical FlowRun |
| P05 confirmed Encounter advances Flow | inherited 8.31 proof, not re-run against this head | Requires fresh real save+reload+provenance proof |
| P06 foreign Flow | automated Chromium 1.55 | Existing FlowRun unchanged, no synthetic Encounter |
| P07 foreign Active | automated Chromium 1.55 | Inherited 8.26 real scenario on candidate |
| P08 same Flow continue | automated Chromium 1.55 + WebKit 1.64 | Existing same-Flow continuation path, no new run |
| P09 removed Object | not yet verified | Requires missing-reference browser fixture |
| P10 invalid Flow | not yet verified | Requires bounded validation/browser tests |
| P11 rapid double action | partially automated Chromium 1.55 + WebKit 1.64 | Existing immediate repeated Flow request; rapid UI double-tap still required |
| P12 reload | automated Chromium 1.55 | Persisted active Flow reference unchanged |
| P13 offline | automated Chromium 1.55 | Real browser offline flag, Object action and exact identity |
| P14 cancel purity | partially covered | Need dedicated cancel/escape save-history comparison |
| P15 responsive | automated Chromium 1.55 for 4 widths | Long custom Object CTA; screenshot optical review outstanding |
| P16 accessibility | not yet verified | Focus enlargement/reduced motion |
| P17 theme/locale | partially covered | English Object label passes; light theme and cold flash outstanding |
| P18 repeat Flow | not yet verified | Explicit repeat + new attempt provenance |
| P19 handoff | partially covered | Existing recorder mounted; focus/overlay optical proof outstanding |
| P20 latency | partial measurement | Real action-to-owner duration captured; multi-engine latency report outstanding |

## No false certification

No exact-head GitHub Actions suite was run and skipped checks are not treated as successful. No 8.32 merged-main Production verification, custom-domain approval, or separate Governance Seal exists yet. Do not merge or point `axis.juele.fun` at this Preview.
