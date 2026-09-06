import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Active Home stage polish contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const prep=read('prepare-821-active-home-stage-polish.mjs');
const chain=read('prepare-819-postcommit-lifecycle.mjs');

for(const token of [
 'body.v87-now #activeHome>.liveHead',
 'body.v87-now #activeHome>.metricPair.compact',
 'background:var(--s1)!important',
 'box-shadow:none!important',
 'contain:layout paint',
 '.axis821StageControls.v87Actions',
 '#v87AdjustBtn',
 'position:static!important',
 'grid-column:1/-1!important',
 'grid-row:2!important',
 'axis821-set-bump .axis821StageClock',
 'axis821-state-shift .axis821StageCore',
 '@media(prefers-reduced-motion:reduce)'
])if(!prep.includes(token))fail(`polish missing ${token}`);

for(const forbidden of [
 'localStorage.setItem',
 'indexedDB.open',
 'fetch(',
 'XMLHttpRequest',
 'state.active.events.push',
 'writeCore(',
 'writeMeta(',
 'addEventListener('
])if(prep.includes(forbidden))fail(`polish introduced owner/write/event token ${forbidden}`);

const compat="await import('./prepare-821-active-home-stage-compat.mjs');";
const polish="await import('./prepare-821-active-home-stage-polish.mjs');";
const profile="await import('./prepare-821-profile-session-truth.mjs');";
const c=chain.indexOf(compat),p=chain.indexOf(polish),n=chain.indexOf(profile);
if(!(c>=0&&p>c&&n>p))fail('polish build order must follow stage compat and precede Profile truth');
if((chain.match(/prepare-821-active-home-stage-polish\.mjs/g)||[]).length!==1)fail('polish import duplicated');

console.log('[AXIS 8.21 Active Home stage polish contract] PASS · flat native rail · legacy duplicate hidden only during ordinary Active · Adjust isolated · CSS-only · no new owner/write/event');
