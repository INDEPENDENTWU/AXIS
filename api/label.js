import {getAIConfig} from '../lib/ai-config.js';
const rate=globalThis.__axisLabelRate||(globalThis.__axisLabelRate=new Map());
function allow(ip,limit){const now=Date.now(),w=60000,x=rate.get(ip)||{t:now,n:0};if(now-x.t>w){x.t=now;x.n=0}x.n++;rate.set(ip,x);return x.n<=Math.max(4,Math.min(30,limit||10))}
function clean(v,n=48){return typeof v==='string'?v.replace(/[\r\n\t]+/g,' ').trim().slice(0,n):''}
function parse(text){if(!text)return'';const s=String(text).replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();try{return clean(JSON.parse(s)?.label,48)}catch{}const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a>=0&&b>a)try{return clean(JSON.parse(s.slice(a,b+1))?.label,48)}catch{}return''}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'method'});
  const c=getAIConfig();if(!c.enabled||!c.insightEnabled)return res.status(503).json({available:false,error:'not_available'});
  const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();if(!allow(ip,c.insightRPM))return res.status(429).json({available:true,error:'rate_limited'});
  let body={};try{body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{})}catch{return res.status(400).json({error:'bad_json'})}
  const text=clean(body.text,40);if(!text)return res.status(400).json({error:'text'});if(/^[\x20-\x7e]+$/.test(text))return res.status(200).json({available:true,label:text});
  const prompt=`把这个健身器械、动作或训练项目名称翻译成健身房里自然、准确、简洁的英文标签。不要解释，不要逐字硬译；优先使用国际通用动作/器械名称。只返回JSON：{"label":"英文标签"}。原文：${JSON.stringify(text)}`;
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),Math.min(8000,c.timeoutMs||8000));
  try{const r=await fetch(`${c.base}/chat/completions`,{method:'POST',signal:controller.signal,headers:{Authorization:`Bearer ${c.key}`,'Content-Type':'application/json'},body:JSON.stringify({model:c.insightModel,messages:[{role:'user',content:prompt}],temperature:0.05,max_tokens:80,enable_thinking:false,response_format:{type:'json_object'}})});const raw=await r.json();if(!r.ok)return res.status(502).json({available:true,error:'upstream'});const label=parse(raw?.choices?.[0]?.message?.content);if(!label)return res.status(502).json({available:true,error:'bad_response'});return res.status(200).json({available:true,label})}catch(e){return res.status(502).json({available:true,error:e?.name==='AbortError'?'timeout':'network'})}finally{clearTimeout(timer)}
}
