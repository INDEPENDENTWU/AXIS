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

## 2026-10-13 — 8.32c regression debt correction and local-gate hardening

**Candidate PR #174 remains Draft and 8.31 remains Production-certified.** No new Preview deployment is requested. The product's correct 8.32 one-set behavior is **Active / plan complete**, not a fabricated inter-set rest timer. The 8.32-only adapter retains historical rest/warn/danger assertions for historical release versions and explicitly verifies the 8.32 active/no-phantom-rest truth; it also checks an eventual canonical finished Encounter rather than assuming synchronous metadata visibility. This avoids changing the real v87 writer just to satisfy old test timing.

On the isolated source clone of predecessor HEAD `dc8f0a18`, after applying the adapter changes, **103-step build passed** and **Chromium Playwright 1.55 tests passed**: inherited 8.8.2 full browser smoke (including second local visual-memory confirmation, Active plan-complete, manual finish, countdown cue), 8.31 confirmed Encounter provenance / reload / Flow advancement, 8.26 Active continuity, and 8.32 expanded Object/Flow entry. The expanded browser source also passed partial checks for exact identity collision, missing Object, invalid Flow, cancellation without new Encounter, reduced-motion preference, keyboard focus and zh-Hant labels. The code and tests are now staged as reviewed source changes; **a new exact-commit rerun is still required after committing**.

The local gate previously mutated the live working tree and required CHROME_BIN even when bundled Playwright Chromium was present. The repaired gate builds from an isolated exact-HEAD Git worktree, rejects dirty tracked source, allows bundled Chromium, includes the 8.31 Encounter browser regression, records exitCode for failures and only collects fresh screenshots. It does not invoke GitHub Actions or deploy.

**Remaining release obligations, not certified:** exact-new-HEAD Chromium/WebKit browser suite (WebKit 1.55 pinned in a compatible OS), full native-versus-native ID collision and actual recovery UI, confirmed offline Encounter save, Flow repeat / stale replay and cancellation, 4 viewport/theme/locale optical screenshot review, accessibility beyond basic focus/motion, Provider Production readbacks, and independent 8.32 Governance Seal. Production release is authorized only after gate evidence; do not count skipped CI as green. Future capability validation is to follow the existing controlled Production release path rather than creating extra Preview deployments.

## 2026-10-13 — Exact-candidate WebKit acceptance (not a Production seal)

Source: exact PR candidate `80d41aedac0b3aaa197f92f9859d8aef3884d197`, cloned in an isolated Vercel Sandbox from the public AXIS GitHub repository. Canonical `node build-release.mjs` completed all **103 deterministic steps**; 8.32 postbuild and Production governance *source contracts* passed. The governance contract describes the still-sealed **8.31** predecessor and does **not** certify 8.32 Production.

In a real headless WebKit browser via Playwright **1.64.0** (Ubuntu 26, dependencies installed), the following generated tests passed with process exit code 0 on the exact candidate source: `scripts/axis-831-playable-browser-smoke.mjs` (confirmed Encounter provenance, Flow advancement and reload), `scripts/axis-826-active-continuity-smoke.mjs` (canonical foreign Active preserved), `scripts/axis-882-smoke.mjs` (local visual-memory replay, Active completion, no phantom rest, manual finish and countdown cues), and `scripts/axis-832-play-this-browser-smoke.mjs` (native/custom identity, missing/invalid Flow rejection, cancellation purity, reduced-motion preference, focus, zh-Hant and English action labels, 320/360/390/430px Object CTA bounding boxes, offline Object entry and FlowRun persistence). Chromium Playwright **1.55** for these four suites passed separately on the exact same head using the isolated source-worktree local gate, `AXIS_LOCAL_ENGINES=chromium`; its evidence `status.json` recorded `exitCode:0` and `actionsUsed:false`.

**Compatibility caveat:** WebKit Playwright 1.64 is not the pinned 1.55 release used by the intended official CI. Do not present this as equivalent pinned-WebKit certification.

**Still open before AXIS 8.32 Production:** complete user-visible recovery affordances on active/invalid/missing states, genuine offline *confirmation* of Encounter rather than offline entry alone, P11 rapid real UI tapping, P12 partial-Encounter stale UI replay, P15 light-theme optical screenshot audit for every specified locale/width, P16 assistive-technology and font-enlargement audit, P17 no wrong-theme flash, P18 completed Flow explicit repeat, P19 handoff overlay/keyboard checks, P20 cold/warm measurements and source report, plus main-merged provider-domain readbacks and a new independent Governance Seal. Do not silently convert this partial acceptance into a passing 20/20 claim.

**Release decision:** Keep PR #174 Draft and existing 8.31 Production intact. User requested direct official releases when a capability is genuinely ready; no new Preview deployments were created as part of this run. Next work is **8.32c completion → 8.32d release-quality visual and interaction closure → exact merged-main Production certification**, with deployment only after these remaining gates pass.

## 2026-10-13 — Exact-source Flow repeat and offline-owner validation

**Product source SHA:** `8395eb10798d9bf9e277350924bb27c0cb840e4d`. PR #174 remains Draft. AXIS 8.31 remains the only Production-certified release.

The acceptance entry `scripts/axis-832-local-gate.sh` completed with **exit code 0** after checking out this exact HEAD in an isolated, clean Git worktree (no generated-file contamination). It executed the canonical **103 deterministic build steps**, the 8.32 source/postbuild contracts, Production governance *source* contract, and five browser suites in **both Chromium and WebKit**:

- `axis-831-playable-browser-smoke`: exact existing-owner Encounter, Flow provenance, reload and advancement.
- `axis-826-active-continuity-smoke`: protection of an in-progress foreign Active.
- `axis-882-smoke`: personal visual memory, no phantom rest on plan completion, manual finish, countdown and historical continuity.
- `axis-832-play-this-browser-smoke`: native/custom entry, identity collisions, missing/invalid Flow, cancellation purity, offline entry, 320–430px geometry, partial focus/reduced-motion/locale assertions.
- `axis-832-real-world-browser-smoke`: offline browser state with **canonical Active Encounter actually committed** by the existing 8.31 owner; exact Flow provenance and post-reload history; **real Home `再来一次` button click**, new FlowRun ID and new Encounter ID, earlier history preserved and immediate repeated activation idempotent.

The source fix is limited to 8.32's presentation coordinator: an explicit request on a **completed** Flow uses the existing Flow runtime `launch(id)`, retaining non-destructive foreign/active conflict protections. No new persistence namespace, writer or synthetic Encounter is introduced.

**Local gate evidence:** `/tmp/axis-832-evidence-8395eb10798d/status.json`, recorded exact product HEAD `8395eb10798d9bf9e277350924bb27c0cb840e4d`, engines `chromium webkit`, `exitCode:0`, `actionsUsed:false`, `productionCertified:false`. The sandbox execution used **Playwright 1.64.0**; the official pinned WebKit 1.55 compatibility gate remains separate and has **not** been claimed as passed.

**Coverage limitations:** P13 now proves a genuine offline stored Encounter through canonical owner dispatch and reload, but not the full offline Recorder **UI confirmation** sequence. P18 now proves real Home repeat; P11 rapid physical UI double-tap is not separately established. P15 screenshots are captured but still require optical light/dark/locale review. P16 full accessibility, P17 theme-first-paint, P19 focus/overlay handoff, P20 measured cold/warm performance, and complete 20/20 runnable scenarios remain release gates.

**Release state:** No new Preview, Production alias switch, merged-main certification, domain promotion or independent 8.32 Governance Seal. Continue 8.32c remaining experience/acceptance work before 8.32d release certification and subsequent controlled Production release.

## 2026-10-13 — 8.32d-1 accessible entry and Recorder handoff evidence

**Exact tested Product HEAD:** `4acc6e112a879590146ef1e63a4600c623b96418`. PR #174 is still Draft. Production remains certified **8.31**, unchanged.

Two real accessibility regressions were reproduced before remediation:

1. When a focused Object catalog action was rerendered by a search/catalog refresh, the focused DOM node was replaced and keyboard focus disappeared. The 8.32 catalog presentation wrapper now preserves focus by exact Object ID only when the same button survives the rerender; it does not steal focus from the search field or generate a second catalog.
2. The actual existing Recorder opened and the Object picker closed, but active focus remained on `document.body`. The 8.32 entry now transfers focus *after the sheet becomes visible*, with at most two animation frames of retry, and **never moves focus if the user is already interacting inside the Recorder**. No second Recorder, writer, storage key, timer or network owner is created.

The P16/P19 real browser test now asserts that focus survives catalog refresh, that the Object picker is closed, that exactly one Recorder and capture owner are mounted, and that focus is within the Recorder when it becomes interactive.

The 8.32 Object controls now use the existing `--axis-ui` font token with bounded CSS scaling instead of hardcoded 11–12px typography. Labels can wrap without clipping while retaining 44px minimum targets; a 320px / enlarged `--axis-ui:24px` / English `Start practice` acceptance sample verifies computed font size, full control geometry, no horizontal overflow and screenshot capture.

**Exact-source local gate proof:** on SHA `4acc6e112a879590146ef1e63a4600c623b96418`, the isolated worktree `scripts/axis-832-local-gate.sh` ran the canonical 103-step build, required source and governance contracts, and five historical/current browser suites in **both Chromium and WebKit Playwright 1.64**. `/tmp/axis-832-832d-4acc6e112a87/status.json` reports `exitCode:0`, `engines:"chromium webkit"`, `actionsUsed:false`, `productionCertified:false`. P16 enlarged text and P19 focus handoff passed in both engines.

**Not certified:** pinned WebKit 1.55 compatibility, actual human optical review of four viewport/theme/locale screenshot pairs, full assistive technology reading/focus order, supported light-theme first paint (the existing app is predominantly dark), strict 20/20 automation and Product Production provider readback. A green local smoke gate **is not** a Production seal. No new Preview or Production deployments were requested.
