import fs from 'node:fs';

const FILE='v61.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 Group Plan render owner] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(src.includes('__AXIS_8123_GROUP_PLAN_RENDER_OWNER__'))fail('render owner already installed');

/*
 * The launcher is part of the canonical v61 set markup itself. This is the
 * only boundary that cannot be erased by a later innerHTML repaint: every
 * repaint recreates the launcher in the same transaction as the set rows.
 */
const resetRows="${prevEvent?'<button class=\"v81Reset\" id=\"resetPrevious8\">恢复上次</button>':''}<div class=\"v8SetRows\">";
const embedded="${prevEvent?'<button class=\"v81Reset\" id=\"resetPrevious8\">恢复上次</button>':''}<button type=\"button\" class=\"v875PlanEntry v8121PlanButton v8123PlanEntry\" data-v875-plan=\"1\" data-v8123-plan=\"1\" aria-label=\"打开组计划\"><span><b>组计划</b><small>批量设置重量与次数</small></span><strong>${draft.length}组</strong><i>›</i></button><div class=\"v8SetRows\">";
const templateCount=src.split(resetRows).length-1;
if(templateCount!==1)fail(`canonical set template boundary expected once, found ${templateCount}`);
src=src.replace(resetRows,embedded);

/*
 * Keep one tiny render-tail normalizer as a defensive invariant for inherited
 * modules that may append a duplicate launcher. It never creates a second
 * interaction owner; it only dedupes/refreshes the canonical markup above.
 */
const render='function renderSets(){';
const renderCount=src.split(render).length-1;if(renderCount!==1)fail(`renderSets expected once, found ${renderCount}`);
const helper=`function axis8123EnsurePlanEntry(){
 const h=$('#v8Sets');if(!h||h.classList.contains('hidden'))return;const head=$('.v8SetHead',h);if(!head)return;
 const all=$$('.v875PlanEntry',h);let entry=all.shift()||null;all.forEach(x=>x.remove());
 if(!entry){entry=D.createElement('button');(($('#resetPrevious8',h))||head).insertAdjacentElement('afterend',entry)}
 entry.type='button';entry.className='v875PlanEntry v8121PlanButton v8123PlanEntry';entry.dataset.v875Plan='1';entry.dataset.v8123Plan='1';entry.setAttribute('aria-label','打开组计划');
 const owned=window.__AXIS_RECORDING__?.snapshot?.(),n=Math.max(1,Number(owned?.count)||$$('.v8SetRow',h).length||1);
 const label=entry.querySelector('small')?.textContent||'批量设置重量与次数';entry.innerHTML='<span><b>组计划</b><small>'+label+'</small></span><strong>'+n+'组</strong><i>›</i>'
}
try{window.__AXIS_8123_GROUP_PLAN_RENDER_OWNER__={version:'8.12.3',owner:'v61-renderSets',creation:'canonical-innerHTML',buttonClass:'v8121PlanButton',dataset:'v875Plan+v8123Plan',staleNode:false}}catch{}
`;
src=src.replace(render,helper+render);
const old="emitRecording('axis:recording-render');queueMicrotask(()=>window.__AXIS_GROUP_PLAN_SYNC__?.())}";
const next="axis8123EnsurePlanEntry();emitRecording('axis:recording-render');queueMicrotask(()=>window.__AXIS_GROUP_PLAN_SYNC__?.())}";
const eventCount=src.split(old).length-1;if(eventCount!==1)fail(`recording-render boundary expected once, found ${eventCount}`);
src=src.replace(old,next);
for(const needle of ['__AXIS_8123_GROUP_PLAN_RENDER_OWNER__',"creation:'canonical-innerHTML'",'data-v8123-plan=\\"1\\"',"className='v875PlanEntry v8121PlanButton v8123PlanEntry'",'axis8123EnsurePlanEntry();emitRecording'])if(!src.includes(needle))fail(`missing ${needle}`);
try{new Function(src)}catch(e){fail(`v61 syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 Group Plan render owner] PASS · launcher is emitted inside every canonical v61 set render and normalized once at the same recording boundary');
