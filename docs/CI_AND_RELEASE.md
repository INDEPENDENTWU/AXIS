# CI and release gates

AXIS separates candidate correctness from hosting correctness. A successful build is necessary but does not by itself mean Production is complete.

Current Production behavior baseline: **AXIS 8.18**. Long-lived compatibility foundation: **8.12**.

## Gate layers today

### 1. Repository contract

`.github/workflows/axis-repository-contract.yml` runs `scripts/axis-repository-contract.mjs`.

The repository contract now treats `governance/project-state.json` as current release/milestone authority instead of hard-coding an old public version. It verifies:

- canonical current/handoff/governance files exist;
- README, handoff and release docs agree on governed Production identity;
- exact initial locale contract is `zh-Hans` / `zh-Hant` / `en`;
- planned theme contract is `system` / `light` / `dark`;
- critical owner/retirement registries exist;
- inherited compatibility/release graph markers still exist;
- every deterministic top-level build step exists and is unique;
- generated canonical artifacts are not committed as source;
- Vercel uses the deterministic build from `main` only;
- EdgeOne uses the verified-prebuilt publisher path;
- operational history remains outside the active repository surface.

This gate is fast and dependency-light.

### 2. Canonical runtime gate

`.github/workflows/axis-runtime-gate.yml` is the broad candidate baseline. It builds the canonical release and exercises the current product through Chromium and iPhone-like WebKit.

It covers artifact topology, ownership diagnostics, first paint, recording, active adjustment, completion, catalog, watermark/media, inherited behavior and the full product operation matrix.

This remains the most important general runtime regression gate during convergence.

### 3. Release-era focused gates

The workflow directory still contains focused gates named after the release where a behavior originated (8.8 through 8.18).

Those names are **provenance, not current product architecture**. Some still protect real current guarantees; some may now duplicate current gates; some may encode stale implementation details.

Do not delete a workflow because its version number is old. First inventory:

- trigger/path coverage;
- assertions still protecting current product semantics;
- stale implementation-shape assertions;
- Chromium/WebKit requirements;
- dependencies on other gates;
- merge/Production protection role.

Only then classify it as current, compatibility-required, superseded, or historical-only.

### 4. Cross-platform / continuity contracts

Repository Work Continuity and cross-platform/native foundation gates protect durable product/domain contracts independently of browser release naming.

These are especially important while source layout changes: convergence must not silently fork Web/iOS product truth.

### 5. Deployment policy

The deployment-policy gate protects main-only Vercel Git deployment and keeps hosting policy separate from candidate CI.

Non-main branches should not consume Production Vercel deployment quota as ordinary test runners.

### 6. Production seal

Production is identified by exact source/artifact identity, not by a visible version label.

The release path must preserve:

```text
verified candidate
  ↓
exact head merge to main
  ↓
Vercel Production on exact merged SHA
  ↓
canonical artifact / fixed alias verification
  ↓
EdgeOne exact-prebuilt artifact mirror
  ↓
real Production Chromium + iPhone-like WebKit proof
```

A deployment-specific URL being green does not compensate for a stale fixed public alias or mismatched source SHA.

## Source Convergence CI target

The long-term workflow shape should become four understandable layers rather than a permanent workflow per historical release.

### A. Fast PR / repository gate

Fast structural/current checks for every relevant branch change:

- governance/docs consistency;
- syntax/static contracts;
- deterministic build prerequisites;
- current ownership/retirement guards;
- focused critical smoke where appropriate.

### B. Current Product Matrix

Behavior named by current surfaces, not release history:

- Home/Today;
- Capture / Quick Record;
- Active Training / Focus;
- History / detail;
- Trends;
- Evolution / Evidence;
- Settings / archive;
- Language Studio;
- PWA foreground/route recovery.

### C. Deep Compatibility Gate

Explicitly test old user data and required compatibility:

- `axis_v60_state`;
- `axis_v8_meta`;
- `axis_v89_speak`;
- `axis_v42_media`;
- custom object identity/aliases;
- historical Encounter shapes.

This can run on compatibility-sensitive PRs, release candidates and/or scheduled deep verification rather than forcing every trivial presentation change through every historical workflow.

### D. Exact-SHA Production Seal

Keep the current strict provider/artifact/browser verification. Source convergence must not weaken this layer.

## Workflow consolidation rule

Two workflows may be merged only if the replacement accounts for:

1. source/path trigger coverage;
2. every still-current release-blocking assertion;
3. stale assertions that should be rewritten to current semantics rather than copied;
4. Chromium coverage where required;
5. WebKit coverage where required;
6. exact-SHA/Production behavior where applicable;
7. branch-protection required-check implications.

The goal is fewer workflows **without less proof**.

## Test philosophy

Prefer current semantic promises over historical implementation shape.

Good:

> selecting 5-second Scan sampling persists, repaints and is used by the next canonical Capture.

Bad as a permanent current contract:

> an old version-specific selector/storage key still exists exactly as it did years ago.

If a historical bridge must remain, assert that it delegates safely and cannot regain authority.

## Required discipline

- `main` represents accepted Production source.
- Build and browser checks run on the same candidate being reviewed.
- A transient wrong frame, duplicated writer or stale owner is a real regression.
- WebKit remains release-blocking for critical user-facing behavior.
- No timeout inflation or assertion weakening to obtain green CI.
- Provider quota is not a reason to bypass candidate correctness.
- Version filenames are provenance; current release truth comes from governance/current contracts and verified Production.
