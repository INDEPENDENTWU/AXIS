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
const old=fs.readFileSync('.github/workflows/axis-edgeone-production-mirror.yml','utf8');
if(!old.includes('if: ${{ false }}'))fail('legacy Vercel-coupled EdgeOne push publisher must be disabled');
console.log('[AXIS deployment policy] PASS · zero automatic Vercel deployments · exact-main dual-provider official release only');
