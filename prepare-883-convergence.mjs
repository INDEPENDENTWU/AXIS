import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.8.3 convergence] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* Watermark opacity is a real enabled-state range: 1%..100%. Historical 4/32/48 clamps are retired. */
for(const FILE of ['v876-runtime.js','v877-runtime.js','v8710-watermark.js']){
  let src=read(FILE);
  src=src.replace(/min="4"\s+max="(?:32|48)"/g,'min="1" max="100"');
  src=src.replace(/Math\.max\(4,Math\.min\((?:32|48),Number\(p\.v876WmOpacity\)\|\|(15|18)\)\)/g,(_,d)=>`Math.max(1,Math.min(100,Number(p.v876WmOpacity)||${d}))`);
  src=src.replace(/Math\.max\(4,Math\.min\(32,Number\(v\)\|\|15\)\)/g,'Math.max(1,Math.min(100,Number(v)||15))');
  write(FILE,src);
}

/* Final watermark owner: separate brand header from metadata, wrap long place names, and freeze a per-record location snapshot. */
{
  const FILE='v8710-watermark.js';
  let src=read(FILE);
  src=src.replace(/c\.globalAlpha=Math\.max\(\.10,p\.opacity\/100\)/g,'c.globalAlpha=Math.max(.01,Math.min(1,p.opacity/100))');

  const stamp=`async function stamp(blob,e){
    const url=URL.createObjectURL(blob),img=new Image();
    await new Promise((ok,no)=>{img.onload=ok;img.onerror=no;img.src=url});
    const cv=D.createElement('canvas');cv.width=img.naturalWidth;cv.height=img.naturalHeight;
    const c=cv.getContext('2d',{alpha:false});c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(img,0,0,cv.width,cv.height);URL.revokeObjectURL(url);
    const p=pref(),L=p.resolvedLang,W=cv.width,H=cv.height,base=Math.max(20,Math.round(W*.0215)),big=Math.max(25,Math.round(W*.027)),pd=Math.max(22,Math.round(W*.03));
    const locationSnapshot={lat:Number(p.geo?.lat)||null,lon:Number(p.geo?.lon)||null,accuracy:Number(p.geo?.acc)||null,place:String(p.place||''),resolvedAt:Date.now(),provider:String(p.source||'resolved'),capturedAt:Number(e.time)||Date.now()};
    try{if(e?.id){const mm=meta();mm.events=mm.events||{};mm.events[e.id]={...(mm.events[e.id]||{}),locationSnapshot};write(META,mm)}}catch{}
    c.save();
    c.globalAlpha=Math.max(.01,Math.min(1,p.opacity/100));c.fillStyle='#737cff';c.textAlign='center';c.textBaseline='middle';c.font=\`800 \${Math.max(74,Math.round(W*.12))}px -apple-system,BlinkMacSystemFont,Arial\`;c.fillText('A X I S',W/2,H*.48);
    c.globalAlpha=Math.max(.01,Math.min(1,p.opacity/100))*.72;c.fillRect(W*.12,H*.555,W*.76,Math.max(2,Math.round(W*.0025)));
    c.restore();

    const name=L==='en'?englishName(e.name||'TRAINING').toUpperCase():(e.name||'训练'),time=timeText(e.time||Date.now()),data=eventData(e,L);
    const body=[];if(p.name)body.push({kind:'name',text:name,size:big,weight:680,color:'#fff'});if(p.data&&data)body.push({kind:'data',text:data,size:base,weight:580,color:'rgba(255,255,255,.96)'});if(p.location&&p.place)body.push({kind:'location',text:String(p.place),size:base,weight:540,color:'rgba(255,255,255,.91)'});if(p.time)body.push({kind:'time',text:time,size:base,weight:540,color:'rgba(255,255,255,.84)'});
    const boxW=Math.min(Math.round(W*.68),Math.max(Math.round(W*.44),Math.round(W*.58))),innerW=boxW-pd*2,lineH=Math.round(base*1.42),brandGap=Math.max(8,Math.round(base*.42));
    const splitLine=(text,fontSize,weight,maxLines=2)=>{c.font=\`\${weight} \${fontSize}px -apple-system,BlinkMacSystemFont,'PingFang SC',Arial\`;if(c.measureText(text).width<=innerW)return[text];const units=/\s/.test(text)?String(text).split(/\s+/):Array.from(String(text));const out=[];let cur='';for(const u of units){const join=/\s/.test(text)&&cur?cur+' '+u:cur+u;if(c.measureText(join).width<=innerW||!cur)cur=join;else{out.push(cur);cur=u;if(out.length===maxLines-1)break}}if(cur&&out.length<maxLines)out.push(cur);if(out.length===maxLines){let last=out[maxLines-1];while(c.measureText(last+'…').width>innerW&&last.length>1)last=last.slice(0,-1);out[maxLines-1]=last+(last!==text?'…':'')}return out};
    const painted=[];for(const row of body){const s=fit(c,row.text,innerW,row.size,row.weight,Math.max(13,base-5));const lines=row.kind==='location'?splitLine(row.text,s,row.weight,2):[row.text];painted.push({...row,size:s,lines})}
    const bodyLines=painted.reduce((n,r)=>n+r.lines.length,0),headerH=lineH+brandGap,boxH=Math.ceil(pd*.9+headerH+bodyLines*lineH+pd*.65),[x,y]=panelRect(W,H,p.pos,boxW,boxH,pd),right=p.pos==='tr'||p.pos==='br';
    c.save();c.textAlign=right?'right':'left';c.textBaseline='top';c.shadowColor='rgba(0,0,0,.72)';c.shadowBlur=Math.max(4,W*.004);
    c.fillStyle='rgba(5,7,10,.72)';c.fillRect(x,y,boxW,boxH);c.fillStyle='#737cff';c.fillRect(right?x+boxW-Math.max(3,W*.004):x,y,Math.max(3,W*.004),boxH);
    const tx=right?x+boxW-pd:x+pd,top=y+pd*.46;c.fillStyle='#fff';c.font=\`720 \${base}px -apple-system,BlinkMacSystemFont,'PingFang SC',Arial\`;c.fillText('AXIS / RECORD',tx,top);
    const ruleY=top+lineH;c.shadowBlur=0;c.fillStyle='rgba(255,255,255,.10)';c.fillRect(x+pd,ruleY,boxW-pd*2,Math.max(1,Math.round(W*.001)));c.shadowBlur=Math.max(4,W*.004);
    let yy=ruleY+brandGap;for(const row of painted){c.font=\`\${row.weight} \${row.size}px -apple-system,BlinkMacSystemFont,'PingFang SC',Arial\`;c.fillStyle=row.color;for(const line of row.lines){c.fillText(line,tx,yy);yy+=lineH}}
    c.restore();
    return new Promise(ok=>cv.toBlob(ok,'image/jpeg',.97))
  }`;
  const re=/async function stamp\(blob,e\)\{[\s\S]*?\}\nasync function newest/;
  const hits=src.match(new RegExp(re.source,'g'))||[];
  if(hits.length!==1)fail(`final watermark stamp expected once, found ${hits.length}`);
  src=src.replace(re,stamp+'\nasync function newest');
  syntax(src,FILE);write(FILE,src);
}

/* Active training keeps the accepted cards/dock intact. Only the timeline becomes dock-aware when the viewport is tight. */
{
  const FILE='v8712-runtime.js';
  let src=read(FILE);
  if(!src.includes('__AXIS_883_SAFE_ZONE__'))src+=`\n;(()=>{'use strict';
const D=document,$=s=>D.querySelector(s);let raf=0,ro=null,mo=null;
function q(){cancelAnimationFrame(raf);raf=requestAnimationFrame(apply)}
function clear(section){if(!section)return;section.classList.remove('axis883TimelineSafe');section.style.removeProperty('--axis883-lift');section.style.transform='';section.style.marginBottom='';section.style.maxHeight='';section.style.overflowY='';D.body.classList.remove('axis883-active-safe')}
function apply(){const active=$('#activeHome'),list=$('#eventList'),dock=$('#dock'),section=list?.closest('.section');if(!active||!list||!dock||!section)return;const shown=!active.classList.contains('hidden')&&dock.classList.contains('show');if(!shown){clear(section);return}const vv=window.visualViewport,viewportBottom=vv?(vv.offsetTop+vv.height):window.innerHeight,dr=dock.getBoundingClientRect(),safeTop=Math.min(viewportBottom,dr.top)-14,sr=section.getBoundingClientRect(),prev=section.previousElementSibling,prevBottom=prev?prev.getBoundingClientRect().bottom:sr.top,freeGap=Math.max(0,sr.top-prevBottom),overlap=Math.max(0,sr.bottom-safeTop),lift=Math.min(64,overlap,Math.max(0,freeGap-16));section.classList.add('axis883TimelineSafe');D.body.classList.add('axis883-active-safe');section.style.setProperty('--axis883-lift',lift+'px');section.style.transform=lift?'translateY(-'+lift+'px)':'';section.style.marginBottom=lift?(-lift)+'px':'';const top=sr.top-lift,maxH=Math.max(126,Math.floor(safeTop-top));section.style.maxHeight=maxH+'px';section.style.overflowY='auto';section.style.overscrollBehavior='contain';section.style.scrollPaddingBottom='16px'}
function boot(){q();window.addEventListener('resize',q,{passive:true});window.addEventListener('orientationchange',()=>setTimeout(q,80),{passive:true});window.addEventListener('pageshow',q);window.visualViewport?.addEventListener('resize',q,{passive:true});window.visualViewport?.addEventListener('scroll',q,{passive:true});const dock=$('#dock'),active=$('#activeHome'),list=$('#eventList');if(window.ResizeObserver){ro=new ResizeObserver(q);[dock,active].filter(Boolean).forEach(x=>ro.observe(x))}if(window.MutationObserver&&active&&list){mo=new MutationObserver(q);mo.observe(active,{attributes:true,attributeFilter:['class']});mo.observe(list,{childList:true,subtree:true})}}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();window.__AXIS_883_SAFE_ZONE__=true;
})();`;
  syntax(src,FILE);write(FILE,src);
}

{
  const FILE='v88.css';let src=read(FILE);
  if(!src.includes('AXIS 8.8.3 active safe zone'))src+=`\n/* AXIS 8.8.3 active safe zone — preserve the accepted active card/dock, constrain only timeline content. */\nhtml body.axis883-active-safe #activeHome .axis883TimelineSafe{position:relative!important;scrollbar-width:none!important;-webkit-overflow-scrolling:touch!important;padding-bottom:8px!important;transition:transform .16s ease,max-height .16s ease!important}\nhtml body.axis883-active-safe #activeHome .axis883TimelineSafe::-webkit-scrollbar{display:none!important}\nhtml body.axis883-active-safe #activeHome .axis883TimelineSafe>.sectionHead{position:sticky!important;top:0!important;z-index:3!important;padding:6px 0 8px!important;background:linear-gradient(180deg,#08090b 76%,rgba(8,9,11,.88) 90%,rgba(8,9,11,0))!important}\nhtml body.axis883-active-safe #activeHome .axis883TimelineSafe:after{content:'';position:sticky;display:block;left:0;right:0;bottom:0;height:18px;pointer-events:none;background:linear-gradient(180deg,rgba(8,9,11,0),#08090b)}\n@media(max-height:760px){html body.v87-now #activeHome>.section{margin-top:22px!important}}\n`;
  write(FILE,src);
}

/* Build-time regression assertions. */
{
  const wm=read('v8710-watermark.js'),v876=read('v876-runtime.js'),v877=read('v877-runtime.js'),feature=read('v8712-runtime.js'),css=read('v88.css');
  if(!/min="1" max="100"/.test(v876+v877))fail('1..100 opacity range missing');
  if(/Math\.max\(4,Math\.min\((32|48),Number\(p\.v876WmOpacity\)/.test(wm+v876+v877))fail('legacy opacity clamp survived');
  if(!wm.includes('locationSnapshot'))fail('location snapshot missing');
  if(!wm.includes("row.kind==='location'"))fail('location wrap layout missing');
  if(!feature.includes('__AXIS_883_SAFE_ZONE__'))fail('active safe-zone owner missing');
  if(!css.includes('axis883TimelineSafe'))fail('active safe-zone CSS missing');
}
console.log('[AXIS 8.8.3 convergence] PASS · watermark separated/wrapped · opacity 1..100 · location snapshot frozen · active timeline dock-aware');
