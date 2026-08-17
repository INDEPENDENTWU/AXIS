import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const hash = (source) => crypto.createHash('sha256').update(source).digest('hex').slice(0, 12);
const read = (root, file) => fs.readFileSync(path.join(root, file), 'utf8');

function fingerprint(root) {
  for (const file of ['axis-core.js', 'axis-style.css', 'index.html', 'axis-build.json']) {
    assert.ok(fs.existsSync(path.join(root, file)), `${file} must exist after node build-release.mjs`);
  }
  const manifest = JSON.parse(read(root, 'axis-build.json'));
  return {
    rawCore: hash(read(root, 'axis-core.js')),
    rawCss: hash(read(root, 'axis-style.css')),
    rawHtml: hash(read(root, 'index.html')),
    version: manifest.version,
    baseVersion: manifest.baseVersion,
    releaseHash: manifest.releaseHash,
    architecture: manifest.architecture,
    manifestCore: manifest.assets?.core ?? null,
    manifestCss: manifest.assets?.css ?? null,
    canonicalRuntime: manifest.canonical?.runtimeHash ?? null,
    requests: {
      initialJavascript: manifest.requests?.initialJavascript ?? null,
      dynamicJavascript: manifest.requests?.dynamicJavascript ?? null,
      stylesheet: manifest.requests?.stylesheet ?? null,
    },
    chunks: manifest.assets?.chunks ?? null,
  };
}

function assertProductionBoundary(x, label) {
  assert.equal(x.version, '8.12', `${label}: public release identity drifted`);
  assert.equal(x.baseVersion, '8.12', `${label}: stable production base drifted`);
  assert.equal(x.architecture, 'canonical-single-runtime', `${label}: canonical architecture drifted`);
  assert.equal(x.requests.initialJavascript, 1, `${label}: initial JavaScript request topology drifted`);
  assert.equal(x.requests.dynamicJavascript, 0, `${label}: dynamic JavaScript returned`);
  assert.equal(x.requests.stylesheet, 1, `${label}: stylesheet request topology drifted`);
  assert.deepEqual(x.chunks ?? [], [], `${label}: dynamic runtime chunks returned`);
  assert.match(String(x.releaseHash || ''), /^[a-f0-9]{12}$/i, `${label}: release hash missing`);
  assert.match(String(x.canonicalRuntime || ''), /^[a-f0-9]{12}$/i, `${label}: canonical runtime marker missing`);
  assert.match(String(x.manifestCss || ''), /^[a-f0-9]{12}$/i, `${label}: CSS marker missing`);
}

const root = process.cwd();
const baseSha = String(process.env.AXIS_PARITY_BASE_SHA || '').trim();
assert.match(baseSha, /^[a-f0-9]{40}$/i, 'AXIS_PARITY_BASE_SHA must identify the exact comparison base');

// Candidate has already been built by the workflow immediately before this gate.
const candidate = fingerprint(root);
assertProductionBoundary(candidate, 'candidate');

// Exact artifact parity is meaningful only when the PR changes the isolated 8.13
// foundation/governance surface. Product/build changes are allowed to change hashes,
// but must keep the production identity/topology contract and be proven by their
// dedicated browser/regression gates + Work Continuity handoff.
const safeExactParityPath = (file) =>
  file.startsWith('runtime/') ||
  file.startsWith('docs/') ||
  file.startsWith('.github/') ||
  file === 'scripts/axis-813-runtime-core.mjs' ||
  file === 'scripts/axis-813-build-parity.mjs' ||
  file === 'scripts/axis-repository-contract.mjs';

const changed = execFileSync('git', ['diff', '--name-only', `${baseSha}...HEAD`], { cwd: root, encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const productionChanged = changed.filter((file) => !safeExactParityPath(file));

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'axis-813-parity-'));
const baseWorktree = path.join(tempRoot, 'base');
try {
  execFileSync('git', ['worktree', 'add', '--detach', baseWorktree, baseSha], { cwd: root, stdio: 'pipe' });
  execFileSync(process.execPath, ['build-release.mjs'], { cwd: baseWorktree, stdio: 'pipe' });
  const baseline = fingerprint(baseWorktree);
  assertProductionBoundary(baseline, 'baseline');

  if (!productionChanged.length) {
    assert.deepEqual(candidate, baseline, 'Runtime-only/governance change altered the exact production artifact compared with the base');
    console.log(`AXIS 8.13 exact base parity PASS · ${baseSha.slice(0, 12)} · release ${candidate.version} · raw core ${candidate.rawCore} · canonical ${candidate.canonicalRuntime} · css ${candidate.rawCss}`);
  } else {
    assert.equal(candidate.version, baseline.version, 'controlled product change unexpectedly changed public version');
    assert.equal(candidate.baseVersion, baseline.baseVersion, 'controlled product change unexpectedly changed stable base');
    assert.equal(candidate.architecture, baseline.architecture, 'controlled product change unexpectedly changed architecture');
    assert.deepEqual(candidate.requests, baseline.requests, 'controlled product change unexpectedly changed request topology');
    assert.deepEqual(candidate.chunks ?? [], baseline.chunks ?? [], 'controlled product change unexpectedly changed chunk topology');
    console.log(`AXIS 8.13 controlled product boundary PASS · ${productionChanged.length} production-affecting path(s) · hashes may change · identity/topology preserved`);
  }
} finally {
  try { execFileSync('git', ['worktree', 'remove', '--force', baseWorktree], { cwd: root, stdio: 'ignore' }); } catch {}
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
