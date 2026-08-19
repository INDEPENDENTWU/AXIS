import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const ROOT=process.cwd();
const eventSchema=read(path.join(ROOT,'shared/contracts/axis-event-v1.schema.json'));
const exchangeSchema=read(path.join(ROOT,'shared/contracts/axis-exchange-v1.schema.json'));
const normalizedStateSchema=read(path.join(ROOT,'shared/contracts/axis-normalized-state-fixture-v1.schema.json'));

const SUPPORTED_SCHEMA_KEYS=new Set(['$schema','$id','title','$defs','$ref','type','required','properties','const','enum','minLength','minimum','format','items','allOf','if','then','additionalProperties']);
function assertSupportedSchema(schema,label){
  if(!schema||typeof schema!=='object'||Array.isArray(schema))return;
  for(const key of Object.keys(schema))assert.equal(SUPPORTED_SCHEMA_KEYS.has(key),true,`${label}: unsupported schema keyword ${key}`);
  for(const [key,child] of Object.entries(schema.properties||{}))assertSupportedSchema(child,`${label}.properties.${key}`);
  for(const [key,child] of Object.entries(schema.$defs||{}))assertSupportedSchema(child,`${label}.$defs.${key}`);
  if(schema.items&&typeof schema.items==='object')assertSupportedSchema(schema.items,`${label}.items`);
  for(const [index,rule] of (schema.allOf||[]).entries())assertSupportedSchema(rule,`${label}.allOf[${index}]`);
  if(schema.if)assertSupportedSchema(schema.if,`${label}.if`);
  if(schema.then)assertSupportedSchema(schema.then,`${label}.then`);
  if(schema.additionalProperties&&typeof schema.additionalProperties==='object')assertSupportedSchema(schema.additionalProperties,`${label}.additionalProperties`);
}
for(const [schema,label] of [[eventSchema,'eventSchema'],[exchangeSchema,'exchangeSchema'],[normalizedStateSchema,'normalizedStateSchema']])assertSupportedSchema(schema,label);

const typeOk=(value,type)=>{
  if(Array.isArray(type))return type.some(x=>typeOk(value,x));
  if(type==='null')return value===null;
  if(type==='object')return value!==null&&typeof value==='object'&&!Array.isArray(value);
  if(type==='array')return Array.isArray(value);
  if(type==='string')return typeof value==='string';
  if(type==='integer')return Number.isInteger(value);
  if(type==='number')return typeof value==='number'&&Number.isFinite(value);
  if(type==='boolean')return typeof value==='boolean';
  throw new Error(`unsupported schema type ${type}`);
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
  if(schema.type)assert.equal(typeOk(value,schema.type),true,`${label}: type ${Array.isArray(schema.type)?schema.type.join('|'):schema.type}`);
  if(typeof value==='string'&&schema.minLength!=null)assert.ok(value.length>=schema.minLength,`${label}: minLength`);
  if(typeof value==='number'&&schema.minimum!=null)assert.ok(value>=schema.minimum,`${label}: minimum`);
  if(schema.format==='date-time')assert.equal(typeof value==='string'&&!Number.isNaN(Date.parse(value)),true,`${label}: date-time`);

  const isObject=value!==null&&typeof value==='object'&&!Array.isArray(value);
  if(isObject){
    for(const key of schema.required||[])assert.equal(Object.hasOwn(value,key),true,`${label}: missing ${key}`);
    for(const [key,child] of Object.entries(schema.properties||{}))if(Object.hasOwn(value,key))validate(value[key],child,`${label}.${key}`,root);
    const known=new Set(Object.keys(schema.properties||{}));
    const extras=Object.keys(value).filter(key=>!known.has(key));
    if(schema.additionalProperties===false)assert.deepEqual(extras,[],`${label}: additional properties ${extras.join(',')}`);
    else if(schema.additionalProperties&&typeof schema.additionalProperties==='object')for(const key of extras)validate(value[key],schema.additionalProperties,`${label}.${key}`,root);
  }
  if((schema.type==='array'||Array.isArray(schema.type)&&schema.type.includes('array'))&&Array.isArray(value)&&schema.items){
    value.forEach((item,index)=>validate(item,schema.items,`${label}[${index}]`,root));
  }
  for(const [index,rule] of (schema.allOf||[]).entries()){
    let match=true;
    if(rule.if){try{validate(value,rule.if,`${label}.allOf[${index}].if`,root)}catch{match=false}}
    if(match&&rule.then)validate(value,rule.then,`${label}.allOf[${index}].then`,root);
  }
}

assert.equal(eventSchema.$id,'axis.event.v1');
assert.equal(exchangeSchema.$id,'axis.exchange.v1');
assert.equal(normalizedStateSchema.$id,'axis.normalized-state-fixture.v1');
assert.equal(exchangeSchema.properties?.events?.items?.$ref,'./axis-event-v1.schema.json','exchange events must reference published event schema');
for(const key of ['equipment','sessions','media'])assert.equal(exchangeSchema.properties?.[key]?.items?.$ref,'#/$defs/durableRecord',`${key} must require durable identity`);

const activityScoped=new Set(['activityStarted','activityPaused','activityResumed','activityFinished','setCompleted']);
const fixtureDir=path.join(ROOT,'shared/fixtures');
let eventCount=0,equipmentSelectionCount=0,normalizedStateCount=0;
for(const file of fs.readdirSync(fixtureDir).filter(f=>f.endsWith('.json')).sort()){
  const fixture=read(path.join(fixtureDir,file));
  if(Array.isArray(fixture.events)){
    const ids=new Set();
    for(const event of fixture.events){
      validate(event,eventSchema,`${file}/${event.id||'event'}`,eventSchema);
      assert.equal(ids.has(event.id),false,`${file}: duplicate event id ${event.id}`);
      ids.add(event.id);
      if(activityScoped.has(event.type))assert.equal(typeof event.activityId==='string'&&event.activityId.length>0,true,`${file}/${event.id}: activityId required`);
      if(event.type==='equipmentSelected'){
        assert.equal(typeof event.payload?.equipmentId==='string'&&event.payload.equipmentId.length>0,true,`${file}/${event.id}: equipmentId required`);
        equipmentSelectionCount++;
      }
      eventCount++;
    }
  }
  if(fixture.normalizedState){
    validate(fixture.normalizedState,normalizedStateSchema,`${file}/normalizedState`,normalizedStateSchema);
    const ids=new Set();
    for(const activity of fixture.normalizedState.activities){
      assert.equal(ids.has(activity.id),false,`${file}: duplicate normalized activity ${activity.id}`);
      ids.add(activity.id);
      for(const [index,interval] of activity.intervals.entries())assert.ok(interval.end>=interval.start,`${file}/${activity.id}/intervals[${index}]: end before start`);
    }
    assert.ok(fixture.normalizedState.sessionEnd>=fixture.normalizedState.sessionStart,`${file}: sessionEnd before sessionStart`);
    normalizedStateCount++;
  }
}
assert.ok(eventCount>0,'no fixture events validated');
assert.ok(equipmentSelectionCount>0,'equipmentSelected identity is not exercised by a golden fixture');
assert.ok(normalizedStateCount>0,'normalized-state fixture path is not exercised');

// Negative event probes: reducer-consumed/portable values must have one meaning.
for(const [label,bad] of [
  ['string timestamp',{schema:'axis.event.v1',id:'bad-1',type:'workoutStarted',sessionId:'s',occurredAt:'1000'}],
  ['missing activity identity',{schema:'axis.event.v1',id:'bad-2',type:'setCompleted',sessionId:'s',occurredAt:1000}],
  ['string planned sets',{schema:'axis.event.v1',id:'bad-3',type:'activityStarted',sessionId:'s',activityId:'a',occurredAt:1000,payload:{kind:'strength',plannedSets:'3'}}],
  ['invalid activity kind',{schema:'axis.event.v1',id:'bad-4',type:'activityStarted',sessionId:'s',activityId:'a',occurredAt:1000,payload:{kind:'weights',plannedSets:3}}],
  ['missing equipment selection payload',{schema:'axis.event.v1',id:'bad-5',type:'equipmentSelected',sessionId:'s',occurredAt:1000}],
  ['empty equipment selection identity',{schema:'axis.event.v1',id:'bad-6',type:'equipmentSelected',sessionId:'s',occurredAt:1000,payload:{equipmentId:''}}]
]){
  let rejected=false;
  try{validate(bad,eventSchema,label,eventSchema)}catch{rejected=true}
  assert.equal(rejected,true,`${label} unexpectedly passed event schema`);
}

const normalizedFixture=read(path.join(fixtureDir,'workout-overlap-union.json')).normalizedState;
for(const [label,mutate] of [
  ['string interval endpoint',x=>{x.activities[0].intervals[0].start='1000'}],
  ['empty activity id',x=>{x.activities[0].id=''}],
  ['invalid activity status',x=>{x.activities[0].status='done'}],
  ['string planned sets',x=>{x.activities[0].plannedSets='3'}],
  ['unknown normalized property',x=>{x.unversionedPlatformField=true}]
]){
  const bad=structuredClone(normalizedFixture);mutate(bad);
  let rejected=false;try{validate(bad,normalizedStateSchema,label,normalizedStateSchema)}catch{rejected=true}
  assert.equal(rejected,true,`${label} unexpectedly passed normalized-state schema`);
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

console.log(`[AXIS schema fixture seal] PASS · ${eventCount} fixture events · ${normalizedStateCount} normalized-state fixture · schema keyword subset fail-closed · portable types sealed · durable exchange identities required`);
