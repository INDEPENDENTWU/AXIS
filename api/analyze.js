import {getAIConfig,publicAIConfig} from '../lib/ai-config.js';
const EQUIPMENT=[['cable','多功能龙门架'],['lat','高位下拉'],['row','坐姿 / 胸托划船'],['pec','飞鸟 / 后三角'],['chest','胸推'],['shoulder','肩推'],['dip','双杠 / 抬腿'],['arms','手臂'],['legpress','坐姿腿推'],['hack','哈克 / 斜腿推'],['legext','腿屈伸'],['legcurl','腿弯举'],['calf','小腿'],['dumbbell','哑铃'],['barbell','杠铃'],['bodyweight','徒手'],['elliptical','椭圆机'],['rower','划船机'],['treadmill','跑步机 / 跑步'],['walk','步行']];
const CATALOG=EQUIPMENT.map(([id,name])=>`${id}=${name}`).join(', ');
const rate=globalThis.__axisVisionRate||(globalThis.__axisVisionRate=new Map());
function allow(ip,limit){const now=Date.now(),w=60000,x=rate.get(ip)||{t:now,n:0};if(now-x.t>w){x.t=now;x.n=0}x.n++;rate.set(ip,x);return x.n<=limit}
function parseJson(text){if(!text)return null;const s=String(text).replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();try{return JSON.parse(s)}catch{}const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a>=0&&b>a)try{return JSON.parse(s.slice(a,b+1))}catch{}return null}
function validId(id){return EQUIPMENT.some(([x])=>x===id)?id:null}
function n(v,min,max){const x=Number(v);return Number.isFinite(x)&&x>=min&&x<=max?x:null}
function text(v,max=32){return typeof v==='string'?v.replace(/[\r\n\t]+/g,' ').trim().slice(0,max):''}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const c=getAIConfig();
  if(req.method==='GET')return res.status(200).json({...publicAIConfig(c),model:c.visionModel});
  if(req.method!=='POST')return res.status(405).json({error:'method'});
  if(!c.enabled||!c.visionEnabled)return res.status(503).json({available:false,error:'not_available'});
  const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
  if(!allow(ip,c.visionRPM))return res.status(429).json({available:true,error:'rate_limited'});
  let body={};try{body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{})}catch{return res.status(400).json({error:'bad_json'})}
  const frames=Array.isArray(body.frames)?body.frames.slice(0,c.maxFrames):[];
  if(!frames.length)return res.status(400).json({available:true,error:'no_frames'});
  if(frames.reduce((sum,x)=>sum+String(x||'').length,0)>c.maxImageChars)return res.status(413).json({available:true,error:'too_large'});
  if(frames.some(x=>!/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(String(x))))return res.status(400).json({available:true,error:'bad_frame'});
  const recent=Array.isArray(body.recentEquipment)?body.recentEquipment.filter(validId).slice(0,8):[];
  const prompt=`你是AXIS的健身现场视觉解析器。用户会用手机从不同角度扫一台器械，画面可能含器械全貌、配重插销、杠片、屏幕，也可能拍得不完整。\n器械ID只能从：${CATALOG}\n用户最近使用：${recent.join(',')||'无'}\n规则：\n1. 宁可为空，不要猜。器械不确定时给最多3个候选。\n2. weightKg只有在数字、杠片组合或插销位置足够清楚时填写。\n3. 有氧屏幕可读时提取时间、距离、卡路里、阻力。\n4. 不推测次数、组数、RIR。\n5. 同时判断画面是否足够用于记录：若器械主体、配重区或屏幕缺失，给一句极短补拍建议。\n6. confidence为0到1。\n只返回JSON：{"equipmentId":string|null,"candidates":[{"id":string,"confidence":number}],"weightKg":number|null,"cardio":{"durationMin":number|null,"distanceKm":number|null,"calories":number|null,"resistance":number|null}|null,"quality":{"score":number,"retake":boolean,"hint":string},"confidence":number}`;
  const content=[...frames.map(url=>({type:'image_url',image_url:{url}})),{type:'text',text:prompt}];
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),c.timeoutMs);
  try{
    const upstream=await fetch(`${c.base}/chat/completions`,{method:'POST',signal:controller.signal,headers:{Authorization:`Bearer ${c.key}`,'Content-Type':'application/json'},body:JSON.stringify({model:c.visionModel,messages:[{role:'user',content}],temperature:0.02,max_tokens:360,enable_thinking:false,response_format:{type:'json_object'}})});
    const raw=await upstream.json();
    if(!upstream.ok)return res.status(502).json({available:true,error:'upstream'});
    const p=parseJson(raw?.choices?.[0]?.message?.content);if(!p)return res.status(502).json({available:true,error:'bad_response'});
    const equipmentId=validId(p.equipmentId),confidence=Math.max(0,Math.min(1,Number(p.confidence)||0));
    const candidates=Array.isArray(p.candidates)?p.candidates.map(x=>({id:validId(x?.id),confidence:Math.max(0,Math.min(1,Number(x?.confidence)||0))})).filter(x=>x.id).sort((a,b)=>b.confidence-a.confidence).slice(0,3):[];
    const cardio=p.cardio&&typeof p.cardio==='object'?{durationMin:n(p.cardio.durationMin,0,600),distanceKm:n(p.cardio.distanceKm,0,1000),calories:n(p.cardio.calories,0,10000),resistance:n(p.cardio.resistance,0,100)}:null;
    const q=p.quality&&typeof p.quality==='object'?{score:Math.max(0,Math.min(1,Number(p.quality.score)||0)),retake:!!p.quality.retake,hint:text(p.quality.hint,28)}:{score:confidence,retake:false,hint:''};
    return res.status(200).json({available:true,result:{equipmentId,candidates,weightKg:n(p.weightKg,0,1000),cardio,quality:q,confidence,model:c.visionModel}});
  }catch(e){console.error('axis analyze',e);return res.status(502).json({available:true,error:e?.name==='AbortError'?'timeout':'network'})}finally{clearTimeout(timer)}
}
