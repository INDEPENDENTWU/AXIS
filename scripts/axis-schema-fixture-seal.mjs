import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const ROOT=process.cwd();
const eventSchema=read(path.join(ROOT,'shared/contracts/axis-event-v1.schema.json'));
const exchangeSchema=read(path.join(ROOT,'shared/contracts/axis-exchange-v1.schema.json'));

const typeOk=(value,type)=>{
  if(type==='object')return value!==null&&typeof value==='object'&&!Array.isArray(value);
  if(type==='array')return Array.isArray(value);
  if(type==='string')return typeof value==='string';
  if(type==='integer')return Number.isInteger(value);
  if(type==='number')return typeof value==='number'&&Number.isFinite(value);
  if(type==='boolean')return typeof value==='boolean';
  return true;
};

const resolveRef=(ref,root)=>{
  if(ref==='./axis-event-v1.schema.json')return {schema:eventSchema,root:eventSchema};
  if(ref.startsWith('#/$defs/')){
    const key=ref.slice('#/$defs/'.length),target=root?.$defs?.[key];
    assert.ok(target,`unresolved local schema ref ${ref}`);
    return {schema:target,root};
  }
  throw new Error(`unsupported schema ref ${ref}`);
};

function validate(value,schema,label,root=schema){
  if(schema.$ref){const target=resolveRef(schema.$ref,root);return validate(value,target.schema,label,target.root)}
  if(schema.const!==undefined)assert.deepEqual(value,schema.const,`${label}: const`);
  if(schema.enum)assert.equal(schema.enum.includes(value),true,`${label}: enum`);
  if(schema.type)assert.equal(typeOk(value,schema.type),true,`${label}: type ${schema.type}`);
  if(typeof value==='string'&&schema.minLength!=null)assert.ok(value.length>=schema.minLength,`${label}: minLength`);
  if(typeof value==='number'&&schema.minimum!=null)assert.ok(value>=schema.minimum,`${label}: minimum`);
  if(schema.format==='date-time')assert.equal(typeof value==='string'&&!Number.isNaN(Date.parse(value)),true,`${label}: date-time`);

  const isObject=value!==null&&typeof value==='object'&&!Array.isArray(value);
  if(isObject){
    for(const key of schema.required||[])assert.equal(Object.hasOwn(value,key),true,`${label}: missing ${key}`);
    for(const [key,child] of Object.entries(schema.properties||{}))if(Object.hasOwn(value,key))validate(value[key],child,`${label}.${key}`,root);
  }
  if(schema.type==='array'&&Array.isArray(value)&&schema.items){
    value.forEach((item,index)=>validate(item,schema.items,`${label}[${index}]`,root));
  }
  for(const rule of schema.allOf||[]){
    const condition=rule.if;
    let match=true;
    if(condition?.required)match=condition.required.every(key=>isObject&&Object.hasOwn(value,key));
    if(match&&condition?.properties){
      for(const [key,cond] of Object.entries(condition.properties)){
        if(!isObject||!Object.hasOwn(value,key)){match=false;break}
        if(cond.enum&&!cond.enum.includes(value[key])){match=false;break}
        if(cond.const!==undefined&&value[key]!==cond.const){match=false;break}
      }
    }
    if(match&&rule.then)validate(value,rule.then,`${label}.then`,root);
  }
}

assert.equal(eventSchema.$id,'axis.event.v1');
assert.equal(exchangeSchema.$id,'axis.exchange.v1');
assert.equal(exchangeSchema.properties?.events?.items?.$ref,'./axis-event-v1.schema.json','exchange events must reference published event schema');
for(const key of ['equipment','sessions','media'])assert.equal(exchangeSchema.properties?.[key]?.items?.$ref,'#/$defs/durableRecord',`${key} must require durable identity`);

const activityScoped=new Set(['activityStarted','activityPaused','activityResumed','activityFinished','setCompleted']);
const fixtureDir=path.join(ROOT,'shared/fixtures');
let eventCount=0;
for(const file of fs.readdirSync(fixtureDir).filter(f=>f.endsWith('.json')).sort()){
  const fixture=read(path.join(fixtureDir,file));
  if(!Array.isArray(fixture.events))continue;
  const ids=new Set();
  for(const event of fixture.events){
    validate(event,eventSchema,`${file}/${event.id||'event'}`,eventSchema);
    assert.equal(ids.has(event.id),false,`${file}: duplicate event id ${event.id}`);
    ids.add(event.id);
    if(activityScoped.has(event.type))assert.equal(typeof event.activityId==='string'&&event.activityId.length>0,true,`${file}/${event.id}: activityId required`);
    eventCount++;
  }
}
assert.ok(eventCount>0,'no fixture events validated');

// Negative event probes: reducer-consumed values must have one portable type/meaning.
for(const [label,bad] of [
  ['string timestamp',{schema:'axis.event.v1',id:'bad-1',type:'workoutStarted',sessionId:'s',occurredAt:'1000'}],
  ['missing activity identity',{schema:'axis.event.v1',id:'bad-2',type:'setCompleted',sessionId:'s',occurredAt:1000}],
  ['string planned sets',{schema:'axis.event.v1',id:'bad-3',type:'activityStarted',sessionId:'s',activityId:'a',occurredAt:1000,payload:{kind:'strength',plannedSets:'3'}}],
  ['invalid activity kind',{schema:'axis.event.v1',id:'bad-4',type:'activityStarted',sessionId:'s',activityId:'a',occurredAt:1000,payload:{kind:'weights',plannedSets:3}}]
]){
  let rejected=false;
  try{validate(bad,eventSchema,label,eventSchema)}catch{rejected=true}
  assert.equal(rejected,true,`${label} unexpectedly passed event schema`);
}

const validExchange={
  schema:'axis.exchange.v1',
  exportedAt:'2026-08-19T10:00:00Z',
  source:{platform:'web',appVersion:'8.12.4',domain:'axis.domain.v1',data:'axis.data.v1'},
  profile:{},
  equipment:[{id:'eq-1'}],
  sessions:[{id:'session-1'}],
  events:[{schema:'axis.event.v1',id:'event-1',type:'workoutStarted',sessionId:'session-1',occurredAt:0}],
  settings:{},
  media:[{id:'media-1'}]
};
validate(validExchange,exchangeSchema,'valid exchange',exchangeSchema);
for(const key of ['equipment','sessions','media']){
  const bad=structuredClone(validExchange);bad[key]=[{}];
  let rejected=false;try{validate(bad,exchangeSchema,`missing ${key} identity`,exchangeSchema)}catch{rejected=true}
  assert.equal(rejected,true,`${key} without stable id unexpectedly passed exchange schema`);
}

console.log(`[AXIS schema fixture seal] PASS · ${eventCount} fixture events · reducer payload types sealed · durable exchange identities required · published schemas cross-bound`);
