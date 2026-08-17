# Security Policy

AXIS handles workout records, media and optional location/account data. Security and privacy defects should be reported privately.

## Reporting a vulnerability

Please do not open a public issue containing exploit details, credentials, private media or sensitive user data.

Use GitHub's private vulnerability reporting for this repository when the **Report a vulnerability** action is available. If that channel is not enabled, contact `@INDEPENDENTWU` through GitHub first and request a private reporting channel without publishing technical exploit details.

A useful report includes:

- affected AXIS version or source commit;
- affected URL / endpoint / platform;
- minimal reproduction steps;
- security impact;
- whether authentication or user interaction is required;
- a proof of concept with secrets and personal data removed.

## Scope

Security-sensitive areas include:

- server-side AI/provider credentials;
- account and sync authorization;
- cross-user data isolation;
- media object access;
- signed upload/download intents;
- location/privacy leakage;
- stored or reflected script injection;
- request replay/idempotency failures;
- production artifact or deployment integrity;
- native bridge privilege boundaries.

## Product boundaries

The browser must never contain provider admin secrets. AI and cloud services are optional capability layers and must not be able to corrupt the local workout source of truth when unavailable or malformed.

Training media is private by default. A future cloud media implementation must use authenticated user-scoped objects rather than a public bucket.

Client-side timestamp/watermark behavior is evidence for the user's record, not a cryptographic proof against a device owner. Stronger integrity claims require a server-signed or append-only remote trust boundary.

## Supported version

Security fixes target the current Production release and the active release candidate. Historical source modules can still matter when they remain compiler inputs; a vulnerability in a historical-looking file should not be dismissed until the final artifact is checked.
