import {getCloudAIConfig,publicCloudAIConfig,assertCloudAISecretsNeverPublic} from '../_shared/cloud-ai-config.js';

const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=UTF-8','Cache-Control':'no-store'}});

export async function onRequestGet(context){
  const out=publicCloudAIConfig(getCloudAIConfig(context.env||{}));
  return json(assertCloudAISecretsNeverPublic({version:out.version,cloud:out.cloud}));
}

export async function onRequest(context){
  if(context.request.method!=='GET')return json({error:'method'},405);
  return onRequestGet(context);
}
