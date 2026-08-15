# AXIS Engineering Playbook

This document defines how AXIS is built, changed, tested, and released. It is the operating contract for the product, not a retrospective and not a style guide that can be ignored when convenient.

The central rule is simple:

> One product surface has one interactive owner. Later code may extend data or decorate a surface, but it may not silently create a second implementation of the same interaction.

AXIS has accumulated useful capability through many iterations. The objective is to preserve that capability while converging the implementation so the product behaves like one deliberately engineered system rather than a stack of historical patches.

---

## 1. Product definition

AXIS is a camera-first fitness memory tool. It should make a real workout easier to remember, continue, compare, and prove without turning training into a planning application.

The product has six primary jobs:

1. **Capture the real workout.** Photo/video capture, timestamp sealing, equipment recognition, and final watermarking must remain fast and available even when AI is unavailable.
2. **Record the minimum useful training data.** Strength: equipment, sets, weight, reps. Cardio: duration and intensity. Users should be able to record partial memory instead of being blocked by perfect-form requirements.
3. **Maintain training continuity.** Current activity, completed sets, elapsed/estimated time, paused work, and continuation should remain coherent across the session.
4. **Build personal equipment memory.** Confirmed or custom equipment becomes easier to reuse and recognize.
5. **Turn history into useful evidence.** Trends, coverage, comparable records, rhythm, reports, and one useful next signal are outputs of the accumulated record.
6. **Produce durable media and shareable evidence.** Saved photos/video and training reports should be visually coherent with AXIS and should not depend on a successful model call.

A feature that does not improve one of these jobs needs a strong reason to exist.

---

## 2. Product principles

### 2.1 Recording beats configuration

The fastest valid path is more important than the most configurable path. Defaults, previous values, remembered equipment, and automatic estimates should do most of the work.

Configuration exists to correct AXIS, not to make the user configure AXIS before every workout.

### 2.2 Local-first, fail-open

Workout state and media remain useful when the network, AI provider, feature bundle, or optional UI fails. AI can improve recognition and judgment; it must not own the ability to record a workout.

### 2.3 Evidence before dashboards

AXIS should prefer concrete evidence—what was done, what changed, what was captured—over generic charts and motivational summaries.

### 2.4 Calm visual hierarchy

Hierarchy comes from spacing, scale, surface, contrast, and alignment before it comes from separator lines. A line is used only when two adjacent objects would otherwise be ambiguous.

### 2.5 Interaction quality is a feature

A visible flash, reflow, double action, moving control, or delayed correction is a product defect even if the final stored value is correct.

---

## 3. Evolution and lessons

AXIS evolved from a compact local workout recorder into the current 8.7.x product through a sequence of capability layers. The layers are still visible in the repository because keeping working behavior was safer than repeatedly rewriting the product.

Broadly:

- `app.js` established the local state model, capture workflow, equipment selection, strength/cardio fields, sessions, history, settings, and basic insight.
- `v61.js` introduced the forgiving quick-record path and richer set-level strength data.
- `v82` through `v872` added activity timing, reminders, media/canvas handling, gesture and interaction behavior, session continuity, and stability work.
- `v873` through `v875` expanded the exercise library, smart input, professional/custom-equipment detail, set bridging, and visual polish.
- `v876` through `v879` added richer product controls, catalog/report/watermark behavior, active-session editing, layer handling, and additional polish.
- `v8710` separated several product domains into dedicated modules: live catalog, sonic system, report, and watermark.
- `v8711` hardened the stable experience and established the base that later feature work can fall back to.
- `v8712` moved new product work behind a non-blocking feature kernel and then added a small completion layer for interaction cleanup.

The important lesson is not that the older layers were mistakes. They preserved capability while the product was moving quickly. The problem appears when two generations remain active owners of the same interaction.

The recurring defect classes have been:

- multiple runtimes painting the same control;
- a later runtime observing a subtree that an earlier runtime frequently rebuilds;
- runtime CSS changing critical geometry after first paint;
- duplicate actions created by different generations of the active-session UI;
- child sheets that close correctly but lose the user's parent context;
- version or shell state being rewritten by multiple modules;
- optional feature work accidentally becoming a prerequisite for opening the product.

The current architecture and gates exist specifically to prevent these classes from returning.

---

## 4. Runtime architecture

### 4.1 Stable core

The hardened core is the only code required for AXIS to become interactive.

Current core modules:

- `app.js`
- `v61.js`

The core owns:

- local workout state compatibility;
- initial shell behavior;
- the base recording workflow;
- quick recording;
- the canonical strength draft used by save;
- the first interactive paint.

`window.__AXIS_CORE_INTERACTIVE__` means the product must already be usable. It must not mean “the loader is visible and more code is required.”

### 4.2 Stable enhancement chunks

Historical capability is loaded in four bounded chunks after the core is interactive:

- **foundation** — activity/timing/media/gesture/stability foundations;
- **recording** — exercise library, smart input, professional logging, set bridge, polish;
- **interaction** — later interaction/product behavior that is still part of the verified stable base;
- **product** — live catalog, sound, report, watermark, and 8.7.11 product behavior.

Every module is isolated by the hardened build. A module error is recorded and cannot execute outside its wrapper.

### 4.3 Optional 8.7.12 feature

`v8712-runtime.js` loads only after the stable kernel completes successfully. It is non-blocking and fail-open. Network or runtime failure must leave the verified 8.7.11 experience usable.

### 4.4 Completion shell

`v8712-completion.js` is intentionally small. It owns only cross-surface cleanup that cannot belong to a domain module yet:

- nested-sheet return semantics;
- legacy watermark-corner cleanup;
- removal of obsolete sound audition controls.

It does **not** own recording, critical geometry, global loading state, or runtime CSS.

---

## 5. Surface ownership matrix

| Surface / capability | Canonical owner | Allowed collaborators | Explicitly forbidden parallel owner |
|---|---|---|---|
| Boot / loading / core-ready state | hardened kernel | feature/completion may read readiness | any feature changing global loading/hydration |
| Release/version display | hardened release owner | modules may read `__AXIS_RELEASE__` | observers fighting over `.versionLine` |
| Base local workout state | `app.js` | domain modules through compatible stored state | independent shadow copy treated as source of truth |
| Strength draft + save data | `v61.js` | set bridge/history may read data | another runtime maintaining a competing set draft |
| Strength high-frequency controls | `v61.js` | static CSS only | `v879`, completion, or feature repainting weight/reps controls |
| Strength set-row selection | `v61.js` | analytics/read-only decorators | re-rendering owner on selection |
| Equipment library | `v873-exercise-library.js` | live catalog and recognition adapters | private duplicate catalog with incompatible IDs |
| Live catalog presentation | `v8710-live-catalog.js` | library data | legacy hidden DOM as the visible catalog |
| Active training execution | `v87-runtime.js` + verified activity state | later modules may decorate/extend one action path | duplicate “adjust” / “finish” / “pause” entries |
| Session timeline compaction | `v879-runtime.js` | active state | recording-painter responsibilities |
| Sound generation | `v8710-sonic-core.js` / motifs | sound UI, reminder preferences | multiple audition/test UIs |
| Report product | `v8710-report.js` current product contract | historical report data/readers | independent report entry points for same output |
| Watermark output | `v8710-watermark.js` current output contract | v8711 placement controls, compatibility prefs | multiple visible position-control layers |
| Sheet open/close | base sheet owner | completion adds parent-return semantics | child sheet inventing its own unrelated navigation stack |
| Critical geometry | static bundled CSS contract | domain CSS for non-critical decoration | late runtime CSS changing core control dimensions |

When a new implementation replaces an old owner, retirement is part of the same change. “The old one is probably hidden” is not retirement.

---

## 6. Recording architecture

Recording is the highest-frequency and highest-value AXIS interaction. It has stricter rules than ordinary settings pages.

### 6.1 Canonical strength draft

`v61.js` owns the live strength draft. That draft is what the save path commits. Any visible weight/reps control must mutate this draft directly.

The public bridge is intentionally narrow:

```js
window.__AXIS_RECORDING__ = {
  snapshot(),
  adjust(kind, direction),
  set(kind, value),
  select(index)
}
```

This API exists to prevent future layers from synthesizing hidden buttons, scraping text, or maintaining a second draft.

### 6.2 High-frequency mutation rule

Changing weight, reps, or selected set must update the smallest stable DOM subtree.

For weight/reps:

- mutate the draft;
- update the two numeric text fields and delta label in the active row;
- synchronize the underlying compatibility fields;
- update the control input;
- emit the recording-change event.

It must **not** replace `#v8Sets.innerHTML`, recreate `.v8SetRow`, or ask an observer to repaint the control.

A structural change such as adding/removing a set may rebuild the set list, but there must still be one render pass and one owner.

### 6.3 Anti-flicker invariant

The browser regression test stores the active `.v8SetRow` node, performs a weight/reps change, and requires the exact same node object afterward.

That is stronger than checking the final value. A UI can end with the correct number and still visibly flash if it was destroyed and recreated.

### 6.4 Direct input

Exact numeric input is a first-class capability, not a hidden advanced mode. The canonical stepper contains a numeric input so direct editing does not require a second modal implementation.

### 6.5 Legacy recording retirement

Historical `.v8Adjust` markup can remain in the compatibility DOM until source cleanup is complete, but it is not visible and it is not an interactive owner.

`v879` must not:

- repaint `.v8Adjust`;
- observe `#v8Sets` to recreate controls;
- create a second strength-adjustment draft.

---

## 7. Active-session controls

The active session should answer four questions immediately:

- what is active;
- how long it has been active;
- what has been completed;
- what is the next useful action.

Only one control may exist for each semantic action.

In particular, there must never be simultaneous visible actions such as `调整` and `调整一次` representing competing implementations of the same operation.

The regression gate counts visible adjustment actions in the active card. A duplicate is a release-blocking defect.

Historical edit sheets may remain dormant for compatibility while ownership is being removed, but no button may expose them once a newer canonical adjustment path exists.

---

## 8. Sheet navigation contract

AXIS uses sheets heavily. A sheet is not automatically a new root page.

### 8.1 Root sheet

A sheet opened directly from the main application has a close action. Closing returns to the application.

### 8.2 Child sheet

A sheet opened from another visible sheet receives a return action in addition to its close action.

Return must:

1. close only the child;
2. restore the parent;
3. restore the parent's scroll position;
4. preserve parent state and current controls;
5. not trigger a page render or reload.

### 8.3 Header geometry

Nested sheet header geometry is fixed:

- 44 × 44 px return hit target;
- title occupies the flexible center column;
- 44 × 44 px close target;
- both actions share a vertical centerline;
- no glyph is used as a substitute for geometry—the chevron is drawn inside the hit target.

The header dimensions are defined in first-paint static CSS, not injected after the child opens.

### 8.4 Event-driven navigation only

The return layer is event-driven. It must not use a document-wide `MutationObserver` to infer navigation continuously.

---

## 9. Visual system and geometry

AXIS is intentionally restrained. The goal is not decorative minimalism; it is precise information density.

### 9.1 Geometry tokens

Critical controls use a small fixed vocabulary:

- primary touch target: **44 px** minimum;
- numeric control height: **60 px**;
- standard control radius: **18 px**;
- principal two-column gap: **12 px**;
- compact mobile gap: **8 px**.

New arbitrary dimensions in a critical flow should be treated as a design-system change, not a local preference.

### 9.2 Typography

High-value changing numbers use tabular numerals. Weight and reps share the same typographic scale and baseline. Units are secondary, never visually equal to the number.

A field must not use several unrelated font sizes simply to make its subparts fit.

### 9.3 Alignment

For paired controls such as weight/reps:

- columns must have equal widths;
- control heights must match;
- numeric centers must align horizontally;
- left/right step targets must use the same geometry;
- labels must share a baseline;
- the pair remains two columns at normal phone widths instead of unexpectedly stacking.

Geometry is tested in Chromium with tolerance rather than judged only by screenshots.

### 9.4 Divider policy

Do not add a horizontal line because two things are adjacent.

Use a divider only when:

- adjacent rows are otherwise ambiguous;
- the divider communicates a real section boundary;
- spacing or surface change would consume materially more room.

Do not use a divider:

- above and below the same block;
- between a label and the control it labels;
- between elements already separated by a clear surface or large spacing;
- as decoration.

Existing settings, recording, watermark, and active-session surfaces should converge toward spacing/surface hierarchy as they are touched.

### 9.5 Critical CSS policy

Geometry that users can see during first interaction belongs in bundled static CSS:

- shell dimensions;
- recording rows and controls;
- sheet headers and return controls;
- active-session action geometry;
- critical visibility/retirement rules.

Runtime-injected CSS is reserved for genuinely optional visuals whose appearance cannot create layout shift in a primary flow.

---

## 10. Performance contract

Performance is defined by interaction stability as well as elapsed time.

### 10.1 Current hard gates

The existing browser gate enforces:

- core interactivity within 5 seconds under CI conditions;
- stable enhancement completion within 1.8 seconds after its scheduled start;
- settings-button geometry stabilization within 900 ms;
- synchronous shell clicks below their defined 180–250 ms hard budgets;
- repeated mobile cold boots plus desktop cold boot;
- a fully interactive 8.7.11 fallback when the optional 8.7.12 network request is forced to fail.

These are release-blocking upper bounds, not desired everyday latency.

### 10.2 High-frequency interaction target

Weight/reps/set selection should perform only local synchronous work and should normally settle within the same rendering frame on a current phone.

Do not solve a high-frequency interaction with:

- subtree replacement;
- a MutationObserver feedback loop;
- an artificial delay;
- a network request;
- a second modal unless the task genuinely requires additional context.

### 10.3 Observers

Every persistent observer must have:

- a named owner;
- the smallest possible target;
- a bounded callback;
- a documented reason it cannot be event-driven.

Observing the whole document body is forbidden in optional features. Observing a high-frequency subtree in order to repaint that same subtree is forbidden.

### 10.4 Timers

Permanent polling intervals are not a synchronization mechanism. Timers are acceptable for real time-based product behavior (for example elapsed time) with a clear lifecycle.

---

## 11. State and compatibility

### 11.1 Canonical stores

Current browser data uses the existing local storage/IndexedDB contracts. Compatibility matters because workout history is user data, not cache.

A refactor may change the implementation but must preserve readable historical state unless a migration is explicitly implemented and tested.

### 11.2 No shadow truth

A feature may cache a derived representation, but it must not become a second authoritative copy of workout state.

If two modules can both independently decide the current weight, current equipment, or current activity status, the architecture is already wrong.

### 11.3 IDs before names

Equipment identity should use canonical IDs where available. Names and aliases are presentation/search data. A visible name must not silently create a second logical equipment item when a canonical item exists.

---

## 12. AI boundary

AI is an enhancement boundary, not a product availability boundary.

- recognition can fail and manual confirmation still works;
- model/key/provider configuration is owner-managed, not an end-user setup task;
- workout media is not required for training-insight statistics;
- model changes must not alter local workout-state semantics;
- a failed AI request must not block saving.

See `docs/AI_BACKEND.md` for provider configuration.

---

## 13. Build-time convergence

The repository intentionally keeps historical source modules while the implementation is being converged. `prepare-legacy-runtime.mjs` is the compatibility boundary between source history and the production runtime.

It may perform narrowly specified, asserted rewrites such as:

- null-safe historical DOM helpers;
- retiring a superseded observer;
- retiring a duplicate interaction owner;
- exposing a stable bridge from the true data owner;
- removing a known recursion or version fight.

Every rewrite must:

1. match an exact expected signature;
2. fail the build if the signature is missing or duplicated;
3. have a post-rewrite assertion proving the retired behavior is gone;
4. log the number/category of rewrites;
5. preserve the capability through its canonical owner.

Build-time retirement is preferable to another runtime patch because the retired code never reaches the executing behavior in the production bundle.

Long term, once compatibility has remained stable across releases, the physically dead source can be removed and the build-time rewrite deleted.

---

## 14. Optional-feature contract

An optional feature must be able to disappear without making AXIS unusable.

It may not:

- own global loading/hydration;
- register or change service workers;
- force reload/navigation;
- replace `document.body` or the document root;
- create permanent intervals;
- observe the entire body;
- inject itself as the second owner of an existing product surface.

The 8.7.12 completion shell has stricter rules:

- no `MutationObserver` at all;
- no runtime stylesheet injection;
- no recording ownership;
- a 20 KiB source budget;
- only the explicitly declared cleanup/navigation responsibilities.

---

## 15. Regression gates

A release is not accepted because it “looks fine on one phone.” Critical behavior has executable invariants.

### Boot and fallback

- repeated mobile cold boot;
- desktop cold boot;
- core usable before optional features;
- forced optional-feature failure keeps the stable base interactive;
- no uncaught page errors.

### Recording

- exactly one visible strength-control owner;
- weight and reps both adjustable;
- exact numeric input commits;
- selected row node identity survives weight/reps changes;
- control geometry does not move during value change;
- set count changes exactly once;
- structural change does not duplicate the control surface.

### Navigation

- a child configuration sheet has exactly one return control;
- return target is 44 × 44;
- return and close actions align vertically;
- title does not collide with either action;
- return restores the parent and its scroll position.

### Active session

- one visible semantic adjustment entry;
- no retired `v879` duplicate action;
- pause/finish/current-state behavior remains available.

### Watermark and sound

- exactly four visible placement controls;
- legacy placement hit targets are inert;
- obsolete audition buttons do not reappear.

### Production

The deployed manifest must match the exact source commit and hashed immutable assets. Production browser verification runs when Vercel deployment protection permits the automation endpoint; protection itself is not classified as a runtime failure.

---

## 16. Release process

1. Start from the last verified `main`.
2. Work on an isolated branch.
3. Preserve user data and product capability by default.
4. If replacing an owner, retire the old owner in the same branch.
5. Add or strengthen a regression test for the defect class, not only the exact symptom.
6. Run the hardened build and repeated Chromium gate.
7. Fix the branch until all gates pass; never relax a product threshold merely to make CI green.
8. Merge only a validated head SHA.
9. Observe `main` Runtime Gate again after merge.
10. Observe Vercel Production deployment and production gate.
11. If production protection prevents external Chromium, record that limitation explicitly; do not misreport it as a browser pass.

---

## 17. Forbidden patterns

The following patterns require architectural review and are normally rejected:

- another versioned runtime rewriting an already-owned control;
- `innerHTML` replacement for a high-frequency numeric adjustment;
- a MutationObserver watching a subtree in order to redraw that subtree;
- hidden synthetic button clicks used as a cross-module API when a direct owner API can exist;
- multiple visible controls with the same semantic action;
- runtime CSS changing first-interaction geometry;
- version text observers competing with the release owner;
- full-body observers in optional features;
- reload as a state-synchronization technique;
- a new feature that can keep the app in a loading state;
- “temporary” duplicate UI without a retirement task and regression gate.

---

## 18. Incident-to-prevention map

| Observed failure | Root class | Permanent prevention |
|---|---|---|
| AXIS stuck on Loading after feature changes | optional code owned boot state | core-first hardened kernel + fail-open feature loader |
| Settings/nav temporarily unresponsive during hydration | enhancement work competed with shell | interaction-priority shell + synchronous click budgets |
| Weight/reps controls disappeared | newer UI targeted the wrong historical editor | canonical v61 recording owner + browser owner assertions |
| Weight/reps UI flickered on every +/- | v61 rebuilt the editor, later observers repainted it | in-place draft/DOM mutation + DOM-node identity gate |
| Multiple weight/reps UIs existed | v61, v879, completion all painted the same surface | build-time v879 retirement + completion recording ban |
| `调整` and `调整一次` both appeared | two active-session generations exposed the same action | retire v879 entry + visible semantic-action count gate |
| Watermark corners appeared twice | legacy hit targets and later visual controls both visible | one visible placement layer + inert legacy targets + test |
| Child config page had no reliable return | sheets were treated only as independent closable overlays | event-driven parent relation + scroll restore + geometry gate |
| UI moved after load | critical styling injected by later runtimes | first-paint static geometry contract |
| Version text fought between modules | multiple version writers/observers | single release owner + sanitizer assertions |

---

## 19. Convergence roadmap

The product is stable enough to converge incrementally without a high-risk rewrite.

### Phase A — active owner convergence

Current work:

- recording owner consolidated in `v61`;
- v879 recording observer/painter retired;
- duplicate active adjustment retired;
- critical geometry moved to static CSS;
- completion reduced to a narrow non-rendering shell.

### Phase B — CSS extraction

Move remaining critical runtime-injected CSS from historical modules into domain/static bundles when those surfaces are touched. Keep optional visual experimentation isolated from core geometry.

### Phase C — physical dead-code removal

After a verified compatibility window, remove functions that are permanently retired by the build sanitizer and reduce sanitizer rewrites correspondingly.

### Phase D — domain module boundaries

Converge historical version files into domain-oriented modules without changing product behavior:

- recording;
- activity/session;
- catalog/equipment;
- media/watermark;
- report/insight;
- sound/reminders;
- settings/navigation.

Do this behind existing regression gates. A large one-shot rewrite is specifically discouraged.

---

## 20. Definition of done

A change is done only when all of the following are true:

- the intended user problem is solved;
- no existing capability was silently removed;
- the surface has one clear owner;
- critical geometry is stable;
- high-frequency interactions do not rebuild unrelated DOM;
- the implementation has no new persistent observer/timer without a documented lifecycle;
- mobile and desktop browser gates pass;
- the relevant defect class has a regression assertion;
- feature failure still leaves the stable base usable;
- `main` passes again after merge;
- production deployment status is known.

No engineering process can make a non-trivial product mathematically incapable of every future bug. The goal of this playbook is stricter and more useful: every known AXIS failure class must have an owner rule, a build invariant, or a browser regression gate so the same class does not quietly return.
