# Engineering Playbook

This is the operating guide for changing AXIS without accumulating another product owner, compatibility layer or release ambiguity.

Read `CURRENT_RELEASE.md` first for the current baseline and `ARCHITECTURE.md` for the structural model.

## 1. Start from behavior

Before editing code, state the concrete user path or engineering contract being changed.

A valid change starts with something like:

- the active route cannot recover after reload;
- a weight edit rebuilds the row and moves the control;
- two modules can write the same preference;
- an occupied machine needs to affect the remaining route;
- Production can serve a manifest from the wrong source commit.

“Refactor this file” or “add more intelligence” is not enough on its own.

## 2. Identify ownership

For the affected behavior, identify:

- authoritative state;
- interactive owner;
- renderer/presentation owner;
- compatibility readers/writers;
- persistence path;
- relevant contract and browser tests.

If two owners exist, the change should normally converge them rather than add coordination between them.

## 3. Preserve user data

Workout history, set-level records, preferences and media references are user data.

Do not rename storage keys, IDs or schema fields casually. A breaking change needs:

1. an explicit schema/version decision;
2. deterministic migration;
3. old-data fixtures;
4. reload/reopen tests;
5. a rollback/failure strategy.

Derived caches may be discarded. Authoritative history may not.

## 4. Keep high-frequency paths small

Weight/repetition edits, set completion, pause/resume and active-route actions should mutate the smallest stable state/UI surface possible.

Avoid:

- rebuilding an entire sheet for a number change;
- document-wide `MutationObserver` synchronization;
- polling to keep competing UIs aligned;
- network work in the critical tap path;
- delayed corrective paint after first interaction.

When a timer is real product behavior, give it a clear owner and lifecycle. Polling is not a substitute for ownership.

## 5. UI rules

AXIS uses ordinary language and strict geometry.

- Primary touch targets are at least 44 px where platform conventions require it.
- Repeated numeric controls share baseline, scale and alignment.
- Tabular numerals are preferred for changing values.
- Dividers are structural, not decorative.
- A row styled as actionable must perform a real action.
- User-facing copy should describe what can be acted on now, not narrate internal intelligence.

A transient flash, duplicate button, old version label or moving control is a defect.

## 6. AI boundary

AI is useful for ambiguity, not for product authority.

The server adapter owns provider secrets and provider-specific request formats. Browser code should consume normalized capability/results.

Every AI-assisted flow needs a local/manual outcome for:

- provider unavailable;
- timeout;
- malformed response;
- low confidence;
- disagreement between providers/local evidence.

Do not send unrelated user data just because it is available. Scope AI inputs to the capability that requested them.

## 7. Cloud and sync

The live workout stays local. Sync uses bounded outbox/revision semantics and deterministic convergence.

Do not turn every tap into a remote database transaction. Active training should not wait for cloud acknowledgment.

When adding a syncable entity, define:

- entity identity;
- revision/update semantics;
- deletion behavior;
- conflict behavior;
- payload limits;
- privacy scope;
- offline/retry behavior.

## 8. Platform work

Platform-specific capability belongs behind an adapter.

Product logic should express intent such as “save finalized media”, “haptic success”, “install identity” or “background upload”; browser/native code decides how that intent is executed.

Do not fork training semantics into iOS/Android-specific copies. The long-term target is a browser-independent domain runtime plus platform adapters.

## 9. Build-time compatibility

AXIS currently uses exact build-time transforms to converge historical source into one production runtime.

A transform is acceptable when it protects real compatibility and has strict assertions. It is not the default location for new product development.

Before adding a new `prepare-*` step, ask whether the current canonical owner can be changed directly. If a historical transform has become unnecessary, remove its source dependency and gate together after proving compatibility.

The build chain should become shorter as ownership converges.

## 10. Tests

Test user paths, not only DOM existence.

A regression should fail for the original defect and prove the repaired behavior. Critical classes include:

- cold boot / repeated boot;
- reload during active training;
- reopen after interruption;
- direct strength editing;
- set completion and incomplete sets;
- active pause/resume/finish;
- custom equipment create/edit/delete;
- media/watermark privacy;
- history/report/State Field after a real record;
- offline/no-AI path;
- iPhone-like WebKit interaction;
- Production source-SHA/manifest identity.

Randomized event sequences are appropriate for the upcoming deterministic Runtime because state legality matters more than one golden path.

## 11. Release flow

`main` represents the last intended Production baseline. Work happens on a branch.

The canonical build entry is:

```bash
node build-release.mjs
```

A candidate then passes the relevant source/contract checks and real-browser gates. Merge only the verified head. Production must be checked again against the exact merged source SHA.

Do not create no-op product commits merely to force a hosting retry.

## 12. Documentation is part of the contract

Update documentation in the same change when any of these change:

- product identity or boundary;
- current release;
- authoritative owner;
- storage/data contract;
- platform boundary;
- build/release topology;
- security/privacy boundary;
- next migration stage.

`CURRENT_RELEASE.md` should always be usable as a handoff to a developer with no chat history.

## 13. Review standard

A reviewer should be able to answer:

1. What real behavior changes?
2. Who owns it before and after?
3. What old path is removed or preserved?
4. Can existing data still be read?
5. What happens offline / without AI?
6. What proves WebKit and Chromium agree where it matters?
7. Does the final Production artifact map to the intended source?
8. Did source complexity go down, stay justified, or silently grow?

If those answers are unclear, the change is not ready to merge.
