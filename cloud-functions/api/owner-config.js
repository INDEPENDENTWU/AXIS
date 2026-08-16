import {getAIConfig} from '../_shared/ai-config.js';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=UTF-8','Cache-Control':'no-store'}});
function safeEqual(a,b){a=String(a||'');b=String(b||'');if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0}
function tokenOf(req){const h=String(req.headers.get('authorization')||'');if(h.startsWith('Bearer '))return h.slice(7);return String(req.headers.get('x-axis-owner-token')||'')}
async function testProvider(p,keyOverride=''){
 const key=keyOverride||p?.key;if(!p||!key)return{ok:false,error:'key_missing'};
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),8000);
 try{const url=p.id==='gemini'?`${p.base}/models?key=${encodeURIComponent(key)}`:`${p.base}/models`,headers=p.id==='gemini'?{}:{Authorization:`Bearer ${key}`};const r=await fetch(url,{headers,signal:ctrl.signal});return{ok:r.ok,status:r.status,provider:p.id}}
 catch(e){return{ok:false,error:e?.name==='AbortError'?'timeout':'network',provider:p.id}}finally{clearTimeout(timer)}
}
export default async function onRequest(context){
 const req=context.request,env=context.env||{},owner=env.AXIS_OWNER_TOKEN||'';
 if(!owner)return json({error:'owner_lock_not_configured',env:'AXIS_OWNER_TOKEN'},503);
 if(!safeEqual(tokenOf(req),owner))return json({error:'unauthorized'},401);
 const c=getAIConfig(env),providers=c.visionProviders||[],primary=providers[0]||null;
 if(req.method==='GET')return json({version:'axis-owner-v2',provider:c.provider,providers:providers.map(x=>({id:x.id,model:x.model})),keyConfigured:providers.length>0,available:c.enabled,visionEnabled:c.visionEnabled,qualityEnabled:c.qualityEnabled,insightEnabled:c.insightEnabled,escalationEnabled:c.escalationEnabled,visionModel:c.visionModel,visionFallbackModel:c.visionFallbackModel,insightModel:c.insightModel,maxFrames:c.maxFrames,minConfidence:c.minConfidence,acceptConfidence:c.acceptConfidence,timeoutMs:c.timeoutMs,visionRPM:c.visionRPM,insightRPM:c.insightRPM,persistence:'deployment-environment',keyEnv:['OPENAI_API_KEY','GEMINI_API_KEY','DASHSCOPE_API_KEY']});
 if(req.method==='POST'){let body={};try{body=await req.json()}catch{return json({error:'json'},400)}if(body.action==='test-current')return json(await testProvider(primary));if(body.action==='test-key'){const id=String(body.provider||primary?.id||'bailian'),p=providers.find(x=>x.id===id)||primary;if(!p)return json({error:'provider'},400);return json(await testProvider(p,String(body.key||'')))}return json({error:'action'},400)}
 return json({error:'method'},405);
}
