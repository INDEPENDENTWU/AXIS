import {getAIConfig} from '../lib/ai-config.js';

function safeEqual(a,b){a=String(a||'');b=String(b||'');if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0}
function tokenOf(req){const h=String(req.headers.authorization||'');if(h.startsWith('Bearer '))return h.slice(7);return String(req.headers['x-axis-owner-token']||'')}
async function testProvider(p,keyOverride=''){
 const key=keyOverride||p?.key;if(!p||!key)return{ok:false,error:'key_missing'};
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),8000);
 try{
  const url=p.id==='gemini'?`${p.base}/models?key=${encodeURIComponent(key)}`:`${p.base}/models`;
  const headers=p.id==='gemini'?{}:{Authorization:`Bearer ${key}`};
  const r=await fetch(url,{headers,signal:ctrl.signal});return{ok:r.ok,status:r.status,provider:p.id};
 }catch(e){return{ok:false,error:e?.name==='AbortError'?'timeout':'network',provider:p.id}}finally{clearTimeout(timer)}
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 const owner=process.env.AXIS_OWNER_TOKEN||'';
 if(!owner)return res.status(503).json({error:'owner_lock_not_configured',env:'AXIS_OWNER_TOKEN'});
 if(!safeEqual(tokenOf(req),owner))return res.status(401).json({error:'unauthorized'});
 const c=getAIConfig(),providers=c.visionProviders||[],primary=providers[0]||null;
 if(req.method==='GET')return res.status(200).json({
  version:'axis-owner-v2',provider:c.provider,providers:providers.map(x=>({id:x.id,model:x.model})),keyConfigured:providers.length>0,available:c.enabled,
  visionEnabled:c.visionEnabled,qualityEnabled:c.qualityEnabled,insightEnabled:c.insightEnabled,escalationEnabled:c.escalationEnabled,
  visionModel:c.visionModel,visionFallbackModel:c.visionFallbackModel,insightModel:c.insightModel,maxFrames:c.maxFrames,minConfidence:c.minConfidence,
  acceptConfidence:c.acceptConfidence,timeoutMs:c.timeoutMs,visionRPM:c.visionRPM,insightRPM:c.insightRPM,persistence:'deployment-environment',
  keyEnv:['OPENAI_API_KEY','GEMINI_API_KEY','DASHSCOPE_API_KEY']
 });
 if(req.method==='POST'){
  let body={};try{body=typeof req.body==='string'?JSON.parse(req.body):req.body||{}}catch{return res.status(400).json({error:'json'})}
  if(body.action==='test-current')return res.status(200).json(await testProvider(primary));
  if(body.action==='test-key'){const id=String(body.provider||primary?.id||'bailian'),p=providers.find(x=>x.id===id)||primary;if(!p)return res.status(400).json({error:'provider'});return res.status(200).json(await testProvider(p,String(body.key||'')))}
  return res.status(400).json({error:'action'});
 }
 return res.status(405).json({error:'method'});
}
