import {getAIConfig,publicAIConfig} from '../lib/ai-config.js';
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET') return res.status(405).json({error:'method'});
  return res.status(200).json(publicAIConfig(getAIConfig()));
}
