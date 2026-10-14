import fs from 'node:fs';

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
