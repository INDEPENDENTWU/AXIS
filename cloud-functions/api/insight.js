import {getAIConfig,publicAIConfig} from '../_shared/ai-config.js';

const rate=globalThis.__axisEdgeInsightRate||(globalThis.__axisEdgeInsightRate=new Map());
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=UTF-8','Cache-Control':'no-store'}});
function allow(ip,limit){const now=Date.now(),w=60000,x=rate.get(ip)||{t:now,n:0};if(now-x.t>w){x.t=now;x.n=0}x.n++;rate.set(ip,x);return x.n<=limit}
function parseJson(text){if(!text)return null;const s=String(text).replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();try{return JSON.parse(s)}catch{}const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a>=0&&b>a)try{return JSON.parse(s.slice(a,b+1))}catch{}return null}
function safeText(v,n=56){return typeof v==='string'?v.replace(/[\r\n\t]+/g,' ').trim().slice(0,n):''}

export function onRequestGet(context){
  const c=getAIConfig(context.env||{});
  return json(publicAIConfig(c));
}

export async function onRequestPost(context){
  const c=getAIConfig(context.env||{});
  if(!c.enabled||!c.insightEnabled)return json({available:false,error:'not_available'},503);
  const ip=context.clientIp||context.request.headers.get('x-forwarded-for')||'unknown';
  if(!allow(String(ip).split(',')[0].trim(),c.insightRPM))return json({available:true,error:'rate_limited'},429);
  let body={};try{body=await context.request.json()}catch{return json({error:'bad_json'},400)}
  const current=body.current&&typeof body.current==='object'?body.current:{};
  const history=Array.isArray(body.history)?body.history.slice(0,8):[];
  const profile=body.profile&&typeof body.profile==='object'?body.profile:{};
  const compact={
    current:{minutes:Number(current.minutes)||0,items:Number(current.items)||0,sets:Number(current.sets)||0,muscles:Array.isArray(current.muscles)?current.muscles.slice(0,10):[],equipment:Array.isArray(current.equipment)?current.equipment.slice(0,12):[]},
    history:history.map(x=>({daysAgo:Number(x.daysAgo)||0,minutes:Number(x.minutes)||0,muscles:Array.isArray(x.muscles)?x.muscles.slice(0,8):[],equipment:Array.isArray(x.equipment)?x.equipment.slice(0,8):[]})),
    profile:{goal:safeText(profile.goal,16),freq:safeText(profile.freq,8),years:safeText(profile.years,8)}
  };
  const prompt=`你是AXIS的训练记忆分析器。用户不是专业运动员，AXIS不是课程App。请只根据提供的真实记录做简短、具体、通俗的判断。禁止诊断疾病，禁止夸大，数据不足就明确保持保守。重点判断：本次训练结构、最近覆盖缺口、重复器械的变化、下一次最值得补的一件事。\n只返回JSON对象：{"headline":"不超过18字","observation":"不超过34字","next":"不超过24字","signal":"progress|balance|rhythm|neutral","confidence":0到1}。不要输出JSON之外的任何文字。\n数据：${JSON.stringify(compact)}`;
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),c.timeoutMs);
  try{
    const r=await fetch(`${c.base}/chat/completions`,{method:'POST',signal:controller.signal,headers:{Authorization:`Bearer ${c.key}`,'Content-Type':'application/json'},body:JSON.stringify({model:c.insightModel,messages:[{role:'user',content:prompt}],temperature:0.12,max_tokens:220,enable_thinking:false,response_format:{type:'json_object'}})});
    const raw=await r.json();
    if(!r.ok)return json({available:true,error:'upstream'},502);
    const p=parseJson(raw?.choices?.[0]?.message?.content);if(!p)return json({available:true,error:'bad_response'},502);
    const out={headline:safeText(p.headline,24),observation:safeText(p.observation,48),next:safeText(p.next,36),signal:['progress','balance','rhythm','neutral'].includes(p.signal)?p.signal:'neutral',confidence:Math.max(0,Math.min(1,Number(p.confidence)||0)),model:c.insightModel};
    return json({available:true,result:out});
  }catch(e){return json({available:true,error:e?.name==='AbortError'?'timeout':'network'},502)}finally{clearTimeout(timer)}
}

export function onRequest(){return json({error:'method'},405)}
