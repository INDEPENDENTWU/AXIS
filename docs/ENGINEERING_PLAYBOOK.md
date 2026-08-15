# AXIS Engineering Playbook

This document defines how AXIS is designed, changed, tested and released. It is the operating contract for future work.

The central rule is:

> One product surface has one interactive owner. Preserve useful capability, retire competing writers, and ship one deliberate product rather than a stack of historical patches.

For current release identity and exact ownership, read [`CURRENT_RELEASE.md`](CURRENT_RELEASE.md) first. For release-blocking runtime invariants, read [`RUNTIME_CONTRACT.md`](RUNTIME_CONTRACT.md).

---

## 1. Product definition

AXIS is a camera-first fitness memory tool. It makes a real workout easier to capture, remember, continue, compare and prove without turning training into a planning application.

The product has six primary jobs:

1. **Capture the real workout.** Photo/video capture, timestamp sealing, equipment recognition and final watermarking remain useful even if AI/network services fail.
2. **Record the minimum useful training data.** Strength: equipment, sets, weight, reps. Cardio: duration and intensity. Partial memory is valid; the product must not demand perfect-form logging.
3. **Maintain training continuity.** Current activity, elapsed time, completed sets, pause/resume, rest state and continuation stay coherent through a session.
4. **Build personal equipment memory.** Confirmed and custom equipment becomes easier to find, reuse and recognize.
5. **Turn history into evidence.** Trends, coverage, comparable records, rhythm, reports and one useful next signal come from accumulated real records.
6. **Produce durable evidence.** Saved media and training reports remain visually coherent and do not depend on a successful model call.

A feature that does not improve one of these jobs needs a strong reason to exist.

---

## 2. Product principles

### 2.1 Recording beats configuration

The fastest valid recording path is more important than the most configurable path. Defaults, remembered equipment, previous values and automatic inference should do most of the work.

Configuration exists to correct AXIS, not to make the user configure AXIS before every workout.

### 2.2 Local-first, AI-enhanced

Workout state is useful without the network. AI may improve recognition, classification and judgment but may not own the ability to save a workout.

### 2.3 Evidence before dashboards

Prefer concrete evidence—what was done, what changed, what was captured—over generic charts, scores or motivational copy.

### 2.4 Calm information density

AXIS is restrained but not empty. Hierarchy comes from spacing, scale, surface, contrast and alignment before separator lines or decorative cards.

### 2.5 Interaction quality is product quality

A flash, duplicate action, moving control, delayed correction or temporary old UI is a defect even if the final state becomes correct.

### 2.6 Ordinary language outside, precision inside

Internal data can be technical. User-facing language should be concise and direct. For example, precise geolocation can be stored internally while the UI shows a useful Chinese place name rather than raw latitude/longitude/accuracy.

---

## 3. Architecture after 8.8 consolidation

AXIS accumulated capability across `app.js`, `v61.js`, `v82`…`v8712`. Those files remain useful implementation history and compatibility inputs, but **the production browser no longer runs them as staged product versions**.

AXIS 8.8 is packaged as a **canonical single runtime**:

```text
historical/compatibility sources
        ↓
exact build-time convergence and retirement
        ↓
canonical owner assertions
        ↓
postbuild-88-canonical.mjs
        ↓
axis-core.js?v=<hash>   +   axis-style.css?v=<hash>
        ↓
one AXIS 8.8 production runtime
```

The browser must not experience:

```text
8.7.11 shell
→ old enhancement chunk
→ later enhancement chunk
→ optional 8.8 feature
→ cleanup layer
```

That topology caused visible version mixing and timing-dependent ownership conflicts. It is retired as a production delivery mechanism.

Historical modules may remain separate in source so their valid capabilities can be converged safely. In production they are compiler inputs, not independently fetched releases.

---

## 4. Surface ownership matrix

| Surface / capability | Canonical owner | Forbidden parallel behavior |
|---|---|---|
| Release identity / canonical readiness | canonical runtime | historical module rewriting `__AXIS_RELEASE__` or visible version |
| Base local workout state | `app.js` | shadow authoritative state |
| Strength draft / weight / reps / set selection / save | `v61.js` | second draft or observer-driven repaint |
| Equipment library | `v873-exercise-library.js` | incompatible private catalog IDs |
| Custom search/ranking | `v873-smart-input.js` | writing editor type/muscle truth |
| Custom professional classification | `v874-professional.js` | second custom inference/selection owner |
| Custom persistence/open/delete | `app.js` | Settings-only editor/store |
| Active training execution | `v87` activity state | duplicate pause/finish/complete controls |
| Active adjustment | canonical `#v87AdjustBtn` -> v879 transaction | `#v8710EditOnce`, old `#v879EditBtn`, another edit transaction |
| Live catalog/search presentation | v8710 live catalog | active-session editor ownership |
| Timeline compaction | v879 | recording draft ownership |
| Sound | v8710 sonic core/motifs/UI | duplicate audition/reminder UIs |
| Report | v8710 report | competing report entry/output |
| Watermark | v8710 watermark + converged Settings | raw coordinate presentation or duplicate placement UI |
| Sheet navigation | base sheet semantics + embedded completion return behavior | independent navigation stacks / document-wide inference |
| Critical geometry | bundled static CSS | late runtime geometry replacement |

If a new implementation replaces an owner, retirement of the previous writer is part of the same change.

---

## 5. Recording architecture

Recording is the highest-frequency AXIS interaction and has the strictest rules.

### 5.1 Canonical strength draft

`v61.js` owns the live strength draft. The visible controls and save transaction use that same truth.

The bridge is intentionally narrow:

```js
window.__AXIS_RECORDING__ = {
  snapshot(),
  adjust(kind, direction),
  set(kind, value),
  select(index)
}
```

Do not scrape rendered text or synthesize hidden buttons to communicate between new modules when a direct owner API can exist.

### 5.2 High-frequency mutation

Weight/reps/set selection should update the smallest stable subtree. A value change must not destroy and recreate the active set row.

Structural changes such as adding/removing a set may rebuild the list once, but there is still one owner and one render pass.

### 5.3 Exact input is first-class

Users can directly enter numeric weight/reps values. Direct input is not an “advanced mode” and must commit into the same canonical draft as step controls.

### 5.4 Group plans are transactions

A group plan previews a complete set sequence and then commits atomically through the recording owner. It must not auto-seed a competing historical draft behind the visible controls.

---

## 6. Custom exercise / equipment architecture

Custom exercise creation is one shared product surface regardless of entry point.

Entry points include:

- equipment search;
- Quick Record;
- Settings → My Equipment;
- editing an existing custom item.

All routes open the same canonical editor and persist to the same `profile.customEq` state.

Expected behavior:

1. The user enters a name.
2. AXIS automatically infers a useful professional type and muscle details when possible.
3. The automatic result is immediately valid persistence state, not presentation-only decoration.
4. The user can add/remove details on top of the inference.
5. Tapping a body region expresses real selection intent.
6. A visibly selected result must never be rejected by save validation.
7. Search/ranking does not become an editor state writer.

Avoid explanatory microcopy such as “自动 / 已调整 / 手动” unless it materially changes the user's next action.

---

## 7. Active-session architecture

The active card must immediately answer:

- what is active;
- how long it has been active;
- what has been completed;
- what the next useful action is.

Exactly one visible control exists for each semantic action.

The canonical adjustment action is `#v87AdjustBtn`. It opens the v879 adjustment transaction. The older v8710 “adjust once” implementation is physically retired from the executing canonical artifact, including its polling and click routing.

A transient frame containing two `调整` controls is release-blocking even if one disappears 60 ms later.

---

## 8. Settings architecture

Settings is not a collection of fake affordances. If a row has an arrow or button treatment, it must perform a real action.

Current principal Settings surfaces:

- Personal Profile;
- My Equipment;
- Record Preferences;
- Reminders & Sound;
- Watermark;
- Data & Storage;
- Training Report.

Inline Settings gates reuse the domain's actual controls and state. They must not clone forms into Settings and create a second persistence path.

“My Equipment” is a real management entry: list, create and edit all route to the shared canonical custom editor.

---

## 9. Sheet navigation contract

A sheet opened directly from the app is a root sheet. A sheet opened from another visible sheet is a child.

Child return must:

1. close only the child;
2. restore the parent;
3. restore the parent's scroll position;
4. preserve parent state;
5. avoid page reload/full render.

Nested header geometry:

- return hit target: 44 × 44 px;
- close hit target: 44 × 44 px;
- shared vertical centerline;
- title uses the flexible middle column.

Navigation is event-driven. Do not build a navigation system around a document-wide `MutationObserver`.

---

## 10. Visual system

### 10.1 Geometry vocabulary

Critical controls use a restrained system:

- minimum primary touch target: 44 px;
- principal numeric control height: ~60 px;
- standard control radius: ~18 px;
- principal two-column gap: 12 px;
- compact mobile gap: 8 px.

New arbitrary geometry in a critical flow is a design-system change, not a local preference.

### 10.2 Typography

Changing numeric values use tabular numerals. Weight/reps share visual scale and baseline. Units remain secondary.

Avoid multiple unrelated font sizes inside one control simply to force content to fit.

### 10.3 Alignment

Paired controls keep equal widths/heights and aligned numeric centers. Mobile layouts should not unexpectedly collapse a deliberate two-column control unless the product contract explicitly calls for it.

### 10.4 Divider policy

Use dividers only when spacing/surface hierarchy cannot clearly communicate a real boundary. Do not add lines as decoration or on both sides of every block.

### 10.5 First-paint rule

The first interactive DOM must already look like the final AXIS release. Critical geometry and visible retirement rules belong in bundled static CSS, not delayed runtime CSS.

---

## 11. Performance contract

Performance includes stability, not just elapsed milliseconds.

Current release gates enforce:

- core interactivity within the CI hard deadline;
- settings/shell geometry stabilization;
- bounded synchronous click work;
- repeated phone and desktop cold boots;
- one external canonical runtime request;
- zero staged historical runtime requests;
- zero uncaught browser errors.

High-frequency controls should normally settle within the same rendering frame on a current phone.

Do not solve frequent interactions with:

- full-subtree replacement;
- observer feedback loops;
- artificial delays;
- network requests;
- duplicate modal editors.

### Observers

Every persistent observer needs a named owner, narrow target, bounded callback and a reason an event-driven solution is insufficient.

### Timers

Polling is not a synchronization architecture. Timers are acceptable for real time-based product behavior—elapsed time, reminders—with a clear lifecycle. Historical timers that only keep duplicate UI alive should be retired.

---

## 12. State and compatibility

Current localStorage / IndexedDB data represents user workout history and must remain readable across refactors unless a tested migration exists.

No module may maintain a second authoritative truth for current equipment, current weight/reps, active status, custom equipment or release identity.

Derived caches are allowed; competing truth is not.

Equipment identity prefers canonical IDs. Names/aliases are presentation and search metadata.

---

## 13. AI boundary

AI is an enhancement boundary, not an availability boundary.

- recognition failure leaves manual confirmation available;
- AI/provider configuration is owner-managed, not an end-user setup flow;
- model errors do not block save;
- training insights can work from local structured history without media analysis;
- model changes may not alter local data semantics.

---

## 14. Build-time convergence

AXIS 8.8 intentionally separates **source history** from **production runtime**.

The build chain currently runs:

```text
prepare-legacy-runtime.mjs
prepare-product-convergence.mjs
prepare-first-paint-shell.mjs
prepare-88-convergence.mjs
build-hardened.mjs
postbuild-kernel-priority.mjs
postbuild-features-hardened.mjs
postbuild-8712-completion.mjs
postbuild-88-canonical.mjs
```

Only `node build-release.mjs` is called by CI/hosting. Provider configs do not duplicate this list.

A build-time retirement is acceptable when compatibility source still contains a superseded writer. Each rewrite must:

- match an exact signature;
- expect an exact count;
- fail when source shape unexpectedly changes;
- assert the old behavior no longer exists afterward;
- preserve the capability through the canonical owner.

The final canonical packager is responsible for flattening the converged capabilities into one production runtime and removing staged loaders.

Long term, once retired source has been stable across releases, physically delete dead code and remove the associated compiler rewrite.

---

## 15. Regression gates

A release is not accepted because one screenshot looks right.

### Artifact gate

- version/base both 8.8;
- architecture `canonical-single-runtime`;
- one external script;
- zero dynamic runtime chunks;
- embedded feature/completion compatibility behavior;
- canonical source commit stamped in deploy builds.

### Chromium gate

- repeated mobile + desktop cold boots;
- first-paint geometry stability;
- Settings ownership diagnostic;
- recording geometry/direct input/set behavior;
- group plan transaction;
- custom editor association/save;
- concise Chinese watermark location;
- active adjustment transient diagnostic;
- comprehensive 8.8 smoke;
- full product operation matrix.

### WebKit gate

An iPhone-like WebKit environment is mandatory. It covers canonical boot, custom editor, location privacy, direct recording input, active-session adjustment, pause/resume and browser errors.

Safari/WebKit is not a post-release manual discovery environment.

### Product operation matrix

Major visible affordances must prove real behavior, including:

- Today / History / Trends navigation;
- profile persistence;
- My Equipment shared editor;
- record preferences persistence;
- reminder/sound persistence;
- watermark controls;
- storage surface availability;
- Quick Record exact input and set count;
- active-session pause/resume, complete-set and adjustment transaction;
- history/trends/report after a real record.

Add new matrix coverage whenever a bug demonstrates an untested user path.

---

## 16. Release process

1. Keep `main` on the last verified Production release.
2. Make release work on an isolated branch.
3. Run deterministic build and artifact contract.
4. Pass Chromium and WebKit gates.
5. Pass the product operation matrix.
6. Update `CURRENT_RELEASE.md`, `RUNTIME_CONTRACT.md` and this playbook when architecture/ownership changes.
7. Open a PR to `main`; run the same release gates again.
8. Merge only the exact verified head.
9. Run `main` gates after merge.
10. Verify Vercel serves the exact merged commit and canonical manifest.
11. Treat Vercel Deployment Protection separately from product runtime health.

Do not use “the old one is probably hidden” or “the final state looks correct” as release evidence.

---

## 17. Hosting protection

Vercel Security Checkpoint / Vercel Authentication occurs before AXIS code runs. It is not a frontend loading state and cannot be fixed by another AXIS runtime patch.

Production verification distinguishes deployment correctness from public accessibility. A protected Production domain must be reported as protected until hosting configuration is changed.

---

## 18. Future-work rule

When a future conversation or developer has no chat history, start with:

1. `docs/CURRENT_RELEASE.md`
2. `release-contract.json`
3. `docs/RUNTIME_CONTRACT.md`
4. `docs/ENGINEERING_PLAYBOOK.md`
5. `build-release.mjs`
6. `postbuild-88-canonical.mjs`
7. `.github/workflows/axis-runtime-gate.yml`
8. current browser smoke files

Do not reconstruct product truth by reading historical `v8xx` filenames in numerical order.

For every future fix:

1. reproduce the user-visible failure;
2. identify the actual owner(s);
3. preserve already-correct behavior;
4. retire the competing writer instead of covering it;
5. add a regression invariant, including transient states where relevant;
6. run Chromium and WebKit gates;
7. update ownership/release docs if the contract changed.

That is the mechanism by which AXIS continues as one product rather than another sequence of patches.
