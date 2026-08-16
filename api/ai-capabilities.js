import {getCloudAIConfig,publicCloudAIConfig,assertCloudAISecretsNeverPublic} from '../lib/cloud-ai-config.js';

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET')return res.status(405).json({error:'method'});
  const out=publicCloudAIConfig(getCloudAIConfig());
  return res.status(200).json(assertCloudAISecretsNeverPublic({version:out.version,ai:out.ai}));
}
