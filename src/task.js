// Free-time note task (mic-checked, no tempo).
import { micOn } from './audio.js';
import { N, midiName, pc, pretty, solfOf } from './notation.js';
import { letterOpts } from './quiz.js';
import { kbSVG, staffSVG } from './render.js';
import { settings } from './state.js';

// items: [{midi,letter,acc,oct,name,any?}] ; cfg: {strict, show:'name'|'staff'|'both', hint:true|false|'miss', fingers, kb:[from,to]}
export const task={active:false,
  start(cfg,host,onFinish){
    this.cfg=cfg;this.items=cfg.items;this.onFinish=onFinish;this.idx=0;this.mistakes=0;this.first=0;this.times=[];this.peaks=[];this.missed=new Set();
    host.innerHTML=`<div class="dots"></div><div class="tkStaff staffwrap hidden"></div><div class="now tkName"></div><div style="text-align:center"><span class="finger tkFinger hidden"></span></div><div class="tkKb"></div><div class="feedback tkFb"></div><div class="help tkOff hidden" style="text-align:center">Mic off — play it, then tap the note you played.</div><div class="answers tkAns"></div>`;
    this.el=k=>host.querySelector('.'+k);this.host=host;
    this.active=true;this.show();
  },
  kbHtml(it){
    const [a,b]=this.cfg.kb||[36,96];const marks={};marks[it.midi]=it.finger?String(it.finger):'';
    return `<div class="kbwrap">${kbSVG(a,b,marks)}</div>`;
  },
  show(){
    const it=this.items[this.idx],cfg=this.cfg;
    it.finger=cfg.fingers?cfg.fingers[this.idx]:null;
    this.host.querySelector('.dots').innerHTML=this.items.map((x,i)=>`<span class="${i<this.idx?(this.missed.has(i)?'miss':'ok'):i===this.idx?'cur':''}"></span>`).join('');
    const showStaff=!it.any&&(cfg.show==='staff'||cfg.show==='both');
    const showName=it.any||cfg.show!=='staff';
    this.el('tkStaff').classList.toggle('hidden',!showStaff);
    if(showStaff)this.el('tkStaff').innerHTML=staffSVG(it);
    this.el('tkName').textContent=showName?(it.any?'any key':pretty(it.name)+(settings.solf&&!it.any?' · '+solfOf(it.midi,it.acc):'')):'?';
    this.el('tkName').style.fontSize=showName&&!it.any&&settings.solf?'42px':'';
    this.el('tkFinger').classList.toggle('hidden',!it.finger);this.el('tkFinger').textContent='finger '+it.finger;
    this.el('tkKb').innerHTML=(cfg.hint===true&&!it.any)?this.kbHtml(it):'';
    this.el('tkFb').textContent='';this.el('tkFb').className='feedback tkFb';
    // mic off: answer buttons stand in for the mic
    const ans=this.el('tkAns'),off=!micOn();this.el('tkOff').classList.toggle('hidden',!off);ans.innerHTML='';
    if(off){
      const opts=it.any?['✓ Played']:letterOpts(it.letter);
      ans.innerHTML=opts.map(o=>`<button class="btn">${o}</button>`).join('');
      ans.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(!this.active)return;
        if(it.any){this.onset({midi:60,self:true});return;}
        const m=N(b.textContent+it.oct);this.onset({midi:m,self:true});});
    }
    this.t0=performance.now();
  },
  onset(ev){
    if(!this.active||ev.midi==null)return;
    const it=this.items[this.idx];
    const ok=it.any||(this.cfg.strict?ev.midi===it.midi:pc(ev.midi)===pc(it.midi));
    if(ok){
      if(!this.missed.has(this.idx)){this.first++;this.times.push((performance.now()-this.t0)/1000);}
      if(ev.peak!=null)this.peaks.push(ev.peak);
      this.idx++;
      if(this.idx>=this.items.length){this.active=false;this.host.querySelector('.dots').innerHTML=this.items.map((x,i)=>`<span class="${this.missed.has(i)?'miss':'ok'}"></span>`).join('');
        this.el('tkFb').textContent='✓';this.el('tkFb').className='feedback tkFb ok';
        const avg=this.times.length?this.times.reduce((a,b)=>a+b,0)/this.times.length:null;
        this.onFinish({mistakes:this.mistakes,first:this.first,total:this.items.length,avg,peaks:this.peaks.slice()});return;}
      if(ev.self)this.selfUsed=true;
      this.show();this.el('tkFb').textContent='✓';this.el('tkFb').className='feedback tkFb ok';
    }else{
      this.mistakes++;this.missed.add(this.idx);
      this.el('tkFb').textContent=(ev.self?'✗ that was '+pretty(it.letter)+', not '+pretty(midiName(ev.midi)).replace(/\d+$/,''):'✗ heard '+pretty(midiName(ev.midi)))+(!ev.self&&this.cfg.strict&&pc(ev.midi)===pc(it.midi)?' (wrong octave)':'');this.el('tkFb').className='feedback tkFb bad';
      if(this.cfg.hint==='miss')this.el('tkKb').innerHTML=this.kbHtml(it);
    }
  }
};
