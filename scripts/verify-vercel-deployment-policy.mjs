import fs from 'node:fs';

const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));
const rules=config?.git?.deploymentEnabled;
const fail=(message)=>{throw new Error(message)};
if(!rules||typeof rules!=='object')fail('vercel git.deploymentEnabled map is required');
if(rules['**']!==false)fail('all non-main branches must be disabled by **: false');
if(rules.main!==true)fail('main must remain explicitly deployable');
if(config.buildCommand!=='node build-release.mjs')fail('Vercel must use canonical build-release.mjs');
if(config.outputDirectory!=='.')fail('unexpected Vercel output directory');
console.log('[AXIS deployment policy] PASS · automatic Vercel Git deploys are main-only');
