// Renderers for each lesson step type.
import { micOn, playTones } from './audio.js';
import { $, PERF, resolveView, wireSeg } from './dom.js';
import { improv } from './improv.js';
import { L } from './lessons.js';
import { parseNoteName } from './notation.js';
import { ach, addXP } from './progress.js';
import { genQuiz, randomItems, whitesIn } from './quiz.js';
import { pieceView } from './render.js';
import { song } from './song.js';
import { settings } from './state.js';
import { task } from './task.js';

export const STEPS={
  read(s,ui){ui.done();},
  improv(s,ui){
    const go=()=>{
      ui.msg('');
      improv.start({pcs:s.pcs,need:s.need,maxBad:s.maxBad!=null?s.maxBad:2},ui.host,r=>{
        if(!r.failed){ui.msg(r.self?'Self-checked ✓':`${r.ok} notes${r.bad?`, ${r.bad} outside the set`:', none outside the set'}.`,true);ui.done();}
        else{ui.msg('Too many notes outside the set — stay on the highlighted keys.',false);ui.failed();const b=document.createElement('button');b.className='btn big';b.style.marginTop='10px';b.textContent='↻ Again';b.onclick=go;ui.host.appendChild(b);}
      });
    };
    go();
  },
  check(s,ui){
    ui.host.innerHTML=`<div class="checks">${s.items.map((it,i)=>`<label><input type="checkbox" data-i="${i}">${it}</label>`).join('')}</div>`;
    const boxes=[...ui.host.querySelectorAll('input')];
    const upd=()=>{if(boxes.every(b=>b.checked))ui.done();else L.setDone(false);};
    boxes.forEach(b=>b.onchange=upd);
  },
  quiz(s,ui){
    let qs,k,score;
    const startQ=()=>{qs=genQuiz(s);k=0;score=0;show();};
    const show=()=>{
      const Q=qs[k];
      ui.host.innerHTML=`<div class="sub">Question ${k+1} / ${qs.length} · score ${score}</div>${Q.html}${Q.play?'<button class="btn big qPlay" style="margin-top:8px">▶ Play</button>':''}<div class="answers">${Q.opts.map(o=>`<button class="btn">${o}</button>`).join('')}</div>`;
      ui.msg('');
      if(Q.play){const pb=ui.host.querySelector('.qPlay');pb.onclick=()=>playTones(Q.play,Q.arp);playTones(Q.play,Q.arp);}
      ui.host.querySelectorAll('.answers .btn').forEach(b=>b.onclick=()=>{
        if(ui.host.dataset.lock==='1')return;ui.host.dataset.lock='1';
        const ok=b.textContent===Q.a;if(ok)score++;
        b.classList.add(ok?'right':'wrong');
        if(!ok)ui.host.querySelectorAll('.answers .btn').forEach(x=>{if(x.textContent===Q.a)x.classList.add('right');});
        ui.msg(ok?'✓':'✗ '+(Q.why?Q.why:Q.a),ok);
        setTimeout(()=>{if(!ui.live())return;ui.host.dataset.lock='0';k++;if(k<qs.length)show();else end();},ok?650:1300);
      });
    };
    const end=()=>{
      const pass=score>=s.pass;
      ui.host.innerHTML=`<div class="summary"><div class="big ${pass?'clean':'notclean'}">${score} / ${qs.length}</div>${pass?'Passed!':`Need ${s.pass}. Try again.`}</div>`+(pass?'':`<button class="btn big" style="margin-top:10px">↻ Try again</button>`);
      ui.msg('');
      if(pass){ui.done();addXP(score*2,'quiz');}else{ui.failed();ui.host.querySelector('button').onclick=startQ;}
    };
    startQ();
  },
  notes(s,ui){
    const go=()=>{
      const items=s.seq.map(x=>x==='*'?{any:true,name:'any'}:parseNoteName(x));
      task.start({items,strict:!!s.strict,show:s.show||'name',hint:s.hint||false,fingers:s.fingers,kb:s.kbRange},ui.host,r=>{
        const max=s.maxMistakes!=null?s.maxMistakes:2;
        if(r.mistakes<=max){ui.msg(r.mistakes?`Done — ${r.mistakes} slip${r.mistakes>1?'s':''}.`:'Perfect!',true);ui.done();}
        else{ui.msg(`${r.mistakes} wrong notes — go again.`,false);ui.failed();again();}
      });
    };
    const again=()=>{const b=document.createElement('button');b.className='btn big';b.style.marginTop='10px';b.textContent='↻ Again';b.onclick=go;ui.host.appendChild(b);};
    go();
  },
  random(s,ui){
    const pool=whitesIn(s.from,s.to);
    const go=()=>{
      task.start({items:randomItems(pool,s.n),strict:!!s.strict,show:s.show||'name',hint:false},ui.host,r=>{
        const avgOk=s.maxAvg?(r.avg!=null&&r.avg<=s.maxAvg):true;
        const pass=r.first>=s.pass&&avgOk;
        ui.msg(`${r.first}/${r.total} first try${r.avg!=null?` · avg ${r.avg.toFixed(1)} s`:''}`+(pass?' — passed!':` — need ${s.pass}${s.maxAvg?` and ≤ ${s.maxAvg} s`:''}`),pass);
        if(r.first===r.total&&r.total>=20&&s.show==='staff')ach('reader');
        if(pass)ui.done();else{ui.failed();const b=document.createElement('button');b.className='btn big';b.style.marginTop='10px';b.textContent='↻ Again';b.onclick=go;ui.host.appendChild(b);}
      });
    };
    go();
  },
  song(s,ui){
    const world=parseInt(String(L.q.id).replace('B',''),10);
    const box=document.createElement('div'),seg=document.createElement('div');seg.className='seg viewSeg';
    const info=document.createElement('div');info.className='sub';info.innerHTML=`${s.clk?s.bpm/s.clk+' bpm (dotted quarter)':s.bpm+' bpm'}${s.ts?' · '+s.ts:s.bpb===3?' · 3/4':''} · need <b>${s.need}</b> clean run${s.need>1?'s':''} in a row`;
    const drawPiece=()=>{const v=resolveView(world);box.innerHTML=pieceView(s.text,v,s.bpb,s);wireSeg(seg,v,drawPiece);};
    ui.body.appendChild(seg);ui.body.appendChild(box);ui.body.appendChild(info);drawPiece();
    const wrap=document.createElement('div');
    const btn=document.createElement('button');btn.className='btn big';btn.textContent='▶ Start (count-in)';btn.style.marginTop='10px';
    ui.host.appendChild(btn);ui.host.appendChild(wrap);
    wrap.appendChild(PERF);$('songStage').classList.add('hidden');$('songResult').classList.add('hidden');
    song.streakKey='';
    const opts={text:s.text,bpm:s.bpm,bpb:s.bpb,ts:s.ts,key:s.key,clk:s.clk,staff:s.one,need:s.need,strict:s.strict,name:(L.q.boss?'Boss ':'Quest '+L.q.id+' ')+s.title,id:'L-'+L.q.id+'-'+L.i+'-'+Date.now(),click:settings.click,
      onError:m=>ui.msg(m,false),
      // while playing, fold the full piece away so the live staff sits at the top of the phone screen
      onStart:()=>{btn.classList.add('hidden');[seg,box,info].forEach(e=>e.classList.add('hidden'));$('stepTitle').scrollIntoView({block:'start'});},
      onStop:()=>{btn.classList.remove('hidden');[seg,box,info].forEach(e=>e.classList.remove('hidden'));},
      onResult:(g,streak)=>{btn.classList.add('hidden');[seg,box,info].forEach(e=>e.classList.remove('hidden'));
        if(streak>=s.need){ui.msg('Step cleared! Tap Next.',true);ui.done();}
        else if(!g.clean)ui.failed();}};
    btn.onclick=()=>{opts.view=resolveView(world);song.start(opts);};
  },
  dyn(s,ui){
    if(!micOn()){
      ui.body.innerHTML=`<p>Mic is off. Play <b>${s.seq.join(' ')}</b> first <b>p — soft</b>, then the same <b>f — loud</b>. Listen: is the difference obvious?</p>`;
      ui.host.innerHTML=`<div class="answers"><button class="btn">✓ Clear difference</button><button class="btn">Not yet</button></div>`;
      const [y,n]=ui.host.querySelectorAll('button');
      y.onclick=()=>{ui.msg('Self-checked ✓',true);ui.done();};n.onclick=()=>ui.msg('Softer soft, louder loud — relaxed arm. Try again.',false);
      return;
    }
    const items=()=>s.seq.map(parseNoteName);
    let soft=null;
    const phase1=()=>{
      ui.msg('');
      ui.body.innerHTML=`<p>First play it <b>p — soft</b>.</p>`;
      task.start({items:items(),strict:false,show:'name',fingers:s.fingers},ui.host,r=>{soft=r.peaks;phase2();});
    };
    const phase2=()=>{
      ui.body.innerHTML=`<p>Now the same notes <b>f — loud</b> (faster key, relaxed arm).</p>`;
      task.start({items:items(),strict:false,show:'name',fingers:s.fingers},ui.host,r=>{
        const avg=a=>10*Math.log10(a.reduce((x,v)=>x+Math.pow(10,v/10),0)/a.length);
        const d=avg(r.peaks)-avg(soft);
        const pass=d>=s.diff;
        ui.msg(`Loud was ${d>=0?'+':''}${d.toFixed(1)} dB vs soft`+(pass?' — clear contrast!':` — need +${s.diff} dB. Softer soft, louder loud.`),pass);
        if(pass)ui.done();else{ui.failed();const b=document.createElement('button');b.className='btn big';b.style.marginTop='10px';b.textContent='↻ Again';b.onclick=phase1;ui.host.appendChild(b);}
      });
    };
    phase1();
  }
};
