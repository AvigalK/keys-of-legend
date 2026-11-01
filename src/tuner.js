// Tuner tab.
import { $ } from './dom.js';
import { SOLF, midiName, pc, pretty } from './notation.js';
import { settings } from './state.js';

export const tuner={show(r){
  if(!r)return;
  $('tNote').textContent=pretty(midiName(r.midi));$('tSolf').textContent=settings.solf?SOLF[pc(r.midi)]:'';
  $('tDot').style.left=(50+Math.max(-50,Math.min(50,r.cents)))+'%';
  $('tHz').textContent=r.freq.toFixed(1)+' Hz · '+(r.cents>0?'+':'')+r.cents+' cents';
}};
