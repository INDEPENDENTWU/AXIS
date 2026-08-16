import {getAIConfig,publicAIConfig} from '../lib/ai-config.js';

const FALLBACK_CATALOG=[
 ['cable','多功能龙门架','strength',['背部','胸肌','肩部']],['lat','高位下拉','strength',['背部','肱二头肌']],
 ['row','坐姿 / 胸托划船','strength',['背部','肱二头肌']],['pec','飞鸟 / 后三角','strength',['胸肌','肩部']],
 ['chest','胸推','strength',['胸肌','肱三头肌','肩部']],['shoulder','肩推','strength',['肩部','肱三头肌']],
 ['dip','双杠 / 抬腿','strength',['胸肌','肱三头肌','核心']],['arms','手臂','strength',['肱二头肌','肱三头肌']],
 ['legpress','坐姿腿推','strength',['股四头肌','臀部','腘绳肌']],['hack','哈克 / 斜腿推','strength',['股四头肌','臀部']],
 ['legext','腿屈伸','strength',['股四头肌']],['legcurl','腿弯举','strength',['腘绳肌']],['calf','小腿','strength',['小腿']],
 ['dumbbell','哑铃','strength',[]],['barbell','杠铃','strength',[]],['bodyweight','徒手','strength',[]],
 ['elliptical','椭圆机','cardio',['心肺']],['rower','划船机','cardio',['心肺','背部']],['treadmill','跑步机 / 跑步','cardio',['心肺']],['walk','步行','cardio',['心肺']]
].map(([id,name,type,muscles])=>({id,name,type,muscles}));

const rate=globalThis.__axisVisionRate||(globalThis.__axisVisionRate=new Map());
const SCHEMA={
 type:'object',additionalProperties:false,
 properties:{
  equipmentId:{anyOf:[{type:'string'},{type:'null'}]},
  candidates:{type:'array',maxItems:3,items:{type:'object',additionalProperties:false,properties:{id:{type:'string'},confidence:{type:'number',minimum:0,maximum:1}},required:['id','confidence']}},
  weightKg:{anyOf:[{type:'number',minimum:0,maximum:1000},{type:'null'}]},
  cardio:{anyOf:[{type:'object',additionalProperties:false,properties:{
   durationMin:{anyOf:[{type:'number',minimum:0,maximum:600},{type:'null'}]},
   distanceKm:{anyOf:[{type:'number',minimum:0,maximum:1000},{type:'null'}]},
   calories:{anyOf:[{type:'number',minimum:0,maximum:10000},{type:'null'}]},
   resistance:{anyOf:[{type:'number',minimum:0,maximum:100},{type:'null'}]}
  },required:['durationMin','distanceKm','calories','resistance']},{type:'null'}]},
  quality:{type:'object',additionalProperties:false,properties:{score:{type:'number',minimum:0,maximum:1},retake:{type:'boolean'},hint:{type:'string'}},required:['score','retake','hint']},
  confidence:{type:'number',minimum:0,maximum:1}
 },
 required:['equipmentId','candidates','weightKg','cardio','quality','confidence']
};

function allow(ip,limit){const now=Date.now(),w=60000,x=rate.get(ip)||{t:now,n:0};if(now-x.t>w){x.t=now;x.n=0}x.n++;rate.set(ip,x);return x.n<=limit}
function parseJson(v){if(v&&typeof v==='object')return v;if(!v)return null;const s=String(v).replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();try{return JSON.parse(s)}catch{}const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a>=0&&b>a)try{return JSON.parse(s.slice(a,b+1))}catch{}return null}
function text(v,max=48){return typeof v==='string'?v.replace(/[\r\n\t`<>{}]/g,' ').replace(/\s+/g,' ').trim().slice(0,max):''}
function cleanId(v){const s=String(v||'').trim();return /^[A-Za-z0-9][A-Za-z0-9._:-]{0,63}$/.test(s)?s:''}
function catalogFrom(body,max){
 const src=Array.isArray(body.catalog)?body.catalog:[],seen=new Set(),out=[];
 for(const x of src.slice(0,max)){
  const id=cleanId(x?.id),name=text(x?.name,48);if(!id||!name||seen.has(id))continue;
  const type=x?.type==='cardio'?'cardio':'strength';
  const muscles=Array.isArray(x?.muscles)?x.muscles.map(v=>text(v,18)).filter(Boolean).slice(0,5):[];
  out.push({id,name,type,muscles});seen.add(id);
 }
 return out.length>=8?out:FALLBACK_CATALOG;
}
function clamp(v,min=0,max=1){const n=Number(v);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):0}
function numberOrNull(v,min,max){if(v===null||v===''||v===undefined)return null;const n=Number(v);return Number.isFinite(n)&&n>=min&&n<=max?n:null}
function normalize(p,provider,model,valid){
 const validId=id=>valid.has(String(id||''))?String(id):null;
 const equipmentId=validId(p?.equipmentId),confidence=clamp(p?.confidence);
 const candidates=Array.isArray(p?.candidates)?p.candidates.map(x=>({id:validId(x?.id),confidence:clamp(x?.confidence)})).filter(x=>x.id).sort((a,b)=>b.confidence-a.confidence).slice(0,3):[];
 const cardio=p?.cardio&&typeof p.cardio==='object'?{
  durationMin:numberOrNull(p.cardio.durationMin,0,600),distanceKm:numberOrNull(p.cardio.distanceKm,0,1000),
  calories:numberOrNull(p.cardio.calories,0,10000),resistance:numberOrNull(p.cardio.resistance,0,100)
 }:null;
 const q=p?.quality&&typeof p.quality==='object'?{score:clamp(p.quality.score),retake:!!p.quality.retake,hint:text(p.quality.hint,28)}:{score:confidence,retake:false,hint:''};
 return{equipmentId,candidates,weightKg:numberOrNull(p?.weightKg,0,1000),cardio,quality:q,confidence,provider,model};
}
function localCandidates(body,valid){
 return (Array.isArray(body.localCandidates)?body.localCandidates:[])
  .map(x=>({id:valid.has(String(x?.id||''))?String(x.id):null,confidence:clamp(x?.confidence)}))
  .filter(x=>x.id).sort((a,b)=>b.confidence-a.confidence).slice(0,5);
}
function promptFor(catalog,recent,local){
 const lines=catalog.map(x=>`${x.id} | ${x.name} | ${x.type==='cardio'?'有氧':'力量'}${x.muscles.length?' | '+x.muscles.join('/') :''}`).join('\n');
 const localText=local.length?local.map(x=>`${x.id}:${x.confidence.toFixed(2)}`).join(', '):'无';
 return `你是 AXIS 的现场器械/运动视觉分类器。只做分类与可直接记录的数据提取，不做解释。\n`
 +`AXIS 可选目录如下。equipmentId 与 candidates.id 必须严格使用目录中的 id；看不清就返回 null，绝不能创造名称或 ID：\n${lines}\n`
 +`最近使用 ID：${recent.join(', ')||'无'}\n本地视觉候选（仅作先验，画面证据优先）：${localText}\n`
 +`规则：1) 优先判断器械/运动本身，不要被人物、品牌、背景器械误导。2) 相似器械必须看座椅角度、推/拉轨迹、把手、配重/杠片结构；不确定给最多3个候选。`
 +`3) weightKg 仅在数字、杠片组合或配重插销清楚时填写。4) 有氧屏幕清楚时才填时间/距离/卡路里/阻力。5) 不推测次数、组数、RIR。`
 +`6) quality.retake 只在当前画面确实不足以可靠分类时为 true，hint 最多12个中文字。7) confidence 是当前 top-1 分类可信度。只返回符合 schema 的 JSON。`;
}
function extractOpenAIText(raw){
 if(typeof raw?.output_text==='string')return raw.output_text;
 for(const item of raw?.output||[])for(const c of item?.content||[])if(c?.type==='output_text'&&typeof c.text==='string')return c.text;
 return '';
}
function frameInline(url){
 const m=String(url).match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/i);
 return m?{mimeType:m[1].toLowerCase().replace('jpg','jpeg'),data:m[2]}:null;
}
async function withTimeout(ms,fn){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),ms);
 try{return await fn(controller.signal)}finally{clearTimeout(timer)}
}
async function callOpenAI(c,p,frames,prompt,valid){
 return withTimeout(c.timeoutMs,async signal=>{
  const input=[{type:'input_text',text:prompt},...frames.map(image_url=>({type:'input_image',image_url,detail:'high'}))];
  const r=await fetch(`${p.base}/responses`,{method:'POST',signal,headers:{Authorization:`Bearer ${p.key}`,'Content-Type':'application/json'},body:JSON.stringify({
   model:p.model,input:[{role:'user',content:input}],reasoning:{effort:c.openaiReasoning||'low'},
   text:{verbosity:'low',format:{type:'json_schema',name:'axis_vision',strict:true,schema:SCHEMA}},max_output_tokens:700
  })});
  const raw=await r.json();if(!r.ok)throw new Error(`openai_${r.status}`);
  const parsed=parseJson(extractOpenAIText(raw));if(!parsed)throw new Error('openai_bad_response');
  return normalize(parsed,'openai',p.model,valid);
 });
}
async function callGemini(c,p,frames,prompt,valid){
 return withTimeout(c.timeoutMs,async signal=>{
  const parts=[{text:prompt}];
  for(const f of frames){const x=frameInline(f);if(x)parts.push({inlineData:x})}
  const r=await fetch(`${p.base}/models/${encodeURIComponent(p.model)}:generateContent?key=${encodeURIComponent(p.key)}`,{method:'POST',signal,headers:{'Content-Type':'application/json'},body:JSON.stringify({
   contents:[{role:'user',parts}],generationConfig:{temperature:0,maxOutputTokens:700,responseMimeType:'application/json',responseJsonSchema:SCHEMA}
  })});
  const raw=await r.json();if(!r.ok)throw new Error(`gemini_${r.status}`);
  const out=(raw?.candidates?.[0]?.content?.parts||[]).map(x=>x?.text||'').join('');
  const parsed=parseJson(out);if(!parsed)throw new Error('gemini_bad_response');
  return normalize(parsed,'gemini',p.model,valid);
 });
}
async function callBailian(c,p,frames,prompt,valid,modelOverride=''){
 return withTimeout(c.timeoutMs,async signal=>{
  const model=modelOverride||p.model,content=[...frames.map(url=>({type:'image_url',image_url:{url}})),{type:'text',text:prompt}];
  const r=await fetch(`${p.base}/chat/completions`,{method:'POST',signal,headers:{Authorization:`Bearer ${p.key}`,'Content-Type':'application/json'},body:JSON.stringify({
   model,messages:[{role:'user',content}],temperature:0.01,max_tokens:700,enable_thinking:false,response_format:{type:'json_object'}
  })});
  const raw=await r.json();if(!r.ok)throw new Error(`bailian_${r.status}`);
  const parsed=parseJson(raw?.choices?.[0]?.message?.content);if(!parsed)throw new Error('bailian_bad_response');
  return normalize(parsed,'bailian',model,valid);
 });
}
async function callProvider(c,p,frames,prompt,valid,modelOverride=''){
 if(p.id==='openai')return callOpenAI(c,p,frames,prompt,valid);
 if(p.id==='gemini')return callGemini(c,p,frames,prompt,valid);
 return callBailian(c,p,frames,prompt,valid,modelOverride);
}
function mergeCandidates(a,b){
 const m=new Map();for(const x of [...(a?.candidates||[]),...(b?.candidates||[])])m.set(x.id,Math.max(m.get(x.id)||0,x.confidence));
 for(const x of [a,b])if(x?.equipmentId)m.set(x.equipmentId,Math.max(m.get(x.equipmentId)||0,x.confidence));
 return [...m].map(([id,confidence])=>({id,confidence})).sort((x,y)=>y.confidence-x.confidence).slice(0,3);
}
function arbitrate(a,b,c){
 if(!b)return{...a,verified:false,needsConfirmation:!a.equipmentId||a.confidence<c.minConfidence};
 if(a.equipmentId&&a.equipmentId===b.equipmentId){
  const best=a.confidence>=b.confidence?a:b;
  return{...best,confidence:Math.min(.99,Math.max(a.confidence,b.confidence)+.04),candidates:mergeCandidates(a,b),verified:true,needsConfirmation:false};
 }
 const diff=Math.abs(a.confidence-b.confidence),winner=a.confidence>=b.confidence?a:b;
 if(winner.equipmentId&&diff>=c.arbitrationMargin&&winner.confidence>=c.acceptConfidence){
  return{...winner,candidates:mergeCandidates(a,b),verified:false,needsConfirmation:false};
 }
 return{...winner,equipmentId:null,candidates:mergeCandidates(a,b),confidence:Math.max(a.confidence,b.confidence),verified:false,needsConfirmation:true};
}
function shouldEscalate(r,local,c){
 if(!c.escalationEnabled||r.quality?.retake||r.quality?.score<c.escalateMinQuality)return false;
 if(!r.equipmentId||r.confidence<c.escalateBelow)return true;
 const l=local[0];return !!(l&&l.confidence>=.72&&l.id!==r.equipmentId&&r.confidence<.90);
}

export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 const c=getAIConfig();
 if(req.method==='GET')return res.status(200).json({...publicAIConfig(c),model:c.visionModel});
 if(req.method!=='POST')return res.status(405).json({error:'method'});
 if(!c.enabled||!c.visionEnabled||!c.visionProviders.length)return res.status(503).json({available:false,error:'not_available'});
 const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
 if(!allow(ip,c.visionRPM))return res.status(429).json({available:true,error:'rate_limited'});
 let body={};try{body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{})}catch{return res.status(400).json({error:'bad_json'})}
 const frames=Array.isArray(body.frames)?body.frames.slice(0,c.maxFrames):[];
 if(!frames.length)return res.status(400).json({available:true,error:'no_frames'});
 if(frames.reduce((sum,x)=>sum+String(x||'').length,0)>c.maxImageChars)return res.status(413).json({available:true,error:'too_large'});
 if(frames.some(x=>!/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(String(x))))return res.status(400).json({available:true,error:'bad_frame'});
 const catalog=catalogFrom(body,c.maxCatalog),valid=new Set(catalog.map(x=>x.id));
 const recent=Array.isArray(body.recentEquipment)?body.recentEquipment.map(String).filter(x=>valid.has(x)).slice(0,10):[];
 const local=localCandidates(body,valid),prompt=promptFor(catalog,recent,local),providers=c.visionProviders;
 try{
  const first=await callProvider(c,providers[0],frames,prompt,valid);let second=null,escalated=false;
  if(shouldEscalate(first,local,c)){
   const p2=providers[1];
   if(p2){try{second=await callProvider(c,p2,frames,prompt,valid);escalated=true}catch(e){console.warn('[AXIS vision] secondary',e?.message||e)}}
   else if(providers[0]?.id==='bailian'&&c.bailianVisionFallbackModel&&c.bailianVisionFallbackModel!==providers[0].model){
    try{second=await callProvider(c,providers[0],frames,prompt,valid,c.bailianVisionFallbackModel);escalated=true}catch(e){console.warn('[AXIS vision] bailian fallback',e?.message||e)}
   }
  }
  const result=arbitrate(first,second,c);
  return res.status(200).json({available:true,result:{...result,escalated}});
 }catch(e){
  console.error('[AXIS analyze]',e);
  return res.status(502).json({available:true,error:e?.name==='AbortError'?'timeout':e?.message||'network'});
 }
}
