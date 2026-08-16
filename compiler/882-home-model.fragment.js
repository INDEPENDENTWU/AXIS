const HOME_META='axis_v8_meta';
function homeMeta(){try{const m=JSON.parse(localStorage.getItem(HOME_META)||'null')||{};m.events=m.events||{};m.prefs=m.prefs||{};return m}catch{return{events:{},prefs:{}}}}
function homeClock(ms){ms=Math.max(0,Number(ms)||0);const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);return h?h+':'+pad(m)+':'+pad(s):pad(m)+':'+pad(s)}
function homeGap(ms){ms=Math.max(0,Number(ms)||0);const d=Math.floor(ms/86400000),h=Math.floor(ms%86400000/3600000),m=Math.floor(ms%3600000/60000);if(d)return d+'天'+(h?' '+h+'小时':'');if(h)return h+'小时'+(m?' '+m+'分':'');return Math.max(0,m)+'分钟'}
function homeDurationLabel(ms){ms=Math.max(0,Number(ms)||0);if(ms<60000)return'<1分钟';const total=Math.max(1,Math.round(ms/60000)),h=Math.floor(total/60),m=total%60;return h?h+'小时'+(m?' '+m+'分钟':''):total+'分钟'}
function homeSameDay(a,b){const x=new Date(Number(a)||0),y=new Date(Number(b)||0);return x.getFullYear()===y.getFullYear()&&x.getMonth()===y.getMonth()&&x.getDate()===y.getDate()}
function homeActivityElapsed(a,t=Date.now()){return(a?.intervals||[]).reduce((n,x)=>n+Math.max(0,(x.end||((a.status==='active')?t:x.start))-x.start),0)}
function homePlanned(e,m){return Math.max(1,m.events?.[e.id]?.sets?.length||Number(e.sets)||1)}
function homeSessionEnd(s){if(!s)return 0;const xs=ev(s).map(e=>Number(e.time)||0).filter(Boolean);return Number(s.end)||Math.max(Number(s.start)||0,...xs)}
function homeCompletedSets(s,m){return ev(s).reduce((n,e)=>{if(e.kind!=='strength')return n;const sets=m.events?.[e.id]?.sets;if(Array.isArray(sets))return n+sets.filter(x=>x?.state!=='unfinished').length;return n+Math.max(1,Number(e.sets)||1)},0)}
function homeMedian(a){if(!a.length)return 0;const x=[...a].sort((p,q)=>p-q),i=Math.floor(x.length/2);return x.length%2?x[i]:(x[i-1]+x[i])/2}
function homeUsualGap(){const xs=(state.sessions||[]).slice(0,9).map(s=>Number(s.start)||0).filter(Boolean),ds=[];for(let i=0;i<xs.length-1;i++){const d=xs[i]-xs[i+1];if(d>=8*3600000&&d<=10*86400000)ds.push(d)}if(ds.length>=2)return homeMedian(ds);const f=Math.max(0,Number(state.profile.freq)||0);return f?Math.max(20*3600000,7*86400000/f):48*3600000}
function homeRestThreshold(m,e){const v=String(m.prefs?.reminderTiming||'auto');if(v==='90')return 90000;if(v==='120')return 120000;if(v==='180')return 180000;const vals=[];for(const h of (state.sessions||[]).flatMap(s=>ev(s)).filter(x=>x.equipmentId===e?.equipmentId).slice(0,8)){const ts=(m.events?.[h.id]?.sets||[]).map(s=>Number(s.doneAt)||0).filter(Boolean).sort((a,b)=>a-b);for(let i=1;i<ts.length;i++){const d=ts[i]-ts[i-1]-45000;if(d>=45000&&d<=360000)vals.push(d)}}return vals.length>=2?Math.max(75000,Math.min(240000,homeMedian(vals))):120000}
function deriveHomeState(t=Date.now()){
  const r7=recent(7),weekMins=r7.reduce((a,s)=>a+mins(s),0),weekSessions=r7.length;
  const base={visible:true,scope:'idle',mode:'ready',eyebrow:'现在',title:'准备开始',value:'—',meta:'今天还没有训练记录',progress:0,dial:'—',aLabel:'本周',a:weekMins+' 分钟',bLabel:'训练',b:weekSessions+' 次'};
  const s=state.active,m=homeMeta();
  if(s){
    const sesMs=Math.max(0,t-s.start);
    const pairs=ev(s).map(e=>({e,a:m.events?.[e.id]?.activity})).filter(x=>x.a);
    const active=pairs.filter(x=>x.a.status==='active').sort((x,y)=>(y.a.lastResumedAt||y.a.startedAt||0)-(x.a.lastResumedAt||x.a.startedAt||0))[0];
    const paused=pairs.filter(x=>x.a.status==='paused').sort((x,y)=>(y.a.pausedAt||0)-(x.a.pausedAt||x.a.startedAt||0))[0];
    if(active){
      const e=active.e,a=active.a,actual=homeActivityElapsed(a,t),est=Math.max(60000,Number(a.estimateMs)||actual||60000),total=homePlanned(e,m),done=Math.max(0,Number(a.completedSets)||0),rest=a.restStartedAt?Math.max(0,t-a.restStartedAt):0;
      if(rest){
        const th=homeRestThreshold(m,e),over=Math.max(0,rest-th),mode=over>120000?'danger':over>0?'warn':'rest',title=over>120000?'休息过久':over>0?'休息偏久':'组间休息';
        return{...base,visible:false,scope:'activity',mode,title,value:homeClock(rest),meta:e.name+' · 建议 '+homeClock(th),progress:Math.min(1,rest/th),dial:over?'+'+homeClock(over):Math.max(0,Math.round((th-rest)/1000))+'s',aLabel:'完成',a:e.kind==='strength'?done+'/'+total+' 组':'进行中',bLabel:over?'已超出':'还剩',b:over?homeClock(over):homeClock(Math.max(0,th-rest))};
      }
      const itemSuffix=e.kind==='strength'?' · '+done+'/'+total+'组':'';
      return{...base,visible:false,scope:'activity',mode:'active',title:'正在训练',value:homeClock(actual),meta:e.name+itemSuffix+' · 剩余 '+homeClock(Math.max(0,est-actual)),progress:Math.min(1,actual/est),dial:Math.round(Math.min(1,actual/est)*100)+'%',aLabel:'本次',a:homeClock(sesMs),bLabel:'已记录',b:ev(s).length+' 项'};
    }
    if(paused){
      const e=paused.e,a=paused.a,pause=Math.max(0,t-(a.pausedAt||t)),actual=homeActivityElapsed(a,t),total=homePlanned(e,m),done=Math.max(0,Number(a.completedSets)||0);
      return{...base,visible:false,scope:'activity',mode:'paused',title:'项目暂停',value:homeClock(pause),meta:e.name+' · 实际 '+homeClock(actual),progress:0,dial:'Ⅱ',aLabel:'完成',a:e.kind==='strength'?done+'/'+total+' 组':'暂停',bLabel:'本次',b:homeClock(sesMs)};
    }
    const events=ev(s);
    if(events.length){
      const last=events[events.length-1],la=m.events?.[last.id]?.activity,end=Number(la?.finishedAt)||Number(last.time)||s.start,gap=Math.max(0,t-end),th=Math.max(180000,homeRestThreshold(m,last)*1.5),over=Math.max(0,gap-th),mode=over>180000?'danger':over>0?'warn':'between';
      const title=over>180000?'间歇过长':over>0?'可以开始下一项':'项目间歇';
      const meta=over?last.name+' 已完成 · 已超出建议 '+homeClock(over):last.name+' 已完成 · 建议间隔 '+homeClock(th);
      return{...base,visible:true,scope:'transition',mode,title,value:homeClock(gap),meta,progress:Math.min(1,gap/th),dial:over?'+'+homeClock(over):homeClock(Math.max(0,th-gap)),aLabel:'',a:'',bLabel:'',b:''};
    }
    return{...base,visible:false,scope:'activity',mode:'session',title:'训练已开始',value:homeClock(sesMs),meta:'等待第一项记录',progress:0,dial:'●',aLabel:'已记录',a:'0 项',bLabel:'状态',b:'进行中'};
  }
  const last=state.sessions?.[0];
  if(!last)return base;
  const end=homeSessionEnd(last),gap=Math.max(0,t-end),span=Math.max(0,(Number(last.end)||end)-(Number(last.start)||end));
  if(homeSameDay(end,t)){
    const items=ev(last).length,sets=homeCompletedSets(last,m),parts=[items+'项'];if(sets)parts.push(sets+'组');parts.push('完成于 '+tlabel(end));
    return{...base,scope:'complete',mode:'complete',eyebrow:'今天完成',title:'训练已记录',value:homeDurationLabel(span),meta:parts.join(' · '),progress:0,dial:'',aLabel:'',a:'',bLabel:'',b:''};
  }
  const usual=homeUsualGap();
  return{...base,scope:'recovery',mode:'recovery',eyebrow:'训练间隔',title:'距上次训练',value:homeGap(gap),meta:'上次 '+homeDurationLabel(span)+' · 常见约 '+homeGap(usual),progress:0,dial:'',aLabel:'',a:'',bLabel:'',b:''};
}
function renderHomeState(t=Date.now()){const x=deriveHomeState(t),h=$('#axisNowHero');if(!h)return;const show=x.visible!==false;h.hidden=!show;h.dataset.scope=x.scope||'idle';h.dataset.mode=x.mode;const tv=$('#todayView');if(tv)tv.classList.toggle('axisNowVisible',show);const top=h.querySelector('.axisNowTop>span');if(top)top.textContent=x.eyebrow||'现在';setText('#axisNowClock',tlabel(t));setText('#axisNowTitle',x.title);setText('#axisNowValue',x.value);setText('#axisNowMeta',x.meta);setText('#axisNowDialText',x.dial);setText('#axisNowFactALabel',x.aLabel);setText('#axisNowFactA',x.a);setText('#axisNowFactBLabel',x.bLabel);setText('#axisNowFactB',x.b);h.style.setProperty('--axis-now-p',String(Math.max(0,Math.min(1,x.progress||0))*360)+'deg');const r=$('#axisNowRailFill');if(r)r.style.width=Math.max(0,Math.min(1,x.progress||0))*100+'%';window.__AXIS_HOME_STATE__=x}
