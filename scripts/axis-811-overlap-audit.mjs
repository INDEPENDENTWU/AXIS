import fs from 'node:fs';
import {buildAxis811Atlas} from '../lib/learning-atlas-811.mjs';

const norm=s=>String(s||'').normalize('NFKC').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim().toLowerCase();
const base12=['Could you give me a hand?','Is anyone using this?','I’m almost done.','Go ahead.','No worries.','That works for me.','Could you wait a second?','Can I get this to go?','Where should I get off?','I’m just looking.','Sounds good.','Could you say that again?'];
const extFiles=['en-gym.json','en-daily.json','en-travel.json','en-work.json','en-ielts.json'].map(x=>'data/rest-speak/'+x);
const ext60=extFiles.flatMap(f=>JSON.parse(fs.readFileSync(f,'utf8')).map(x=>x[2]));
const tracks=['gym','daily','social','travel','work','service','ielts','native'];
const fill=(t,slot)=>String(t||'').replace(/\{([A-Za-z0-9_]+)\}/g,(_,k)=>String(slot[k]??''));
const generated=[];
for(const track of tracks){for(const frame of JSON.parse(fs.readFileSync(`data/rest-speak/en-810-${track}.json`,'utf8')))for(const slot of frame.slots)generated.push(fill(frame.target,slot))}
const base=[...base12,...ext60,...generated];
if(base.length!==456)throw new Error(`inherited English expected 456, got ${base.length}`);
const inherited=new Set(base.map(norm)),atlas=buildAxis811Atlas(),overlap=atlas.filter(x=>inherited.has(norm(x.target)));
console.log(JSON.stringify({inherited:base.length,atlas:atlas.length,exactOverlap:overlap.length,examples:overlap.slice(0,30).map(x=>({id:x.id,target:x.target,level:x.level,scenario:x.scenario}))},null,2));
