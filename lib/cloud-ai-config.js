const bool=(v,d=false)=>v==null?d:/^(1|true|yes|on)$/i.test(String(v));
const one=(v,allowed,fallback)=>allowed.includes(String(v||'').toLowerCase())?String(v).toLowerCase():fallback;
const num=(v,d,min,max)=>Math.max(min,Math.min(max,Number.isFinite(Number(v))?Number(v):d));

export function getCloudAIConfig(env=process.env){
  const cloudProvider=one(env.AXIS_CLOUD_PROVIDER,['off','cloudbase'],'off');
  const cloudEnabled=cloudProvider!=='off'&&bool(env.AXIS_CLOUD_ENABLED,true);
  const aiEnabled=bool(env.AXIS_AI_ENABLED,false);
  const aiMode=one(env.AXIS_AI_MODE,['off','assist','smart'],aiEnabled?'assist':'off');
  const cloudbase={
    envId:String(env.AXIS_CLOUDBASE_ENV_ID||env.CLOUDBASE_ENV_ID||'').trim(),
    region:String(env.AXIS_CLOUDBASE_REGION||'ap-shanghai').trim(),
    configured:false
  };
  cloudbase.configured=cloudProvider==='cloudbase'&&!!cloudbase.envId;
  return{
    cloud:{
      enabled:cloudEnabled&&cloudbase.configured,
      requested:cloudEnabled,
      provider:cloudProvider,
      account:bool(env.AXIS_CLOUD_ACCOUNT_ENABLED,cloudEnabled),
      dataSync:bool(env.AXIS_CLOUD_DATA_SYNC_ENABLED,cloudEnabled),
      mediaSync:bool(env.AXIS_CLOUD_MEDIA_SYNC_ENABLED,false),
      maxBatchEntities:Math.round(num(env.AXIS_CLOUD_MAX_BATCH_ENTITIES,80,10,250)),
      maxPayloadBytes:Math.round(num(env.AXIS_CLOUD_MAX_PAYLOAD_BYTES,512000,65536,2097152)),
      cloudbase
    },
    ai:{
      enabled:aiEnabled&&aiMode!=='off',
      mode:aiMode,
      capabilities:{
        vision:bool(env.AXIS_AI_VISION_ENABLED,aiEnabled),
        insight:bool(env.AXIS_AI_INSIGHT_ENABLED,aiEnabled),
        voice:bool(env.AXIS_AI_VOICE_ENABLED,false),
        pronunciation:bool(env.AXIS_AI_PRONUNCIATION_ENABLED,false),
        dialogue:bool(env.AXIS_AI_DIALOGUE_ENABLED,false),
        realtime:bool(env.AXIS_AI_REALTIME_ENABLED,false)
      },
      providers:{
        voice:one(env.AXIS_VOICE_PROVIDER,['system','openai'],'system'),
        transcribe:one(env.AXIS_TRANSCRIBE_PROVIDER,['off','openai'],'off'),
        dialogue:one(env.AXIS_DIALOGUE_PROVIDER,['off','openai'],'off'),
        realtime:one(env.AXIS_REALTIME_PROVIDER,['off','openai'],'off')
      },
      privacy:{
        text:bool(env.AXIS_AI_ALLOW_TEXT,true),
        training:bool(env.AXIS_AI_ALLOW_TRAINING,false),
        image:bool(env.AXIS_AI_ALLOW_IMAGE,true),
        audio:bool(env.AXIS_AI_ALLOW_AUDIO,false)
      }
    }
  }
}

export function publicCloudAIConfig(config=getCloudAIConfig()){
  const c=config.cloud,a=config.ai;
  return{
    version:'axis-cloud-ai-v1',
    cloud:{
      enabled:c.enabled,
      requested:c.requested,
      provider:c.provider,
      configured:c.provider==='cloudbase'?c.cloudbase.configured:false,
      account:c.account,
      scopes:{data:c.dataSync,media:c.mediaSync},
      limits:{entities:c.maxBatchEntities,payloadBytes:c.maxPayloadBytes}
    },
    ai:{
      enabled:a.enabled,
      mode:a.mode,
      capabilities:{...a.capabilities},
      providers:{...a.providers},
      privacy:{...a.privacy},
      localFallbacks:{vision:true,voice:true,pronunciation:true,dialogue:true,insight:true}
    }
  }
}

export function assertCloudAISecretsNeverPublic(value){
  const s=JSON.stringify(value||{});
  if(/(?:api[_-]?key|secret|token|private[_-]?key|access[_-]?key)/i.test(s))throw new Error('public cloud/AI config contains a secret-shaped field');
  return value;
}
