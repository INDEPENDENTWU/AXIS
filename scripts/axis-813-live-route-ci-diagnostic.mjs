import { writeSync } from 'node:fs';

const escapeWorkflow = (value) => String(value ?? '')
  .replaceAll('%', '%25')
  .replaceAll('\r', '%0D')
  .replaceAll('\n', '%0A');

try {
  await import('./axis-813-live-route-smoke.mjs');
} catch (error) {
  const detail = String(error?.stack || error || 'unknown Live Route regression failure');
  writeSync(2, `${detail}\n`);
  writeSync(1, `::error title=AXIS 8.13 Live Route regression::${escapeWorkflow(detail)}\n`);
  process.exit(1);
}
