import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Report Range Truth] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};

const FILE='app.js';
let s=read(FILE);
if(s.includes('__AXIS_821_REPORT_RANGE_TRUTH__'))fail('Report Range Truth already installed');
if(!s.includes('__AXIS_821_SESSION_TIME_TRUTH__'))fail('Session Time Truth must exist first');
if(!s.includes('__AXIS_821_PROFILE_SESSION_TRUTH__'))fail('Profile / Goal Session truth must exist first');

const pureSource=read('lib/axis-report-range-truth.mjs');
if(/\bimport\s/.test(pureSource))fail('pure report range model must not import runtime modules');
if(/Date\.now\s*\(/.test(pureSource))fail('pure report range model must not read wall-clock now');
const browserSource=pureSource.replace(/^export\s+/gm,'');
if(/\bexport\s/.test(browserSource))fail('pure report range export stripping incomplete');

const runtime=`
/* AXIS 8.21 — read-only historical Report Range Truth. */
const axis821ReportRangeBuild=(()=>{
${browserSource}
return axisReportRangeBuild;
})();
function axis821BuildReportRange(range){return axis821ReportRangeBuild(state.sessions,range)}
try{window.__AXIS_821_REPORT_RANGE_TRUTH__={version:'8.21',schema:'axis.report-range.v1',owner:'read-only-report-range-projection',source:'axis_v60_state.sessions',rangeMembership:'session-start-half-open',profileSource:'immutable-session-snapshot-only',goalSource:'immutable-session-snapshot-only',metricSource:'immutable-encounter-facts-only',canonicalTimeOnly:true,liveProfileRead:false,currentObjectDefinitionRead:false,legacyTimeInference:false,legacyMetricPromotion:false,storageWrite:false,reportUIOwner:false,exportOwner:false,build:axis821BuildReportRange}}catch{}
`;
if(/state\.profile|localStorage|indexedDB|\bsave\s*\(/.test(runtime))fail('report range runtime crossed read-only ownership boundary');
const markerAt=s.indexOf('__AXIS_821_SESSION_TIME_TRUTH__');
if(markerAt<0)fail('Session Time Truth marker missing');
const closeAt=s.indexOf('})();',markerAt);
if(closeAt<0)fail('canonical app lexical close missing after Session Time Truth');
s=s.slice(0,closeAt)+runtime+s.slice(closeAt);

for(const token of ['axis.report-range.v1','read-only-report-range-projection','session-start-half-open','immutable-session-snapshot-only','immutable-encounter-facts-only','canonicalTimeOnly:true','liveProfileRead:false','currentObjectDefinitionRead:false','legacyTimeInference:false','legacyMetricPromotion:false','storageWrite:false','reportUIOwner:false','exportOwner:false'])if(!s.includes(token))fail(`Report Range Truth runtime contract missing ${token}`);
syntax(s,FILE);write(FILE,s);
console.log('[AXIS 8.21 Report Range Truth] PASS · completed Session range projection · immutable snapshots/Encounter facts · canonical time only · private pure-model scope · no live Profile/object lookup · no inference/write/UI/export owner');
