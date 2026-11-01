// World map and lesson player.
import { micOn } from './audio.js';
import { $, parkPerf } from './dom.js';
import { improv } from './improv.js';
import { P, ach, addXP, dayStr, levelOf, logEvt, nextQuest, rank, renderHud } from './progress.js';
import { kbFromSpec, staffFromSpec } from './render.js';
import { visualHtml, wireVisuals } from './visuals.js';
import { song } from './song.js';
import { settings } from './state.js';
import { STEPS } from './steps.js';
import { task } from './task.js';
import { LOCKED_WORLDS, NUMW, WORLDS } from './worlds.js';

export function allQ(){const a=[];WORLDS.forEach(w=>{w.quests.forEach(q=>a.push(q));a.push(w.boss);});return a;}

export function unlocked(q){if(settings.admin)return true;const a=allQ();const i=a.indexOf(q);return i===0||!!P.done[a[i-1].id]||!!P.done[q.id];}

export function renderMap(){
  renderHud();
  $('lesson').classList.add('hidden');$('lessonDone').classList.add('hidden');$('map').classList.remove('hidden');
  const cur=nextQuest();
  let h=settings.admin?`<div class="card" style="border:2px solid var(--warn)"><b style="color:var(--warn)">🛠 Admin mode</b><div class="sub">All levels unlocked · ⏭ skip any step · nothing is saved. Turn it off in ⚙︎.</div></div>`:'';
  WORLDS.forEach(w=>{
    const qs=[...w.quests,w.boss];const n=qs.filter(q=>P.done[q.id]).length;
    h+=`<div class="card world"><h3>World ${w.id} · ${w.name} <small>${n}/${qs.length}</small></h3><div class="sub">${w.sub}</div>`;
    qs.forEach(q=>{
      const un=unlocked(q),dn=!!P.done[q.id];
      h+=`<button class="quest${q.boss?' boss':''}${dn?' done':''}${un?'':' locked'}${q===cur?' cur':''}" data-q="${q.id}" ${un?'':'disabled'}>
        <span class="ic">${dn?'✓':un?(q.boss?'👹':'▶'):'🔒'}</span><span>${q.boss?'Boss: ':q.id+' '}${q.title}</span><span class="xp">${dn?'replay':q.xp+' XP'}</span></button>`;
    });
    h+='</div>';
  });
  if(LOCKED_WORLDS.length)h+=`<div class="card"><h3>Coming next</h3><div class="sub">Worlds ${NUMW}–7: ${LOCKED_WORLDS.join(' · ')}. Until they're in the app, your chat teacher runs these lessons.</div></div>`;
  $('map').innerHTML=h;
  $('map').querySelectorAll('.quest[data-q]').forEach(b=>b.onclick=()=>L.open(allQ().find(q=>q.id===b.dataset.q)));
}

export const L={q:null,i:0,okSteps:{},
  open(q){this.tok=(this.tok||0)+1;this.q=q;this.selfChecked=!micOn();this.i=0;this.manual=0;$('map').classList.add('hidden');$('lessonDone').classList.add('hidden');$('lesson').classList.remove('hidden');this.render();window.scrollTo(0,0);},
  close(){if(song.running)song.stop();task.active=false;improv.active=false;parkPerf();this.tok=(this.tok||0)+1;this.q=null;renderMap();},
  render(){
    const q=this.q,s=q.steps[this.i];
    task.active=false;improv.active=false;
    $('lessonQuest').textContent=(q.boss?'Boss · ':'Quest '+q.id+' · ')+q.title;
    $('lessonProg').textContent=`Step ${this.i+1} / ${q.steps.length}`;
    $('stepTitle').textContent=s.title;
    $('stepMsg').textContent='';$('stepMsg').className='feedback';
    $('stepNext').textContent=this.i===q.steps.length-1?'Finish ✓':'Next ›';
    $('stepOverride').classList.add('hidden');
    $('adminSkip').classList.toggle('hidden',!settings.admin);
    let body=s.html||'';
    if(s.vis)body+=visualHtml(s.vis);
    if(s.kb)body+=kbFromSpec(s.kb);
    if(s.staff)body+=staffFromSpec(s.staff,s.labels);
    $('stepBody').innerHTML=body;
    wireVisuals($('stepBody'));
    parkPerf();$('stepHost').innerHTML='';
    this.setDone(false);this.fails=0;
    const tok=this.tok=(this.tok||0)+1,live=()=>tok===this.tok&&this.q===q;
    STEPS[s.t](s,{host:$('stepHost'),body:$('stepBody'),msg:(t,ok)=>{if(!live())return;$('stepMsg').textContent=t;$('stepMsg').className='feedback'+(ok===true?' ok':ok===false?' bad':'');},
      done:()=>{if(!live())return;this.setDone(true);if(s.achOnDone)ach(s.achOnDone);},failed:()=>{if(!live())return;this.fails=(this.fails||0)+1;if(this.fails>=2&&!q.boss)$('stepOverride').classList.remove('hidden');},live});
  },
  setDone(v){this.stepDone=v;$('stepNext').disabled=!v;if(v&&!micOn())this.selfChecked=true;},
  next(){if(!this.stepDone)return;task.active=false;improv.active=false;if(song.running)song.stop();
    if(this.i<this.q.steps.length-1){this.i++;this.render();window.scrollTo(0,0);}else this.finish();},
  finish(){
    if(settings.admin){ // preview only: record nothing
      const q=this.q,a=allQ(),nq=a[a.indexOf(q)+1]||null;
      parkPerf();$('lesson').classList.add('hidden');$('lessonDone').classList.remove('hidden');
      $('lessonDone').innerHTML=`<div class="summary"><div class="big" style="color:var(--warn)">🛠 Preview finished</div>${q.boss?'Boss: ':'Quest '+q.id+' · '}${q.title} — not saved (admin mode)</div>
        ${nq?`<button class="btn big" id="doneNext" style="margin-top:12px">Next: ${nq.boss?'Boss · ':nq.id+' '}${nq.title} ›</button>`:''}
        <button class="btn" id="doneMap" style="width:100%;margin-top:8px">Map</button>`;
      if(nq)$('doneNext').onclick=()=>L.open(nq);
      $('doneMap').onclick=()=>{this.q=null;renderMap();};
      this.q=null;return;
    }
    const q=this.q,first=!P.done[q.id];
    const gain=first?q.xp:15;
    const hadAny=Object.keys(P.done).length>0;
    P.done[q.id]=dayStr(new Date());logEvt(`completed ${q.boss?'boss '+q.title:'quest '+q.id+' '+q.title}${this.manual?` (${this.manual} step(s) marked done manually)`:''}${this.selfChecked?' (self-checked, mic off)':''}`);
    const r=addXP(gain,'quest');
    if(!hadAny)ach('first');
    if(q.boss)ach('boss');
    const nq=nextQuest();
    parkPerf();$('lesson').classList.add('hidden');
    $('lessonDone').classList.remove('hidden');
    $('lessonDone').innerHTML=`<div class="summary"><div class="big clean">${q.boss?'👹 Boss defeated!':'✨ Quest complete!'}</div>
      +${gain} XP${first?'':' (replay)'}${r.levelUp?` · ⬆️ Level ${levelOf(P.xp)}!`:''}${q.boss&&first?`<br>New rank: <b>${rank()}</b>`:''}</div>
      ${nq?`<button class="btn big" id="doneNext" style="margin-top:12px">Next: ${nq.boss?'Boss · ':nq.id+' '}${nq.title} ›</button>`:(LOCKED_WORLDS.length?`<p>All app worlds done! Ask your chat teacher for World ${NUMW}.</p>`:'<p>🏆 Every world conquered. Endless Mode is with your chat teacher.</p>')}
      <button class="btn" id="doneMap" style="width:100%;margin-top:8px">Map</button>`;
    if(nq)$('doneNext').onclick=()=>L.open(nq);
    $('doneMap').onclick=()=>{this.q=null;renderMap();};
    this.q=null;renderHud();
  }
};

$('lessonBack').onclick=()=>L.close();

$('stepNext').onclick=()=>L.next();

$('adminSkip').onclick=()=>{if(!settings.admin)return;task.active=false;if(song.running)song.stop();L.setDone(true);L.next();};

$('stepOverride').onclick=()=>{L.manual=(L.manual||0)+1;$('stepOverride').classList.add('hidden');task.active=false;L.setDone(true);};
