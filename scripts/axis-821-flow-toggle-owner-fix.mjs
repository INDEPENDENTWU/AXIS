import fs from 'node:fs';

const file='prepare-821-flow-session-coordination.mjs';
let s=fs.readFileSync(file,'utf8');
const anchor="function axis821FlowSyncActiveSurface(active){const api=axis821FlowActiveApi(),foreground=api?.current?.(),id=state.flowRun?.currentEncounterId,duplicate=!!(id&&active&&(foreground?.id===id||(!foreground&&active.status==='paused')));D.body.classList.toggle('axis821-flow-integrated-active',duplicate)}\n";
if((s.split(anchor).length-1)!==1)throw new Error('[AXIS 8.21 Flow toggle] helper anchor drift');
const helper="function axis821FlowToggleCurrentActive(){const id=state.flowRun?.currentEncounterId,api=axis821FlowActiveApi(),own=id?api?.get?.(id):null;if(!id||!api||!own)return false;if(own.status==='active'){const ok=api.pause?.(id)===true;if(ok)axis821FlowSurfaceRenderHome?.();return ok}if(own.status==='paused')return axis821BeginCurrentItem();if(own.status==='finished')return axis821FlowOnActiveFinished(id);return false}\n";
s=s.replace(anchor,anchor+helper);
const old="if(e.target.closest?.('[data-axis-flow-active-toggle]')){axis821BeginCurrentItem();return}";
const next="if(e.target.closest?.('[data-axis-flow-active-toggle]')){axis821FlowToggleCurrentActive();return}";
if((s.split(old).length-1)!==1)throw new Error('[AXIS 8.21 Flow toggle] consumer anchor drift');
s=s.replace(old,next);
fs.writeFileSync(file,s);

const scope='prepare-821-flow-session-coordination-scope.mjs';
let q=fs.readFileSync(scope,'utf8');
const scopeAnchor="if(app.includes(\"[data-axis-flow-active-set]\"))fail('retired set-level Flow action returned');\n";
if((q.split(scopeAnchor).length-1)!==1)throw new Error('[AXIS 8.21 Flow toggle] scope anchor drift');
const proof="if(!app.includes('function axis821FlowToggleCurrentActive()')||!app.includes(\"own.status==='active'\")||!app.includes('api.pause?.(id)===true')||!app.includes(\"own.status==='paused'\")||!app.includes('return axis821BeginCurrentItem()'))fail('Flow Active toggle lost v87 pause / conflict-safe resume delegation');\n";
q=q.replace(scopeAnchor,scopeAnchor+proof);
fs.writeFileSync(scope,q);

fs.rmSync('scripts/axis-821-flow-toggle-owner-fix.mjs',{force:true});
fs.rmSync('.github/workflows/axis-821-flow-toggle-owner-fix.yml',{force:true});
console.log('[AXIS 8.21 Flow toggle] PASS · active delegates pause to v87 · paused resumes through existing conflict-safe path');
