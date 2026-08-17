# Runtime Contract

This document contains release-blocking runtime invariants for the current AXIS release line. Product intent lives in `PRODUCT.md`; architecture and migration direction live in `ARCHITECTURE.md`; exact current release facts live in `CURRENT_RELEASE.md`.

## Release identity

The current release is **AXIS 8.12**.

The final Production artifact must report:

- `version: 8.12`;
- `baseVersion: 8.12`;
- architecture `canonical-single-runtime`;
- one initial external JavaScript runtime;
- zero dynamic historical runtime chunks;
- immutable content-hashed JS/CSS assets;
- the exact deployed source commit.

The checked-in release contract may be a compatibility compiler input. The generated `axis-build.json` is the final artifact contract and must agree with the release produced by `node build-release.mjs`.

## Canonical runtime

Historical `v8xx` modules are source/compiler inputs. The browser may not receive the product as a sequence of historical releases.

Production is:

```text
axis-core.js?v=<content hash>
axis-style.css?v=<content hash>
```

A compatibility/readiness object may retain a historical identifier as a stable internal API name. It must never repaint public release identity or cause a fallback to an older product.

## Single-owner invariant

Every semantic user action and every authoritative training fact has one owner.

Forbidden patterns include:

- two visible controls that perform the same semantic action;
- a second draft/state store kept alive by DOM observers;
- a second countdown or audio owner;
- a late timeout that hides an older implementation;
- an AI result that silently becomes authoritative history;
- a cloud mirror treated as the live workout database.

Replacing an owner includes retiring the previous writer in the same change.

## Local-first invariant

The user can record, continue and finish a workout without an account, network connection or AI provider.

Current local data includes the base workout state, set-level metadata, preferences, learning state and local media storage. Existing user data remains readable unless an explicit versioned migration is implemented and tested.

Cloud sync may mirror and converge state. It may not become a prerequisite for the immediate training path.

## Recording invariant

Strength recording preserves one live draft owner. Weight, repetitions, set selection and completion update the smallest stable state/UI surface necessary.

High-frequency interactions may not depend on:

- network calls;
- full-page or full-sheet rerenders;
- document-wide mutation observers;
- artificial synchronization delays.

Direct numeric editing commits to the same authoritative draft as step/preset controls.

## Active-session invariant

Active training has one pause/resume/finish path and one countdown/audio owner for each semantic timer.

Pause freezes elapsed-time-derived behavior. Resume continues from authoritative intervals. Intentional user completion cannot trigger a second automatic completion transaction.

A transient duplicate action or stale intermediate state is release-blocking even when the final DOM becomes correct.

## AI invariant

Provider keys and admin credentials stay server-side.

AI is advisory. It may classify, extract, verify, summarize or translate fuzzy input into constraints. It may not:

- fabricate completed work;
- rewrite history without an explicit user transaction;
- block workout save because a provider failed;
- make unsupported medical/recovery claims;
- override an explicit user choice.

Visual recognition must remain catalog-bound or require confirmation when uncertain. A failed provider call degrades to local/manual behavior.

## Language Studio invariant

8.12 Language Studio is an isolated learning domain.

Release-blocking properties include:

- 25,716 available units under the 8.12 contract;
- 4/8/12-turn dialogue depth;
- no required network access;
- no autoplay speech owner introduced by the 8.12 studio layer;
- no training-state ownership;
- inherited 8.11 learning contracts remain valid.

Learning state or UI may not take over Home, active-session control or recording ownership.

## Sync invariant

Sync entities are bounded, revisioned and idempotent. Conflict resolution must be deterministic where possible; unresolved conflicts cannot block training.

Deletion uses tombstones so stale devices cannot silently resurrect deleted remote data.

Media sync is separate from metadata sync and remains opt-in. Private training media may not depend on a public object bucket.

## Platform invariant

Platform-specific abilities are called through an adapter boundary. Browser product logic may not directly assume native Photos write, haptics, passkey or background execution.

A future native shell may implement those capabilities without forking workout semantics.

## Navigation and geometry

Nested sheets return to their parent without destroying parent state or scroll. Navigation is event-driven.

Critical first-paint geometry belongs in shipped CSS/runtime state, not in delayed repair code. A flash of old layout, duplicate action or moved control is a real product defect.

## Build-time convergence

Every build-time rewrite that retires historical behavior must:

1. match an expected source signature/count;
2. fail when source shape is ambiguous;
3. preserve the intended capability through the canonical owner;
4. assert that the retired behavior is absent from the final artifact;
5. have an executable regression for the user-visible contract it protects.

The long-term direction is to delete stable retired source and shorten the convergence chain. New releases should not add historical transforms by default when a current canonical source owner can be changed directly.

## Browser gates

A critical interaction change is not release-ready until it is verified in both Chromium and iPhone-like WebKit on the same candidate.

Release gates cover, as applicable:

- repeated cold boot and first-paint stability;
- canonical single-runtime topology;
- recording and custom-equipment behavior;
- active-session pause/resume/countdown/finish;
- media/watermark/privacy behavior;
- history, State Field and report output;
- Language Studio isolation and learning contracts;
- zero uncaught browser errors;
- exact production source SHA and manifest.

## Production invariant

Deployment completion is not release completion.

The fixed public Production endpoint must serve the intended source commit, canonical manifest and immutable assets. Provider authentication/security checkpoints are hosting-layer failures or configuration states; they must not be “fixed” with product runtime patches.

## Non-negotiable repair rule

Do not repair ownership conflicts with another observer, timer, handler, painter or shadow state.

Find the authoritative owner, preserve the valid capability, retire the competing path and add a regression that catches both the final and transient failure state.
