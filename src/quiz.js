// Quiz and random-note generators.
import { LETTERS, N, isWhite, parseSong, pretty, spellWhite } from './notation.js';
import { kbFromSpec, kbSVG, scoreSVG, staffSVG } from './render.js';

export function randomItems(pool,n){ // pool: midi list; no immediate repeats
  const out=[];let last=null;
  for(let i=0;i<n;i++){let m;do{m=pool[Math.floor(Math.random()*pool.length)];}while(pool.length>1&&m===last);last=m;out.push(spellWhite(m));}
  return out;
}

export const whitesIn=(a,b)=>{const r=[];for(let m=N(a);m<=N(b);m++)if(isWhite(m))r.push(m);return r;};

export function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

export function letterOpts(correct){return shuffle([correct,...shuffle(LETTERS.filter(l=>l!==correct)).slice(0,3)]);}

export function genQuiz(s){
  if(s.kind==='mc')return s.items.map(it=>({html:`<div class="now" style="font-size:22px;text-align:left">${it.q}</div>`+(it.score?`<div class="staffwrap">${scoreSVG(parseSong(it.score),{bpb:it.bpb,ts:it.ts,key:it.key,per:1})}</div>`:'')+(it.kb?kbFromSpec(it.kb):''),opts:shuffle(it.opts),a:it.a,why:it.why||'',play:it.play}));
  if(s.kind==='ear'){ // hear a chord, name its quality
    const roots=['C4','D4','E4','F4','G4','A3','D3'];const qs=[];
    for(let i=0;i<s.n;i++){const r=N(roots[Math.floor(Math.random()*roots.length)]);const minor=Math.random()<0.5;
      qs.push({html:`<div class="now" style="font-size:22px;text-align:left">Major or minor?</div><div class="sub">Tap ▶ to hear it again.</div>`,opts:['Major','Minor'],a:minor?'Minor':'Major',why:minor?'Minor — darker':'Major — brighter',play:[r,r+(minor?3:4),r+7]});}
    return qs;
  }
  if(s.kind==='earint'){ // hear two notes one after the other, name the interval
    const kinds=[['2nd',[1,2]],['3rd',[3,4]],['5th',[7]],['Octave',[12]]],roots=['C3','D3','E3','F3','G3','A3','C4','D4','E4','F4','G4'];const qs=[];let lastK=-1;
    for(let i=0;i<s.n;i++){let k;do{k=Math.floor(Math.random()*kinds.length);}while(k===lastK);lastK=k;
      const r=N(roots[Math.floor(Math.random()*roots.length)]),sz=kinds[k][1][Math.floor(Math.random()*kinds[k][1].length)];
      qs.push({html:`<div class="now" style="font-size:22px;text-align:left">How far apart?</div><div class="sub">Two notes, one after the other. Tap ▶ to hear them again.</div>`,opts:kinds.map(x=>x[0]),a:kinds[k][0],why:kinds[k][0]+' ('+sz+' half steps)',play:[r,r+sz],arp:true});}
    return qs;
  }
  if(s.kind==='earchord'){ // hear a four-note chord, name its quality
    const kinds=[['Major 7th',[0,4,7,11]],['Minor 7th',[0,3,7,10]],['Dominant 7th',[0,4,7,10]]],roots=['C3','D3','F3','G3','A3','C4'];const qs=[];
    for(let i=0;i<s.n;i++){const k=Math.floor(Math.random()*kinds.length),r=N(roots[Math.floor(Math.random()*roots.length)]);
      qs.push({html:`<div class="now" style="font-size:22px;text-align:left">Which 7th chord?</div><div class="sub">Maj7 = dreamy · m7 = mellow · 7 = bluesy, wants to move. Tap ▶ to hear it again.</div>`,opts:kinds.map(x=>x[0]),a:kinds[k][0],why:kinds[k][0],play:kinds[k][1].map(x=>r+x)});}
    return qs;
  }
  const pool=whitesIn(s.from,s.to),qs=[];let last=null;
  for(let i=0;i<s.n;i++){
    let m;do{m=pool[Math.floor(Math.random()*pool.length)];}while(m===last&&pool.length>1);last=m;
    const nt=spellWhite(m);
    if(s.kind==='staffname')qs.push({html:`<div class="staffwrap">${staffSVG(nt)}</div>`,opts:letterOpts(nt.letter),a:nt.letter,why:pretty(nt.name)});
    if(s.kind==='keyname'){const mk={};mk[m]='?';qs.push({html:`<div class="kbwrap">${kbSVG(N(s.from),N(s.to),mk)}</div>`,opts:letterOpts(nt.letter),a:nt.letter,why:pretty(nt.name)});}
    if(s.kind==='interval'){
      const idx=pool.indexOf(m);const step=[0,1,2][Math.floor(Math.random()*3)]*(Math.random()<0.5?-1:1);
      let j=idx+step;if(j<0||j>=pool.length)j=idx-step;
      const nt2=spellWhite(pool[j]);const dist=Math.abs(j-idx);
      const ans=['Same note','Step (2nd)','Skip (3rd)'][dist];
      qs.push({html:`<div class="staffwrap">${staffSVG([nt,nt2])}</div>`,opts:['Same note','Step (2nd)','Skip (3rd)'],a:ans,why:pretty(nt.name)+' → '+pretty(nt2.name)});
    }
  }
  return qs;
}
