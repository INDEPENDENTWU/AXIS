import {getAIConfig} from '../_shared/ai-config.js';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=UTF-8','Cache-Control':'no-store'}});
function safeEqual(a,b){a=String(a||'');b=String(b||'');if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0}
function tokenOf(req){const h=String(req.headers.get('authorization')||'');if(h.startsWith('Bearer '))return h.slice(7);return String(req.headers.get('x-axis-owner-token')||'')}
async function testKey(key,base){if(!key)return{ok:false,error:'key_missing'};const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),8000);try{const r=await fetch(base.replace(/\/$/,'')+'/models',{headers:{Authorization:`Bearer ${key}`},signal:ctrl.signal});return{ok:r.ok,status:r.status}}catch(e){return{ok:false,error:e?.name==='AbortError'?'timeout':'network'}}finally{clearTimeout(timer)}}
export default async function onRequest(context){
  const req=context.request,env=context.env||{},owner=env.AXIS_OWNER_TOKEN||'';
  if(!owner)return json({error:'owner_lock_not_configured',env:'AXIS_OWNER_TOKEN'},503);
  if(!safeEqual(tokenOf(req),owner))return json({error:'unauthorized'},401);
  const c=getAIConfig(env);
  if(req.method==='GET')return json({version:'axis-owner-v1',provider:c.provider,keyConfigured:!!c.key,available:c.enabled,visionEnabled:c.visionEnabled,qualityEnabled:c.qualityEnabled,insightEnabled:c.insightEnabled,escalationEnabled:c.escalationEnabled,visionModel:c.visionModel,visionFallbackModel:c.visionFallbackModel,insightModel:c.insightModel,maxFrames:c.maxFrames,minConfidence:c.minConfidence,timeoutMs:c.timeoutMs,visionRPM:c.visionRPM,insightRPM:c.insightRPM,persistence:'deployment-environment',keyEnv:'DASHSCOPE_API_KEY'});
  if(req.method==='POST'){let body={};try{body=await req.json()}catch{return json({error:'json'},400)}if(body.action==='test-current')return json(await testKey(c.key,c.base));if(body.action==='test-key')return json(await testKey(String(body.key||''),c.base));return json({error:'action'},400)}
  return json({error:'method'},405);
}
