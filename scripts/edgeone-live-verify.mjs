import fs from 'node:fs';

const fail=msg=>{throw new Error(`[AXIS EdgeOne live] ${msg}`)};
const logPath='/tmp/axis-edgeone-deploy.log';
if(!fs.existsSync(logPath))fail('deployment log missing');
const log=fs.readFileSync(logPath,'utf8');
const match=log.match(/Deploy URL:\s*(https:\/\/[^\s\u001b]+)/);
if(!match)fail('deploy URL missing from EdgeOne CLI output');

const deployUrl=new URL(match[1]);
const authSearch=deployUrl.search;
const baseUrl=deployUrl.origin;
const goldenBase=process.env.VERCEL_GOLDEN_URL||'https://axis-five-puce.vercel.app';
const local=JSON.parse(fs.readFileSync('axis-build.json','utf8'));

const edgeUrl=path=>{
  const u=new URL(path,baseUrl);
  u.search=authSearch;
  return u;
};

async function request(url,{json=false}={}){
  const r=await fetch(url,{redirect:'follow',headers:{'Cache-Control':'no-cache'}});
  const text=await r.text();
  let data=null;
  if(json){try{data=JSON.parse(text)}catch{}}
  return{status:r.status,ok:r.ok,text,data,url:r.url};
}

const result={
  baseUrl,
  publicStatus:null,
  authenticatedStatus:null,
  manifestParity:false,
  runtimeMarker:false,
  api:{},
  verifiedAt:new Date().toISOString()
};

try{
  const publicRoot=await request(baseUrl);
  result.publicStatus=publicRoot.status;
}catch(err){
  result.publicStatus=0;
}

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

const apiPaths=['/api/ai-status','/api/ai-capabilities','/api/cloud-status','/api/owner-config'];
for(const path of apiPaths){
  const [edge,golden]=await Promise.all([
    request(edgeUrl(path),{json:true}),
    request(new URL(path,goldenBase),{json:true})
  ]);
  result.api[path]={edgeStatus:edge.status,goldenStatus:golden.status,edgeJson:!!edge.data,goldenJson:!!golden.data};
  if(edge.status===404||edge.status>=500)fail(`${path} unavailable on EdgeOne: ${edge.status}`);
  if(!edge.data)fail(`${path} did not return JSON on EdgeOne`);
}

fs.writeFileSync('/tmp/edgeone-live-result.json',JSON.stringify(result,null,2)+'\n');
console.log(`[AXIS EdgeOne live] verified ${baseUrl} · public ${result.publicStatus} · auth 200 · manifest parity · ${apiPaths.length} API routes`);
