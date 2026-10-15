import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';

// Read-only preflight. No mutations are permitted before both accounts/projects
// have been checked. This is NOT a quota guarantee or a Production certification.
const expectedProject='axisfitness-mirror';
const vercelProject='prj_8JJhe0nj2CryZb4xHoHV1WBffn8f';
const vercelTeam='team_o4AYEAPceiqKe8Cn7B3LJhGG';
const fail=message=>{throw new Error('[AXIS dual-provider preflight] '+message)};
function identifyExistingProject(page,name=expectedProject){
 if(!Array.isArray(page?.items))fail('EdgeOne project discovery returned no usable project list');
 const exact=page.items.filter(p=>p&&p.name===name&&typeof p.projectId==='string'&&p.projectId.length>0);
 if(exact.length!==1)fail('EdgeOne target must be one existing project with the exact approved name; NEVER create or guess a target');
 if(/^(?:deleted|deleting|disabled|suspended)$/i.test(String(exact[0].status||'')))fail('EdgeOne target is not an active existing project');
 return exact[0];
}
function checkIdentity({sha,head,vercel,edge,region}){
 if(!/^[0-9a-f]{40}$/i.test(String(sha||''))||sha!==head)fail('source HEAD mismatch');
 if(vercel?.id!==vercelProject)fail('Vercel token resolved a different project');
 if(edge?.name!==expectedProject||!edge.projectId)fail('EdgeOne target project identity drift');
 if(!['china','global'].includes(region))fail('EdgeOne API region must be pinned to its token issuer site');
 return true;
}
if(process.argv.includes('--self-test')){
 const exact='a'.repeat(40),project={name:expectedProject,projectId:'edge-test-existing',status:'active'};
 assert.equal(identifyExistingProject({items:[project]}).projectId,project.projectId);
 assert.throws(()=>identifyExistingProject({items:[]}),/existing project/);
 assert.throws(()=>identifyExistingProject({items:[{...project,name:'another'}]}),/existing project/);
 assert.throws(()=>identifyExistingProject({items:[project,project]}),/existing project/);
 assert.throws(()=>identifyExistingProject({items:[{...project,status:'suspended'}]}),/not an active/);
 assert.ok(checkIdentity({sha:exact,head:exact,vercel:{id:vercelProject},edge:project,region:'global'}));
 assert.throws(()=>checkIdentity({sha:exact,head:exact,vercel:{id:'wrong'},edge:project,region:'global'}),/different project/);
 assert.throws(()=>checkIdentity({sha:exact,head:exact,vercel:{id:vercelProject},edge:project,region:'unknown'}),/region/);
 console.log('[AXIS dual-provider preflight] SELF-TEST PASS · existing target only · explicit site · wrong identity rejected · no network or deployments');
 process.exit(0);
}
if(process.argv[2]!=='--check')fail('Use --check or --self-test');
const sha=String(process.env.AXIS_RELEASE_SHA||'').trim();
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(!/^[0-9a-f]{40}$/i.test(sha)||head!==sha)fail('not at the exact admitted merged-main SHA');
if(execFileSync('git',['ls-remote','origin','refs/heads/main'],{encoding:'utf8',timeout:25000}).trim().split(/\s+/)[0]!==sha)fail('remote main changed; do not touch either provider');
const vercelToken=String(process.env.VERCEL_API_TOKEN||'');
const edgeToken=String(process.env.EDGEONE_API_TOKEN||'');
if(!vercelToken||!edgeToken)fail('two separate private provider tokens are required; no partial release');
const sdkRoot=String(process.env.AXIS_MAKERS_SDK_ROOT||'').trim();
if(!sdkRoot||!path.isAbsolute(sdkRoot))fail('Makers SDK must be installed in a dedicated runner temporary directory');
const requireFromTemp=createRequire(path.join(sdkRoot,'package.json'));
let Makers;
try{({Makers}=await import(pathToFileURL(requireFromTemp.resolve('@edgeone/makers-sdk')).href))}
catch{fail('isolated official Makers SDK unavailable; do not attempt Production')}
if(typeof Makers!=='function')fail('official Makers SDK does not expose its expected client');
const endpoint='https://api.vercel.com/v9/projects/'+encodeURIComponent(vercelProject)+'?teamId='+encodeURIComponent(vercelTeam);
let vProject;
try{
 const res=await fetch(endpoint,{headers:{Authorization:'Bearer '+vercelToken,Accept:'application/json'},signal:AbortSignal.timeout(20000)});
 if(!res.ok)fail('Vercel read-only project lookup denied (HTTP '+res.status+'); do not publish');
 vProject=await res.json();
}catch(e){if(String(e.message||'').startsWith('[AXIS dual-provider preflight]'))throw e;fail('Vercel project lookup unavailable; do not publish')}
let makers,page,selected,full;
try{
 makers=new Makers({token:edgeToken,timeout:20,retries:1});
 page=await makers.projects.list({name:expectedProject,page:0,pageSize:10});
 selected=identifyExistingProject(page);
 full=await makers.projects.get({projectId:selected.projectId});
}catch(e){if(String(e.message||'').startsWith('[AXIS dual-provider preflight]'))throw e;fail('EdgeOne token cannot read the existing approved project; do not publish')}
const region=makers.region;
checkIdentity({sha,head,vercel:vProject,edge:full,region});
if(full.projectId!==selected.projectId)fail('EdgeOne project lookup changed identity');
const prior={};
for(const [key,origin] of [['vercel','https://axis-five-puce.vercel.app'],['official','https://axis.juele.fun']]){
 try{
  const r=await fetch(origin+'/axis-build.json?_axis_preflight='+Date.now(),{headers:{'Cache-Control':'no-store'},signal:AbortSignal.timeout(15000)});
  if(!r.ok)fail(key+' live baseline unavailable (HTTP '+r.status+')');
  const manifest=await r.json();
  if(!/^\d+\.\d+(?:\.\d+)?$/.test(String(manifest?.version||'')))fail(key+' live manifest lacks a credible version');
  prior[key]={origin,version:manifest.version,sourceCommit:manifest.sourceCommit||null};
 }catch(e){if(String(e.message||'').startsWith('[AXIS dual-provider preflight]'))throw e;fail(key+' live baseline could not be read; keep previous Production')}
}
const record={schema:'axis.832.provider-preflight.v1',sourceCommit:sha,checkedAt:new Date().toISOString(),
 vercel:{projectId:vProject.id,teamId:vercelTeam},edgeOne:{projectId:full.projectId,name:full.name,site:region},previousPublic:prior};
fs.writeFileSync('/tmp/axis-provider-preflight.json',JSON.stringify(record,null,2)+'\n',{mode:0o600});
const envFile=String(process.env.GITHUB_ENV||'');
if(!envFile)fail('GITHUB_ENV missing: cannot safely bind the EdgeOne site to the deployment command');
fs.appendFileSync(envFile,'AXIS_EDGEONE_SITE='+region+'\n');
console.log('[AXIS dual-provider preflight] PASS · Vercel existing project · EdgeOne existing project and token issuer site · two public baselines · NO deployment');
