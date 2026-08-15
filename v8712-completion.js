(()=>{'use strict';
const D=document,$=(s,r=D)=>r?.querySelector?.(s)||null,$$=(s,r=D)=>r?.querySelectorAll?Array.from(r.querySelectorAll(s)):[];
const VERSION='8.7.12',CORE='axis_v60_state';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,Number(n)||0));
const fmt=n=>{n=Number(n)||0;return n%1?String(Math.round(n*100)/100):String(n)};
let setObs=null,adjustQueued=false,lastStepAt=0,parentSnapshot=null;
const sheetParents=new WeakMap(),sheetScroll=new WeakMap();

function style(){
 if($('#v8712CompletionStyle'))return;
 const s=D.createElement('style');s.id='v8712CompletionStyle';s.textContent=`
:root{--axis-rule:rgba(255,255,255,.072)}
#v8SetEditor .v8Adjust{display:block!important;visibility:visible!important;opacity:1!important;min-height:0!important;padding:18px 0 4px!important}
#v8SetEditor .v8712cAdjust{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;width:100%}
#v8SetEditor .v8712cField{min-width:0}
#v8SetEditor .v8712cLabel{height:30px;display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--muted);font-size:15px;line-height:1}
#v8SetEditor .v8712cControl{height:56px;display:grid;grid-template-columns:52px minmax(0,1fr) 52px;align-items:center;border-radius:16px;background:var(--s2);overflow:hidden}
#v8SetEditor .v8712cControl>button{height:52px;min-width:0;padding:0;margin:0;display:grid;place-items:center;background:transparent;color:var(--muted);font-size:22px;line-height:1;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
#v8SetEditor .v8712cControl>.v8712cValue{display:flex;align-items:baseline;justify-content:center;gap:6px;color:var(--text)}
#v8SetEditor .v8712cValue b{font-size:22px;line-height:1;font-weight:650;letter-spacing:-.018em;font-variant-numeric:tabular-nums}
#v8SetEditor .v8712cValue small{font-size:15px;line-height:1;color:var(--muted)}
#v8SetEditor .v8712cHint{width:100%;min-height:36px;margin-top:8px;padding:0 10px;border-radius:11px;background:rgba(115,124,255,.09);color:var(--accent2);font-size:15px;text-align:center}
#v8SetEditor .v8SetRows{border-top:1px solid var(--axis-rule)!important}
#v8SetEditor .v8SetRow{min-height:82px!important;display:grid!important;grid-template-columns:44px minmax(94px,1fr) minmax(94px,1fr) 58px!important;column-gap:8px!important;align-items:center!important;padding:0 12px!important;margin:0!important;border-bottom:1px solid var(--axis-rule)!important;box-sizing:border-box!important;overflow:hidden!important;transition:none!important}
#v8SetEditor .v8SetRow>i{width:100%!important;height:36px!important;display:grid!important;place-items:center!important;padding:0!important;margin:0!important;color:var(--dim)!important;font-size:15px!important;line-height:1!important;font-style:normal!important;font-variant-numeric:tabular-nums!important;letter-spacing:.04em!important}
#v8SetEditor .v8SetRow>span{min-width:0!important;height:56px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;padding:0!important;margin:0!important;white-space:nowrap!important}
#v8SetEditor .v8SetRow>span b{font-size:22px!important;line-height:1!important;font-weight:650!important;letter-spacing:-.018em!important;font-variant-numeric:tabular-nums!important}
#v8SetEditor .v8SetRow>span small{font-size:15px!important;line-height:1!important;color:var(--muted)!important;margin:0!important}
#v8SetEditor .v8SetRow>em{width:52px!important;min-width:52px!important;max-width:52px!important;height:38px!important;display:grid!important;place-items:center!important;justify-self:end!important;padding:0!important;margin:0!important;border-radius:12px!important;font-size:15px!important;line-height:1!important;font-style:normal!important;white-space:nowrap!important}
#v8SetEditor,#v8SetEditor *{animation:none!important}
#watermarkPreview>button[data-pos]{border:0!important;background:transparent!important;box-shadow:none!important;outline:0!important;color:transparent!important;opacity:0!important}
#watermarkPreview>button[data-pos]::before,#watermarkPreview>button[data-pos]::after{display:none!important}
#watermarkPreview #v8711Corners{display:block!important}
#v8710Test,#v85Test,#v876Test,.v8710Test,.v85Test,.v876Test{display:none!important}
.sheetWrap.v8712cHasBack>.sheet>.sheetHead{grid-template-columns:44px minmax(0,1fr) 44px!important;column-gap:4px!important}
.v8712cBack{width:44px;height:44px;display:grid;place-items:center;padding:0;margin:0;color:var(--muted);font-size:25px;line-height:1;background:transparent;border:0;border-radius:12px;-webkit-tap-highlight-color:transparent}
.sheetWrap.v8712cHasBack>.sheet>.sheetHead>b{min-width:0;text-align:left}
.v8712cNumSheet{padding-bottom:calc(24px + env(safe-area-inset-bottom))!important}
.v8712cCurrent{display:block;color:var(--muted);font-size:15px;margin:2px 0 12px}
.v8712cNumInput{width:100%;height:66px;border:0;border-radius:17px;background:var(--s2);color:var(--text);padding:0 16px;text-align:center;outline:0;font-size:22px;font-variant-numeric:tabular-nums;box-sizing:border-box}
.v8712cNumApply{width:100%;height:58px;margin-top:12px;border-radius:18px;background:var(--text);color:#0b0d10;font-size:15px;font-weight:720}
@media(max-width:390px){#v8SetEditor .v8712cAdjust{grid-template-columns:1fr;gap:10px}#v8SetEditor .v8SetRow{grid-template-columns:40px minmax(82px,1fr) minmax(82px,1fr) 52px!important;column-gap:5px!important;padding:0 8px!important}#v8SetEditor .v8SetRow>em{width:48px!important;min-width:48px!important;max-width:48px!important}}
`;(D.head||D.documentElement).appendChild(s)
}

function setHost(){return $('#v8SetEditor')||$('#v8Sets')}
function setRows(){const h=setHost();return h?$$('.v8SetRow',h):[]}
function activeSet(){const rs=setRows(),row=rs.find(x=>x.classList.contains('active'))||rs[0];if(!row)return null;const vals=$$('span>b',row).map(x=>Number(x.textContent));return{row,i:rs.indexOf(row),w:Number(vals[0])||0,r:Number(vals[1])||0,count:rs.length}}
function weightStep(w){if(w<10)return.5;if(w<30)return 1;if(w<120)return 2.5;if(w<220)return 5;return 10}
function fireNative(kind,val){const h=setHost();if(!h)return;const b=D.createElement('button');b.type='button';b.hidden=true;if(kind==='weight')b.dataset.v8weight=String(clamp(Math.round(Number(val)*100)/100,0,1000));else b.dataset.v8reps=String(clamp(Math.round(Number(val)),1,300));h.appendChild(b);b.click();b.remove()}
function queueAdjust(ms=0){if(adjustQueued)return;adjustQueued=true;setTimeout(()=>{adjustQueued=false;renderAdjust()},ms)}
function renderAdjust(){const h=setHost(),adj=h?$('.v8Adjust',h):null,a=activeSet();if(!h||!adj||!a)return;const ws=weightStep(a.w),sig=[a.i,a.w,a.r,a.count,ws].join('|');if(adj.dataset.v8712c===sig&&adj.querySelector('.v8712cAdjust'))return;adj.dataset.v8712c=sig;adj.innerHTML=`<div class="v8712cAdjust"><section class="v8712cField"><div class="v8712cLabel"><span>重量</span><span>${fmt(ws)} kg / 次</span></div><div class="v8712cControl"><button type="button" data-v8712c-step="weight" data-dir="-1" aria-label="减少重量">−</button><button type="button" class="v8712cValue" data-v8712c-edit="weight"><b>${fmt(a.w)}</b><small>kg</small></button><button type="button" data-v8712c-step="weight" data-dir="1" aria-label="增加重量">＋</button></div></section><section class="v8712cField"><div class="v8712cLabel"><span>次数</span><span>1 次 / 次</span></div><div class="v8712cControl"><button type="button" data-v8712c-step="reps" data-dir="-1" aria-label="减少次数">−</button><button type="button" class="v8712cValue" data-v8712c-edit="reps"><b>${a.r}</b><small>次</small></button><button type="button" data-v8712c-step="reps" data-dir="1" aria-label="增加次数">＋</button></div></section></div>`}
function step(kind,dir){const t=performance.now();if(t-lastStepAt<90)return;lastStepAt=t;const a=activeSet();if(!a)return;fireNative(kind,(kind==='weight'?a.w:a.r)+dir*(kind==='weight'?weightStep(a.w):1));queueAdjust(24)}
function ensureNumSheet(){if($('#v8712cNumSheet'))return;D.body.insertAdjacentHTML('beforeend','<div class="sheetWrap" id="v8712cNumSheet"><div class="sheet v8712cNumSheet"><div class="grabber"></div><div class="sheetHead"><b id="v8712cNumTitle">调整</b><button class="closeBtn" id="v8712cNumClose">×</button></div><span class="v8712cCurrent" id="v8712cCurrent"></span><input class="v8712cNumInput" id="v8712cNumInput" inputmode="decimal"><button class="v8712cNumApply" id="v8712cNumApply">应用</button></div></div>');$('#v8712cNumClose').onclick=()=>closeSheet($('#v8712cNumSheet'));$('#v8712cNumApply').onclick=applyNum}
function openNum(kind){ensureNumSheet();const a=activeSet();if(!a)return;const v=kind==='weight'?a.w:a.r,s=$('#v8712cNumSheet');captureParentSnapshot();s.dataset.kind=kind;$('#v8712cNumTitle').textContent=kind==='weight'?'重量':'次数';$('#v8712cCurrent').textContent=kind==='weight'?`当前 ${fmt(v)} kg`:`当前 ${v} 次`;$('#v8712cNumInput').value=String(v);s.classList.add('show');setTimeout(()=>{wireNewTopSheet();$('#v8712cNumInput')?.focus();$('#v8712cNumInput')?.select?.()},20)}
function applyNum(){const s=$('#v8712cNumSheet'),kind=s?.dataset.kind,v=Number($('#v8712cNumInput')?.value);if(!Number.isFinite(v))return;fireNative(kind,v);closeSheet(s);queueAdjust(24)}
function observeSetEditor(){const h=setHost();if(!h||h.dataset.v8712cObserved)return;h.dataset.v8712cObserved='1';setObs=new MutationObserver(()=>queueAdjust(20));setObs.observe(h,{childList:true});queueAdjust(0)}

function removeSoundTest(){for(const x of ['#v8710Test','#v85Test','#v876Test','.v8710Test','.v85Test','.v876Test'])$$(x).forEach(n=>n.remove())}
function cleanWatermarkCorners(){const pv=$('#watermarkPreview');if(!pv)return;const overlays=$$('#v8711Corners',pv);overlays.slice(1).forEach(x=>x.remove())}

function visibleSheets(){return $$('.sheetWrap.show').filter(x=>getComputedStyle(x).display!=='none')}
function topSheet(){const xs=visibleSheets();return xs[xs.length-1]||null}
function captureParentSnapshot(){const p=topSheet();parentSnapshot=p?{sheet:p,scroll:$('.sheet',p)?.scrollTop||0}:null}
function syncLayers(){const xs=visibleSheets();D.body.classList.toggle('v879Lock',!!xs.length);xs.forEach((x,i)=>{x.classList.toggle('v879Under',i<xs.length-1);x.classList.toggle('v879Front',i===xs.length-1)})}
function addBack(child,parent,scroll=0){if(!child||!parent||child===parent)return;sheetParents.set(child,parent);sheetScroll.set(parent,scroll);child.classList.add('v8712cHasBack');const head=$(':scope>.sheet>.sheetHead',child);if(!head||$('.v8712cBack',head))return;const b=D.createElement('button');b.type='button';b.className='v8712cBack';b.setAttribute('aria-label','返回');b.textContent='‹';head.insertBefore(b,head.firstChild)}
function wireNewTopSheet(){const child=topSheet(),snap=parentSnapshot;parentSnapshot=null;if(snap?.sheet&&child&&child!==snap.sheet)addBack(child,snap.sheet,snap.scroll);syncLayers()}
function closeSheet(sheet){if(!sheet)return;const parent=sheetParents.get(sheet);sheet.classList.remove('show','v879Front');if(parent){parent.classList.add('show');const sc=$('.sheet',parent);if(sc)setTimeout(()=>{sc.scrollTop=sheetScroll.get(parent)||0},0)}syncLayers()}
function installBackFlow(){D.addEventListener('pointerdown',e=>{if(e.target.closest('.v8712cBack'))return;const p=topSheet();parentSnapshot=p?{sheet:p,scroll:$('.sheet',p)?.scrollTop||0}:null},true);D.addEventListener('click',e=>{const b=e.target.closest('.v8712cBack');if(b){e.preventDefault();e.stopPropagation();closeSheet(b.closest('.sheetWrap'));return}setTimeout(wireNewTopSheet,70)},true)}

function version(){window.__AXIS_VERSION__=window.__AXIS_RELEASE__||VERSION;const v=$('.versionLine');if(v){v.textContent=`版本 ${VERSION}`;v.dataset.axisVersion=VERSION;v.style.visibility='visible'}}
function patch(){style();observeSetEditor();renderAdjust();removeSoundTest();cleanWatermarkCorners();version()}
function bind(){style();installBackFlow();patch();D.addEventListener('click',e=>{const st=e.target.closest('[data-v8712c-step]');if(st){step(st.dataset.v8712cStep,Number(st.dataset.dir)||1);return}const ed=e.target.closest('[data-v8712c-edit]');if(ed){openNum(ed.dataset.v8712cEdit);return}if(e.target.closest('#watermarkBtn'))setTimeout(cleanWatermarkCorners,160);if(e.target.closest('#settingsBtn'))setTimeout(removeSoundTest,160);if(e.target.closest('#v8711AudioGate,[data-v8711-fold="audio"]'))setTimeout(removeSoundTest,80);if(e.target.closest('#v8SetEditor .v8SetRow,#v8SetEditor [data-v8setcount],#v874PlanSheet,#v875PlanSheet'))queueAdjust(30)},true);window.addEventListener('pageshow',()=>setTimeout(patch,120));window.__AXIS_8712_COMPLETION_READY__=true}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',()=>setTimeout(bind,0),{once:true});else setTimeout(bind,0)
})();
