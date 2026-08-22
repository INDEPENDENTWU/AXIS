import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.18 runtime crash seal] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};

/* The historical gallery geometry installer is generated into app.js. In the
   canonical isolated app module it must not rely on any outer selector alias. */
{
  const FILE='app.js';let s=read(FILE);
  const sig='function axis8123InstallEquipmentGalleryUIGeometry(){';
  const n=s.split(sig).length-1;if(n!==1)fail(`gallery geometry installer expected once, found ${n}`);
  const scope="const D=document,$=q=>D.querySelector(q),$$=q=>Array.from(D.querySelectorAll(q));";
  const old=sig+'const D=document;';
  const sealed=sig+scope;
  if(s.includes(old))s=s.replace(old,()=>sealed);
  else if(!s.includes(sealed))s=s.replace(sig,()=>sealed);
  if(!s.includes(sealed))fail('gallery geometry local selector scope missing');

  /* Early 8.18 used lastIndexOf('})();') and could land inside a historical
     appended IIFE. The original app owner is the root IIFE at the beginning of
     app.js; historical add-on IIFEs follow it. Relocate the full truth block to
     immediately before that first root close so it shares state/save/$/$$ and
     the canonical media helpers without creating a shadow owner. */
  const blockStart='/* AXIS 8.18 — Object Truth + Route Truth + Capture Preference foundation. */';
  const blockEnd="setTimeout(()=>{axis818RouteGuard();axis818RenderCapturePrefs();axis818RenderShelf()},260);";
  const bi=s.indexOf(blockStart),ei=bi<0?-1:s.indexOf(blockEnd,bi);
  if(bi<0||ei<0)fail('8.18 truth block boundaries missing');
  const after=ei+blockEnd.length;
  let truthBlock=s.slice(bi,after);

  /* Route Truth must be immune to historical $/$$ normalization. Earlier build
     stages may still expose the collection selector as $$(), or may already have
     collapsed it to $(). Exactly one known input form is accepted, then the final
     runtime is forced to native querySelectorAll. */
  const routeCollections=[
    {
      variants:["for(const v of $$('.view,.page'))","for(const v of $('.view,.page'))"],
      to:"for(const v of Array.from(D.querySelectorAll('.view,.page')))"
    },
    {
      variants:["for(const b of $$('[data-view]'))","for(const b of $('[data-view]'))"],
      to:"for(const b of Array.from(D.querySelectorAll('[data-view]')))"
    }
  ];
  for(const {variants,to} of routeCollections){
    const hits=variants.reduce((n,from)=>n+(truthBlock.split(from).length-1),0);
    const nativeHits=truthBlock.split(to).length-1;
    if(nativeHits===1&&hits===0)continue;
    if(hits!==1||nativeHits!==0)fail(`route collection selector expected one known source form, found source ${hits}, native ${nativeHits}: ${variants.join(' | ')}`);
    const from=variants.find(x=>truthBlock.includes(x));
    truthBlock=truthBlock.replace(from,()=>to);
    if(truthBlock.split(to).length-1!==1)fail(`route native selector convergence failed: ${to}`);
  }
  if(/for\(const [vb] of \$+\(/.test(truthBlock))fail('Route Truth collection helper survived');

  s=s.slice(0,bi)+s.slice(after);
  const rootClose=s.indexOf('})();');
  if(rootClose<0)fail('canonical root IIFE close missing');
  s=s.slice(0,rootClose)+truthBlock+'\n'+s.slice(rootClose);
  const truthAt=s.indexOf(blockStart),closeAt=s.indexOf('})();');
  if(truthAt<0||truthAt>closeAt)fail('8.18 truth block escaped canonical root IIFE');
  syntax(s,FILE);write(FILE,s);
}

/* v874 remains the sole visible custom-object editor. 8.18 extends its existing
   public namespace; it must tolerate historical builds where that namespace was
   not materialized before the metric extension is appended. */
{
  const FILE='v874-professional.js';let s=read(FILE);
  const from='window.__AXIS_CUSTOM_EDITOR__.metricSchema=()=>axis818MetricDraft.map(x=>({...x}));';
  const to="window.__AXIS_CUSTOM_EDITOR__=window.__AXIS_CUSTOM_EDITOR__||{};window.__AXIS_CUSTOM_EDITOR__.metricSchema=()=>axis818MetricDraft.map(x=>({...x}));";
  const legacy=s.split(from).length-1,sealed=s.split(to).length-1;
  if(legacy===1&&sealed===0)s=s.replace(from,()=>to);
  else if(!(legacy===0&&sealed===1))fail(`custom editor metric namespace expected one form, legacy ${legacy}, sealed ${sealed}`);
  if(!s.includes(to))fail('custom editor metric namespace seal missing');
  syntax(s,FILE);write(FILE,s);
}

console.log('[AXIS 8.18 runtime crash seal] PASS · gallery selector scope self-contained · truth block rooted in canonical app IIFE · Route Truth native-selector sealed · v874 metric namespace initialized without new owner');
