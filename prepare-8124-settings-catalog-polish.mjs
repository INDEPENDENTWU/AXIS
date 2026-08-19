import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.4 settings/catalog polish] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,()=>to)};
const onceRe=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',m=src.match(new RegExp(re.source,flags))||[];if(m.length!==1)fail(`${label} expected once, found ${m.length}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* 1) Settings detail geometry: the fold no longer adds a second horizontal inset.
      Learning + Cloud/AI use the same 15px / 48px / 16px rhythm as Sound + Watermark. */
{
 const FILE='v87-runtime.js';let src=read(FILE);const end=src.lastIndexOf('})();');if(end<0)fail('v87 runtime end missing');
 if(src.includes('__AXIS_8124_SETTINGS_DETAIL_GEOMETRY__'))fail('settings detail geometry already installed');
 const block=String.raw`
(function axis8124SettingsDetailGeometry(){
 if(D.querySelector('#v8124SettingsDetailGeometry'))return;
 const s=D.createElement('style');s.id='v8124SettingsDetailGeometry';s.textContent=
 '#settingsSheet{--axis-settings-ui:var(--axis-ui,15px);--axis-settings-control-h:48px;--axis-settings-radius:14px;--axis-settings-block-y:16px;--axis-settings-gap:8px}'+
 '#settingsSheet #v813LearningGate>.v8711Fold,#settingsSheet #v813ServiceGate>.v8711Fold{padding-left:0!important;padding-right:0!important;padding-bottom:8px!important}'+
 '#v813LearningGate .v811CoreGroup,#v813ServiceGate .v813ServiceBlock{padding:var(--axis-settings-block-y) 0!important;border-bottom:1px solid var(--line)!important}'+
 '#v813LearningGate .v811CoreHead,#v813ServiceGate .v813ServiceHead{min-height:26px!important;margin-bottom:10px!important;gap:12px!important;align-items:center!important}'+
 '#v813LearningGate .v811CoreHead span,#v813ServiceGate .v813ServiceHead span{font-size:var(--axis-settings-ui)!important;color:var(--muted)!important;font-weight:500!important}'+
 '#v813LearningGate .v811CoreHead b,#v813ServiceGate .v813ServiceHead b{font-size:var(--axis-settings-ui)!important;color:var(--dim)!important;font-weight:570!important;text-align:right!important}'+
 '#v813LearningGate .v811CoreOptions{gap:var(--axis-settings-gap)!important}'+
 '#v813LearningGate .v811CoreOptions button{height:var(--axis-settings-control-h)!important;border-radius:var(--axis-settings-radius)!important;padding:0 10px!important;font-size:var(--axis-settings-ui)!important;font-weight:630!important;line-height:1!important}'+
 '#v813ServiceGate .v811ServiceSeg{height:var(--axis-settings-control-h)!important;display:grid!important;gap:3px!important;padding:3px!important;border-radius:var(--axis-settings-radius)!important;background:var(--s2)!important}'+
 '#v813ServiceGate .v811ServiceSeg button{height:auto!important;min-height:0!important;border-radius:11px!important;font-size:var(--axis-settings-ui)!important;font-weight:520!important}'+
 '#v813LearningGate #v811FineTune,#v813ServiceGate .v813ServiceDetails{margin:0!important;border-bottom:1px solid var(--line)!important}'+
 '#v813LearningGate #v811FineTune>summary,#v813ServiceGate .v813ServiceDetails>summary{min-height:60px!important;font-size:var(--axis-settings-ui)!important;color:var(--muted)!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important}'+
 '#v813LearningGate #v811FineTune .v810SpeakBlock,#v813LearningGate .v812FineBlock{padding:16px 0!important}'+
 '#v813LearningGate .v810SpeakBlock>div:first-child{margin-bottom:10px!important}'+
 '#v813LearningGate .v810Options,#v813LearningGate .v812FineOptions{gap:8px!important}'+
 '#v813LearningGate .v810Options button,#v813LearningGate .v812FineOptions button{height:44px!important;border-radius:13px!important;font-size:14px!important}'+
 '#v813LearningGate .v810Progress{padding:16px 0 2px!important}#v813LearningGate .v810Progress span{font-size:13px!important}#v813LearningGate .v810Progress button{height:44px!important;border-radius:13px!important;padding:0 14px!important;font-size:13px!important}'+
 '#v813ServiceGate .v811ServiceNote{margin-top:10px!important;font-size:12px!important;line-height:1.55!important;color:var(--dim)!important}'+
 '#v813ServiceGate .v811ServiceFacts{margin-top:0!important}#v813ServiceGate .v811ServiceFact{min-height:52px!important;font-size:13px!important}'+
 '#v813ServiceGate .v811PrivacyRow{min-height:56px!important}#v813ServiceGate .v811PrivacyRow span{font-size:13px!important}#v813ServiceGate .v811PrivacyRow button{height:36px!important;min-width:64px!important;border-radius:11px!important;font-size:12px!important}'+
 '@media(max-width:380px){#v813LearningGate .v811CoreOptions.purpose,#v813LearningGate .v811CoreOptions.method{grid-template-columns:repeat(3,minmax(0,1fr))!important}#v813LearningGate .v811CoreOptions button,#v813ServiceGate .v811ServiceSeg button{font-size:13px!important}}';
 (D.head||D.documentElement).appendChild(s)
})();
try{window.__AXIS_8124_SETTINGS_DETAIL_GEOMETRY__={version:'8.12.4',owner:'canonical-settings-detail',foldHorizontalInset:0,uiPx:15,controlHeightPx:48,blockYPx:16,reference:'sound-watermark',trainingOwner:false}}catch{}
`;
 src=src.slice(0,end)+block+'\n'+src.slice(end);syntax(src,FILE);write(FILE,src);
}

/* 2) Native library gets a detailed, compatibility-safe anatomy layer.
      Existing coarse muscles remain untouched for historical analytics. */
{
 const FILE='v873-exercise-library.js';let src=read(FILE);
 const anchor='window.__AXIS_873_LIBRARY__=LIB;window.__AXIS_873_MUSCLE_ALIASES__=MUSCLE_ALIASES;';
 const enrich=String.raw`
const AXIS8124_TARGETS=new Map();
function axis8124Target(ids,primary,secondary,pattern,stabilizers=[]){for(const id of ids)AXIS8124_TARGETS.set(id,{primary:[...primary],secondary:[...secondary],stabilizers:[...stabilizers],pattern})}
axis8124Target(['bench','db-bench','pushup'],['胸大肌中部'],['三角肌前束','肱三头肌'],'水平推');
axis8124Target(['incline-bench','incline-db'],['胸大肌上部'],['三角肌前束','肱三头肌'],'上斜水平推');
axis8124Target(['decline-bench','dip-chest'],['胸大肌下部'],['肱三头肌','三角肌前束'],'下斜推');
axis8124Target(['cable-fly','pec-deck','db-fly'],['胸大肌中部'],[],'肩水平内收');
axis8124Target(['close-bench'],['肱三头肌'],['胸大肌中部','三角肌前束'],'窄距水平推');
axis8124Target(['ohp','db-shoulder','machine-shoulder'],['三角肌前束','三角肌中束'],['肱三头肌'],'垂直推');
axis8124Target(['lateral'],['三角肌中束'],[],'肩外展');
axis8124Target(['front-raise'],['三角肌前束'],[],'肩屈曲');
axis8124Target(['reverse-fly'],['三角肌后束'],['菱形肌','斜方肌中下束'],'肩水平外展');
axis8124Target(['face-pull'],['三角肌后束','肩袖'],['斜方肌中下束'],'肩外旋 / 水平外展');
axis8124Target(['upright-row'],['三角肌中束'],['斜方肌上束','肱二头肌'],'直立拉');
axis8124Target(['lat-pulldown','pullup','chinup'],['背阔肌'],['肱二头肌','斜方肌中下束'],'垂直拉');
axis8124Target(['straight-pulldown'],['背阔肌'],[],'肩伸展');
axis8124Target(['seated-row','chest-row','bb-row','db-row','tbar'],['背阔肌','菱形肌'],['斜方肌中下束','肱二头肌','三角肌后束'],'水平拉');
axis8124Target(['shrug'],['斜方肌上束'],[],'肩胛上提');
axis8124Target(['curl','db-curl','preacher'],['肱二头肌'],['肱肌'],'肘屈曲');
axis8124Target(['hammer'],['肱肌','肱二头肌'],['前臂屈肌群'],'中立位肘屈曲');
axis8124Target(['pushdown'],['肱三头肌'],[],'肘伸展');
axis8124Target(['overhead-tri','skull'],['肱三头肌'],[],'过头肘伸展');
axis8124Target(['squat','goblet','hack-squat'],['股四头肌','臀大肌'],['腘绳肌'],'深蹲');
axis8124Target(['front-squat'],['股四头肌'],['臀大肌'],'前蹲');
axis8124Target(['leg-press'],['股四头肌','臀大肌'],['腘绳肌'],'腿推');
axis8124Target(['split-squat','bulgarian','lunge','walking-lunge','stepup'],['股四头肌','臀大肌'],['腘绳肌'],'单腿蹲 / 弓步');
axis8124Target(['leg-ext'],['股四头肌'],[],'膝伸展');
axis8124Target(['leg-curl','seated-curl','lying-curl'],['腘绳肌'],[],'膝屈曲');
axis8124Target(['deadlift'],['臀大肌','腘绳肌','竖脊肌'],['斜方肌上束'],'髋主导硬拉');
axis8124Target(['rdl','goodmorning'],['腘绳肌','臀大肌'],['竖脊肌'],'髋铰链');
axis8124Target(['sumo'],['臀大肌','内收肌群','股四头肌'],['腘绳肌','竖脊肌'],'宽站硬拉');
axis8124Target(['hip-thrust','glute-bridge'],['臀大肌'],['腘绳肌'],'髋伸展');
axis8124Target(['kickback'],['臀大肌'],[],'髋伸展');
axis8124Target(['abduction'],['臀中肌 / 臀小肌'],[],'髋外展');
axis8124Target(['adduction'],['内收肌群'],[],'髋内收');
axis8124Target(['calf-raise'],['腓肠肌','比目鱼肌'],[],'踝跖屈');
axis8124Target(['plank'],['腹横肌','腹直肌'],['多裂肌'],'抗伸展');
axis8124Target(['side-plank'],['腹外斜肌','腹内斜肌'],['腹横肌','多裂肌'],'抗侧屈');
axis8124Target(['crunch'],['腹直肌'],[],'躯干屈曲');
axis8124Target(['situp','leg-raise'],['腹直肌','髋屈肌群'],[],'躯干 / 髋屈曲');
axis8124Target(['ab-wheel'],['腹直肌','腹横肌'],['多裂肌'],'抗伸展');
axis8124Target(['russian'],['腹外斜肌','腹内斜肌'],['腹直肌'],'躯干旋转');
axis8124Target(['pallof'],['腹横肌','腹外斜肌','腹内斜肌'],['多裂肌'],'抗旋转');
axis8124Target(['kb-swing'],['臀大肌','腘绳肌'],['核心整体'],'爆发髋伸展');
axis8124Target(['clean','snatch'],['臀大肌','股四头肌','竖脊肌'],['斜方肌上束','三角肌前束'],'爆发全身');
axis8124Target(['thruster'],['股四头肌','臀大肌','三角肌前束'],['肱三头肌','核心整体'],'深蹲推举');
axis8124Target(['burpee','hiit'],['心肺','全身耐力'],[],'全身间歇');
axis8124Target(['treadmill','run','walk','stair','hike'],['心肺','下肢耐力'],[],'步行 / 跑步耐力');
axis8124Target(['elliptical','bike','spin'],['心肺','下肢耐力'],[],'低冲击下肢耐力');
axis8124Target(['rower'],['心肺','全身耐力'],['上肢耐力','下肢耐力'],'划船耐力');
axis8124Target(['rope'],['心肺','下肢耐力'],[],'跳跃耐力');
axis8124Target(['swim'],['心肺','全身耐力'],['上肢耐力'],'游泳耐力');
axis8124Target(['ski'],['心肺','上肢耐力'],['核心整体'],'上肢主导耐力');
axis8124Target(['airbike'],['心肺','全身耐力'],['上肢耐力','下肢耐力'],'全身循环耐力');
const AXIS8124_COARSE={'胸肌':['胸部整体'],'背部':['背部整体'],'肩部':['肩部整体'],'肱二头肌':['肱二头肌'],'肱三头肌':['肱三头肌'],'核心':['核心整体'],'臀部':['臀腿整体'],'股四头肌':['股四头肌'],'腘绳肌':['腘绳肌'],'小腿':['腓肠肌','比目鱼肌'],'心肺':['心肺']};
const axis8124Region=d=>/胸/.test(d)?'胸':/背|阔|斜方|菱形|竖脊/.test(d)?'背':/肩|三角|肩袖/.test(d)?'肩':/肱|前臂/.test(d)?'手臂':/腹|核心|多裂/.test(d)?'核心':/臀|股|腘|内收|髋|腓肠|比目鱼|胫骨/.test(d)?'臀腿':/心肺|耐力/.test(d)?'心肺':'全身';
const axis8124Equipment=x=>{const n=(x.id+' '+x.name+' '+(x.aliases||[]).join(' ')).toLowerCase();if(/dumbbell|哑铃|啞鈴|db-/.test(n))return'哑铃';if(/barbell|杠铃|槓鈴|bench$|squat$|deadlift/.test(n))return'杠铃';if(/cable|绳索|繩索|龙门|龍門/.test(n))return'绳索';if(/body|pushup|pullup|chinup|dip|plank|crunch|situp|burpee/.test(n))return'自重';if(x.type==='cardio')return'有氧设备 / 运动';if(/machine|器械|机|機|press|curl|extension|abduction|adduction/.test(n))return'固定器械';return'动作';};
for(const x of LIB){const explicit=AXIS8124_TARGETS.get(x.id),generic=['cable-generic','smith','dumbbell','barbell'].includes(x.id);let primary=explicit?.primary||[],secondary=explicit?.secondary||[],stabilizers=explicit?.stabilizers||[];if(!primary.length&&!generic){for(const c of x.muscles||[]){const ds=AXIS8124_COARSE[c]||[];for(const d of ds)if(!primary.includes(d))primary.push(d)}}const details=[...new Set([...primary,...secondary])],regions=[...new Set(details.map(axis8124Region))];x.primaryTargets=primary;x.secondaryTargets=secondary;x.stabilizers=stabilizers;x.detailMuscles=details;x.bodyRegions=regions.length?regions:(generic?['全身']:[]);x.movementPattern=explicit?.pattern||(x.type==='cardio'?'有氧耐力':'复合 / 待具体动作');x.equipmentClass=axis8124Equipment(x);x.targetKind=generic?'equipment':(x.id==='hiit'?'protocol':'movement');x.variableTargets=generic||x.id==='hiit';x.targetConfidence=explicit?'canonical':(generic?'contextual':'coarse-mapped')}
try{window.__AXIS_EXERCISE_TAXONOMY__={version:'8.12.4',owner:'v873-native-library',compatibilityMusclesPreserved:true,detailMuscles:true,primarySecondary:true,bodyRegions:true,movementPattern:true,equipmentClass:true,genericEquipmentContextual:true}}catch{}
`;
 src=once(src,anchor,enrich+'\n'+anchor,'native anatomy taxonomy');syntax(src,FILE);write(FILE,src);
}

/* 3) App remains the only selection/state owner. Expose read-only picker projections,
      enrich canonical lookup, reset search lifecycle, and remove the legacy per-key rebuild. */
{
 const FILE='app.js';let src=read(FILE);
 const eqFn=`function eqById(id){const lib=window.__AXIS_873_LIBRARY__||[],own=eqAll().find(e=>e.id===id),x=lib.find(e=>e.id===id)||lib.find(e=>e.baseId===id);if(own){if(!x)return own;return{...own,detailMuscles:[...(x.detailMuscles||[])],primaryTargets:[...(x.primaryTargets||[])],secondaryTargets:[...(x.secondaryTargets||[])],stabilizers:[...(x.stabilizers||[])],bodyRegions:[...(x.bodyRegions||[])],movementPattern:x.movementPattern||own.pattern,equipmentClass:x.equipmentClass||'',targetKind:x.targetKind||'',targetConfidence:x.targetConfidence||'',effect:(x.primaryTargets||[]).slice(0,2).join(' · ')||own.effect}}if(!x)return null;const muscles=[...(x.muscles||[])];return{id:x.id,name:x.name,type:x.type||'strength',pattern:derivePattern(x.type||'strength',muscles),muscles,effect:(x.primaryTargets||[]).slice(0,2).join(' · ')||muscles.slice(0,2).join(' · '),canonical:true,detailMuscles:[...(x.detailMuscles||[])],primaryTargets:[...(x.primaryTargets||[])],secondaryTargets:[...(x.secondaryTargets||[])],stabilizers:[...(x.stabilizers||[])],bodyRegions:[...(x.bodyRegions||[])],movementPattern:x.movementPattern||'',equipmentClass:x.equipmentClass||'',targetKind:x.targetKind||'',targetConfidence:x.targetConfidence||''}}`;
 src=onceRe(src,/function eqById\(id\)\{[^\n]*\}/,eqFn,'enriched canonical resolver');
 const muscleFn=`function renderMuscles(eq){$('#musclePanel').classList.toggle('hidden',!eq);if(eq){const detailed=eq.detailMuscles?.length?eq.detailMuscles:eq.muscles||[];$('#muscleTags').innerHTML=detailed.slice(0,5).map(m=>\`<i>\${esc(m)}</i>\`).join('');setText('#effectText',eq.effect||(eq.primaryTargets||[]).slice(0,2).join(' · ')||'')}}`;
 src=onceRe(src,/function renderMuscles\(eq\)\{[^\n]*\}/,muscleFn,'detailed muscle rendering');
 const dataAnchor="window.__AXIS_OPEN_EQUIPMENT_PICKER__=(context='recording')=>";
 if(!src.includes(dataAnchor))fail('canonical picker API missing');
 const projection=`window.__AXIS_EQUIPMENT_PICKER_DATA__={version:'8.12.4',owner:'app-readonly-projection',personal:(limit=8)=>personalEqLibrary().slice(0,Math.max(1,Number(limit)||8)).map(x=>({id:x.id,name:x.name,type:x.type||eqById(x.id)?.type||'strength',uses:x.uses||0,last:x.last||0,custom:!!x.custom})),recent:(limit=6)=>{const out=[],seen=new Set();for(const e of allEvents().slice().sort((a,b)=>(b.time||0)-(a.time||0))){const id=e.equipmentId;if(!id||seen.has(id))continue;seen.add(id);const x=eqById(id);out.push({id,name:x?.name||e.name||'未命名',type:x?.type||e.kind||'strength',time:Number(e.time)||0});if(out.length>=Math.max(1,Number(limit)||6))break}return out}};try{window.__AXIS_8124_PICKER_PROJECTION__={version:'8.12.4',owner:'app-readonly-projection',selectionOwner:'app-canonical-picker',personalSource:'personalEqLibrary',recentSource:'training-history',storageWriter:false}}catch{}\n`;
 src=once(src,dataAnchor,projection+dataAnchor,'picker read-only projection');
 const openOld="window.__AXIS_OPEN_EQUIPMENT_PICKER__=(context='recording')=>{axis8123EquipmentPickerContext(context);renderEqList();openSheet('eqSheet');return true};";
 const openNew="window.__AXIS_OPEN_EQUIPMENT_PICKER__=(context='recording')=>{axis8123EquipmentPickerContext(context);const q=$('#eqSearch');if(q)q.value='';renderEqList();window.__AXIS_EQUIPMENT_SEARCH_RESET__?.();openSheet('eqSheet');window.__AXIS_EQUIPMENT_PICKER_REFRESH__?.();return true};";
 src=once(src,openOld,openNew,'picker open search lifecycle');
 src=once(src,"const context=axis8123EquipmentPickerContext();selectEq(id,manual);closeSheet('eqSheet');","const context=axis8123EquipmentPickerContext();selectEq(id,manual);window.__AXIS_EQUIPMENT_SEARCH_RESET__?.();closeSheet('eqSheet');",'picker selection search reset');
 src=once(src,"$('#eqSearch').oninput=e=>renderEqList(e.target.value);","$('#eqSearch').oninput=null;",'retire legacy per-key equipment render');
 syntax(src,FILE);write(FILE,src);
}

/* 4) One composition-aware search owner. It indexes canonical aliases + anatomy +
      equipment/type/pattern metadata, never re-renders the legacy list per keystroke,
      and adds My / Recent projections to both recording and Quick catalog contexts. */
{
 const FILE='v873-smart-input.js';let src=read(FILE);
 src=onceRe(src,/function searchText\(item\)\{[^\n]*\}/,
`const axis8124SearchCache=new WeakMap();\nfunction searchText(item){if(!item||typeof item!=='object')return[];const hit=axis8124SearchCache.get(item);if(hit)return hit;const raw=[item.name,...(item.aliases||[]),...(item.muscles||[]).flatMap(muscleTerms),...(item.detailMuscles||[]),...(item.primaryTargets||[]),...(item.secondaryTargets||[]),...(item.bodyRegions||[]),item.movementPattern,item.equipmentClass,item.type,item.subtype,item.metaText];const out=[...new Set(raw.map(norm).filter(Boolean))];axis8124SearchCache.set(item,out);return out}`,'search metadata index');
 src=onceRe(src,/function scoreItem\(item,q\)\{[^\n]*\}/,
`function scoreItem(item,q){const nq=norm(q);if(!nq)return 0;let best=0;for(const s of searchText(item)){if(s===nq)best=Math.max(best,160);else if(s.startsWith(nq))best=Math.max(best,132-Math.min(12,s.length-nq.length));else if(s.includes(nq))best=Math.max(best,108-Math.min(18,s.length-nq.length));else if(nq.includes(s)&&s.length>=2)best=Math.max(best,86);else if(latin(nq)&&latin(s)&&nq.length>=4){const d=lev(nq,s);if(d<=2)best=Math.max(best,70-d*10)}}return best}`,'accurate search scoring');
 const oldRender=(src.match(/function renderSmartSearch\(\)\{[^\n]*\}/)||[])[0];if(!oldRender)fail('smart search renderer missing');
 const searchBlock=String.raw`
function axis8124CatalogItems(){
 const byName=new Map(),add=(x,prefer=false)=>{if(!x?.name||!x?.pickId)return;const k=norm(x.name),old=byName.get(k);if(!old||prefer)byName.set(k,x)};
 for(const x of LIB)add({...x,pickId:x.baseId||x.id},!!x.baseId);
 const api=window.__AXIS_EQUIPMENT_PICKER_DATA__;for(const x of api?.personal?.(40)||[])add({...x,aliases:[],muscles:x.muscles||[],pickId:x.id,metaText:x.custom?'我的 自定义':'我的 已使用'});
 for(const b of $$('#eqList [data-eq]')){const name=b.querySelector('b')?.textContent?.trim();if(name)add({id:b.dataset.eq,pickId:b.dataset.eq,name,aliases:[],muscles:[],type:/有氧/.test(b.textContent)?'cardio':'strength',metaText:b.textContent},false)}
 return [...byName.values()]
}
function axis8124CatalogRanked(q,limit=12){return axis8124CatalogItems().map(x=>({x,score:scoreItem(x,q)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.x.name.localeCompare(b.x.name,'zh-CN')).slice(0,limit)}
function axis8124PickerStyle(){if($('#v8124PickerStyle'))return;const s=D.createElement('style');s.id='v8124PickerStyle';s.textContent='.v8124PickerContext{padding:5px 0 8px;border-bottom:1px solid var(--line2)}.v8124PickerGroup{padding:10px 0 2px}.v8124PickerHead{height:28px;display:flex;align-items:center;justify-content:space-between;color:var(--muted);font-size:12px}.v8124PickerHead b{color:var(--dim);font-size:11px;font-weight:560}.v8124PickerRail{display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;padding:2px 0 4px}.v8124PickerRail::-webkit-scrollbar{display:none}.v8124PickerRail button{flex:0 0 auto;max-width:190px;height:38px;padding:0 13px;border-radius:12px;background:var(--s2);color:var(--muted);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v8124PickerRail button:first-child{color:var(--text)}.v873SmartResults.v8124Owned{margin-top:8px}.v873SmartResults.v8124Owned .v873SmartHead{height:36px}.v873SmartResults.v8124Owned .v873SmartItem{min-height:62px}.v873SmartResults.v8124Owned .v873SmartItem small{font-size:11px;line-height:1.4}';(D.head||D.documentElement).appendChild(s)}
function axis8124RenderPickerContext(){axis8124PickerStyle();const input=$('#eqSearch');if(!input)return;let host=$('#v8124PickerContext');if(!host){host=D.createElement('div');host.id='v8124PickerContext';host.className='v8124PickerContext';input.insertAdjacentElement('afterend',host)}const api=window.__AXIS_EQUIPMENT_PICKER_DATA__,recent=api?.recent?.(6)||[],mine=api?.personal?.(8)||[],group=(title,items,kind)=>items.length?'<div class="v8124PickerGroup"><div class="v8124PickerHead"><span>'+title+'</span><b>'+items.length+'</b></div><div class="v8124PickerRail">'+items.map(x=>'<button type="button" data-v8124-pick="'+esc(x.id)+'" data-v8124-kind="'+kind+'">'+esc(x.name)+'</button>').join('')+'</div></div>':'';host.innerHTML=group('最近',recent,'recent')+group('我的',mine,'mine');host.hidden=!host.innerHTML}
function axis8124SetCatalogSearching(on){const list=$('#eqList'),guide=$('#v877EqGuide'),context=$('#v8124PickerContext');if(list)list.style.display=on?'none':'';if(guide)guide.style.display=on?'none':'';if(context)context.hidden=on||!context.innerHTML;$('#quickEq')?.classList.toggle('v873Noisy',on)}
function renderSmartSearch(){const input=$('#eqSearch'),host=$('#v873SmartResults');if(!input||!host)return;host.classList.add('v8124Owned');const q=input.value.trim();if(!q){host.classList.remove('show');host.innerHTML='';axis8124SetCatalogSearching(false);axis8124RenderPickerContext();return}axis8124SetCatalogSearching(true);const rs=axis8124CatalogRanked(q,12);host.innerHTML='<div class="v873SmartHead"><b>'+(rs.length?'准确匹配':'没有准确匹配')+'</b><span>'+rs.length+'</span></div>'+rs.map(({x})=>{const detail=(x.primaryTargets||x.detailMuscles||x.muscles||[]).slice(0,2),meta=[x.type==='cardio'?'有氧':'力量',...detail].filter(Boolean).join(' · ');return '<button class="v873SmartItem" type="button" data-v8124-pick="'+esc(x.pickId||x.id)+'"><span><b>'+esc(x.name)+'</b><small>'+esc(meta||x.movementPattern||'器械 / 运动')+'</small></span><em>›</em></button>'}).join('');host.classList.add('show')}
let axis8124SearchRAF=0,axis8124Composing=false;
function axis8124QueueSearch(){if(axis8124Composing)return;cancelAnimationFrame(axis8124SearchRAF);axis8124SearchRAF=requestAnimationFrame(renderSmartSearch)}
function axis8124ResetSearch(){const input=$('#eqSearch');if(input)input.value='';cancelAnimationFrame(axis8124SearchRAF);renderSmartSearch()}
function installSearchOwner(){const input=$('#eqSearch');if(!input||input.dataset.axis8124SearchOwner)return;input.dataset.axis8124SearchOwner='1';input.oninput=null;input.placeholder='搜索器械、运动、部位或动作';input.addEventListener('compositionstart',()=>{axis8124Composing=true});input.addEventListener('compositionend',()=>{axis8124Composing=false;axis8124QueueSearch()});input.addEventListener('input',axis8124QueueSearch);D.addEventListener('click',e=>{const pick=e.target.closest?.('[data-v8124-pick]');if(pick){e.preventDefault();e.stopPropagation();const id=pick.dataset.v8124Pick;if(window.__AXIS_PICK_EQUIPMENT__?.(id,true)!==true&&window.__AXIS_SELECT_EQUIPMENT__?.(id,true)===true)$('#eqSheet')?.classList.remove('show');axis8124ResetSearch();return}if(e.target?.closest?.('#eqSheet [data-close="eqSheet"]')||e.target===$('#eqSheet'))axis8124ResetSearch()},true);window.addEventListener('axis:equipment-selected',axis8124ResetSearch);window.__AXIS_EQUIPMENT_SEARCH_RESET__=axis8124ResetSearch;window.__AXIS_EQUIPMENT_PICKER_REFRESH__=axis8124RenderPickerContext;axis8124RenderPickerContext();try{window.__AXIS_8124_CATALOG_POLISH__={version:'8.12.4',owner:'v873-search-projection',singleSearchOwner:true,compositionAware:true,legacyPerKeyRender:false,personal:true,recent:true,canonicalSelection:true,detailMetadata:true,storageWriter:false}}catch{}}
`;
 src=src.replace(oldRender,()=>searchBlock);
 src=once(src,"$('#eqSearch')?.addEventListener('input',()=>setTimeout(renderSmartSearch,0));","installSearchOwner();",'single equipment search owner');
 syntax(src,FILE);write(FILE,src);
}

/* Build-time invariants. */
{
 const app=read('app.js'),smart=read('v873-smart-input.js'),lib=read('v873-exercise-library.js'),settings=read('v87-runtime.js');
 for(const [src,needle] of [[settings,'__AXIS_8124_SETTINGS_DETAIL_GEOMETRY__'],[lib,'__AXIS_EXERCISE_TAXONOMY__'],[app,'__AXIS_8124_PICKER_PROJECTION__'],[smart,'__AXIS_8124_CATALOG_POLISH__']])if(!src.includes(needle))fail(`missing compiled source marker ${needle}`);
 if(app.includes("$('#eqSearch').oninput=e=>renderEqList(e.target.value)"))fail('legacy per-key render survived');
 if(!settings.includes('foldHorizontalInset:0'))fail('settings fold retained nested horizontal inset');
 if(!lib.includes("axis8124Target(['adduction'],['内收肌群']"))fail('hip adduction professional target missing');
}
console.log('[AXIS 8.12.4 settings/catalog polish] PASS · Settings detail geometry unified · My/Recent picker projection · one composition-aware search owner · compatibility-safe professional anatomy');
