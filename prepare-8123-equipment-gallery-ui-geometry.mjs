import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 equipment gallery UI geometry] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(!src.includes('__AXIS_8123_EQUIPMENT_GALLERY__'))fail('equipment gallery must run first');
if(src.includes('__AXIS_8123_EQUIPMENT_GALLERY_UI_GEOMETRY__'))fail('equipment gallery UI geometry already installed');

const block=String.raw`
/* AXIS 8.12.3 — equipment gallery UI geometry seal. Pure presentation; no state or media ownership. */
(function axis8123InstallEquipmentGalleryUIGeometry(){
 if(document.querySelector('#v8123EqGalleryUIGeometry'))return;
 const s=document.createElement('style');s.id='v8123EqGalleryUIGeometry';s.textContent=
  'body #settingsSheet #manageEqList .manageEq.v8123EqRow.v8123HasPhoto{display:grid!important;grid-template-columns:50px minmax(0,1fr) 18px!important;grid-template-rows:1fr!important;column-gap:12px!important;align-items:center!important;min-height:72px!important;padding:10px 0!important}'+
  'body #settingsSheet #manageEqList .manageEq.v8123EqRow.v8123HasPhoto>.v8123EqThumb{grid-column:1!important;grid-row:1!important;align-self:center!important;margin:0!important}'+
  'body #settingsSheet #manageEqList .manageEq.v8123EqRow.v8123HasPhoto>.v8123EqText{grid-column:2!important;grid-row:1!important;min-width:0!important;width:auto!important;margin:0!important;padding:0!important;align-self:center!important}'+
  'body #settingsSheet #manageEqList .manageEq.v8123EqRow.v8123HasPhoto>.v8123EqChevron{grid-column:3!important;grid-row:1!important;width:18px!important;min-width:18px!important;margin:0!important;padding:0!important;align-self:center!important;justify-self:end!important;text-align:right!important}'+
  'body #v8123EqDetailSheet .v8123EqPhotoAdd{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:9px!important;padding:0!important;margin:0!important;line-height:1!important;text-align:center!important}'+
  'body #v8123EqDetailSheet .v8123EqPhotoAdd small{display:block!important;margin:0!important;padding:0!important;line-height:1.15!important;text-align:center!important}'+
  '@media(max-width:380px){body #settingsSheet #manageEqList .manageEq.v8123EqRow.v8123HasPhoto{grid-template-columns:46px minmax(0,1fr) 16px!important;column-gap:10px!important}body #settingsSheet #manageEqList .manageEq.v8123EqRow.v8123HasPhoto>.v8123EqChevron{width:16px!important;min-width:16px!important}}';
 document.head.appendChild(s)
})();
try{window.__AXIS_8123_EQUIPMENT_GALLERY_UI_GEOMETRY__={version:'8.12.3',photoRowColumns:3,photoRowTextFlexible:true,photoAddCentered:true,trainingOwner:false,mediaOwner:false}}catch{}
`;

src+='\n'+block;
for(const needle of ['__AXIS_8123_EQUIPMENT_GALLERY_UI_GEOMETRY__','photoRowColumns:3','photoAddCentered:true'])if(!src.includes(needle))fail(`missing ${needle}`);
try{new Function(src)}catch(e){fail(`app.js syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 equipment gallery UI geometry] PASS · photo row three-column ownership sealed · add-photo content truly centered · no product ownership changes');
