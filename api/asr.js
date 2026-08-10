const rate=globalThis.__axisAsrRate||(globalThis.__axisAsrRate=new Map());
const CONTEXT='健身记录常用词：高位下拉、坐姿划船、胸托划船、飞鸟、后三角、胸推、肩推、双杠、抬腿、腿推、哈克深蹲、腿屈伸、腿弯举、提踵、哑铃、杠铃、椭圆机、划船机、跑步机、公斤、千克、次数、组数、分钟、强度、阻力。';
function allow(ip){const now=Date.now(),it=rate.get(ip)||{t:now,n:0};if(now-it.t>60000){it.t=now;it.n=0}it.n++;rate.set(ip,it);return it.n<=20}
function formatOf(data){const m=String(data).match(/^data:audio\/([^;,]+)/i),x=(m?.[1]||'').toLowerCase();if(x.includes('mpeg')||x==='mp3')return'mp3';if(x.includes('mp4'))return'mp4';if(x.includes('m4a'))return'm4a';if(x.includes('webm'))return'webm';if(x.includes('ogg'))return'ogg';if(x.includes('opus'))return'opus';if(x.includes('aac'))return'aac';if(x.includes('wav'))return'wav';return x||'mp4'}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const key=process.env.DASHSCOPE_API_KEY||process.env.BAILIAN_API_KEY;
  const model=process.env.BAILIAN_ASR_MODEL||'fun-asr-flash-2026-06-15';
  if(req.method==='GET')return res.status(200).json({available:!!key,model});
  if(req.method!=='POST')return res.status(405).json({error:'method'});
  if(!key)return res.status(503).json({error:'not_configured'});
  const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
  if(!allow(ip))return res.status(429).json({error:'rate_limited'});
  let body={};try{body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{})}catch{return res.status(400).json({error:'bad_json'})}
  const audio=String(body.audio||'');
  if(!/^data:audio\/[a-z0-9.+-]+;base64,/i.test(audio))return res.status(400).json({error:'bad_audio'});
  if(audio.length>4500000)return res.status(413).json({error:'too_large'});
  const endpoint=process.env.BAILIAN_ASR_URL||'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation';
  try{
    const upstream=await fetch(endpoint,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','X-DashScope-SSE':'disable'},body:JSON.stringify({model,input:{messages:[{role:'user',content:[{type:'input_text',text:CONTEXT}]},{role:'user',content:[{type:'input_audio',input_audio:{data:audio}}]}]},parameters:{format:formatOf(audio),language_hints:['zh']}})});
    const raw=await upstream.json();
    if(!upstream.ok)return res.status(502).json({error:'upstream',detail:raw?.message||raw?.code||'ASR error'});
    const text=String(raw?.output?.text||raw?.output?.sentence?.text||'').trim();
    if(!text)return res.status(502).json({error:'empty'});
    return res.status(200).json({text:text.slice(0,240),model,duration:raw?.usage?.duration||null});
  }catch(e){console.error('axis asr',e);return res.status(502).json({error:'network'})}
}
