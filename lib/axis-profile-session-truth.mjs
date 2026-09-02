export const PROFILE_SNAPSHOT_SCHEMA='axis.profile-snapshot.v1';
export const GOAL_SNAPSHOT_SCHEMA='axis.goal-snapshot.v1';

const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const own=(object,key)=>Object.prototype.hasOwnProperty.call(object||{},key);
const object=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};
const text=value=>{const s=String(value??'').trim();return s||null};
const number=(value,min,max)=>{
  if(value===null||value===undefined||String(value).trim()==='')return null;
  const n=Number(value);
  return Number.isFinite(n)&&n>=min&&n<=max?n:null;
};
const time=value=>{const n=Number(value);if(!Number.isFinite(n)||n<0)throw new Error('[AXIS profile session truth] capturedAt must be a non-negative timestamp');return n};

export function createProfileSnapshot(profile={},capturedAt){
  const p=object(profile),measurements=object(p.measurements);
  return {
    schema:PROFILE_SNAPSHOT_SCHEMA,
    version:1,
    capturedAt:time(capturedAt),
    measurements:{
      heightCm:number(p.height,50,300),
      weightKg:number(p.weight,20,500),
      bodyFatPct:number(p.bodyFat,1,75),
      waistCm:number(measurements.waistCm,20,300)
    },
    training:{
      years:number(p.years,0,100),
      weeklyFrequency:number(p.freq,0,14)
    }
  };
}

export function createGoalSnapshot(profile={},capturedAt){
  const p=object(profile),targets=object(p.targets);
  return {
    schema:GOAL_SNAPSHOT_SCHEMA,
    version:1,
    capturedAt:time(capturedAt),
    kind:text(p.goal),
    targets:{
      weightKg:number(targets.weightKg,20,500),
      bodyFatPct:number(targets.bodyFatPct,1,75),
      waistCm:number(targets.waistCm,20,300)
    }
  };
}

export function createSessionTruthSnapshots(profile={},capturedAt){
  return {profileSnapshot:createProfileSnapshot(profile,capturedAt),goalSnapshot:createGoalSnapshot(profile,capturedAt)};
}

export function attachSessionTruth(session,profile={}){
  if(!session||typeof session!=='object'||Array.isArray(session))throw new Error('[AXIS profile session truth] session object is required');
  const next=clone(session);
  if(own(next,'profileSnapshot')||own(next,'goalSnapshot'))return next;
  const startedAt=Number(next.start);
  if(!Number.isFinite(startedAt)||startedAt<0)throw new Error('[AXIS profile session truth] session start is required');
  return {...next,...createSessionTruthSnapshots(profile,startedAt)};
}

export function readSessionTruth(session){
  const s=object(session);
  return {
    profileSnapshot:s.profileSnapshot&&typeof s.profileSnapshot==='object'?clone(s.profileSnapshot):null,
    goalSnapshot:s.goalSnapshot&&typeof s.goalSnapshot==='object'?clone(s.goalSnapshot):null
  };
}
