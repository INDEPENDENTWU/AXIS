function num(name,fallback,min,max){
  const n=Number(process.env[name]);
  if(!Number.isFinite(n)) return fallback;
  return Math.max(min,Math.min(max,n));
}
function bool(name,fallback=true){
  const v=process.env[name];
  if(v==null||v==='') return fallback;
  return !['0','false','off','no'].includes(String(v).toLowerCase());
}
function cleanBase(v,fallback){return String(v||fallback).replace(/\/$/,'')}
function providerOrder(pref,available){
  const wanted=String(pref||'auto').toLowerCase();
  const defaultOrder=['openai','gemini','bailian'];
  const order=wanted==='auto'?defaultOrder:[wanted,...defaultOrder.filter(x=>x!==wanted)];
  return order.filter((x,i)=>available[x]&&order.indexOf(x)===i);
}
export function getAIConfig(){
  const bailianKey=process.env.DASHSCOPE_API_KEY||process.env.BAILIAN_API_KEY||'';
  const bailianBase=cleanBase(process.env.BAILIAN_BASE_URL||process.env.DASHSCOPE_BASE_URL,'https://dashscope.aliyuncs.com/compatible-mode/v1');
  const openaiKey=process.env.OPENAI_API_KEY||'';
  const geminiKey=process.env.GEMINI_API_KEY||process.env.GOOGLE_API_KEY||'';
  const globallyEnabled=bool('AXIS_AI_ENABLED',true);
  const visionSwitch=bool('AXIS_AI_VISION_ENABLED',true);
  const available={openai:!!openaiKey,gemini:!!geminiKey,bailian:!!bailianKey};
  const order=providerOrder(process.env.AXIS_VISION_PROVIDER||'auto',available);
  const models={
    openai:process.env.AXIS_OPENAI_VISION_MODEL||'gpt-5.6-sol',
    gemini:process.env.AXIS_GEMINI_VISION_MODEL||'gemini-3.1-pro-preview',
    bailian:process.env.AXIS_VISION_MODEL||process.env.BAILIAN_VISION_MODEL||'qwen3.6-flash'
  };
  const providers=order.map(id=>({
    id,
    model:models[id],
    key:id==='openai'?openaiKey:id==='gemini'?geminiKey:bailianKey,
    base:id==='openai'?cleanBase(process.env.OPENAI_BASE_URL,'https://api.openai.com/v1'):id==='gemini'?cleanBase(process.env.GEMINI_BASE_URL,'https://generativelanguage.googleapis.com/v1beta'):bailianBase
  }));
  const primary=providers[0]||null;
  return {
    provider:primary?.id||'none',
    enabled:globallyEnabled&&(providers.length>0||!!bailianKey),
    key:bailianKey,
    base:bailianBase,
    visionProviders:globallyEnabled&&visionSwitch?providers:[],
    visionModel:primary?.model||models.bailian,
    visionFallbackModel:providers[1]?.model||process.env.AXIS_VISION_FALLBACK_MODEL||'qwen3.7-plus',
    bailianVisionFallbackModel:process.env.AXIS_VISION_FALLBACK_MODEL||'qwen3.7-plus',
    insightModel:process.env.AXIS_INSIGHT_MODEL||process.env.BAILIAN_INSIGHT_MODEL||'qwen3.6-flash',
    visionEnabled:globallyEnabled&&visionSwitch&&providers.length>0,
    insightEnabled:globallyEnabled&&bool('AXIS_AI_INSIGHT_ENABLED',true)&&!!bailianKey,
    qualityEnabled:globallyEnabled&&bool('AXIS_AI_QUALITY_ENABLED',true)&&providers.length>0,
    escalationEnabled:bool('AXIS_AI_ESCALATION_ENABLED',true),
    maxFrames:num('AXIS_AI_MAX_FRAMES',3,1,3),
    minConfidence:num('AXIS_AI_MIN_CONFIDENCE',0.60,0.25,0.95),
    acceptConfidence:num('AXIS_AI_ACCEPT_CONFIDENCE',0.82,0.45,0.99),
    escalateBelow:num('AXIS_AI_ESCALATE_BELOW',0.78,0.35,0.95),
    escalateMinQuality:num('AXIS_AI_ESCALATE_MIN_QUALITY',0.48,0.2,0.95),
    arbitrationMargin:num('AXIS_AI_ARBITRATION_MARGIN',0.12,0.03,0.35),
    maxCatalog:num('AXIS_AI_MAX_CATALOG',220,40,320),
    maxImageChars:num('AXIS_AI_MAX_IMAGE_CHARS',2600000,400000,4800000),
    visionRPM:num('AXIS_AI_VISION_RPM',12,2,120),
    insightRPM:num('AXIS_AI_INSIGHT_RPM',8,1,60),
    timeoutMs:num('AXIS_AI_TIMEOUT_MS',12000,3000,24000),
    openaiReasoning:process.env.AXIS_OPENAI_REASONING||'low',
    version:'axis-ai-v4'
  };
}
export function publicAIConfig(c=getAIConfig()){
  return {
    available:c.enabled,
    vision:c.enabled&&c.visionEnabled,
    insight:c.enabled&&c.insightEnabled,
    quality:c.enabled&&c.qualityEnabled,
    strategy:'local-first-frontier-verify',
    provider:c.provider,
    providers:(c.visionProviders||[]).map(x=>x.id),
    version:c.version
  };
}
