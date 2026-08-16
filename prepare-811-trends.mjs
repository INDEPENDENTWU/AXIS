import fs from 'node:fs';

const INDEX='index.html',RUNTIME='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.11 trends] ${m}`)};
let html=fs.readFileSync(INDEX,'utf8');
const re=/<section class="view" id="insightsView">[\s\S]*?<\/section>/;
const matches=html.match(new RegExp(re.source,'g'))||[];
if(matches.length!==1)fail(`insights section expected once, found ${matches.length}`);
const view=`<section class="view" id="insightsView">
      <div class="pageHead"><h1>趋势</h1><span id="v811TrendGoal">状态场</span></div>
      <div class="v811StateField" id="v811StateField">
        <div class="v811StateHead"><div><span>当前状态</span><b id="v811StateName">未成形</b></div><em id="v811StateCount">0 次记录</em></div>
        <p id="v811StateLine">再留下几次真实记录，AXIS 才开始形成你的轨迹。</p>
        <svg id="v811Trajectory" class="v811Trajectory" viewBox="0 0 100 64" preserveAspectRatio="none" role="img" aria-label="个人训练轨迹"></svg>
        <div class="v811StateFoot"><span id="v811FieldMeta">从第一次到现在</span><b id="v811GoalName">目标 · 未设置</b></div>
      </div>
      <div class="section v811TrendSection"><div class="sectionHead"><b>这次让什么发生了</b><span id="v811EvidenceMeta"></span></div><div class="v811Evidence" id="v811Evidence"></div></div>
      <div class="section v811TrendSection v811NeedleSection"><div class="sectionHead"><b>下一针</b><span>只给一个</span></div><div class="v811Needle" id="v811Needle"></div></div>
      <div class="v811LegacyInsights" aria-hidden="true">
        <span id="insightSessions">0</span><span id="insightMins">0</span><span id="revisitRate">—</span><span id="coverageMeta">—</span>
        <div id="coverageGrid"></div><div id="evidenceList"></div><div id="rhythmGrid"></div><div id="nextCard"></div>
      </div>
    </section>`;
html=html.replace(re,view);
fs.writeFileSync(INDEX,html);

let src=fs.readFileSync(RUNTIME,'utf8'),end=src.lastIndexOf('})();');
if(end<0)fail('runtime IIFE end not found');
const block=String.raw`
/* AXIS 8.11 — State Field / 轨迹体. Evidence only, local only, no fitness score. */
function axis811TrendStyle(){
 if($('#v811TrendStyle'))return;
 const s=D.createElement('style');s.id='v811TrendStyle';s.textContent=
 '.v811LegacyInsights{display:none!important}.v811StateField{position:relative;overflow:hidden;margin:4px 0 2px;padding:24px 20px 18px;border-radius:28px;background:radial-gradient(120% 90% at 86% 0%,rgba(115,124,255,.14),transparent 52%),linear-gradient(180deg,rgba(255,255,255,.045),rgba(255,255,255,.018));min-height:390px;box-sizing:border-box}'+
 '.v811StateHead{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.v811StateHead span{display:block;color:#727b88;font-size:9.5px;letter-spacing:.04em}.v811StateHead b{display:block;margin-top:5px;color:#f1f0ed;font-size:38px;line-height:.98;letter-spacing:-.055em;font-weight:720}.v811StateHead em{font-style:normal;color:#757e8b;font-size:9.5px;padding-top:3px}'+
 '#v811StateLine{max-width:88%;min-height:40px;margin:14px 0 12px;color:#929aa6;font-size:11px;line-height:1.55}.v811Trajectory{display:block;width:100%;height:190px;overflow:visible}.v811Trajectory .lane{fill:none;stroke:rgba(255,255,255,.055);stroke-width:.7;stroke-dasharray:1.2 2.3}.v811Trajectory .trail{fill:none;stroke:rgba(198,201,255,.48);stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round}.v811Trajectory .ghost{fill:none;stroke:rgba(115,124,255,.10);stroke-width:7;stroke-linecap:round;stroke-linejoin:round}.v811Trajectory .node{fill:#aeb3ff;stroke:#11141a;stroke-width:1.1}.v811Trajectory .node.old{fill:#6f7785}.v811Trajectory .latest{fill:#daddff;stroke:#737cff;stroke-width:1.8}.v811Trajectory .halo{fill:none;stroke:rgba(115,124,255,.34);stroke-width:1}'+
 '.v811StateFoot{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:5px;padding-top:12px;border-top:1px solid rgba(255,255,255,.055)}.v811StateFoot span,.v811StateFoot b{font-size:9px;line-height:1.3}.v811StateFoot span{color:#646d79}.v811StateFoot b{color:#929aa6;font-weight:620;text-align:right}'+
 '.v811TrendSection{margin-top:28px!important}.v811Evidence{display:grid}.v811EvidenceRow{display:grid;grid-template-columns:18px minmax(0,1fr);gap:10px;padding:13px 0;border-top:1px solid rgba(255,255,255,.05)}.v811EvidenceRow:first-child{border-top:0}.v811EvidenceRow i{width:7px;height:7px;border-radius:50%;margin-top:5px;background:#737cff;box-shadow:0 0 0 5px rgba(115,124,255,.08)}.v811EvidenceRow b{display:block;color:#d8d9dd;font-size:12px;line-height:1.45;font-weight:630}.v811EvidenceEmpty{padding:14px 0;color:#737c89;font-size:10.5px;line-height:1.6}'+
 '.v811Needle{padding:2px 0 10px;color:#e6e5e2;font-size:20px;line-height:1.34;font-weight:660;letter-spacing:-.025em}.v811Needle small{display:block;margin-top:9px;color:#69727f;font-size:9.5px;line-height:1.5;font-weight:520;letter-spacing:0}'+
 '@media(max-width:390px){.v811StateField{padding:21px 17px 16px;min-height:365px}.v811StateHead b{font-size:34px}.v811Trajectory{height:178px}.v811Needle{font-size:18px}}';
 D.head.appendChild(s)
}
function axis811TrendCore(){
 try{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'null')||{};return{sessions:Array.isArray(c.sessions)?c.sessions:[],profile:c.profile&&typeof c.profile==='object'?c.profile:{}}}catch{return{sessions:[],profile:{}}}
}
function axis811TrendSessions(){return axis811TrendCore().sessions.filter(s=>s&&Number(s.start)&&Array.isArray(s.events)).slice().sort((a,b)=>Number(a.start)-Number(b.start))}
function axis811TrendMins(s){return Math.max(1,Math.round(((Number(s.end)||Number(s.start))-Number(s.start))/60000)||1)}
function axis811TrendDomain(s){
 const score={upper:0,lower:0,core:0,cardio:0},upper=['胸肌','背部','肩部','肱二头肌','肱三头肌','前臂','前锯肌'],lower=['臀部','股四头肌','腘绳肌','小腿','内收肌','髋屈肌','胫骨前肌'],core=['核心','腰部'];
 for(const e of s.events||[]){if(e.kind==='cardio')score.cardio+=3;for(const m of e.muscles||[]){if(upper.includes(m))score.upper++;else if(lower.includes(m))score.lower++;else if(core.includes(m))score.core++;else if(m==='心肺')score.cardio++}}
 const arr=Object.entries(score).sort((a,b)=>b[1]-a[1]),total=arr.reduce((n,x)=>n+x[1],0);if(!total)return'mixed';if(arr[0][1]/total<.52)return'mixed';return arr[0][0]
}
function axis811TrendGoalLabel(goal){return({health:'健康',muscle:'增肌',fat:'减脂',strength:'力量',cardio:'体能'})[goal]||'未设置'}
function axis811Median(a){if(!a.length)return 0;const x=a.slice().sort((m,n)=>m-n),i=Math.floor(x.length/2);return x.length%2?x[i]:(x[i-1]+x[i])/2}
function axis811TrendExpectedGap(ss,p){
 const f=Number(p.freq)||0;if(f>0)return 7/f;
 const gaps=[];for(let i=1;i<ss.length;i++){const g=(Number(ss[i].start)-Number(ss[i-1].start))/864e5;if(g>0&&g<31)gaps.push(g)}
 return axis811Median(gaps)||7
}
function axis811StrengthProgress(ss,scope=ss){
 const beforeEnd=scope.length?Number(scope[0].start):Infinity,prior=ss.filter(s=>Number(s.start)<beforeEnd).flatMap(s=>s.events||[]),out=[];
 for(const s of scope)for(const e of s.events||[]){if(e.kind!=='strength'||!e.equipmentId)continue;const old=prior.filter(x=>x.kind==='strength'&&x.equipmentId===e.equipmentId);if(!old.length)continue;
  const maxW=Math.max(...old.map(x=>Number(x.weight)||0)),w=Number(e.weight)||0,name=e.name||'这个动作';
  if(w>maxW&&maxW>0){out.push(name+' · '+(maxW%1?maxW.toFixed(1):maxW)+' → '+(w%1?w.toFixed(1):w)+' kg');continue}
  const same=old.filter(x=>Math.abs((Number(x.weight)||0)-w)<.001),best=same.length?Math.max(...same.map(x=>Number(x.reps)||0)):0,reps=Number(e.reps)||0;
  if(best&&reps>best)out.push(name+' · 同重量 '+best+' → '+reps+' 次')
 }
 return [...new Set(out)]
}
function axis811TrendEvidence(ss,p){
 if(!ss.length)return[];
 const latest=ss[ss.length-1],out=axis811StrengthProgress(ss,[latest]).slice(0,2),now=Date.now(),f=Number(p.freq)||0;
 if(out.length<3&&f){const count=ss.filter(s=>Number(s.start)>=now-14*864e5).length,target=f*2;if(count>=Math.max(2,Math.floor(target*.75)))out.push('最近14天 '+count+' 次 · 已接近你设定的每周 '+f+' 次节奏')}
 if(out.length<3&&ss.length>1){const d1=axis811TrendDomain(latest),prev=ss.slice(Math.max(0,ss.length-5),-1).map(axis811TrendDomain);if(!prev.includes(d1)&&d1!=='mixed')out.push('这次补上了'+({upper:'上肢',lower:'下肢',core:'核心',cardio:'心肺'}[d1]||d1)+' · 轨迹出现了新的方向')}
 if(out.length<3&&ss.length>1){const gap=(Number(latest.start)-Number(ss[ss.length-2].start))/864e5,expected=axis811TrendExpectedGap(ss,p);if(gap<=Math.max(7,expected*1.6))out.push('与上次间隔 '+Math.max(1,Math.round(gap))+' 天 · 轨迹保持连续')}
 if(!out.length)out.push('这次成为第 '+ss.length+' 个真实节点 · 还没有足够证据宣称进步，但可比较性正在增加')
 return out.slice(0,3)
}
function axis811TrendState(ss,p){
 const n=ss.length;if(!n)return{name:'未成形',line:'再留下 3 次真实记录，AXIS 才开始形成你的训练轨迹。'};
 if(n<3)return{name:'起点',line:'已经有 '+n+' 个节点。再记录 '+(3-n)+' 次，并重复至少一个主要动作，轨迹会开始变得可比较。'};
 const expected=axis811TrendExpectedGap(ss,p),last=ss[n-1],gap=(Date.now()-Number(last.start))/864e5;
 if(gap>Math.max(10,expected*2.5))return{name:'待续',line:'轨迹没有消失，只是暂时断开。下一次正常回来即可，不需要补量。'};
 const recent14=ss.filter(s=>Number(s.start)>=Date.now()-14*864e5).length,f=Number(p.freq)||0,aligned=f?recent14>=Math.max(2,Math.floor(f*2*.7)):gap<=Math.max(7,expected*1.7);
 const recent=ss.slice(-3),progress=axis811StrengthProgress(ss,recent).length>0,domains=new Set(ss.slice(-8).map(axis811TrendDomain));
 if(progress&&aligned)return{name:'推进',line:'最近的轨迹同时出现了连续性和可比较的训练进展；这不是评分，是由记录直接形成的状态。'};
 if(aligned&&domains.size>=3)return{name:'稳定',line:'你的训练节奏和覆盖正在形成稳定形状；继续维持，不需要为了数字刻意加量。'};
 return{name:'成形',line:'记录已经足够形成个人轨迹。接下来每一次重复，都会让“变化”更容易被看见。'}
}
function axis811TrendNeedle(ss,p){
 const n=ss.length,goal=p.goal||'';if(!n)return{main:'先留下第一条真实训练记录。',sub:'不用先把计划设计完整；AXIS 只从真实发生的训练里建立轨迹。'};
 if(n<3)return{main:'再完成 '+(3-n)+' 次，并重复至少一个主要动作。',sub:'先建立可比较性，比追求更多指标更重要。'};
 const all=ss.flatMap(s=>s.events||[]),strength=all.filter(e=>e.kind==='strength'),cardio=all.filter(e=>e.kind==='cardio');
 const freq={};for(const e of strength)if(e.equipmentId)freq[e.equipmentId]=(freq[e.equipmentId]||0)+1;
 const repeatId=Object.entries(freq).sort((a,b)=>b[1]-a[1])[0]?.[0],repeat=strength.slice().reverse().find(e=>e.equipmentId===repeatId);
 if(goal==='strength')return{main:repeat?'下一次优先重复「'+(repeat.name||'主要动作')+'」，保持可比较条件。':'下一次先固定一个主要力量动作，开始建立可比较轨迹。',sub:'不用为了“进步”刻意加重量；同条件重复本身就是关键证据。'};
 if(goal==='muscle'){const muscles=['胸肌','背部','肩部','臀部','股四头肌','腘绳肌','核心'],c=Object.fromEntries(muscles.map(x=>[x,0]));for(const e of all)for(const m of e.muscles||[])if(m in c)c[m]++;const m=muscles.sort((a,b)=>c[a]-c[b])[0];return{main:'下一次补一条「'+m+'」的有效记录。',sub:'目标是让增肌轨迹既有重复进展，也不过度集中在少数区域。'}}
 if(goal==='cardio'){const last=cardio[cardio.length-1];return{main:last?'下一次重复「'+(last.name||'同一种有氧')+'」，先把连续性拉出来。':'下一次加入一条可持续的心肺记录。',sub:'同一方式重复，比每次更换项目更容易形成真实趋势。'}}
 if(goal==='fat'){const recentCardio=ss.slice(-3).flatMap(s=>s.events||[]).some(e=>e.kind==='cardio');return recentCardio?{main:'下一次保持当前可持续节奏，不需要为了“减脂”突然加量。',sub:'AXIS 这里只判断训练连续性；没有身体趋势数据时不会宣称脂肪变化。'}:{main:'下一次补一条可持续的有氧记录。',sub:'它只作为训练连续性的证据；AXIS 不把一次有氧直接等同于减脂结果。'}}
 const recentDomains=new Set(ss.slice(-6).map(axis811TrendDomain)),order=[['upper','上肢'],['lower','下肢'],['core','核心'],['cardio','心肺']],miss=order.find(x=>!recentDomains.has(x[0]));
 if(goal==='health'&&miss)return{main:'下一次补上「'+miss[1]+'」这一方向。',sub:'健康目标优先让长期轨迹更完整，而不是追求单次极端强度。'};
 return{main:repeat?'下一次重复「'+(repeat.name||'一个主要动作')+'」，让轨迹多一个可比较点。':'下一次保持正常训练，并重复一个已经记录过的项目。',sub:'AXIS 会优先用重复记录判断真正变化。'}
}
function axis811TrendSvg(ss){
 const host=$('#v811Trajectory');if(!host)return;const rows={upper:14,mixed:25,core:36,lower:47,cardio:57},shown=ss.slice(-24);
 let lanes='';for(const y of [14,25,36,47,57])lanes+='<path class="lane" d="M2 '+y+' H98"/>';
 if(!shown.length){host.innerHTML=lanes+'<path class="ghost" d="M8 42 C28 22 54 48 92 24"/><path class="trail" d="M8 42 C28 22 54 48 92 24" opacity=".22"/>';return}
 const pts=shown.map((s,i)=>{const x=shown.length===1?12:6+i*(88/Math.max(1,shown.length-1)),y=rows[axis811TrendDomain(s)]||25,load=Math.min(1,(axis811TrendMins(s)+(s.events||[]).length*4)/95),r=2.1+load*2.2;return{x,y,r,s}});
 const d=pts.map((p,i)=>(i?'L':'M')+p.x.toFixed(2)+' '+p.y).join(' ');
 let nodes='';pts.forEach((p,i)=>{const latest=i===pts.length-1,old=i<Math.max(0,pts.length-6);if(latest)nodes+='<circle class="halo" cx="'+p.x+'" cy="'+p.y+'" r="'+(p.r+4.1)+'"/>';nodes+='<circle class="node '+(latest?'latest':old?'old':'')+'" cx="'+p.x+'" cy="'+p.y+'" r="'+p.r.toFixed(2)+'"/>'});
 host.innerHTML=lanes+'<path class="ghost" d="'+d+'"/><path class="trail" d="'+d+'"/>'+nodes
}
function axis811RenderTrends(){
 axis811TrendStyle();const c=axis811TrendCore(),ss=axis811TrendSessions(),p=c.profile||{},state=axis811TrendState(ss,p),evidence=axis811TrendEvidence(ss,p),needle=axis811TrendNeedle(ss,p);
 const set=(id,v)=>{const e=$('#'+id);if(e)e.textContent=v};
 set('v811TrendGoal','状态场');set('v811StateName',state.name);set('v811StateCount',ss.length+' 次记录');set('v811StateLine',state.line);set('v811GoalName','目标 · '+axis811TrendGoalLabel(p.goal));
 set('v811FieldMeta',ss.length?('从第一次到现在 · 最近显示 '+Math.min(24,ss.length)+' 个节点'):'轨迹等待第一条记录');set('v811EvidenceMeta',ss.length?'基于记录':'');
 const ev=$('#v811Evidence');if(ev)ev.innerHTML=evidence.length?evidence.map(x=>'<div class="v811EvidenceRow"><i></i><b>'+esc(x)+'</b></div>').join(''):'<div class="v811EvidenceEmpty">还没有足够证据。</div>';
 const nd=$('#v811Needle');if(nd)nd.innerHTML=esc(needle.main)+'<small>'+esc(needle.sub)+'</small>';
 axis811TrendSvg(ss)
}
axis811RenderTrends();
D.addEventListener('click',e=>{if(e.target?.closest?.('[data-view="insightsView"]'))axis811RenderTrends()},true);
try{window.__AXIS_811_TRENDS__={version:'8.11-candidate',model:'state-field-trajectory',states:['未成形','起点','成形','推进','稳定','待续'],goals:['health','muscle','fat','strength','cardio'],score:false,comparison:false,networkRequired:false,evidenceOnly:true,legacyInsightIdsPreserved:true}}catch{}
`;
src=src.slice(0,end)+block+'\n'+src.slice(end);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(RUNTIME,src);
console.log('[AXIS 8.11 trends] PASS · state field · trajectory body · goal-aware evidence · one next needle · legacy insight compatibility');
