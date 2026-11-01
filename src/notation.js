// Note names, MIDI helpers and the text note format parser (pure, no DOM).
export const NAMES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

export const SOLF=['Do','Do♯','Re','Re♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'];

export const SEMI={C:0,D:2,E:4,F:5,G:7,A:9,B:11};

export const LIDX={C:0,D:1,E:2,F:3,G:4,A:5,B:6};

export const LETTERS=['C','D','E','F','G','A','B'];

export const LOW_MIDI=36, HIGH_MIDI=96; // C2..C7 (61 keys)

export const pc=m=>((m%12)+12)%12;

export const isWhite=m=>NAMES[pc(m)].length===1;

export function midiName(m){return NAMES[pc(m)]+(Math.floor(m/12)-1);}

export function pretty(s){return String(s).split('+').map(x=>x.replace('#','♯').replace(/^([A-G])b/,'$1♭')).join(' + ');}

export function parseNoteName(str){
  const m=/^([A-Ga-g])([#b]?)(-?\d)$/.exec(str); if(!m) return null;
  const L=m[1].toUpperCase(), acc=m[2]==='#'?1:m[2]==='b'?-1:0, oct=+m[3];
  return {midi:(oct+1)*12+SEMI[L]+acc,letter:L,acc,oct,name:L+(acc===1?'#':acc===-1?'b':'')+oct};
}

export function spellWhite(m){const L=NAMES[pc(m)];return {midi:m,letter:L,acc:0,oct:Math.floor(m/12)-1,name:L+(Math.floor(m/12)-1)};}

export function solfOf(midi,acc){ if(acc===-1){return SOLF[pc(midi+1)]+'♭';} return SOLF[pc(midi)]; }

export const DUR={w:4,h:2,q:1,e:0.5,s:0.25};

export function parseSong(text){
  const notes=[],rests=[],errors=[];let beat=0;
  for(const tok of String(text||'').replace(/\|/g,' ').split(/\s+/).filter(Boolean)){
    // note(+note)* ; a joined note may carry its own length after ':' (E4+C3:w = LH holds a whole note)
    // a leading _ marks a left-hand note (always drawn on the bass staff)
    const m=/^((?:_?[A-Ga-g][#b]?-?\d(?::[whqes]\.?)?)(?:\+_?[A-Ga-g][#b]?-?\d(?::[whqes]\.?)?)*|[Rr])([whqesWHQES]?)(\.?)(?:\/([1-5]))?$/.exec(tok);
    if(!m){errors.push(tok);continue;}
    const d=DUR[(m[2]||'q').toLowerCase()]*(m[3]?1.5:1);
    if(/^[Rr]$/.test(m[1])){rests.push({beat,dur:d});beat+=d;continue;}
    const parts=m[1].split('+').map(x=>{const lh=x[0]==='_';const [nm,pd]=x.replace(/^_/,'').split(':');const q=parseNoteName(nm);if(!q)return null;q.dur=pd?DUR[pd[0]]*(pd[1]?1.5:1):d;if(lh)q.lh=true;return q;});
    if(parts.some(x=>!x)){errors.push(tok);continue;}
    const p=parts[0];
    notes.push({...p,dur:d,parts,alts:parts.map(x=>x.midi),name:parts.map(x=>x.name).join('+'),beat,finger:m[4]?+m[4]:null});beat+=d;
  }
  return {notes,rests,totalBeats:beat,errors};
}

export const rep=(tok,n)=>Array(n).fill(tok).join(' ');

// add a left-hand chord (held for the whole bar) to the first event of each bar. chords: per bar, e.g. 'C3+E3+G3', or null
export const BAR_CODE={2:'h',3:'h.',4:'w'};

export function addLH(text,chords,bpb=4){
  return text.split('|').map((bar,i)=>{
    const c=chords[i];if(!c)return bar.trim();
    const toks=bar.trim().split(/\s+/),lh=c.split('+').map(x=>x+':'+BAR_CODE[bpb]).join('+');
    const r=/^R([whqes]?\.?)$/.exec(toks[0]);
    if(r)toks[0]=lh+(r[1]||'q');
    else{const m=/^([A-G][#b]?\d)([whqes]?\.?)(\/\d)?$/.exec(toks[0]);toks[0]=m[1]+'+'+lh+(m[2]||'')+(m[3]||'');}
    return toks.join(' ');
  }).join(' | ');
}

export const CH={C:'C3+E3+G3',F:'F2+A2+C3',G:'G2+B2+D3',Am:'A2+C3+E3',Dm:'D3+F3+A3',Em:'E2+G2+B2'};

export const N=s=>parseNoteName(s).midi;

// merge an independent right-hand and left-hand part into one playable line (one event per onset)
export const DCODE=[[6,'w.'],[4,'w'],[3,'h.'],[2,'h'],[1.5,'q.'],[1,'q'],[0.75,'e.'],[0.5,'e'],[0.375,'s.'],[0.25,'s']];

export function dcode(x){for(const [v,c] of DCODE)if(Math.abs(x-v)<1e-6)return c;return null;}

export function splitDur(x){const out=[];let r=x;while(r>1e-6){const p=DCODE.find(([v])=>v<=r+1e-6);if(!p)throw new Error('bad gap '+x);out.push(p[1]);r-=p[0];}return out;}

export function mergeHands(rh,lh,bpb=4){
  const A=parseSong(rh),B=parseSong(lh),ev={};
  const add=(n,pt,isR)=>{const k=n.beat.toFixed(4);(ev[k]=ev[k]||[]).push({name:pt.name,dur:pt.dur,f:isR?n.finger:null,r:isR});};
  A.notes.forEach(n=>n.parts.forEach(pt=>add(n,pt,true)));B.notes.forEach(n=>n.parts.forEach(pt=>add(n,pt,false)));
  const times=Object.keys(ev).map(Number).sort((a,b)=>a-b),total=Math.max(A.totalBeats,B.totalBeats);
  const toks=[];let pos=0;
  const push=(beat,tok)=>{if(beat>0&&Math.abs(beat/bpb-Math.round(beat/bpb))<1e-6)toks.push('|');toks.push(tok);};
  const rests=(from,len)=>{let b=from;splitDur(len).forEach(c=>{push(b,'R'+c);b+=DUR[c[0]]*(c[1]?1.5:1);});};
  if(times[0]>1e-6)rests(0,times[0]);
  times.forEach((t,i)=>{
    const ps=ev[t.toFixed(4)].sort((a,b)=>b.r-a.r),step=(i+1<times.length?times[i+1]:total)-t,parts=splitDur(step);
    const f=(ps.find(p=>p.f)||{}).f;
    push(t,ps.map(p=>(p.r?'':'_')+p.name+':'+dcode(p.dur)).join('+')+parts[0]+(f?'/'+f:''));
    if(parts.length>1){let b=t+DUR[parts[0][0]]*(parts[0][1]?1.5:1);parts.slice(1).forEach(c=>{push(b,'R'+c);b+=DUR[c[0]]*(c[1]?1.5:1);});}
  });
  return toks.join(' ').replace(/^\| /,'');
}

export const chordLine=(list,dur='h',f=1)=>list.map((c,i)=>c+dur+'/'+f+((i%2===1&&i<list.length-1)?' |':'')).join(' ');
