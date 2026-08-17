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

const root = process.cwd();
const baseSha = String(process.env.AXIS_PARITY_BASE_SHA || '').trim();
assert.match(baseSha, /^[a-f0-9]{40}$/i, 'AXIS_PARITY_BASE_SHA must identify the exact comparison base');

// Candidate has already been built by the workflow immediately before this gate.
const candidate = fingerprint(root);
assert.equal(candidate.version, '8.12', 'Stage 0/1 may not advance public release identity');
assert.equal(candidate.baseVersion, '8.12', 'Stage 0/1 may not change the stable production base');
assert.equal(candidate.architecture, 'canonical-single-runtime');
assert.equal(candidate.requests.initialJavascript, 1);
assert.equal(candidate.requests.dynamicJavascript, 0);
assert.deepEqual(candidate.chunks ?? [], []);

const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'axis-813-parity-'));
const baseWorktree = path.join(tempRoot, 'base');
try {
  execFileSync('git', ['worktree', 'add', '--detach', baseWorktree, baseSha], { cwd: root, stdio: 'pipe' });
  execFileSync(process.execPath, ['build-release.mjs'], { cwd: baseWorktree, stdio: 'pipe' });
  const baseline = fingerprint(baseWorktree);
  assert.deepEqual(candidate, baseline, 'Stage 0/1 changed the exact production artifact compared with the PR base');
} finally {
  try { execFileSync('git', ['worktree', 'remove', '--force', baseWorktree], { cwd: root, stdio: 'ignore' }); } catch {}
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

console.log(`AXIS 8.13 Stage 0/1 exact base parity PASS · ${baseSha.slice(0, 12)} · release ${candidate.version} · raw core ${candidate.rawCore} · canonical ${candidate.canonicalRuntime} · css ${candidate.rawCss}`);
