# Current Work

## Production baseline at start of this work

AXIS **8.21** is the current public release.

- current merged `main` at start: `577c62c34a78da9b4ed88e92ef7bbe00eadea3c8`
- release PR: **#108**
- durable product/runtime seal baseline SHA: `8f1f1331e751a7868d390f986d77d5779732ad51`
- architecture: `canonical-single-runtime`
- Vercel runtime-seal deployment: `dpl_4ac8LR615ULNWJ45m1kSB7A6q9jX`
- governance-only Vercel deployment for `577c62c34a78da9b4ed88e92ef7bbe00eadea3c8`: `dpl_89N2ij11BSuUMgZbLiF8iJY3Ek9E` — READY
- governance-only fixed Vercel Production gate: `33279823205` — success
- EdgeOne runtime-seal deployment: `dpysj966i0hh`
- EdgeOne runtime-seal verification run: `33278965885` — success

The successful Production gate for `577c62c34a78da9b4ed88e92ef7bbe00eadea3c8` proves this new work is **not** waiting on an undeployed build. A real user-visible defect remains in the recording property surface: in Quick Record and Photo Record, a number can appear shifted because the existing geometry centered the combined value + unit group rather than the numeric value itself.

The existing AXIS 8.21 factual model remains authoritative and must not change: explicit Object metric/execution semantics, immutable Encounter snapshots, canonical Quick/Photo recording, existing v82/v87 Active owners, whole-item Flow, existing `axis_v60_state` / `axis_v8_meta` / `axis_v42_media` persistence, and one canonical runtime.

Cross-platform foundation remains `axis-native-foundation-0`, native repository remains `INDEPENDENTWU/AXIS-iOS`, and portable contracts remain `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, and `axis.flow-provenance.v1`.

## Active change

**AXIS 8.21 — Quick / Photo Recording Numeric Centering**

- active branch: `fix/821-quick-photo-metric-centering`
- base main SHA: `577c62c34a78da9b4ed88e92ef7bbe00eadea3c8`
- public identity change: **none; remains 8.21**
- intended product behavior change: **presentation geometry only**
- intended factual/persistence ownership change: **none**
- recorder/schema/Encounter/Active/Flow ownership change: **none**

### Root cause

The previous 8.21 physical assertion measured the bounding union of the numeric input and its unit. That allows a layout such as `20 分钟` to pass when the combined group is centered even though the number `20` itself is visibly left of the control center.

The old middle value cell also used a flex row with `justify-content:center` and a right-aligned input. The unit therefore participated in the centering calculation and could push the number away from the true visual center.

A second acceptance defect made this easier to miss: `scripts/axis-821-recording-property-surface-smoke.mjs` existed but was not a formal Current Release step, and the fixed Vercel Production current-release list did not explicitly run the full 8.21 recording-property / executable-object suite.

### Repair

The canonical 8.21 metric presentation owner now uses a symmetric three-track middle cell:

```text
left balance track | numeric input | unit track
```

The two outer tracks have equal flexible width. The numeric input occupies the exact middle track and is `text-align:center`; the unit occupies only the right track. Therefore the number's geometric center is independent of the unit width instead of relying on a per-unit or per-digit pixel offset.

The fit helper continues to resize the input to its real value and now also handles pace placeholders and pace-step changes. Quantity, time, pace and rating numeric values inherit the same centered invariant; choice/toggle semantics remain unchanged.

A new physical smoke exercises the **actual user routes**, not a synthetic isolated component:

- Quick Record → saved custom Object → recording property configuration;
- Photo Record → real capture → review → Object selection → recording property configuration;
- preset changes, direct numeric input and step changes;
- saved immutable metric facts and captured photo evidence.

The existing recording-property smoke is corrected to measure the numeric input center itself. Current Release and Universal Practice Object gates now run these physical proofs in both Chromium and iPhone-like WebKit. Vercel fixed Production and EdgeOne Production verification are also required to run the 8.21 recording-property, Quick/Photo centering and full executable-object smokes explicitly.

## Validation for this work

This repair is mergeable only when the exact final PR head proves all of the following without weakening inherited assertions:

1. deterministic `build-release.mjs` remains AXIS 8.21 and `canonical-single-runtime`;
2. the numeric input center, **not the value+unit union**, is within `≤ 0.5 CSS px` of the middle value cell center;
3. computed numeric text alignment is centered and remains centered after preset, direct input and step changes;
4. the unit remains visually adjacent on the right without participating in numeric centering or overlapping the value;
5. symmetric/full-width preset rails retain their existing equal-width geometry;
6. the real Quick Record entry passes the numeric-centering proof in Chromium and iPhone-like WebKit;
7. the real Photo Record capture → review → Object → property route passes the same proof in Chromium and iPhone-like WebKit and preserves captured Evidence;
8. saved Encounter metric schema and values remain immutable and correct;
9. Current Release, Universal Practice Object, Runtime, Runtime Foundation, Deep Compatibility, Repository, Work Continuity, Cross-Platform and PR Convergence gates pass on the same final head;
10. fixed Vercel Production runs the explicit 8.21 Flow, recording-property, Quick/Photo centering and executable-object proofs against the exact merged SHA;
11. EdgeOne Production runs the same recording-property and Quick/Photo proof in both Chromium and iPhone-like WebKit with exact Vercel/artifact parity;
12. no new recorder, store, schema owner, Encounter writer, Active owner, Flow owner, database or persistence namespace is introduced;
13. one initial JavaScript request and zero dynamic runtime chunks remain unchanged;
14. Production runtime errors remain clean after deployment.

A green test that only proves the combined value+unit group is centered does **not** satisfy this work.

## Next planned stage

Only after this user-visible recording geometry defect is merged and re-certified on Vercel and EdgeOne Production:

1. perform the already-identified **separate Node toolchain convergence** from historical `20.18.0` pins to a supported Node 20.19+ baseline, without mixing infrastructure changes into this product repair;
2. resume the architecture-governance program by auditing the 89 deterministic release steps and retiring behavioral build-time mutation one bounded source-owner slice at a time;
3. preserve exact Product/Flow/Recording behavior, historical data readability, Chromium + iPhone-like WebKit physical proof, one factual owner per capability and Production parity throughout.

Do not combine this geometry repair with Node/toolchain work or unrelated architecture cleanup. Do not relax the `≤0.5 CSS px` requirement to make a gate pass; fix the underlying geometry or the test's real-user-path setup instead.

Chat history is not authoritative project memory. GitHub governance, current contracts, exact `main`, deterministic build output and Production evidence are authoritative.
