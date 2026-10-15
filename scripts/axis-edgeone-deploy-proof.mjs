import assert from 'node:assert/strict';
import fs from 'node:fs';

// Official EdgeOne CLI supports --json. The deploy response must prove it
// landed in the PRE-EXISTING preflight project, not a new same-name project.
export function parseDeployOutput(source,expectedProjectId){
 const raw=String(source||'').replace(/\u001b\[[0-9;]*m/g,'');
 const lines=raw.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
 let data=null;
 for(let i=lines.length-1;i>=0;i--){
  if(!lines[i].startsWith('{'))continue;
  try{
   const candidate=JSON.parse(lines[i]);
   if(candidate&&typeof candidate==='object'&&(candidate.status||candidate.projectId||candidate.url)){
    data=candidate;break;
   }
  }catch{}
 }
 const match=pattern=>raw.match(pattern)?.[1]||'';
 const status=String(data?.status||'').toLowerCase();
 if(status&&status!=='success')throw Error('EdgeOne CLI returned a non-success JSON status');
 const deploymentUrl=String(data?.url||match(/(?:EDGEONE_DEPLOY_URL|Deploy URL):?\s*=?(https:\/\/[^\s\u001b]+)/i)).trim();
 const projectId=String(data?.projectId||match(/EDGEONE_PROJECT_ID\s*=\s*([^\s\u001b]+)/i)).trim();
 const deploymentId=String(data?.deploymentId||match(/EDGEONE_DEPLOYMENT_ID\s*=\s*([^\s\u001b]+)/i)).trim();
 if(!expectedProjectId||!projectId||projectId!==expectedProjectId)throw Error('EdgeOne deployed project identity missing or differs from read-only preflight');
 if(!deploymentUrl)throw Error('EdgeOne deployment URL missing from structured CLI evidence');
 let u;
 try{u=new URL(deploymentUrl)}catch{throw Error('EdgeOne deployment URL invalid')}
 if(u.protocol!=='https:'||!u.hostname.endsWith('.edgeone.cool'))throw Error('EdgeOne deployment URL must be an HTTPS provider preview-domain origin');
 if(u.username||u.password||u.hash)throw Error('EdgeOne deployment URL contains forbidden credentials/fragment');
 if(data?.status==='success'&&!deploymentId)throw Error('EdgeOne successful structured response lacks deployment ID');
 if(!/^[a-zA-Z0-9_-]{3,120}$/.test(projectId))throw Error('EdgeOne project ID has unexpected syntax');
 return {projectId,deploymentId:deploymentId||null,url:u.href,host:u.hostname};
}
if(process.argv.includes('--self-test')){
 const project='makers-test-verified-009';
 const url='https://axisfitness-mirror-candidate.edgeone.cool?eo_token=private-test-secret';
 const line=JSON.stringify({status:'success',url,projectId:project,deploymentId:'dp_42',site:'global'});
 const pass=parseDeployOutput('[cli] publishing\n'+line,project);
 assert.equal(pass.projectId,project);
 assert.equal(pass.deploymentId,'dp_42');
 assert.equal(pass.url,new URL(url).href);
 assert.deepEqual(parseDeployOutput('EDGEONE_DEPLOY_URL='+url+'\nEDGEONE_PROJECT_ID='+project,project).projectId,project);
 for(const [source,id] of [[line,'makers-wrong'],[line,''],['{"status":"error","error":"unauthorized"}',project],['EDGEONE_DEPLOY_URL='+url,project],[JSON.stringify({status:'success',url:'http://bad.site',projectId:project,deploymentId:'dp_2'}),project],[JSON.stringify({status:'success',url,projectId:project}),project]]){
  assert.throws(()=>parseDeployOutput(source,id));
 }
 console.log('[AXIS EdgeOne deploy proof] SELF-TEST PASS · CLI structured/fallback parser · wrong project, absent project, non-success, spoofed URL and missing deployment identity fail closed');
 process.exit(0);
}
if(process.argv[2]!=='--parse')throw Error('Use --self-test or --parse');
const expected=JSON.parse(fs.readFileSync('/tmp/axis-provider-preflight.json','utf8'));
if(expected.schema!=='axis.832.provider-preflight.v1'||!expected.sourceCommit||expected.sourceCommit!==process.env.AXIS_RELEASE_SHA)throw Error('Independent provider preflight SHA missing/mismatch');
const proof=parseDeployOutput(fs.readFileSync('/tmp/axis-edgeone-deploy.log','utf8'),expected.edgeOne?.projectId);
const record={schema:'axis.832.edgeone-deployment-proof.v1',sourceCommit:expected.sourceCommit,projectId:proof.projectId,deploymentId:proof.deploymentId,host:proof.host,url:proof.url,checkedAt:new Date().toISOString()};
fs.writeFileSync('/tmp/axis-edgeone-deploy-proof.json',JSON.stringify(record,null,2)+'\n',{mode:0o600});
console.log('[AXIS EdgeOne deploy proof] PASS · existing project ID matched preflight · parsed provider deployment identity (sensitive URL withheld)');
