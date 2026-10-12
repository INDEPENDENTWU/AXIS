#!/usr/bin/env bash
# AXIS 8.32 — repeatable local gate; never invokes GitHub Actions or deployment.
set -Eeuo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
for tool in git node python3; do
  command -v "$tool" >/dev/null 2>&1 || { echo "Missing: $tool" >&2; exit 2; }
done
BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" == main || "$BRANCH" == master || -z "$BRANCH" ]]; then
  echo "Refusing a mutating candidate build on main/master or detached HEAD" >&2
  exit 2
fi
HEAD_SHA="$(git rev-parse HEAD)"
REPORT_DIR="${AXIS_LOCAL_REPORT_DIR:-$(dirname "$ROOT")/axis-832-local-evidence-${HEAD_SHA:0:10}}"
PORT="${AXIS_LOCAL_PORT:-4173}"
mkdir -p "$REPORT_DIR"
CHROME_BIN="${CHROME_BIN:-}"
if [[ -z "$CHROME_BIN" ]]; then
  for bin in chromium google-chrome chromium-browser; do
    if command -v "$bin" >/dev/null; then CHROME_BIN="$(command -v "$bin")"; break; fi
  done
fi
[[ -n "$CHROME_BIN" ]] || { echo "Set CHROME_BIN to a local Chromium binary" >&2; exit 2; }
node -e "import('playwright-core').catch(e=>{console.error(e.message);process.exit(2)})"
node -e "import('playwright').catch(e=>{console.error(e.message);process.exit(2)})"
echo "AXIS candidate: $HEAD_SHA on $BRANCH" | tee "$REPORT_DIR/identity.txt"
node --check scripts/prepare-832-inherited-regressions.mjs
node --check scripts/prepare-832-play-this-integration.mjs
node --check scripts/axis-832-play-this-contract.mjs
node scripts/axis-832-play-this-contract.mjs 2>&1 | tee "$REPORT_DIR/source.log"
node build-release.mjs 2>&1 | tee "$REPORT_DIR/build.log"
node postbuild-832-play-this-contract.mjs 2>&1 | tee "$REPORT_DIR/postbuild.log"
node scripts/axis-production-governance-contract.mjs 2>&1 | tee "$REPORT_DIR/governance.log"
grep -Fq 'safety.foreignStatus' scripts/axis-826-active-continuity-smoke.mjs
grep -Fq "best?.id==='lat-pulldown'" scripts/axis-882-smoke.mjs
cp -f axis-build.json "$REPORT_DIR/axis-build.json" 2>/dev/null || true
SERVER_PID=''
cleanup(){ if [[ -n "$SERVER_PID" ]]; then kill "$SERVER_PID" 2>/dev/null || true; wait "$SERVER_PID" 2>/dev/null || true; fi; }
trap cleanup EXIT
python3 -m http.server "$PORT" --bind 127.0.0.1 >"$REPORT_DIR/local-http.log" 2>&1 &
SERVER_PID=$!
sleep 1
kill -0 "$SERVER_PID" 2>/dev/null || { echo "Local server could not start" >&2; exit 1; }
for engine in chromium webkit; do
  for test in axis-826-active-continuity-smoke axis-882-smoke axis-832-play-this-browser-smoke; do
    AXIS_ENGINE="$engine" AXIS_URL="http://127.0.0.1:$PORT" CHROME_BIN="$CHROME_BIN" \
      node "scripts/$test.mjs" 2>&1 | tee "$REPORT_DIR/$test-$engine.log"
  done
done
cp -f /tmp/axis-832-*-chromium.png /tmp/axis-832-*-webkit.png "$REPORT_DIR/" 2>/dev/null || true
AXIS_SHA="$HEAD_SHA" AXIS_DIR="$REPORT_DIR" node --input-type=module -e '
import fs from "node:fs";
fs.writeFileSync(process.env.AXIS_DIR+"/report.json",JSON.stringify({sha:process.env.AXIS_SHA,level:"local-build-and-browser-smoke",engines:["chromium","webkit"],legacy:["8.26","8.8.2"],candidate:"8.32",twentyScenarioAcceptance:"not yet complete",productionCertified:false,actionsUsed:false},null,2)+"\n");'
echo "LOCAL CANDIDATE SMOKE PASSED. Evidence: $REPORT_DIR"
echo "This is NOT a Production Seal."
