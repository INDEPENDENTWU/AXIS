import {getAIConfig,publicAIConfig} from '../_shared/ai-config.js';

const json=(data,status=200)=>new Response(JSON.stringify(data),{
  status,
  headers:{'Content-Type':'application/json; charset=UTF-8','Cache-Control':'no-store'}
});

export default function onRequest(context){
  if(context.request.method!=='GET') return json({error:'method'},405);
  const c=getAIConfig(context.env||{});
  return json(publicAIConfig(c));
}
