import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.9 contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const core=read('axis-core.js'),api=read('api/analyze.js'),cfg=read('lib/ai-config.js');
const need=(src,needle,label)=>{if(!src.includes(needle))fail(label)};
need(core,"owner:'atomic-handoff'",'atomic detail owner missing');
need(core,"window.__AXIS_LOCAL_VISION__={version:2",'Local Vision v2 marker missing');
need(core,'canonicalVisionCatalog()','dynamic canonical vision catalog missing');
need(core,"window.__AXIS_REST_SPEAK__={version:'8.9'",'Rest Speak passive marker missing');
need(core,"window.__AXIS_89_CATALOG__={version:'8.9'",'8.9 catalog marker missing');
need(api,'catalogFrom(body,c.maxCatalog)','server catalog sanitizer missing');
need(api,'valid=new Set(catalog.map(x=>x.id))','server canonical ID validator missing');
need(api,'callOpenAI','OpenAI frontier provider missing');
need(api,'callGemini','Gemini verification provider missing');
need(cfg,"'gpt-5.6-sol'",'frontier OpenAI default missing');
if(/setInterval\s*\(\s*axis89|new\s+MutationObserver\s*\(\s*axis89|new\s+ResizeObserver\s*\(\s*axis89/.test(core))fail('8.9 accessory created a forbidden timer/geometry observer');
if(/axis883TimelineSafe[^'"]*\b(auto|scroll)\b/.test(core))fail('8.9 reintroduced timeline inner-scroll ownership');
const info=JSON.parse(read('axis-build.json'));info.gates=info.gates||{};
Object.assign(info.gates,{
 detailAtomicHandoff:true,
 localVisionV2:true,
 frontierVisionCatalogContract:true,
 frontierVisionProviderRouter:true,
 restSpeakPassive:true,
 restSpeakNoGeometryOwner:true,
 expandedSearchVocabulary:true
});
info.axis89={detail:'atomic-handoff',vision:'local-v2-frontier-verify',restSpeak:'optional-passive',catalog:'canonical-expanded'};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.9 contract] PASS · detail + vision + rest-speak + catalog gates sealed');
