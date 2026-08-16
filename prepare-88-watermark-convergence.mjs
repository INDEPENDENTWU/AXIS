import fs from 'node:fs';

const fail=m=>{throw new Error(`AXIS 8.8 watermark convergence: ${m}`)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};
const replaceOnce=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const replaceRegexOnce=(src,re,to,label)=>{const hits=src.match(new RegExp(re.source,re.flags.includes('g')?re.flags:re.flags+'g'))||[];if(hits.length!==1)fail(`${label} expected once, found ${hits.length}`);return src.replace(re,to)};

// v85 remains the canonical visible switch owner. Add Time as a fourth explicit preference.
{
  const FILE='v85-runtime.js';
  let src=fs.readFileSync(FILE,'utf8');
  src=replaceOnce(src,
    "function wmPrefs(){const p=prefs();return{name:p.v85WmName!==false,data:p.v85WmData!==false,location:!!p.v85WmLocation,pos:p.v85WmPos||readCore().prefs?.watermark?.pos||'bl'}}",
    "function wmPrefs(){const p=prefs();return{name:p.v85WmName!==false,data:p.v85WmData!==false,location:!!p.v85WmLocation,time:p.v85WmTime!==false,pos:p.v85WmPos||readCore().prefs?.watermark?.pos||'bl'}}",
    'v85 watermark preference shape');
  src=replaceOnce(src,
    '<div class="v85WmRow"><span>位置</span><button class="switch" id="v85WmLocation" role="switch"><i></i></button></div>',
    '<div class="v85WmRow"><span>位置</span><button class="switch" id="v85WmLocation" role="switch"><i></i></button></div><div class="v85WmRow"><span>时间</span><button class="switch" id="v85WmTime" role="switch"><i></i></button></div>',
    'v85 time switch row');
  src=replaceOnce(src,
    "$('#v85WmData').onclick=()=>setWm('v85WmData',!wmPrefs().data);$('#v85WmLocation')",
    "$('#v85WmData').onclick=()=>setWm('v85WmData',!wmPrefs().data);$('#v85WmTime').onclick=()=>setWm('v85WmTime',!wmPrefs().time);$('#v85WmLocation')",
    'v85 time switch writer');
  src=replaceRegexOnce(src,/function renderWm\(\)\{[\s\S]*?\}\nfunction wmData\(\)/,
`function renderWm(){const p=wmPrefs(),g=latestGeo||prefs().v85LastGeo;for(const [id,on] of [['v85WmName',p.name],['v85WmData',p.data],['v85WmLocation',p.location],['v85WmTime',p.time]])$('#'+id)?.setAttribute('aria-checked',String(on));const b=$('#v85WmPreview');if(!b)return;b.style.left=p.pos.endsWith('r')?'auto':'18px';b.style.right=p.pos.endsWith('r')?'18px':'auto';b.style.top=p.pos.startsWith('t')?'18px':'auto';b.style.bottom=p.pos.startsWith('t')?'auto':'18px';$('#v85WmNamePreview').style.display=p.name?'block':'none';$('#v85WmDataPreview').style.display=p.data?'block':'none';const d=new Date(),time=\`${'${d.getFullYear()}'}.$\{pad(d.getMonth()+1)\}.$\{pad(d.getDate())\} $\{pad(d.getHours())\}:$\{pad(d.getMinutes())\}\`,meta=p.time?time:'';$('#v85WmMetaPreview').textContent=meta;$('#v85WmMetaPreview').style.display=meta?'block':'none'}
function wmData()`,
    'v85 preview switch contract');
  src=replaceRegexOnce(src,/function drawWm\(c,w,h,ts,g\)\{[\s\S]*?\}\nfunction ctxRound/,
`function drawWm(c,w,h,ts,g){const p=wmPrefs(),info=wmData(),f=Math.max(12,Math.round(w*.016)),sm=Math.max(10,Math.round(f*.82)),pd=Math.max(11,Math.round(w*.012)),mk=Math.max(8,Math.round(f*.56)),lines=[];if(p.name)lines.push(info.name);if(p.data&&info.data)lines.push(info.data);const d=new Date(ts||now()),time=\`${'${d.getFullYear()}'}.$\{pad(d.getMonth()+1)\}.$\{pad(d.getDate())\} $\{pad(d.getHours())\}:$\{pad(d.getMinutes())\}\`,meta=p.time?time:'';c.save();c.textBaseline='top';let mw=0;c.font=\`650 $\{sm\}px -apple-system,BlinkMacSystemFont,Arial\`;mw=c.measureText('AXIS').width+mk*2.5;for(const l of lines){c.font=\`600 $\{f\}px -apple-system,BlinkMacSystemFont,Arial\`;mw=Math.max(mw,c.measureText(l).width)}if(meta){c.font=\`520 $\{Math.max(9,sm*.82)\}px -apple-system,BlinkMacSystemFont,Arial\`;mw=Math.max(mw,c.measureText(meta).width)}const lh=Math.round(f*1.28),metaRows=meta?1:0,bw=mw+pd*2,bh=pd*1.35+lh*(lines.length+.45+metaRows),pos=p.pos,x=pos.endsWith('r')?w-bw-pd:pd,y=pos.startsWith('t')?pd:h-bh-pd;c.fillStyle='rgba(8,9,11,.58)';c.strokeStyle='rgba(255,255,255,.14)';c.lineWidth=Math.max(1,w/1000);c.beginPath();ctxRound(c,x,y,bw,bh,Math.max(8,pd*.7));c.fill();c.stroke();drawMark(c,x+pd,y+pd*.72,mk*.72);c.font=\`700 $\{sm\}px -apple-system,BlinkMacSystemFont,Arial\`;c.fillStyle='#f4f3ef';c.fillText('AXIS',x+pd+mk*1.75,y+pd*.58);let ty=y+pd*.6+lh;for(const l of lines){c.font=\`600 $\{f\}px -apple-system,BlinkMacSystemFont,Arial\`;c.fillStyle='#d3d6dc';c.fillText(l,x+pd,ty);ty+=lh}if(meta){c.font=\`520 $\{Math.max(9,Math.round(sm*.82))\}px -apple-system,BlinkMacSystemFont,Arial\`;c.fillStyle='#9aa1ad';c.fillText(meta,x+pd,ty+1)}c.restore()}
function ctxRound`,
    'v85 legacy time/coordinate watermark contract');
  syntax(src,FILE);fs.writeFileSync(FILE,src);
}

// v876 legacy renderer is still part of capture compatibility. It must honor the same Time preference
// and must never draw raw coordinates into user media.
{
  const FILE='v876-runtime.js';
  let src=fs.readFileSync(FILE,'utf8');
  src=replaceOnce(src,
    "return{name:p.v85WmName!==false,data:p.v85WmData!==false,location:!!p.v85WmLocation,pos:p.v85WmPos||w.pos||'bl',photoMode:w.photoMode||'wm',opacity:Math.max(4,Math.min(32,Number(p.v876WmOpacity)||15)),...locationPrefs()}",
    "return{name:p.v85WmName!==false,data:p.v85WmData!==false,location:!!p.v85WmLocation,time:p.v85WmTime!==false,pos:p.v85WmPos||w.pos||'bl',photoMode:w.photoMode||'wm',opacity:Math.max(4,Math.min(32,Number(p.v876WmOpacity)||15)),...locationPrefs()}",
    'v876 watermark preference shape');
  src=replaceOnce(src,
    "c.fillText(p.name.slice(0,34),x,yy);yy+=top?sm*1.28:-sm*1.28}c.fillStyle='rgba(232,234,239,.78)';c.font=`540 ${Math.max(9,Math.round(sm*.9))}px -apple-system,BlinkMacSystemFont,Arial`;c.fillText(time,x,yy);yy+=top?sm*1.18:-sm*1.18;if(p.location&&p.geo)c.fillText(coord(p.geo),x,yy);c.restore()",
    "c.fillText(p.name.slice(0,34),x,yy);yy+=top?sm*1.28:-sm*1.28}if(p.time){c.fillStyle='rgba(232,234,239,.78)';c.font=`540 ${Math.max(9,Math.round(sm*.9))}px -apple-system,BlinkMacSystemFont,Arial`;c.fillText(time,x,yy)}c.restore()",
    'v876 media metadata output');
  syntax(src,FILE);fs.writeFileSync(FILE,src);
}

// v8710 is the final visible preview + final-photo watermark owner.
{
  const FILE='v8710-watermark.js';
  let src=fs.readFileSync(FILE,'utf8');
  src=replaceOnce(src,
    "return{lang:p.v8710WmLang||'auto',resolvedLang:L,geo:p.v85LastGeo||null,place:manual||String(cache[L]||p.v8710PlaceName||p.v876LocationNameAuto||'').trim(),manual,location:p.v85WmLocation!==false,opacity:Math.max(4,Math.min(48,Number(p.v876WmOpacity)||18)),pos:p.v85WmPos||'br'}",
    "return{lang:p.v8710WmLang||'auto',resolvedLang:L,geo:p.v85LastGeo||null,place:manual||String(cache[L]||p.v8710PlaceName||p.v876LocationNameAuto||'').trim(),manual,name:p.v85WmName!==false,data:p.v85WmData!==false,location:p.v85WmLocation!==false,time:p.v85WmTime!==false,opacity:Math.max(4,Math.min(48,Number(p.v876WmOpacity)||18)),pos:p.v85WmPos||'br'}",
    'v8710 final watermark preference shape');
  src=replaceOnce(src,
    '.v8710LocationMeta{margin-top:12px;color:var(--dim);font-size:var(--axis-ui,15px);line-height:1.45}',
    '.v8710LocationMeta{margin-top:12px;color:var(--dim);font-size:var(--axis-ui,15px);line-height:1.45}#v876Coord{display:none!important}',
    'hide raw coordinate row');
  src=replaceRegexOnce(src,/function rankInfo\(x\)\{[\s\S]*?\}\nasync function reverse\(g,L=selectedLang\(\)\)\{[\s\S]*?\}\nfunction freshGeo/,
`function rankInfo(x){const d=String(x?.description||'').toLowerCase();if(/poi|point of interest|amenity|shop|business|building|premise|venue|attraction|station|mall|park|hospital|school|gym|fitness/.test(d))return 120;if(/road|street|avenue|boulevard|lane|highway|route/.test(d))return 105;if(/neigh|suburb|quarter|borough|village|hamlet|locality/.test(d))return 90;if(/district|county|municipality/.test(d))return 70;if(/city|town/.test(d))return 55;if(/state|province|region/.test(d))return 35;return 45}
function specific(j){const info=[...(j?.localityInfo?.informative||[]),...(j?.localityInfo?.administrative||[])].filter(x=>x?.name&&!/(postal|postcode|continent|country)/i.test(String(x.description||''))).sort((a,b)=>rankInfo(b)-rankInfo(a)||(Number(a.order)||999)-(Number(b.order)||999));const direct=[j?.locality,j?.city,j?.principalSubdivision].map(x=>String(x||'').trim()).filter(Boolean);const out=[];for(const x of [...info.map(x=>String(x.name||'').trim()),...direct]){if(!x||out.some(y=>norm(y)===norm(x)))continue;out.push(x);if(out.length>=3)break}return out.join(' · ')}
function preciseOsm(j){const a=j?.address||{},poi=String(j?.name||a.amenity||a.shop||a.leisure||a.tourism||a.office||a.attraction||'').trim(),roadName=String(a.road||a.pedestrian||a.residential||a.footway||a.cycleway||'').trim(),road=[roadName,String(a.house_number||'').trim()].filter(Boolean).join(' '),area=String(a.neighbourhood||a.quarter||a.suburb||a.city_district||a.borough||'').trim(),district=String(a.district||a.county||'').trim(),city=String(a.city||a.town||a.municipality||'').trim(),out=[];for(const x of [poi,road,area,district,city]){if(!x||/^(中国|china|中华人民共和国)$/i.test(x)||out.some(y=>norm(y)===norm(x)))continue;out.push(x);if(out.length>=3)break}return out.join(' · ')}
async function reverse(g,L=selectedLang()){if(!g)return'';const id=++placeReq;let n='';try{const lang=L==='zh'?'zh-CN,zh;q=0.9,en;q=0.5':'en,zh-CN;q=0.5',u=\`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=$\{encodeURIComponent(g.lat)\}&lon=$\{encodeURIComponent(g.lon)\}&zoom=18&addressdetails=1&namedetails=1&accept-language=$\{encodeURIComponent(lang)\}\`,r=await fetch(u,{cache:'no-store',headers:{Accept:'application/json'}});if(r.ok)n=preciseOsm(await r.json())}catch{}if(!n)try{const r=await fetch(\`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=$\{encodeURIComponent(g.lat)\}&longitude=$\{encodeURIComponent(g.lon)\}&localityLanguage=$\{L\}\`,{cache:'no-store'});if(r.ok)n=specific(await r.json())}catch{}if(id!==placeReq)return pref().place;const m=meta(),cache=m.prefs.v8711PlaceCache&&typeof m.prefs.v8711PlaceCache==='object'?m.prefs.v8711PlaceCache:{};if(n){cache[L]=n;m.prefs.v8711PlaceCache=cache;m.prefs.v8710PlaceName=n;m.prefs.v876LocationNameAuto=n}write(META,m);return n||pref().place}
function freshGeo`,
    'precise OSM location resolver');
  src=replaceOnce(src,
    "function currentName(){const n=$('#equipmentName')?.textContent.trim()||'TRAINING';return selectedLang()==='en'?englishName(n).toUpperCase():n}\nfunction coord(g){return g?`${Number(g.lat).toFixed(6)}, ${Number(g.lon).toFixed(6)}${Number.isFinite(Number(g.acc))?` · ±${Math.round(Number(g.acc))}m`:''}`:''}",
    "function currentName(){const n=$('#equipmentName')?.textContent.trim()||'TRAINING';return selectedLang()==='en'?englishName(n).toUpperCase():n}\nfunction previewData(){const rows=$$('#v8Sets .v8SetRow');if(rows.length){const vals=rows.map(r=>$$('span>b',r).map(x=>x.textContent.trim())),weights=[...new Set(vals.map(x=>x[0]).filter(Boolean))],reps=vals.map(x=>x[1]).filter(Boolean);if(weights.length===1&&reps.length&&new Set(reps).size===1)return `${weights[0]} kg · ${reps[0]} 次 × ${rows.length}`;return `${rows.length} 组 · 分组记录`}if(!$('#strengthFields')?.classList.contains('hidden')){const w=$('#weight')?.value||'—',r=$('#reps')?.value||'—';return `${w} kg · ${r} 次`}if(!$('#cardioFields')?.classList.contains('hidden'))return `${$('#duration')?.value||'—'} 分钟`;return''}\nfunction timeText(ts=Date.now()){const d=new Date(ts);return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`}",
    'final preview data helpers');
  src=replaceOnce(src,
    '<div class="v8710WmPreview" id="v8710WmPreview"><div class="v8710WmRail"><b>AXIS / RECORD</b><span id="v8710WmName"></span><span id="v8710WmLoc"></span></div></div>',
    '<div class="v8710WmPreview" id="v8710WmPreview"><div class="v8710WmRail"><b>AXIS / RECORD</b><span id="v8710WmName"></span><span id="v8710WmData"></span><span id="v8710WmLoc"></span><span id="v8710WmTime"></span></div></div>',
    'final preview rows');
  src=replaceRegexOnce(src,/function render\(\)\{[\s\S]*?\}\nfunction dbGet/,
`function render(){ensure();sync();const p=pref(),name=currentName(),data=previewData(),time=timeText();if($('#v8710LocationMeta'))$('#v8710LocationMeta').textContent=p.place||'尚未获取位置';if($('#v876LocationName'))$('#v876LocationName').textContent=p.place||'未获取';const set=(id,on,text)=>{const el=$(id);if(!el)return;el.textContent=text||'';el.style.display=on&&text?'block':'none'};set('#v8710WmName',p.name,name);set('#v8710WmData',p.data,data);set('#v8710WmLoc',p.location,p.place);set('#v8710WmTime',p.time,time)}
function dbGet`,
    'final preview preference contract');
  src=replaceRegexOnce(src,/async function stamp\(blob,e\)\{[\s\S]*?\}\nasync function newest/,
`async function stamp(blob,e){const url=URL.createObjectURL(blob),img=new Image();await new Promise((ok,no)=>{img.onload=ok;img.onerror=no;img.src=url});const cv=D.createElement('canvas');cv.width=img.naturalWidth;cv.height=img.naturalHeight;const c=cv.getContext('2d',{alpha:false});c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(img,0,0,cv.width,cv.height);URL.revokeObjectURL(url);const p=pref(),L=p.resolvedLang,W=cv.width,H=cv.height,base=Math.max(20,Math.round(W*.0215)),big=Math.max(25,Math.round(W*.027)),pd=Math.max(22,Math.round(W*.03));c.save();c.globalAlpha=Math.max(.10,p.opacity/100);c.fillStyle='#737cff';c.textAlign='center';c.textBaseline='middle';c.font=\`800 $\{Math.max(74,Math.round(W*.12))\}px -apple-system,BlinkMacSystemFont,Arial\`;c.fillText('A X I S',W/2,H*.48);c.globalAlpha=1;c.fillStyle='rgba(115,124,255,.72)';c.fillRect(W*.12,H*.555,W*.76,Math.max(2,Math.round(W*.0025)));const name=L==='en'?englishName(e.name||'TRAINING').toUpperCase():(e.name||'训练'),time=timeText(e.time||Date.now()),data=eventData(e,L),rows=[];if(p.name)rows.push({text:name,size:big,weight:680,color:'#fff'});if(p.data&&data)rows.push({text:data,size:base,weight:580,color:'rgba(255,255,255,.96)'});if(p.location&&p.place)rows.push({text:p.place,size:base,weight:540,color:'rgba(255,255,255,.91)'});if(p.time)rows.push({text:time,size:base,weight:540,color:'rgba(255,255,255,.86)'});const maxText=Math.round(W*.52),lineH=Math.round(base*1.38),boxW=Math.min(Math.round(W*.62),Math.max(Math.round(W*.40),maxText+pd)),boxH=lineH*(1+rows.length)+pd*1.35,[x,y]=panelRect(W,H,p.pos,boxW,boxH,pd),right=p.pos==='tr'||p.pos==='br';c.fillStyle='rgba(5,7,10,.70)';c.fillRect(x,y,boxW,boxH);c.fillStyle='#737cff';c.fillRect(right?x+boxW-Math.max(3,W*.004):x,y,Math.max(3,W*.004),boxH);const tx=right?x+boxW-pd:x+pd;c.textAlign=right?'right':'left';c.textBaseline='top';c.shadowColor='rgba(0,0,0,.75)';c.shadowBlur=Math.max(4,W*.004);c.fillStyle='#fff';c.font=\`720 $\{base\}px -apple-system,BlinkMacSystemFont,'PingFang SC',Arial\`;c.fillText('AXIS / RECORD',tx,y+pd*.55);let yy=y+pd*.55+lineH;for(const row of rows){const size=fit(c,row.text,boxW-pd*2,row.size,row.weight,Math.max(13,base-6));c.font=\`$\{row.weight\} $\{size\}px -apple-system,BlinkMacSystemFont,'PingFang SC',Arial\`;c.fillStyle=row.color;c.fillText(row.text,tx,yy);yy+=lineH}c.restore();return new Promise(ok=>cv.toBlob(ok,'image/jpeg',.97))}
async function newest`,
    'final stamped watermark preference contract');
  src=replaceOnce(src,
    "m.prefs.v876WmOpacity=4;m.prefs.v85WmPos='bl';m.prefs.v85WmLocation=false;write(META,m);setTimeout(()=>finishStamp(a),0)",
    "m.prefs.v876WmOpacity=4;m.prefs.v85WmPos='bl';m.prefs.v85WmName=false;m.prefs.v85WmData=false;m.prefs.v85WmLocation=false;m.prefs.v85WmTime=false;write(META,m);setTimeout(()=>finishStamp(a),0)",
    'legacy optional watermark suppression');
  src=replaceOnce(src,
    "old:{opacity:Number(p.v876WmOpacity)||18,pos:p.v85WmPos||'br',location:p.v85WmLocation!==false}",
    "old:{opacity:Number(p.v876WmOpacity)||18,pos:p.v85WmPos||'br',name:p.v85WmName!==false,data:p.v85WmData!==false,location:p.v85WmLocation!==false,time:p.v85WmTime!==false}",
    'watermark preference snapshot');
  src=replaceOnce(src,
    "m.prefs.v876WmOpacity=a.old.opacity;m.prefs.v85WmPos=a.old.pos;m.prefs.v85WmLocation=a.old.location;write(META,m);render()",
    "m.prefs.v876WmOpacity=a.old.opacity;m.prefs.v85WmPos=a.old.pos;m.prefs.v85WmName=a.old.name;m.prefs.v85WmData=a.old.data;m.prefs.v85WmLocation=a.old.location;m.prefs.v85WmTime=a.old.time;write(META,m);render()",
    'watermark preference restoration');
  src=replaceOnce(src,
    "D.addEventListener('input',e=>{if(e.target.id==='v877OpacityRange'||e.target.id==='v876OpacityRange')setTimeout(render,0)},true);",
    "D.addEventListener('input',e=>{if(e.target.id==='v877OpacityRange'||e.target.id==='v876OpacityRange')setTimeout(render,0)},true);D.addEventListener('click',e=>{if(e.target.closest('#v85WmName,#v85WmData,#v85WmLocation,#v85WmTime'))setTimeout(render,0)},false);",
    'final preview switch repaint');
  if(/toFixed\(6\).*±|LAT |LON |纬度 .*经度/.test(src))fail('raw coordinate presentation survived final watermark owner');
  syntax(src,FILE);fs.writeFileSync(FILE,src);
}

console.log('[AXIS 8.8 watermark] convergence passed · four explicit switches · precise OSM place naming · no raw coordinate output');
