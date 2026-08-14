(()=>{'use strict';
const D=document,$=(s,r=D)=>r.querySelector(s),$$=(s,r=D)=>Array.from(r.querySelectorAll(s));
const VERSION='8.7.12',CORE='axis_v60_state',LIB=window.__AXIS_873_LIBRARY__||[];
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[飛鳥槓鈴舉彎臥撐繩後頭側臺階機圓強間羅亞橋髖內轉輪動單闊膕啞訓練體劃]/g,ch=>({'飛':'飞','鳥':'鸟','槓':'杠','鈴':'铃','舉':'举','彎':'弯','臥':'卧','撐':'撑','繩':'绳','後':'后','頭':'头','側':'侧','臺':'台','階':'阶','機':'机','圓':'圆','強':'强','間':'间','羅':'罗','亞':'亚','橋':'桥','髖':'髋','內':'内','轉':'转','輪':'轮','動':'动','單':'单','闊':'阔','膕':'腘','啞':'哑','訓':'训','練':'练','體':'体','劃':'划'}[ch]||ch)).replace(/[\s\-_/·.,，。()（）[\]【】:+]+/g,'');
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let detailPress=new WeakMap(),customBefore=new Set(),plan=null;

function style(){
 if($('#v8712Style'))return;
 const s=D.createElement('style');s.id='v8712Style';s.textContent=`
:root{--axis-rule:rgba(255,255,255,.072)}
#settingsSheet .sheet>:is(.settingsList,.v8711SettingGate,#reportBtn),
#customEqSheet .v874ClassBlock,
#v874PlanSheet .v8712PlanSection,
#profileSheet .sectionLabel,
#watermarkSheet .v85Block{border-top-color:var(--axis-rule)!important}
#settingsSheet .settingsList{border-top:0!important}
#settingsSheet .sheet>.settingsList:first-of-type{border-top:1px solid var(--axis-rule)!important}
#settingsSheet :is(.settingLink,.settingPlain,.v8711Wake){border-bottom-color:var(--axis-rule)!important}
#settingsSheet .v8711SettingGate{margin-top:0!important;border-top:1px solid var(--axis-rule)!important}
#settingsSheet #reportBtn.v8711ReportEntry{margin-top:0!important;border-top:1px solid var(--axis-rule)!important;border-bottom:1px solid var(--axis-rule)!important}
#customEqSheet .v874ClassBlock{border-top:1px solid var(--axis-rule)!important}
#customEqSheet .v874Details{position:relative;z-index:3;pointer-events:auto!important}
#customEqSheet .v874Details button{pointer-events:auto!important;touch-action:manipulation!important;position:relative;z-index:4}
#customEqSheet .v874Regions{position:relative;z-index:3}
#customEqSheet .v874Regions button{pointer-events:auto!important;touch-action:manipulation!important}
.v8710Cards.v8712Cards button{min-height:76px;padding:14px 15px}
.v8710Cards.v8712Cards b{font-weight:680}
.v8712PlanBody{padding-bottom:calc(16px + env(safe-area-inset-bottom))}
.v8712PlanBase{min-height:72px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;border-top:1px solid var(--axis-rule);border-bottom:1px solid var(--axis-rule)}
.v8712PlanBase span,.v8712PlanHead span{font-size:15px;color:var(--muted)}
.v8712PlanBase b{font-size:22px;font-weight:680;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.v8712PlanBase small{display:block;margin-top:5px;font-size:15px;color:var(--dim);font-weight:500;text-align:right}
.v8712PlanSection{padding:18px 0;border-top:1px solid var(--axis-rule)}
.v8712PlanSection:first-of-type{border-top:0}
.v8712PlanHead{display:flex;align-items:center;justify-content:space-between;min-height:26px;margin-bottom:10px}
.v8712PlanHead b{font-size:15px;color:var(--dim);font-weight:560}
.v8712Count{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
.v8712Count button{height:48px;border-radius:14px;background:var(--s2);color:var(--muted);font-size:15px;font-variant-numeric:tabular-nums}
.v8712Count button.active{background:var(--text);color:#111318;font-weight:720}
.v8712Modes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.v8712Modes button{min-height:58px;padding:10px 12px;border-radius:14px;background:var(--s2);color:var(--muted);text-align:left}
.v8712Modes button b,.v8712Modes button span{display:block;font-size:15px;line-height:1.25}
.v8712Modes button b{color:inherit;font-weight:670}.v8712Modes button span{margin-top:5px;color:var(--dim)}
.v8712Modes button.active{background:#2b2f3a;color:var(--text);box-shadow:inset 0 0 0 1px rgba(174,179,255,.13)}
.v8712Modes button:last-child{grid-column:1/-1}
.v8712Param{margin-top:14px}.v8712Param:first-child{margin-top:0}
.v8712ParamHead{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.v8712ParamHead span,.v8712ParamHead b{font-size:15px}.v8712ParamHead span{color:var(--muted)}.v8712ParamHead b{color:var(--text);font-weight:630}
.v8712Chips{display:flex;gap:8px;overflow:auto;scrollbar-width:none}.v8712Chips::-webkit-scrollbar{display:none}
.v8712Chips button{flex:0 0 auto;min-width:68px;height:42px;padding:0 13px;border-radius:13px;background:var(--s2);color:var(--muted);font-size:15px;font-variant-numeric:tabular-nums}
.v8712Chips button.active{background:rgba(115,124,255,.15);color:#c7caff;box-shadow:inset 0 0 0 1px rgba(174,179,255,.12)}
.v8712Preview{border-top:1px solid var(--axis-rule)}
.v8712PreviewRow{height:48px;display:grid;grid-template-columns:44px 1fr 1fr;align-items:center;border-bottom:1px solid var(--axis-rule)}
.v8712PreviewRow i,.v8712PreviewRow b,.v8712PreviewRow span{font-size:15px;line-height:1;font-style:normal;font-variant-numeric:tabular-nums}
.v8712PreviewRow i{color:var(--dim)}.v8712PreviewRow b{color:var(--text);font-weight:650;text-align:center}.v8712PreviewRow span{color:var(--muted);text-align:right}
.v8712Apply{width:100%;height:60px;margin-top:18px;border-radius:18px;background:var(--text);color:#101216;font-size:15px;font-weight:730}
@media(max-width:390px){.v8712Modes{gap:7px}.v8712Count{gap:7px}.v8712PlanBase{min-height:68px}}
`;
 (D.head||D.documentElement).appendChild(s);
}

const CAT_RULES={
 '胸':[['推胸','胸推','chestpress'],['卧推','benchpress'],['蝴蝶机夹胸','pecdeck'],['绳索夹胸','cablefly'],['俯卧撑','pushup'],['双杠','dip'],['上斜卧推','incline'],['下斜卧推','decline']],
 '背':[['高位下拉','latpulldown'],['坐姿划船','seatedrow'],['引体向上','pullup'],['胸托划船','chestsupportedrow'],['T杠划船','tbarrow'],['单臂哑铃划船','onearmdumbbellrow'],['直臂下拉','straightarmpulldown'],['硬拉','deadlift']],
 '肩':[['肩推','shoulderpress'],['侧平举','lateralraise'],['反向飞鸟','reversedelt'],['面拉','facepull'],['前平举','frontraise'],['耸肩','shrug']],
 '手臂':[['哑铃弯举','dumbbellcurl'],['牧师凳弯举','preachercurl'],['绳索弯举','cablecurl'],['绳索下压','pushdown'],['过顶臂屈伸','overheadtriceps'],['双杠臂屈伸','dip']],
 '臀腿':[['深蹲','squat'],['腿举','legpress'],['哈克深蹲','hacksquat'],['腿屈伸','legextension'],['腿弯举','legcurl'],['罗马尼亚硬拉','rdl'],['臀推','hipthrust'],['髋外展','hipabductor'],['提踵','calfraise']],
 '核心':[['卷腹','crunch'],['平板支撑','plank'],['悬垂举腿','legraise'],['健腹轮','abwheel'],['Pallof','pallof'],['俄罗斯转体','russiantwist']],
 '心肺':[['跑步机','treadmill'],['椭圆机','elliptical'],['动感单车','spinbike'],['划船机','rower'],['登阶机','stair'],['滑雪机','skierg'],['跳绳','jumprope'],['游泳','swim']],
 '全身':[['壶铃摆动','kettlebellswing'],['农夫行走','farmer'],['雪橇推','sledpush'],['战绳','battlerope'],['波比跳','burpee'],['TRX','trx']]
};
function catOf(x){
 const n=norm([x.name,...(x.aliases||[])].join(' ')),m=x.muscles||[];
 if(x.type==='cardio')return'心肺';
 if(m.includes('核心')||/腹|plank|core|pallof|wheel/.test(n))return'核心';
 if(m.includes('股四头肌')||m.includes('腘绳肌')||m.includes('臀部')||m.includes('小腿'))return'臀腿';
 if(m.includes('肱二头肌')||m.includes('肱三头肌')||m.includes('前臂'))return'手臂';
 if(m.includes('肩部')&&!m.includes('胸肌'))return'肩';
 if(m.includes('背部'))return'背';
 if(m.includes('胸肌'))return'胸';
 return'全身';
}
function textOf(x){return [x.name,...(x.aliases||[])].map(norm).join('|')}
function findTerm(group,used){
 for(const t of group){
  const nt=norm(t);
  let best=LIB.find(x=>!used.has(x.id)&&textOf(x).split('|').some(s=>s===nt||s.includes(nt)||nt.includes(s)));
  if(best)return best;
 }
 return null;
}
function prioritized(cat){
 const used=new Set(),out=[];
 for(const g of CAT_RULES[cat]||[]){
  const x=findTerm(g,used);if(x){out.push(x);used.add(x.id)}
 }
 for(const x of LIB){if(out.length>=10)break;if(!used.has(x.id)&&catOf(x)===cat){out.push(x);used.add(x.id)}}
 return out;
}
function card(x){return`<button data-v877-lib="${esc(x.id)}"><b>${esc(x.name)}</b><small>${x.type==='cardio'?'心肺 · 耐力':((x.muscles||[]).slice(0,2).join(' · ')||'力量训练')}</small></button>`}
function polishCategory(){
 const q=$('#eqSearch')?.value.trim();if(q)return;
 const active=$('#v8710Cats [data-v8710-cat].active');if(!active)return;
 const cat=active.dataset.v8710Cat||active.textContent.trim(),host=$('#v8710Cards'),more=$('#v8710More');if(!host)return;
 const arr=prioritized(cat);host.classList.add('v8712Cards');host.innerHTML=arr.map(card).join('');
 if(more){const total=LIB.filter(x=>catOf(x)===cat).length;more.style.display=total>arr.length?'block':'none';more.textContent=`查看全部 ${total}`}
}

const DETAIL_CORE={
 '胸部整体':'胸肌','胸大肌上部':'胸肌','胸大肌中部':'胸肌','胸大肌下部':'胸肌','胸小肌':'胸肌',
 '背部整体':'背部','背阔肌':'背部','斜方肌上束':'背部','斜方肌中下束':'背部','菱形肌':'背部','竖脊肌':'背部',
 '肩部整体':'肩部','三角肌前束':'肩部','三角肌中束':'肩部','三角肌后束':'肩部','肩袖':'肩部',
 '手臂整体':'肱二头肌','肱二头肌':'肱二头肌','肱肌':'肱二头肌','肱三头肌':'肱三头肌','前臂屈肌群':'前臂','前臂伸肌群':'前臂',
 '核心整体':'核心','腹直肌':'核心','腹外斜肌':'核心','腹内斜肌':'核心','腹横肌':'核心','多裂肌':'核心',
 '臀腿整体':'臀部','臀大肌':'臀部','臀中肌 / 臀小肌':'臀部','股四头肌':'股四头肌','腘绳肌':'腘绳肌','内收肌群':'内收肌','髋屈肌群':'髋屈肌','腓肠肌':'小腿','比目鱼肌':'小腿','胫骨前肌':'胫骨前肌',
 '心肺':'心肺','全身耐力':'心肺','下肢耐力':'心肺','上肢耐力':'心肺'
};
function syncHiddenFromDetails(){
 const host=$('#customMuscles');if(!host)return;
 const cores=new Set($$('#v874Details [data-v874-detail].active').map(b=>DETAIL_CORE[b.dataset.v874Detail]).filter(Boolean));
 for(const core of cores){
  let b=$$('[data-muscle]',host).find(x=>x.dataset.muscle===core);
  if(!b){b=D.createElement('button');b.dataset.muscle=core;b.textContent=core;host.appendChild(b)}
 }
 for(const b of $$('[data-muscle]',host))b.classList.toggle('active',cores.has(b.dataset.muscle));
 const sum=$('#v874MuscleSummary');if(sum){const xs=$$('#v874Details [data-v874-detail].active').map(b=>b.dataset.v874Detail);sum.textContent=xs.length?xs.slice(0,4).join(' · ')+(xs.length>4?` +${xs.length-4}`:''):'请选择'}
 const mode=$('#v874MuscleMode');if(mode)mode.textContent='已调整';
}
function rememberCustomStart(){try{const c=JSON.parse(localStorage.getItem(CORE)||'{}');customBefore=new Set((c.profile?.customEq||[]).map(x=>x.id))}catch{customBefore=new Set()}}
function patchCustomAfterSave(){
 const details=$$('#v874Details [data-v874-detail].active').map(b=>b.dataset.v874Detail);if(!details.length)return;
 setTimeout(()=>{try{
  const c=JSON.parse(localStorage.getItem(CORE)||'{}');c.profile=c.profile||{};c.profile.customEq=c.profile.customEq||[];
  const name=$('#customName')?.value.trim();let t=c.profile.customEq.find(x=>!customBefore.has(x.id))||c.profile.customEq.find(x=>x.name===name);if(!t)return;
  const cores=[...new Set(details.map(x=>DETAIL_CORE[x]).filter(Boolean))];t.detailMuscles=details;t.muscles=cores;t.effect=details.slice(0,3).join(' · ');localStorage.setItem(CORE,JSON.stringify(c));
 }catch{}},120);
}

function rows(){return $$('#v8SetEditor .v8SetRow')}
function rowValues(){return rows().map(row=>{const a=$$('span>b',row).map(x=>Number(x.textContent));return{w:Number(a[0])||0,r:Number(a[1])||0}})}
function smartWeightStep(w){if(w<10)return.5;if(w<30)return 1;if(w<100)return 2.5;if(w<200)return 5;return 10}
function stepOptions(base){
 const s=smartWeightStep(base),raw=[s/2,s,s*2].map(x=>Math.max(.5,Math.round(x*2)/2));
 return [...new Set(raw)].slice(0,3);
}
function repStepDefault(r){return r<=6?1:r<=12?2:3}
function planRows(){
 if(!plan)return[];const out=[],floor=Math.max(3,Math.ceil(plan.baseR*.5));
 for(let i=0;i<plan.count;i++){
  let w=plan.baseW,r=plan.baseR,d=i;
  if(plan.mode==='up')w=plan.baseW+d*plan.wStep;
  else if(plan.mode==='down')w=Math.max(0,plan.baseW-d*plan.wStep);
  else if(plan.mode==='uprep'){w=plan.baseW+d*plan.wStep;r=Math.max(floor,plan.baseR-d*plan.rStep)}
  else if(plan.mode==='pyramid'){d=Math.min(i,plan.count-1-i);w=plan.baseW+d*plan.wStep;r=Math.max(floor,plan.baseR-d*plan.rStep)}
  out.push({w:Math.round(w*100)/100,r:Math.round(r)});
 }
 return out;
}
function planDesc(){
 if(!plan)return'';
 if(plan.mode==='same')return'重量与次数保持一致';
 if(plan.mode==='up')return`每组 +${plan.wStep}kg`;
 if(plan.mode==='down')return`每组 −${plan.wStep}kg`;
 if(plan.mode==='uprep')return`每组 +${plan.wStep}kg / −${plan.rStep}次`;
 return`中段加重 · ${plan.wStep}kg / ${plan.rStep}次`;
}
function paramHtml(){
 if(!plan||plan.mode==='same')return'';
 const w=stepOptions(plan.baseW);
 let h=`<div class="v8712Param"><div class="v8712ParamHead"><span>重量步进</span><b>${plan.wStep} kg</b></div><div class="v8712Chips">${w.map(x=>`<button data-v8712-wstep="${x}" class="${x===plan.wStep?'active':''}">${x} kg</button>`).join('')}</div></div>`;
 if(plan.mode==='uprep'||plan.mode==='pyramid')h+=`<div class="v8712Param"><div class="v8712ParamHead"><span>次数变化</span><b>每组 −${plan.rStep}</b></div><div class="v8712Chips">${[1,2,3].map(x=>`<button data-v8712-rstep="${x}" class="${x===plan.rStep?'active':''}">−${x} 次</button>`).join('')}</div></div>`;
 return h;
}
function renderPlan(){
 const body=$('#v8712PlanBody');if(!body||!plan)return;
 const modes=[
  ['same','相同','完全沿用第一组'],['up','重量递增','次数保持'],['uprep','增重降次','保留最低次数'],
  ['down','重量递减','次数保持'],['pyramid','金字塔','中段达到峰值']
 ];
 const pr=planRows();
 body.innerHTML=`<div class="v8712PlanBase"><span>第一组</span><div><b>${plan.baseW}kg × ${plan.baseR}次</b><small>所有变化以此为基准</small></div></div>
 <section class="v8712PlanSection"><div class="v8712PlanHead"><span>组数</span><b>${plan.count}组</b></div><div class="v8712Count">${Array.from({length:10},(_,i)=>i+1).map(x=>`<button data-v8712-count="${x}" class="${x===plan.count?'active':''}">${x}</button>`).join('')}</div></section>
 <section class="v8712PlanSection"><div class="v8712PlanHead"><span>变化方式</span><b>${esc(planDesc())}</b></div><div class="v8712Modes">${modes.map(x=>`<button data-v8712-mode="${x[0]}" class="${x[0]===plan.mode?'active':''}"><b>${x[1]}</b><span>${x[2]}</span></button>`).join('')}</div>${paramHtml()}</section>
 <section class="v8712PlanSection"><div class="v8712PlanHead"><span>预览</span><b>${pr.length}组</b></div><div class="v8712Preview">${pr.map((x,i)=>`<div class="v8712PreviewRow"><i>${String(i+1).padStart(2,'0')}</i><b>${x.w} kg</b><span>${x.r} 次</span></div>`).join('')}</div></section>
 <button class="v8712Apply" id="v8712Apply">应用计划</button>`;
}
function upgradePlan(){
 const sheet=$('#v874PlanSheet .sheet');if(!sheet||!$('#v874PlanSheet')?.classList.contains('show'))return;
 const vals=rowValues(),base=vals[0]||{w:20,r:10},n=Math.max(1,vals.length||1);
 plan={count:n,mode:'same',baseW:base.w||20,baseR:clamp(base.r||10,1,300),wStep:smartWeightStep(base.w||20),rStep:repStepDefault(base.r||10)};
 for(const el of Array.from(sheet.children)){if(!el.classList.contains('grabber')&&!el.classList.contains('sheetHead'))el.remove()}
 const body=D.createElement('div');body.id='v8712PlanBody';body.className='v8712PlanBody';sheet.appendChild(body);renderPlan();
}
async function setCount(n){
 n=clamp(n,1,10);for(let guard=0;guard<20;guard++){const cur=rows().length;if(cur===n)return;const b=$(`#v8SetEditor [data-v8setcount="${cur<n?1:-1}"]`);if(!b)return;b.click();await wait(22)}
}
async function setRow(i,w,r){
 let row=rows()[i];if(!row)return;row.click();await wait(8);let host=$('#v8SetEditor');if(!host)return;
 let b=D.createElement('button');b.style.display='none';b.dataset.v8weight=String(w);host.appendChild(b);b.click();await wait(9);
 host=$('#v8SetEditor');b=D.createElement('button');b.style.display='none';b.dataset.v8reps=String(r);host.appendChild(b);b.click();await wait(9);
}
async function applyPlan(){
 if(!plan)return;const values=planRows();await setCount(plan.count);for(let i=0;i<values.length;i++)await setRow(i,values[i].w,values[i].r);
 $('#v874PlanSheet')?.classList.remove('show');try{navigator.vibrate?.(12)}catch{}
}

function bind(){
 style();
 D.addEventListener('pointerdown',e=>{const b=e.target.closest('#v874Details [data-v874-detail]');if(b)detailPress.set(b,b.classList.contains('active'))},true);
 D.addEventListener('click',e=>{
  const cat=e.target.closest('#v8710Cats [data-v8710-cat]');if(cat){setTimeout(polishCategory,0);return}
  if(e.target.closest('#equipmentRow')){setTimeout(polishCategory,140);return}
  if(e.target.closest('#addCustomEq,#newCustomEq,#v8New')){rememberCustomStart();setTimeout(()=>{style();$('#v874Details')?.style.setProperty('pointer-events','auto','important')},80);return}
  const det=e.target.closest('#v874Details [data-v874-detail]');if(det){const before=detailPress.get(det);if(typeof before==='boolean')det.classList.toggle('active',!before);syncHiddenFromDetails();return}
  if(e.target.closest('#saveCustomEq')){syncHiddenFromDetails();patchCustomAfterSave();return}
  if(e.target.closest('[data-v874-plan]')){setTimeout(upgradePlan,0);return}
  const c=e.target.closest('[data-v8712-count]');if(c&&plan){plan.count=Number(c.dataset.v8712Count)||1;renderPlan();return}
  const m=e.target.closest('[data-v8712-mode]');if(m&&plan){plan.mode=m.dataset.v8712Mode;plan.rStep=repStepDefault(plan.baseR);renderPlan();return}
  const ws=e.target.closest('[data-v8712-wstep]');if(ws&&plan){plan.wStep=Number(ws.dataset.v8712Wstep)||plan.wStep;renderPlan();return}
  const rs=e.target.closest('[data-v8712-rstep]');if(rs&&plan){plan.rStep=Number(rs.dataset.v8712Rstep)||plan.rStep;renderPlan();return}
  if(e.target.closest('#v8712Apply')){applyPlan();return}
 },false);
 D.addEventListener('input',e=>{if(e.target.id==='eqSearch'&&!e.target.value.trim())setTimeout(polishCategory,0)},false);
 window.addEventListener('pageshow',()=>setTimeout(()=>{style();polishCategory()},120));
 const v=$('.versionLine');if(v){v.textContent=`版本 ${VERSION}`;v.dataset.axisVersion=VERSION}
 window.__AXIS_VERSION__=window.__AXIS_RELEASE__||VERSION;
 window.__AXIS_8712_READY__=true;
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',()=>setTimeout(bind,0),{once:true});else setTimeout(bind,0);
})();
