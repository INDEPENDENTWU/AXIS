# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.3.
- `main` baseline: `c1c4aa9098a264b662e25ff1a78697bd2226a59b`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- The previous cold-start Home semantic first-paint fix is already merged and deployed.
- Existing workout/training stores, equipment data, equipment photo persistence, visual memory, picker lifecycle, Group Plan, recording, Settings, Learning, Cloud/AI and report ownership are inherited unchanged.

## Active change

**AXIS 8.12.3 equipment gallery UI geometry hotfix.**

This work fixes exactly two presentation defects reported from iPhone Settings > 我的器械:

1. A personal equipment row with a real uploaded photo could collapse its equipment name and secondary text into the far-right chevron area. The root cause is CSS specificity: the older Settings rule `#settingsSheet #manageEqList .manageEq` forced a two-column grid and overrode the gallery row's intended three-column layout.
2. The `＋ / 添加` content in the equipment detail add-photo card was visibly biased upward because the card used implicit Grid rows plus a negative margin / padding offset on the caption.

The fix is presentation-only:

- photo-backed rows are sealed as `thumbnail | minmax(0,1fr) text | chevron` with explicit grid placement for all three visible children;
- the text column remains the flexible owner of remaining width, preserving normal ellipsis only when genuinely necessary;
- the add-photo card becomes a true centered flex column with a fixed visual gap and no negative offset;
- the same row geometry is explicitly preserved at the <=380px mobile breakpoint;
- no equipment names, IDs, photos, media references, IndexedDB data, visual-memory data or training records are rewritten.

Explicitly unchanged: public version, equipment/photo persistence, cover/delete behavior, picker lifecycle, custom-equipment editing logic, training state/data, Home, Group Plan, camera/watermark, Settings information architecture, Training Report, Learning, Cloud/AI, Runtime/Live Route and deployment topology.

## Validation for this work

Before merge:

- build the exact AXIS 8.12.3 candidate and require the UI-geometry marker to be present in the canonical runtime;
- at 417 CSS px and 375 CSS px, require a photo-backed `我的器械` row to resolve to three columns;
- require the equipment text column to retain the majority of usable row width rather than collapse into the chevron column;
- require thumbnail, text and chevron to remain non-overlapping and vertically centered;
- require the add-photo card to use centered column layout with `＋` and `添加` horizontally centered and their combined content group vertically centered inside the card;
- run the dedicated geometry regression in Chromium and iPhone WebKit;
- retain the existing equipment gallery/picker regression, inherited Group Plan regression and all repository/release gates.

A short unrelated legacy WebKit timeout is not addressed with product changes; if it occurs, rerun the unchanged job and require a clean result before merge.

## Next planned stage

When the exact PR #52 head is green, squash-merge it into `main`. Then verify Vercel deploys that exact merge SHA to the existing AXIS Production project.

Production verification must confirm:

- deployment state is READY for the exact merge SHA;
- `https://axis-five-puce.vercel.app` returns HTTP 200 and remains AXIS 8.12.3 / `canonical-single-runtime`;
- the canonical runtime contains `__AXIS_8123_EQUIPMENT_GALLERY_UI_GEOMETRY__`;
- the two presentation fixes do not introduce runtime errors.

No other product optimization is part of this hotfix.
