// Improvisation task: stay inside a note set.
import { micOn } from './audio.js';
import { midiName, pc, pretty } from './notation.js';

export const improv={active:false,
  start(cfg,host,onFinish){
    this.cfg=cfg;this.onFinish=onFinish;this.ok=0;this.bad=0;this.host=host;this.active=true;
    host.innerHTML=`<div class="now ivCount" style="text-align:center;font-size:44px"></div><div class="feedback ivFb"></div><div class="meter"><div class="ivBar"></div></div><div class="answers ivAns"></div>`;
    this.draw();
    if(!micOn()){ // mic off: honour system
      const a=host.querySelector('.ivAns');a.innerHTML=`<button class="btn">✓ I played ${cfg.need} notes, all inside the set</button>`;
      a.querySelector('button').onclick=()=>{if(!this.active)return;this.active=false;onFinish({ok:cfg.need,bad:0,self:true});};
    }
  },
  draw(){this.host.querySelector('.ivCount').textContent=this.ok+' / '+this.cfg.need;this.host.querySelector('.ivBar').style.width=Math.min(100,100*this.ok/this.cfg.need)+'%';},
  onset(ev){
    if(!this.active||ev.midi==null)return;
    const fb=this.host.querySelector('.ivFb');
    if(this.cfg.pcs.includes(pc(ev.midi))){this.ok++;fb.textContent='';fb.className='feedback ivFb';this.draw();
      if(this.ok>=this.cfg.need){this.active=false;this.onFinish({ok:this.ok,bad:this.bad});}}
    else{this.bad++;fb.textContent='✗ '+pretty(midiName(ev.midi)).replace(/\d+$/,'')+' is outside the set ('+this.bad+'/'+(this.cfg.maxBad+1)+')';fb.className='feedback ivFb bad';
      if(this.bad>this.cfg.maxBad){this.active=false;this.onFinish({ok:this.ok,bad:this.bad,failed:true});}}
  }
};
