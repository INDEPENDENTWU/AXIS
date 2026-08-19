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

function validate(value,schema,label){
  if(schema.const!==undefined)assert.deepEqual(value,schema.const,`${label}: const`);
  if(schema.enum)assert.equal(schema.enum.includes(value),true,`${label}: enum`);
  if(schema.type)assert.equal(typeOk(value,schema.type),true,`${label}: type ${schema.type}`);
  if(typeof value==='string'&&schema.minLength!=null)assert.ok(value.length>=schema.minLength,`${label}: minLength`);
  if(typeof value==='number'&&schema.minimum!=null)assert.ok(value>=schema.minimum,`${label}: minimum`);
  if(schema.type==='object'&&value!==null&&typeof value==='object'&&!Array.isArray(value)){
    for(const key of schema.required||[])assert.equal(Object.hasOwn(value,key),true,`${label}: missing ${key}`);
    for(const [key,child] of Object.entries(schema.properties||{}))if(Object.hasOwn(value,key))validate(value[key],child,`${label}.${key}`);
  }
  if(schema.type==='array'&&Array.isArray(value)&&schema.items&&!schema.items.$ref){
    value.forEach((item,index)=>validate(item,schema.items,`${label}[${index}]`));
  }
  for(const rule of schema.allOf||[]){
    const condition=rule.if;
    let match=true;
    if(condition?.required)match=condition.required.every(key=>Object.hasOwn(value,key));
    if(match&&condition?.properties){
      for(const [key,cond] of Object.entries(condition.properties)){
        if(!Object.hasOwn(value,key)){match=false;break}
        if(cond.enum&&!cond.enum.includes(value[key])){match=false;break}
        if(cond.const!==undefined&&value[key]!==cond.const){match=false;break}
      }
    }
    if(match&&rule.then)validate(value,rule.then,`${label}.then`);
  }
}

assert.equal(eventSchema.$id,'axis.event.v1');
assert.equal(exchangeSchema.$id,'axis.exchange.v1');
assert.equal(exchangeSchema.properties?.events?.items?.$ref,'./axis-event-v1.schema.json','exchange events must reference published event schema');

const activityScoped=new Set(['activityStarted','activityPaused','activityResumed','activityFinished','setCompleted']);
const fixtureDir=path.join(ROOT,'shared/fixtures');
let eventCount=0;
for(const file of fs.readdirSync(fixtureDir).filter(f=>f.endsWith('.json')).sort()){
  const fixture=read(path.join(fixtureDir,file));
  if(!Array.isArray(fixture.events))continue;
  const ids=new Set();
  for(const event of fixture.events){
    validate(event,eventSchema,`${file}/${event.id||'event'}`);
    assert.equal(ids.has(event.id),false,`${file}: duplicate event id ${event.id}`);
    ids.add(event.id);
    if(activityScoped.has(event.type))assert.equal(typeof event.activityId==='string'&&event.activityId.length>0,true,`${file}/${event.id}: activityId required`);
    eventCount++;
  }
}
assert.ok(eventCount>0,'no fixture events validated');

// Negative contract probes: these must be rejected by the published schema-driven validator.
for(const [label,bad] of [
  ['string timestamp',{schema:'axis.event.v1',id:'bad-1',type:'workoutStarted',sessionId:'s',occurredAt:'1000'}],
  ['missing activity identity',{schema:'axis.event.v1',id:'bad-2',type:'setCompleted',sessionId:'s',occurredAt:1000}]
]){
  let rejected=false;
  try{validate(bad,eventSchema,label)}catch{rejected=true}
  assert.equal(rejected,true,`${label} unexpectedly passed event schema`);
}

console.log(`[AXIS schema fixture seal] PASS · ${eventCount} fixture events validate against ${eventSchema.$id} · exchange events bind to published schema`);
