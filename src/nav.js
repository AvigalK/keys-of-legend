// Tab navigation.
import { engine, updateMicUI } from './audio.js';
import { $, parkPerf } from './dom.js';
import { hunt } from './hunt.js';
import { improv } from './improv.js';
import { L, renderMap } from './lessons.js';
import { song } from './song.js';
import { task } from './task.js';

// ---------- tabs ----------
export let tab='learn';

export function showTab(t){
  if(song.running)song.stop();
  task.active=false;improv.active=false;hunt.active=false;
  tab=t;
  document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x.dataset.tab===t));
  ['learn','song','hunt','tuner','settings'].forEach(k=>$('tab-'+k).classList.toggle('hidden',k!==t));
  if(engine)engine.cont=(t==='tuner');
  if(t==='song'){parkPerf();$('songSetup').classList.remove('hidden');$('songStage').classList.add('hidden');$('songResult').classList.add('hidden');}
  if(t==='learn'){if(L.q)L.render();else renderMap();}
  if(t==='hunt'){$('huntStage').classList.add('hidden');}
  updateMicUI();
}

document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
