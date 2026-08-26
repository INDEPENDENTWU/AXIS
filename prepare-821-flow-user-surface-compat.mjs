import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Flow user surface compat] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const hits=src.split(from).length-1;if(hits!==1)fail(`${label} expected once, found ${hits}`);src=src.replace(from,to)};

/*
 * The runtime API intentionally leaves a committed current-step Encounter bound
 * to FlowRun until an orchestrator explicitly advances it. The visible Flow UI
 * may automate that transition only when *it* opened Record Current. This keeps
 * direct/runtime clients deterministic and prevents an unrelated ordinary Quick
 * Record from consuming Flow intent merely because it references the same Object.
 */
once(
 "let axis821FlowDraft=null,axis821FlowEditingId=null,axis821FlowPick=false,axis821FlowAwaitCustom=false,axis821FlowCustomBefore=null;",
 "let axis821FlowDraft=null,axis821FlowEditingId=null,axis821FlowPick=false,axis821FlowAwaitCustom=false,axis821FlowCustomBefore=null,axis821FlowAwaitStepRef=null;",
 'visible Flow pending-step state'
);
once(
 "function axis821FlowSurfaceStart(id){const api=axis821FlowSurfaceApi();if(!api)return;const run=api.run?.();if(run?.status==='active'&&run.flowRef!==id&&!confirm('当前流程还在进行，切换到这个流程？'))return;const ctx=api.launch(id);if(!ctx)return;axis821FlowSurfaceClose();axis821FlowSurfaceRenderHome();toast('流程已开始')}",
 "function axis821FlowSurfaceStart(id){const api=axis821FlowSurfaceApi();if(!api)return;const run=api.run?.();if(run?.status==='active'&&run.flowRef!==id&&!confirm('当前流程还在进行，切换到这个流程？'))return;axis821FlowAwaitStepRef=null;const ctx=api.launch(id);if(!ctx)return;axis821FlowSurfaceClose();axis821FlowSurfaceRenderHome();toast('流程已开始')}",
 'launch clears stale pending advance'
);
once(
 "function axis821FlowSurfaceRecord(){const api=axis821FlowSurfaceApi(),ctx=api?.current?.();if(!ctx)return;api.selectCurrent?.();const q=window.__AXIS_QUICK_RECORD__;if(q?.openFor)return q.openFor(ctx.objectRef);toast('记录入口尚未就绪')}",
 "function axis821FlowSurfaceRecord(){const api=axis821FlowSurfaceApi(),ctx=api?.current?.();if(!ctx)return;api.selectCurrent?.();const q=window.__AXIS_QUICK_RECORD__;if(q?.openFor){axis821FlowAwaitStepRef=ctx.stepRef;const opened=q.openFor(ctx.objectRef);if(opened===false)axis821FlowAwaitStepRef=null;return opened}axis821FlowAwaitStepRef=null;toast('记录入口尚未就绪')}",
 'Record Current owns automatic advance intent'
);
once(
 "function axis821FlowSurfaceOther(){const q=window.__AXIS_QUICK_RECORD__;if(q?.open)return q.open();toast('记录入口尚未就绪')}",
 "function axis821FlowSurfaceOther(){axis821FlowAwaitStepRef=null;const q=window.__AXIS_QUICK_RECORD__;if(q?.open)return q.open();toast('记录入口尚未就绪')}",
 'ordinary Quick Record cannot consume Flow intent'
);
once(
 "function axis821FlowSurfaceSkip(){const api=axis821FlowSurfaceApi();if(!api?.skip?.())return;axis821FlowSurfaceRenderHome()}",
 "function axis821FlowSurfaceSkip(){axis821FlowAwaitStepRef=null;const api=axis821FlowSurfaceApi();if(!api?.skip?.())return;axis821FlowSurfaceRenderHome()}",
 'skip clears pending advance'
);
once(
 "function axis821FlowSurfaceFinish(){const api=axis821FlowSurfaceApi();if(!api?.run?.())return;api.finish?.();axis821FlowSurfaceRenderHome()}",
 "function axis821FlowSurfaceFinish(){axis821FlowAwaitStepRef=null;const api=axis821FlowSurfaceApi();if(!api?.run?.())return;api.finish?.();axis821FlowSurfaceRenderHome()}",
 'finish clears pending advance'
);
once(
 "function axis821FlowSurfaceDismiss(){axis821FlowSurfaceApi()?.finish?.();axis821FlowSurfaceRenderHome()}",
 "function axis821FlowSurfaceDismiss(){axis821FlowAwaitStepRef=null;axis821FlowSurfaceApi()?.finish?.();axis821FlowSurfaceRenderHome()}",
 'dismiss clears pending advance'
);
once(
 "function axis821FlowSurfaceAfterEncounter(id){const api=axis821FlowSurfaceApi(),run=api?.run?.();if(!run||run.status!=='active'||run.lastEncounterId!==id)return false;const ok=api.advance?.();axis821FlowSurfaceRenderHome();if(api.run?.()?.status==='complete')toast('流程已到末尾');return !!ok}",
 "function axis821FlowSurfaceAfterEncounter(id){const api=axis821FlowSurfaceApi(),run=api?.run?.(),ctx=api?.current?.();if(!axis821FlowAwaitStepRef||!ctx||ctx.stepRef!==axis821FlowAwaitStepRef||!run||run.status!=='active'||run.lastEncounterId!==id)return false;axis821FlowAwaitStepRef=null;const ok=api.advance?.();axis821FlowSurfaceRenderHome();if(api.run?.()?.status==='complete')toast('流程已到末尾');return !!ok}",
 'Encounter auto-advance is UI-intent scoped'
);

try{new Function(src)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.21 Flow user surface compat] PASS · automatic advance is scoped to visible Record Current intent · runtime/direct/ordinary Quick Record remains non-consuming');
