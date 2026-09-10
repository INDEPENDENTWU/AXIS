import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const DECISION_PATH = 'governance/version-decision.json';
const PROJECT_STATE_PATH = 'governance/project-state.json';
const RELEASE_DOC_PATH = 'docs/CURRENT_RELEASE.md';
const BUILD_META_PATH = 'dist/axis-build.json';

function fail(message) {
  console.error(`AXIS version authority: ${message}`);
  process.exit(1);
}

function readJson(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`cannot read ${path}: ${error.message}`);
  }
}

function git(args, allowFailure = false) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    if (allowFailure) return null;
    const stderr = error.stderr ? String(error.stderr).trim() : error.message;
    fail(`git ${args.join(' ')} failed: ${stderr}`);
  }
}

function readJsonAt(ref, path) {
  const raw = git(['show', `${ref}:${path}`], true);
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    fail(`cannot parse ${path} at ${ref}: ${error.message}`);
  }
}

function parseVersion(value, label) {
  if (typeof value !== 'string' || !/^\d+(?:\.\d+)*$/.test(value)) {
    fail(`${label} must be a dotted numeric version, got ${JSON.stringify(value)}`);
  }
  return value.split('.').map((part) => Number(part));
}

function compareVersions(a, b) {
  const aa = parseVersion(a, 'candidate release');
  const bb = parseVersion(b, 'base release');
  const length = Math.max(aa.length, bb.length);
  for (let i = 0; i < length; i += 1) {
    const av = aa[i] ?? 0;
    const bv = bb[i] ?? 0;
    if (av > bv) return 1;
    if (av < bv) return -1;
  }
  return 0;
}

function isZeroSha(value) {
  return !value || /^0+$/.test(value);
}

function isVersionSensitive(path) {
  if (!path || path === DECISION_PATH) return false;
  if (path.startsWith('.github/workflows/')) return true;
  if (path.startsWith('scripts/')) return true;
  if (path.startsWith('api/')) return true;
  if (path.startsWith('governance/')) return true;
  if (path === 'AGENTS.md' || path === 'DEPLOYMENT_POLICY.md') return true;
  if (path === 'docs/CURRENT_RELEASE.md' || path === 'docs/CURRENT_WORK.md') return true;
  if (/^(?:build|prepare|postbuild)-.*\.mjs$/.test(path)) return true;
  if (/^(?:app|server|sw|v\d+)[^/]*\.(?:js|mjs|css|html)$/.test(path)) return true;
  if (/^(?:index\.html|package\.json|package-lock\.json|vercel\.json|edgeone\.json)$/.test(path)) return true;
  if (/\.(?:js|mjs|cjs|ts|tsx|jsx|css|html)$/.test(path)) return true;
  return false;
}

const decision = readJson(DECISION_PATH);
const projectState = readJson(PROJECT_STATE_PATH);
const buildMeta = readJson(BUILD_META_PATH);
const releaseDoc = fs.readFileSync(RELEASE_DOC_PATH, 'utf8');

if (decision.schema_version !== 1) fail('version-decision schema_version must be 1');
if (decision.authority !== 'governance-audit-only') {
  fail('version-decision must remain governance-audit-only and may not become runtime release authority');
}
if (!Number.isInteger(decision.sequence) || decision.sequence < 1) {
  fail('version-decision sequence must be a positive integer');
}
if (!['bump', 'confirm'].includes(decision.decision)) {
  fail('version-decision decision must be either "bump" or "confirm"');
}
if (typeof decision.change_class !== 'string' || !decision.change_class.trim()) {
  fail('version-decision change_class must be non-empty');
}
if (typeof decision.summary !== 'string' || decision.summary.trim().length < 12) {
  fail('version-decision summary must explain the version decision');
}
parseVersion(decision.base_release, 'base_release');
parseVersion(decision.release, 'release');

const artifactVersion = buildMeta.version;
parseVersion(artifactVersion, `${BUILD_META_PATH}.version`);

if (decision.release !== artifactVersion) {
  fail(`decision release ${decision.release} does not match built artifact ${artifactVersion}`);
}
if (projectState.promotion !== artifactVersion || projectState.baseline !== artifactVersion) {
  fail(`project-state promotion/baseline must both equal built artifact ${artifactVersion}`);
}

const releaseTitle = releaseDoc.match(/^# Current Release — AXIS (\d+(?:\.\d+)*)$/m);
if (!releaseTitle) fail(`${RELEASE_DOC_PATH} must declare '# Current Release — AXIS <version>'`);
if (releaseTitle[1] !== artifactVersion) {
  fail(`CURRENT_RELEASE declares ${releaseTitle[1]} but built artifact is ${artifactVersion}`);
}

const baseSha = process.env.AXIS_VERSION_BASE_SHA || '';
const headSha = process.env.AXIS_VERSION_HEAD_SHA || 'HEAD';
let baseRelease = decision.base_release;
let baseDecision = null;
let changedPaths = [];

if (!isZeroSha(baseSha)) {
  const baseState = readJsonAt(baseSha, PROJECT_STATE_PATH);
  if (!baseState || typeof baseState.promotion !== 'string') {
    fail(`cannot resolve base release from ${PROJECT_STATE_PATH} at ${baseSha}`);
  }
  baseRelease = baseState.promotion;
  parseVersion(baseRelease, 'base project-state promotion');
  baseDecision = readJsonAt(baseSha, DECISION_PATH);
  const diff = git(['diff', '--name-only', `${baseSha}..${headSha}`]);
  changedPaths = diff ? diff.split('\n').filter(Boolean) : [];

  if (decision.base_release !== baseRelease) {
    fail(`decision base_release ${decision.base_release} must equal base branch release ${baseRelease}`);
  }

  const sensitive = changedPaths.filter(isVersionSensitive);
  if (sensitive.length > 0 && !changedPaths.includes(DECISION_PATH)) {
    fail(`version-sensitive changes require an explicit ${DECISION_PATH} update: ${sensitive.slice(0, 8).join(', ')}`);
  }

  if (baseDecision) {
    if (!Number.isInteger(baseDecision.sequence)) fail('base version-decision sequence is invalid');
    if (decision.sequence !== baseDecision.sequence + 1 && changedPaths.includes(DECISION_PATH)) {
      fail(`version-decision sequence must advance exactly by one (${baseDecision.sequence} -> ${baseDecision.sequence + 1})`);
    }
    if (sensitive.length > 0 && decision.sequence === baseDecision.sequence) {
      fail('version-sensitive change reused a stale version decision');
    }
  } else if (changedPaths.includes(DECISION_PATH) && decision.sequence !== 1) {
    fail('first version-decision record must start at sequence 1');
  }
}

const comparison = compareVersions(decision.release, baseRelease);
if (decision.decision === 'bump') {
  if (comparison <= 0) {
    fail(`bump requires release > base_release (${decision.release} <= ${baseRelease})`);
  }
} else {
  if (comparison !== 0) {
    fail(`confirm requires release to remain ${baseRelease}, got ${decision.release}`);
  }
  const behaviorClasses = new Set(['product', 'evolution', 'feature', 'behavior', 'hotfix']);
  if (behaviorClasses.has(decision.change_class.trim().toLowerCase())) {
    fail(`change_class ${decision.change_class} changes product behavior and therefore requires decision "bump"`);
  }
}

if (artifactVersion !== baseRelease && decision.decision !== 'bump') {
  fail(`built release changed ${baseRelease} -> ${artifactVersion} without decision "bump"`);
}
if (artifactVersion === baseRelease && decision.decision !== 'confirm') {
  fail(`built release stayed ${artifactVersion}; decision must explicitly be "confirm"`);
}

console.log(`AXIS version authority OK: ${baseRelease} -> ${artifactVersion} (${decision.decision}, sequence ${decision.sequence}, ${decision.change_class})`);
if (changedPaths.length) {
  console.log(`Checked ${changedPaths.length} changed path(s); ${changedPaths.filter(isVersionSensitive).length} version-sensitive.`);
}
