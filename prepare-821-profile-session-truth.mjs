import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Profile / Goal Session truth] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};
function functionRange(src,signature,label){
 const start=src.indexOf(signature);if(start<0)fail(`${label} signature missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} opening brace missing`);let depth=0,quote='',escaped=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
  if(quote){if(escaped){escaped=false;continue}if(ch==='\\'){escaped=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'&&--depth===0){end=i+1;break}
 }
 if(end<0)fail(`${label} closing brace missing`);return{start,end,text:src.slice(start,end)};
}
function replaceFunction(src,signature,replacement,label){const r=functionRange(src,signature,label);return src.slice(0,r.start)+replacement+src.slice(r.end)}

/* Profile keeps its established top-level current height/weight/body-fat owners.
 * New structured fields are only facts that did not previously have an owner. */
{
 const FILE='index.html';let s=read(FILE);
 if(s.includes('profileTargetWeight'))fail('Profile truth fields already installed');
 const anchor='<div class="sectionLabel">每周训练</div><div class="seg five" id="profileFreq">';
 if(s.split(anchor).length-1!==1)fail('Profile weekly-frequency anchor missing or duplicated');
 const fields=`<div class="sectionLabel">身体记录（可选）</div><div class="profileGrid">
    <label><span>腰围</span><div><input id="profileWaist" inputmode="decimal" placeholder="—"><em>cm</em></div></label>
  </div>
  <div class="sectionLabel">目标数值（可选）</div><div class="profileGrid">
    <label><span>目标体重</span><div><input id="profileTargetWeight" inputmode="decimal" placeholder="—"><em>kg</em></div></label>
    <label><span>目标体脂率</span><div><input id="profileTargetBodyFat" inputmode="decimal" placeholder="—"><em>%</em></div></label>
    <label><span>目标腰围</span><div><input id="profileTargetWaist" inputmode="decimal" placeholder="—"><em>cm</em></div></label>
  </div>
  `;
 s=s.replace(anchor,fields+anchor);write(FILE,s);
}

/* app.js remains the sole profile/session/storage owner. Session context is
 * created only at the two existing new-session boundaries: normal Start and
 * Flow launch when no Session exists. Existing/legacy Sessions are untouched. */
{
 const FILE='app.js';let s=read(FILE);
 if(!s.includes('__AXIS_821_OBJECT_METRIC_OVERRIDES__'))fail('Object metric override layer must precede Profile Session truth');
 if(s.includes('__AXIS_821_PROFILE_SESSION_TRUTH__'))fail('Profile Session truth already installed');

 const runtime=String.raw`
/* AXIS 8.21 — immutable Session-time Profile / Goal context. */
const AXIS821_PROFILE_SNAPSHOT_SCHEMA='axis.profile-snapshot.v1',AXIS821_GOAL_SNAPSHOT_SCHEMA='axis.goal-snapshot.v1';
function axis821ProfileTruthNumber(value,min,max){if(value===null||value===undefined||String(value).trim()==='')return null;const n=Number(value);return Number.isFinite(n)&&n>=min&&n<=max?n:null}
function axis821ProfileTruthText(value){const s=String(value??'').trim();return s||null}
function axis821ProfileTruthEnsureShape(){state.profile=state.profile&&typeof state.profile==='object'?state.profile:{};const m=state.profile.measurements,t=state.profile.targets;state.profile.measurements=m&&typeof m==='object'&&!Array.isArray(m)?m:{};state.profile.targets=t&&typeof t==='object'&&!Array.isArray(t)?t:{};if(state.profile.measurements.waistCm==null)state.profile.measurements.waistCm='';for(const k of ['weightKg','bodyFatPct','waistCm'])if(state.profile.targets[k]==null)state.profile.targets[k]='';return state.profile}
function axis821ProfileSnapshot(profile,capturedAt){const p=profile&&typeof profile==='object'?profile:{},m=p.measurements&&typeof p.measurements==='object'?p.measurements:{};return{schema:AXIS821_PROFILE_SNAPSHOT_SCHEMA,version:1,capturedAt:Number(capturedAt),measurements:{heightCm:axis821ProfileTruthNumber(p.height,50,300),weightKg:axis821ProfileTruthNumber(p.weight,20,500),bodyFatPct:axis821ProfileTruthNumber(p.bodyFat,1,75),waistCm:axis821ProfileTruthNumber(m.waistCm,20,300)},training:{years:axis821ProfileTruthNumber(p.years,0,100),weeklyFrequency:axis821ProfileTruthNumber(p.freq,0,14)}}}
function axis821GoalSnapshot(profile,capturedAt){const p=profile&&typeof profile==='object'?profile:{},t=p.targets&&typeof p.targets==='object'?p.targets:{};return{schema:AXIS821_GOAL_SNAPSHOT_SCHEMA,version:1,capturedAt:Number(capturedAt),kind:axis821ProfileTruthText(p.goal),targets:{weightKg:axis821ProfileTruthNumber(t.weightKg,20,500),bodyFatPct:axis821ProfileTruthNumber(t.bodyFatPct,1,75),waistCm:axis821ProfileTruthNumber(t.waistCm,20,300)}}}
function axis821CreateSessionWithTruth(start){const capturedAt=Number(start);if(!Number.isFinite(capturedAt)||capturedAt<0)throw new Error('[AXIS 8.21 Profile Session truth] invalid Session start');const p=axis821ProfileTruthEnsureShape();return{id:uid('S'),start:capturedAt,events:[],profileSnapshot:axis821ProfileSnapshot(p,capturedAt),goalSnapshot:axis821GoalSnapshot(p,capturedAt)}}
try{window.__AXIS_821_PROFILE_SESSION_TRUTH__={version:'8.21',profileSchema:AXIS821_PROFILE_SNAPSHOT_SCHEMA,goalSchema:AXIS821_GOAL_SNAPSHOT_SCHEMA,profileOwner:'app',sessionStartOwner:'app',completionOwner:'app',storageOwner:'axis_v60_state/app-save',legacyBackfill:false,newPersistence:false,newEncounterOwner:false,newActiveOwner:false,newFlowOwner:false,snapshot:(profile,start)=>({profileSnapshot:clone(axis821ProfileSnapshot(profile,start)),goalSnapshot:clone(axis821GoalSnapshot(profile,start))}),current:()=>state.active?{profileSnapshot:clone(state.active.profileSnapshot||null),goalSnapshot:clone(state.active.goalSnapshot||null)}:null}}catch{}
`;
 const close=s.lastIndexOf('})();');if(close<0)fail('canonical app IIFE end missing');s=s.slice(0,close)+runtime+s.slice(close);

 s=replaceFunction(s,'function fillProfile()',`function fillProfile(){axis821ProfileTruthEnsureShape();$('#profileName').value=state.profile.name||'';setVal('profileHeight',state.profile.height);setVal('profileWeight',state.profile.weight);setVal('profileBodyFat',state.profile.bodyFat);setVal('profileYears',state.profile.years);setVal('profileWaist',state.profile.measurements.waistCm);setVal('profileTargetWeight',state.profile.targets.weightKg);setVal('profileTargetBodyFat',state.profile.targets.bodyFatPct);setVal('profileTargetWaist',state.profile.targets.waistCm);$$('#profileFreq button').forEach(b=>b.classList.toggle('active',String(state.profile.freq)===b.dataset.value));$$('#profileGoal button').forEach(b=>b.classList.toggle('active',state.profile.goal===b.dataset.value))}`,'Profile fill with additive body/target facts');
 s=replaceFunction(s,'function saveProfile()',`function saveProfile(){axis821ProfileTruthEnsureShape();state.profile.name=$('#profileName').value.trim();state.profile.height=$('#profileHeight').value.trim();state.profile.weight=$('#profileWeight').value.trim();state.profile.bodyFat=$('#profileBodyFat').value.trim();state.profile.years=$('#profileYears').value.trim();state.profile.measurements={...state.profile.measurements,waistCm:$('#profileWaist')?.value.trim()||''};state.profile.targets={...state.profile.targets,weightKg:$('#profileTargetWeight')?.value.trim()||'',bodyFatPct:$('#profileTargetBodyFat')?.value.trim()||'',waistCm:$('#profileTargetWaist')?.value.trim()||''};state.profile.freq=$('#profileFreq .active')?.dataset.value||'';state.profile.goal=$('#profileGoal .active')?.dataset.value||'';save();closeSheet('profileSheet');render();toast('已保存')}`,'Profile save with additive body/target facts');

 let starts=0;
 s=s.replace(/state\.active\s*=\s*\{id:uid\('S'\),start:([^,}]+),events:\[\]\}/g,(whole,start)=>{starts++;return`state.active=axis821CreateSessionWithTruth(${start})`});
 if(starts!==2)fail(`new Session boundaries expected 2, found ${starts}`);
 if((s.match(/profileSnapshot:axis821ProfileSnapshot/g)||[]).length!==1||(s.match(/goalSnapshot:axis821GoalSnapshot/g)||[]).length!==1)fail('snapshot writers must remain one Session-construction owner');
 for(const forbidden of ['axis_profile_state','axis_goal_state',"localStorage.setItem('axis_profile",'localStorage.setItem("axis_profile',"localStorage.setItem('axis_goal",'localStorage.setItem("axis_goal'])if(s.includes(forbidden))fail(`parallel Profile/Goal persistence forbidden · ${forbidden}`);
 syntax(s,FILE);write(FILE,s);
}

console.log('[AXIS 8.21 Profile / Goal Session truth] PASS · existing Profile owners preserved · optional waist/targets additive · normal + Flow Session creation snapshots current context once · legacy absence preserved · no new store/Encounter/Active/Flow owner');
