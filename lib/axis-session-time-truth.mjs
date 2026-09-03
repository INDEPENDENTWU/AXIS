export const AXIS_SESSION_TIME_SCHEMA='axis.session-time.v1';

const finite=v=>Number.isFinite(Number(v))?Number(v):null;
const list=v=>Array.isArray(v)?v:[];
const obj=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
const nonNegative=v=>Math.max(0,Number(v)||0);

function axisSessionTimeBounds(session,sealedAt){
  const start=finite(session?.start),end=finite(session?.end)??finite(sealedAt);
  if(start==null||end==null||end<start)throw new Error('[AXIS Session Time] invalid Session bounds');
  return{start,end};
}

function axisSessionTimeClampInterval(start,end,bounds){
  start=finite(start);end=finite(end);
  if(start==null||end==null||end<=start)return null;
  const a=Math.max(bounds.start,start),b=Math.min(bounds.end,end);
  return b>a?[a,b]:null;
}

export function axisSessionTimeMergeIntervals(intervals=[]){
  const xs=list(intervals).map(x=>Array.isArray(x)?[finite(x[0]),finite(x[1])]:null).filter(x=>x&&x[0]!=null&&x[1]!=null&&x[1]>x[0]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const out=[];
  for(const x of xs){const p=out.at(-1);if(p&&x[0]<=p[1])p[1]=Math.max(p[1],x[1]);else out.push([...x])}
  return out;
}

export function axisSessionTimeSubtractIntervals(intervals=[],blockers=[]){
  const base=axisSessionTimeMergeIntervals(intervals),cuts=axisSessionTimeMergeIntervals(blockers),out=[];
  for(const [start,end] of base){let parts=[[start,end]];for(const [bs,be] of cuts){const next=[];for(const [a,b] of parts){if(be<=a||bs>=b){next.push([a,b]);continue}if(bs>a)next.push([a,Math.min(bs,b)]);if(be<b)next.push([Math.max(be,a),b])}parts=next;if(!parts.length)break}out.push(...parts)}
  return axisSessionTimeMergeIntervals(out);
}

const axisSessionTimeDuration=intervals=>axisSessionTimeMergeIntervals(intervals).reduce((n,[a,b])=>n+(b-a),0);
const axisSessionTimeActivity=(meta,id)=>obj(obj(meta).events)[id]?.activity||null;

function axisSessionTimeActivityIntervals(activity,bounds,sealedAt){
  if(!activity)return[];
  const raw=list(activity.intervals),out=[];
  for(let i=0;i<raw.length;i++){
    const x=obj(raw[i]),open=x.end==null&&activity.status==='active'&&i===raw.length-1,iv=axisSessionTimeClampInterval(x.start,open?sealedAt:x.end,bounds);
    if(iv)out.push(iv)
  }
  return axisSessionTimeMergeIntervals(out);
}

function axisSessionTimeExplicitExecutionMs(event){
  const e=obj(event),metrics=obj(e.metrics),mode=String(e.executionModeSnapshot||'');
  const duration=finite(metrics.duration)??finite(e.duration),hold=finite(metrics.hold)??finite(e.hold);
  if(mode==='hold'&&hold!=null&&hold>0)return hold*1000;
  if(duration!=null&&duration>0)return duration*60000;
  if(hold!=null&&hold>0)return hold*1000;
  return 0;
}

function axisSessionTimeExplicitExecutionInterval(event,bounds){
  const ms=axisSessionTimeExplicitExecutionMs(event);if(!ms)return null;
  const end=finite(event?.time)??bounds.end;
  return axisSessionTimeClampInterval(end-ms,end,bounds);
}

function axisSessionTimeRestEvidence(activity,activityIntervals,bounds){
  if(!activity)return{intervals:[],rawCount:0,ambiguousSettledRestMs:0};
  const own=axisSessionTimeMergeIntervals(activityIntervals),gaps=[];
  for(let i=1;i<own.length;i++){const iv=axisSessionTimeClampInterval(own[i-1][1],own[i][0],bounds);if(iv)gaps.push(iv)}
  const settled=nonNegative(activity.restAccumulatedMs),gapMs=axisSessionTimeDuration(gaps),tolerance=Math.max(250,gaps.length*100),intervals=[];
  let ambiguousSettledRestMs=0;
  if(settled>0&&gaps.length){if(Math.abs(gapMs-settled)<=tolerance)intervals.push(...gaps);else ambiguousSettledRestMs=settled}
  else if(settled>0)ambiguousSettledRestMs=settled;
  if(activity.status==='paused'){
    const live=axisSessionTimeClampInterval(activity.restStartedAt,bounds.end,bounds);if(live)intervals.push(live)
  }
  return{intervals:axisSessionTimeMergeIntervals(intervals),rawCount:intervals.length,ambiguousSettledRestMs};
}

export function axisSessionTimeBuild(session,meta={},sealedAt=session?.end){
  const bounds=axisSessionTimeBounds(session,sealedAt),events=list(session?.events),activityRows=[],activeCandidates=[];
  let activeIntervals=0,explicitDurationEvents=0,unmeasuredEvents=0;
  for(const event of events){
    const activity=axisSessionTimeActivity(meta,event?.id),ivs=axisSessionTimeActivityIntervals(activity,bounds,bounds.end);
    activityRows.push({activity,ivs});
    if(ivs.length){activeCandidates.push(...ivs);activeIntervals+=ivs.length;continue}
    const fallback=axisSessionTimeExplicitExecutionInterval(event,bounds);
    if(fallback){activeCandidates.push(fallback);explicitDurationEvents++}else unmeasuredEvents++
  }
  const active=axisSessionTimeMergeIntervals(activeCandidates),restCandidates=[];
  let explicitPauseIntervals=0,ambiguousSettledRestMs=0;
  for(const row of activityRows){const r=axisSessionTimeRestEvidence(row.activity,row.ivs,bounds);restCandidates.push(...r.intervals);explicitPauseIntervals+=r.rawCount;ambiguousSettledRestMs+=r.ambiguousSettledRestMs}
  const rest=axisSessionTimeSubtractIntervals(restCandidates,active),totalMs=bounds.end-bounds.start,activeMs=axisSessionTimeDuration(active),restMs=axisSessionTimeDuration(rest),classifiedMs=Math.min(totalMs,activeMs+restMs),unaccountedMs=Math.max(0,totalMs-classifiedMs);
  return{schema:AXIS_SESSION_TIME_SCHEMA,version:1,sealedAt:bounds.end,start:bounds.start,end:bounds.end,totalMs,activeMs,restMs,unaccountedMs,classifiedMs,sources:{activeIntervals,explicitDurationEvents,explicitPauseIntervals,unmeasuredEvents,ambiguousSettledRestMs},policy:{active:'real-activity-intervals-or-explicit-duration',rest:'explicit-pause-only-no-active-overlap',settledRest:'exact-gap-match-only',unaccounted:'not-inferred',strengthInference:false}};
}
