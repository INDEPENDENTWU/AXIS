(()=>{'use strict';
const VERSION=window.__AXIS_RELEASE__||'8.7.8',TEXT=`版本 ${VERSION}`;
let versionObserver=null;
function reveal(){
  const v=document.querySelector('.versionLine');
  if(v){
    if(v.textContent!==TEXT)v.textContent=TEXT;
    if(v.dataset.axisVersion!==VERSION)v.dataset.axisVersion=VERSION;
    if(v.style.visibility!=='visible')v.style.visibility='visible';
    if(!versionObserver){
      const NativeMO=window.__AXIS_NATIVE_MUTATION_OBSERVER__||window.MutationObserver;
      if(NativeMO){
        versionObserver=new NativeMO(()=>{
          if(v.textContent!==TEXT||v.dataset.axisVersion!==VERSION||v.style.visibility!=='visible')reveal();
        });
        versionObserver.observe(v,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:['data-axis-version','style']});
      }
    }
  }
  document.getElementById('axisVersionBootStyle')?.remove();
  document.documentElement.dataset.axisRelease=VERSION;
  window.__AXIS_VERSION__=VERSION;
  window.__AXIS_878_READY__=true;
}
function cleanUrl(){try{const u=new URL(location.href);if((u.pathname==='/'||u.pathname==='/index.html')&&(u.searchParams.has('axisboot')||u.searchParams.has('safe')||u.searchParams.has('fresh')))history.replaceState(history.state,'','/')}catch{}}
window.addEventListener('pageshow',()=>reveal());
requestAnimationFrame(()=>{reveal();setTimeout(reveal,240);setTimeout(reveal,900);setTimeout(cleanUrl,980)});
})();
