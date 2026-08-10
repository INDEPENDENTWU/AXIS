const rate=globalThis.__axisAsrRate||(globalThis.__axisAsrRate=new Map());
function allow(ip){const now=Date.now(),it=rate.get(ip)||{t:now,n:0};if(now-it.t>60000){it.t=now;it.n=0}it.n++;rate.set(ip,it);return it.n<=20}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const key=process.env.DASHSCOPE_API_KEY||process.env.BAILIAN_API_KEY;
  const model=process.env.BAILIAN_ASR_MODEL||'qwen3-asr-flash';
  if(req.method==='GET')return res.status(200).json({available:!!key,model});
  if(req.method!=='POST')return res.status(405).json({error:'method'});
  if(!key)return res.status(503).json({error:'not_configured'});
  const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();
  if(!allow(ip))return res.status(429).json({error:'rate_limited'});
  let body={};try{body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{})}catch{return res.status(400).json({error:'bad_json'})}
  const audio=String(body.audio||'');
  if(!/^data:audio\/[a-z0-9.+-]+;base64,/i.test(audio))return res.status(400).json({error:'bad_audio'});
  if(audio.length>4500000)return res.status(413).json({error:'too_large'});
  const base=(process.env.BAILIAN_BASE_URL||'https://dashscope.aliyuncs.com/compatible-mode/v1').replace(/\/$/,'');
  try{
    const upstream=await fetch(`${base}/chat/completions`,{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages:[{role:'user',content:[{type:'input_audio',input_audio:{data:audio}}]}],stream:false,asr_options:{language:'zh',enable_itn:true}})});
    const raw=await upstream.json();
    if(!upstream.ok)return res.status(502).json({error:'upstream',detail:raw?.error?.message||raw?.message||'ASR error'});
    const text=String(raw?.choices?.[0]?.message?.content||'').trim();
    if(!text)return res.status(502).json({error:'empty'});
    return res.status(200).json({text:text.slice(0,240),model});
  }catch(e){console.error('axis asr',e);return res.status(502).json({error:'network'})}
}
