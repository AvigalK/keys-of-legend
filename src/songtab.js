// Song tab.
import { $, wireSeg } from './dom.js';
import { parseSong } from './notation.js';
import { addXP } from './progress.js';
import { pieceView } from './render.js';
import { song } from './song.js';
import { settings, store } from './state.js';
import { SONGS } from './tunes.js';

SONGS.forEach(s=>{const o=document.createElement('option');o.value=s.id;o.textContent=s.name;$('songSel').appendChild(o);});

$('songSel').value=store.get('songSel','ode1');

if(!$('songSel').value)$('songSel').value='ode1';

$('customText').value=store.get('custom','');

export function curSong(){return SONGS.find(x=>x.id===$('songSel').value);}

export function songTabView(){return settings.view==='auto'?'both':settings.view;}

export function drawSongPreview(){const s=curSong();const text=s.id==='custom'?$('customText').value:s.text;
  const p=parseSong(text);$('songPreview').innerHTML=p.notes.length&&!p.errors.length?pieceView(text,songTabView(),4):'';
  wireSeg($('songSeg'),songTabView(),drawSongPreview);}

export function onSongChange(){const s=curSong();$('customText').classList.toggle('hidden',s.id!=='custom');$('bpm').value=store.get('bpm_'+s.id,s.bpm);store.set('songSel',s.id);drawSongPreview();}

$('customText').oninput=()=>{clearTimeout(drawSongPreview.h);drawSongPreview.h=setTimeout(drawSongPreview,400);};

$('songSel').onchange=onSongChange;

onSongChange();

$('bpm').onchange=()=>store.set('bpm_'+$('songSel').value,+$('bpm').value);

$('bpmDown').onclick=()=>{$('bpm').value=Math.max(30,(+$('bpm').value||80)-4);$('bpm').onchange();};

$('bpmUp').onclick=()=>{$('bpm').value=Math.min(200,(+$('bpm').value||80)+4);$('bpm').onchange();};

$('clickOn').checked=settings.click;

$('clickOn').onchange=()=>{settings.click=$('clickOn').checked;store.set('click',settings.click);};

export function songTabOpts(){
  const s=curSong();const text=s.id==='custom'?$('customText').value:s.text;if(s.id==='custom')store.set('custom',text);
  $('songErr').textContent='';
  return {text,bpm:+$('bpm').value,name:s.name,need:3,click:settings.click,view:songTabView(),
    onError:m=>$('songErr').textContent=m,
    onStart:()=>$('songSetup').classList.add('hidden'),
    onStop:()=>$('songSetup').classList.remove('hidden'),
    onResult:g=>{$('songSetup').classList.remove('hidden');if(g.clean)addXP(10,'clean run');}};
}

$('playBtn').onclick=()=>song.start(songTabOpts());

$('againBtn').onclick=()=>{if(song.opts)song.start(song.opts);};

$('stopBtn').onclick=()=>song.stop();

$('copyBtn').onclick=async()=>{try{await navigator.clipboard.writeText(song.lastText||'');$('copyMsg').textContent='Copied — paste it to your teacher.';}catch(e){$('copyMsg').textContent=song.lastText||'';}};
