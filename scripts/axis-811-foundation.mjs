import assert from 'node:assert/strict';
import fs from 'node:fs';

const loadSourceModule=async relative=>{
  const file=new URL(relative,import.meta.url),source=fs.readFileSync(file,'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
};
const cloud=await loadSourceModule('../lib/cloud-ai-config.js');
const sync=await loadSourceModule('../lib/sync-contract.js');
const {getCloudAIConfig,publicCloudAIConfig,assertCloudAISecretsNeverPublic}=cloud;
const {normalizeSyncEntity,compareSyncEntities,convergeSyncEntity,syncRequestId,validateSyncBatch,SYNC_CONTRACT}=sync;

console.log('[AXIS 8.11 foundation] safe public cloud/AI capability config');
const off=publicCloudAIConfig(getCloudAIConfig({}));
assert.equal(off.cloud.enabled,false);assert.equal(off.cloud.provider,'off');assert.equal(off.ai.enabled,false);assert.equal(off.ai.providers.voice,'system');assert.equal(off.ai.localFallbacks.voice,true);
const configured=publicCloudAIConfig(getCloudAIConfig({AXIS_CLOUD_PROVIDER:'cloudbase',AXIS_CLOUDBASE_ENV_ID:'env-test',AXIS_AI_ENABLED:'true',AXIS_AI_MODE:'assist',AXIS_AI_VOICE_ENABLED:'true',AXIS_AI_PRONUNCIATION_ENABLED:'true',AXIS_VOICE_PROVIDER:'openai',AXIS_TRANSCRIBE_PROVIDER:'openai',OPENAI_API_KEY:'must-never-leak'}));
assert.equal(configured.cloud.enabled,true);assert.equal(configured.cloud.configured,true);assert.equal(configured.ai.enabled,true);assert.equal(configured.ai.capabilities.voice,true);assert.equal(configured.ai.providers.voice,'openai');assert.doesNotMatch(JSON.stringify(configured),/must-never-leak/);
assert.doesNotThrow(()=>assertCloudAISecretsNeverPublic(configured));assert.throws(()=>assertCloudAISecretsNeverPublic({apiKey:'x'}));

console.log('[AXIS 8.11 foundation] deterministic sync revision and tombstone convergence');
const a=normalizeSyncEntity({entityType:'session',entityId:'S1',deviceId:'D1',revision:2,updatedAt:100,deleted:false,payload:{start:1}}),b=normalizeSyncEntity({entityType:'session',entityId:'S1',deviceId:'D2',revision:3,updatedAt:90,deleted:true,payload:{}});
assert.ok(compareSyncEntities(a,b)<0);assert.deepEqual(convergeSyncEntity(a,b),b);assert.equal(convergeSyncEntity(null,a).entityId,'S1');assert.equal(SYNC_CONTRACT.tombstones,true);
const tieA={...a,revision:5,updatedAt:200,deviceId:'D1'},tieB={...a,revision:5,updatedAt:200,deviceId:'D2'};assert.deepEqual(convergeSyncEntity(tieA,tieB),normalizeSyncEntity(tieB));

console.log('[AXIS 8.11 foundation] idempotent bounded sync batches');
const entities=[a,{...a,entityType:'learning',entityId:'L1',revision:1,updatedAt:120,payload:{seen:3}}];const requestId=syncRequestId('D1',entities,'n1');assert.equal(requestId.length,32);assert.equal(requestId,syncRequestId('D1',[entities[1],entities[0]],'n1'));
const batch=validateSyncBatch({deviceId:'D1',requestId,entities});assert.equal(batch.entities.length,2);assert.throws(()=>validateSyncBatch({deviceId:'D1',requestId,entities:[a,a]}),/duplicate/);assert.throws(()=>validateSyncBatch({deviceId:'D1',requestId,entities:Array.from({length:81},(_,i)=>({...a,entityId:'S'+i}))}),/too large/);

console.log('[AXIS 8.11 foundation] PASS · local-first provider-neutral cloud/AI + deterministic sync contract');
