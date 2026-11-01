// Microphone/AudioContext lifecycle and the detection engine instance.
import { $, toast } from './dom.js';
import { Engine } from './engine.js';
import { hunt } from './hunt.js';
import { improv } from './improv.js';
import { L, renderMap } from './lessons.js';
import { tab } from './nav.js';
import { song } from './song.js';
import { sensToDb, settings, store } from './state.js';
import { task } from './task.js';
import { tuner } from './tuner.js';

export let ctx=null,engine=null,baseHist=[],ctxBase=0,wakeLock=null;

export function micTime(ev){return ev.s/engine.sr+ctxBase;}

export let micStream=null,micSrc=null,micProc=null,visHooked=false;

export const micOn=()=>!!engine; // the mic is "on" exactly when the detection engine is running

export function micErr(m){if(!$('gate').classList.contains('hidden'))$('gateErr').textContent=m;else toast(m);}

export function ensureCtx(){if(!ctx){const AC=window.AudioContext||window.webkitAudioContext;ctx=new AC();}if(ctx.state!=='running')ctx.resume();}

export function updateMicUI(){
  const on=micOn();$('micPill').textContent=on?'🎤 mic on':'🎤 mic off';$('micPill').classList.toggle('on',on);
  $('micToggle').checked=on;$('tunerOff').classList.toggle('hidden',on);
}

export function hookVisibility(){
  if(visHooked)return;visHooked=true;
  document.addEventListener('visibilitychange',async()=>{
    if(document.visibilityState==='visible'){try{if(ctx&&ctx.state!=='running')await ctx.resume();if(micOn()&&navigator.wakeLock)wakeLock=await navigator.wakeLock.request('screen');}catch(e){}}
  });
}

export function afterMicChange(){updateMicUI();if(song.running)song.stop();if(tab==='learn'&&L.q)L.render();if(tab==='hunt')$('huntStage').classList.add('hidden');}

export function startNoMic(){ensureCtx();$('gate').classList.add('hidden');store.set('mic',false);hookVisibility();updateMicUI();if(tab==='learn'&&!L.q)renderMap();}

export function stopMic(){
  try{if(micProc){micProc.onaudioprocess=null;micProc.disconnect();}if(micSrc)micSrc.disconnect();if(micStream)micStream.getTracks().forEach(t=>t.stop());}catch(e){}
  micStream=micSrc=micProc=null;engine=null;store.set('mic',false);
  try{if(wakeLock)wakeLock.release();}catch(e){}
  afterMicChange();toast('Mic off — tap what you play, self-check songs');
}

export async function startMic(){
  $('gateErr').textContent='';
  if(!window.isSecureContext){micErr('The mic only works over https:// — open this page from an https link, not as a local file.');return;}
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){micErr('This browser can\'t use the mic here. On iPhone, open the page in Safari.');return;}
  try{
    ensureCtx();
    const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
    if(ctx.state!=='running')await ctx.resume();
    const src=ctx.createMediaStreamSource(stream);
    const proc=ctx.createScriptProcessor(1024,1,1);
    micStream=stream;micSrc=src;micProc=proc;baseHist=[];
    engine=new Engine(ctx.sampleRate);engine.sensDb=sensToDb(settings.sens);
    proc.onaudioprocess=e=>{
      const pt=(typeof e.playbackTime==='number'&&e.playbackTime>0)?e.playbackTime:ctx.currentTime;
      const b=pt-engine.total/engine.sr;
      baseHist.push(b);if(baseHist.length>15)baseHist.shift();
      const s=baseHist.slice().sort((x,y)=>x-y);ctxBase=s[s.length>>1];
      engine.push(e.inputBuffer.getChannelData(0));
    };
    const mute=ctx.createGain();mute.gain.value=0;
    src.connect(proc);proc.connect(mute);mute.connect(ctx.destination);
    wireEngine();engine.cont=(tab==='tuner');
    $('gate').classList.add('hidden');store.set('mic',true);
    try{if(navigator.wakeLock)wakeLock=await navigator.wakeLock.request('screen');}catch(e){}
    hookVisibility();afterMicChange();
  }catch(err){
    micErr((err&&err.name==='NotAllowedError')?'Mic permission was refused. In Safari: tap “aA” → Website Settings → Microphone → Allow, then reload. Or use the app without the mic.':'Could not start the mic: '+(err&&err.message||err));
    updateMicUI();
  }
}

// soft piano-like tones (ear training); arp = play one after another
export function playTones(midis,arp){
  ensureCtx();const t0=ctx.currentTime+0.05;
  midis.forEach((m,i)=>{const at=t0+(arp?i*0.45:0),f=440*Math.pow(2,(m-69)/12);
    const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=f;
    g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(0.25,at+0.01);g.gain.exponentialRampToValueAtTime(0.001,at+1.6);
    o.connect(g);g.connect(ctx.destination);o.start(at);o.stop(at+1.7);});
}

export function wireEngine(){
  engine.on('onset',ev=>{
    if(song.running)song.onset(ev);
    else if(task.active)task.onset(ev);
    else if(improv.active)improv.onset(ev);
    else if(tab==='hunt'&&hunt.active)hunt.onset(ev);
  });
  engine.on('pitch',r=>{if(tab==='tuner')tuner.show(r);});
  engine.on('level',l=>{if(tab==='tuner'){const p=Math.max(0,Math.min(100,(l.db+70)*1.6));$('tLevel').style.width=p+'%';}});
}
