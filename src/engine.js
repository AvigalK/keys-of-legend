// Pitch + onset detection from microphone samples (pure, no DOM).
import { HIGH_MIDI, LOW_MIDI } from './notation.js';

export function yin(buf,sr,fmin=58,fmax=2250,thresh=0.15){
  const W=buf.length>>1;
  const tauMin=Math.max(2,Math.floor(sr/fmax)), tauMax=Math.min(W-1,Math.ceil(sr/fmin));
  const d=new Float32Array(tauMax+2);
  for(let tau=1;tau<=tauMax+1;tau++){
    let s=0;for(let i=0;i<W;i++){const x=buf[i]-buf[i+tau];s+=x*x;}d[tau]=s;
  }
  const c=new Float32Array(tauMax+2);c[0]=1;let run=0;
  for(let tau=1;tau<=tauMax+1;tau++){run+=d[tau];c[tau]=run>0?d[tau]*tau/run:1;}
  let tau=-1;
  for(let t=tauMin;t<=tauMax;t++){
    if(c[t]<thresh){while(t+1<=tauMax&&c[t+1]<c[t])t++;tau=t;break;}
  }
  if(tau<0){
    let best=tauMin;for(let t=tauMin;t<=tauMax;t++)if(c[t]<c[best])best=t;
    if(c[best]<0.3)tau=best;else return null;
  }
  let bt=tau;
  if(tau>1&&tau<tauMax+1){const a=c[tau-1],b=c[tau],e=c[tau+1];const den=a+e-2*b;if(den!==0)bt=tau+(a-e)/(2*den);}
  return {freq:sr/bt,clarity:1-c[tau]};
}

export function rmsDb(buf,start=0,len=buf.length){let s=0;for(let i=start;i<start+len;i++)s+=buf[i]*buf[i];return 10*Math.log10(s/len+1e-12);}

// Engine v2: an onset needs NEW sound after the attack (not just ringing/beating); pitch of the new
// partials is used when an earlier note still rings; tuner display needs 3-of-5 agreement.
// engine.debug=[] collects every onset decision for diagnostics.
export const FFT_N=8192, DATA_N=4096;

const _cos=new Float64Array(FFT_N/2), _sin=new Float64Array(FFT_N/2), _rev=new Uint16Array(FFT_N);

for(let i=0;i<FFT_N/2;i++){_cos[i]=Math.cos(2*Math.PI*i/FFT_N);_sin[i]=-Math.sin(2*Math.PI*i/FFT_N);}

for(let i=0;i<FFT_N;i++){let r=0,x=i;for(let b=0;b<13;b++){r=(r<<1)|(x&1);x>>=1;}_rev[i]=r;}

const _hann=new Float64Array(DATA_N);

for(let i=0;i<DATA_N;i++)_hann[i]=0.5-0.5*Math.cos(2*Math.PI*i/(DATA_N-1));

const _re=new Float64Array(FFT_N), _im=new Float64Array(FFT_N);

export function magSpectrum(data){ // data: Float32Array(DATA_N) -> Float64Array(FFT_N/2) magnitudes
  for(let i=0;i<FFT_N;i++){_re[_rev[i]]=i<DATA_N?data[i]*_hann[i]:0;_im[_rev[i]]=0;}
  for(let size=2;size<=FFT_N;size<<=1){
    const half=size>>1,step=FFT_N/size;
    for(let i=0;i<FFT_N;i+=size){
      for(let j=0,k=0;j<half;j++,k+=step){
        const a=i+j,b=a+half;
        const tr=_re[b]*_cos[k]-_im[b]*_sin[k], ti=_re[b]*_sin[k]+_im[b]*_cos[k];
        _re[b]=_re[a]-tr;_im[b]=_im[a]-ti;_re[a]+=tr;_im[a]+=ti;
      }
    }
  }
  const out=new Float64Array(FFT_N/2);
  for(let i=0;i<FFT_N/2;i++)out[i]=Math.hypot(_re[i],_im[i]);
  return out;
}

// N: novelty magnitudes. Returns {midi,freq,cents,purity,coverage} or null.
export function pitchFromNovelty(N,sr,opt={}){
  const binHz=sr/FFT_N, tol=opt.tol||0.02, maxF=opt.maxF||4500;
  const kLo=Math.max(2,Math.floor(55/binHz)), kHi=Math.min(N.length-2,Math.floor(Math.min(maxF,sr/2.2)/binHz));
  let total=0,mx=0;for(let k=kLo;k<=kHi;k++){total+=N[k]*N[k];if(N[k]>mx)mx=N[k];}
  if(mx<=0||total<=0)return null;
  // peak magnitude near frequency f (within +-tol, at least +-1 bin); also returns refined frequency
  const peakAt=(f)=>{
    const lo=Math.max(kLo,Math.floor(f*(1-tol)/binHz)), hi=Math.min(kHi,Math.ceil(f*(1+tol)/binHz));
    const c=Math.round(f/binHz), a=Math.min(lo,c-1), b=Math.max(hi,c+1);
    let bk=-1,bv=0;
    for(let k=Math.max(kLo,a);k<=Math.min(kHi,b);k++){if(N[k]>bv){bv=N[k];bk=k;}}
    if(bk<0)return {v:0,f:f};
    let fr=bk;if(bk>kLo&&bk<kHi){const l=N[bk-1],m=N[bk],r=N[bk+1],d=l-2*m+r;if(d<0)fr=bk+0.5*(l-r)/d;}
    return {v:bv,f:fr*binHz};
  };
  const cands=[];
  for(let m=LOW_MIDI-1;m<=HIGH_MIDI+1;m++){
    const f=440*Math.pow(2,(m-69)/12);
    let H=Math.min(10,Math.floor(maxF/f));if(H<2)continue;
    const A=[],F=[];let amax=0,E=0;
    for(let h=1;h<=H;h++){const p=peakAt(f*h);A.push(p.v);F.push(p.f/h);E+=p.v*p.v;if(p.v>amax)amax=p.v;}
    if(amax<=0)continue;
    let present=0;for(let h=0;h<H;h++)if(A[h]>0.12*amax)present++;
    cands.push({m,f,H,A,F,E,coverage:present/H,amax});
  }
  if(!cands.length)return null;
  let Emax=0;for(const c of cands)if(c.E>Emax)Emax=c.E;
  // lowest candidate that explains most of the best energy and has (almost) no missing harmonics
  let pick=null;
  for(const c of cands){ if(c.coverage>=(opt.minCov||0.7)&&c.E>=0.6*Emax){pick=c;break;} }
  if(!pick){ // fall back to the best-explained candidate
    pick=cands.reduce((a,b)=>b.E>a.E?b:a);
  }
  // purity = share of the novel band energy that sits on this note's harmonics
  const purity=pick.E/total;
  // refined frequency: strongest harmonics' implied fundamental
  let num=0,den=0;for(let h=0;h<pick.H;h++){const w=pick.A[h]*pick.A[h];if(pick.A[h]>0.25*pick.amax){num+=w*pick.F[h];den+=w;}}
  const fr=den?num/den:pick.f;
  const mm=69+12*Math.log2(fr/440), midi=Math.round(mm);
  return {midi,freq:fr,cents:Math.round((mm-midi)*100),purity,coverage:pick.coverage,total};
}

export class Engine{
  constructor(sr){
    this.sr=sr;this.N=1<<16;this.ring=new Float32Array(this.N);this.total=0;
    this.hop=256;this.hopAcc=0;this.W=2048;
    this.hist=[];this.dbLog=[];this.floor=-75;this.lastOnset=-1e12;this.pending=[];
    this.sensDb=14;this.rise=7;this.refractory=Math.round(0.06*sr);
    this.cont=false;this.hopCount=0;this.ls={};this.recent=[];this.tunerHist=[];this.tunerLast=null;
    this.debug=null; // set to an array to collect every onset decision (for diagnostics)
  }
  on(e,f){(this.ls[e]=this.ls[e]||[]).push(f);}
  emit(e,x){(this.ls[e]=this.ls[e]||[]).forEach(f=>f(x));}
  slice(start,len){const out=new Float32Array(len);for(let i=0;i<len;i++)out[i]=this.ring[(start+i)&(this.N-1)];return out;}
  push(block){
    for(let i=0;i<block.length;i++){
      this.ring[this.total&(this.N-1)]=block[i];this.total++;
      if(++this.hopAcc===this.hop){this.hopAcc=0;this.onHop();}
    }
  }
  analyze(start){ // monophonic pitch of a short window (YIN)
    const buf=this.slice(start,this.W);
    const db=rmsDb(buf);
    if(db<this.floor+8)return null;
    const r=yin(buf,this.sr);
    if(!r||r.clarity<0.75)return null;
    const m=69+12*Math.log2(r.freq/440);
    const midi=Math.round(m);
    if(midi<LOW_MIDI-1||midi>HIGH_MIDI+1)return null;
    return {freq:r.freq,midi,cents:Math.round((m-midi)*100),clarity:r.clarity,db};
  }
  // What is NEW at this onset? Compare the spectrum just after the attack with the one just before it.
  novelty(s){
    const sr=this.sr;
    const post=magSpectrum(this.slice(s+Math.round(0.02*sr),DATA_N));
    const pre=magSpectrum(this.slice(s-Math.round(0.006*sr)-DATA_N,DATA_N));
    const N=new Float64Array(post.length);let tp=0,tn=0,tq=0;
    for(let k=0;k<N.length;k++){const v=post[k]-0.7*pre[k];N[k]=v>0?v:0;tp+=post[k]*post[k];tq+=pre[k]*pre[k];tn+=N[k]*N[k];}
    return {share:tp>0?tn/tp:0,preRatio:tp>0?tq/tp:0,pitch:pitchFromNovelty(N,sr)};
  }
  onHop(){
    const start=this.total-this.hop;
    let s=0;for(let i=0;i<this.hop;i++){const x=this.ring[(start+i)&(this.N-1)];s+=x*x;}
    const db=10*Math.log10(s/this.hop+1e-12);
    this.hopCount++;
    this.dbLog.push(db);if(this.dbLog.length>1900)this.dbLog.shift();
    if(this.hopCount%40===0||this.hopCount<40){
      const a=this.dbLog.slice().sort((x,y)=>x-y);
      this.floor=Math.min(-48,Math.max(-95,a[Math.floor(a.length*0.1)]));
    }
    const minPrev=this.hist.length?Math.min(...this.hist):db;
    const meanPrev=this.hist.length?10*Math.log10(this.hist.reduce((a,v)=>a+Math.pow(10,v/10),0)/this.hist.length):db;
    if(db>this.floor+this.sensDb&&db-minPrev>=this.rise&&db-meanPrev>=3&&start-this.lastOnset>this.refractory){
      this.lastOnset=start;this.pending.push({s:start,db,hop:this.hopCount});
    }
    this.hist.push(db);if(this.hist.length>8)this.hist.shift();
    this.emit('level',{db,floor:this.floor});
    for(let k=0;k<this.pending.length;k++){
      const p=this.pending[k];
      if(this.total<p.s+Math.round(0.02*this.sr)+DATA_N+64)continue;
      const sr=this.sr;
      let r=this.analyze(p.s+Math.round(0.045*sr))||this.analyze(p.s+Math.round(0.08*sr));
      const nv=this.novelty(p.s);
      let source=r?'yin':'none';
      // An earlier note is still ringing: YIN hears the mix. Trust the pitch of the NEW partials instead.
      if(nv.preRatio>0.2&&nv.pitch&&nv.pitch.purity>=0.15&&nv.pitch.coverage>=0.7){
        const np=nv.pitch;
        if(!r||r.midi!==np.midi){r={freq:np.freq,midi:np.midi,cents:np.cents,clarity:np.purity};source='novelty';}
      }
      let peak=-200;
      for(let h=p.hop;h<=p.hop+8&&h<=this.hopCount;h++){const v=this.dbLog[this.dbLog.length-1-(this.hopCount-h)];if(v!=null&&v>peak)peak=v;}
      // hardly anything new after the attack = old notes ringing/beating, not a keypress
      let verdict;
      if(nv.share<0.15)verdict='ring';
      else if(!r)verdict='unpitched';
      else{
        const ghost=this.recent.some(o=>o.midi===r.midi&&(p.s-o.s<0.12*sr||(p.s-o.s<2*sr&&peak<o.peak-8)));
        verdict=ghost?'ghost':'note';
      }
      if(this.debug)this.debug.push({t:p.s/sr,db:p.db,floor:this.floor,peak:+peak.toFixed(1),newShare:+nv.share.toFixed(2),ringing:+nv.preRatio.toFixed(2),midi:r?r.midi:null,source,verdict});
      if(verdict==='note'){
        this.emit('onset',{s:p.s,t:p.s/sr,midi:r.midi,freq:r.freq,cents:r.cents,db:p.db,peak});
        this.recent.push({s:p.s,midi:r.midi,peak});if(this.recent.length>12)this.recent.shift();
      }else if(verdict==='unpitched'){
        this.emit('onset',{s:p.s,t:p.s/sr,midi:null,freq:null,cents:null,db:p.db,peak});
      }
      this.pending.splice(k,1);k--;
    }
    if(this.cont&&this.hopCount%2===0){
      const r=db>this.floor+10?this.analyze(this.total-this.W):null;
      // display only changes when 3 of the last 5 frames agree -> no octave flicker
      this.tunerHist.push(r?r.midi:null);if(this.tunerHist.length>5)this.tunerHist.shift();
      let out=null;
      if(r){
        const cnt={};this.tunerHist.forEach(m=>{if(m!=null)cnt[m]=(cnt[m]||0)+1;});
        let bm=null,bc=0;for(const m in cnt)if(cnt[m]>bc){bc=cnt[m];bm=+m;}
        if(bc>=3)this.tunerLast=bm;
        if(this.tunerLast!=null&&r.midi===this.tunerLast)out=r;
      }else if(db<=this.floor+10){this.tunerLast=null;this.tunerHist.length=0;}
      this.emit('pitch',out);
    }
  }
}
