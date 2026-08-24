# Repository structure

AXIS has a clean Production runtime and a deliberately transitional source tree. Those two facts are compatible.

The browser receives one canonical runtime. The repository still contains historical implementation owners and exact build-time convergence steps only where compatibility/current behavior has not yet been safely extracted or retired.

## Current top-level layout

```text
governance/           machine-readable current project, ownership and retirement truth
docs/                 current contracts, handoff, engineering guidance and history
runtime/              extracted browser-independent/runtime foundation and adapters
shared/contracts/     durable product/data/platform contracts and schemas
.github/              contribution templates and CI/release workflows
api/                  same-origin server endpoints
cloud-functions/      alternate serverless adapter surface
compiler/             explicit build-time source fragments
data/                 curated local data
lib/                  reusable current libraries/contracts
scripts/              diagnostics, smoke tests and release verification
fresh/                isolated freshness/bootstrap entry surface

app.js, v*.js         current/historical browser source owners still used by convergence
*.css                 source styles consumed by convergence/build
prepare-*.mjs         exact build-time migrations and ownership convergence
postbuild-*.mjs       canonical packaging, inherited assertions and release contracts
build-release.mjs     sole release build entry point
vercel.json           Vercel hosting contract
edgeone.json          EdgeOne verified-prebuilt hosting contract
```

## Authority versus location

Directory location is useful, but **authority is explicit**:

1. `governance/project-state.json` — current project/release state;
2. `governance/owners.json` / `docs/OWNERSHIP.md` — critical writers;
3. `governance/retirements.json` / `docs/RETIREMENTS.md` — authority that may not return;
4. current product/runtime contracts;
5. executable deterministic build graph;
6. historical filenames/notes for provenance.

A file named after 8.8 may still be compatibility-required. A new file is not automatically authoritative.

## Production output

`node build-release.mjs` converges source into generated artifacts:

```text
index.html
axis-core.js
axis-style.css
axis-build.json
```

`axis-core.js`, `axis-style.css` and `axis-build.json` are generated and intentionally not source-controlled. Current Production identity is verified from the exact source SHA plus generated manifest/artifact, not from checked-in historical filenames.

## Why version-like source still exists at root

Files such as `v61.js`, `v8710-watermark.js` or historical `prepare-*` / `postbuild-*` scripts can still own or preserve behavior required by the canonical artifact.

Moving them merely to make the tree look cleaner would change build references without reducing real complexity. Source Convergence therefore uses **strangler migration**:

```text
understand current role
      ↓
establish current owner/contract
      ↓
prove equivalence + data compatibility
      ↓
retire old authority
      ↓
remove executable history
```

The target is not an `archive/` folder full of still-executable legacy. Proven-dead code should eventually be deleted; useful human provenance belongs under documentation history.

## Current source classes

### Authoritative current owners

Examples at the 8.18 baseline include `app.js`, `v61.js`, the visible v874 custom-object editor, the established v8710 sound/watermark ownership boundaries and current projection layers. Exact status is recorded in the ownership registry.

### Compatibility-only owners/bridges

These may still exist to read old data or delegate into current owners. They must not become a second visible/persistence authority. v876 Capture preference behavior is a current example of compatibility-only delegation.

### Derived read-only projections

Evolution Library and media-source resolution may project current truth without creating another database/writer.

### Compatibility compiler

`prepare-*.mjs` rewrites known historical source shapes into the canonical model. A valid compatibility rewrite must match exact expected source, fail on ambiguity and be sealed by final-artifact behavior.

Source Convergence should make this set smaller over time.

### Postbuild contracts

`postbuild-*.mjs` packages/asserts the final runtime and inherited current promises. Historical labels can remain while the protected behavior is still current, but duplicate/stale implementation-shape assertions should migrate into current semantic contracts.

### Current domain/runtime foundation

`runtime/`, `lib/` and `shared/contracts/` are preferred homes for new UI-independent behavior and durable cross-platform contracts. New architecture should move toward explicit modules/ports rather than more browser-global version layers.

## Generated versus tracked

Generated browser artifacts, local tool state, credentials and provider-local files must remain untracked.

Hosting contracts, governance, source, migrations and release scripts are reviewed source — not generated cache.

## Historical/provenance material

`docs/history/` is human provenance only. It may not become a current release/runtime dependency.

Release-specific notes under `docs/releases/` explain how a current guarantee evolved, but do not override current governance.

Future archive directories, if introduced for non-executable provenance, must remain outside the Production dependency graph.

## Retirement procedure

Before removing/moving executable history:

1. classify it as current, compatibility-required, superseded or historical-only;
2. identify behavior/data it protects;
3. establish replacement owner or prove no replacement is needed;
4. prove no required build/runtime reference remains;
5. prove LocalStorage/IndexedDB/custom-object compatibility;
6. replace stale implementation-shape tests with current semantic coverage where appropriate;
7. pass Chromium/WebKit for affected user-visible paths;
8. pass canonical artifact/topology contracts.

Prefer deleting proven-dead executable code over hiding it in another executable directory.

## Target repository shape

Over time the root should become less version-shaped:

```text
current domain/runtime source
      +
explicit compatibility adapters/migrations
      +
current product/browser shell
      +
small reusable CI/release system
      +
human historical documentation
```

A shorter source-to-artifact path, fewer owners and fewer historical transforms are engineering metrics. Cosmetic folder movement is not.
