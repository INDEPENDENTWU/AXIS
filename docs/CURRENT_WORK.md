# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public Web release.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact certified `main` baseline for this bounded follow-up: `1ed1b53e4a1ced7e32c0a91d058bccd6abfcd71c`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- public release identity: **unchanged; 8.21**
- architecture: **unchanged; `canonical-single-runtime`**
- production request topology: **1 initial JS / 0 dynamic JS chunks**
- fixed public Vercel URL: `https://axis-five-puce.vercel.app`
- fixed public EdgeOne project URL: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed mainland-facing custom alias under certification: `https://axis.juele.fun`
- deployment topology: one existing Git-connected AXIS Vercel Project on `main`, with the existing `axisfitness-mirror` EdgeOne project publishing the exact certified artifact; the custom domain is an alias of that same Production environment, not another AXIS runtime or project
- existing Active truth/action owner: `v87` over `axis_v8_meta`
- existing Session/Encounter writer: canonical app owner
- existing rest truth: the current Activity lifecycle; no new timer or rest store is permitted
- cross-platform foundation: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts preserved: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.report-range.v1`, `axis.backup.v1`

PR #134 is merged and fully Production-certified at `1ed1b53e4a1ced7e32c0a91d058bccd6abfcd71c`. Vercel reports success for that exact commit, and the fixed EdgeOne Production mirror completed exact-artifact parity plus Chromium and iPhone-like WebKit real-production verification on the same SHA. This exact SHA is the certified base for the custom-domain topology slice.

The operator has provisioned HTTPS for `axis.juele.fun` on the existing EdgeOne Production environment. A Safari-captured `/axis-build.json` from that hostname already reports public/base 8.21, `canonical-single-runtime`, exact source commit `1ed1b53e4a1ced7e32c0a91d058bccd6abfcd71c`, core `e979aac1d16c`, CSS `de8ee88a73ae`, runtime hash `020fb717fc78`, 1 initial JavaScript request and 0 dynamic JavaScript requests. Repository CI must now turn that point-in-time observation into a durable release-blocking alias contract for future main releases.

### Inherited bounded-stage continuity references

These are historical compatibility identifiers required by already-sealed 8.21 contracts. They are **not** competing Production baselines or active delivery branches:

- exact merged `main` baseline: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- bounded delivery branch: `feat/821-report-pdf-export`
- bounded delivery branch: `feat/821-report-share-card`
- exact base main SHA: `fce02e0238186c0a9df77f447bb979a1429c4c4f`
- bounded Flow step recording intent branch: `feat/821-flow-step-recording-intent`
- certified Flow step recording intent base: `b65bce78d48dab162c25c028602e0bbd10ce6d78`
- bounded Flow step execution intent branch: `feat/821-flow-step-execution-intent`
- certified Flow step execution intent base: `396241c41b2f8eea80d45ca582352ea593c47036`
- bounded delivery branch: `feat/821-active-home-stage`
- exact base main SHA: `c09d22fc992efd4f1f94bc0857c91442a211094f`
- bounded Active Home visual-convergence branch: `feat/821-active-home-visual-convergence`
- exact Active Home visual-convergence base `main` SHA: `9eaf90d0f94023218feb452b085da48c9f027276`
- bounded portable-backup branch: `feat/821-portable-backup-origin-migration`
- portable-backup exact historical base: `c434a4a78530669d5a47be9799d40f5049b57a2d`
- portable-backup merged/certified main: `b349c8b87a0e9b30916ba9959297897260de3882`
- completed Active Home source-convergence branch: `arch/821-active-home-source-convergence`
- completed Active Home source-convergence PR: **#131**
- Active Home source-convergence certified main: `3877d91cc6f17a3db5add414fed44495c64d3cf4`
- completed Report PDF scope source-convergence branch: `arch/821-report-pdf-scope-convergence`
- completed Report PDF scope source-convergence PR: **#133**
- Report PDF scope source-convergence certified main: `1d9e08ae40f555151133a9fce4bc343f18359af2`
- completed Flow Active boot source-convergence branch: `arch/821-flow-active-boot-source-convergence`
- bounded delivery branch: `arch/821-flow-active-boot-source-convergence`
- completed Flow Active boot source-convergence PR: **#134**
- Flow Active boot source-convergence certified main: `1ed1b53e4a1ced7e32c0a91d058bccd6abfcd71c`

PR #129 established the flat, centered, Home-integrated ordinary Active stage. PR #130 refined tactile hold/rest presentation. PR #132 added structural-owner portable backup transport. PR #131 retired the late Active Home visual prepare from canonical build authority. PR #133 retired the immediate Report PDF corrective scope prepare from canonical build authority. PR #134 retired the corrective Flow Active boot-scope prepare from canonical build reachability. All remain release-blocking continuity for this work.

### Completed Flow Active source handoff

The completed #134 handoff keeps the previously certified semantics explicit for compatibility contracts:

1. `prepare-821-flow-active-convergence.mjs` emits the scan-sheet close and `axis:active-finished` listeners directly inside the private Flow/app helper scope.
2. `prepare-821-flow-active-boot-scope.mjs` is provenance-only and is not imported by the canonical release chain.
3. Flow truth remains app-owned `axis_v60_state.flows` + `flowRun`; orchestration/intent only, never history.
4. Existing v82/v87 remain the Active lifecycle owners; the canonical app remains the single Encounter writer.
5. Ordinary `single` / `complete` items remain one-shot; proven whole-item Flow may reuse the existing Active lifecycle; temporary “记录其他” remains record-only and cannot consume the current Flow item.
6. `state.active.events.push(...)` remains a single canonical app-owned Encounter append.
7. No new LocalStorage namespace, IndexedDB store, network writer, picker, recorder, Active owner, Session owner, Encounter writer or Flow history store was introduced.

## Active change

**AXIS 8.21 — `axis.juele.fun` Governed Production Alias**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `infra/821-axis-juele-production-alias`
- exact certified base `main` SHA: `1ed1b53e4a1ced7e32c0a91d058bccd6abfcd71c`
- intended public release change: **none; remains 8.21**
- intended user-visible behavior change: **none**
- topology objective: make `https://axis.juele.fun` a durable, release-blocking user-facing alias of the existing `axisfitness-mirror` EdgeOne Production environment
- deployment owner: unchanged; `.github/workflows/axis-edgeone-production-mirror.yml` continues to publish the exact prebuilt Vercel-golden artifact to `axisfitness-mirror`
- custom-domain verifier: `scripts/edgeone-custom-domain-verify.mjs`
- custom-domain gate: `.github/workflows/axis-custom-domain-production.yml`
- migration contract exercised on the real custom hostname: `axis.backup.v1`

This slice does **not** create another EdgeOne project, Vercel project, runtime, build owner, storage owner or China-specific product fork. The older direct-Git EdgeOne project named `axisfitness` is not made authoritative by this work; the governed Production path remains the existing exact-artifact `axisfitness-mirror` chain.

### Custom-domain contract

After merge, every `main` release must prove the custom hostname has converged to the same already-built artifact before it is accepted as the mainland-facing alias:

1. `https://axis.juele.fun` remains HTTPS and does not redirect away from its custom origin.
2. `/axis-build.json` exactly matches local/main for version, baseVersion, sourceCommit, architecture, core hash, CSS hash, runtime hash and JavaScript request topology.
3. The root document exposes the current canonical runtime/public-release marker.
4. The seven existing API surfaces keep status/JSON-shape parity with the Vercel golden; no custom-domain API fork is allowed.
5. The existing full portable-backup round-trip smoke runs against the real custom hostname in Chromium and iPhone-like WebKit.
6. Product assertions are unchanged; the custom-domain verifier only waits for provider propagation before product/browser checks begin.

### Ownership and migration boundary

The domain itself stores no canonical AXIS data and owns no training behavior. Browser-origin isolation remains intentional: data created under a Vercel origin cannot be read automatically by `axis.juele.fun`. `axis.backup.v1` is the explicit local transport bridge, including exact AXIS localStorage plus canonical media bytes, integrity validation, staged restore and verified rollback.

No real user data is moved by CI. After the alias is Production-certified, the operator will export from the existing Vercel-installed AXIS and restore into the Safari-installed `axis.juele.fun` AXIS; the migration is considered complete only after the source and restored record/media counts reconcile.

### Production incident follow-up — iOS large-media export

A real long-lived Vercel-origin Safari dataset exposed a Production-scale failure that the original tiny-media browser fixture did not represent: tapping `建立完整 AXIS 备份` caused the Safari WebContent process to terminate with “A problem repeatedly occurred”. The failure occurred on the read/export path; the current export path contains no storage clear, media replace, or restore mutation.

The bounded follow-up branch is `fix/821-portable-backup-webkit-rollback`, PR **#136**, based on exact main `d3e4cb174a5230cfd216d7881af2f0999640b6c4`. It now carries two related transport-safety corrections without changing AXIS workout/history truth:

1. keep the WebKit rollback proof on a stable AXIS-namespace sentinel rather than malformed live `axis_v8_meta`;
2. introduce user-facing `axis.backup.v2` binary transport for large-media Safari export while retaining `axis.backup.v1` import/API compatibility.

The v2 user export does not base64-expand all media or stringify all media into one giant JSON object. It hashes media one item at a time, writes a small SHA-256-sealed JSON header followed by raw Blob parts, and requires a fresh second user gesture (`保存完整备份`) before invoking the native share/download path. Media replacement during restore is sequential rather than pre-encoding every incoming Blob into one in-memory array. The canonical app-owned media store remains the persistence owner; no new database, storage namespace, cloud path, Session/Encounter writer, or product truth owner is introduced.

The v2 file remains local-only and uses the same `.axisbackup` extension. Its header records exact raw `axis_*` storage plus media descriptors `{key,type,size,offset,sha256}`; media bytes follow raw, with per-item SHA-256 verification before restore mutation. `axis.backup.v1` remains accepted for compatibility.

Real operator migration remains blocked until the exact #136 head is green, merged, and the resulting exact `main` is certified on canonical Vercel, the fixed EdgeOne mirror, and `axis.juele.fun`. The old Vercel origin must not be deleted or have Safari website data cleared before the migrated copy is reconciled.

## Validation for this work

Merge is blocked until the exact final PR head proves all of the following without weakening existing assertions:

1. deterministic `node build-release.mjs` succeeds with public/base AXIS 8.21 and `canonical-single-runtime` unchanged;
2. the custom-domain verifier and workflow contract are structurally valid and reference only the existing Vercel golden plus `axis.juele.fun`;
3. all inherited Runtime, Flow, Active Home, Session/Encounter, Object, Report, Portable Backup, Repository, Work Continuity, Deep Compatibility and Current Release gates remain green on the exact same PR head;
4. no new deployment project, runtime owner, storage key, IndexedDB store, recorder, Session/Encounter writer or network truth owner appears;
5. after merge, the exact merged `main` SHA must first become the Vercel golden and exact-prebuilt EdgeOne Production mirror, then `axis.juele.fun` must expose that exact same manifest/runtime identity;
6. the real custom hostname must pass `axis-821-portable-backup-smoke.mjs` in Chromium and iPhone-like WebKit;
7. the user-facing `axis.backup.v2` path must pass large-media raw-Blob export, per-media corruption rejection, exact restore, and foreign-storage preservation in Chromium and iPhone-like WebKit;
8. Production `axis.juele.fun` must also run the v2 large-media smoke in both engines before real migration is approved.

A failure is fixed at its actual owner. Product assertions and migration semantics must not be weakened merely to make the custom-domain gate green. Provider propagation is allowed a bounded convergence window because the alias workflow runs in parallel with the canonical EdgeOne mirror; this does not alter any browser/product assertion.

## Next planned stage

Only after this bounded custom-domain topology slice and the portable-backup iOS-memory follow-up are merged and the exact merged `main` artifact is certified on Vercel, the fixed EdgeOne project URL and `axis.juele.fun`:

1. perform the operator’s real Vercel-origin → `axis.juele.fun` migration using the current `.axisbackup` user export (`axis.backup.v2`, with `axis.backup.v1` import compatibility);
2. verify source/restore counts, media bytes and integrity before treating the custom-domain installation as the daily-use copy;
3. keep the old Vercel-origin data intact until the migrated copy is explicitly reconciled;
4. separately audit the old direct-Git EdgeOne `axisfitness` project before any retirement action; do not delete it merely because the custom alias is working;
5. resume the bounded 89-step source-owner convergence on the next already-explicit corrective layer;
6. preserve `canonical-single-runtime`, storage/history compatibility, `axis.backup.v1`, `axis.report-range.v1`, v61 classic-set ownership, v82/v87 Active ownership and canonical Session/Encounter ownership.

The target remains one AXIS product, one canonical Git history and one release artifact delivered through governed endpoints, while the runtime source itself continues its strangler migration toward fewer live mutation layers and clearer final owners.

Chat history is not authoritative project memory. Repository governance, exact `main`, deterministic build output and fixed Production evidence remain authoritative.
