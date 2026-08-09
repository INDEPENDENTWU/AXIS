const EQUIPMENT=[['cable','多功能龙门架'],['lat','高位下拉'],['row','坐姿 / 胸托划船'],['pec','飞鸟 / 后三角'],['chest','胸推'],['shoulder','肩推'],['dip','双杠 / 抬腿'],['arms','手臂'],['legpress','坐姿腿推'],['hack','哈克 / 斜腿推'],['legext','腿屈伸'],['legcurl','腿弯举'],['calf','小腿'],['dumbbell','哑铃'],['barbell','杠铃'],['bodyweight','徒手'],['elliptical','椭圆机'],['rower','划船机'],['treadmill','跑步机 / 跑步'],['walk','步行']];
const CATALOG=EQUIPMENT.map(([id,name])=>`${id}=${name}`).join(', ');
const rate=globalThis.__axisVisionRate||(globalThis.__axisVisionRate=new Map());
function allow(ip){const now=Date.now(),windowMs=60000,limit=10,item=rate.get(ip)||{t:now,n:0};if(now-item.t>windowMs){item.t=now;item.n=0}item.n++;rate.set(ip,item);return item.n<=limit}
function parseJson(text){if(!text)return null;const s=String(text).replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();try{return JSON.parse(s)}catch{}const a=s.indexOf('{'),b=s.lastIndexOf('}');if(a>=0&&b>a)try{return JSON.parse(s.slice(a,b+1))}catch{}return null}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const key=process.env.DASHSCOPE_API_KEY||process.env.BAILIAN_API_KEY;
  const model=process.env.BAILIAN_VISION_MODEL||process.env.BAILIAN_MODEL||'qwen-vl-plus';
  if(req.method==='GET')return res.status(200).json({available:!!key,model});
  if(req.method!=='POST')return res.status(405).json({available:!!key,error:'method'});
  if(!key)return res.status(503).json({available:false,error:'not_configured'});
  const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
  if(!allow(ip))return res.status(429).json({available:true,error:'rate_limited'});
  let body={};try{body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{})}catch{return res.status(400).json({available:true,error:'bad_json'})}
  const frames=Array.isArray(body.frames)?body.frames.slice(0,3):[];
  if(!frames.length)return res.status(400).json({available:true,error:'no_frames'});
  if(frames.reduce((n,x)=>n+String(x||'').length,0)>3200000)return res.status(413).json({available:true,error:'too_large'});
  if(frames.some(x=>!/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(String(x))))return res.status(400).json({available:true,error:'bad_frame'});
  const recent=Array.isArray(body.recentEquipment)?body.recentEquipment.filter(x=>EQUIPMENT.some(([id])=>id===x)).slice(0,10):[];
  const prompt=`你是 AXIS 的健身现场视觉解析器。用户用约3秒从不同角度扫过一台器械，画面可能包含器械全貌、配重插销、杠片或有氧机屏幕。\n器械ID只能从以下清单选择：${CATALOG}\n最近使用：${recent.join(', ')||'无'}\n规则：\n1. 看不清就返回 null，禁止猜。\n2. weightKg 仅在数字或配重位置足够清楚时填写。\n3. 有氧屏幕可读时填写 durationMin、distanceKm、calories、resistance。\n4. 不推测次数、组数、RIR。\n5. confidence 0~1。\n只返回 JSON：{"equipmentId":string|null,"weightKg":number|null,"cardio":{"durationMin":number|null,"distanceKm":number|null,"calories":number|null,"resistance":number|null}|null,"confidence":number}`;
  const content=[...frames.map(url=>({type:'image_url',image_url:{url}})),{type:'text',text:prompt}];
  const base=(process.env.BAILIAN_BASE_URL||'https://dashscope.aliyuncs.com/compatible-mode/v1').replace(/\/$/,'');
  try{
    const upstream=await fetch(`${base}/chat/completions`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages:[{role:'user',content}],temperature:0.02,max_tokens:320,response_format:{type:'json_object'}})});
    const raw=await upstream.json();
    if(!upstream.ok)return res.status(502).json({available:true,error:'upstream'});
    const p=parseJson(raw?.choices?.[0]?.message?.content);if(!p)return res.status(502).json({available:true,error:'bad_response'});
    const equipmentId=EQUIPMENT.some(([id])=>id===p.equipmentId)?p.equipmentId:null,weight=Number(p.weightKg),confidence=Math.max(0,Math.min(1,Number(p.confidence)||0));
    const cardio=p.cardio&&typeof p.cardio==='object'?Object.fromEntries(['durationMin','distanceKm','calories','resistance'].map(k=>[k,Number.isFinite(Number(p.cardio[k]))?Number(p.cardio[k]):null])):null;
    return res.status(200).json({available:true,result:{equipmentId,weightKg:Number.isFinite(weight)&&weight>=0&&weight<=1000?weight:null,cardio,confidence,model}})
  }catch(e){console.error('axis analyze',e);return res.status(502).json({available:true,error:'network'})}
}
