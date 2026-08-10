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
export function getAIConfig(env={}){
  const key=env.DASHSCOPE_API_KEY||env.BAILIAN_API_KEY||'';
  const base=(env.BAILIAN_BASE_URL||env.DASHSCOPE_BASE_URL||'https://dashscope.aliyuncs.com/compatible-mode/v1').replace(/\/$/,'');
  return {
    provider:'bailian',
    enabled:bool(env,'AXIS_AI_ENABLED',true)&&!!key,
    key,
    base,
    visionModel:env.AXIS_VISION_MODEL||env.BAILIAN_VISION_MODEL||'qwen3.6-flash',
    visionFallbackModel:env.AXIS_VISION_FALLBACK_MODEL||'qwen3.7-plus',
    insightModel:env.AXIS_INSIGHT_MODEL||env.BAILIAN_INSIGHT_MODEL||'qwen3.6-flash',
    visionEnabled:bool(env,'AXIS_AI_VISION_ENABLED',true),
    insightEnabled:bool(env,'AXIS_AI_INSIGHT_ENABLED',true),
    qualityEnabled:bool(env,'AXIS_AI_QUALITY_ENABLED',true),
    escalationEnabled:bool(env,'AXIS_AI_ESCALATION_ENABLED',false),
    maxFrames:num(env,'AXIS_AI_MAX_FRAMES',2,1,3),
    minConfidence:num(env,'AXIS_AI_MIN_CONFIDENCE',0.58,0.25,0.95),
    escalateBelow:num(env,'AXIS_AI_ESCALATE_BELOW',0.46,0.2,0.85),
    escalateMinQuality:num(env,'AXIS_AI_ESCALATE_MIN_QUALITY',0.62,0.3,0.95),
    maxImageChars:num(env,'AXIS_AI_MAX_IMAGE_CHARS',1800000,400000,3200000),
    visionRPM:num(env,'AXIS_AI_VISION_RPM',12,2,120),
    insightRPM:num(env,'AXIS_AI_INSIGHT_RPM',8,1,60),
    timeoutMs:num(env,'AXIS_AI_TIMEOUT_MS',12000,3000,30000),
    version:'axis-ai-v3'
  };
}
export function publicAIConfig(c){
  return {
    available:c.enabled,
    vision:c.enabled&&c.visionEnabled,
    insight:c.enabled&&c.insightEnabled,
    quality:c.enabled&&c.qualityEnabled,
    strategy:'local-first',
    version:c.version
  };
}
