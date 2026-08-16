import fs from 'node:fs';
import {buildAxis811Atlas,auditAxis811Atlas} from './lib/learning-atlas-811.mjs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.11 dialogue depth] ${m}`)};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const audit=auditAxis811Atlas(buildAxis811Atlas());
if(audit.count!==5280||audit.duplicateTargets!==0||!audit.fourTurn||!audit.sixTurn)fail('six-turn Atlas audit failed');
let src=fs.readFileSync(FILE,'utf8');
const helper=`function axis811DialogueTail(kind,track,seed){
 const functional=[['Thanks — that helps.','No problem.'],['Perfect, that clears it up.','Glad to help.'],['Great, that was all I needed.','Anytime.'],['Got it — thanks for checking.','Of course.']];
 const alignment=[['That works for me.','Great — we’re set.'],['Okay, I’m happy with that.','Same here.'],['Good, let’s leave it there.','Sounds good.'],['Alright — that feels clear.','Perfect.']];
 const reflective=[['That’s basically how I see it.','I can see the logic.'],['That’s the main reason for me.','That makes sense.'],['I’d still keep some room for exceptions.','Right — context matters.'],['That’s where I’d draw the distinction.','That’s a useful way to put it.']];
 const social=[['Anyway, that’s where I’m at.','Fair enough.'],['So yeah, that’s the short version.','Got you.'],['That’s what I was trying to say.','Makes sense.'],['I’m glad we cleared that up.','Me too.']];
 const gym=[['Thanks — I’ll keep the next set clean.','Sounds good.'],['Got it. I’ll focus on that next set.','Nice — see how it feels.'],['Perfect. I won’t overthink it.','Exactly.'],['Alright, I’ll try that and reassess.','Good plan.']];
 const work=[['Perfect — I’ll take it from here.','Sounds good.'],['Great, I’ll update you once it’s done.','Thanks.'],['Okay, I’ll keep you posted.','Appreciate it.'],['That gives me enough to move forward.','Great.']];
 const travel=[['Great, that clears it up.','Have a good trip.'],['Perfect — I know what to do now.','Glad I could help.'],['Thanks, I should be fine from here.','You’re welcome.'],['Got it. I’ll head that way.','Sounds good.']];
 let pool=functional;if(['schedule','prefer','decline','boundary'].includes(kind))pool=alignment;else if(['opinion','compare','cause','stance','story','feeling','reaction'].includes(kind))pool=reflective;else if(['smalltalk','conflictrepair'].includes(kind))pool=social;else if(track==='gym'||kind==='gymplan')pool=gym;else if(track==='work'||kind==='update'||kind==='feedback')pool=work;else if(track==='travel'||track==='service')pool=travel;return pool[Math.abs(Number(seed)||0)%pool.length]
}
`;
src=once(src,'function axis811SpeakAtlas(){',helper+'function axis811SpeakAtlas(){','dialogue helper');
src=once(src,"const v={a:av[0],az:av[1],b:bv[0],bz:bv[1]},target=axis811Fill(tpl[0],v),speech=axis811Connected(target),dialogue=kind.dialogue.map(x=>axis811Fill(x,v));","const v={a:av[0],az:av[1],b:bv[0],bz:bv[1]},target=axis811Fill(tpl[0],v),speech=axis811Connected(target),dialogue=kind.dialogue.map(x=>axis811Fill(x,v)),tail=axis811DialogueTail(scene.kind,scene.track,seq+1);",'dialogue tail selection');
src=once(src,'response:dialogue[0],followup:dialogue[1],closing:dialogue[2],','response:dialogue[0],followup:dialogue[1],closing:dialogue[2],turn5:tail[0],turn6:tail[1],conversation:[target,dialogue[0],dialogue[1],dialogue[2],tail[0],tail[1]],','six-turn unit fields');
const from=`axis8103DialogueTurns=function(r){
 if(r?.target&&r?.response&&r?.followup&&r?.closing)return [
  {who:'你',text:r.target},{who:'对方',text:r.response},{who:'你',text:r.followup},{who:'对方',text:r.closing}
 ];
 return axis811BaseDialogueTurns(r)
};`;
const to=`axis8103DialogueTurns=function(r){
 if(r?.target&&r?.response&&r?.followup&&r?.closing&&r?.turn5&&r?.turn6)return [
  {who:'你',text:r.target},{who:'对方',text:r.response},{who:'你',text:r.followup},{who:'对方',text:r.closing},{who:'你',text:r.turn5},{who:'对方',text:r.turn6}
 ];
 if(r?.target&&r?.response&&r?.followup&&r?.closing)return [{who:'你',text:r.target},{who:'对方',text:r.response},{who:'你',text:r.followup},{who:'对方',text:r.closing}];
 return axis811BaseDialogueTurns(r)
};
const axis811BasePracticeHtml=axis8101PracticeHtml;
axis8101PracticeHtml=function(mode,r){const html=axis811BasePracticeHtml(mode,r);return mode==='dialogue'&&Array.isArray(r?.conversation)&&r.conversation.length>=6?html.replace('四轮语境练习','真实六轮语境'):html};`;
src=once(src,from,to,'six-turn practice renderer');
const marker="try{window.__AXIS_811_LEARNING__=";
if(!src.includes(marker))fail('8.11 learning diagnostic marker missing');
src=src.replace(marker,"try{window.__AXIS_811_DIALOGUE__={version:'8.11-candidate',turns:6,unitSpecific:true,autoplay:false,trainingOwner:false};window.__AXIS_811_LEARNING__=");
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.11 dialogue depth] PASS · 5280 six-turn Atlas units · old four-turn diagnostic remains compatible');
