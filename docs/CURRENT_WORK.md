# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.3.
- `main` baseline: `cb4e8acfbe5b763011d4be39fb6d19e6102c1bca`.
- Architecture: `canonical-single-runtime`.
- Fixed Vercel Production endpoint: `axis-five-puce.vercel.app`.
- Existing equipment/photo persistence, visual memory, Group Plan, Learning, Cloud/AI, report and canonical recording ownership are inherited.
- The existing EdgeOne Makers project URL is not treated as a durable anonymous public endpoint until its access policy/custom-domain route is independently verified.

## Active change

**AXIS 8.12.4 training-flow reliability release.**

This release consolidates the current real-world workout issues into one controlled patch without redesigning unrelated surfaces:

1. Project interval timing no longer trusts event insertion order. The latest real activity interval/finish boundary is the source for `项目间歇`, so A → B → A switching cannot count active A time as idle gap.
2. Session effective time and blank gap prefer the union of real `activity.intervals`; historical heuristics remain fallback only for records without interval evidence.
3. Total-workout completion seals open activity lifecycle state and preserves/reconstructs the real session start/end boundary before the session is archived, preventing identical displayed start/end times.
4. Switching away from a strength item finishes it only when every planned set is complete; otherwise it remains paused. Cardio remains paused on switch unless explicitly finished.
5. Quick Record Recent is a true direct route: a selected recent equipment/exercise resolves by canonical/custom/library/history identity and opens its existing Quick editor without detouring through the full equipment catalog.
6. Live Route / `接下来` remains read-only and deviation-safe. Ignoring a recommendation has no penalty; future projections use actual recorded behavior. Suggestions become actionable delegates into Quick Record but do not write training/storage state merely because the row was tapped.
7. Settings `学习安排` and `云端与AI` return to the exact native Settings row vertical geometry. The validation compares row height, text center Y and chevron center Y to `#profileBtn`, not just horizontal insets.
8. Public release identity advances to 8.12.4 while preserving one initial JavaScript request, zero dynamic runtime chunks and the existing canonical ownership boundaries.

The release adds no Live Route recording/storage/network owner and no new training-data store.

## Validation for this work

Before merge:

- require deterministic `build-release.mjs` to produce exact 8.12.4 / `canonical-single-runtime` identity;
- exercise A → B → A with the latest real activity belonging to an earlier-inserted event and verify Home interval starts at that real boundary;
- verify session time uses the union of activity intervals;
- click a Recent item such as `侧平举` and require the Quick editor to open directly with no visible equipment-catalog hop;
- click a `接下来` suggestion and require the Quick editor to open while core/meta storage remains unchanged until the user explicitly saves;
- require Live Route to remain `recordingOwner:false`, `storageOwner:false`, `networkOwner:false` and deviation penalty false;
- long-press total workout completion and require archived `end > start`, with distinct displayed `开始` and `完成` facts;
- compare Learning and Cloud/AI row height, visible text center Y and chevron center Y to a native Settings row within 0.5 CSS px;
- run the dedicated 8.12.4 flow gate in Chromium and iPhone WebKit;
- retain inherited Group Plan, equipment gallery/picker, Settings, Learning, Runtime, repository and deployment-policy gates.

The broad legacy Runtime omnibus gate may still expose an inherited unrelated geometry/first-paint flake; product changes must not be made solely to satisfy a non-reproducible legacy assertion when the dedicated real-flow and inherited relevant gates are clean.

## Next planned stage

When the exact PR #54 head passes the dedicated Chromium + iPhone WebKit flow gate and relevant inherited contracts, squash-merge it into `main` as AXIS 8.12.4.

Then:

- verify Vercel deploys the exact merged SHA to the existing Production project;
- require `https://axis-five-puce.vercel.app` to anonymously serve HTTP 200, `canonical-8.12.4`, exact merged `sourceCommit`, and all eight 8.12.4 gates;
- run the Production browser gate against the fixed Vercel URL, including the new real 8.12.4 flow smoke;
- verify the EdgeOne build/deployment mirror follows the merged release configuration;
- separately verify a durable anonymous EdgeOne entry. Do not represent the expiring/restricted Makers project URL as the permanent public URL; if anonymous project-domain access remains restricted, the remaining platform-side release requirement is a correctly bound public custom domain/access policy rather than another AXIS product-code change.
