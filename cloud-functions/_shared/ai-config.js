function num(env,name,fallback,min,max){
  const n=Number(env?.[name]);
  if(!Number.isFinite(n)) return fallback;
  return Math.max(min,Math.min(max,n));
}
function bool(env,name,fallback=true){
  const v=env?.[name];
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
export function getAIConfig(env={}){
  const bailianKey=env.DASHSCOPE_API_KEY||env.BAILIAN_API_KEY||'';
  const bailianBase=cleanBase(env.BAILIAN_BASE_URL||env.DASHSCOPE_BASE_URL,'https://dashscope.aliyuncs.com/compatible-mode/v1');
  const openaiKey=env.OPENAI_API_KEY||'';
  const geminiKey=env.GEMINI_API_KEY||env.GOOGLE_API_KEY||'';
  const globallyEnabled=bool(env,'AXIS_AI_ENABLED',true);
  const visionSwitch=bool(env,'AXIS_AI_VISION_ENABLED',true);
  const available={openai:!!openaiKey,gemini:!!geminiKey,bailian:!!bailianKey};
  const order=providerOrder(env.AXIS_VISION_PROVIDER||'auto',available);
  const models={
    openai:env.AXIS_OPENAI_VISION_MODEL||'gpt-5.6-sol',
    gemini:env.AXIS_GEMINI_VISION_MODEL||'gemini-3.1-pro-preview',
    bailian:env.AXIS_VISION_MODEL||env.BAILIAN_VISION_MODEL||'qwen3.6-flash'
  };
  const providers=order.map(id=>({
    id,
    model:models[id],
    key:id==='openai'?openaiKey:id==='gemini'?geminiKey:bailianKey,
    base:id==='openai'?cleanBase(env.OPENAI_BASE_URL,'https://api.openai.com/v1'):id==='gemini'?cleanBase(env.GEMINI_BASE_URL,'https://generativelanguage.googleapis.com/v1beta'):bailianBase
  }));
  const primary=providers[0]||null;
  return {
    provider:primary?.id||'none',
    enabled:globallyEnabled&&(providers.length>0||!!bailianKey),
    key:bailianKey,
    base:bailianBase,
    visionProviders:globallyEnabled&&visionSwitch?providers:[],
    visionModel:primary?.model||models.bailian,
    visionFallbackModel:providers[1]?.model||env.AXIS_VISION_FALLBACK_MODEL||'qwen3.7-plus',
    bailianVisionFallbackModel:env.AXIS_VISION_FALLBACK_MODEL||'qwen3.7-plus',
    insightModel:env.AXIS_INSIGHT_MODEL||env.BAILIAN_INSIGHT_MODEL||'qwen3.6-flash',
    visionEnabled:globallyEnabled&&visionSwitch&&providers.length>0,
    insightEnabled:globallyEnabled&&bool(env,'AXIS_AI_INSIGHT_ENABLED',true)&&!!bailianKey,
    qualityEnabled:globallyEnabled&&bool(env,'AXIS_AI_QUALITY_ENABLED',true)&&providers.length>0,
    escalationEnabled:bool(env,'AXIS_AI_ESCALATION_ENABLED',true),
    maxFrames:num(env,'AXIS_AI_MAX_FRAMES',3,1,3),
    minConfidence:num(env,'AXIS_AI_MIN_CONFIDENCE',0.60,0.25,0.95),
    acceptConfidence:num(env,'AXIS_AI_ACCEPT_CONFIDENCE',0.82,0.45,0.99),
    escalateBelow:num(env,'AXIS_AI_ESCALATE_BELOW',0.78,0.35,0.95),
    escalateMinQuality:num(env,'AXIS_AI_ESCALATE_MIN_QUALITY',0.48,0.2,0.95),
    arbitrationMargin:num(env,'AXIS_AI_ARBITRATION_MARGIN',0.12,0.03,0.35),
    maxCatalog:num(env,'AXIS_AI_MAX_CATALOG',220,40,320),
    maxImageChars:num(env,'AXIS_AI_MAX_IMAGE_CHARS',2600000,400000,4800000),
    visionRPM:num(env,'AXIS_AI_VISION_RPM',12,2,120),
    insightRPM:num(env,'AXIS_AI_INSIGHT_RPM',8,1,60),
    timeoutMs:num(env,'AXIS_AI_TIMEOUT_MS',12000,3000,24000),
    openaiReasoning:env.AXIS_OPENAI_REASONING||'low',
    version:'axis-ai-v4'
  };
}
export function publicAIConfig(c){
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
