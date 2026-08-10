import {getAIConfig,publicAIConfig} from '../_shared/ai-config.js';

const json=(data,status=200)=>new Response(JSON.stringify(data),{
  status,
  headers:{'Content-Type':'application/json; charset=UTF-8','Cache-Control':'no-store'}
});

export function onRequestGet(context){
  const c=getAIConfig(context.env||{});
  return json(publicAIConfig(c));
}

export function onRequest(){
  return json({error:'method'},405);
}
