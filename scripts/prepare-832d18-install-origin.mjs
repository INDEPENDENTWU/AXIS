import fs from 'node:fs';

const fail=message=>{throw Error('[AXIS 8.32d18 provenance] '+message)};
const file='index.html';
const original=fs.readFileSync(file,'utf8');
const anchor='<div class="versionLine">';
if(original.split(anchor).length!==2)fail('expected one inherited Settings footer');
if(original.includes('id="axisOriginReport"'))fail('duplicate origin readout');

const row=`<div id="axisOriginReport" class="axisOriginReport" role="status" aria-live="polite" aria-label="版本與網站來源" data-axis-origin-state="pending">讀取版本與網站來源…</div>`;
const html=original.replace(anchor,row+'\n  '+anchor);
if(html===original)fail('Settings readout slot not inserted');
fs.writeFileSync(file,html);

const boot=`<script id="axisOriginBoot">
/* AXIS 8.32d18 — read-only installed-origin provenance. No storage or facts writer. */
(()=>{
 const report=document.getElementById('axisOriginReport');
 const sheet=document.getElementById('settingsSheet');
 if(!report||!sheet)return;
 const host=location.hostname;
 const provider=/(^|\\.)vercel\\.app$/i.test(host)?'Vercel':/(^|\\.)edgeone\\.cool$/i.test(host)?'EdgeOne':host==='axis.juele.fun'?'正式網域':'目前網域';
 const place=host+' · '+provider;
 let requested=false;
 const fmt=s=>String(s||'').trim();
 const render=(line,status)=>{
   report.textContent=place+' · '+line;
   report.dataset.axisOriginState=status;
 };
 async function inspect(){
  if(requested)return;requested=true;
  render('正在核對版本…','pending');
  try{
   const url=new URL('/axis-build.json',location.origin);
   const response=await fetch(url.href,{cache:'no-store',credentials:'same-origin'});
   if(!response.ok)throw Error('manifest unavailable');
   const info=await response.json();
   const version=fmt(info.version),source=fmt(info.sourceCommit);
   if(!/^\\d+\\.\\d+(?:\\.\\d+)?$/.test(version))throw Error('manifest version unavailable');
   const runtime=fmt(window.__AXIS_RELEASE__||document.documentElement.dataset.axisCanonical);
   const stamped=/^[a-f0-9]{40}$/i.test(source)?source.slice(0,9):'未標記';
   const drift=runtime&&runtime!==version;
   render('版本 '+version+' · '+stamped+(drift?' · 版本不一致，請檢查快取':''),drift?'mismatch':'ready');
  }catch{
   render('無法讀取網站版本；來源網域仍可確認','unavailable');
  }
 }
 const observe=new MutationObserver(()=>{if(sheet.classList.contains('show'))inspect()});
 observe.observe(sheet,{attributes:true,attributeFilter:['class']});
 if(sheet.classList.contains('show'))inspect();
})();
</script>`;
const out=fs.readFileSync(file,'utf8');
const close='</body>';
if(out.split(close).length!==2)fail('expected one HTML closing body');
fs.writeFileSync(file,out.replace(close,boot+'\n'+close));

const css=`\n/* d18: read-only source identity in the inherited Settings footer. */\n#axisOriginReport{margin:4px 18px 4px;line-height:1.45;font-size:11px;letter-spacing:.01em;overflow-wrap:anywhere;text-align:center;color:var(--muted,#89919e)}\n#axisOriginReport[data-axis-origin-state="mismatch"]{color:var(--warn,#bd7133)}\n`;
fs.appendFileSync('axis-832d14-theme.css',css);
console.log('[AXIS d18] Settings install-origin provenance reads only same-origin build identity');
