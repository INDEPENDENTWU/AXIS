# AXIS Official Dual-Provider Release Checklist

Prior to final 8.32 release:

- [ ] All P01–P20 explicitly dispositioned with real browser/physical-device support; P11/P12/P15/P16/P17/P20 closed on supported hardware, accessibility, typography and low-end performance.
- [ ] Product and release-orchestration PRs reviewed, exact-SHA merged into `main`, exact merged source gates green.
- [ ] Vercel automatic Git deployments disabled; no development Preview or automatic main deployment.
- [ ] External release approval matches exact merged-main SHA and all mandatory gates are true; both provider credentials available in secrets.
- [ ] Deliberate single official workflow dispatched; Vercel Git Production READY at exact SHA.
- [ ] Vercel fixed alias `https://axis-five-puce.vercel.app/axis-build.json` matches the product version, exact SHA and assets.
- [ ] EdgeOne official Production deployment separately verified against same release manifest and expected API routes.
- [ ] `https://axis.juele.fun` matches the exact release and serves canonical assets without unintended redirect.
- [ ] Chromium/WebKit official site and Vercel live browser tests, actual Encounter continuity, real Safari installed-PWA version/cache and data compatibility confirmed.
- [ ] Independent Production Governance Seal records both providers and official-domain evidence.

No no-op commit or fabricated certification. If any item fails, release is incomplete and the preceding certified product remains the trusted rollback baseline.
