// Timed, graded song performance.
import { ctx, ensureCtx, micOn, micTime } from './audio.js';
import { $ } from './dom.js';
import { grade } from './grade.js';
import { midiName, parseSong, pretty, solfOf } from './notation.js';
import { ach, logEvt } from './progress.js';
import { scoreSVG } from './render.js';
import { settings, store } from './state.js';

export let clickBus=null;

export function click(at,accent){
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type='sine';o.frequency.value=accent?5200:4200;
  g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(accent?0.9:0.6,at+0.002);g.gain.exponentialRampToValueAtTime(0.001,at+0.03);
  o.connect(g);g.connect(clickBus||ctx.destination);o.start(at);o.stop(at+0.04);
}

export const song={running:false,events:[],streak:0,streakKey:'',opts:null,
  prepare(opts,c0){
    const p=parseSong(opts.text);
    const bpm=Math.max(30,Math.min(200,+opts.bpm||80)),beat=60/bpm,bpb=opts.bpb||4;
    Object.assign(this,{opts,p,bpm,beat,bpb,c0,events:[]});
    const clk=opts.clk||1;let nc=Math.round(bpb/clk);if(nc<3)nc*=2; // compound time: click on the dotted quarter, two bars of count-in
    Object.assign(this,{clk,nCount:nc});
    this.countClicks=Array.from({length:nc},(_,k)=>c0+k*clk*beat);
    this.notesStart=c0+nc*clk*beat;
    this.playClicks=opts.click?Array.from({length:Math.ceil(p.totalBeats/clk-1e-9)},(_,b)=>this.notesStart+b*clk*beat):[];
    this.end=this.notesStart+p.totalBeats*beat+0.25;
    return p;
  },
  start(opts){
    ensureCtx();
    const chk=parseSong(opts.text);
    if(chk.errors.length||!chk.notes.length){opts.onError&&opts.onError(chk.errors.length?'Couldn\'t read: '+chk.errors.slice(0,5).join(' '):'No notes to play.');return;}
    if(clickBus){try{clickBus.disconnect();}catch(e){}}
    clickBus=ctx.createGain();clickBus.connect(ctx.destination);
    this.prepare(opts,ctx.currentTime+0.7);
    this.countClicks.forEach((t,k)=>click(t,k===0));
    this.playClicks.forEach((t,b)=>click(t,Math.abs((b*this.clk)%this.bpb)<1e-6));
    this.running=true;this._sk=null;
    $('songStage').classList.remove('hidden');$('songResult').classList.add('hidden');
    $('heardNote').textContent='';
    opts.onStart&&opts.onStart();
    requestAnimationFrame(()=>this.tick());
  },
  stop(){
    this.running=false;if(clickBus){try{clickBus.disconnect();}catch(e){}clickBus=null;}
    $('songStage').classList.add('hidden');
    this.opts&&this.opts.onStop&&this.opts.onStop();
  },
  onset(ev){
    const t=micTime(ev);this.events.push({t,midi:ev.midi,s:ev.s});
    if(ev.midi!=null&&t>this.notesStart-this.beat)$('heardNote').textContent='heard '+pretty(midiName(ev.midi));
  },
  tick(){
    if(!this.running)return;
    const now=ctx.currentTime,beat=this.beat,bpb=this.bpb;
    const clk=this.clk||1,cpos=(now-this.c0)/(beat*clk),cin=this.nCount||bpb;
    const bpos=cpos<cin?cpos*clk:(now-this.c0)/beat;
    const frac=cpos-Math.floor(cpos);
    $('beatDot').className='beat'+(cpos>=0&&frac<0.18?(Math.abs((Math.floor(cpos)*clk)%bpb)<1e-6?' accent':' flash'):'');
    const view=this.opts.view||'both';
    const showScore=(i)=>{if(view==='names'){$('stageScore').classList.add('hidden');return;}
      const per=2,sys=Math.floor(Math.floor(this.p.notes[i].beat/bpb+1e-9)/per),key=sys+':'+i;
      $('stageScore').classList.remove('hidden');
      if(key!==this._sk){this._sk=key;$('stageScore').innerHTML=scoreSVG(this.p,{bpb,ts:this.opts.ts,key:this.opts.key,staff:this.opts.staff,from:sys*per,to:sys*per+per,per,hl:i});}};
    const inCount=cpos<cin;
    if(inCount){
      showScore(0);
      $('countNum').classList.remove('hidden');$('noteBox').classList.add('hidden');
      $('countNum').textContent=cpos<0?'·':String(Math.floor(cpos)+1);
      $('nextNotes').textContent=view==='staff'?'':'first: '+label(this.p.notes[0]);
    }else{
      $('countNum').classList.add('hidden');$('noteBox').classList.toggle('hidden',view==='staff');
      const sb=(now-this.notesStart)/beat;const notes=this.p.notes;
      let i=notes.findIndex(n=>n.beat+Math.min(n.dur,1)*0.5>sb);
      if(i<0)i=notes.length-1;
      showScore(i);
      const n=notes[i];
      $('nowNote').textContent=pretty(n.name);
      $('nowNote').style.fontSize=view==='both'?(n.alts.length>1?'30px':'40px'):(n.alts.length>1?'44px':'');
      $('nowSolf').textContent=settings.solf?solfOf(n.midi,n.acc):'';
      $('nowFinger').classList.toggle('hidden',!n.finger);$('nowFinger').textContent='finger '+n.finger;
      $('nextNotes').textContent=view==='staff'?'':notes.slice(i+1,i+5).map(x=>pretty(x.name)).join('   ')||'last note';
    }
    if(now>=this.end+0.35){this.finish();return;}
    requestAnimationFrame(()=>this.tick());
  },
  latency(){
    const ds=[];
    this.countClicks.forEach(c=>{
      const e=this.events.find(e=>e.t>=c-0.02&&e.t<=c+0.35);
      if(e&&e.midi!=null)return; // a pitched sound is a piano note, not our click
      if(e)ds.push(e.t-c);
    });
    if(ds.length>=2){ds.sort((a,b)=>a-b);const Lt=ds[ds.length>>1];
      const good=ds.filter(d=>Math.abs(d-Lt)<0.06);
      if(good.length>=2&&Lt<0.35){store.set('autoLat',Lt);return {L:Lt,auto:true};}}
    const last=store.get('autoLat',null);
    if(last!=null)return {L:last,auto:false,prev:true};
    return {L:settings.lat/1000,auto:false};
  },
  finish(){
    this.running=false;
    if(!micOn()){this.selfCheck();return;}
    const lat=this.latency();
    const exp=this.p.notes.map(n=>({...n,t:this.notesStart+n.beat*this.beat,durSec:n.dur*this.beat}));
    const evs=this.events.map(e=>({t:e.t-lat.L,midi:e.midi}));
    const g=grade(exp,evs,{beat:this.beat,strictOctave:this.opts.strict!=null?this.opts.strict:settings.strict,clickTimes:this.playClicks});
    this.render(g,lat);
    this.opts.onResult&&this.opts.onResult(g,this.streak);
  },
  // mic off: she judges the run herself; it still counts toward the clean-run streak
  selfCheck(){
    $('songStage').classList.add('hidden');$('songResult').classList.remove('hidden');
    $('chips').innerHTML='';$('resScore').classList.add('hidden');$('streakText').innerHTML='';$('copyMsg').textContent='';
    $('againBtn').parentElement.classList.add('hidden');
    $('sumText').innerHTML=`<div class="big">Mic is off — how was it?</div><div class="help">Clean = every note right, steady with the click, no stops.</div>
      <div class="answers"><button class="btn" id="selfClean">✨ Clean run</button><button class="btn" id="selfNot">Not clean yet</button></div>`;
    const done=clean=>{$('againBtn').parentElement.classList.remove('hidden');const n=this.p.notes.length;
      const g={res:[],extras:[],correct:clean?n:0,total:n,onTime:clean?n:0,avgAbs:0,mean:0,clean,tendency:'self-checked',self:true};
      this.render(g,null);this.opts.onResult&&this.opts.onResult(g,this.streak);};
    $('selfClean').onclick=()=>done(true);$('selfNot').onclick=()=>done(false);
  },
  render(g,lat){
    $('songStage').classList.add('hidden');$('songResult').classList.remove('hidden');$('againBtn').parentElement.classList.remove('hidden');
    const key=this.opts.id||(this.opts.name+'@'+this.bpm);
    if(key!==this.streakKey){this.streakKey=key;this.streak=0;}
    this.streak=g.clean?this.streak+1:0;
    if(this.streak===3)ach('metronome');
    const ms=x=>Math.round(x*1000);
    const need0=this.opts.need||3;
    if(g.self){
      $('sumText').innerHTML=`<div class="big ${g.clean?'clean':'notclean'}">${g.clean?'✨ CLEAN RUN':'Not clean yet'}</div><div class="help">self-checked (mic off)</div>`;
      $('chips').innerHTML='';$('resScore').classList.add('hidden');
      $('streakText').innerHTML=`Clean runs in a row: <b>${this.streak}</b> / ${need0}`+(this.streak>=need0?' 🏆 target met!':'');
      this.lastText=`${this.opts.name} @ ${this.bpm} bpm — self-checked (mic off): ${g.clean?'CLEAN':'not clean'} — clean streak ${this.streak}/${need0}`;
      logEvt(this.lastText);return;
    }
    $('sumText').innerHTML=
      `<div class="big ${g.clean?'clean':'notclean'}">${g.clean?'✨ CLEAN RUN':'Not clean yet'}</div>`+
      `Notes: <b>${g.correct}/${g.total}</b> correct · On time: <b>${g.onTime}/${g.total}</b><br>`+
      `Timing: avg ${ms(g.avgAbs)} ms off · <b>${g.tendency}</b>`+
      (g.extras.length?`<br>Extra notes heard: ${g.extras.length}`:'')+
      `<div class="help">latency ${ms(lat.L)} ms ${lat.auto?'(measured)':lat.prev?'(last measured)':'(fallback — mic didn’t hear the clicks)'}</div>`;
    const colors={};g.res.forEach((r,i)=>{colors[i]=r.status!=='hit'?'#d8434f':(r.timing==='perfect'||r.timing==='good')?'#2e9e62':'#d68a1f';});
    const showRes=(this.opts.view||'both')!=='names';
    $('resScore').classList.toggle('hidden',!showRes);
    if(showRes)$('resScore').innerHTML=scoreSVG(this.p,{bpb:this.bpb,ts:this.opts.ts,key:this.opts.key,staff:this.opts.staff,colors});
    $('chips').innerHTML=g.res.map(r=>{
      let cls='bad',top='✗',bot='';
      if(r.status==='miss'){top='—';bot='missed';}
      else if(r.status==='wrong'){top='✗';bot=pretty(midiName(r.heard));}
      else{
        const d=Math.round(r.dt*1000);
        if(r.timing==='perfect'||r.timing==='good'){cls='ok';top='✓';}else{cls='meh';top=r.timing;}
        bot=(d>0?'+':'')+d+'ms'+(r.octaveOff?' 8va?':'');
      }
      return `<div class="chip ${cls}"><b>${pretty(r.name)}</b>${top}<br>${bot}</div>`;
    }).join('');
    const need=this.opts.need||3;
    $('streakText').innerHTML=`Clean runs in a row: <b>${this.streak}</b> / ${need}`+(this.streak>=need?' 🏆 target met!':'');
    this.lastText=`${this.opts.name} @ ${this.bpm} bpm — notes ${g.correct}/${g.total}, on time ${g.onTime}/${g.total}, avg ${ms(g.avgAbs)} ms off (${g.tendency})`+
      (g.extras.length?`, ${g.extras.length} extra`:'')+` — ${g.clean?'CLEAN':'not clean'} — clean streak ${this.streak}/${need}`+
      (g.clean?'':'. Problems: '+g.res.filter(r=>r.status!=='hit'||!(r.timing==='perfect'||r.timing==='good')).slice(0,6).map(r=>`${pretty(r.name)}#${g.res.indexOf(r)+1} ${r.status==='miss'?'missed':r.status==='wrong'?'heard '+pretty(midiName(r.heard)):r.timing}`).join(', '));
    logEvt(this.lastText);
    $('copyMsg').textContent='';
  }
};

export function label(n){return pretty(n.name)+(n.finger?' (finger '+n.finger+')':'');}
