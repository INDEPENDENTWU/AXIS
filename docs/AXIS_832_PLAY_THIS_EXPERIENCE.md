# AXIS 8.32a — Local PLAY THIS Experience Contract

**Stage:** entry/interaction audit and release-blocking experience specification; **no 8.32 code is shipped by this stage**. Delivery: [#172](https://github.com/INDEPENDENTWU/AXIS/issues/172). Design-quality authority: [EXPERIENCE_QUALITY_STANDARD.md](EXPERIENCE_QUALITY_STANDARD.md).

**Certified product baseline:** 8.31 exact runtime `dddce5401e80087a7ccceb43ec466f1ad7abb505`; independently certified via governance main `f0cd8fbd86d1d63b7b8b14e705abbfed1ff2843b`. 8.31 certificate remains authoritative. Version decision **sequence 32 / 8.31 confirm** remains unchanged in this **documentation-only** 8.32a PR. The first 8.32 executable/runtime PR must separately make the **sequence 33, 8.31 → 8.32, bump, product-runtime** decision and update all version/governance/build authorities.

## Product decision

**PLAY THIS should feel like beginning, not configuring.** Make existing Objects and Flows *immediately actionable from their existing surfaces*, then yield execution to the established recording/Active owner. Do not add a PLAY THIS landing page, a new bottom tab, a persistent command palette, a gamified progress tracker, a miniature Flow editor or a second recording interface.

- **Single Object:** when the exact Object is resolvable and there is no conflicting session, give it an inline, familiar **开始练习** action leading directly into the canonical existing Quick Record/Active pathway. Do not require a second preview sheet just to repeat the Object name.
- **Saved Flow:** retain the existing Home Flow section and Flow sheet. Provide a **开始练习** action that deliberately enters the first *real executable item* after validating the whole bounded Flow intent. A compact inline summary may show the actual ordered item names; do not duplicate the existing Flow hub.
- **Continue:** an in-progress Flow or Active activity owns the visible primary action (**继续当前练习**). A different Flow/Object offered elsewhere must not silently override it. This is a deliberate, legible conflict—not an invitation to abandon facts.
- **Two-action admission:** from a visible entry, normal no-conflict Object or Flow should require at most two deliberate taps to reach a usable canonical Recorder/Active surface. Record actual actions in real browsers. The **start** action is an intention; only canonical committed Encounters are facts.
- **No network dependency:** offline from cold start remains usable. Optional camera, AI, sensor, account or cloud failure cannot block local practice.

## Real existing entry/owner audit

| Existing source and affordance | Actual operation today | 8.32 bounded handoff |
| --- | --- | --- |
| `index.html#eqSheet`; `app.js` `renderEqList()`, `selectEq(id,true)`; 8.30 catalog identity convergence | Existing Object selection affects the current recording context; identity must remain canonical | Add one product-facing action **within the current Object/selection context**. No replacement library, no `baseId`/same-name alias attribution |
| `prepare-821-flow-user-surface.mjs` `axis821FlowSurfaceRenderHome()` (`#axis821FlowHome`, `[data-axis-flow-start]`), `axis821FlowSurfaceRenderHub()` (`#axis821FlowSheet`) | Saved Flow entry launches intent; `axis821FlowSurfaceRecord()` separately invokes `selectCurrent()` + `window.__AXIS_QUICK_RECORD__.openFor(ref)` | Reuse Flow surface and single presentation owner. The explicit PLAY THIS action may coordinate validated canonical steps to open the *existing* Recorder; cannot claim the Flow launch itself is an Encounter |
| `prepare-821-flow-runtime.mjs` `window.__AXIS_FLOW_RUNTIME__`, `launch`, `current`, `selectCurrent`, `advance`, `run` | Canonical app-owned Flow definitions/run live in `axis_v60_state` | No second FlowRun, no synthetic progress; each step must still be traced to exact canonical Object and committed Encounter |
| `scripts/prepare-831-playable-integration.mjs` `window.__AXIS_831_PLAYABLE__` | Exposes `project(spec,attemptId)`, `plan(projection,action,requestId)`, `dispatch(spec,attemptId,command)` over the existing app owner | UI uses a single stable, bounded attempt reference and current owner snapshots; read-only preflight before each explicit dispatch |
| `lib/axis-playable.mjs` `compilePlayableSpec` | Pure portable compiler exists as source module; **it is not exported as a browser UI compiler on the existing `window.__AXIS_831_PLAYABLE__` bridge** | 8.32b must supply a narrowly scoped canonical compilation adapter (or safely compiled intent projection) before exposing a button; cannot fabricate specs or secretly fetch them |
| `lib/axis-playable-execution.mjs` `projectPlayableExecution`, `planPlayableCommand`, `dispatchPlayableCommand` | Pure command planner blocks mismatched/foreign owner and rejects stale requests; returns truthful acknowledgement | Do not treat `accepted` as a committed workout; re-project after every owner action; resolve stale/`not-confirmed` without repeat side effects |
| `styles/axis-821-active-home.css`; `styles/axis-829-recording-friction.css` | Shipped flat Home rail, optical hierarchy, existing Active/Recorder content, stable dock/safe-area controls | Presentation inherits actual compiled style, spacing/rails/accent hierarchy; no elevated duplicate “experience card”, visual reset or alternate timer |

### Findings that block naive implementation

1. **Flow launch ≠ record start.** Current `axis821FlowSurfaceStart(id)` calls `api.launch(id)` then renders Home; `axis821FlowSurfaceRecord()` opens the recording owner separately. A smooth one-action orchestration still has to wait for each true owner acknowledgement, never bypass a state conflict and never fabricate completed work.
2. **Old Flow switch semantics are not an admission contract.** Today an active *other* Flow can prompt before `api.launch(id)`. New PLAY THIS must stop before any destructive/switching owner call and show an explicit, non-destructive recovery option. Returning to the active practice is the safe default.
3. **Compiler exposure is missing.** The browser bridge imports the pure *execution* core, not the `compilePlayableSpec` module. A “button-only” patch would be structurally incomplete; plan the smallest safe compiler adapter and test compile parity against native/custom/Flow cases first.
4. **Object selection does not prove execution.** `selectEq` may set recording context while the canonical Session/Recorder is not yet ready. New UI must wait for owner entry and must never paint success because an Object became selected.
5. **Rendering flow must not create facts.** Existing `axis:flow-encounter-committed` only notifies post-commit; do not derive Encounter acceptance from an optimistic action, idle timer, local UI state or historical name matching.
6. **Aesthetic owner exists already.** `#axis821FlowHome`, `#axis821FlowSheet` and the Active stage own their current composition. The 8.32 entry can add a small, clear action *inside* these surfaces, not a fourth top-level home section.

## One UI owner, one truthful route

**Proposed presentation owner for 8.32b:** a single narrow app-integrated PLAY THIS presentation/coordinator attached to existing Object and Flow entrypoints, with **no independently authoritative durable state**. Compile/plan and delegate through existing `axis.playable.v1` and 8.31 bridge; the app's existing Flow/Active/Recorder/Encounter owners retain every factual write. No background observer or second click interception layer.

Sequence for a saved Flow:

1. The person sees a valid Flow name and short step chain on the existing Home rail; its primary action is **开始练习** (not “deploy”, “compile” or “generate”).
2. Read the canonical Flow definition, exact Object catalog and current Flow/Active ownership. Compile bounded intent locally; if an Object is missing, display a recoverable missing-item state without altering the live Flow.
3. On explicit start, preflight with 8.31 projection. If any current practice conflicts, stop before `launch`/`selectCurrent` and show the existing session with **继续当前练习**. Switching is a separate later intentional policy, not an implicit side effect.
4. Dispatch valid existing Flow/Playable commands sequentially **only after read-back of the current canonical owner**. Then hand off to `window.__AXIS_QUICK_RECORD__.openFor` or the existing Active path, never a new recording UI.
5. The UI stops claiming ownership. Completion, Flow advancement and post-reload state come only from canonical Encounter provenance and FlowRun owner.

Sequence for a single Object:

1. From the visible canonical Object context, `开始练习` validates an exact native/custom ID, checks Active conflict and compiles a one-step Object Playable intent locally.
2. Delegate selection/entry to the current app/Recorder pathway; one user action may coordinate safe owner steps, but the action cannot itself commit an Encounter.
3. If recorder entry is unavailable, show a specific retryable state with **no changed historical facts**. Reload must reconstruct the last real owner state, not resurrect a decorative UI “attempt”.

### State → visible treatment

| Canonical condition | Primary treatment | Allowed action and facts |
| --- | --- | --- |
| Valid Object or saved Flow, no active conflict | One native **开始练习** button, quiet metadata | Explicit start → existing owner; no preview writes |
| Same Flow/Object already executing | **继续当前练习**, no duplicated start | Resume existing owner, never create another Encounter |
| Different Active or FlowRun exists | Clearly identify **当前练习进行中**, primary **继续当前练习**; new entry disabled/secondary | Must not call `launch` or replace/finish current activity |
| Missing/unresolved Object or invalid Flow | Explicit “项目暂不可用” with return/edit action | No guess-by-name, no fallback `baseId`, no write |
| Pending owner command | Single disabled pending action, stable height | No double dispatch; recover only from reprojected canonical state |
| Stale/owner-rejected command | Non-blaming explanation and safe retry/return | Re-snapshot and replan; no automatic blind replay |
| Finished Flow with confirmed Encounters | Quiet “已完成” based on canonical facts | Separate deliberate repeat; never reuse old completion as a new attempt |
| Offline/reload/reduced motion | Same affordance and truthful state | No network, no duplicate timer, no secondary durable attempt |

## Visual composition (build against existing AXIS, not a new card)

### Object — inline action

`Object name / exact identity` remains the heading and `metric type · last confirmed context` stays subordinate. One full-width or rail-aligned primary action **开始练习**, alongside at most one *quiet* detail action if existing surface needs it. The button aligns to original Object controls, no new elevation or invented success chip.

### Flow — same Home section

Use the current `#axis821FlowHome` separator rails and headline style; show a legible Flow name and restrained step chain, followed by one primary **开始练习** or **继续当前练习**. Existing “管理/编辑” remain secondary. At narrow width, metadata can wrap naturally; primary action cannot be clipped or pushed under the capture dock.

### Active and Recorder — hand off completely

The moment the established Active/Quick Record becomes interactive, the PLAY THIS entry stops projecting a competing action. Do not add a timer, another “complete” control, a floating dock, multi-stage transition animation or an overlay above existing recording actions.

### Geometry and polish acceptance

- **One rail** with existing `var(--line2)` separators, semantic colors and current AXIS type scale; dark, light and system preference must match first paint.
- **One primary action**, no primary/primary duel, no heavy nested card, no decorative radial glow.
- Stable control rows and text: 320/360/390/430px, long localized name and 200% text scaling; no horizontal overflow, clipped characters, touch occlusion or late vertical jumping.
- Keyboard-visible focus, at least 44px hit area, meaningful pressed/pending/disabled states, one-handed reach, and safe-area/dock avoidance.
- Reduced motion keeps factual transitions while removing ornamental ones. Optical spacing and icon/text baselines require screenshot inspection.
- Record real Chromium and iPhone-like WebKit **before/after** state and screenshots in required locales/themes; static checks alone do not pass an aesthetic review.

## 8.32b allowed files and retirement boundary

Expected touchpoints are the existing canonical app integration path and the existing Object/Flow presentation ownership; a pure compiler bridge is permitted if it preserves `axis.playable.v1` semantics and is confined to the single runtime. Source changes must be scoped after a search for the final historical build injection ordering.

Never add `axis_play_this_state`, new Session/Encounter writers, an alternative Active controller, a new top-level page, permanent observer, second Flow record control, redundant media/network owner or a parallel temporary “resume” store. If an earlier visible start action is superseded, explicitly retire its click path in the same PR, with source and browser tests proving there is one action owner.

## 8.32a admission and next handoff

- **This stage:** source-grounded entry audit, single-owner design, the product-wide [experience standard](EXPERIENCE_QUALITY_STANDARD.md), and [Gherkin acceptance scenarios](../tests/acceptance/axis-832-play-this.feature). No product bump and no claimed 8.32 UI.
- **8.32b:** next new product-runtime iteration with **decision sequence 33 / 8.31 → 8.32 bump**. Implement exact compiler bridge and bounded user surface, then add executable scenario runner and real browser tests. Before merging, ensure original `docs/CURRENT_WORK.md`, governance metadata, ownership/retirement notes and canonical build all describe **8.32 candidate** consistently.
- **8.32c:** Chromium/WebKit real interaction, timing and screenshot acceptance of Object, custom Object, Flow, Active conflict, offline, reload, double taps and focus; defects must be corrected in the exact Head.
- **8.32 Final:** exact-head green → expected-SHA merge → exact merged-main Vercel Git Production, EdgeOne and `axis.juele.fun` proof → separate governance-only Production seal.

The version decision, product release and current runtime authority are **not** changed by this contract-only stage. Failure to satisfy visual or interaction evidence is an acceptance blocker, not a styling TODO.
