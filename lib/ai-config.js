function num(name, fallback, min, max){
  const n=Number(process.env[name]);
  if(!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}
function bool(name, fallback=true){
  const v=process.env[name];
  if(v==null||v==='') return fallback;
  return !['0','false','off','no'].includes(String(v).toLowerCase());
}
export function getAIConfig(){
  const key=process.env.DASHSCOPE_API_KEY||process.env.BAILIAN_API_KEY||'';
  const base=(process.env.BAILIAN_BASE_URL||process.env.DASHSCOPE_BASE_URL||'https://dashscope.aliyuncs.com/compatible-mode/v1').replace(/\/$/,'');
  return {
    provider:'bailian',
    enabled:bool('AXIS_AI_ENABLED',true)&&!!key,
    key,
    base,
    visionModel:process.env.AXIS_VISION_MODEL||process.env.BAILIAN_VISION_MODEL||'qwen3.6-flash',
    insightModel:process.env.AXIS_INSIGHT_MODEL||process.env.BAILIAN_INSIGHT_MODEL||'qwen3.6-flash',
    visionEnabled:bool('AXIS_AI_VISION_ENABLED',true),
    insightEnabled:bool('AXIS_AI_INSIGHT_ENABLED',true),
    qualityEnabled:bool('AXIS_AI_QUALITY_ENABLED',true),
    maxFrames:num('AXIS_AI_MAX_FRAMES',2,1,3),
    minConfidence:num('AXIS_AI_MIN_CONFIDENCE',0.58,0.25,0.95),
    maxImageChars:num('AXIS_AI_MAX_IMAGE_CHARS',1800000,400000,3200000),
    visionRPM:num('AXIS_AI_VISION_RPM',12,2,120),
    insightRPM:num('AXIS_AI_INSIGHT_RPM',8,1,60),
    timeoutMs:num('AXIS_AI_TIMEOUT_MS',12000,3000,30000),
    version:'axis-ai-v3'
  };
}
export function publicAIConfig(c=getAIConfig()){
  return {
    available:c.enabled,
    vision:c.enabled&&c.visionEnabled,
    insight:c.enabled&&c.insightEnabled,
    quality:c.enabled&&c.qualityEnabled,
    strategy:'local-first',
    version:c.version
  };
}
