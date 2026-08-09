const EQUIPMENT = [
  ['cable','多功能龍門架'],['lat','高位下拉'],['row','坐姿 / 胸托划船'],['pec','飛鳥 / 後三角'],
  ['chest','胸推'],['shoulder','肩推'],['dip','雙槓 / 抬腿'],['arms','手臂'],['legpress','坐姿腿推'],
  ['hack','哈克 / 斜腿推'],['legext','腿屈伸'],['legcurl','腿彎舉'],['calf','小腿'],['dumbbell','啞鈴'],
  ['barbell','槓鈴'],['bodyweight','徒手'],['elliptical','橢圓機'],['rower','划船機'],['treadmill','跑步機 / 跑步'],['walk','步行']
];
const CATALOG = EQUIPMENT.map(([id,name]) => `${id}=${name}`).join(', ');
const rate = globalThis.__axisRate || (globalThis.__axisRate = new Map());
function allow(ip){const now=Date.now(),windowMs=60000,limit=12;const item=rate.get(ip)||{t:now,n:0};if(now-item.t>windowMs){item.t=now;item.n=0;}item.n++;rate.set(ip,item);return item.n<=limit;}
function jsonFromText(text){if(!text)return null;const clean=String(text).replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();try{return JSON.parse(clean);}catch{}const a=clean.indexOf('{'),b=clean.lastIndexOf('}');if(a>=0&&b>a){try{return JSON.parse(clean.slice(a,b+1));}catch{}}return null;}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const key=process.env.DASHSCOPE_API_KEY||process.env.BAILIAN_API_KEY;
  const model=process.env.BAILIAN_MODEL||'qwen-vl-max';
  if(req.method==='GET')return res.status(200).json({available:!!key,model});
  if(req.method!=='POST')return res.status(405).json({available:!!key,error:'method'});
  if(!key)return res.status(503).json({available:false,error:'not_configured'});
  const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
  if(!allow(ip))return res.status(429).json({available:true,error:'rate_limited'});
  let body={};try{body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});}catch{return res.status(400).json({available:true,error:'bad_json'});}
  const frames=Array.isArray(body.frames)?body.frames.slice(0,5):[];
  if(!frames.length)return res.status(400).json({available:true,error:'no_frames'});
  const total=frames.reduce((n,x)=>n+String(x||'').length,0);
  if(total>4500000)return res.status(413).json({available:true,error:'too_large'});
  if(frames.some(x=>!/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(String(x))))return res.status(400).json({available:true,error:'bad_frame'});
  const recent=Array.isArray(body.recentEquipment)?body.recentEquipment.filter(x=>EQUIPMENT.some(([id])=>id===x)).slice(0,12):[];
  const prompt=`你是 AXIS 的健身現場視覺解析器。這是一段約 3 秒的多幀掃描，使用者可能移動手機來拍完整器械、配重插銷、槓片或有氧機螢幕。\n\n器械 ID 只能從以下清單選擇，無法確定就回 null：${CATALOG}\n最近使用過的器械 ID：${recent.join(', ')||'無'}\n\n只根據畫面真正可見的信息判斷：\n1. equipmentId 必須是清單 ID 或 null。\n2. weightKg 只有在配重數字、插銷位置或槓片標示足夠清楚時才填，否則 null；不要憑器械型號猜重量。\n3. 有氧機若螢幕可讀，可填 durationMin、distanceKm、calories、resistance；看不清就 null。\n4. 不推測次數、組數或 RIR。\n5. confidence 為 0~1。\n6. 只回 JSON。\n格式：{"equipmentId":string|null,"equipmentName":string|null,"weightKg":number|null,"cardio":{"durationMin":number|null,"distanceKm":number|null,"calories":number|null,"resistance":number|null}|null,"confidence":number,"evidence":string}`;
  const content=frames.length===1?[{type:'image_url',image_url:{url:frames[0]}},{type:'text',text:prompt}]:[{type:'video',video:frames},{type:'text',text:prompt}];
  const base=(process.env.BAILIAN_BASE_URL||'https://dashscope.aliyuncs.com/compatible-mode/v1').replace(/\/$/,'');
  try{
    const upstream=await fetch(`${base}/chat/completions`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages:[{role:'user',content}],temperature:0.05,max_tokens:500,response_format:{type:'json_object'}})});
    const raw=await upstream.json();
    if(!upstream.ok)return res.status(502).json({available:true,error:'upstream',detail:raw?.error?.message||raw?.message||'Bailian error'});
    const parsed=jsonFromText(raw?.choices?.[0]?.message?.content);
    if(!parsed)return res.status(502).json({available:true,error:'bad_response'});
    const validId=EQUIPMENT.some(([id])=>id===parsed.equipmentId)?parsed.equipmentId:null;
    const name=EQUIPMENT.find(([id])=>id===validId)?.[1]||null;
    const weight=Number(parsed.weightKg),conf=Math.max(0,Math.min(1,Number(parsed.confidence)||0));
    const cardio=parsed.cardio&&typeof parsed.cardio==='object'?{durationMin:Number.isFinite(Number(parsed.cardio.durationMin))?Number(parsed.cardio.durationMin):null,distanceKm:Number.isFinite(Number(parsed.cardio.distanceKm))?Number(parsed.cardio.distanceKm):null,calories:Number.isFinite(Number(parsed.cardio.calories))?Number(parsed.cardio.calories):null,resistance:Number.isFinite(Number(parsed.cardio.resistance))?Number(parsed.cardio.resistance):null}:null;
    return res.status(200).json({available:true,result:{equipmentId:validId,equipmentName:name,weightKg:Number.isFinite(weight)&&weight>=0&&weight<=1000?weight:null,cardio,confidence:conf,evidence:String(parsed.evidence||'').slice(0,180),model}});
  }catch(err){console.error('axis analyze',err);return res.status(502).json({available:true,error:'network'});}
}
