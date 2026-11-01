// Grades a played run against the expected notes (pure).
import { pc } from './notation.js';

export function grade(expected,events,opt){
  const beat=opt.beat, strict=!!opt.strictOctave;
  let evs=events.filter(e=>e.midi!=null).map(e=>({...e}));
  // onsets from our own metronome click are not notes
  if(opt.clickTimes&&opt.clickTimes.length){
    const all=evs;
    evs=evs.filter(e=>{
      const c=opt.clickTimes.find(c=>Math.abs(e.t-c)<0.03);
      if(c==null)return true;
      if(all.some(o=>o!==e&&Math.abs(o.t-e.t)<0.2))return false;
      return expected.some(x=>Math.abs(x.t-c)<0.06);
    });
  }
  const first=expected[0].t,lastExp=expected[expected.length-1];
  const tEnd=lastExp.t+Math.max(beat,lastExp.durSec||beat);
  evs=evs.filter(e=>e.t>=first-0.6*beat&&e.t<=tEnd);
  const used=new Set();
  const win=Math.min(0.5*beat,0.45);
  // with hands together the mic hears one onset; any of the notes struck together counts
  const pitchOk=(a,x)=>{const L=x.alts||[x.midi];
    if(strict?L.includes(a):L.some(m=>pc(m)===pc(a)))return true;
    return L.length>1&&L.every(m=>{const r=Math.pow(2,(m-a)/12),k=Math.round(r);return k>=1&&k<=8&&Math.abs(r/k-1)<0.02;});};
  const res=expected.map(x=>{
    let best=null,bk=Infinity;
    evs.forEach((e,i)=>{
      if(used.has(i))return;const dt=e.t-x.t;if(Math.abs(dt)>win)return;
      const key=(pitchOk(e.midi,x)?0:10)+Math.abs(dt);
      if(key<bk){bk=key;best=i;}
    });
    if(best==null)return {...x,status:'miss'};
    used.add(best);const e=evs[best];const dt=e.t-x.t;
    const ok=pitchOk(e.midi,x);
    const ad=Math.abs(dt);
    const timing=ad<=0.06?'perfect':ad<=0.12?'good':(dt<0?'early':'late');
    return {...x,status:ok?'hit':'wrong',heard:e.midi,dt,timing,octaveOff:ok&&!(x.alts||[x.midi]).includes(e.midi)};
  });
  const extras=evs.filter((e,i)=>!used.has(i));
  const hits=res.filter(r=>r.status==='hit');
  const timed=res.filter(r=>r.dt!=null);
  const avgAbs=timed.length?timed.reduce((a,r)=>a+Math.abs(r.dt),0)/timed.length:0;
  const mean=timed.length?timed.reduce((a,r)=>a+r.dt,0)/timed.length:0;
  const onTime=res.filter(r=>r.status==='hit'&&(r.timing==='perfect'||r.timing==='good')).length;
  const clean=hits.length===expected.length&&onTime===expected.length&&extras.length===0;
  return {res,extras,correct:hits.length,total:expected.length,onTime,avgAbs,mean,clean,
    tendency:mean<-0.03?'rushing':mean>0.03?'dragging':'steady'};
}
