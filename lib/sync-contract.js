import crypto from 'node:crypto';

const TYPES=new Set(['profile','session','event','preferences','learning','media']);
const id=s=>String(s||'').trim();
const finite=n=>Number.isFinite(Number(n))?Number(n):0;
const cleanPayload=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};

export function normalizeSyncEntity(raw={}){
  const entityType=id(raw.entityType).toLowerCase();
  const entityId=id(raw.entityId);
  const deviceId=id(raw.deviceId);
  if(!TYPES.has(entityType))throw new Error('sync entityType');
  if(!entityId||entityId.length>160)throw new Error('sync entityId');
  if(!deviceId||deviceId.length>160)throw new Error('sync deviceId');
  const revision=Math.max(0,Math.floor(finite(raw.revision)));
  const updatedAt=Math.max(0,Math.floor(finite(raw.updatedAt)));
  if(!updatedAt)throw new Error('sync updatedAt');
  const payload=cleanPayload(raw.payload);
  return{entityType,entityId,deviceId,revision,updatedAt,deleted:raw.deleted===true,payload};
}

export function entityKey(x){const e=normalizeSyncEntity(x);return `${e.entityType}:${e.entityId}`}

export function compareSyncEntities(a,b){
  const x=normalizeSyncEntity(a),y=normalizeSyncEntity(b);
  if(x.entityType!==y.entityType||x.entityId!==y.entityId)throw new Error('sync compare key mismatch');
  if(x.revision!==y.revision)return x.revision-y.revision;
  if(x.updatedAt!==y.updatedAt)return x.updatedAt-y.updatedAt;
  return x.deviceId.localeCompare(y.deviceId);
}

export function convergeSyncEntity(local,remote){
  if(!local)return normalizeSyncEntity(remote);
  if(!remote)return normalizeSyncEntity(local);
  const x=normalizeSyncEntity(local),y=normalizeSyncEntity(remote);
  return compareSyncEntities(x,y)>=0?x:y;
}

export function syncRequestId(deviceId,entities,nonce=''){
  const d=id(deviceId);if(!d)throw new Error('sync request device');
  const normalized=(entities||[]).map(normalizeSyncEntity).sort((a,b)=>entityKey(a).localeCompare(entityKey(b))||a.revision-b.revision||a.updatedAt-b.updatedAt);
  return crypto.createHash('sha256').update(JSON.stringify({deviceId:d,nonce:id(nonce),entities:normalized})).digest('hex').slice(0,32);
}

export function validateSyncBatch(raw,{maxEntities=80,maxPayloadBytes=512000}={}){
  const deviceId=id(raw?.deviceId),requestId=id(raw?.requestId),cursor=raw?.cursor==null?null:id(raw.cursor);
  if(!deviceId)throw new Error('sync deviceId');
  if(!requestId||requestId.length>128)throw new Error('sync requestId');
  if(!Array.isArray(raw?.entities))throw new Error('sync entities');
  if(raw.entities.length>maxEntities)throw new Error('sync batch too large');
  const entities=raw.entities.map(normalizeSyncEntity);
  if(Buffer.byteLength(JSON.stringify(entities))>maxPayloadBytes)throw new Error('sync payload too large');
  const seen=new Set();for(const e of entities){const k=entityKey(e);if(seen.has(k))throw new Error(`sync duplicate ${k}`);seen.add(k)}
  return{deviceId,requestId,cursor,entities};
}

export const SYNC_CONTRACT={version:'axis-sync-v1',entityTypes:[...TYPES],strategy:'revision-updatedAt-deviceId',tombstones:true,idempotent:true};
