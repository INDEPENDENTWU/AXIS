import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Active Home stage] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
function functionRange(src,signature,label){
 const start=src.indexOf(signature);if(start<0)fail(`${label} signature missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} brace missing`);let depth=0,quote='',escaped=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++;}continue}
  if(quote){if(escaped){escaped=false;continue}if(ch==='\\'){escaped=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'){depth--;if(depth===0){end=i+1;break}}
 }
 if(end<0)fail(`${label} closing brace missing`);return{start,end,text:src.slice(start,end)};
}
function replaceFunction(src,signature,replacement,label){const r=functionRange(src,signature,label);return src.slice(0,r.start)+replacement+src.slice(r.end)}
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};

/*
 * Ordinary Active becomes one integrated, large-format Home execution stage.
 * v87 remains authoritative for pause/resume, complete-set, add-set and hold-
 * to-finish. This pass changes presentation hierarchy and bounded motion only.
 */
{
 const FILE='v87-runtime.js';let s=read(FILE);
 const ensureSig='function ensureUI()';
 const styleBlock=`
function axis821ActiveStageStyle(){if($('#axis821ActiveStageStyle'))return;const st=D.createElement('style');st.id='axis821ActiveStageStyle';st.textContent=\`
.v87Now.axis821ActiveStage{display:none;position:relative;left:auto;bottom:auto;transform:none;width:100%;max-width:none;z-index:auto;min-height:338px;margin:2px 0 22px;border-radius:30px;padding:0;overflow:hidden;background:linear-gradient(180deg,rgba(20,23,31,.985),rgba(11,14,19,.99));box-shadow:inset 0 0 0 1px rgba(255,255,255,.065),0 22px 54px rgba(0,0,0,.22);backdrop-filter:none;-webkit-backdrop-filter:none;isolation:isolate}
.v87Now.axis821ActiveStage:before{content:'';position:absolute;inset:-35% -20% auto;height:220px;z-index:-1;background:radial-gradient(ellipse at 50% 0,rgba(115,124,255,.16),rgba(115,124,255,0) 68%);opacity:.9;transition:opacity .42s ease,transform .42s cubic-bezier(.2,.8,.2,1)}
.v87Now.axis821ActiveStage.show{display:block;animation:axis821StageIn .42s cubic-bezier(.2,.8,.2,1) both}
.v87Now.axis821ActiveStage[data-status="paused"]:before{opacity:.28;transform:translateY(-10px)}
.v87Now.axis821ActiveStage .v87Axis{height:2px;background:rgba(255,255,255,.05)}
.v87Now.axis821ActiveStage .v87Axis i{background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .55s cubic-bezier(.2,.8,.2,1)}
.axis821StageHeader{min-height:60px;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 18px 0}
.axis821StageStatus{display:flex;align-items:center;gap:8px;min-width:0}.axis821StageStatus i{width:7px;height:7px;border-radius:50%;background:var(--accent2);box-shadow:0 0 0 6px rgba(115,124,255,.09);transition:.28s ease}.axis821StageStatus .v87State{font-size:11px;color:var(--muted);font-weight:670;letter-spacing:.02em}
.v87Now.axis821ActiveStage[data-status="paused"] .axis821StageStatus i{background:var(--dim);box-shadow:none}
.axis821StageFinish{position:relative;height:38px;min-width:92px;padding:0 12px;border:0;border-radius:13px;background:rgba(255,255,255,.045);color:var(--muted);font-size:10.5px;font-weight:620;display:flex;align-items:center;justify-content:center;gap:7px;touch-action:none;overflow:hidden}
.axis821StageFinish:before{content:'';position:absolute;inset:1px;border-radius:12px;background:conic-gradient(var(--accent) var(--p,0deg),rgba(255,255,255,.045) 0);-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 1.5px),#000 0);mask:radial-gradient(farthest-side,transparent calc(100% - 1.5px),#000 0)}
.axis821StageFinish span,.axis821StageFinish i{position:relative;z-index:1}.axis821StageFinish i{width:7px;height:7px;border:1px solid currentColor;border-radius:2px;opacity:.55}
.axis821StageCore{display:flex;min-height:184px;flex-direction:column;align-items:center;justify-content:center;padding:13px 18px 18px;text-align:center}
.v87Now.axis821ActiveStage .v87Name{max-width:100%;margin:0;color:var(--text);font-size:20px;font-weight:680;letter-spacing:-.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.axis821StageClock{margin-top:14px;font-size:clamp(54px,15vw,76px);line-height:.92;font-weight:590;letter-spacing:-.06em;font-variant-numeric:tabular-nums;color:var(--text);text-shadow:0 0 34px rgba(115,124,255,.08);transition:opacity .25s ease,transform .3s cubic-bezier(.2,.8,.2,1)}
.v87Now.axis821ActiveStage .v87Meta{margin-top:13px!important;color:var(--dim)!important;font-size:11px!important;line-height:1.4;font-variant-numeric:tabular-nums}
.axis821StageFact{width:min(100%,430px);display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:17px;padding-top:12px;border-top:1px solid rgba(255,255,255,.055);font-size:10.5px;color:var(--dim);font-variant-numeric:tabular-nums}.axis821StageFact span:last-child{text-align:right}
.axis821StageControls{display:grid;grid-template-columns:1fr 1.35fr;gap:9px;padding:0 18px 17px}.axis821StageControls>button{height:60px;border:0;border-radius:18px;transition:transform .13s ease,background .24s ease,color .24s ease,box-shadow .24s ease}.axis821StageControls>button:active{transform:scale(.985)}
.v87Now.axis821ActiveStage .v87Tool{width:auto;height:60px;border-radius:18px;background:rgba(255,255,255,.055);color:var(--text);display:flex;align-items:center;justify-content:center;gap:10px;font-size:13px;font-weight:660}.axis821StageToggleGlyph{display:inline-flex;width:18px;height:18px;align-items:center;justify-content:center;color:var(--muted);font-size:13px}.axis821StageToggleLabel{font-size:13px}
.v87Now.axis821ActiveStage .v87Primary{height:60px;padding:0 18px;border-radius:18px;background:linear-gradient(180deg,rgba(126,135,255,.96),rgba(105,115,242,.94));color:#fff;font-size:14px;font-weight:720;box-shadow:0 12px 30px rgba(90,100,235,.18)}.v87Now.axis821ActiveStage .v87Primary.plan{background:rgba(255,255,255,.055);box-shadow:none;color:var(--muted)}
.v87Now.axis821ActiveStage .v87Add{height:60px;padding:0 18px;border-radius:18px;background:rgba(115,124,255,.12);color:var(--accent2);font-size:13px;font-weight:680}.v87Now.axis821ActiveStage[data-primary="none"] .axis821StageControls{grid-template-columns:1fr}.v87Now.axis821ActiveStage[data-primary="none"] #v87Toggle{width:100%}
.v87Now.axis821ActiveStage .v87Rest{display:block;min-height:22px;padding:0 18px 12px;text-align:center;color:var(--dim);font-size:10.5px;line-height:1.4}.v87Now.axis821ActiveStage .v87Paused{display:flex;gap:7px;overflow-x:auto;padding:0 18px 17px;scrollbar-width:none}.v87Now.axis821ActiveStage .v87Paused:empty{display:none}.v87Now.axis821ActiveStage .v87Paused button{height:34px;max-width:220px;padding:0 12px;border:0;border-radius:12px;background:rgba(255,255,255,.045);color:var(--muted);font-size:10.5px}.v87Now.axis821ActiveStage .v87Paused button:before{content:'↩';margin-right:6px;color:var(--accent2)}
.v87Now.axis821ActiveStage.axis821-set-bump .axis821StageClock{animation:axis821SetBump .42s cubic-bezier(.2,.8,.2,1)}.v87Now.axis821ActiveStage.axis821-state-shift .axis821StageCore{animation:axis821StateShift .34s cubic-bezier(.2,.8,.2,1)}
body.v87-now .app{padding-bottom:inherit!important}
@keyframes axis821StageIn{from{opacity:0;transform:translateY(10px) scale(.992)}to{opacity:1;transform:none}}@keyframes axis821SetBump{0%{transform:scale(1);opacity:1}42%{transform:scale(1.035);opacity:.9}100%{transform:scale(1);opacity:1}}@keyframes axis821StateShift{0%{opacity:.72;transform:translateY(4px)}100%{opacity:1;transform:none}}
@media(max-width:420px){.v87Now.axis821ActiveStage{min-height:322px;border-radius:26px;margin-bottom:18px}.axis821StageHeader,.axis821StageCore,.axis821StageControls{padding-left:15px;padding-right:15px}.axis821StageControls>button{height:58px}.v87Now.axis821ActiveStage .v87Rest,.v87Now.axis821ActiveStage .v87Paused{padding-left:15px;padding-right:15px}.axis821StageClock{font-size:clamp(52px,16vw,68px)}}
@media(prefers-reduced-motion:reduce){.v87Now.axis821ActiveStage.show,.v87Now.axis821ActiveStage.axis821-set-bump .axis821StageClock,.v87Now.axis821ActiveStage.axis821-state-shift .axis821StageCore{animation:none!important}.v87Now.axis821ActiveStage *,.v87Now.axis821ActiveStage:before{transition-duration:.01ms!important}}
\`; (D.head||D.documentElement).appendChild(st)}
`;
 if(s.includes('function axis821ActiveStageStyle()'))fail('stage style duplicated');
 s=s.replace(ensureSig,styleBlock+ensureSig);
 s=replaceFunction(s,ensureSig,`function ensureUI(){if($('#v87Now'))return;D.body.insertAdjacentHTML('beforeend','<section class="v87Now axis821ActiveStage" id="v87Now"><div class="v87Axis"><i id="v87AxisFill"></i></div><div class="axis821StageHeader"><div class="axis821StageStatus"><i></i><span class="v87State" id="v87State"></span></div><button class="axis821StageFinish v87Finish" id="v87Finish"><span>按住结束</span><i></i></button></div><div class="axis821StageCore"><b class="v87Name" id="v87Name"></b><div class="axis821StageClock" id="axis821StageClock">00:00</div><small class="v87Meta" id="v87Meta"></small><div class="axis821StageFact"><span id="axis821StageProgressText"></span><span id="axis821StageRest"></span></div></div><div class="axis821StageControls"><button class="v87Tool" id="v87Toggle"><i class="axis821StageToggleGlyph" id="axis821StageToggleGlyph">Ⅱ</i><span class="axis821StageToggleLabel" id="axis821StageToggleLabel">暂停</span></button><button class="v87Primary" id="v87Primary"></button><button class="v87Add" id="v87Add">＋ 一组</button></div><span class="v87Rest" id="v87Rest"></span><div class="v87Paused" id="v87Paused"></div></section><div class="v87Hold" id="v87Hold"><div class="v87HoldCore"><div class="v87Ring" id="v87Ring"><i></i></div><b>完成项目</b><small>继续按住 · 松开取消</small></div><i class="v87HoldAxis" id="v87HoldAxis"></i></div><div class="v87Flash" id="v87Flash"></div><div class="v87Undo" id="v87Undo"><span id="v87UndoText"></span><button id="v87UndoBtn">撤销</button></div>')}`,'integrated Active Home markup');
 s=replaceFunction(s,'function renderNow(force=false)',`function renderNow(force=false){ensureUI();axis821ActiveStageStyle();if(hold&&!force)return;reconcile();const host=$('#v87Now'),cur=activePair(),paused=pausedPairs(),target=cur||paused[0],today=$('#todayView')?.classList.contains('active'),activeHome=$('#activeHome'),sheet=$$('.sheetWrap.show').some(x=>x.id!=='finishSheet');if(!target||!today||!activeHome||sheet){host.classList.remove('show','axis821-set-bump','axis821-state-shift');D.body.classList.remove('v87-now','axis821-active-stage-now');return}if(host.parentElement!==activeHome)activeHome.insertBefore(host,activeHome.firstChild);const {e,a}=target,m=readMeta(),actual=elapsed(a),est=Math.max(60000,Number(a.estimateMs)||actual||60000),pct=Math.min(100,actual/est*100),total=planned(e,m),done=Math.max(0,Number(a.completedSets)||0),planDone=isPlanComplete(e,a,m),tracked=(a.setDoneAt||[]).some(Boolean),rest=a.restStartedAt&&a.status==='active'?now()-a.restStartedAt:0,status=planDone?'plan-complete':a.status==='active'?'active':'paused',prevStatus=host.dataset.status||'',prevDone=Number(host.dataset.done||0);host.dataset.status=status;host.dataset.kind=e.kind||'';host.dataset.done=String(done);$('#v87State').textContent=planDone?'计划完成':a.status==='active'?'正在进行':'已暂停';$('#v87Name').textContent=e.name||'项目';$('#axis821StageClock').textContent=clock(actual);$('#v87Meta').textContent='预计 '+clock(est)+(e.kind==='strength'?' · '+(tracked?(done+'/'+total+' 组'):('计划 '+total+' 组')):'');$('#v87AxisFill').style.width=pct+'%';$('#axis821StageProgressText').textContent=e.kind==='strength'?(planDone?('已完成 '+done+'/'+total+' 组'):(tracked?('第 '+Math.min(done+1,total)+' / '+total+' 组'):('共 '+total+' 组'))):('预计进度 '+Math.round(pct)+'%');$('#axis821StageRest').textContent=rest?('休息 '+clock(rest)):a.status==='paused'?'计时暂停':planDone?'计划完成':' ';$('#axis821StageToggleGlyph').textContent=a.status==='active'?'Ⅱ':'▶';$('#axis821StageToggleLabel').textContent=a.status==='active'?'暂停':'继续';$('#v87Toggle').dataset.id=e.id;$('#v87Finish').dataset.id=e.id;const pri=$('#v87Primary'),add=$('#v87Add');if(e.kind==='strength'&&a.status==='active'){host.dataset.primary='set';pri.style.display='block';if(planDone){pri.textContent='计划已完成';pri.classList.add('plan');pri.disabled=true;add.style.display='block';add.dataset.id=e.id}else{pri.textContent='完成一组';pri.classList.remove('plan');pri.disabled=false;pri.dataset.id=e.id;add.style.display='none'}}else{host.dataset.primary='none';pri.style.display='none';add.style.display='none'}$('#v87Rest').textContent=rest?'组间休息中':a.status==='paused'?'暂停期间不累计实际时间':planDone?'可加一组，或按住右上角结束项目':' ';const keys=paused.filter(x=>x.e.id!==e.id).slice(0,3),ph=$('#v87Paused'),sig=keys.map(x=>x.e.id).join('|');if(ph.dataset.sig!==sig){ph.dataset.sig=sig;ph.innerHTML=keys.map(x=>'<button data-id="'+esc(x.e.id)+'">'+esc(x.e.name)+' · '+clock(elapsed(x.a))+'</button>').join('')}if(done>prevDone){host.classList.remove('axis821-set-bump');void host.offsetWidth;host.classList.add('axis821-set-bump');clearTimeout(host._axis821SetTimer);host._axis821SetTimer=setTimeout(()=>host.classList.remove('axis821-set-bump'),460)}if(prevStatus&&prevStatus!==status){host.classList.remove('axis821-state-shift');void host.offsetWidth;host.classList.add('axis821-state-shift');clearTimeout(host._axis821StateTimer);host._axis821StateTimer=setTimeout(()=>host.classList.remove('axis821-state-shift'),380)}host.classList.add('show');D.body.classList.remove('v87-now');D.body.classList.add('axis821-active-stage-now')}`,'integrated Active Home render');
 const bootSig='function boot()',boot=functionRange(s,bootSig,'boot').text;
 if(!boot.includes('injectStyle();ensureUI();'))fail('boot setup anchor missing');
 s=s.replace(boot,boot.replace('injectStyle();ensureUI();','injectStyle();axis821ActiveStageStyle();ensureUI();'));
 const end=s.lastIndexOf('})();');if(end<0)fail('v87 IIFE end missing');
 const marker=`\nwindow.__AXIS_821_ACTIVE_HOME_STAGE__={version:'8.21',presentation:'integrated-home-stage',actionOwner:'v87',truthOwner:'axis_v8_meta',largePauseResume:true,largeCompleteSet:true,holdFinish:true,reducedMotion:true,newStorage:false,newRecorder:false,newEncounterWriter:false,newActiveOwner:false};\n`;
 if(s.includes('__AXIS_821_ACTIVE_HOME_STAGE__'))fail('capability marker duplicated');
 s=s.slice(0,end)+marker+s.slice(end);
 syntax(s,FILE);write(FILE,s);
}

console.log('[AXIS 8.21 Active Home stage] PASS · ordinary Active becomes one integrated large Home stage · pause/resume + complete-set are primary · hold-finish preserved · v87 remains sole action owner · no new storage/writer/Active owner');
