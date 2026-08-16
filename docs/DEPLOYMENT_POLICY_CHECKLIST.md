# AXIS Deployment Checklist

Before calling any AXIS release complete:

- [ ] Product changes are merged to `main` only after Chromium and iPhone/WebKit gates pass.
- [ ] Non-main branches do not auto-deploy to Vercel.
- [ ] Vercel Production is `READY` for the intended `main` source commit.
- [ ] `https://axis-five-puce.vercel.app/axis-build.json` reports the same source commit.
- [ ] The fixed alias reports the canonical single-runtime topology.
- [ ] `catalogCategorySingleOwner`, `capturePreferenceSingleOwner` and `singleActiveAdjustmentOwner` are true.
- [ ] No no-op commit is used to force a deploy.
- [ ] EdgeOne, when used, runs only `node build-release.mjs` and is verified against the same manifest contract.

If any item fails, the release is not complete.
