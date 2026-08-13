(()=>{'use strict';
const VERSION='8.7.8';
function reveal(){const v=document.querySelector('.versionLine');if(v){v.textContent=`版本 ${VERSION}`;v.style.visibility='visible';v.dataset.axisVersion=VERSION}document.getElementById('axisVersionBootStyle')?.remove();window.__AXIS_VERSION__=VERSION;window.__AXIS_878_READY__=true}
function cleanUrl(){try{const u=new URL(location.href);if((u.pathname==='/'||u.pathname==='/index.html')&&(u.searchParams.has('axisboot')||u.searchParams.has('safe')||u.searchParams.get('v')==='878'))history.replaceState(history.state,'','/')}catch{}}
window.addEventListener('pageshow',e=>{reveal();if(e.persisted&&!window.__AXIS_LATEST_READY__){try{const u=new URL(location.href);u.searchParams.set('axisboot','878');u.searchParams.set('v','878');location.replace(u.pathname+'?'+u.searchParams.toString())}catch{location.reload()}}});
requestAnimationFrame(()=>{reveal();setTimeout(cleanUrl,80)});
})();