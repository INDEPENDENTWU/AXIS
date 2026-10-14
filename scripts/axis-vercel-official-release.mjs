import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const fatal=(message)=>{throw new Error('[AXIS Vercel official release] '+message)};
const sha=String(process.env.AXIS_RELEASE_SHA||'').trim();
const token=String(process.env.VERCEL_API_TOKEN||'').trim();
const project=String(process.env.AXIS_VERCEL_PROJECT_ID||'prj_8JJhe0nj2CryZb4xHoHV1WBffn8f');
const team=String(process.env.AXIS_VERCEL_TEAM_ID||'team_o4AYEAPceiqKe8Cn7B3LJhGG');
const repoId=Number(process.env.GITHUB_REPOSITORY_ID||'1328788334');
const alias='https://axis-five-puce.vercel.app';
const results='/tmp/axis-vercel-official-result.json';
const manifest=JSON.parse(fs.readFileSync('axis-build.json','utf8'));
if(!/^[a-f0-9]{40}$/i.test(sha)||manifest.sourceCommit!==sha)fatal('local manifest must match exact merged-main SHA');
if(manifest.version!==manifest.baseVersion||manifest.version!=='8.32')fatal('8.32 exact release identity required');
if(!Number.isSafeInteger(repoId)||repoId<=0)fatal('GitHub repository id missing');
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(head!==sha)fatal('HEAD mismatch');
const remote=execFileSync('git',['ls-remote','origin','refs/heads/main'],{encoding:'utf8'}).trim().split(/\s+/)[0];
if(remote!==sha)fatal('remote main mismatch');
if(!token)fatal('VERCEL_API_TOKEN required; no Vercel or EdgeOne deployment permitted');
const hdr={Authorization:'Bearer '+token,'Content-Type':'application/json',Accept:'application/json'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const parity=m=>m&&
  m.sourceCommit===sha&&m.version===manifest.version&&m.baseVersion===manifest.baseVersion&&
  m.architecture===manifest.architecture&&m.assets?.core===manifest.assets?.core&&
  m.assets?.css===manifest.assets?.css&&m.canonical?.runtimeHash===manifest.canonical?.runtimeHash;
async function manifestAt(base){
 const controller=new AbortController(),t=setTimeout(()=>controller.abort(),12000);
 try{
  const r=await fetch(base+'/axis-build.json?axis_verify='+Date.now(),{redirect:'follow',signal:controller.signal,headers:{'Cache-Control':'no-store'}});
  if(!r.ok)return null;
  return await r.json();
 }catch{return null}finally{clearTimeout(t)}
}
async function api(url,init={}){
 const response=await fetch(url,{...init,headers:{...hdr,...init.headers},signal:AbortSignal.timeout(25000)});
 const s=await response.text();let v={};try{v=JSON.parse(s)}catch{}
 if(!response.ok)fatal('Vercel API '+response.status+' · '+String(v.error?.code||v.error?.message||'provider error').slice(0,180));
 return v;
}
let details=null;
const existing=await manifestAt(alias);
if(parity(existing)){
 // Idempotent recovery: already served at the fixed public alias, do not consume another build.
 fs.writeFileSync(results,JSON.stringify({sourceCommit:sha,version:manifest.version,ready:true,alias,provider:'vercel',reusedExisting:true,verifiedAt:new Date().toISOString()},null,2)+'\n');
 console.log('[AXIS Vercel official release] existing fixed alias already exact; no new deployment');
 process.exit(0);
}
const endpoint='https://api.vercel.com/v13/deployments?teamId='+encodeURIComponent(team);
const deployment=await api(endpoint,{method:'POST',body:JSON.stringify({
 name:'axis',project,target:'production',
 gitSource:{type:'github',repoId,ref:'main',sha}
})});
const id=deployment.id;
if(!/^dpl_[\w]+$/.test(String(id||'')))fatal('Vercel did not return deployment ID; inspect provider before retrying');
console.log('[AXIS Vercel official release] one Git Production deployment requested '+id);
let ready=false, last='';
for(let i=0;i<60;i++){
 const state=await api('https://api.vercel.com/v13/deployments/'+encodeURIComponent(id)+'?teamId='+encodeURIComponent(team));
 last=state.readyState||state.state||'unknown';
 const exactGit=state.meta?.githubCommitSha||state.gitSource?.sha||state.gitSource?.commitSha;
 if(exactGit && exactGit!==sha)fatal('Vercel deployment git source drift');
 if(last==='ERROR'||last==='CANCELED'||last==='BLOCKED')fatal('deployment '+id+' '+last+'; no second automatic attempt');
 if(last==='READY'){ready=true;break}
 await sleep(10000);
}
if(!ready)fatal('deployment '+id+' did not reach READY within ten minutes; do not redeploy automatically');
let verified=false;
for(let i=0;i<24;i++){
 const live=await manifestAt(alias);
 if(parity(live)){verified=true;break}
 await sleep(5000);
}
if(!verified)fatal('Vercel READY but fixed production alias manifest does not match exact source and asset hashes');
const result={sourceCommit:sha,version:manifest.version,deploymentId:id,ready:true,alias,provider:'vercel',verifiedAt:new Date().toISOString()};
fs.writeFileSync(results,JSON.stringify(result,null,2)+'\n',{mode:0o600});
console.log('[AXIS Vercel official release] READY · fixed alias exact '+manifest.version+' · '+sha);
