(()=>{'use strict';
const D=document,$=(s,r=D)=>r.querySelector(s),$$=(s,r=D)=>Array.from(r.querySelectorAll(s));
const META='axis_v8_meta';
function readMeta(){try{const m=JSON.parse(localStorage.getItem(META)||'null')||{};m.events=m.events||{};m.prefs=m.prefs||{};return m}catch{return{events:{},prefs:{}}}}
function writeMeta(m){try{localStorage.setItem(META,JSON.stringify(m));return true}catch{return false}}
function normalizeTarget(v){const n=Math.round(Number(v)||0);return n<=0?0:Math.max(1,Math.min(480,n))}
function migrate(){const m=readMeta(),p=m.prefs||{};if(p.v872SessionTarget==null)p.v872SessionTarget=normalizeTarget(p.v86SessionTarget);p.v86SessionTarget=normalizeTarget(p.v872SessionTarget);p.v87Motion='off';p.v871Motion='off';m.prefs=p;writeMeta(m)}
function retireMotion(){const m=readMeta();let dirty=false;if(m.prefs.v87Motion!=='off'){m.prefs.v87Motion='off';dirty=true}if(m.prefs.v871Motion!=='off'){m.prefs.v871Motion='off';dirty=true}if(dirty)writeMeta(m);const motion=$('#v871Motion')||$('#v87Motion');if(motion){const top=motion.previousElementSibling;if(top?.classList.contains('v87Top')&&top.querySelector('span')?.textContent.trim()==='晃动')top.remove();motion.remove()}for(const top of $$('#v87Audio .v87Top')){if(top.querySelector('span')?.textContent.trim()==='晃动')top.remove()}}
function target(){const p=readMeta().prefs||{};return normalizeTarget(p.v872SessionTarget!=null?p.v872SessionTarget:p.v86SessionTarget)}
function persistTarget(v){const n=normalizeTarget(v),m=readMeta();m.prefs.v872SessionTarget=n;m.prefs.v86SessionTarget=n;writeMeta(m);syncTargetUI();return n}
function syncTargetUI(){retireMotion();const n=target(),label=$('#v87Session b');if(label)label.textContent=n?`${n}分`:'关闭';const old=$('#v86Session b');if(old)old.textContent=n?`${n}分`:'关闭';const grid=$('#v86TargetGrid');if(grid)$$('button',grid).forEach(b=>b.classList.toggle('active',Number(b.dataset.v)===n));const input=$('#v86TargetInput');if(input&&D.activeElement!==input)input.value=n&&![60,90,120,150,180].includes(n)?String(n):''}
function prepareSheet(){const sheet=$('#v86TargetSheet');if(!sheet)return;sheet.classList.add('show');syncTargetUI();const input=$('#v86TargetInput');if(input){const n=target();input.placeholder=n?`当前 ${n} 分`:'自定分钟'}}
function adoptLegacy(){const m=readMeta(),legacy=normalizeTarget(m.prefs?.v86SessionTarget);m.prefs.v872SessionTarget=legacy;m.prefs.v86SessionTarget=legacy;writeMeta(m);syncTargetUI()}
function install(){D.addEventListener('click',e=>{if(e.target.closest('#settingsBtn'))setTimeout(()=>{retireMotion();syncTargetUI()},140);if(e.target.closest('#v87Session'))setTimeout(prepareSheet,0);if(e.target.closest('#v86TargetGrid [data-v]')||e.target.closest('#v86TargetApply'))setTimeout(adoptLegacy,0)},true);window.addEventListener('pageshow',()=>setTimeout(()=>{retireMotion();syncTargetUI()},80));D.addEventListener('visibilitychange',()=>{if(!D.hidden){retireMotion();syncTargetUI()}})}
function boot(){migrate();retireMotion();syncTargetUI();install();const v=$('.versionLine');if(v)v.textContent='版本 8.7.2'}
try{boot()}catch(e){console.warn('[AXIS] 8.7.2 fix skipped',e)}
})();