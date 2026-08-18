# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.1.
- Product main at the start of this release: `3d18300b26c0b38b5389e554c34bd41d39663bb9`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- Production 8.12.1 core at the start of this work: `f86c16349f02`; one initial JavaScript request, zero dynamic JavaScript and zero chunks.
- AXIS 8.12 Language Studio, the 8.12.1 Safari Group Plan native-button fix, and AXIS 8.13 Stage 3 read-only Live Route are inherited and must remain intact.

## Active change

**AXIS 8.12.2 — Settings simplification and visual convergence only.**

The product implementation is complete and frozen. No additional feature scope is allowed in this release. The only post-implementation work is release/test compatibility required to prove inherited behavior on the 8.12.2 patch identity.

The release changes only `学习安排` and `云端与AI` Settings presentation/configuration:

- top-level `学习安排` / `云端与AI` remain inside the single canonical Settings sheet;
- the service label is exactly `云端与AI`, without artificial whitespace, and both top-level rows add no extra divider line;
- Learning fine-tune is reduced to six non-duplicated decisions: new/review ratio, content, cadence, daily target, opportunity learning and standalone learning;
- duplicated fine-tune copies of the primary `强度` / `难度` decisions are removed;
- 3-option controls use strict equal three-column grids; 4-option controls use equal 2×2 grids; text may not clip or ellipsize;
- Cloud/AI is reduced to four product groups: cloud sync, AXIS AI, send scope and capability status;
- send scope uses `最小 / 平衡 / 扩展`, mapped through the existing `axis_v811_services.privacy` fields;
- capability status is four concise tiles rather than a debug-style text list;
- Settings changes leave `axis_v60_state` and `axis_v8_meta` byte-identical;
- no new learning/service/training/recording/storage/network owner is introduced.

## Validation for this work

A product-equivalent 8.12.2 candidate has already passed the dedicated Settings redesign step in both Chromium and iPhone-like WebKit at 390×844. That evidence covered:

- exact `云端与AI` label and zero top-level divider lines;
- exactly six Learning fine-tune groups;
- strict 3-column / 2×2 equal geometry with no text clipping;
- exactly four Cloud/AI groups and four capability tiles;
- service status network remaining user-invoked only;
- learning/service preference persistence through existing stores;
- no horizontal Settings overflow or nested Settings sheet;
- byte-identical `axis_v60_state` and `axis_v8_meta` before/after Settings operations;
- no page errors.

The final exact PR head must additionally complete all inherited gates after their patch-family assertions are aligned to 8.12.2. In particular:

- 8.12 Language Studio keeps 25,716 units, 4/8/12-turn dialogue and the seven-step teaching loop;
- 8.12.1 real scan/review Group Plan remains a native Safari/WebKit button path and persists four-set plans through the authoritative recording stores;
- explicit pause remains the sole rest-state trigger across inherited 8.8/8.9 browser tests;
- Shadow Runtime remains read-only and may observe any current 8.12 patch identity without taking product ownership;
- Stage 3 Continue + Live Route remains read-only, single-owner and zero recording/storage/network ownership;
- canonical topology stays one JavaScript request, zero dynamic JavaScript and zero chunks.

No final-head product code changes are permitted solely to satisfy obsolete selectors or obsolete public-version literals; those guards must be migrated to the current owner/patch-family contract instead.

After merge, Vercel Production and the fixed public alias must serve the exact merged main SHA as AXIS 8.12.2. Both Production browser gates must run the 8.12.2 Settings regression, and runtime error/fatal inspection must be clean before the release is considered sealed.

## Next planned stage

Only after AXIS 8.12.2 is Production-verified may controlled work continue to **AXIS 8.13 Stage 4 — Reality Actions**. Historical workout facts remain authoritative and immutable.
