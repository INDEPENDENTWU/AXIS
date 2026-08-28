# Repository Hygiene Policy

This repository is the canonical source for the AXIS product.

## Permanent rules

- `main` is the only long-lived production branch.
- Vercel production must point to the existing `axis` project and deploy from `main`.
- Do not create a new Vercel project for routine development, testing, hotfixes, previews, or redeployments.
- Temporary branches must use one of: `feat/`, `fix/`, `chore/`, `docs/`, `test/`.
- A temporary branch should describe one bounded change and should normally be merged back to `main`.
- After merge and production verification, retire the temporary branch unless it is explicitly documented as a maintained release/mirror branch.
- Do not create branches named `final`, `final2`, `new`, `v2`, `probe`, `smoke`, `deploy-test`, or similar ambiguous one-off names.
- Do not use historical branches as the source for a new production deployment unless the user explicitly requests a rollback.
- Before any branch deletion, verify: merged/reachable from `main`, no open PR, no unique commits still needed, and no active deployment or release dependency.
- Never delete or repoint `main` during cleanup.

## Deployment rule

One product = one canonical GitHub repository = one canonical Vercel project = one stable production domain. Preview deployments may be ephemeral; production identity must remain stable.
