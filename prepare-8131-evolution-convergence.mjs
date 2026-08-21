import fs from 'node:fs';

const INDEX='index.html',BUILD='build-hardened.mjs',V84='v84-runtime.js',APP='app.js',FIELD='v8131-evolution-field.js';
const fail=m=>{throw new Error(`[AXIS 8.13.1 evolution convergence] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};

let html=read(INDEX);
const re=/<section class="view" id="insightsView">[\s\S]*?<\/section>/;
const found=html.match(new RegExp(re.source,'g'))||[];
if(found.length!==1)fail(`insights surface expected once, found ${found.length}`);
if(!html.includes('id="v811StateField"'))fail('8.11 compatibility targets must exist before Evolution convergence');
const view=`<section class="view" id="insightsView" data-axis-trends-owner="v8131-evolution-field">
      <div class="pageHead"><h1>趋势</h1><div class="v813Range" id="v813Range" role="group" aria-label="查看范围"><button type="button" class="active" data-v813-range="recent">最近</button><button type="button" data-v813-range="quarter">3个月</button><button type="button" data-v813-range="all">全部</button></div></div>
      <div class="v813Empty" id="v813Empty">暂无训练记录。</div>
      <div class="v813Field" id="v813Field" hidden>
        <div class="v813Viewport" id="v813Viewport" aria-label="训练时间轨迹">
          <div class="v813TrackCanvas" id="v813TrackCanvas"><svg class="v813TrackSvg" id="v813TrackSvg" preserveAspectRatio="none" aria-hidden="true"></svg><div id="v813Nodes"></div></div>
        </div>
        <div class="v813Readout" aria-live="polite">
          <div class="v813ReadoutTop"><b id="v813SessionDate">—</b><span id="v813SessionMeta">—</span></div>
          <p class="v813Insight" id="v813Insight"></p>
          <div class="v813Fingerprint empty" id="v813Fingerprint" aria-label="本次训练时间结构"></div>
          <div class="v813FingerMeta" id="v813FingerMeta"><span>—</span><span>—</span></div>
        </div>
      </div>
      <div class="v813Expand" id="v813Expand" hidden>
        <div class="v813ExpandHead"><b>这次训练</b><span id="v813ExpandDate">—</span></div>
        <div id="v813Activities"></div>
      </div>
      <div class="v813Memory" id="v813Memory" hidden>
        <div class="v813MemoryHead"><b>最近出现</b><span id="v813MemoryMeta">最近28天</span></div>
        <div id="v813MemoryRows"></div>
      </div>
      <div class="v813LegacyTrends" aria-hidden="true">
        <span id="v811TrendGoal"></span><div id="v811StateField"><span id="v811StateName"></span><span id="v811StateCount"></span><span id="v811StateLine"></span><svg id="v811Trajectory"></svg><span id="v811FieldMeta"></span><span id="v811GoalName"></span></div>
        <span id="v811EvidenceMeta"></span><div id="v811Evidence"></div><div id="v811Needle"></div>
        <span id="insightSessions"></span><span id="insightMins"></span><span id="revisitRate"></span><span id="coverageMeta"></span><div id="coverageGrid"></div><div id="evidenceList"></div><div id="rhythmGrid"></div><div id="nextCard"></div>
      </div>
    </section>`;
html=html.replace(re,view);
if((html.match(/data-axis-trends-owner="v8131-evolution-field"/g)||[]).length!==1)fail('visible Evolution owner missing or duplicated');
for(const id of ['v813Viewport','v813TrackCanvas','v813TrackSvg','v813Nodes','v813Insight','v813Fingerprint','v813Expand','v813Memory'])if((html.match(new RegExp(`id="${id}"`,'g'))||[]).length!==1)fail(`DOM #${id} missing or duplicated`);
for(const text of ['左右滑动查看','点一下展开','留下几次','继续留下','当前状态','下一针','状态场'])if(view.includes(text))fail(`instructional/legacy copy survived: ${text}`);
fs.writeFileSync(INDEX,html);

let v84=read(V84);
const legacyOwner="function installTrends(){const view=$('#insightsView');if(!view||view.dataset.v84)return;";
const retiredOwner="function installTrends(){const view=$('#insightsView');if(!view||view.dataset.axisTrendsOwner==='v8131-evolution-field'||view.dataset.v84)return;";
const legacyCount=v84.split(legacyOwner).length-1;
if(legacyCount!==1)fail(`v84 Trends owner anchor expected once, found ${legacyCount}`);
v84=v84.replace(legacyOwner,retiredOwner);
fs.writeFileSync(V84,v84);

let app=read(APP);
const saveAnchor="function save(){try{localStorage.setItem(KEY,JSON.stringify({version:VERSION,sessions:state.sessions,active:state.active,profile:state.profile,prefs:state.prefs}))}catch{}}";
const saveNext="function save(){try{localStorage.setItem(KEY,JSON.stringify({version:VERSION,sessions:state.sessions,active:state.active,profile:state.profile,prefs:state.prefs}));try{window.dispatchEvent(new CustomEvent('axis:state-changed',{detail:{version:VERSION}}))}catch{}}catch{}}";
const saveCount=app.split(saveAnchor).length-1;
if(saveCount!==1)fail(`canonical save lifecycle anchor expected once, found ${saveCount}`);
app=app.replace(saveAnchor,saveNext);
if(!app.includes("new CustomEvent('axis:state-changed'"))fail('canonical state lifecycle event missing');
try{new Function(app)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(APP,app);

const field=read(FIELD);
try{new Function(field)}catch(e){fail(`Evolution field syntax ${e.message}`)}
for(const needle of ['__AXIS_8131_EVOLUTION_FIELD__','__AXIS_EVOLUTION__',"window.addEventListener('axis:state-changed'",'if(!s.drag)return','暂无训练记录。'])if(!field.includes(needle))fail(`Evolution source missing ${needle}`);
for(const forbidden of ['左右滑动查看','点一下展开这次训练','留下几次训练后','继续留下相同动作'])if(field.includes(forbidden))fail(`instructional field copy survived: ${forbidden}`);

let build=read(BUILD);
const anchor="['v8710-report.js','__AXIS_8710_REPORT_READY__'],['v8710-watermark.js','__AXIS_8710_WATERMARK_READY__'],['v8711-runtime.js','__AXIS_8711_READY__']";
const replacement=anchor+",['v8131-evolution-field.js','__AXIS_8131_EVOLUTION_READY__']";
const count=build.split(anchor).length-1;
if(count!==1)fail(`first-class module anchor expected once, found ${count}`);
build=build.replace(anchor,replacement);
fs.writeFileSync(BUILD,build);

console.log('[AXIS 8.13.1 evolution convergence] PASS · sealed-state lifecycle bridge · read-only Evolution owner · factual copy · tap/scrub ownership · first-class module');
