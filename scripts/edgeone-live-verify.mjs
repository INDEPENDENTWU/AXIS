import fs from 'node:fs';

const logPath='/tmp/axis-edgeone-deploy.log';
const goldenBase=process.env.VERCEL_GOLDEN_URL||'https://axis-five-puce.vercel.app';
const local=JSON.parse(fs.readFileSync('axis-build.json','utf8'));
const result={baseUrl:'',runnerUnauthenticatedStatus:null,authenticatedStatus:null,manifestParity:false,runtimeMarker:false,convergenceAttempts:0,convergedAt:null,api:{},accessModel:'project-domain-region-dependent; durable mainland access requires custom domain/policy',error:'',verifiedAt:new Date().toISOString()};
let fatal=null;
const fail=msg=>{throw new Error(`[AXIS EdgeOne live] ${msg}`)};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function request(url,{json=false,method='GET'}={}){const r=await fetch(url,{method,redirect:'follow',headers:{'Cache-Control':'no-cache','Pragma':'no-cache'},signal:AbortSignal.timeout(15000)});const text=await r.text();let data=null;if(json){try{data=JSON.parse(text)}catch{}}return{status:r.status,ok:r.ok,text,data,url:r.url}}
const parityFields=remote=>[['version',remote?.version,local.version],['baseVersion',remote?.baseVersion,local.baseVersion],['sourceCommit',remote?.sourceCommit,local.sourceCommit],['architecture',remote?.architecture,local.architecture],['core',remote?.assets?.core,local.assets?.core],['css',remote?.assets?.css,local.assets?.css],['runtimeHash',remote?.canonical?.runtimeHash,local.canonical?.runtimeHash],['initialJavascript',remote?.requests?.initialJavascript,local.requests?.initialJavascript],['dynamicJavascript',remote?.requests?.dynamicJavascript,local.requests?.dynamicJavascript]];
try{
  if(!fs.existsSync(logPath))fail('deployment log missing');
  const log=fs.readFileSync(logPath,'utf8'),match=log.match(/Deploy URL:\s*(https:\/\/[^\s\u001b]+)/);if(!match)fail('deploy URL missing from EdgeOne CLI output');
  const deployUrl=new URL(match[1]),authParams=new URLSearchParams(deployUrl.search),baseUrl=deployUrl.origin;result.baseUrl=baseUrl;
  const edgeUrl=(path,attempt=0)=>{const u=new URL(path,baseUrl);for(const [k,v] of authParams)u.searchParams.set(k,v);u.searchParams.set('_axis_verify',`${Date.now()}-${attempt}`);return u};
  try{result.runnerUnauthenticatedStatus=(await request(baseUrl)).status}catch{result.runnerUnauthenticatedStatus=0}

  let last='EdgeOne release not visible yet';
  const maxAttempts=30;
  for(let attempt=1;attempt<=maxAttempts;attempt++){
    result.convergenceAttempts=attempt;
    try{
      const [root,remoteManifest]=await Promise.all([request(edgeUrl('/',attempt)),request(edgeUrl('/axis-build.json',attempt),{json:true})]);
      result.authenticatedStatus=root.status;
      const escaped=String(local.version).replaceAll('.','\\.');
      const runtimeMarker=root.status===200&&(new RegExp(`data-axis-runtime=["']canonical-${escaped}["']`).test(root.text)||new RegExp(`data-axis-public-release=["']${escaped}["']`).test(root.text));
      const mismatches=remoteManifest.status===200&&remoteManifest.data?parityFields(remoteManifest.data).filter(([,a,b])=>a!==b):[['axis-build.json',remoteManifest.status,'200']];
      if(root.status===200&&runtimeMarker&&mismatches.length===0){
        result.runtimeMarker=true;
        result.manifestParity=true;
        result.convergedAt=new Date().toISOString();
        break;
      }
      const mismatch=mismatches[0];
      last=root.status!==200?`authenticated root status ${root.status}`:!runtimeMarker?`canonical ${local.version} runtime marker not visible yet`:`manifest parity ${mismatch[0]}: ${mismatch[1]} != ${mismatch[2]}`;
    }catch(err){last=String(err?.message||err||'transient EdgeOne request failure')}
    if(attempt<maxAttempts){console.log(`[AXIS EdgeOne live] convergence ${attempt}/${maxAttempts} · ${last}`);await sleep(4000)}
  }
  if(!result.manifestParity||!result.runtimeMarker)fail(`deployment did not converge to exact ${local.version} / ${local.sourceCommit} after ${result.convergenceAttempts} attempts · ${last}`);

  for(const path of ['/api/ai-status','/api/ai-capabilities','/api/cloud-status','/api/owner-config','/api/analyze','/api/insight','/api/label']){const [edge,golden]=await Promise.all([request(edgeUrl(path,result.convergenceAttempts),{json:true}),request(new URL(path,goldenBase),{json:true})]);result.api[path]={edgeStatus:edge.status,goldenStatus:golden.status,edgeJson:!!edge.data,goldenJson:!!golden.data,statusParity:edge.status===golden.status,jsonParity:(!!edge.data)===(!!golden.data)};if(edge.status!==golden.status)fail(`${path} status parity ${edge.status} != ${golden.status}`);if((!!edge.data)!==(!!golden.data))fail(`${path} JSON contract parity mismatch`)}
}catch(err){fatal=err;result.error=String(err?.message||err||'unknown live verification error').slice(0,1200)}
result.verifiedAt=new Date().toISOString();
fs.writeFileSync('/tmp/edgeone-live-result.json',JSON.stringify(result,null,2)+'\n');if(fatal)throw fatal;
console.log(`[AXIS EdgeOne live] authenticated deployment converged and verified ${result.baseUrl} · attempts=${result.convergenceAttempts} · runner unauthenticated=${result.runnerUnauthenticatedStatus} · exact ${local.version} manifest/source parity · ${Object.keys(result.api).length} API contracts match Vercel`);
