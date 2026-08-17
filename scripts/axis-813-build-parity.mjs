import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';

const EXPECTED = Object.freeze({
  release: '8.12',
  releaseHash: '66d8097f7b56',
  coreHash: 'faf1d2f88421',
  cssHash: 'b59f3946c3e5',
});

const hash = (source) => crypto.createHash('sha256').update(source).digest('hex').slice(0, 12);
const read = (file) => fs.readFileSync(file, 'utf8');

for (const file of ['axis-core.js', 'axis-style.css', 'axis-build.json']) {
  assert.ok(fs.existsSync(file), `${file} must exist after node build-release.mjs`);
}

const coreHash = hash(read('axis-core.js'));
const cssHash = hash(read('axis-style.css'));
const manifest = JSON.parse(read('axis-build.json'));

assert.equal(manifest.version, EXPECTED.release, 'Stage 0/1 may not advance public release identity');
assert.equal(manifest.baseVersion, EXPECTED.release, 'Stage 0/1 may not change the stable production base');
assert.equal(manifest.architecture, 'canonical-single-runtime');
assert.equal(manifest.releaseHash, EXPECTED.releaseHash, 'Stage 0/1 may not change the 8.12 release hash');
assert.equal(coreHash, EXPECTED.coreHash, 'Stage 0/1 may not change axis-core.js');
assert.equal(cssHash, EXPECTED.cssHash, 'Stage 0/1 may not change axis-style.css');
assert.equal(manifest.assets?.core, EXPECTED.coreHash);
assert.equal(manifest.assets?.css, EXPECTED.cssHash);
assert.equal(manifest.canonical?.runtimeHash, EXPECTED.coreHash);
assert.equal(manifest.requests?.initialJavascript, 1);
assert.equal(manifest.requests?.dynamicJavascript, 0);
assert.deepEqual(manifest.assets?.chunks ?? [], []);

console.log(`AXIS 8.13 Stage 0/1 build parity PASS · release ${manifest.version} · core ${coreHash} · css ${cssHash}`);
