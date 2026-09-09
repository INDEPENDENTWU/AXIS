import fs from 'node:fs';

const customBaseRaw=process.env.EDGEONE_CUSTOM_DOMAIN_URL||'';
const goldenBase=process.env.VERCEL_GOLDEN_URL||'https://axis-five-puce.vercel.app';
const local=JSON.parse(fs.readFileSync('axis-build.json','utf8'));
const output='/tmp/edgeone-custom-domain-result.json';
const result={baseUrl:'',status:null,manifestParity:false,runtimeMarker:false,hostnameStable:false,convergenceAttempts:0,convergedAt:null,api:{},error:'',verifiedAt:new Date().toISOString()};
let fatal=null;
const fail=msg=>{throw new Error(`[AXIS custom domain] ${msg}`)};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function request(url,{json=false}={}){const r=await fetch(url,{redirect:'follow',headers:{'Cache-Control':'no-cache','Pragma':'no-cache'},signal:AbortSignal.timeout(15000)});const text=await r.text();let data=null;if(json){try{data=JSON.parse(text)}catch{}}return{status:r.status,ok:r.ok,text,data,url:r.url}}
const parityFields=remote=>[['version',remote?.version,local.version],['baseVersion',remote?.baseVersion,local.baseVersion],['sourceCommit',remote?.sourceCommit,local.sourceCommit],['architecture',remote?.architecture,local.architecture],['core',remote?.assets?.core,local.assets?.core],['css',remote?.assets?.css,local.assets?.css],['runtimeHash',remote?.canonical?.runtimeHash,local.canonical?.runtimeHash],['initialJavascript',remote?.requests?.initialJavascript,local.requests?.initialJavascript],['dynamicJavascript',remote?.requests?.dynamicJavascript,local.requests?.dynamicJavascript]];
try{
  if(!customBaseRaw)fail('EDGEONE_CUSTOM_DOMAIN_URL is required');
  const customBase=new URL(customBaseRaw);
  if(customBase.protocol!=='https:')fail(`custom Production domain must use HTTPS, got ${customBase.protocol}`);
  customBase.pathname='/';customBase.search='';customBase.hash='';
  result.baseUrl=customBase.origin;
  let last='custom domain release not visible yet';
  // The custom-domain gate runs in parallel with the canonical EdgeOne mirror on main.
  // Give the provider up to five minutes to publish the exact already-certified artifact;
  // product/browser assertions remain unchanged and run only after exact parity exists.
  const maxAttempts=75;
  for(let attempt=1;attempt<=maxAttempts;attempt++){
    result.convergenceAttempts=attempt;
    try{
      const bust=`_axis_verify=${Date.now()}-${attempt}`;
      const [root,manifest]=await Promise.all([
        request(new URL(`/?${bust}`,customBase)),
        request(new URL(`/axis-build.json?${bust}`,customBase),{json:true})
      ]);
      result.status=root.status;
      const finalOrigin=new URL(root.url).origin;
      result.hostnameStable=finalOrigin===customBase.origin;
      const escaped=String(local.version).replaceAll('.','\\.');
      const runtimeMarker=root.status===200&&(new RegExp(`data-axis-runtime=["']canonical-${escaped}["']`).test(root.text)||new RegExp(`data-axis-public-release=["']${escaped}["']`).test(root.text));
      const mismatches=manifest.status===200&&manifest.data?parityFields(manifest.data).filter(([,a,b])=>a!==b):[['axis-build.json',manifest.status,'200']];
      if(root.status===200&&result.hostnameStable&&runtimeMarker&&mismatches.length===0){result.runtimeMarker=true;result.manifestParity=true;result.convergedAt=new Date().toISOString();break}
      const mismatch=mismatches[0];
      last=root.status!==200?`root status ${root.status}`:!result.hostnameStable?`custom hostname redirected to ${finalOrigin}`:!runtimeMarker?`canonical ${local.version} runtime marker not visible yet`:`manifest parity ${mismatch[0]}: ${mismatch[1]} != ${mismatch[2]}`;
    }catch(err){last=String(err?.message||err||'transient custom-domain request failure')}
    if(attempt<maxAttempts){console.log(`[AXIS custom domain] convergence ${attempt}/${maxAttempts} · ${last}`);await sleep(4000)}
  }
  if(!result.manifestParity||!result.runtimeMarker||!result.hostnameStable)fail(`axis.juele.fun did not converge to exact ${local.version} / ${local.sourceCommit} after ${result.convergenceAttempts} attempts · ${last}`);
  for(const path of ['/api/ai-status','/api/ai-capabilities','/api/cloud-status','/api/owner-config','/api/analyze','/api/insight','/api/label']){
    const [custom,golden]=await Promise.all([request(new URL(path,customBase),{json:true}),request(new URL(path,goldenBase),{json:true})]);
    result.api[path]={customStatus:custom.status,goldenStatus:golden.status,customJson:!!custom.data,goldenJson:!!golden.data,statusParity:custom.status===golden.status,jsonParity:(!!custom.data)===(!!golden.data)};
    if(custom.status!==golden.status)fail(`${path} status parity ${custom.status} != ${golden.status}`);
    if((!!custom.data)!==(!!golden.data))fail(`${path} JSON contract parity mismatch`);
  }
}catch(err){fatal=err;result.error=String(err?.message||err||'unknown custom-domain verification error').slice(0,1200)}
result.verifiedAt=new Date().toISOString();
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');
if(fatal)throw fatal;
console.log(`[AXIS custom domain] verified ${result.baseUrl} · exact ${local.version} / ${local.sourceCommit} · HTTPS hostname stable · manifest/runtime parity · ${Object.keys(result.api).length} API contracts match Vercel`);
