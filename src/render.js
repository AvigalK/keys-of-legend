// SVG/HTML renderers for keyboard, staff and sheet music (pure string builders).
import { LIDX, N, isWhite, parseNoteName, parseSong, pretty } from './notation.js';

// keyboard from..to (MIDI, should be white keys). marks: {midi: label}
export function kbSVG(from,to,marks={},opt={}){
  const whites=[];for(let m=from;m<=to;m++)if(isWhite(m))whites.push(m);
  const n=whites.length,W=340,ww=W/n,H=Math.max(56,Math.min(140,ww*4.6));
  const bw=ww*0.6,bh=H*0.62;
  const fs=Math.max(8,Math.min(20,ww*0.5));
  let out=`<svg viewBox="0 0 ${W} ${H+16}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="keyboard">`;
  const wx=m=>whites.indexOf(m)*ww;
  whites.forEach((m,i)=>{
    const mk=marks[m]!=null;
    out+=`<rect x="${i*ww+0.5}" y="0.5" width="${ww-1}" height="${H}" rx="${Math.min(4,ww*0.15)}" fill="${mk?'#f2c14e':'#f7f4ee'}" stroke="#2b2733" stroke-width="1"/>`;
    if(mk&&marks[m]!=='')out+=`<text x="${i*ww+ww/2}" y="${H-6}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="#221a05" font-family="-apple-system,sans-serif">${marks[m]}</text>`;
    if(m===60&&opt.showC4!==false)out+=`<text x="${i*ww+ww/2}" y="${H+13}" text-anchor="middle" font-size="10" fill="#a49fb8" font-family="-apple-system,sans-serif">C4</text>`;
  });
  for(let m=from;m<to;m++){
    if(isWhite(m)&&!isWhite(m+1)){
      const x=wx(m)+ww-bw/2,mk=marks[m+1]!=null;
      out+=`<rect x="${x}" y="0.5" width="${bw}" height="${bh}" rx="2" fill="${mk?'#f2a24e':'#1a1622'}"/>`;
      if(mk&&marks[m+1]!=='')out+=`<text x="${x+bw/2}" y="${bh-5}" text-anchor="middle" font-size="${Math.max(7,fs*0.8)}" font-weight="700" fill="#221a05" font-family="-apple-system,sans-serif">${marks[m+1]}</text>`;
    }
  }
  return out+'</svg>';
}

// grand staff: C4 and up on treble, below C4 on bass. notes: one note or array {letter,acc,oct}
export function staffSVG(notes){
  if(!Array.isArray(notes))notes=[notes];
  const s=12,W=300,H=244,TM=70,BM=176;
  const yT=k=>TM-(k-6)*s/2, yB=k=>BM-(k+6)*s/2;
  let out=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="notes on grand staff">`;
  const line=(yy,x1=20,x2=W-12)=>`<line x1="${x1}" x2="${x2}" y1="${yy}" y2="${yy}" stroke="#2b2733" stroke-width="1.4"/>`;
  [2,4,6,8,10].forEach(k=>out+=line(yT(k)));
  [-2,-4,-6,-8,-10].forEach(k=>out+=line(yB(k)));
  out+=`<line x1="20" x2="20" y1="${yT(10)}" y2="${yB(-10)}" stroke="#2b2733" stroke-width="2"/>`;
  const F="'Noto Music','Apple Symbols','Bravura Text','Segoe UI Symbol',serif";
  out+=`<text x="26" y="${yT(2)+9}" font-size="${s*5.6}" font-family="${F}" fill="#2b2733">𝄞</text>`;
  out+=`<text x="28" y="${yB(-6)+12}" font-size="${s*3.6}" font-family="${F}" fill="#2b2733">𝄢</text>`;
  const n=notes.length,x0=notes.length===1?170:110,x1=270;
  notes.forEach((nt,i)=>{
    const cx=n===1?x0:Math.round(x0+(x1-x0)*i/(n-1));
    const d=LIDX[nt.letter]+7*(nt.oct-4);
    const treble=d>=0;
    const y=k=>treble?yT(k):yB(k);
    const ledgers=[];
    if(treble){ if(d<=0)for(let k=0;k>=d;k-=2)ledgers.push(k); if(d>=12)for(let k=12;k<=d;k+=2)ledgers.push(k); }
    else{ if(d<=-12)for(let k=-12;k>=d;k-=2)ledgers.push(k); }
    ledgers.forEach(k=>out+=line(y(k),cx-16,cx+16));
    out+=`<ellipse cx="${cx}" cy="${y(d)}" rx="${s*0.68}" ry="${s*0.48}" transform="rotate(-20 ${cx} ${y(d)})" fill="#1a1622"/>`;
    if(nt.acc)out+=`<text x="${cx-30}" y="${y(d)+8}" font-size="26" font-family="serif" fill="#1a1622">${nt.acc===1?'♯':'♭'}</text>`;
    if(nt.label)out+=`<text x="${cx}" y="${H-6}" text-anchor="middle" font-size="13" font-weight="700" fill="#5a5368" font-family="-apple-system,sans-serif">${nt.label}</text>`;
  });
  return out+'</svg>';
}

export function durKind(b){
  for(const [v,k,dot] of [[6,'w',1],[4,'w',0],[3,'h',1],[2,'h',0],[1.5,'q',1],[1,'q',0],[0.75,'e',1],[0.5,'e',0],[0.375,'s',1],[0.25,'s',0]])
    if(Math.abs(b-v)<1e-6)return {base:k,dot:!!dot};
  return {base:'q',dot:false};
}

export const dOf=pt=>LIDX[pt.letter]+7*(pt.oct-4); // diatonic steps from C4

// staff for a note: marked left-hand notes go to the bass; other notes struck with them stay in the treble; otherwise split at middle C
export const staffOf=(n,pt)=>pt.lh?'B':n.parts.some(x=>x.lh)?'T':(dOf(pt)>=0?'T':'B');

// key signatures: staff position (diatonic steps from C4) on treble (t) and bass (b)
export const KS_SH=[{letter:'F',acc:1,t:10,b:-4},{letter:'C',acc:1,t:7,b:-7}],KS_FL=[{letter:'B',acc:-1,t:6,b:-8}];

export const KEYSIG={G:KS_SH.slice(0,1),Em:KS_SH.slice(0,1),D:KS_SH,F:KS_FL,Dm:KS_FL};

export function scoreStaffMode(p){
  let t=false,b=false;p.notes.forEach(n=>n.parts.forEach(pt=>{if(staffOf(n,pt)==='T')t=true;else b=true;}));
  return t&&b?'grand':b?'B':'T';
}

// p: parseSong result. o: {bpb, from, to (bars), per (bars per line), hl (note index), colors {idx:color}, time}
export function scoreSVG(p,o={}){
  const bpb=o.bpb||4,nBars=Math.max(1,Math.ceil(p.totalBeats/bpb-1e-9));
  const from=o.from||0,to=Math.min(o.to!=null?o.to:nBars,nBars),per=o.per||2;
  const mode=o.staff||scoreStaffMode(p),s=8,W=340,sysH=mode==='grand'?156:92;
  const nSys=Math.max(1,Math.ceil((to-from)/per));
  const INK='#1a1622',HL='#c98a00';
  let out=`<svg viewBox="0 0 ${W} ${nSys*sysH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="sheet music">`;
  const F="'Noto Music','Apple Symbols','Bravura Text','Segoe UI Symbol',serif";
  for(let k=0;k<nSys;k++){
    const b0=from+k*per,b1=Math.min(to,b0+per),top=k*sysH;
    const topT=top+28,topB=mode==='grand'?topT+72:top+28;
    const yT=d=>topT+(10-d)*s/2,yB=d=>topB+(-2-d)*s/2;
    const staves=mode==='grand'?['T','B']:[mode];
    const yOf=(st,d)=>st==='T'?yT(d):yB(d);
    const first=b0===0&&o.time!==false;
    const ks=KEYSIG[o.key]||[];
    const left=40+ks.length*8+(first?16:0),barW=(W-left-8)/per,xEnd=left+barW*(b1-b0);
    const sTop=st=>st==='T'?yT(10):yB(-2),sBot=st=>st==='T'?yT(2):yB(-10);
    staves.forEach(st=>{
      for(let i=0;i<5;i++){const y=sTop(st)+i*s;out+=`<line x1="6" x2="${xEnd}" y1="${y}" y2="${y}" stroke="#2b2733" stroke-width="1"/>`;}
      out+=st==='T'?`<text x="8" y="${yT(2)+6}" font-size="${s*5.6}" font-family="${F}" fill="#2b2733">𝄞</text>`:`<text x="9" y="${yB(-6)+8}" font-size="${s*3.6}" font-family="${F}" fill="#2b2733">𝄢</text>`;
      ks.forEach((a,i)=>{const d=st==='T'?a.t:a.b;out+=`<text class="ks" x="${36+i*8}" y="${yOf(st,d)+5}" font-size="15" font-family="serif" fill="#2b2733">${a.acc===1?'♯':'♭'}</text>`;});
      const [tsN,tsD]=(o.ts||bpb+'/4').split('/');
      if(first)out+=`<text x="${left-12}" y="${sTop(st)+15}" text-anchor="middle" font-size="17" font-weight="800" font-family="serif" fill="#2b2733">${tsN}</text><text x="${left-12}" y="${sTop(st)+31}" text-anchor="middle" font-size="17" font-weight="800" font-family="serif" fill="#2b2733">${tsD}</text>`;
    });
    const sysTop=sTop(staves[0]),sysBot=sBot(staves[staves.length-1]);
    out+=`<line x1="6" x2="6" y1="${sysTop}" y2="${sysBot}" stroke="#2b2733" stroke-width="1.4"/>`;
    for(let i=1;i<=b1-b0;i++){
      const x=left+barW*i,last=b0+i===nBars;
      out+=`<line x1="${x}" x2="${x}" y1="${sysTop}" y2="${sysBot}" stroke="#2b2733" stroke-width="${last?1:1}"/>`;
      if(last)out+=`<line x1="${x+3}" x2="${x+3}" y1="${sysTop}" y2="${sysBot}" stroke="#2b2733" stroke-width="3"/>`;
    }
    const xAt=beat=>{const bar=Math.floor(beat/bpb+1e-9);return left+(bar-b0)*barW+12+((beat-bar*bpb)/bpb)*(barW-20);};
    const inSys=beat=>{const bar=Math.floor(beat/bpb+1e-9);return bar>=b0&&bar<b1;};
    // rests
    (p.rests||[]).forEach(r=>{
      if(!inSys(r.beat))return;const st=mode==='B'?'B':'T',x=xAt(r.beat),mid=st==='T'?yT(6):yB(-6),dk=durKind(r.dur);
      if(dk.base==='w')out+=`<rect class="rest" data-k="w" x="${x-5}" y="${mid-s}" width="10" height="4" fill="${INK}"/>`;
      else if(dk.base==='h')out+=`<rect class="rest" data-k="h" x="${x-5}" y="${mid-4}" width="10" height="4" fill="${INK}"/>`;
      else if(dk.base==='e'||dk.base==='s')out+=`<g class="rest" data-k="${dk.base}"><circle cx="${x-2}" cy="${mid-3}" r="2.2" fill="${INK}"/><path d="M${x-2} ${mid-2} q3 1 5 -2 l-4 11" fill="none" stroke="${INK}" stroke-width="1.4"/>${dk.base==='s'?`<circle cx="${x-3.5}" cy="${mid+2}" r="2.2" fill="${INK}"/>`:''}</g>`;
      else out+=`<path class="rest" data-k="q" d="M${x-2} ${mid-11} l5 6 l-4 4 l5 6 c-4 -2 -7 1 -3 5 c-6 -3 -5 -8 1 -6 l-5 -5 l4 -4 z" fill="${INK}"/>`;
      if(dk.dot)out+=`<circle cx="${x+8}" cy="${mid-s/2}" r="1.5" fill="${INK}"/>`;
    });
    // notes
    p.notes.forEach((n,idx)=>{
      if(!inSys(n.beat))return;
      const x=xAt(n.beat),col=idx===o.hl?HL:(o.colors&&o.colors[idx])||INK;
      if(idx===o.hl)out+=`<rect x="${x-10}" y="${sysTop-14}" width="20" height="${sysBot-sysTop+28}" rx="4" fill="#f2c14e" opacity=".28"/>`;
      const groups={},twoV=mode!=='grand'&&n.parts.some(x=>x.lh); // one staff, two hands: RH stems up, LH stems down
      n.parts.forEach((pt,pi)=>{const d=dOf(pt);const st=mode==='grand'?staffOf(n,pt):mode;const k=st+(twoV?(pt.lh?'L':'R'):'');(groups[k]=groups[k]||[]).push({pt,pi,d});});
      Object.entries(groups).forEach(([gk,g])=>{const st=gk[0];
        const dk=durKind(g[0].pt.dur!=null?g[0].pt.dur:n.dur);
        const mid=st==='T'?6:-6,avg=g.reduce((a,h)=>a+h.d,0)/g.length,up=twoV?gk[1]==='R':avg<mid;
        const ys=g.map(h=>yOf(st,h.d));
        g.forEach(h=>{
          const y=yOf(st,h.d),d=h.d;
          // ledger lines
          const led=[];
          if(st==='T'){if(d<=0)for(let q=0;q>=d;q-=2)led.push(q);if(d>=12)for(let q=12;q<=d;q+=2)led.push(q);}
          else{if(d>=0)for(let q=0;q<=d;q+=2)led.push(q);if(d<=-12)for(let q=-12;q>=d;q-=2)led.push(q);}
          led.forEach(q=>out+=`<line x1="${x-8}" x2="${x+8}" y1="${yOf(st,q)}" y2="${yOf(st,q)}" stroke="#2b2733" stroke-width="1"/>`);
          const hollow=dk.base==='w'||dk.base==='h';
          out+=`<ellipse class="nh" data-st="${st}" data-d="${d}" data-k="${dk.base}" data-i="${idx}" cx="${x}" cy="${y}" rx="${dk.base==='w'?5.4:4.6}" ry="3.5" transform="rotate(-20 ${x} ${y})" fill="${hollow?'#fbf8f0':col}" stroke="${col}" stroke-width="${hollow?1.6:0.8}"/>`;
          const kAcc=(ks.find(a=>a.letter===h.pt.letter)||{acc:0}).acc;
          if(h.pt.acc!==kAcc)out+=`<text class="acc" x="${x-14}" y="${y+5}" font-size="15" font-family="serif" fill="${col}">${h.pt.acc===1?'♯':h.pt.acc===-1?'♭':'♮'}</text>`;
          if(dk.dot)out+=`<circle class="dot" cx="${x+8.5}" cy="${d%2===0?y-s/2:y}" r="1.5" fill="${col}"/>`;
        });
        if(dk.base!=='w'){
          const lo=Math.max(...ys),hi=Math.min(...ys);
          const sx=up?x+4.2:x-4.2,y1=up?lo:hi,y2=up?hi-26:lo+26;
          out+=`<line class="stem" x1="${sx}" x2="${sx}" y1="${y1}" y2="${y2}" stroke="${col}" stroke-width="1.2"/>`;
          const flags=dk.base==='e'?1:dk.base==='s'?2:0;
          for(let f=0;f<flags;f++){const fy=y2+(up?f*6:-f*6);
            out+=`<path class="flag" d="M${sx} ${fy} c0 ${up?6:-6} 7 ${up?7:-7} 6 ${up?15:-15}" fill="none" stroke="${col}" stroke-width="1.5"/>`;}
        }
        // finger number: goes with the first written note
        if(n.finger&&g.some(h=>h.pi===0)){
          const lo=Math.max(...ys),hi=Math.min(...ys);
          if(st==='T'){const fy=Math.min(yT(10)-6,(up&&dk.base!=='w'?hi-30:hi-9));out+=`<text class="fg" x="${x}" y="${fy}" text-anchor="middle" font-size="10" font-weight="700" fill="#7a6a3a" font-family="-apple-system,sans-serif">${n.finger}</text>`;}
          else{const fy=Math.max(yB(-10)+14,(!up&&dk.base!=='w'?lo+38:lo+16));out+=`<text class="fg" x="${x}" y="${fy}" text-anchor="middle" font-size="10" font-weight="700" fill="#7a6a3a" font-family="-apple-system,sans-serif">${n.finger}</text>`;}
        }
      });
    });
  }
  return out+'</svg>';
}

export function kbFromSpec(k){ // {from:'C4',to:'G4',marks:{'C4':'1',...}}
  const marks={};Object.entries(k.marks||{}).forEach(([nm,l])=>marks[N(nm)]=l);
  return `<div class="kbwrap">${kbSVG(N(k.from),N(k.to),marks)}</div>`;
}

export function staffFromSpec(list,labels){return `<div class="staffwrap">${staffSVG(list.map(x=>{const p=parseNoteName(x);if(labels)p.label=pretty(x);return p;}))}</div>`;}

export function glance(text){ // compact mobile view of a piece: 2 bars per line, finger as superscript
  const bars=String(text).split('|').map(b=>b.trim()).filter(Boolean);
  const per=/\+/.test(text)?1:2; // hands-together bars are wider: one per line on a phone
  const lines=[];for(let i=0;i<bars.length;i+=per)lines.push(bars.slice(i,i+per).join('  |  '));
  return lines.map(l=>l.split(/\s+/).map(tok=>{
    if(tok==='|')return '|';
    const m=/^(.+?)(?:\/(\d))?$/.exec(tok.replace(/:[whqes]\.?/g,'').replace(/_/g,''));return pretty(m[1].replace(/([0-9])([whqes])/g,'$1<small>$2</small>')).replace(/ \+ /g,'+')+(m[2]?`<sup>${m[2]}</sup>`:'');
  }).join(' ')).join('<br>');
}

export function pieceView(text,view,bpb,ex={}){
  const p=parseSong(text);let h='';
  if(view!=='names'&&p.notes.length)h+=`<div class="staffwrap">${scoreSVG(p,{bpb,ts:ex.ts,key:ex.key,staff:ex.one})}</div>`;
  if(view!=='staff')h+=`<div class="mono">${glance(text)}</div>`;
  return h;
}

export function segHtml(cur){return ['staff','both','names'].map(v=>`<button data-v="${v}" class="${v===cur?'active':''}">${v==='staff'?'Staff':v==='both'?'Both':'Names'}</button>`).join('');}
