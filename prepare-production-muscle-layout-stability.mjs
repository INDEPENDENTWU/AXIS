import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS production muscle layout stability] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{
  const n=src.split(from).length-1;
  if(n!==1)fail(`${label} expected once, found ${n}`);
  return src.replace(from,to);
};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/*
 * Production certification exposed a first-edit layout shift in #musclePanel.
 * The 8.7.5 polish owner only added v875Tidy after the initially-hidden panel
 * became visible/mutated, so the first metric interaction could change geometry.
 *
 * Make the canonical DOM born in the final layout state and let tidyMuscles()
 * reconcile hidden panels too. This changes presentation timing only; no record,
 * session, metric, report, or persistence truth is changed.
 */
{
  const FILE='index.html';
  let src=read(FILE);
  src=once(
    src,
    '<div class="musclePanel hidden" id="musclePanel">',
    '<div class="musclePanel hidden v875Tidy" id="musclePanel">',
    'pre-arm muscle panel final layout class'
  );
  write(FILE,src);
}

{
  const FILE='v875-polish.js';
  let src=read(FILE);
  const from="function tidyMuscles(){const panel=$('#musclePanel'),tags=$('#muscleTags');if(!panel||panel.classList.contains('hidden')||!tags)return;";
  const to="function tidyMuscles(){const panel=$('#musclePanel'),tags=$('#muscleTags');if(!panel||!tags)return;";
  src=once(src,from,to,'allow hidden muscle panel reconciliation');
  syntax(src,FILE);
  write(FILE,src);
}

console.log('[AXIS production muscle layout stability] PASS · final muscle layout is armed before first edit');
