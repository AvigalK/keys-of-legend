// Settings tab, backup and restore.
import { engine, micOn, startMic, startNoMic, stopMic, updateMicUI } from './audio.js';
import { $, toast } from './dom.js';
import { L, renderMap } from './lessons.js';
import { P, renderHud, saveP } from './progress.js';
import { drawSongPreview } from './songtab.js';
import { sensToDb, settings, store } from './state.js';

$('startBtn').onclick=startMic;

$('noMicBtn').onclick=startNoMic;

$('micPill').onclick=()=>{if(micOn())stopMic();else startMic();};

$('micToggle').onchange=()=>{if($('micToggle').checked)startMic();else if(micOn())stopMic();};

$('adminOn').checked=settings.admin;

$('adminOn').onchange=()=>{settings.admin=$('adminOn').checked;store.set('admin',settings.admin);toast(settings.admin?'🛠 Admin mode on — all levels unlocked, nothing saved':'Admin mode off');if(!L.q)renderMap();};

$('viewSel').value=settings.view;

$('viewSel').onchange=()=>{settings.view=$('viewSel').value;store.set('view',settings.view);drawSongPreview();};

$('solfOn').checked=settings.solf;

$('solfOn').onchange=()=>{settings.solf=$('solfOn').checked;store.set('solf',settings.solf);};

$('strictOct').checked=settings.strict;

$('strictOct').onchange=()=>{settings.strict=$('strictOct').checked;store.set('strict',settings.strict);};

$('sens').value=settings.sens;

$('sensVal').textContent=settings.sens;

$('sens').oninput=()=>{settings.sens=+$('sens').value;$('sensVal').textContent=settings.sens;store.set('sens',settings.sens);if(engine)engine.sensDb=sensToDb(settings.sens);};

$('lat').value=settings.lat;

$('latVal').textContent=settings.lat;

$('lat').oninput=()=>{settings.lat=+$('lat').value;$('latVal').textContent=settings.lat;store.set('lat',settings.lat);};

export function backupCode(){return 'KOL1:'+btoa(unescape(encodeURIComponent(JSON.stringify(P))));}

$('backupBtn').onclick=async()=>{const c=backupCode();try{await navigator.clipboard.writeText(c);$('backupMsg').textContent='Copied.';}catch(e){$('restoreText').value=c;$('backupMsg').textContent='Copy it from the box.';}};

$('restoreBtn').onclick=()=>{
  try{const t=$('restoreText').value.trim();if(!t.startsWith('KOL1:'))throw 0;
    const d=JSON.parse(decodeURIComponent(escape(atob(t.slice(5)))));if(typeof d.xp!=='number'||typeof d.done!=='object')throw 0;
    Object.keys(P).forEach(k=>delete P[k]);Object.assign(P,{xp:0,done:{},ach:[],streak:0,lastDay:null,log:[],best:{}},d);saveP();renderHud();
    $('backupMsg').textContent='Restored ✓';$('restoreText').value='';
  }catch(e){$('backupMsg').textContent='That code didn’t work.';}
};

renderMap();

updateMicUI();
