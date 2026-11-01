// Note-reading game.
import { micOn } from './audio.js';
import { $ } from './dom.js';
import { N, NAMES, isWhite, midiName, pc, pretty, solfOf } from './notation.js';
import { addXP, logEvt } from './progress.js';
import { shuffle } from './quiz.js';
import { staffSVG } from './render.js';
import { settings } from './state.js';

export const RANGES={rh:[60,67,false],lh:[48,55,false],mid:[48,67,false],grand:[48,72,false],wide:[36,96,false],all:[36,96,true]};

export const hunt={active:false,
  start(){this.active=true;this.round=0;this.score=0;this.times=[];this.misses=[];
    $('huntStage').classList.remove('hidden');$('huntResult').classList.add('hidden');this.next();},
  pick(){
    const [lo,hi,black]=RANGES[$('huntSel').value];
    let m;do{m=lo+Math.floor(Math.random()*(hi-lo+1));}while((!black&&!isWhite(m))||m===this.target);
    let letter,acc=0,oct=Math.floor(m/12)-1;const nm=NAMES[pc(m)];
    if(nm.length===1){letter=nm;}else if(Math.random()<0.5){letter=nm[0];acc=1;}
    else{letter=NAMES[pc(m+1)];acc=-1;oct=Math.floor((m+1)/12)-1;}
    return {midi:m,letter,acc,oct,name:letter+(acc===1?'#':acc===-1?'b':'')+oct};
  },
  next(){
    if(this.round>=10){this.done();return;}
    this.round++;const n=this.pick();this.target=n.midi;this.n=n;this.tries=0;this.t0=performance.now();
    $('huntProg').textContent=this.round+' / 10';$('huntScore').textContent='score '+this.score;
    $('huntStaff').innerHTML=staffSVG(n);
    $('huntName').textContent=pretty(n.name)+(settings.solf?' · '+solfOf(n.midi,n.acc):'');
    $('huntName').classList.toggle('hidden',!$('showName').checked);
    $('huntFb').textContent='';$('huntFb').className='feedback';
    this.lock=false;
    $('huntAns').innerHTML='';
    if(!micOn()){
      const nm=x=>pretty(x).replace(/\d+$/,'');const correct=nm(n.name);
      const pool=['C','D','E','F','G','A','B','C♯','E♭','F♯','A♭','B♭'].filter(x=>x!==correct);
      const opts=shuffle([correct,...shuffle(pool).slice(0,3)]);
      $('huntAns').innerHTML=opts.map(o=>`<button class="btn">${o}</button>`).join('');
      $('huntAns').querySelectorAll('button').forEach(b=>b.onclick=()=>{
        if(b.textContent===correct)this.onset({midi:this.target});
        else this.onset({midi:N(b.textContent.replace('♯','#').replace('♭','b')+n.oct),self:true});});
    }
  },
  onset(ev){
    if(this.lock||ev.midi==null)return;
    const ok=settings.strict?ev.midi===this.target:pc(ev.midi)===pc(this.target);
    if(ok){
      this.lock=true;const dt=(performance.now()-this.t0)/1000;
      if(this.tries===0){this.score++;this.times.push(dt);}
      $('huntFb').textContent='✓ '+pretty(this.n.name)+(this.tries===0?'  '+dt.toFixed(1)+' s':'');$('huntFb').className='feedback ok';
      setTimeout(()=>this.next(),900);
    }else{
      this.tries++;if(this.tries===1)this.misses.push(this.n.name);
      $('huntFb').textContent='✗ heard '+pretty(midiName(ev.midi))+' — try again';$('huntFb').className='feedback bad';
    }
  },
  skip(){if(!this.active)return;this.misses.push(this.n.name);this.next();},
  done(){
    this.active=false;$('huntStage').classList.add('hidden');
    const avg=this.times.length?(this.times.reduce((a,b)=>a+b,0)/this.times.length).toFixed(1):'—';
    $('huntResult').classList.remove('hidden');
    $('huntResult').innerHTML=`<div class="summary"><div class="big">${this.score}/10 first try</div>avg ${avg} s per note · +${this.score*2} XP`+
      (this.misses.length?`<br>Practise: ${[...new Set(this.misses)].map(pretty).join(', ')}`:'')+`</div>`+
      `<button class="btn big" style="margin-top:10px" id="huntAgain">↻ Again</button>`;
    $('huntAgain').onclick=()=>hunt.start();
    this.lastText=`Note Hunt (${$('huntSel').selectedOptions[0].text}): ${this.score}/10 first try, avg ${avg}s`;
    logEvt(this.lastText);
    if(this.score)addXP(this.score*2,'hunt');
    $('huntAns').innerHTML='';
  }
};

$('huntStart').onclick=()=>hunt.start();

$('huntSkip').onclick=()=>hunt.skip();
