// Piece texts in the app's note format (original rock/metal-style pieces plus public-domain classical).
import { CH, addLH, chordLine, mergeHands, parseSong, rep } from './notation.js';

export const T={
  rh5:'C4/1 D4/2 E4/3 F4/4 | G4/5 F4/4 E4/3 D4/2 | C4w/1',
  lh5:'C3/5 D3/4 E3/3 F3/2 | G3/1 F3/2 E3/3 D3/4 | C3w/5',
  ode1:'E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | E4/3 D4/2 D4h/2 | E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | D4/2 C4/1 C4h/1',
  ode2:'E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | E4q./3 D4e/2 D4h/2 | E4/3 E4/3 F4/4 G4/5 | G4/5 F4/4 E4/3 D4/2 | C4/1 C4/1 D4/2 E4/3 | D4q./2 C4e/1 C4h/1',
  odeHT:'E4+C3:w/3 E4/3 F4/4 G4/5 | G4+G3:w/5 F4/4 E4/3 D4/2 | C4+C3:w/1 C4/1 D4/2 E4/3 | E4+G3:w/3 D4/2 D4h/2 | E4+C3:w/3 E4/3 F4/4 G4/5 | G4+G3:w/5 F4/4 E4/3 D4/2 | C4+C3:w/1 C4/1 D4/2 E4/3 | D4+G3:w/2 C4/1 C4h/1',
  rhythm:'C4/3 C4/3 C4h/3 | C4w/3 | C4h/3 C4h/3 | C4/3 C4/3 C4/3 C4/3 | C4w/3',
  skips:'C4/1 E4/3 D4/2 F4/4 | E4/3 G4/5 F4/4 D4/2 | C4w/1',
  waltz:'C4/1 D4/2 E4/3 | E4h/3 Rq | D4/2 E4/3 D4/2 | C4h/1 Rq | E4/3 F4/4 G4/5 | G4h/5 Rq | F4/4 E4/3 D4/2 | C4h./1',
  gRH:'G4/1 A4/2 B4/3 C5/4 | D5/5 C5/4 B4/3 A4/2 | G4w/1',
  gLH:'G2/5 A2/4 B2/3 C3/2 | D3/1 C3/2 B2/3 A2/4 | G2w/5',
  pulseR:rep('C4/3 C4/3 C4/3 C4/3 |',4), pulseL:rep('C3/3 C3/3 C3/3 C3/3 |',4)
};

// original rock/metal-style pieces (replace the folk/hymn tunes); classical pieces stay
Object.assign(T,{
  thunder:'C4/1 C4/1 E4/3 C4/1 | G4h/5 F4/4 E4/3 | D4/2 D4/2 F4/4 D4/2 | G4h/5 E4/3 D4/2 | E4/3 E4/3 G4/5 E4/3 | F4h/4 E4/3 D4/2 | C4/1 E4/3 G4/5 E4/3 | C4w/1',
  thunderLH:'C3/5 C3/5 E3/3 C3/5 | G3h/1 F3/2 E3/3 | D3/4 D3/4 F3/2 D3/4 | G3h/1 E3/3 D3/4 | E3/3 E3/3 G3/1 E3/3 | F3h/2 E3/3 D3/4 | C3/5 E3/3 G3/1 E3/3 | C3w/5',
  stormRH:'E4/3 E4/3 E4/3 G4/5 | F4h/4 D4h/2 | E4/3 E4/3 E4/3 G4/5 | F4h/4 D4h/2 | C4/1 D4/2 E4/3 F4/4 | G4h/5 G4h/5 | F4/4 E4/3 D4/2 C4/1 | C4w/1',
  stormHT:'E4+C3:w/3 E4/3 E4/3 G4/5 | F4+G3:wh/4 D4h/2 | E4+C3:w/3 E4/3 E4/3 G4/5 | F4+G3:wh/4 D4h/2 | C4+F3:w/1 D4/2 E4/3 F4/4 | G4+C3:wh/5 G4h/5 | F4+G3:w/4 E4/3 D4/2 C4/1 | C4+C3w/1'
});

export const SONGS=[
  {id:'rh5',name:'5-finger warm-up · RH (C position)',bpm:60,text:T.rh5},
  {id:'lh5',name:'5-finger warm-up · LH (C position)',bpm:60,text:T.lh5},
  {id:'ode1',name:'Ode to Joy · RH (simple rhythm)',bpm:80,text:T.ode1},
  {id:'ode2',name:'Ode to Joy · RH (real dotted rhythm)',bpm:80,text:T.ode2},
  {id:'odeHT',name:'Ode to Joy · hands together',bpm:60,text:T.odeHT},
  {id:'thunder',name:'Thunder Steps · RH',bpm:90,text:T.thunder},
  {id:'thunderLH',name:'Thunder Steps · LH',bpm:70,text:T.thunderLH},
  {id:'stormRH',name:'Storm Warning · RH',bpm:72,text:T.stormRH},
  {id:'stormHT',name:'Storm Warning · hands together',bpm:72,text:T.stormHT},
  {id:'gRH',name:'G position warm-up · RH',bpm:60,text:T.gRH},
  {id:'gLH',name:'G position warm-up · LH',bpm:60,text:T.gLH},
  {id:'custom',name:'Custom (paste from your teacher)',bpm:80,text:''}
];

Object.assign(T,{
  eighths:'C4/1 D4/2 E4/3 F4/4 | G4e/5 F4e/4 E4e/3 D4e/2 C4h/1 | C4e/1 D4e/2 E4e/3 F4e/4 G4/5 G4/5 | G4e/5 F4e/4 E4e/3 D4e/2 C4h/1',
  legato:'C4/1 D4/2 E4/3 F4/4 | G4h/5 E4h/3 | F4/4 E4/3 D4/2 E4/3 | C4w/1',
  stacc:'C4/1 E4/3 G4/5 E4/3 | C4/1 E4/3 G4h/5 | G4/5 E4/3 C4/1 E4/3 | G4/5 E4/3 C4h/1',
  dRH:'D4/1 E4/2 F#4/3 G4/4 | A4/5 G4/4 F#4/3 E4/2 | D4w/1',
  dLH:'D3/5 E3/4 F#3/3 G3/2 | A3/1 G3/2 F#3/3 E3/4 | D3w/5',
  pickup:'Rq C4/1 E4/3 G4/5 | G4w/5 | Rq C4/1 E4/3 G4/5 | G4w/5',
  fireRH:'Rq C4/1 E4/3 G4/5 | G4h./5 E4/3 | F4e/4 E4e/3 D4/2 C4/1 D4/2 | E4h./3 C4e/1 E4e/3 | G4q./5 F4e/4 E4/3 D4/2 | E4h/3 C4h/1 | Rq C4/1 E4/3 G4/5 | G4h./5 E4/3 | F4e/4 E4e/3 D4/2 C4/1 D4/2 | E4h./3 G4e/5 F4e/4 | E4q./3 D4e/2 C4/1 D4/2 | C4w/1',
  fireHT:'Rq C4+C3:h./1 E4/3 G4/5 | G4+C3:wh./5 E4/3 | F4+F3:we/4 E4e/3 D4/2 C4/1 D4/2 | E4+C3:wh./3 C4e/1 E4e/3 | G4+G3:wq./5 F4e/4 E4/3 D4/2 | E4+C3:wh/3 C4h/1 | Rq C4+C3:h./1 E4/3 G4/5 | G4+C3:wh./5 E4/3 | F4+F3:we/4 E4e/3 D4/2 C4/1 D4/2 | E4+C3:wh./3 G4e/5 F4e/4 | E4+G3:wq./3 D4e/2 C4/1 D4/2 | C4+C3w/1'
});

Object.assign(T,{
  cRH:'C4/1 D4/2 E4/3 F4/1 | G4/2 A4/3 B4/4 C5/5 | B4/4 A4/3 G4/2 F4/1 | E4/3 D4/2 C4h/1',
  cLH:'C3/5 D3/4 E3/3 F3/2 | G3/1 A3/3 B3/2 C4/1 | B3/2 A3/3 G3/1 F3/2 | E3/3 D3/4 C3h/5',
  gRHs:'G4/1 A4/2 B4/3 C5/1 | D5/2 E5/3 F#5/4 G5/5 | F#5/4 E5/3 D5/2 C5/1 | B4/3 A4/2 G4h/1',
  gLHs:'G2/5 A2/4 B2/3 C3/2 | D3/1 E3/3 F#3/2 G3/1 | F#3/2 E3/3 D3/1 C3/2 | B2/3 A2/4 G2h/5',
  fRHs:'F4/1 G4/2 A4/3 Bb4/4 | C5/1 D5/2 E5/3 F5/4 | E5/3 D5/2 C5/1 Bb4/4 | A4/3 G4/2 F4h/1',
  fLHs:'F2/5 G2/4 A2/3 Bb2/2 | C3/1 D3/3 E3/2 F3/1 | E3/2 D3/3 C3/1 Bb2/2 | A2/3 G2/4 F2h/5',
  triads:'C4+E4+G4h/1 D4+F4+A4h/1 | E4+G4+B4h/1 F4+A4+C5h/1 | G4+B4+D5h/1 A4+C5+E5h/1 | G4+B4+D5h/1 F4+A4+C5h/1 | E4+G4+B4h/1 D4+F4+A4h/1 | C4+E4+G4w/1',
  ivv:'C3+E3+G3w/5 | F2+A2+C3w/5 | C3+E3+G3w/5 | G2+B2+D3w/5 | C3+E3+G3w/5',
});

export const scaleHT=(rh,lh)=>{const R=parseSong(rh).notes,Lh=parseSong(lh).notes;return rh.split('|').map((bar,bi)=>{const n=parseSong(bar).notes.length;const off=rh.split('|').slice(0,bi).reduce((a,b)=>a+parseSong(b).notes.length,0);
  return parseSong(bar).notes.map((x,k)=>{const r=R[off+k],l=Lh[off+k];return r.name+'+'+l.name+(r.dur===2?'h':'')+'/'+r.finger;}).join(' ');}).join(' | ');};

T.cHT=scaleHT(T.cRH,T.cLH);

T.gHT=scaleHT(T.gRHs,T.gLHs);

T.fHT=scaleHT(T.fRHs,T.fLHs);

T.odeCh=addLH(T.ode1,[CH.C,CH.G,CH.C,CH.G,CH.C,CH.G,CH.C,CH.C]);

// chords per bar (pickup bar first): I = C, IV = F, V = G
Object.assign(T,{ // Ember Waltz: original rock waltz in A minor, 3/4, power chords (root + fifth) in the LH
  ember:'Rh A4/1 | C5h/3 D5/4 | E5h./5 | D5h/4 C5/3 | A4h./1 | C5h/3 D5/4 | E5h/5 D5/4 | C5h/3 B4/2 | A4h./1 | E5/5 E5e/5 D5e/4 C5/3 | D5e/4 C5e/3 B4e/2 A4e/1 B4/2 | D5h/4 E5/5 | B4h./2 | C5h/3 D5/4 | E5h/5 D5/4 | C5h/3 B4/2 | A4h./1',
  emberHT:'Rh A4:qq/1 | C5:h+_A2:h.+_E3:h.h/3 D5:qq/4 | E5:h.+_A2:h.+_E3:h.h./5 | D5:h+_F2:h.+_C3:h.h/4 C5:qq/3 | A4:h.+_A2:h.+_E3:h.h./1 | C5:h+_A2:h.+_E3:h.h/3 D5:qq/4 | E5:h+_A2:h.+_E3:h.h/5 D5:qq/4 | C5:h+_E2:h.+_B2:h.h/3 B4:qq/2 | A4:h.+_A2:h.+_E3:h.h./1 | E5:q+_F2:h.+_C3:h.q/5 E5:ee/5 D5:ee/4 C5:qq/3 | D5:e+_F2:h.+_C3:h.e/4 C5:ee/3 B4:ee/2 A4:ee/1 B4:qq/2 | D5:h+_G2:h.+_D3:h.h/4 E5:qq/5 | B4:h.+_E2:h.+_B2:h.h./2 | C5:h+_A2:h.+_E3:h.h/3 D5:qq/4 | E5:h+_F2:h.+_C3:h.h/5 D5:qq/4 | C5:h+_E2:h.+_B2:h.h/3 B4:qq/2 | A4:h.+_A2:h.+_E3:h.h./1'
});

Object.assign(T,{
  voiceRH:'C5+E5+G5h/1 C5+F5+A5h/1 | C5+E5+G5h/1 B4+D5+G5h/1 | C5+E5+G5w/1',
  voiceLH:'C3+E3+G3h/5 C3+F3+A3h/5 | C3+E3+G3h/5 B2+D3+G3h/5 | C3+E3+G3w/5',
  invRH:chordLine(['C4+E4+G4','E4+G4+C5','G4+C5+E5','F4+A4+C5','A4+C5+F5','C5+F5+A5','G4+B4+D5','B4+D5+G5','D5+G5+B5','A4+C5+E5','C5+E5+A5','E5+A5+C6']),
  invLH:chordLine(['C2+E2+G2','E2+G2+C3','G2+C3+E3','F2+A2+C3','A2+C3+F3','C3+F3+A3','G2+B2+D3','B2+D3+G3','D3+G3+B3','A2+C3+E3','C3+E3+A3','E2+A2+C3'],'h',5),
  alberti:'C3e/5 G3e/1 E3e/3 G3e/1 C3e/5 G3e/1 E3e/3 G3e/1 | C3e/5 A3e/1 F3e/3 A3e/1 C3e/5 A3e/1 F3e/3 A3e/1 | B2e/5 G3e/1 D3e/3 G3e/1 B2e/5 G3e/1 D3e/3 G3e/1 | C3e/5 G3e/1 E3e/3 G3e/1 C3h/5',
  brokenRH:'C4e/1 E4e/3 G4e/5 E4e/3 C4e/1 E4e/3 G4/5 | C4e/1 F4e/3 A4e/5 F4e/3 C4e/1 F4e/3 A4/5 | B3e/1 D4e/2 G4e/5 D4e/2 B3e/1 D4e/2 G4/5 | C4e/1 E4e/3 G4e/5 E4e/3 C4h/1',
  amN:'A4/1 B4/2 C5/3 D5/1 | E5/2 F5/3 G5/4 A5/5 | G5/4 F5/3 E5/2 D5/1 | C5/3 B4/2 A4h/1',
  amH:'A4/1 B4/2 C5/3 D5/1 | E5/2 F5/3 G#5/4 A5/5 | G#5/4 F5/3 E5/2 D5/1 | C5/3 B4/2 A4h/1',
  dmH:'D4/1 E4/2 F4/3 G4/1 | A4/2 Bb4/3 C#5/4 D5/5 | C#5/4 Bb4/3 A4/2 G4/1 | F4/3 E4/2 D4h/1',
  emH:'E4/1 F#4/2 G4/3 A4/1 | B4/2 C5/3 D#5/4 E5/5 | D#5/4 C5/3 B4/2 A4/1 | G4/3 F#4/2 E4h/1',
  six8:'C4/1 D4e/2 E4/3 F4e/4 | G4q./5 E4q./3 | F4/4 E4e/3 D4/2 E4e/3 | C4h./1',
  phrase:'C4/1 D4/2 E4/3 F4/4 | G4/5 A4/5 G4/5 F4/4 | E4/3 F4/4 E4/3 D4/2 | C4w/1',
  green:'Rh Re A4e/1 | C5q./3 E5q./5 | D5q./4 C5e./3 B4s/2 A4e/1 | C5q./3 B4q./2 | A4h./1 | C5q./3 E5q./5 | D5q./4 E5e./5 D5s/4 C5e/3 | B4q./2 A4q./1 | A4h./1 | E5q./5 D5e/4 C5e/3 B4e/2 | C5q./3 A4q./1 | B4q./2 A4q./1 | A4h./1',
  greenLH:'Rh. | A2q. E3q. | G2q. D3q. | A2q. E3q. | A2q. E3q. | A2q. E3q. | G2q. D3q. | E2q. B2q. | A2q. E3q. | A2q. E3q. | F2q. C3q. | E2q. B2q. | A2q. E3q.'
});

T.greenHT=mergeHands(T.green,T.greenLH,3);

Object.assign(T,{
  minA_R:"D5q G4e A4e B4e C5e | D5q G4q G4q | E5q C5e D5e E5e F#5e | G5q G4q G4q | C5q D5e C5e B4e A4e | B4q C5e B4e A4e G4e | F#4q G4e A4e B4e G4e | A4h. | D5q G4e A4e B4e C5e | D5q G4q G4q | E5q C5e D5e E5e F#5e | G5q G4q G4q | C5q D5e C5e B4e A4e | B4q C5e B4e A4e G4e | A4q B4e A4e G4e F#4e | G4h.",minA_L:"G3+B3+D4h A3q | B3h. | C4h. | B3h. | A3h. | G3h. | D4q B3q G3q | D4q D3e C4e B3e A3e | B3h A3q | G3q B3q G3q | C4h. | B3q C4e B3e A3e G3e | A3h F#3q | G3h B3q | C4q D4q D3q | G3h G2q",minB_R:"B5q G5e A5e B5e G5e | A5q D5e E5e F#5e D5e | G5q E5e F#5e G5e D5e | C#5q B4e C#5e A4q | A4e B4e C#5e D5e E5e F#5e | G5q F#5q E5q | F#5q A4q C#5q | D5h. | D5q G4e F#4e G4q | E5q G4e F#4e G4q | D5q C5q B4q | A4e G4e F#4e G4e A4q | D4e E4e F#4e G4e A4e B4e | C5q B4q A4q | B4e D5e G4q F#4q | G4h.",minB_L:"G3h. | F#3h. | E3q G3q E3q | A3h A2q | A3h. | B3q D4q C#4q | D4q F#3q A3q | D4q D3q C4q | B3h B3q | C4h C4q | B3q A3q G3q | D3h Rq | D3h. | E3q G3q F#3q | G3q B2q D3q | G3q D3q G2q",
  melR:"E5q D5q C5q B4q A4e C5e B4e D5e C5q G4q G5q F5q E5q C5q B4q F#4+A4q G4q Rq E5q D5q C5q B4q A4e C5e B4e D5e C5q G4q G5q F5q E5q C5q B4q F#4+A4q G4q Rq D5q C5q B4q Rq F5q E5q D5q Rq A5q G5q F5q E5q D5e F5e E5e G5e F5:q.+A4e C5e B4e D5e C5+E5q D5q C5q B4q A4e C5e B4e D5e C5q G4q A5q G5q B4+F5q C5+E5q D5e F5e B4e D5e C5q Rq D5q C5q B4q Rq F5q E5q D5q Rq A5q G5q F5q E5q D5e F5e E5e G5e F5:q.+A4e C5e B4e D5e C5+E5q D5q C5q B4q A4e C5e B4e D5e C5q G4q A5q G5q B4+F5q C5+E5q D5e F5e B4e D5e C5q Rq",melL:"C4e G4e F4e G4e E4e G4e C4e E4e F4e D4e G4e F4e E4e F4e E4e D4e E4e G4e D4e G4e C4e G4e E4e G4e D4e G4e C4e D4e B3e D4e G3q C4e G4e F4e G4e E4e G4e C4e E4e F4e D4e G4e F4e E4e F4e E4e D4e E4e G4e D4e G4e C4e G4e E4e G4e D4e G4e C4e D4e B3e D4e G3q F4e G4e E4e G4e D4e G4e F#4e G4e D4e G4e C4e G4e B3e G4e F#4e G4e F4e G4e E4e G4e D4e G4e C4e G4e B3e G4e C4e C#4e D4q G4q C4e G4e F4e G4e E4e G4e C4e E4e F4e D4e G4e F4e E4e F4e E4e C4e F4e C5e E4e C5e D4e G4e C4e G4e F4e A4e G4e F4e E4e G4e C4e E4e F4e G4e E4e G4e D4e G4e F#4e G4e D4e G4e C4e G4e B3e G4e F#4e G4e F4e G4e E4e G4e D4e G4e C4e G4e B3e G4e C4e C#4e D4q G4q C4e G4e F4e G4e E4e G4e C4e E4e F4e D4e G4e F4e E4e F4e E4e C4e F4e C5e E4e C5e D4e G4e C4e G4e F4e A4e G4e F4e E4e G4e C4q"
});

export const scale2=(list,fu)=>{const up=list.split(' '),fd=fu.slice().reverse(),dn=up.slice(0,-1).reverse(),f=[...fu,...fd.slice(1)];
  const all=[...up,...dn];return all.map((n,i)=>n+(i===all.length-1?'w':'')+'/'+f[i]+((i%4===3&&i<all.length-1)?' |':'')).join(' ');};

export const F_R=[1,2,3,1,2,3,4,1,2,3,1,2,3,4,5],F_L=[5,4,3,2,1,3,2,1,4,3,2,1,3,2,1],F_FR=[1,2,3,4,1,2,3,1,2,3,4,1,2,3,4];

Object.assign(T,{
  c2R:scale2('C4 D4 E4 F4 G4 A4 B4 C5 D5 E5 F5 G5 A5 B5 C6',F_R),c2L:scale2('C2 D2 E2 F2 G2 A2 B2 C3 D3 E3 F3 G3 A3 B3 C4',F_L),
  g2R:scale2('G3 A3 B3 C4 D4 E4 F#4 G4 A4 B4 C5 D5 E5 F#5 G5',F_R),g2L:scale2('G2 A2 B2 C3 D3 E3 F#3 G3 A3 B3 C4 D4 E4 F#4 G4',F_L),
  d2R:scale2('D4 E4 F#4 G4 A4 B4 C#5 D5 E5 F#5 G5 A5 B5 C#6 D6',F_R),d2L:scale2('D2 E2 F#2 G2 A2 B2 C#3 D3 E3 F#3 G3 A3 B3 C#4 D4',F_L),
  f2R:scale2('F4 G4 A4 Bb4 C5 D5 E5 F5 G5 A5 Bb5 C6 D6 E6 F6',F_FR),f2L:scale2('F2 G2 A2 Bb2 C3 D3 E3 F3 G3 A3 Bb3 C4 D4 E4 F4',F_L),
  a2R:scale2('A3 B3 C4 D4 E4 F4 G#4 A4 B4 C5 D5 E5 F5 G#5 A5',F_R),a2L:scale2('A2 B2 C3 D3 E3 F3 G#3 A3 B3 C4 D4 E4 F4 G#4 A4',F_L),
  arpR:'C4/1 E4/2 G4/3 C5/5 | G4/3 E4/2 C4h/1 | G4/1 B4/2 D5/3 G5/5 | D5/3 B4/2 G4h/1 | F4/1 A4/2 C5/3 F5/5 | C5/3 A4/2 F4h/1 | A4/1 C5/2 E5/3 A5/5 | E5/3 C5/2 A4h/1',
  arpL:'C3/5 E3/4 G3/2 C4/1 | G3/2 E3/4 C3h/5 | G2/5 B2/4 D3/2 G3/1 | D3/2 B2/4 G2h/5 | F2/5 A2/4 C3/2 F3/1 | C3/2 A2/4 F2h/5 | A2/5 C3/4 E3/2 A3/1 | E3/2 C3/4 A2h/5'
});

T.minA=mergeHands(T.minA_R,T.minA_L,3);

T.minB=mergeHands(T.minB_R,T.minB_L,3);

T.minuet=mergeHands(T.minA_R+' | '+T.minB_R,T.minA_L+' | '+T.minB_L,3);

T.melHT=mergeHands(T.melR,T.melL,4);

T.melR=mergeHands(T.melR,'',4);

T.melL=mergeHands('',T.melL,4);

Object.assign(T,{
  // --- World 3b: shifting and crossing ---
  shiftA:'C4/1 D4/2 E4/3 F4/4 | G4/5 A4/1 B4/2 C5/3 | D5/4 E5h./5 | E5/5 D5/4 C5/3 B4/2 | A4/1 G4/5 F4/4 E4/3 | D4/2 C4h./1',
  under:'E4/3 F4/1 G4/2 A4/3 | A4/3 G4/2 F4/1 E4/3 | E4/3 F4/1 G4/2 A4/3 | A4/3 G4/2 F4/1 E4/3',
  over:'G4/2 F4/1 E4/3 D4/2 | C4/1 D4/2 E4/3 F4/1 | G4/2 F4/1 E4/3 D4/2 | C4w/1',
  lhCross:'C3/5 D3/4 E3/3 F3/2 | G3/1 A3/3 B3/2 C4/1 | B3/2 A3/3 G3/1 F3/2 | E3/3 D3/4 C3h/5',
  subst:'C4h./3 D4/2 | E4h./3 F4/2 | G4h./3 A4/2 | G4w/1',
  leapLH:'C3/5 C2/5 C3/5 C2/5 | C3/5 C2/5 C3/5 C2/5 | C3w/5',
  leapRH:'C4/1 C5/5 C4/1 C5/5 | C4/1 C5/5 C4/1 C5/5 | C4w/1',
  leap6:'C3/5 A3/1 C3/5 A3/1 | G2/5 E3/1 G2/5 E3/1 | C3w/5',
  burner:'C4/1 E4/3 G4/5 G4/5 | A4/5 A4/5 G4h/5 | E4/3 G4/5 E4/3 C4/1 | D4/2 D4/2 C4h/1 | F4/4 A4/5 A4/5 G4/5 | F4/4 E4/3 D4h/2 | C4/1 E4/3 G4/5 G4/5 | A4/5 A4/5 G4h/5 | F4/4 F4/4 E4/3 E4/3 | D4/2 D4/2 C4h/1',
  burnerHT:'C4+C3:w/1 E4/3 G4/5 G4/5 | A4+F3:w/5 A4/5 G4h/5 | E4+C3:w/3 G4/5 E4/3 C4/1 | D4+G3:h/2 D4/2 C4+C3h/1',
  // --- World 2: hand independence (LH steady quarters, RH varies) ---
  indepR:'E4h/3 E4/3 F4/4 | G4h/5 G4/5 F4/4 | E4/3 F4/4 G4/5 E4/3 | C4w/1',
  // --- World 3: sixteenths, syncopation ---
  sixteen:'C4s/1 D4s/2 E4s/3 F4s/4 G4/5 F4/4 E4/3 | D4e/2 C4s/1 D4s/2 E4/3 D4/2 C4/1 | E4e./3 F4s/4 G4/5 F4/4 E4/3 | D4s/2 E4s/3 F4s/4 E4s/3 D4/2 C4h/1',
  synco:'C4/1 E4e/3 G4/5 E4e/3 C4/1 | D4/2 F4e/4 G4/5 F4e/4 D4/2 | E4/3 G4e/5 E4/3 C4e/1 D4/2 | C4w/1',
  // --- World 4: dominant 7th, progressions ---
  v7LH:'G2+B2+D3+F3w/5 | C3+E3+G3w/5 | G2+B2+D3+F3w/5 | C3+E3+G3w/5',
  v7RH:'B4+D5+F5+G5w/1 | C5+E5+G5w/1 | B4+D5+F5+G5w/1 | C5+E5+G5w/1',
  progC:'C3+E3+G3w/5 | G2+B2+D3w/5 | A2+C3+E3w/5 | F2+A2+C3w/5 | C3+E3+G3w/5 | G2+B2+D3w/5 | A2+C3+E3w/5 | F2+A2+C3w/5',
  progG:'G2+B2+D3w/5 | D3+F#3+A3w/5 | E2+G2+B2w/5 | C3+E3+G3w/5 | G2+B2+D3w/5 | D3+F#3+A3w/5 | E2+G2+B2w/5 | C3+E3+G3w/5',
  progF:'F2+A2+C3w/5 | C3+E3+G3w/5 | D3+F3+A3w/5 | Bb2+D3+F3w/5 | F2+A2+C3w/5 | C3+E3+G3w/5 | D3+F3+A3w/5 | Bb2+D3+F3w/5',
  progRoot:'C3/5 G3/1 C3/5 G3/1 | G2/5 D3/1 G2/5 D3/1 | A2/5 E3/1 A2/5 E3/1 | F2/5 C3/1 F2/5 C3/1 | C3/5 G3/1 C3/5 G3/1 | G2/5 D3/1 G2/5 D3/1 | A2/5 E3/1 A2/5 E3/1 | F2/5 C3/1 F2/5 C3/1',
  // --- World 5: seventh chords, lead sheet ---
  iiVI:'D3+F3+A3+C4w/5 | G2+B2+D3+F3w/5 | C3+E3+G3+B3w/5 | C3+E3+G3+B3w/5',
  maryRoot:'C3/5 G3/1 C3/5 G3/1 | C3/5 G3/1 C3/5 G3/1 | G2/5 D3/1 G2/5 D3/1 | G2/5 D3/1 G2/5 D3/1 | C3/5 G3/1 C3/5 G3/1 | F2/5 C3/1 F2/5 C3/1 | C3/5 G3/1 C3/5 G3/1 | C3/5 G3/1 C3/5 G3/1'
});

T.indep=mergeHands(T.indepR,rep('C3/5',16),4);

T.maryLead=addLH(T.thunder,[CH.C,CH.C,CH.G,CH.G,CH.C,CH.F,CH.C,CH.C]);

T.maryRootHT=mergeHands(T.thunder,T.maryRoot,4);
