import fs from 'node:fs';

const logPath='/tmp/axis-edgeone-deploy.log';
const goldenBase=process.env.VERCEL_GOLDEN_URL||'https://axis-five-puce.vercel.app';
const local=JSON.parse(fs.readFileSync('axis-build.json','utf8'));
const result={
  baseUrl:'',
  publicStatus:null,
  authenticatedStatus:null,
  manifestParity:false,
  runtimeMarker:false,
  api:{},
  error:'',
  verifiedAt:new Date().toISOString()
};

let fatal=null;
const fail=msg=>{throw new Error(`[AXIS EdgeOne live] ${msg}`)};

async function request(url,{json=false,method='GET'}={}){
  const r=await fetch(url,{method,redirect:'follow',headers:{'Cache-Control':'no-cache'}});
  const text=await r.text();
  let data=null;
  if(json){try{data=JSON.parse(text)}catch{}}
  return{status:r.status,ok:r.ok,text,data,url:r.url};
}

try{
  if(!fs.existsSync(logPath))fail('deployment log missing');
  const log=fs.readFileSync(logPath,'utf8');
  const match=log.match(/Deploy URL:\s*(https:\/\/[^\s\u001b]+)/);
  if(!match)fail('deploy URL missing from EdgeOne CLI output');

  const deployUrl=new URL(match[1]);
  const authSearch=deployUrl.search;
  const baseUrl=deployUrl.origin;
  result.baseUrl=baseUrl;

  const edgeUrl=path=>{
    const u=new URL(path,baseUrl);
    u.search=authSearch;
    return u;
  };

  try{
    const publicRoot=await request(baseUrl);
    result.publicStatus=publicRoot.status;
  }catch{
    result.publicStatus=0;
  }
  if(result.publicStatus!==200)fail(`public root status ${result.publicStatus}`);

  const root=await request(edgeUrl('/'));
  result.authenticatedStatus=root.status;
  if(root.status!==200)fail(`authenticated root status ${root.status}`);
  result.runtimeMarker=/data-axis-runtime=["']canonical-8\.12\.3["']/.test(root.text)||/data-axis-public-release=["']8\.12\.3["']/.test(root.text);
  if(!result.runtimeMarker)fail('canonical 8.12.3 runtime marker missing from EdgeOne root');

  const remoteManifest=await request(edgeUrl('/axis-build.json'),{json:true});
  if(remoteManifest.status!==200||!remoteManifest.data)fail(`axis-build.json status ${remoteManifest.status}`);
  const remote=remoteManifest.data;
  for(const [name,a,b] of [
    ['version',remote.version,local.version],
    ['architecture',remote.architecture,local.architecture],
    ['core',remote.assets?.core,local.assets?.core],
    ['css',remote.assets?.css,local.assets?.css],
    ['runtimeHash',remote.canonical?.runtimeHash,local.canonical?.runtimeHash],
    ['initialJavascript',remote.requests?.initialJavascript,local.requests?.initialJavascript],
    ['dynamicJavascript',remote.requests?.dynamicJavascript,local.requests?.dynamicJavascript]
  ])if(a!==b)fail(`manifest parity ${name}: ${a} != ${b}`);
  result.manifestParity=true;

  const apiPaths=[
    '/api/ai-status',
    '/api/ai-capabilities',
    '/api/cloud-status',
    '/api/owner-config',
    '/api/analyze',
    '/api/insight',
    '/api/label'
  ];
  for(const path of apiPaths){
    const [edge,golden]=await Promise.all([
      request(edgeUrl(path),{json:true}),
      request(new URL(path,goldenBase),{json:true})
    ]);
    result.api[path]={
      edgeStatus:edge.status,
      goldenStatus:golden.status,
      edgeJson:!!edge.data,
      goldenJson:!!golden.data,
      statusParity:edge.status===golden.status,
      jsonParity:(!!edge.data)===(!!golden.data)
    };
    if(edge.status!==golden.status)fail(`${path} status parity ${edge.status} != ${golden.status}`);
    if((!!edge.data)!==(!!golden.data))fail(`${path} JSON contract parity mismatch`);
  }
}catch(err){
  fatal=err;
  result.error=String(err?.message||err||'unknown live verification error').slice(0,1200);
}

fs.writeFileSync('/tmp/edgeone-live-result.json',JSON.stringify(result,null,2)+'\n');
if(fatal)throw fatal;
console.log(`[AXIS EdgeOne live] verified ${result.baseUrl} · public 200 · canonical manifest parity · ${Object.keys(result.api).length} API contracts match Vercel`);
