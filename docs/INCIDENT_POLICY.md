# AXIS Incident Policy

## Objective

A production defect should become a permanent regression guard, not a recurring class of bug.

## Severity

### P0 — data/safety integrity

Examples: workout history corruption/loss, irreversible destructive migration, secret exposure, widespread inability to complete a workout.

Action: stop rollout, preserve evidence, rollback only if data compatibility is safe, prioritize recovery over feature work.

### P1 — critical workout path

Examples: start/record/pause/switch/finish broken, state/storage split, crash/relaunch loses active workout, release artifact mismatch.

Action: block further release until reproduced and regression-tested.

### P2 — significant UX/capability defect

Examples: picker/search dead action, major layout unusability, camera path broken with manual fallback still available.

Action: scoped hotfix with normal ownership/gates.

### P3 — cosmetic/minor

No data/semantic impact. Fix opportunistically without bypassing release discipline.

## Response sequence

1. Capture exact app/Web version, build/Git SHA and environment.
2. Reproduce from authoritative data when possible.
3. Identify semantic owner and persistence/UI/platform boundaries involved.
4. Add a failing automated regression or golden fixture before/with the fix.
5. Fix the current owner rather than layering another writer.
6. Run all directly affected and inherited critical gates.
7. Release from an exact revision.
8. Verify the actual production artifact/binary.
9. Record root cause and permanent guard.

## Prohibited incident behavior

- speculative multi-file changes without a reproduction;
- clearing user data as a normal fix;
- weakening a test because it exposes a real regression;
- claiming deployment success from a source commit alone;
- changing schema to escape a migration problem;
- introducing a second owner as a temporary shortcut without an explicit retirement plan and guard.

## Post-incident record

For P0/P1, capture:

- symptom;
- affected versions;
- root cause;
- owner conflict/contract violated;
- exact fix revision;
- regression test/fixture path;
- migration/recovery impact;
- production verification evidence.

Prefer adding this to the release PR/incident issue rather than creating unrelated production commits solely for prose.
