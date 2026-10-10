// AXIS 8.30 — canonical Object identity release driver.
const FROM='8.29',VERSION='8.30';
await import('./scripts/prepare-830-release-identity.mjs');
await import('./scripts/prepare-830-governance-state.mjs');
await import('./scripts/axis-830-object-identity-audit.mjs');
console.log('[AXIS 8.30] identity-preserving selection · 8.29 seal inherited · no migration or new writer');
