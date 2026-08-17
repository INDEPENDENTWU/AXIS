# Contributing

AXIS accepts focused fixes and product changes that preserve its ownership and release contracts.

Before changing code, read:

1. `docs/CURRENT_RELEASE.md`
2. `docs/PRODUCT.md`
3. `docs/ARCHITECTURE.md`
4. `docs/RUNTIME_CONTRACT.md`
5. `docs/ENGINEERING_PLAYBOOK.md`
6. `docs/REPOSITORY_STRUCTURE.md` when touching historical/versioned source

## Working rule

One product surface has one interactive owner.

If a change replaces an implementation, removing or neutralizing the previous writer is part of the same change. Do not solve conflicts with a later observer, cleanup timeout, duplicate click route or shadow source of truth.

## Development flow

1. Branch from the last verified `main`.
2. Reproduce the user-visible problem or define the exact behavior being added.
3. Identify the current owner and any historical competing owners.
4. Make the smallest coherent ownership change.
5. Add or update a regression that exercises the real path.
6. Verify repository-level contracts:

```bash
node scripts/axis-repository-contract.mjs
```

7. Run the deterministic release build:

```bash
node build-release.mjs
```

8. Run the relevant smoke/browser tests for the changed surface.
9. Open a pull request. Merge only after the required candidate gates are green.

CI uses Node 20.18.0 as its baseline. Browser release coverage includes Chromium and iPhone-like WebKit. See `docs/CI_AND_RELEASE.md` for the gate layers.

## Pull requests

A useful pull request explains four things:

- the behavior or defect;
- which owner changed;
- which previous behavior was retired or deliberately preserved;
- how the final and transient states were verified.

For UI changes, include a compact before/after capture when it makes review materially easier. Do not add screenshots solely to decorate a pull request.

For architecture changes, document compatibility and migration behavior. Existing workout history is user data and may not be treated as disposable cache.

## Product changes

Prefer changes that reduce friction, remove duplicate ownership, improve evidence, make failure safer, or shorten the path between real training and a durable record.

Avoid adding a new top-level surface when an existing action can absorb the capability. Avoid generic explanatory copy when the interface itself can make the state clear.

AI is not an authority boundary. Model output may assist fuzzy recognition or interpretation, but a model may not become the only path to save, continue or finish a workout.

## Historical source and compatibility

Version-like filenames are not deletion markers. `app.js`, `v*.js`, `prepare-*.mjs`, `postbuild-*.mjs` and older smoke files may still preserve current behavior or user-data compatibility.

Before retiring executable history:

- identify what consumes it;
- identify the replacement owner;
- preserve stored-user-data semantics;
- keep equivalent regression coverage;
- pass the complete affected Chromium/WebKit gates.

Use `docs/COMPATIBILITY_LEDGER.md` as the retirement policy. Do not create new one-off deployment/recovery marker files in the repository root; use Git history and current release documentation.

## Bug reports

A good bug report includes:

- device and browser;
- the exact path taken;
- expected behavior;
- actual behavior;
- whether the problem survives reload/reopen;
- screenshots or recording when the issue is visual/transient;
- console output only when relevant and with private data removed.

Do not post API keys, private media, precise private location data or other secrets in an issue.

## Repository changes

Documentation and build metadata are part of the release system. If a product release changes identity, architecture, ownership or deployment behavior, update the corresponding canonical documentation in the same pull request.

Repository tidiness must not be achieved by changing runtime behavior indirectly. File moves, build-command changes, package/runtime mode changes and workflow consolidation are engineering changes and require the same compatibility evidence as code.
