import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10.2 stability] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* History session -> event detail: one composed geometry commit. The prior one-frame
   inherited min-height made a tall session sheet visibly snap to the shorter event sheet on iOS. */
{
 const FILE='app.js';let src=read(FILE);
 const fn=`function axis89CommitDetail(txn,title,stage,urls,bind){
 if(txn!==axis89DetailTxn){axis89Revoke(urls);return}
 requestAnimationFrame(()=>{
  if(txn!==axis89DetailTxn){axis89Revoke(urls);return}
  const sheet=$('#detailSheet'),host=$('#detail'),wasOpen=sheet?.classList.contains('show'),old=axis89DetailUrls;axis89DetailUrls=urls;
  sheet?.classList.remove('axis884Prepaint');if(wasOpen)sheet?.classList.add('axis891DetailSwap','axis8102DetailSwap');
  setText('#detailTitle',title);if(host)host.replaceChildren(...Array.from(stage.childNodes));bind?.();
  if(!wasOpen)openSheet('detailSheet');
  requestAnimationFrame(()=>{sheet?.classList.remove('axis891DetailSwap','axis8102DetailSwap');axis89Revoke(old)});
  window.__AXIS_89_DETAIL__={owner:'atomic-handoff',patch:'8.10.2',stableShell:true,singleComposition:true,legacyHeightHold:false,txn,committedAt:Date.now(),visible:true}
 })
}`;
 src=regexOnce(src,/function axis89CommitDetail\(txn,title,stage,urls,bind\)\{[\s\S]*?\n\}\nasync function openEvent/,fn+'\nasync function openEvent','single-composition event detail swap');
 const commit=(src.match(/function axis89CommitDetail[\s\S]*?async function openEvent/)||[''])[0];
 if(/host\.style\.minHeight|style\.removeProperty\('min-height'\)/.test(commit))fail('legacy detail height hold survived');
 if(!commit.includes("patch:'8.10.2'"))fail('8.10.2 detail diagnostic missing');
 syntax(src,FILE);write(FILE,src);
}

{
 const FILE='v88.css';let css=read(FILE);
 if(css.includes('AXIS 8.10.2 detail drill-down'))fail('8.10.2 detail CSS duplicated');
 css+=`\n\n/* AXIS 8.10.2 detail drill-down — no intermediate inherited sheet height. */\n#detailSheet.axis8102DetailSwap,#detailSheet.axis8102DetailSwap>.sheet,#detailSheet.axis8102DetailSwap #detail{transition:none!important}\n#detailSheet.axis8102DetailSwap #detail{overflow-anchor:none!important}\n`;
 write(FILE,css);
}

/* Learning surface: an explicitly opened pause/plan-done panel owns its own lifetime.
   renderNow may repaint the quiet rail every 500ms, but it must not close that panel. */
{
 const FILE='v87-runtime.js';let src=read(FILE);

 src=once(src,
  "const opportunity=['auto','rest','pause','off'].includes(p.opportunity)?p.opportunity:'auto';\n  return{on:p.enabled===true,native,target:allowed.includes(p.target)?p.target:allowed[0],mode,track,cadence,level,dailyTarget,opportunity}",
  "const opportunity=['auto','rest','pause','off'].includes(p.opportunity)?p.opportunity:'auto';\n  const standalone=['off','manual','daily'].includes(p.standalone)?p.standalone:'off';\n  return{on:p.enabled===true,native,target:allowed.includes(p.target)?p.target:allowed[0],mode,track,cadence,level,dailyTarget,opportunity,standalone}",
  'standalone preference');
 src=once(src,
  "catch{return{on:false,native:'zh',target:'en',mode:'auto',track:'auto',cadence:'auto',level:'adaptive',dailyTarget:0,opportunity:'auto'}}",
  "catch{return{on:false,native:'zh',target:'en',mode:'auto',track:'auto',cadence:'auto',level:'adaptive',dailyTarget:0,opportunity:'auto',standalone:'off'}}",
  'standalone preference fallback');

 src=once(src,
  "dailyTarget:[[0,'自动'],[6,'6'],[12,'12'],[20,'20']],opportunity:[['auto','智能'],['rest','仅组间'],['pause','暂停可用'],['off','关闭']]};",
  "dailyTarget:[[0,'自动'],[6,'6'],[12,'12'],[20,'20']],opportunity:[['auto','智能'],['rest','仅组间'],['pause','暂停可用'],['off','关闭']],standalone:[['off','关闭'],['manual','随时可学'],['daily','每日轻练']]};",
  'standalone settings group');
 src=once(src,
  "level:{adaptive:'自适应',foundation:'基础',progress:'进阶',advanced:'高阶'},opportunity:{auto:'智能机会',rest:'仅组间',pause:'暂停可用',off:'关闭'}};",
  "level:{adaptive:'自适应',foundation:'基础',progress:'进阶',advanced:'高阶'},opportunity:{auto:'智能机会',rest:'仅组间',pause:'暂停可用',off:'关闭'},standalone:{off:'关闭',manual:'随时可学',daily:'每日轻练'}};",
  'standalone settings labels');

 src=once(src,
  '<div class="v810SpeakBlock"><div><span>机会学习</span><b>不抢训练主线</b></div><div data-v810-options="opportunity"></div></div><div class="v810Progress">',
  '<div class="v810SpeakBlock"><div><span>机会学习</span><b>不抢训练主线</b></div><div data-v810-options="opportunity"></div></div><div class="v810SpeakBlock v8102StandaloneBlock"><div><span>独立学习</span><b>健身之外也可进行</b></div><div data-v810-options="standalone"></div><button type="button" class="v8102StandaloneStart" data-v810-standalone-start hidden>开始一轮</button></div><div class="v810Progress">',
  'standalone settings block');

 src=once(src,
  "if(summary){const custom=p.mode!=='auto'||p.track!=='auto'||p.cadence!=='auto'||p.level!=='adaptive'||Number(p.dailyTarget)>0||p.opportunity!=='auto';summary.textContent=custom?'自定':'智能'}",
  "if(summary){const custom=p.mode!=='auto'||p.track!=='auto'||p.cadence!=='auto'||p.level!=='adaptive'||Number(p.dailyTarget)>0||p.opportunity!=='auto'||p.standalone!=='off';summary.textContent=custom?'自定':'智能'}",
  'standalone compact summary');

 src=once(src,
  "for(const [k,items] of Object.entries(AXIS810_SETTING_GROUPS))axis810RenderGroup($('[data-v810-options=\"'+k+'\"]',panel),k,items,p[k]);const snap=axis810Snapshot()",
  "for(const [k,items] of Object.entries(AXIS810_SETTING_GROUPS))axis810RenderGroup($('[data-v810-options=\"'+k+'\"]',panel),k,items,p[k]);const start=$('[data-v810-standalone-start]',panel);if(start){start.hidden=!p.on||p.standalone==='off';start.textContent=p.standalone==='daily'?'开始今日一轮':'开始一轮'}const snap=axis810Snapshot()",
  'standalone launcher render');

 src=once(src,
  "if(e.target?.closest?.('[data-v810-recap=\"open\"]')){e.preventDefault();e.stopPropagation();axis810OpenRecap()}",
  "if(e.target?.closest?.('[data-v810-standalone-start]')){e.preventDefault();e.stopPropagation();axis8102OpenStandalone();return}if(e.target?.closest?.('[data-v810-recap=\"open\"]')){e.preventDefault();e.stopPropagation();axis810OpenRecap()}",
  'standalone launcher event');

 const css=`
/* AXIS 8.10.2 learning lifetime + isolated standalone surface. */
.v8102StandaloneBlock .v8102StandaloneStart{width:100%;height:40px;margin-top:8px;border-radius:12px;background:rgba(115,124,255,.14);color:#c6c9ff;font-size:11px;font-weight:680}
.v8102StandaloneBlock .v8102StandaloneStart[hidden]{display:none!important}
.v891SpeakPanel.v8102Standalone{z-index:219!important;bottom:max(22px,calc(env(safe-area-inset-bottom) + 18px))!important;max-height:min(78dvh,680px)!important}
@media(max-width:380px){.v891SpeakPanel.v8102Standalone{bottom:max(16px,calc(env(safe-area-inset-bottom) + 12px))!important;max-height:80dvh!important}}
`;
 const helpers=`function axis8102Style(){if($('#v8102Style'))return;const s=D.createElement('style');s.id='v8102Style';s.textContent=${JSON.stringify(css)};D.head.appendChild(s)}
function axis8102PanelSource(){return $('#v891SpeakPanel')?.dataset?.axis8102Source||''}
function axis8102SetPanelSource(source){const p=$('#v891SpeakPanel');if(!p)return;p.dataset.axis8102Source=source||'';p.classList.toggle('v8102Standalone',source==='standalone');if(source==='standalone'){p.style.removeProperty('bottom');p.style.removeProperty('max-height')}}
function axis8102OpenPhrase(x,key,source){if(!x)return;const el=D.createElement('span');el.dataset.phraseId=x.id;el.dataset.key=key;el.dataset.restMs='0';axis891OpenSpeak(el);axis8102SetPanelSource(source);axis8101SetMode('dialogue')}
function axis8102OpenStandalone(){const p=axis89SpeakPrefs();if(!p?.on||p.standalone==='off')return;const key='standalone:'+axis810DayKey()+':'+Date.now().toString(36),x=axis810SelectPhrase(key,45000,{force:true});if(!x)return;axis810CloseConfig();requestAnimationFrame(()=>axis8102OpenPhrase(x,key,'standalone'))}
function axis8102KeepOpportunityOpen(a,planDone){const p=$('#v891SpeakPanel');return !!(axis8101OpportunityAllowed(a,planDone)&&p?.classList.contains('show')&&p.dataset.axis8102Source==='opportunity')}
`;
 src=once(src,'function axis8101OpportunityAllowed(a,planDone){',helpers+'function axis8101OpportunityAllowed(a,planDone){','8.10.2 learning helpers');
 src=once(src,'function axis8101Install(){axis8101Style();',"function axis8101Install(){axis8101Style();axis8102Style();",'8.10.2 style mount');

 src=once(src,
  "function axis8101OpenOpportunity(el){const p=axis89SpeakPrefs(),key=el?.dataset?.key||('opportunity:'+Date.now()),x=axis810SelectPhrase(key,45000,{force:true});if(!x||!el)return;el.dataset.phraseId=x.id;el.dataset.key=key;el.dataset.restMs='0';axis891OpenSpeak(el);axis8101SetMode('dialogue')}",
  "function axis8101OpenOpportunity(el){const p=axis89SpeakPrefs(),key=el?.dataset?.key||('opportunity:'+Date.now()),x=axis810SelectPhrase(key,45000,{force:true});if(!x||!el)return;el.dataset.phraseId=x.id;el.dataset.key=key;el.dataset.restMs='0';axis891OpenSpeak(el);axis8102SetPanelSource('opportunity');axis8101SetMode('dialogue')}",
  'opportunity panel source ownership');

 src=once(src,
  "if(!rest){axis891CloseSpeak();if(axis8101OpportunityAllowed(a,planDone))axis8101PaintOpportunity(el,e,a,planDone);return}",
  "if(!rest){const allowed=axis8101OpportunityAllowed(a,planDone),keep=axis8102KeepOpportunityOpen(a,planDone);if(!keep)axis891CloseSpeak();if(allowed)axis8101PaintOpportunity(el,e,a,planDone);return}",
  'persistent explicit opportunity panel');

 src=once(src,
  "if(opportunity){e.preventDefault();e.stopPropagation();axis8101OpenOpportunity(opportunity);return}",
  "if(opportunity){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();axis8101OpenOpportunity(opportunity);return}",
  'opportunity single event owner');

 src=once(src,
  "function axis891CloseSpeak(){axis8101StopPractice();const p=$('#v891SpeakPanel');if(p){p.classList.remove('show','expanded');delete p.dataset.phraseId;delete p.dataset.key}}",
  "function axis891CloseSpeak(){axis8101StopPractice();const p=$('#v891SpeakPanel');if(p){p.classList.remove('show','expanded','v8102Standalone');delete p.dataset.phraseId;delete p.dataset.key;delete p.dataset.axis8102Source;p.style.removeProperty('bottom');p.style.removeProperty('max-height')}}",
  'learning panel source cleanup');

 src=regexOnce(src,/function axis891NextSpeak\(\)\{[\s\S]*?\n\}\nfunction axis891MasterSpeak/,`function axis891NextSpeak(){
 const panel=$('#v891SpeakPanel'),el=$('#v87Rest'),p=axis89SpeakPrefs();if(!panel||!el)return;const standalone=panel.dataset.axis8102Source==='standalone',source=panel.dataset.axis8102Source||'',current=panel.dataset.phraseId||axis89SpeakStore().current?.id||'',key=standalone?(panel.dataset.key||('standalone:'+axis810DayKey())):(el.dataset.key||panel.dataset.key||''),rest=standalone?45000:(Number(el.dataset.restMs||panel.dataset.sourceRest)||0),pick=axis810SelectPhrase(key,rest,{force:true,exclude:current});if(!pick)return;if(standalone){axis8102OpenPhrase(pick,key,'standalone');return}axis891PaintRestPhrase(el,pick,p,rest,key);axis891OpenSpeak(el);if(source==='opportunity')axis8102SetPanelSource('opportunity')
}
function axis891MasterSpeak`,'standalone-safe next phrase');

 src=once(src,"window.__AXIS_8101_PRACTICE__={version:'8.10.1',dialogue:true,echo:true,shadow:true,localRecording:true,autoplay:false,opportunity:true,storage:'axis_v89_speak-practice-counters-only'}",
  "window.__AXIS_8101_PRACTICE__={version:'8.10.1',dialogue:true,echo:true,shadow:true,localRecording:true,autoplay:false,opportunity:true,storage:'axis_v89_speak-practice-counters-only'};window.__AXIS_8102_STABILITY__={version:'8.10.2',opportunityPanelPersistent:true,standaloneLearning:true,standaloneModes:['off','manual','daily'],autoplay:false,trainingOwner:false}",
  '8.10.2 learning diagnostic');

 for(const needle of ["standaloneModes:['off','manual','daily']",'function axis8102OpenStandalone(','function axis8102KeepOpportunityOpen(',"p.dataset.axis8102Source==='opportunity'",'e.stopImmediatePropagation()'])if(!src.includes(needle))fail(`missing ${needle}`);
 const standaloneFn=(src.match(/function axis8102OpenStandalone\([\s\S]*?(?=\nfunction )/)||[''])[0];
 if(/writeMeta\(|writeCore\(|axis_v8_meta|axis_v60_state/.test(standaloneFn))fail('standalone learning writes training state');
 syntax(src,FILE);write(FILE,src);
}

console.log('[AXIS 8.10.2 stability] PASS · single-composition history detail · persistent explicit opportunity panel · isolated standalone learning');
