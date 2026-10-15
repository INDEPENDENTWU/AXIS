import fs from 'node:fs';

const fail=message=>{throw Error('[AXIS 8.32d18 provenance] '+message)};
const file='index.html';
const original=fs.readFileSync(file,'utf8');
// Historical preparation stamps aria-label and data-release attributes before 8.32.
const anchor='<div class="versionLine"';
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
 const provider=/(^|\\.)vercel\\.app$/i.test(host)?'Vercel':/(^|\\.)edgeone\\.cool$/i.test(host)?'EdgeOne':null;
 const terms={
  en:{label:'Version and website source',official:'Official domain',generic:'Current domain',pending:'Checking version…',version:'Version',unstamped:'Not stamped',mismatch:'Version mismatch; check cache',unavailable:'Cannot read version; website origin confirmed'},
  hant:{label:'版本與網站來源',official:'正式網域',generic:'目前網域',pending:'正在核對版本…',version:'版本',unstamped:'未標記',mismatch:'版本不一致，請檢查快取',unavailable:'無法讀取網站版本；來源網域仍可確認'},
  hans:{label:'版本与网站来源',official:'正式域名',generic:'当前域名',pending:'正在核对版本…',version:'版本',unstamped:'未标记',mismatch:'版本不一致，请检查缓存',unavailable:'无法读取网站版本；来源域名仍可确认'}
 };
 let requested=false,version='',source='',status='pending';
 const fmt=s=>String(s||'').trim();
 const strings=()=>{const l=(document.documentElement.lang||'').toLowerCase();return terms[l.startsWith('en')?'en':l.startsWith('zh-hant')||l.startsWith('zh-tw')?'hant':'hans']};
 const render=(value)=>{
  status=value;
  const t=strings(),place=host+' · '+(provider||(host==='axis.juele.fun'?t.official:t.generic));
  const stamped=/^[a-f0-9]{40}$/i.test(source)?source.slice(0,9):t.unstamped;
  const line=value==='pending'?t.pending:value==='unavailable'?t.unavailable:t.version+' '+version+' · '+stamped+(value==='mismatch'?' · '+t.mismatch:'');
  report.setAttribute('aria-label',t.label);
  report.textContent=place+' · '+line;
  report.dataset.axisOriginState=value;
 };
 async function inspect(){
  if(requested)return;requested=true;
  render('pending');
  try{
   const url=new URL('/axis-build.json',location.origin);
   const response=await fetch(url.href,{cache:'no-store',credentials:'same-origin'});
   if(!response.ok)throw Error('manifest unavailable');
   const info=await response.json();
   version=fmt(info.version);source=fmt(info.sourceCommit);
   if(!/^\\d+\\.\\d+(?:\\.\\d+)?$/.test(version))throw Error('manifest version unavailable');
   const runtime=fmt(window.__AXIS_RELEASE__||document.documentElement.dataset.axisCanonical);
   const drift=runtime&&runtime!==version;
   render(drift?'mismatch':'ready');
  }catch{
   render('unavailable');
  }
 }
 const observe=new MutationObserver(()=>{if(sheet.classList.contains('show'))inspect()});
 observe.observe(sheet,{attributes:true,attributeFilter:['class']});
 new MutationObserver(()=>render(status)).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
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
