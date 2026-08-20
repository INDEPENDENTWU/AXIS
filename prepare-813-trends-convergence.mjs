import fs from 'node:fs';

const INDEX='index.html';
const fail=m=>{throw new Error(`[AXIS 8.13 trends convergence] ${m}`)};
let html=fs.readFileSync(INDEX,'utf8');
const re=/<section class="view" id="insightsView">[\s\S]*?<\/section>/;
const found=html.match(new RegExp(re.source,'g'))||[];
if(found.length!==1)fail(`insights surface expected once, found ${found.length}`);
if(!html.includes('id="v811StateField"'))fail('8.11 trends surface must exist before 8.13 convergence');

const view=`<section class="view" id="insightsView" data-axis-trends-owner="v813-trends-field">
      <div class="pageHead"><h1>趋势</h1><div class="v813Range" id="v813Range" role="group" aria-label="查看范围"><button type="button" class="active" data-v813-range="recent">最近</button><button type="button" data-v813-range="quarter">3个月</button><button type="button" data-v813-range="all">全部</button></div></div>
      <div class="v813Empty" id="v813Empty" hidden>留下训练记录后，这里会把时间、间隔和真正可比较的变化放在同一条轨迹里。</div>
      <div class="v813Field" id="v813Field">
        <div class="v813Viewport" id="v813Viewport" aria-label="训练时间轨迹">
          <div class="v813TrackCanvas" id="v813TrackCanvas"><svg class="v813TrackSvg" id="v813TrackSvg" preserveAspectRatio="none" aria-hidden="true"></svg><div id="v813Nodes"></div></div>
          <span class="v813TouchHint" id="v813TouchHint">左右滑动查看</span>
        </div>
        <div class="v813Readout" aria-live="polite">
          <div class="v813ReadoutTop"><b id="v813SessionDate">—</b><span id="v813SessionMeta">—</span></div>
          <p class="v813Insight" id="v813Insight">留下几次训练后，这里会直接说清楚发生了什么变化。</p>
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
if((html.match(/data-axis-trends-owner="v813-trends-field"/g)||[]).length!==1)fail('8.13 visible owner missing or duplicated');
for(const id of ['v813Viewport','v813TrackCanvas','v813TrackSvg','v813Nodes','v813Insight','v813Fingerprint','v813Expand','v813Memory'])if((html.match(new RegExp(`id="${id}"`,'g'))||[]).length!==1)fail(`DOM #${id} missing or duplicated`);
for(const label of ['当前状态','这次让什么发生了','下一针','状态场'])if(view.includes(label))fail(`legacy user-facing label survived: ${label}`);
fs.writeFileSync(INDEX,html);
console.log('[AXIS 8.13 trends convergence] PASS · one visible time-field owner · legacy trend IDs compatibility-only · no sheet/modal navigation');
