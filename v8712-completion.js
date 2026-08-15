(()=>{'use strict';
const D=document,$=(s,r=D)=>r?.querySelector?.(s)||null,$$=(s,r=D)=>r?.querySelectorAll?Array.from(r.querySelectorAll(s)):[];
const VERSION='8.7.12';
let parentSnapshot=null,wireTimer=0;
const sheetParents=new WeakMap(),sheetScroll=new WeakMap();

function removeSoundTest(){
 for(const sel of ['#v8710Test','#v85Test','#v876Test','.v8710Test','.v85Test','.v876Test'])$$(sel).forEach(n=>n.remove());
}
function cleanWatermarkCorners(){
 const pv=$('#watermarkPreview');if(!pv)return;
 for(const b of $$(':scope>button[data-pos]',pv)){b.style.opacity='0';b.style.pointerEvents='none';b.style.border='0';b.style.background='transparent';b.style.boxShadow='none';b.setAttribute('aria-hidden','true')}
 const overlays=$$('#v8711Corners',pv);overlays.slice(1).forEach(n=>n.remove());
}
function cleanRetiredOwners(){
 $$('.v8712cStandalone,#v8712cNumSheet').forEach(n=>n.remove());
 $('#v879EditBtn')?.remove();
}
function visibleSheets(){return $$('.sheetWrap.show').filter(x=>getComputedStyle(x).display!=='none')}
function topSheet(){const xs=visibleSheets();return xs[xs.length-1]||null}
function snapshotParent(){
 const p=topSheet();
 parentSnapshot=p?{sheet:p,scroll:$('.sheet',p)?.scrollTop||0}:null;
}
function syncLayers(){
 const xs=visibleSheets();
 D.body.classList.toggle('v879Lock',!!xs.length);
 xs.forEach((x,i)=>{x.classList.toggle('v879Under',i<xs.length-1);x.classList.toggle('v879Front',i===xs.length-1)});
}
function addBack(child,parent,scroll=0){
 if(!child||!parent||child===parent)return;
 sheetParents.set(child,parent);sheetScroll.set(parent,scroll);
 child.classList.add('axisHasBack');
 const head=$(':scope>.sheet>.sheetHead',child);if(!head)return;
 head.querySelectorAll('.axisBack').forEach((n,i)=>{if(i)n.remove()});
 let b=$('.axisBack',head);
 if(!b){b=D.createElement('button');b.type='button';b.className='axisBack';b.setAttribute('aria-label','返回上一页');head.insertBefore(b,head.firstChild)}
}
function wireNewTopSheet(){
 clearTimeout(wireTimer);wireTimer=0;
 const child=topSheet(),snap=parentSnapshot;parentSnapshot=null;
 if(snap?.sheet&&child&&child!==snap.sheet)addBack(child,snap.sheet,snap.scroll);
 syncLayers();
}
function scheduleWire(){
 clearTimeout(wireTimer);
 requestAnimationFrame(()=>{wireNewTopSheet();wireTimer=setTimeout(wireNewTopSheet,90)});
}
function closeToParent(sheet){
 if(!sheet)return;
 const parent=sheetParents.get(sheet);
 sheet.classList.remove('show','v879Front');
 if(parent){
  parent.classList.add('show');
  const sc=$('.sheet',parent),y=sheetScroll.get(parent)||0;
  if(sc)requestAnimationFrame(()=>{sc.scrollTop=y});
 }
 syncLayers();
}
function installBackFlow(){
 D.addEventListener('pointerdown',e=>{
  if(e.target.closest('.axisBack,.closeBtn,[data-close]')){parentSnapshot=null;return}
  snapshotParent();
 },true);
 D.addEventListener('click',e=>{
  const back=e.target.closest('.axisBack');
  if(back){e.preventDefault();e.stopPropagation();parentSnapshot=null;closeToParent(back.closest('.sheetWrap'));return}
  scheduleWire();
 },true);
}
function version(){
 window.__AXIS_VERSION__=window.__AXIS_RELEASE__||VERSION;
 const v=$('.versionLine');if(v){v.textContent=`版本 ${VERSION}`;v.dataset.axisVersion=VERSION;v.style.visibility='visible'}
}
function patch(){removeSoundTest();cleanWatermarkCorners();cleanRetiredOwners();version();syncLayers()}
function bind(){
 installBackFlow();patch();
 D.addEventListener('click',e=>{
  if(e.target.closest('#settingsBtn,#v8711AudioGate,[data-v8711-fold="audio"]')){removeSoundTest();setTimeout(removeSoundTest,90)}
  if(e.target.closest('#watermarkBtn')){cleanWatermarkCorners();setTimeout(cleanWatermarkCorners,120)}
  if(e.target.closest('#settingsBtn,#quickRecordBtn,#v8Other,#equipmentRow,#reportBtn,#watermarkBtn,#profileBtn,#myEqBtn'))setTimeout(cleanRetiredOwners,100);
 },true);
 window.addEventListener('pageshow',()=>setTimeout(patch,100));
 window.__AXIS_8712_COMPLETION_READY__=true;
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',()=>setTimeout(bind,0),{once:true});else setTimeout(bind,0);
})();