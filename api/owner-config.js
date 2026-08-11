import {getAIConfig} from '../lib/ai-config.js';

function safeEqual(a,b){a=String(a||'');b=String(b||'');if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0}
function tokenOf(req){const h=String(req.headers.authorization||'');if(h.startsWith('Bearer '))return h.slice(7);return String(req.headers['x-axis-owner-token']||'')}
async function testKey(key,base){
  if(!key)return{ok:false,error:'key_missing'};
  const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),8000);
  try{const r=await fetch(base.replace(/\/$/,'')+'/models',{headers:{Authorization:`Bearer ${key}`},signal:ctrl.signal});return{ok:r.ok,status:r.status}}catch(e){return{ok:false,error:e?.name==='AbortError'?'timeout':'network'}}finally{clearTimeout(timer)}
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const owner=process.env.AXIS_OWNER_TOKEN||'';
  if(!owner)return res.status(503).json({error:'owner_lock_not_configured',env:'AXIS_OWNER_TOKEN'});
  if(!safeEqual(tokenOf(req),owner))return res.status(401).json({error:'unauthorized'});
  const c=getAIConfig();
  if(req.method==='GET')return res.status(200).json({
    version:'axis-owner-v1',provider:c.provider,keyConfigured:!!c.key,available:c.enabled,
    visionEnabled:c.visionEnabled,qualityEnabled:c.qualityEnabled,insightEnabled:c.insightEnabled,escalationEnabled:c.escalationEnabled,
    visionModel:c.visionModel,visionFallbackModel:c.visionFallbackModel,insightModel:c.insightModel,
    maxFrames:c.maxFrames,minConfidence:c.minConfidence,timeoutMs:c.timeoutMs,visionRPM:c.visionRPM,insightRPM:c.insightRPM,
    persistence:'deployment-environment',keyEnv:'DASHSCOPE_API_KEY'
  });
  if(req.method==='POST'){
    let body={};try{body=typeof req.body==='string'?JSON.parse(req.body):req.body||{}}catch{return res.status(400).json({error:'json'})}
    if(body.action==='test-current')return res.status(200).json(await testKey(c.key,c.base));
    if(body.action==='test-key')return res.status(200).json(await testKey(String(body.key||''),c.base));
    return res.status(400).json({error:'action'});
  }
  return res.status(405).json({error:'method'});
}
