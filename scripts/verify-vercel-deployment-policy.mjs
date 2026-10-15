import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const fail=(message)=>{throw new Error('[AXIS deployment policy] '+message)};
const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));
const rules=config?.git?.deploymentEnabled;
if(rules!==false)fail('Vercel auto Git deploys must be disabled; final release is manual, dual-provider only');
if(config.buildCommand!=='node build-release.mjs'||config.outputDirectory!=='.')fail('canonical build and output contract drift');
const workflow=fs.readFileSync('.github/workflows/axis-edgeone-official-release.yml','utf8');
for(const required of ['workflow_dispatch:',"ref: main",'AXIS_RELEASE_SHA:', 'AXIS_EDGEONE_ADMISSION_JSON:', 'VERCEL_API_TOKEN:', 'EDGEONE_API_TOKEN:', 'scripts/axis-vercel-official-release.mjs','scripts/axis-edgeone-fallback-release.mjs --check','scripts/axis-edgeone-fallback-release.mjs --publish','axis.juele.fun']){
 if(!workflow.includes(required))fail('dual-provider official admission missing '+required);
}
if(!fs.existsSync('scripts/axis-vercel-official-release.mjs'))fail('exact Vercel Production trigger missing');
const preflight='node scripts/axis-dual-provider-preflight.mjs --check';
const vPublish='node scripts/axis-vercel-official-release.mjs';
const ePublish='node scripts/axis-edgeone-fallback-release.mjs --publish';
const start=workflow.indexOf(preflight),afterV=workflow.indexOf(vPublish),afterE=workflow.indexOf(ePublish);
if(start<0||afterV<0||afterE<0||!(start<afterV&&afterV<afterE))fail('existing-provider read-only preflight must run before both Production publishers');
if(!workflow.includes('AXIS_MAKERS_SDK_ROOT=')||!workflow.includes('AXIS_EDGEONE_SITE=' )&&!fs.readFileSync('scripts/axis-dual-provider-preflight.mjs','utf8').includes('AXIS_EDGEONE_SITE='))fail('EdgeOne token issuer site not pinned before publish');
const eScript=fs.readFileSync('scripts/axis-edgeone-fallback-release.mjs','utf8');
if(!eScript.includes("'--site',providerSite")||!eScript.includes('axis-provider-preflight.json'))fail('EdgeOne CLI must require preflight evidence and explicit token region');
execFileSync(process.execPath,['scripts/axis-dual-provider-preflight.mjs','--self-test'],{stdio:'inherit',timeout:15000});
const parser=fs.readFileSync('scripts/axis-edgeone-deploy-proof.mjs','utf8');
if(!parser.includes('axis.832.edgeone-deployment-proof.v1')||!parser.includes('projectId!==expectedProjectId'))fail('structured EdgeOne existing-project proof missing');
if(!eScript.includes("'--json'")||!eScript.includes('scripts/axis-edgeone-deploy-proof.mjs')||!eScript.includes("'--parse'"))fail('EdgeOne Production must use structured CLI proof verification before live checks');
const eLive=fs.readFileSync('scripts/edgeone-live-verify.mjs','utf8');
if(!eLive.includes('axis-edgeone-deploy-proof.json')||!eLive.includes('preflight.edgeOne?.projectId'))fail('live EdgeOne verification must bind to the exact preflight project ID');
if(!workflow.includes("edge.projectId!==provider.edgeOne?.projectId"))fail('dual-provider final seal must include exact EdgeOne project ID');
execFileSync(process.execPath,['scripts/axis-edgeone-deploy-proof.mjs','--self-test'],{stdio:'inherit',timeout:15000});


// Verify the YAML job condition as an independent line. A comment containing
// a literal "\n    if:" must never be misclassified as a disabled deployment.
const hasDisabledJob=(source,job)=>{
 const lines=source.split(/\r?\n/);
 const at=lines.findIndex(line=>line==='  '+job+':');
 if(at<0)return false;
 const prefix=lines.slice(at+1,at+9);
 return prefix.some(line=>/^    if:\s*\$\{\{\s*false\s*\}\}\s*$/.test(line));
};
const old=fs.readFileSync('.github/workflows/axis-edgeone-production-mirror.yml','utf8');
if(!hasDisabledJob(old,'deploy-production'))fail('legacy EdgeOne Production job lacks an executable, correctly indented YAML disable guard');
const custom=fs.readFileSync('.github/workflows/axis-custom-domain-production.yml','utf8');
if(!hasDisabledJob(custom,'live-production'))fail('legacy custom-domain Production job still runs on main push');

console.log('[AXIS deployment policy] PASS · zero automatic Vercel deployments · exact-main dual-provider official release only');
