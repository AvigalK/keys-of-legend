// Lesson content: worlds, quests, bosses and steps (data).
import { N } from './notation.js';
import { T } from './tunes.js';

export const POSTURE=['Keys at about elbow height','Sitting on the front half of the seat, feet flat','Forearms roughly level, elbows loose — not pinned in, not winged out','Shoulders down, neck long'];

export const HAND=['Fingers curved, like holding a small ball','Playing on the fingertips — first joints not collapsing','Wrist level with the back of the hand','Thumb resting on its key, not hanging off'];

export const fingers=(names,f)=>{const o={};names.split(' ').forEach((n,i)=>o[n]=String(f[i]));return o;};

export const WORLDS=[
 {id:0,name:'Tutorial Island',sub:'seat, hands, keyboard map, steady beat',quests:[
  {id:'0.1',title:'Setup',xp:50,steps:[
   {t:'read',title:'Set up your seat',html:`<p>Put the keyboard on a stand or table so the keys are at about <b>elbow height</b>.</p><p>Sit on the <b>front half</b> of the chair, feet flat, facing the middle of the keyboard. Forearms roughly level with the keys, elbows hanging loosely just in front of your body.</p>`},
   {t:'check',title:'Posture check',items:POSTURE},
   {t:'read',title:'Keyboard settings',html:`<p>Turn <b>Touch Response ON</b> — keys get louder when you press faster.</p><p>Keep the keyboard's own metronome <b>off</b> in this app; the app has its own click.</p><p>Phone on the music rest near the speakers, phone volume up.</p>`},
   {t:'notes',title:'Mic test',html:`<p>Play any 3 keys, one at a time. Each one should tick ✓.</p>`,seq:['*','*','*']}
  ]},
  {id:'0.2',title:'Hand shape & finger numbers',xp:50,steps:[
   {t:'read',title:'Your piano hand',html:`<p>Let your arms hang by your sides and relax. See the gentle curve of your fingers? That's your piano hand.</p><p>Bring it to the keys <b>without changing the shape</b>. Play on the fingertips; the thumb plays on its side tip. Wrist level — not drooping, not raised.</p>`},
   {t:'check',title:'Hand check',items:HAND},
   {t:'read',title:'Finger numbers',html:`<p>Both hands: <b>thumb 1</b>, index 2, middle 3, ring 4, <b>pinky 5</b>. Sheet music and your teacher talk in these numbers.</p>`,kb:{from:'C4',to:'G4',marks:fingers('C4 D4 E4 F4 G4',[1,2,3,4,5])}},
   {t:'quiz',title:'Finger quiz',kind:'mc',pass:4,items:[
     {q:'Which finger is 3?',opts:['Index','Middle','Ring','Thumb'],a:'Middle'},
     {q:'Which finger is 5?',opts:['Thumb','Ring','Pinky','Index'],a:'Pinky'},
     {q:'Left hand finger 1 is…',opts:['Thumb','Pinky','Index','Middle'],a:'Thumb'},
     {q:'Which finger is 4?',opts:['Middle','Ring','Pinky','Index'],a:'Ring'}]},
   {t:'notes',title:'Five fingers',html:`<p>Right hand: thumb on the yellow key, then one finger per key — 1 2 3 4 5. Slowly, one at a time, keep the hand shape.</p>`,seq:['C4','D4','E4','F4','G4'],fingers:[1,2,3,4,5],hint:true,kbRange:[N('C3'),N('B4')],maxMistakes:2}
  ]},
  {id:'0.3',title:'Black-key map',xp:50,steps:[
   {t:'read',title:'Groups of 2 and 3',html:`<p>Black keys come in groups of <b>2</b> and <b>3</b>. They're your map.</p><p><b>C</b> is the white key just <b>left of a group of 2</b>. <b>F</b> is just <b>left of a group of 3</b>.</p>`,kb:{from:'C3',to:'B4',marks:{C3:'C',F3:'F',C4:'C',F4:'F'}}},
   {t:'read',title:'Middle C',html:`<p>Your keyboard has <b>6 Cs</b>, numbered C2 (lowest) to C7 (highest).</p><p><b>Middle C = C4</b>, the 3rd C from the left — home base for both hands.</p>`,kb:{from:'C2',to:'C7',marks:{C2:'2',C3:'3',C4:'4',C5:'5',C6:'6',C7:'7'}}},
   {t:'notes',title:'Find every C',html:`<p>Play every C, from lowest to highest. Exact octave counts.</p>`,seq:['C2','C3','C4','C5','C6','C7'],strict:true,hint:'miss',maxMistakes:2},
   {t:'notes',title:'Middle C',html:`<p>Find middle C.</p>`,seq:['C4'],strict:true,hint:'miss',maxMistakes:0},
   {t:'notes',title:'Find the Fs',html:`<p>F sits left of each group of 3. Play every F, lowest to highest.</p>`,seq:['F2','F3','F4','F5','F6'],strict:true,hint:'miss',maxMistakes:2}
  ]},
  {id:'0.4',title:'The musical alphabet',xp:50,steps:[
   {t:'read',title:'A to G, then repeat',html:`<p>White keys are named <b>A B C D E F G</b>, then the letters repeat.</p><p>From C going right: C D E F G A B, then the next C. In Do-Re-Mi: Do Re Mi Fa Sol La Si.</p><p>The number is the octave: from C4 up to the next B is all "4".</p>`,kb:{from:'C4',to:'C5',marks:{C4:'C',D4:'D',E4:'E',F4:'F',G4:'G',A4:'A',B4:'B',C5:'C'}}},
   {t:'quiz',title:'Name the key',kind:'keyname',from:'C3',to:'B4',n:8,pass:7},
   {t:'random',title:'Key finder',html:`<p>Play each key shown. Exact octave counts. Use C and F as anchors.</p>`,from:'C3',to:'C5',n:10,pass:8,strict:true,show:'name'}
  ]},
  {id:'0.5',title:'Steady pulse',xp:50,steps:[
   {t:'read',title:'Feel the beat',html:`<p>Music sits on a steady beat. Count <b>1-2-3-4</b> out loud with the click.</p><p>Play middle C on every beat with <b>finger 3</b>: let arm weight drop into the key, then release. Relaxed, not pushed.</p>`},
   {t:'song',title:'Right-hand pulse',text:T.pulseR,bpm:60,need:1,strict:true},
   {t:'song',title:'Left-hand pulse',html:`<p>Now left hand, finger 3, on <b>C3</b> (the C below middle C).</p>`,text:T.pulseL,bpm:60,need:1,strict:true}
  ]}],
  boss:{id:'B0',title:'The Gatekeeper',xp:200,boss:true,steps:[
   {t:'read',title:'👹 The Gatekeeper',html:`<p>It guards the island with three trials: your posture, your map of the keys, and your pulse. No hints.</p>`},
   {t:'check',title:'Trial 1 · Form',items:[...POSTURE,...HAND],achOnDone:'perfect'},
   {t:'random',title:'Trial 2 · 20 keys',html:`<p>20 keys anywhere on the keyboard. 19 right first try, average under 3 seconds.</p>`,from:'C2',to:'C7',n:20,pass:19,maxAvg:3,strict:true,show:'name'},
   {t:'song',title:'Trial 3 · RH pulse',text:T.pulseR,bpm:60,need:1,strict:true},
   {t:'song',title:'Trial 3 · LH pulse',text:T.pulseL,bpm:60,need:1,strict:true}
  ]}},
 {id:1,name:'Middle C Meadows',sub:'C position, note values, first songs',quests:[
  {id:'1.1',title:'C position · right hand',xp:50,steps:[
   {t:'read',title:'Five-finger C position',html:`<p>Right thumb on <b>middle C</b>, then one finger per white key: C D E F G = fingers 1 2 3 4 5.</p><p>Fingers stay resting on their keys even when they're not playing.</p>`,kb:{from:'C4',to:'G4',marks:fingers('C4 D4 E4 F4 G4',[1,2,3,4,5])}},
   {t:'song',title:'RH warm-up',text:T.rh5,bpm:60,need:3}
  ]},
  {id:'1.2',title:'C position · left hand',xp:50,steps:[
   {t:'read',title:'Left hand',html:`<p>Left pinky (5) on <b>C3</b>, the C below middle C. Thumb (1) lands on G3.</p><p>C D E F G = fingers <b>5 4 3 2 1</b>.</p>`,kb:{from:'C3',to:'G3',marks:fingers('C3 D3 E3 F3 G3',[5,4,3,2,1])}},
   {t:'song',title:'LH warm-up',text:T.lh5,bpm:60,need:3}
  ]},
  {id:'1.3',title:'Note values',xp:50,steps:[
   {t:'read',title:'How long is a note?',html:`<p>Note lengths are counted in beats. In 4/4 time a bar has 4 beats.</p><p><b>Quarter</b> = 1 beat (filled head + stem). <b>Half</b> = 2 beats (hollow head + stem). <b>Whole</b> = 4 beats (hollow, no stem).</p><p>Hold the key for the full count.</p>`},
   {t:'quiz',title:'Count it',kind:'mc',pass:4,items:[
     {q:'A half note lasts…',opts:['1 beat','2 beats','3 beats','4 beats'],a:'2 beats'},
     {q:'A whole note lasts…',opts:['1 beat','2 beats','3 beats','4 beats'],a:'4 beats'},
     {q:'A quarter note lasts…',opts:['1 beat','2 beats','½ beat','4 beats'],a:'1 beat'},
     {q:'Two half notes fill…',opts:['2 beats','3 beats','4 beats','8 beats'],a:'4 beats'}]},
   {t:'song',title:'Rhythm on C',html:`<p>Count out loud. <small>h</small> = half, <small>w</small> = whole; plain = quarter. Hold each note its full length.</p>`,text:T.rhythm,bpm:70,need:2,strict:true}
  ]},
  {id:'1.4',title:'Treble staff C–G',xp:50,steps:[
   {t:'read',title:'The treble staff',html:`<p>Music is written on a <b>staff</b> of 5 lines. The treble staff (top) is for the right hand.</p><p>Middle C sits on its own short <b>ledger line</b> below it. Each step up the keyboard moves one position: line → space → line.</p>`,staff:['C4','D4','E4','F4','G4'],labels:true},
   {t:'quiz',title:'Read the note',kind:'staffname',from:'C4',to:'G4',n:10,pass:9},
   {t:'random',title:'Read & play',html:`<p>Read the note, play it. No names this time.</p>`,from:'C4',to:'G4',n:10,pass:8,show:'staff'}
  ]},
  {id:'1.5',title:'Song: Ode to Joy',xp:50,steps:[
   {t:'read',title:'Ode to Joy',html:`<p>Beethoven's melody, all in RH C position. It moves mostly by step — watch the finger numbers.</p>`},
   {t:'song',title:'Learn it slowly',text:T.ode1,bpm:60,need:1},
   {t:'song',title:'Target tempo',text:T.ode1,bpm:80,need:3}
  ]},
  {id:'1.6',title:'Bass staff C–G',xp:50,steps:[
   {t:'read',title:'The bass staff',html:`<p>The bass staff (bottom) is for the left hand. Middle C sits on a ledger line just <b>above</b> it.</p><p>Your LH C position: C3 is the <b>2nd space from the bottom</b>, then D3 line, E3 space, F3 line, G3 space.</p>`,staff:['C3','D3','E3','F3','G3'],labels:true},
   {t:'quiz',title:'Read the note',kind:'staffname',from:'C3',to:'G3',n:10,pass:9},
   {t:'random',title:'Read & play',from:'C3',to:'G3',n:10,pass:8,show:'staff'},
   {t:'song',title:'Thunder Steps · left hand',text:T.thunderLH,bpm:70,need:1}
  ]},
  {id:'1.7',title:'Song: Thunder Steps',xp:50,steps:[
   {t:'read',title:'Thunder Steps',html:`<p>Your first rock riff — an original, built the way real riffs are: a short idea that repeats and climbs. Three notes hammer on the beat (<b>C C E C</b>), then a long note <b>holds</b> while the next idea answers.</p><p>Play it with weight, not force: drop into each key and let go. Keep the beat dead steady — that is what makes a riff hit.</p>`},
   {t:'song',title:'Learn it',text:T.thunder,bpm:70,need:1},
   {t:'song',title:'Target tempo',text:T.thunder,bpm:90,need:3}
  ]}],
  boss:{id:'B1',title:'The Meadow Guardian',xp:200,boss:true,steps:[
   {t:'read',title:'👹 The Meadow Guardian',html:`<p>It strikes at uneven beats and flat fingers. Three clean runs of Ode to Joy at 80, then read your way past it.</p>`},
   {t:'check',title:'Form',items:HAND},
   {t:'song',title:'Ode to Joy @ 80',text:T.ode1,bpm:80,need:3},
   {t:'random',title:'Read 10 notes',html:`<p>Treble and bass. 9 of 10 first try.</p>`,from:'C3',to:'G4',n:10,pass:9,show:'staff'}
  ]}},
 {id:2,name:'Grand Staff Grove',sub:'landmarks, intervals, 3/4, both hands, dynamics',quests:[
  {id:'2.1',title:'Landmark notes',xp:50,steps:[
   {t:'read',title:'Read by landmarks',html:`<p>Don't count lines from scratch — use landmarks:</p><p><b>Low C</b> (C3): 2nd space of the bass staff. <b>Bass F</b> (F3): 4th line, between the bass clef's dots. <b>Middle C</b>: between the staves. <b>Treble G</b> (G4): 2nd line, where the clef curls. <b>High C</b> (C5): 3rd space of the treble staff.</p><p>Read every other note as a step or skip from the nearest landmark.</p>`,staff:['C3','F3','C4','G4','C5'],labels:true},
   {t:'quiz',title:'Read the note',kind:'staffname',from:'C3',to:'C5',n:10,pass:8},
   {t:'random',title:'Read & play',from:'C3',to:'C5',n:10,pass:8,show:'staff'}
  ]},
  {id:'2.2',title:'Steps & skips',xp:50,steps:[
   {t:'read',title:'Intervals',html:`<p>An <b>interval</b> is the distance between two notes.</p><p>A <b>step (2nd)</b> goes line → space or space → line: neighbour keys. A <b>skip (3rd)</b> goes line → line or space → space: skip one key.</p>`,staff:['C4','D4','E4','G4']},
   {t:'quiz',title:'Step or skip?',kind:'interval',from:'C4',to:'G5',n:8,pass:7},
   {t:'song',title:'Skipping melody',text:T.skips,bpm:70,need:2}
  ]},
  {id:'2.3',title:'Rests & 3/4 time',xp:50,steps:[
   {t:'read',title:'Silence counts',html:`<p>A <b>rest</b> is silence — but you keep counting. Quarter rest = 1 beat, half rest = 2.</p><p><b>3/4 time</b> = 3 beats per bar: count 1-2-3, strong on 1 (a waltz).</p>`},
   {t:'quiz',title:'Count it',kind:'mc',pass:4,items:[
     {q:'In 3/4, beats per bar?',opts:['2','3','4','6'],a:'3'},
     {q:'A half rest lasts…',opts:['1 beat','2 beats','3 beats','4 beats'],a:'2 beats'},
     {q:'A rest means…',opts:['Stop counting','Silence, keep counting','Hold the last note','Play softer'],a:'Silence, keep counting'},
     {q:'In 4/4: quarter + half rest + quarter = ?',opts:['3 beats','4 beats','5 beats','2 beats'],a:'4 beats'}]},
   {t:'song',title:'Waltz with rests',html:`<p>3/4 time — count 1-2-3. <b>R</b> = rest.</p>`,text:T.waltz,bpm:80,bpb:3,need:2}
  ]},
  {id:'2.4',title:'Hands together',xp:50,steps:[
   {t:'read',title:'Both hands',html:`<p>The left hand holds one long note per bar while the right hand plays the melody. LH stays in C position: C3 = finger 5, G3 = finger 1.</p><p>Start each bar with <b>both hands exactly together</b>, then the LH just holds. Slow is fast.</p>`},
   {t:'song',title:'Ode to Joy · hands together',html:`<p><b>E4 + C3</b> means play both together.</p>`,text:T.odeHT,bpm:60,need:2,achOnDone:'twohands'}
  ]},
  {id:'2.5',title:'Dynamics',xp:50,steps:[
   {t:'read',title:'Soft and loud',html:`<p><b>p</b> (piano) = soft, <b>f</b> (forte) = loud, mf = medium.</p><p>On a touch-sensitive keyboard, the <b>speed</b> of the key sets the volume: soft = gentle drop, loud = faster arm-weight drop. Never stab or tense up.</p>`},
   {t:'dyn',title:'p then f',seq:['C4','D4','E4','F4','G4'],fingers:[1,2,3,4,5],diff:6}
  ]},
  {id:'2.6',title:'G position',xp:50,steps:[
   {t:'read',title:'Move to G',html:`<p>Same hand shape, new place. RH thumb on <b>G4</b>: G A B C D = 1 2 3 4 5.</p><p>LH pinky on <b>G2</b>: G A B C D = 5 4 3 2 1.</p>`,kb:{from:'G4',to:'D5',marks:fingers('G4 A4 B4 C5 D5',[1,2,3,4,5])}},
   {t:'song',title:'G position · RH',text:T.gRH,bpm:60,need:2},
   {t:'song',title:'G position · LH',text:T.gLH,bpm:60,need:2}
  ]},
  {id:'2.7',title:'Song: Storm Warning',xp:50,steps:[
   {t:'read',title:'Storm Warning',html:`<p>An original rock theme in C position: a menacing repeated-note riff, then a climb up the five fingers and a drop to home. First the right hand, then add <b>one LH note per bar</b> — the low note is the thunder under the riff.</p>`},
   {t:'song',title:'Right hand',text:T.stormRH,bpm:72,need:2},
   {t:'song',title:'Hands together',text:T.stormHT,bpm:72,need:2}
  ]}],
  boss:{id:'B2',title:'The Grove Warden',xp:200,boss:true,steps:[
   {t:'read',title:'👹 The Grove Warden',html:`<p>Two hands, two volumes, twenty notes. Beat all three.</p>`},
   {t:'song',title:'Storm Warning · hands together',text:T.stormHT,bpm:72,need:3},
   {t:'dyn',title:'Soft vs loud',seq:['C4','E4','G4','E4','C4'],fingers:[1,3,5,3,1],diff:6},
   {t:'random',title:'Read 20 notes',html:`<p>Grand staff. 18 of 20 first try.</p>`,from:'C3',to:'C5',n:20,pass:18,show:'staff'}
  ]}}
];

export const RHY=[ // counting drills: rests/held beats in ( )
  {q:'How do you count this bar?',score:'C4 C4e C4e C4h',opts:['1 2 & 3 (4)','1 & 2 3 (4)','1 2 3 & (4)','1 2 3 4'],a:'1 2 & 3 (4)'},
  {q:'How do you count this bar?',score:'C4q. C4e C4h',opts:['1 (2) & 3 (4)','1 & 2 3 (4)','1 2 & 3 (4)','1 2 3 4'],a:'1 (2) & 3 (4)'},
  {q:'How do you count this bar?',score:'C4e C4e C4e C4e C4h',opts:['1 & 2 & 3 (4)','1 2 3 4 5','1 & 2 3 (4)','1 2 & 3 (4)'],a:'1 & 2 & 3 (4)'},
  {q:'How do you count this bar?',score:'Rq C4 C4e C4e C4',opts:['(1) 2 3 & 4','1 2 3 & 4','(1) 2 & 3 4','1 & 2 3 4'],a:'(1) 2 3 & 4'}];

WORLDS.push(
 {id:3,name:'Rhythm Rapids',sub:'eighths, dotted rhythms, articulation, sharps & flats',quests:[
  {id:'3.1',title:'Eighth notes',xp:50,steps:[
   {t:'read',title:'Two per beat',html:`<p>An <b>eighth note</b> is half a beat: a filled head with a <b>flag</b> (or two joined by a beam).</p><p>Count them <b>1 & 2 & 3 & 4 &</b> — the number is on the click, the “&” exactly halfway to the next click.</p><p>Say the count out loud before you play. Fingers stay close to the keys; eighths are small, light movements.</p>`},
   {t:'quiz',title:'Count it',kind:'mc',pass:3,items:[RHY[0],RHY[2],
     {q:'Two eighth notes last…',opts:['½ beat','1 beat','2 beats','4 beats'],a:'1 beat'},
     {q:'One eighth note lasts…',opts:['½ beat','1 beat','2 beats','¼ beat'],a:'½ beat'}]},
   {t:'song',title:'Eighths, slowly',html:`<p>Count “1 & 2 &” out loud.</p>`,text:T.eighths,bpm:60,need:1},
   {t:'song',title:'Eighths at 72',text:T.eighths,bpm:72,need:2}
  ]},
  {id:'3.2',title:'Dotted quarter + eighth',xp:50,steps:[
   {t:'read',title:'The dot',html:`<p>A <b>dot</b> adds half the note's value. Dotted half = 3 beats. <b>Dotted quarter = 1½ beats</b>.</p><p>Dotted quarter + eighth fills 2 beats: play on <b>1</b>, hold through 2, play the eighth on <b>“2 &”</b>. Count: <b>1 (2) & 3</b>.</p><p>Now you can play Ode to Joy with its real rhythm.</p>`},
   {t:'quiz',title:'Count it',kind:'mc',pass:3,items:[RHY[1],
     {q:'A dotted quarter lasts…',opts:['1 beat','1½ beats','2 beats','3 beats'],a:'1½ beats'},
     {q:'A dotted half lasts…',opts:['2 beats','2½ beats','3 beats','4 beats'],a:'3 beats'},
     {q:'Dotted quarter + eighth = ?',opts:['1½ beats','2 beats','2½ beats','3 beats'],a:'2 beats'}]},
   {t:'song',title:'Ode to Joy · real rhythm',text:T.ode2,bpm:66,need:1},
   {t:'song',title:'Target tempo',text:T.ode2,bpm:80,need:3}
  ]},
  {id:'3.3',title:'Ties, slurs & legato',xp:50,steps:[
   {t:'read',title:'Two curved lines',html:`<p>A <b>tie</b> joins two notes of the <b>same pitch</b>: play once, hold for both values together. (In this app a tied note is simply written as one longer note.)</p><p>A <b>slur</b> curves over <b>different</b> notes: play them <b>legato</b> — smoothly connected, no gaps.</p><p>Legato on the keys: the next key goes down exactly as the previous one comes up. Like walking: one foot lands as the other lifts.</p>`},
   {t:'quiz',title:'Tie or slur?',kind:'mc',pass:3,items:[
     {q:'A curve joins two Gs. You…',opts:['Play G once, hold both values','Play G twice','Play it short','Skip the second G'],a:'Play G once, hold both values'},
     {q:'A curve over C D E F means…',opts:['Play them smoothly connected','Play only C','Hold C the whole time','Play them short'],a:'Play them smoothly connected'},
     {q:'A whole note tied to a half note lasts…',opts:['4 beats','5 beats','6 beats','2 beats'],a:'6 beats'},
     {q:'Legato means…',opts:['Smooth, no gaps','Short and detached','Loud','Fast'],a:'Smooth, no gaps'}]},
   {t:'check',title:'Legato check',items:['Each key comes up exactly as the next goes down — no gap, no blur','Wrist stays level and quiet','Fingers stay close to the keys']},
   {t:'song',title:'A legato phrase',html:`<p>One long slur over the whole line. Smooth as you can — listen for gaps.</p>`,text:T.legato,bpm:72,need:2}
  ]},
  {id:'3.4',title:'Staccato vs legato',xp:50,steps:[
   {t:'read',title:'Short and light',html:`<p><b>Staccato</b> (a dot <b>above or below</b> the note head) = short and detached.</p><p>Bounce lightly from the <b>wrist</b>, like dribbling a small ball. The finger keeps its shape and does not stab; the key comes up straight away.</p><p>The mic checks your notes and timing. You judge the shortness, so listen.</p>`},
   {t:'song',title:'Staccato',html:`<p>Every note short. Same steady beat.</p>`,text:T.stacc,bpm:76,need:2},
   {t:'song',title:'Now legato',html:`<p>Same notes, now smooth and connected.</p>`,text:T.stacc,bpm:76,need:2},
   {t:'check',title:'Self-check',items:['Staccato notes were clearly short, with silence between them','Staccato came from a loose wrist bounce, not a finger poke','Legato had no gaps']}
  ]},
  {id:'3.5',title:'Sharps, flats & naturals',xp:50,steps:[
   {t:'read',title:'The black keys get names',html:`<p><b>Sharp ♯</b> = one half step <b>up</b> (the very next key to the right). <b>Flat ♭</b> = one half step <b>down</b>. <b>Natural ♮</b> cancels a sharp or flat.</p><p>So the black key between F and G is <b>F♯</b> — and also <b>G♭</b>. Same key, two names.</p><p>An accidental lasts until the end of the bar.</p>`,kb:{from:'C4',to:'B4',marks:{'C#4':'C♯','Eb4':'E♭','F#4':'F♯','Ab4':'A♭','Bb4':'B♭'}}},
   {t:'quiz',title:'Name it',kind:'mc',pass:4,items:[
     {q:'Name the yellow key',kb:{from:'C4',to:'B4',marks:{'F#4':'?'}},opts:['F♯','G♯','C♯','A♯'],a:'F♯'},
     {q:'Name the yellow key',kb:{from:'C4',to:'B4',marks:{'Bb4':'?'}},opts:['B♭','E♭','A♭','D♭'],a:'B♭'},
     {q:'A sharp moves a note…',opts:['Half step up','Half step down','Whole step up','An octave up'],a:'Half step up'},
     {q:'F♯ in bar 1. Next F in the same bar is…',opts:['Still F♯','F natural','F♭','Silent'],a:'Still F♯'},
     {q:'E♯ is the same key as…',opts:['F','E','D♯','F♯'],a:'F'}]},
   {t:'notes',title:'Black-key hunt',html:`<p>Find each one. Any octave.</p>`,seq:['F#4','C#4','Bb3','Eb4','G#4','Ab3'],hint:'miss',kbRange:[N('C3'),N('B4')],maxMistakes:2},
   {t:'read',title:'D position',html:`<p>Five-finger D position: RH thumb on <b>D4</b> — D E <b>F♯</b> G A = 1 2 3 4 5. Finger 3 plays the black key, so move the hand slightly in toward the black keys.</p><p>LH: pinky on <b>D3</b> — D E F♯ G A = 5 4 3 2 1.</p>`,kb:{from:'C4',to:'B4',marks:fingers('D4 E4 F#4 G4 A4',[1,2,3,4,5])}},
   {t:'song',title:'D position · RH',text:T.dRH,bpm:66,need:2},
   {t:'song',title:'D position · LH',text:T.dLH,bpm:66,need:2}
  ]},
  {id:'3.6',title:'Pickups',xp:50,steps:[
   {t:'read',title:'Starting before beat 1',html:`<p>Many songs start on an <b>upbeat</b>: a short <b>pickup bar</b> before the first full bar.</p><p>Rapid Fire (the next quest) starts on beat 2: count <b>1</b> in silence, play C E G on <b>2 3 4</b>, and the big G lands on the next <b>1</b>.</p><p>Here the silent beat is shown as a rest so you can count it.</p>`},
   {t:'song',title:'Pickup riff',text:T.pickup,bpm:80,need:2}
  ]},
  {id:'3.7',title:'Song: Rapid Fire',xp:50,steps:[
   {t:'read',title:'Rapid Fire',html:`<p>An original rock tune in C position built on the pickup you just learned: <b>rest, then C E G</b> kicks in on beat 2. Then a held note, a run of eighths, and a dotted rhythm to end the phrase.</p><p>RH stays in C position the whole time. The LH plays long notes — <b>C3</b> (finger 5), <b>F3</b> (finger 2) and <b>G3</b> (finger 1) — as a foundation. Hold every long note its full length: that's where the weight comes from.</p>`},
   {t:'song',title:'Right hand',text:T.fireRH,bpm:80,need:2},
   {t:'song',title:'Hands together, slow',text:T.fireHT,bpm:70,need:1},
   {t:'song',title:'Hands together',text:T.fireHT,bpm:80,need:2}
  ]}],
  boss:{id:'B3',title:'The Rapids',xp:200,boss:true,steps:[
   {t:'read',title:'👹 The Rapids',html:`<p>The river speeds up. Count four rhythms right, then play Rapid Fire at 90, hands together, three times clean.</p>`},
   {t:'quiz',title:'Count 4 rhythms',kind:'mc',pass:4,items:RHY},
   {t:'song',title:'Eighths @ 80',text:T.eighths,bpm:80,need:1},
   {t:'song',title:'Rapid Fire @ 90',text:T.fireHT,bpm:90,need:3}
  ]}}
);

WORLDS.push(
 {id:4,name:'Scale Summit',sub:'major scales, thumb-under, triads, I–IV–V',quests:[
  {id:'4.1',title:'C major scale · RH',xp:50,steps:[
   {t:'read',title:'The major-scale recipe',html:`<p>Every major scale follows one pattern of steps: <b>W W H W W W H</b> (W = whole step, two keys apart; H = half step, the very next key).</p><p>C major uses only white keys: C D E F G A B C. The half steps fall at E–F and B–C — the places with no black key between.</p>`},
   {t:'read',title:'Thumb under',html:`<p>Eight notes, five fingers — so the thumb travels.</p><p>RH up: <b>1 2 3, thumb under to F, 1 2 3 4 5</b>. Start moving the thumb under while finger 2 plays, so it's already waiting by F. Wrist level, elbow quiet — no jerks.</p><p>Down: 5 4 3 2 1, then <b>3 crosses over</b> the thumb to E.</p>`,kb:{from:'C4',to:'C5',marks:fingers('C4 D4 E4 F4 G4 A4 B4 C5',[1,2,3,1,2,3,4,5])}},
   {t:'quiz',title:'Steps',kind:'mc',pass:3,items:[
     {q:'Major scale pattern?',opts:['W W H W W W H','W H W W H W W','H W W W H W W','W W W H W W H'],a:'W W H W W W H'},
     {q:'In C major, the half steps are…',opts:['E–F and B–C','C–D and F–G','D–E and A–B','None'],a:'E–F and B–C'},
     {q:'RH C scale: the thumb goes under to…',opts:['F','E','G','D'],a:'F'},
     {q:'Coming down, which finger crosses over the thumb?',opts:['3','2','4','5'],a:'3'}]},
   {t:'song',title:'C scale · RH slow',text:T.cRH,bpm:60,need:2},
   {t:'song',title:'C scale · RH',text:T.cRH,bpm:72,need:3}
  ]},
  {id:'4.2',title:'C major scale · LH',xp:50,steps:[
   {t:'read',title:'Left hand',html:`<p>LH up: <b>5 4 3 2 1</b>, then <b>3 crosses over</b> the thumb to A, 2 1.</p><p>Down: <b>1 2 3</b> from C to A, then the <b>thumb goes under</b> to G, and 1 2 3 4 5 to the bottom. Mirror image of the right hand.</p>`,kb:{from:'C3',to:'C4',marks:fingers('C3 D3 E3 F3 G3 A3 B3 C4',[5,4,3,2,1,3,2,1])}},
   {t:'song',title:'C scale · LH slow',text:T.cLH,bpm:60,need:2},
   {t:'song',title:'C scale · LH',text:T.cLH,bpm:72,need:3}
  ]},
  {id:'4.3',title:'G & F major · key signatures',xp:50,steps:[
   {t:'read',title:'Key signatures',html:`<p>Apply W W H W W W H starting on G and you need <b>F♯</b>. So G major's <b>key signature</b> has one sharp, written right after the clef. Every F in the piece is F♯ — no need to mark each one.</p><p>F major needs <b>B♭</b>: one flat in the key signature.</p><p>F major RH fingering is special: <b>1 2 3 4, thumb under to C, 1 2 3 4</b> — finger 4 takes the B♭.</p>`},
   {t:'quiz',title:'Keys',kind:'mc',pass:3,items:[
     {q:'G major has…',opts:['1 sharp: F♯','1 flat: B♭','2 sharps','No sharps or flats'],a:'1 sharp: F♯'},
     {q:'F major has…',opts:['1 flat: B♭','1 sharp: F♯','2 flats','No sharps or flats'],a:'1 flat: B♭'},
     {q:'Key signature with one sharp. You see an F. Play…',opts:['F♯','F','G','E'],a:'F♯'},
     {q:'RH F major: which finger plays B♭?',opts:['4','3','1','5'],a:'4'}]},
   {t:'song',title:'G major · RH',text:T.gRHs,bpm:60,need:2,key:'G'},
   {t:'song',title:'G major · LH',text:T.gLHs,bpm:60,need:2,key:'G'},
   {t:'song',title:'F major · RH',text:T.fRHs,bpm:60,need:2,key:'F'},
   {t:'song',title:'F major · LH',text:T.fLHs,bpm:60,need:2,key:'F'}
  ]},
  {id:'4.4',title:'Triads',xp:50,steps:[
   {t:'read',title:'Stack two thirds',html:`<p>A <b>triad</b> is three notes stacked in thirds: <b>root – 3rd – 5th</b>. Skip a key, play, skip a key, play.</p><p>C triad = C E G. On the staff the notes sit all on lines or all in spaces — a snowman.</p><p>RH fingers <b>1 3 5</b>. Drop into all three keys at once with arm weight, so they sound as one.</p>`,kb:{from:'C4',to:'B4',marks:{C4:'1',E4:'3',G4:'5'}},staff:['C4','E4','G4']},
   {t:'quiz',title:'Build it',kind:'mc',pass:4,items:[
     {q:'F major triad',opts:['F A C','F G A','F A B♭','F B D'],a:'F A C'},
     {q:'G major triad',opts:['G B D','G A B','G C E','G B E'],a:'G B D'},
     {q:'A minor triad',opts:['A C E','A C♯ E','A B C','A D E'],a:'A C E'},
     {q:'D minor triad',opts:['D F A','D F♯ A','D E F','D G B'],a:'D F A'},
     {q:'E minor triad',opts:['E G B','E G♯ B','E F G','E A C'],a:'E G B'}]},
   {t:'song',title:'Triads up and down',html:`<p>C – Dm – Em – F – G – Am and back. All three notes exactly together.</p>`,text:T.triads,bpm:60,need:2}
  ]},
  {id:'4.5',title:'I – IV – V',xp:50,steps:[
   {t:'read',title:'The three main chords',html:`<p>Number the scale notes 1–7 (in Roman numerals). The chords built on <b>I, IV and V</b> are the primary chords — they can harmonise thousands of songs.</p><p>In C: <b>I = C</b>, <b>IV = F</b>, <b>V = G</b>. In G: G, C, D. In F: F, B♭, C.</p><p>Lead sheets show the melody plus <b>chord symbols</b> (C, F, G…) above it. You play the melody with the RH and the named chords with the LH.</p>`},
   {t:'quiz',title:'Name them',kind:'mc',pass:4,items:[
     {q:'IV in C major',opts:['F','G','D','A'],a:'F'},
     {q:'V in G major',opts:['D','C','A','E'],a:'D'},
     {q:'I, IV, V in F major',opts:['F B♭ C','F B C','F A C','F C G'],a:'F B♭ C'},
     {q:'V in C major',opts:['G','F','E','A'],a:'G'},
     {q:'IV in G major',opts:['C','D','A','F'],a:'C'}]},
   {t:'song',title:'LH chords: I IV I V I',html:`<p>LH fingers 5 3 1 on each chord. Move the whole hand as one shape.</p>`,text:T.ivv,bpm:60,need:2},
   {t:'song',title:'Ode to Joy with chords',html:`<p>RH melody, LH holds the chord: C (I) or G (V).</p>`,text:T.odeCh,bpm:60,need:2}
  ]},
  {id:'4.6',title:'Scales hands together',xp:50,steps:[
   {t:'read',title:'Two hands, one scale',html:`<p>Both hands start on C, an octave apart. The thumbs cross at different moments: RH thumb under on <b>F</b>, LH 3 over on <b>A</b>.</p><p>Go slower than either hand alone. Watch for the moment one hand crosses — the other must not stumble.</p>`},
   {t:'song',title:'C major · hands together',text:T.cHT,bpm:52,need:2},
   {t:'song',title:'C major · hands together',text:T.cHT,bpm:60,need:3,achOnDone:'scale'}
  ]},
  {id:'4.7',title:'Song: Ember Waltz',xp:50,steps:[
   {t:'read',title:'Ember Waltz',html:`<p>An original rock waltz in <b>A minor</b>, 3/4, with a one-beat pickup. Count <b>1 2</b> in silence; the first note lands on beat 3.</p><p>The LH plays <b>power chords</b> — just the <b>root and the fifth</b> (A+E, F+C, G+D, E+B), the sound of rock guitar. One per bar, fingers 5 and 1, held for the whole bar. The RH moves in a small minor-pentatonic range, so the melody stays tight and dark.</p><p>Play the long notes with weight; let the eighths in bars 10–11 push forward.</p>`},
   {t:'song',title:'Melody',text:T.ember,bpm:80,bpb:3,need:2},
   {t:'song',title:'With power chords, slow',text:T.emberHT,bpm:66,bpb:3,need:1},
   {t:'song',title:'With power chords',text:T.emberHT,bpm:80,bpb:3,need:2}
  ]}],
  boss:{id:'B4',title:'The Summit',xp:200,boss:true,steps:[
   {t:'read',title:'👹 The Summit',html:`<p>Three scales hands together, a rock waltz with power chords, and instant I–IV–V. The air is thin up here.</p>`},
   {t:'quiz',title:'I – IV – V, instantly',kind:'mc',pass:5,items:[
     {q:'I IV V in C',opts:['C F G','C E G','C D G','C F A'],a:'C F G'},
     {q:'I IV V in G',opts:['G C D','G B D','G C E','G D A'],a:'G C D'},
     {q:'I IV V in F',opts:['F B♭ C','F B C','F A C','F C D'],a:'F B♭ C'},
     {q:'V in F',opts:['C','B♭','G','D'],a:'C'},
     {q:'IV in G',opts:['C','D','E','F♯'],a:'C'}]},
   {t:'song',title:'C major HT',text:T.cHT,bpm:60,need:1},
   {t:'song',title:'G major HT',text:T.gHT,bpm:60,need:1,key:'G'},
   {t:'song',title:'F major HT',text:T.fHT,bpm:60,need:1,key:'F'},
   {t:'song',title:'Ember Waltz',text:T.emberHT,bpm:80,bpb:3,need:3}
  ]}}
);

export const G68={bpb:3,ts:'6/8',clk:1.5};

WORLDS.push(
 {id:5,name:'Harmony Harbor',sub:'inversions, broken chords, minor keys, 6/8, phrasing',quests:[
  {id:'5.1',title:'Chord inversions',xp:50,steps:[
   {t:'read',title:'Same chord, new shape',html:`<p>Move the bottom note of a chord to the top and you get an <b>inversion</b>. C E G (root position) → <b>E G C</b> (1st inversion) → <b>G C E</b> (2nd inversion). Still a C chord.</p><p>Why? <b>Voice leading</b>: chords can sit close together so the hand barely moves. C → F/C → G/B: C E G → C F A → B D G.</p><p>RH fingering: root 1 3 5, 1st inversion <b>1 2 5</b>, 2nd inversion <b>1 3 5</b>.</p>`,staff:['C4','E4','G4','E4','G4','C5']},
   {t:'quiz',title:'Which inversion?',kind:'mc',pass:4,items:[
     {q:'E G C is…',opts:['C, 1st inversion','C, root position','C, 2nd inversion','E minor'],a:'C, 1st inversion'},
     {q:'G C E is…',opts:['C, 2nd inversion','C, 1st inversion','G major','C, root position'],a:'C, 2nd inversion'},
     {q:'A C F is…',opts:['F, 1st inversion','A minor','F, 2nd inversion','F, root position'],a:'F, 1st inversion'},
     {q:'Root-position G triad',opts:['G B D','B D G','D G B','G C E'],a:'G B D'},
     {q:'C to F/C: which note stays put?',opts:['C','E','G','F'],a:'C'}]},
   {t:'song',title:'Voice leading · RH',html:`<p>C – F/C – C – G/B – C. Keep the hand still; only the fingers that must move, move.</p>`,text:T.voiceRH,bpm:60,need:2},
   {t:'song',title:'Voice leading · LH',text:T.voiceLH,bpm:60,need:2},
   {t:'song',title:'All inversions · RH',html:`<p>C, F, G, Am — root, 1st, 2nd inversion each.</p>`,text:T.invRH,bpm:60,need:1},
   {t:'song',title:'All inversions · LH',text:T.invLH,bpm:60,need:1,achOnDone:'shape'}
  ]},
  {id:'5.2',title:'Broken chords & Alberti bass',xp:50,steps:[
   {t:'read',title:'Spread the chord out',html:`<p>A <b>broken chord</b> plays the chord's notes one after another.</p><p><b>Alberti bass</b> is the classic pattern <b>low – high – middle – high</b> (C G E G), named after a composer who used it constantly. Mozart and Clementi too.</p><p>The secret is <b>wrist rotation</b>: rock the hand like turning a door knob, a little each way. The fingers barely lift. If your forearm tightens, slow down.</p>`,kb:{from:'C3',to:'B3',marks:{C3:'5',E3:'3',G3:'1'}}},
   {t:'song',title:'Broken chords · RH',text:T.brokenRH,bpm:66,need:2},
   {t:'song',title:'Alberti bass · LH',html:`<p>C – F/C – G/B – C. Rotate, don't lift.</p>`,text:T.alberti,bpm:60,need:2},
   {t:'check',title:'Rotation check',items:['The wrist rocks gently side to side','The fingers stay close to the keys','The bottom note is not louder than the others']}
  ]},
  {id:'5.3',title:'Minor keys',xp:50,steps:[
   {t:'read',title:'The darker side',html:`<p>Every major key has a <b>relative minor</b> that shares its key signature, starting on the 6th note. C major ↔ <b>A minor</b>. F major ↔ D minor. G major ↔ E minor.</p><p><b>Natural minor</b>: A B C D E F G A — all white keys. <b>Harmonic minor</b> raises the 7th: <b>G♯</b>. That leading note pulls hard back to A.</p><p>Minor triad: the middle note is a half step lower than in major. A C♯ E (major) → <b>A C E</b> (minor).</p>`},
   {t:'quiz',title:'Hear it',kind:'ear',n:8,pass:6},
   {t:'quiz',title:'Know it',kind:'mc',pass:3,items:[
     {q:'Relative minor of C major',opts:['A minor','C minor','E minor','D minor'],a:'A minor'},
     {q:'A harmonic minor raises…',opts:['G to G♯','F to F♯','C to C♯','Nothing'],a:'G to G♯'},
     {q:'Relative minor of F major',opts:['D minor','A minor','F minor','E minor'],a:'D minor'},
     {q:'D minor key signature',opts:['1 flat (B♭)','1 sharp (F♯)','No sharps or flats','2 flats'],a:'1 flat (B♭)'}]},
   {t:'song',title:'A natural minor · RH',text:T.amN,bpm:66,need:2},
   {t:'song',title:'A harmonic minor · RH',text:T.amH,bpm:66,need:2},
   {t:'song',title:'D harmonic minor · RH',text:T.dmH,bpm:60,need:1,key:'Dm'},
   {t:'song',title:'E harmonic minor · RH',text:T.emH,bpm:60,need:1,key:'Em'}
  ]},
  {id:'5.4',title:'6/8 time',xp:50,steps:[
   {t:'read',title:'Two big beats',html:`<p><b>6/8</b> has 6 eighth notes per bar, grouped in two threes: <b>1</b>-2-3 <b>4</b>-5-6. It feels like <b>two big beats</b>, each a dotted quarter — a lilting, rocking feel.</p><p>The click here sounds on the two big beats. Count “1-2-3 4-5-6” quietly, accent 1 and 4.</p>`},
   {t:'quiz',title:'Count it',kind:'mc',pass:3,items:[
     {q:'Eighth notes in a 6/8 bar',opts:['6','3','8','4'],a:'6'},
     {q:'6/8 feels like…',opts:['Two big beats','Six equal accents','Three beats','Four beats'],a:'Two big beats'},
     {q:'One big beat in 6/8 is a…',opts:['Dotted quarter','Quarter','Half','Eighth'],a:'Dotted quarter'},
     {q:'Quarter + eighth in 6/8 lasts…',opts:['3 eighths','2 eighths','4 eighths','6 eighths'],a:'3 eighths'}]},
   {t:'song',title:'Rocking in 6/8',text:T.six8,bpm:72,need:2,...G68}
  ]},
  {id:'5.5',title:'Phrasing & shape',xp:50,steps:[
   {t:'read',title:'Make it speak',html:`<p>A <b>phrase</b> is a musical sentence, usually 2–4 bars, marked by a slur. Lift your hand slightly at the end of it, like taking a breath.</p><p><b>Crescendo</b> (<i>cresc.</i>, &lt;) = gradually louder. <b>Diminuendo</b> (<i>dim.</i>, &gt;) = gradually softer. <b>Ritardando</b> (<i>rit.</i>) = gradually slower — the app keeps strict time, so practise rit. without the click.</p><p>Shape: grow toward the highest note, relax away from it.</p>`},
   {t:'quiz',title:'Terms',kind:'mc',pass:3,items:[
     {q:'Crescendo means…',opts:['Gradually louder','Gradually softer','Gradually slower','Suddenly loud'],a:'Gradually louder'},
     {q:'Ritardando means…',opts:['Gradually slower','Gradually faster','Softer','Detached'],a:'Gradually slower'},
     {q:'&gt; under a phrase (a long hairpin) means…',opts:['Diminuendo','Crescendo','Staccato','Accent every note'],a:'Diminuendo'},
     {q:'End of a phrase: you…',opts:['Lift gently, like a breath','Play the last note loudest','Speed up','Hold the pedal'],a:'Lift gently, like a breath'}]},
   {t:'song',title:'Shape a phrase',html:`<p>Crescendo up to the A in bar 2, diminuendo back down to C. Keep strict time.</p>`,text:T.phrase,bpm:66,need:2},
   {t:'dyn',title:'Soft to loud',seq:['C4','D4','E4','F4','G4'],fingers:[1,2,3,4,5],diff:6},
   {t:'check',title:'Self-check',items:['The phrase clearly grew toward the top','It relaxed back down to the end','The last note was soft and the hand lifted gently']}
  ]},
  {id:'5.6',title:'Song: Dark Tide',xp:50,steps:[
   {t:'read',title:'Dark Tide',html:`<p>An original minor-key rock ballad in <b>A minor</b> and <b>6/8</b>, with a one-eighth pickup. The 6/8 pulse rocks like a slow tide: two big dotted-quarter beats per bar.</p><p>The dotted eighth + sixteenth (<i>long-short</i>) in bars 2 and 6 gives it its lilt — count “1-2-3 4-5-6” and place the sixteenth just before the next eighth.</p><p>LH: two notes per bar (root, then fifth) — a power-chord pulse. Fingering is suggested; the hand shifts on longer notes.</p>`},
   {t:'song',title:'Melody, slow',text:T.green,bpm:60,need:1,...G68},
   {t:'song',title:'Melody',text:T.green,bpm:75,need:2,...G68},
   {t:'song',title:'Hands together, slow',text:T.greenHT,bpm:60,need:1,...G68},
   {t:'song',title:'Hands together',text:T.greenHT,bpm:75,need:2,...G68,achOnDone:'minor'}
  ]},
  {id:'5.7',title:'Compose!',xp:50,steps:[
   {t:'read',title:'Your own 8 bars',html:`<p>Write a melody over <b>I – IV – V – I</b> twice (8 bars, 4/4, C major): bars 1–4 = C F G C, bars 5–8 = C F G C.</p><p>Rules of thumb: use mostly chord notes on beat 1 (C E G over C, F A C over F, G B D over G), move by step between them, and <b>end on C</b>.</p><p>Type it in the <b>Song</b> tab → Custom, in the app's note format (e.g. <code>E4/3 D4/2 C4h/1</code>). Add LH chords with <code>+</code>: <code>E4+C3:w/3</code>.</p>`},
   {t:'check',title:'Composer checklist',items:['8 bars, each adding up to 4 beats','Beat 1 of each bar fits its chord','It ends on C','I played it 3 times clean in the Song tab']},
   {t:'read',title:'Share it',html:`<p>Copy your melody into your teacher chat — it's worth showing off.</p>`,achOnDone:'composer'}
  ]}],
  boss:{id:'B5',title:'The Harbor Siren',xp:200,boss:true,steps:[
   {t:'read',title:'👹 The Harbor Siren',html:`<p>She sings in minor keys and lures sailors off the beat. Name what you hear, shapeshift every chord, then sing her own song back to her.</p>`},
   {t:'quiz',title:'Major or minor? 8 of 10',kind:'ear',n:10,pass:8},
   {t:'song',title:'Inversions · RH',text:T.invRH,bpm:60,need:1},
   {t:'song',title:'Inversions · LH',text:T.invLH,bpm:60,need:1},
   {t:'song',title:'Dark Tide',text:T.greenHT,bpm:75,need:3,...G68}
  ]}}
);

export const MG={bpb:3,key:'G'},ML={one:'T'};

WORLDS.push(
 {id:6,name:'Classic Castle',sub:'real scores: Schumann, the Minuet in G, 2-octave scales',quests:[
  {id:'6.1',title:'Reading real scores',xp:50,steps:[
   {t:'read',title:'Into the library',html:`<p>From here on you play real pieces. Free, public-domain editions are on <b>IMSLP</b> (imslp.org) — look up the pieces in this world there and compare.</p><p><b>Repeat signs</b> (a double bar with two dots) send you back to the matching sign or the start. <b>1st / 2nd endings</b>: the first time play ending 1 and repeat; the second time skip it and take ending 2.</p><p>Ignore ornaments (little squiggles like trills and mordents) for now. <b>Fingering</b> numbers in editions are advice — follow them until you have a reason not to.</p><p>In this app pieces are written out once, without repeats.</p>`},
   {t:'quiz',title:'Read the map',kind:'mc',pass:4,items:[
     {q:'A repeat sign at the end of bar 8 (no earlier sign). You…',opts:['Go back to bar 1, play to bar 8 again','Stop','Go back one bar','Skip to the end'],a:'Go back to bar 1, play to bar 8 again'},
     {q:'2nd ending: when do you play it?',opts:['After the repeat, skipping ending 1','First time through','Both times','Never'],a:'After the repeat, skipping ending 1'},
     {q:'A mordent squiggle, beginner plan:',opts:['Play the plain note for now','Skip the bar','Play it twice as loud','Hold it longer'],a:'Play the plain note for now'},
     {q:'Where to get free public-domain scores?',opts:['IMSLP','Only paid apps','Radio','Nowhere'],a:'IMSLP'}]}
  ]},
  {id:'6.2',title:'Schumann: Melodie',xp:50,steps:[
   {t:'read',title:'Melodie, Op. 68 No. 1',html:`<p>From Schumann's <i>Album for the Young</i> (1848). Both hands are written in the treble clef — the LH plays just below the RH, in steady eighths (stems down).</p><p>The RH sings the tune <b>legato</b>; the LH accompanies, softer. Learn each hand alone first, then together, slowly. Bars 1–4 are played twice.</p><p>Fingering isn't printed here — check an IMSLP edition, or ask your chat teacher.</p>`},
   {t:'song',title:'Right hand',text:T.melR,bpm:66,need:2},
   {t:'song',title:'Left hand',text:T.melL,bpm:66,need:2,...ML},
   {t:'song',title:'Hands together, slow',text:T.melHT,bpm:56,need:1,...ML},
   {t:'song',title:'Hands together',text:T.melHT,bpm:72,need:2,...ML}
  ]},
  {id:'6.3',title:'Minuet in G · part A',xp:50,steps:[
   {t:'read',title:'Minuet in G, BWV Anh. 114',html:`<p>From the notebook Bach gave his wife Anna Magdalena (1725); it's now credited to Christian Petzold. A <b>minuet</b> is a dance in 3/4.</p><p>Key signature: one sharp — every F is F♯. The RH dances in quarters and eighths; the LH walks below it. Part A is bars 1–16.</p><p>Eighths even and light, quarters slightly detached — it's a dance. Fingering: see an IMSLP edition or ask your chat teacher.</p>`},
   {t:'song',title:'Part A · RH',text:T.minA_R,bpm:72,need:2,...MG},
   {t:'song',title:'Part A · LH',text:T.minA_L,bpm:72,need:2,...MG},
   {t:'song',title:'Part A · hands together, slow',text:T.minA,bpm:60,need:1,...MG},
   {t:'song',title:'Part A · hands together',text:T.minA,bpm:76,need:2,...MG}
  ]},
  {id:'6.4',title:'Minuet in G · part B',xp:50,steps:[
   {t:'read',title:'Part B',html:`<p>Bars 17–32 travel to D major (watch the <b>C♯</b>s) and come home to G. In a few bars the LH holds while the RH moves — keep counting.</p>`},
   {t:'song',title:'Part B · RH',text:T.minB_R,bpm:72,need:2,...MG},
   {t:'song',title:'Part B · LH',text:T.minB_L,bpm:72,need:2,...MG},
   {t:'song',title:'Part B · hands together',text:T.minB,bpm:72,need:2,...MG},
   {t:'song',title:'The whole minuet',text:T.minuet,bpm:84,need:1,...MG}
  ]},
  {id:'6.5',title:'Two-octave scales',xp:50,steps:[
   {t:'read',title:'Longer runs',html:`<p>Two octaves means the thumb crosses twice each way. RH C, G, D and A minor: <b>1 2 3, 1 2 3 4, 1 2 3, 1 2 3 4 5</b>. LH: <b>5 4 3 2 1, 3 2 1, 4 3 2 1, 3 2 1</b>.</p><p>F major RH is the odd one: <b>1 2 3 4, 1 2 3, 1 2 3 4, 1 2 3 4</b>.</p><p>Hands separately, steady quarters. The arm glides sideways; the thumb starts moving before it's needed.</p>`},
   {t:'song',title:'C major · RH',text:T.c2R,bpm:72,need:2},
   {t:'song',title:'C major · LH',text:T.c2L,bpm:72,need:2},
   {t:'song',title:'G major · RH',text:T.g2R,bpm:72,need:1,key:'G'},
   {t:'song',title:'G major · LH',text:T.g2L,bpm:72,need:1,key:'G'},
   {t:'song',title:'D major · RH',text:T.d2R,bpm:72,need:1,key:'D'},
   {t:'song',title:'D major · LH',text:T.d2L,bpm:72,need:1,key:'D'},
   {t:'song',title:'F major · RH',text:T.f2R,bpm:72,need:1,key:'F'},
   {t:'song',title:'F major · LH',text:T.f2L,bpm:72,need:1,key:'F'},
   {t:'song',title:'A harmonic minor · RH',text:T.a2R,bpm:72,need:1},
   {t:'song',title:'A harmonic minor · LH',text:T.a2L,bpm:72,need:1}
  ]},
  {id:'6.6',title:'Arpeggios',xp:50,steps:[
   {t:'read',title:'Chords in motion',html:`<p>An <b>arpeggio</b> plays a chord's notes up and down, adding the top root. One octave: RH <b>1 2 3 5</b>, LH <b>5 4 2 1</b>.</p><p>The hand opens wide — keep the wrist loose and let it travel with the notes; don't reach with stiff fingers.</p>`,kb:{from:'C4',to:'C5',marks:{C4:'1',E4:'2',G4:'3',C5:'5'}}},
   {t:'song',title:'C, G, F, Am · RH',text:T.arpR,bpm:72,need:2},
   {t:'song',title:'C, G, F, Am · LH',text:T.arpL,bpm:72,need:2}
  ]}],
  boss:{id:'B6',title:'The Castle Lord',xp:200,boss:true,steps:[
   {t:'read',title:'👹 The Castle Lord',html:`<p>He only respects real repertoire. Schumann's Melodie, polished — then the whole Minuet at dance tempo, three times clean.</p>`},
   {t:'song',title:'Melodie',text:T.melHT,bpm:80,need:1,...ML},
   {t:'song',title:'Minuet in G',text:T.minuet,bpm:96,need:3,...MG}
  ]}}
);

export const mc=(q,opts,a,extra={})=>Object.assign({q,opts,a},extra);

export const RHY16=[
  {q:'How do you count this bar?',score:'C4s C4s C4s C4s C4 C4h',opts:['1 e & a 2 3 (4)','1 & 2 & 3 (4)','1 2 3 4','1 e & a 2 & 3 4'],a:'1 e & a 2 3 (4)'},
  {q:'Play on which counts?',score:'C4e C4s C4s C4 C4h',opts:['1 & a 2 3 (4)','1 e & 2 3 (4)','1 & 2 3 4','1 e a 2 3 (4)'],a:'1 & a 2 3 (4)'},
  {q:'Play on which counts?',score:'C4e. C4s C4 C4h',opts:['1 a 2 3 (4)','1 e 2 3 (4)','1 & 2 3 (4)','1 2 3 4'],a:'1 a 2 3 (4)'},
  mc('One beat holds how many sixteenths?',['4','2','3','8'],'4'),
  mc('A sixteenth note lasts…',['¼ beat','½ beat','1 beat','⅛ beat'],'¼ beat')];

// ---------- World 3b ----------
export const W3B={id:'3b',noRank:true,name:'Shift & Cross',sub:'moving past five notes: shifts, thumb-under, finger-over, leaps',quests:[
  {id:'3b.1',title:'Lift & shift',xp:50,steps:[
   {t:'read',title:'Past five notes',html:`<p>Until now every piece stayed inside one five-finger position. Real music keeps moving, so the hand has to <b>shift</b>.</p><p>The shift happens <b>in the air</b>: finger 5 plays G, the hand lifts, and the thumb lands on <b>A</b> — a new position. Do it on the beat, without looking, and keep the hand shape.</p><p>Plan it one note ahead: while finger 5 plays, your eyes and thumb are already on A.</p>`,kb:{from:'C4',to:'E5',marks:fingers('C4 D4 E4 F4 G4 A4 B4 C5 D5 E5',[1,2,3,4,5,1,2,3,4,5])}},
   {t:'quiz',title:'Plan the shift',kind:'mc',pass:3,items:[
     mc('Finger 5 plays G4. Which finger plays the next note, A4, after a shift?',['Thumb (1)','Finger 5 again','Finger 2','Finger 3'],'Thumb (1)'),
     mc('The shift happens…',['In the air, between the notes','While holding the key down','Only on long notes','After the piece ends'],'In the air, between the notes'),
     mc('Best habit before a shift:',['Look at the landing note one beat early','Look at your hand after landing','Slam the key to be sure','Stop the metronome'],'Look at the landing note one beat early')]},
   {t:'song',title:'Up and back, slow',html:`<p>The thumb lands on A4 after the 5. Down, it is 5 again on G4. Keep the beat through the shift.</p>`,text:T.shiftA,bpm:52,need:1},
   {t:'song',title:'Lift & shift @ 60',text:T.shiftA,bpm:60,need:3}
  ]},
  {id:'3b.2',title:'Thumb-under (right hand)',xp:50,steps:[
   {t:'read',title:'The thumb travels early',html:`<p>Going up past finger 3, the <b>thumb tucks under</b> the hand so it is waiting under finger 3 before it is needed. Here: E (3), thumb under to <b>F</b>, then 2 and 3.</p><p>Wrist stays <b>level</b> and the elbow glides — no jerk, no twist. Slow down until the crossing makes no bump in the sound.</p>`,kb:{from:'E4',to:'A4',marks:fingers('E4 F4 G4 A4',[3,1,2,3])}},
   {t:'quiz',title:'Thumb-under',kind:'mc',pass:3,items:[
     mc('Going up, the thumb goes under after finger…',['3','1','5','2'],'3'),
     mc('When should the thumb start moving?',['Early, while finger 3 is still playing','Right when it has to play','After the note sounds','Only when you look'],'Early, while finger 3 is still playing'),
     mc('A bump or gap at the crossing usually means…',['The thumb started too late','You played too softly','The metronome is slow','The wrist is too level'],'The thumb started too late')]},
   {t:'song',title:'Thumb-under, slow',text:T.under,bpm:52,need:1},
   {t:'song',title:'Thumb-under @ 60',text:T.under,bpm:60,need:3},
   {t:'check',title:'Form check',items:['Wrist stayed level through every crossing','Elbow glided, no jerk','No gap or bump in the sound at the crossing']}
  ]},
  {id:'3b.3',title:'Finger-over (right hand)',xp:50,steps:[
   {t:'read',title:'Coming down',html:`<p>Going down, the thumb is the pivot: finger <b>3 crosses over</b> it. G (2), F (thumb), then <b>E with finger 3</b>.</p><p>It is the mirror of the thumb-under — the same smooth glide, in the other direction. The exercise goes down over the thumb, then back up under it.</p>`,kb:{from:'D4',to:'G4',marks:fingers('D4 E4 F4 G4',[2,3,1,2])}},
   {t:'song',title:'Finger-over, slow',text:T.over,bpm:52,need:1},
   {t:'song',title:'Finger-over @ 60',text:T.over,bpm:60,need:3}
  ]},
  {id:'3b.4',title:'Left-hand crossings',xp:50,steps:[
   {t:'read',title:'Mirror image',html:`<p>The left hand does the opposite. Going <b>up</b>: 5 4 3 2 1, then <b>finger 3 crosses over</b> the thumb to A. Going <b>down</b>: 1 2 3, then the <b>thumb goes under</b> to G.</p><p>One octave, C up and back. Same rules: early, level, quiet.</p>`,kb:{from:'C3',to:'C4',marks:fingers('C3 D3 E3 F3 G3 A3 B3 C4',[5,4,3,2,1,3,2,1])}},
   {t:'song',title:'LH octave, slow',text:T.lhCross,bpm:52,need:1},
   {t:'song',title:'LH octave @ 60',text:T.lhCross,bpm:60,need:3}
  ]},
  {id:'3b.5',title:'Finger substitution',xp:50,steps:[
   {t:'read',title:'Swap while you hold',html:`<p>Hold a key down, and <b>silently swap fingers</b> on it. The sound does not change, but your hand is now in a better place.</p><p>Here you play each long note with finger <b>3</b>, swap to the <b>thumb</b> while it rings, and play the next note with finger 2 — the hand is re-centred without a gap.</p><p>The mic can tell if you re-struck the key: a clean run means the swap was silent.</p>`},
   {t:'song',title:'Swap on the long notes',html:`<p>Beats 1–3: hold with 3, swap to 1. Beat 4: play with 2.</p>`,text:T.subst,bpm:54,need:2},
   {t:'check',title:'Self-check',items:['The held note never re-sounded when I swapped','The swap was finished before the next note','My hand felt re-centred afterwards']}
  ]},
  {id:'3b.6',title:'Leaps',xp:50,steps:[
   {t:'read',title:'Land without looking',html:`<p>A <b>leap</b> is a jump of an octave or more. The secret is that the hand <b>travels as one block</b> and you feel the distance with your arm — your eyes should already be on the landing key.</p><p>Go slow, aim for the key's centre, relax at the landing. If you keep missing, shrink the speed, not the jump.</p>`},
   {t:'song',title:'LH octave leaps',text:T.leapLH,bpm:60,need:3},
   {t:'song',title:'RH octave leaps',text:T.leapRH,bpm:60,need:2},
   {t:'song',title:'Sixth leaps · LH',html:`<p>A smaller jump: a sixth. Thumb lands on A3 and E3.</p>`,text:T.leap6,bpm:60,need:2},
   {t:'check',title:'Self-check',items:['I looked at the landing key, not at my hand','No glancing down during the jumps']}
  ]},
  {id:'3b.7',title:'Song: Bridge Burner',xp:50,steps:[
   {t:'read',title:'Bridge Burner',html:`<p>An original rock riff that uses everything in this world. It opens with an <b>arpeggio</b> (C E G) and jumps a fifth, then the <b>pinky slide</b>: finger 5 plays G, then <b>slides</b> to the next key A with the same finger — no gap, no lift. Keep it relaxed.</p><p>It finishes on a hammering <b>D D C</b> that lands home.</p>`},
   {t:'song',title:'Right hand, slow',text:T.burner,bpm:70,need:1},
   {t:'song',title:'Right hand @ 90',text:T.burner,bpm:90,need:3},
   {t:'song',title:'First phrase, hands together',html:`<p>LH holds one note per bar: C, F, C, then G and C.</p>`,text:T.burnerHT,bpm:66,need:2}
  ]}],
  boss:{id:'B3b',title:'The Crossing Bridge',xp:200,boss:true,steps:[
   {t:'read',title:'👹 The Crossing Bridge',html:`<p>The bridge only holds if there is no gap where you cross. A scale in each hand, a leap, and Bridge Burner at 90.</p>`},
   {t:'check',title:'Form',items:['Wrist level through every crossing','Elbow gliding, no jerks','Fingers close to the keys']},
   {t:'song',title:'C major · RH',text:T.cRH,bpm:60,need:2},
   {t:'song',title:'C major · LH',text:T.cLH,bpm:60,need:2},
   {t:'song',title:'Octave leaps · LH',text:T.leapLH,bpm:60,need:1},
   {t:'check',title:'Leaps',items:['I did not look down during the leaps']},
   {t:'song',title:'Bridge Burner @ 90',text:T.burner,bpm:90,need:3}
  ]}};

WORLDS.splice(WORLDS.findIndex(w=>w.id===4),0,W3B);

export const W=id=>WORLDS.find(w=>w.id===id);

// ---------- World 2: hands apart, interval ears ----------
W(2).quests.push(
  {id:'2.8',title:'Hands apart',xp:50,steps:[
   {t:'read',title:'Two hands, two jobs',html:`<p>So far both hands moved together. Now the <b>left hand keeps a steady pulse</b> on C3 while the right hand plays its own rhythm — long notes, short notes, different places.</p><p>The classic fault is the left hand “echoing” the right. Start the LH <b>first</b>, count out loud, and let the RH join. If it falls apart, drop the tempo, not the pulse.</p>`},
   {t:'song',title:'Steady LH, moving RH',html:`<p>LH: C3 on every beat (finger 5). RH: halves and quarters.</p>`,text:T.indep,bpm:54,need:1},
   {t:'song',title:'Hands apart @ 60',text:T.indep,bpm:60,need:2},
   {t:'song',title:'Hands apart @ 72',text:T.indep,bpm:72,need:2}
  ]},
  {id:'2.9',title:'Hear the distance',xp:50,steps:[
   {t:'read',title:'Four distances',html:`<p>Learn to <b>hear</b> intervals, not just read them.</p><p><b>2nd</b>: neighbours, like the first two notes of Ode to Joy's “D C”. <b>3rd</b>: C to E, the first leap of Rapid Fire. <b>5th</b>: C to G, wide and open — the power-chord interval. <b>Octave</b>: the same note name, higher.</p><p>Hum the first note, then the second. If you can sing it, you can find it.</p>`},
   {t:'quiz',title:'Interval ear · 8 of 10',kind:'earint',n:10,pass:8}
  ]});

W(2).boss.steps.push({t:'song',title:'Hands apart',text:T.indep,bpm:72,need:1});

// ---------- World 3: sixteenths, syncopation ----------
W(3).quests.push(
  {id:'3.8',title:'Sixteenth notes',xp:50,steps:[
   {t:'read',title:'Four per beat',html:`<p>A <b>sixteenth note</b> is a quarter of a beat: two flags (or a double beam). Four fit in one beat, counted <b>1 e & a</b>.</p><p>Think of them as eighths cut in half. Clap first, then play. Keep the fingers light and close to the keys, small and fast.</p><p>Triplets (three in a beat, counted 1-trip-let) are covered with your chat teacher, because the app cannot write them yet.</p>`},
   {t:'quiz',title:'Count it',kind:'mc',pass:4,items:RHY16},
   {t:'song',title:'Sixteenths, slowly',html:`<p>Count “1 e & a” out loud on the busy beats.</p>`,text:T.sixteen,bpm:54,need:1},
   {t:'song',title:'Sixteenths @ 66',text:T.sixteen,bpm:66,need:2}
  ]},
  {id:'3.9',title:'Syncopation',xp:50,steps:[
   {t:'read',title:'Off the beat',html:`<p><b>Syncopation</b> puts the accent where you do not expect it: a note starts <b>on the “&”</b> and is held across the next beat. Your foot keeps tapping the pulse while the music dances around it.</p><p>Count the first bar: <b>1 2 & (3) & 4</b> — a note on 1, on 2, on the “&” of 2 (held through 3), on the “&” of 3, and on 4.</p>`},
   {t:'quiz',title:'Count it',kind:'mc',pass:2,items:[
     {q:'How do you count this bar?',score:'C4 E4e G4 E4e C4',opts:['1 2 & (3) & 4','1 2 3 4','1 & 2 & 3 & 4','1 2 & 3 & 4'],a:'1 2 & (3) & 4'},
     mc('Syncopation means…',['Accents land off the beat','Everything is staccato','The tempo changes','Both hands play the same notes'],'Accents land off the beat'),
     mc('A note on the “&” held over beat 3: you play…',['On the “&”, nothing on 3','On 3 as well','Twice','Only on 4'],'On the “&”, nothing on 3')]},
   {t:'song',title:'Syncopation, slowly',html:`<p>Tap your foot on every beat. Land the held notes on the “&”.</p>`,text:T.synco,bpm:56,need:1},
   {t:'song',title:'Syncopation @ 70',text:T.synco,bpm:70,need:3}
  ]});

W(3).boss.steps.push({t:'quiz',title:'Count with sixteenths',kind:'mc',pass:3,items:RHY16.slice(0,4)});

// ---------- World 4: dominant 7th, progressions, improvisation, key signatures ----------
W(4).quests.push(
  {id:'4.8',title:'Dominant 7th',xp:50,steps:[
   {t:'read',title:'The chord that wants to move',html:`<p>Add one more third on top of a triad and you get a <b>seventh chord</b>. On the fifth note of the scale: <b>G B D F</b> is <b>G7</b>, the <b>dominant 7th</b>.</p><p>It sounds unfinished — the F pulls down to E and the B pulls up to C. Resolve it to C and the music relaxes: <b>V7 → I</b>.</p><p>Fingering: LH 5 3 2 1; RH 1 2 3 5.</p>`,kb:{from:'G2',to:'G3',marks:{G2:'5',B2:'3',D3:'2',F3:'1'}}},
   {t:'quiz',title:'Spell it',kind:'mc',pass:3,items:[
     mc('G7 contains…',['G B D F','G B D E','G C D F','G B E F'],'G B D F'),
     mc('G7 resolves to…',['C','D','A minor','F'],'C'),
     mc('In G7, the “7th” note is…',['F','E','A','C'],'F'),
     mc('Listen: which chord is this?',['Dominant 7th (G7)','C major','A minor','G minor'],'Dominant 7th (G7)',{play:[N('G3'),N('B3'),N('D4'),N('F4')]})]},
   {t:'song',title:'V7 → I · LH',text:T.v7LH,bpm:56,need:2},
   {t:'song',title:'V7 → I · RH',html:`<p>RH voicing: B D F G, then C E G. The hand barely moves.</p>`,text:T.v7RH,bpm:56,need:2}
  ]},
  {id:'4.9',title:'Chord progressions',xp:50,steps:[
   {t:'read',title:'I – V – vi – IV',html:`<p>Four chords carry thousands of songs: <b>I – V – vi – IV</b>. In C that is <b>C – G – Am – F</b>. In G: G – D – Em – C. In F: F – C – Dm – B♭.</p><p>Read the chord symbols, then play each as a block (all notes together), one per bar. When that is smooth, try a <b>root–fifth</b> pattern: bottom note, fifth above, repeat.</p>`},
   {t:'song',title:'C – G – Am – F · block chords',text:T.progC,bpm:60,need:1},
   {t:'song',title:'C – G – Am – F @ 72',text:T.progC,bpm:72,need:2},
   {t:'song',title:'Root–fifth pattern',html:`<p>Same four chords. Root with 5, fifth above with 1.</p>`,text:T.progRoot,bpm:72,need:2},
   {t:'song',title:'G – D – Em – C',text:T.progG,bpm:60,need:1,key:'G'},
   {t:'song',title:'F – C – Dm – B♭',text:T.progF,bpm:60,need:1,key:'F'}
  ]},
  {id:'4.10',title:'Improv playground',xp:50,steps:[
   {t:'read',title:'Five notes that cannot clash',html:`<p>The <b>pentatonic scale</b> has five notes: <b>C D E G A</b>. It has no half steps, so any combination sounds good — that is why it is the first scale for improvising.</p><p>Build a phrase like a question and an answer: two bars that go up and pause (question), two that come down and land on <b>C</b> (answer). Repeat a short idea instead of wandering.</p><p>Turn the keyboard's accompaniment off; the mic would pick it up.</p>`,kb:{from:'C4',to:'C5',marks:{C4:'C',D4:'D',E4:'E',G4:'G',A4:'A',C5:'C'}}},
   {t:'improv',title:'Stay on the five keys',html:`<p>Play any 16 notes, any rhythm, using only <b>C D E G A</b> (any octave). Up to 2 slips are allowed.</p>`,pcs:[0,2,4,7,9],need:16,maxBad:2},
   {t:'check',title:'Your phrase',items:['I played a 4-bar phrase that sounded finished','It ended on C','I repeated one short idea instead of wandering'],achOnDone:'jam'}
  ]},
  {id:'4.11',title:'Key signatures & the circle of fifths',xp:50,steps:[
   {t:'read',title:'Sharps and flats, in order',html:`<p>Sharps appear in the order <b>F C G D A E B</b>; flats in the reverse order <b>B E A D G C F</b>.</p><p>Walk up in fifths and each key adds one sharp: <b>C (none) → G (1♯) → D (2♯) → A (3♯) → E (4♯)</b>. Walk down in fifths and each adds a flat: <b>C → F (1♭) → B♭ (2♭) → E♭ (3♭) → A♭ (4♭)</b>. That ring of keys is the <b>circle of fifths</b>.</p><p>Quick trick for flat keys: the key is the <b>second-to-last flat</b>. Two flats B♭ E♭ → the key is B♭.</p>`},
   {t:'quiz',title:'Name the key',kind:'mc',pass:6,items:[
     {q:'Which major key?',score:'D4 E4 F#4 G4',key:'D',opts:['D major','G major','F major','C major'],a:'D major'},
     {q:'Which major key?',score:'F4 G4 A4 Bb4',key:'F',opts:['F major','G major','D major','C major'],a:'F major'},
     {q:'Which major key?',score:'G4 A4 B4 C5',key:'G',opts:['G major','D major','F major','C major'],a:'G major'},
     mc('Key with 2 sharps',['D major','G major','A major','B♭ major'],'D major'),
     mc('Key with 2 flats',['B♭ major','F major','E♭ major','D major'],'B♭ major'),
     mc('Order of the sharps',['F C G D A E B','B E A D G C F','C D E F G A B','G D A E B F C'],'F C G D A E B'),
     mc('Key with no sharps or flats',['C major','F major','G major','A minor only'],'C major'),
     mc('One step along the circle of fifths from G (adding a sharp)',['D major','C major','A major','F major'],'D major')]}
  ]});

W(4).boss.steps.push(
  {t:'song',title:'I – V – vi – IV in C',text:T.progC,bpm:72,need:1},
  {t:'improv',title:'Improvise',html:`<p>16 notes from C D E G A. Make it sound finished.</p>`,pcs:[0,2,4,7,9],need:16,maxBad:2});

// ---------- World 5: seventh chords, lead sheets, more key signatures ----------
W(5).quests.push(
  {id:'5.8',title:'Seventh chords',xp:50,steps:[
   {t:'read',title:'Three flavours',html:`<p>Stack a triad plus one more third and the top note decides the colour:</p><p><b>Cmaj7</b> = C E G <b>B</b> — dreamy. <b>Cm7</b> = C E♭ G <b>B♭</b> — mellow. <b>C7</b> (dominant) = C E G <b>B♭</b> — bluesy, wants to move.</p><p>The same recipe works on any root: F maj7 = F A C E; D m7 = D F A C; G7 = G B D F.</p>`},
   {t:'quiz',title:'Spell it',kind:'mc',pass:4,items:[
     mc('Cmaj7',['C E G B','C E G B♭','C E♭ G B♭','C E G A'],'C E G B'),
     mc('C7',['C E G B♭','C E G B','C E♭ G B♭','C F G B♭'],'C E G B♭'),
     mc('Dm7',['D F A C','D F♯ A C','D F A B','D F A C♯'],'D F A C'),
     mc('Fmaj7',['F A C E','F A C E♭','F A♭ C E♭','F G C E'],'F A C E'),
     mc('G7',['G B D F','G B D F♯','G B♭ D F','G B D E'],'G B D F')]},
   {t:'quiz',title:'Chord ear · 5 of 8',kind:'earchord',n:8,pass:5},
   {t:'song',title:'ii – V – I with 7ths · LH',html:`<p>Dm7 – G7 – Cmaj7. LH fingers 5 3 2 1.</p>`,text:T.iiVI,bpm:56,need:1},
   {t:'song',title:'ii – V – I @ 66',text:T.iiVI,bpm:66,need:2}
  ]},
  {id:'5.9',title:'Lead-sheet playing',xp:50,steps:[
   {t:'read',title:'Melody plus chord symbols',html:`<p>A <b>lead sheet</b> is the melody with chord symbols above it. You decide how to play the chords.</p><p>Thunder Steps as a lead sheet: <b>C | C | G | G | C | F | C | C</b>. First try block chords in the LH. Then try the root–fifth pattern.</p><p>The most important lead-sheet skill: <b>keep going</b>. If you slip, do not stop or go back — find the next beat and carry on.</p>`},
   {t:'song',title:'Block chords',text:T.maryLead,bpm:60,need:1},
   {t:'song',title:'Root–fifth pattern',text:T.maryRootHT,bpm:66,need:1},
   {t:'song',title:'Lead sheet @ 70, no stopping',text:T.maryRootHT,bpm:70,need:2},
   {t:'check',title:'Keep going',items:['I kept the beat going through a slip, without stopping']}
  ]},
  {id:'5.10',title:'More keys',xp:50,steps:[
   {t:'read',title:'Three sharps, three flats',html:`<p>Continue the circle: <b>A major</b> has 3 sharps (F♯ C♯ G♯); <b>E major</b> has 4 (F♯ C♯ G♯ D♯). On the flat side: <b>E♭ major</b> has 3 flats (B♭ E♭ A♭).</p><p>Each major key's <b>relative minor</b> shares its signature: A major ↔ F♯ minor, E♭ major ↔ C minor.</p><p>Practise on a keyboard: find the scale of A major (A B C♯ D E F♯ G♯ A) and of E♭ major (E♭ F G A♭ B♭ C D E♭), slowly, one hand at a time. The app does not draw these signatures yet.</p>`},
   {t:'quiz',title:'Name them',kind:'mc',pass:5,items:[
     mc('A major has…',['3 sharps','2 sharps','3 flats','4 sharps'],'3 sharps'),
     mc('E♭ major has…',['3 flats','2 flats','3 sharps','4 flats'],'3 flats'),
     mc('Sharps in A major',['F♯ C♯ G♯','F♯ C♯','F♯ C♯ G♯ D♯','B♭ E♭ A♭'],'F♯ C♯ G♯'),
     mc('E major has…',['4 sharps','3 sharps','4 flats','1 sharp'],'4 sharps'),
     mc('Relative minor of E♭ major',['C minor','E♭ minor','A minor','G minor'],'C minor'),
     mc('Flats in E♭ major',['B♭ E♭ A♭','B♭ E♭','B♭ E♭ A♭ D♭','F♯ C♯ G♯'],'B♭ E♭ A♭')]}
  ]});

W(5).boss.steps.push({t:'song',title:'Lead sheet · Thunder Steps',text:T.maryRootHT,bpm:70,need:1});

// ---------- World 6: memory and performance ----------
W(6).quests.push(
  {id:'6.7',title:'Play from memory',xp:50,steps:[
   {t:'read',title:'Memory is a skill',html:`<p>Memorise in layers: <b>hands separately from memory</b>, then together, one small section at a time. Learn the <b>shape and harmony</b>, not just the finger order. Start from the <b>middle</b> of the piece as well as the beginning, so a slip in the middle does not erase the ending.</p><p>Look at the first bar, then look away and play it. Add one bar at a time.</p>`},
   {t:'song',title:'Warm up: Minuet part A, RH',text:T.minA_R,bpm:72,need:1,...MG},
   {t:'check',title:'From memory',items:['I played the Minuet part A (RH, LH, then together) with the music closed','I knew where I was in the piece at all times','I can start from the middle of part A']}
  ]},
  {id:'6.8',title:'First performance',xp:50,steps:[
   {t:'read',title:'Play for someone',html:`<p>A piece only becomes yours when you play it for another person. A friend, family, or a recording you send. The goal is not a perfect take; it is to <b>keep going</b>.</p><p>Pick a piece you can play clean at a comfortable tempo. Take one slow breath, count the first bar in your head, and play.</p>`},
   {t:'quiz',title:'On stage',kind:'mc',pass:3,items:[
     mc('You slip in the middle. You…',['Keep going with the beat','Stop and restart','Apologise and quit','Play faster'],'Keep going with the beat'),
     mc('Under pressure the tempo usually…',['Speeds up','Slows down a lot','Stays exactly the same','Disappears'],'Speeds up'),
     mc('Best preparation:',['Play it for someone in advance','Practise it only alone','Avoid thinking about it','Play it faster'],'Play it for someone in advance')]},
   {t:'check',title:'Do it',items:['I played a whole piece for a real listener (live or a recording I sent)','I kept going through a slip','I noticed what changed under pressure (tempo, shaky hands, breathing)']}
  ]});

W(6).boss.steps.push({t:'check',title:'From memory',items:['I played the Minuet (part A at least) from memory, music closed']});

export const ALL_WORLD_NAMES=['Tutorial Island','Middle C Meadows','Grand Staff Grove','Rhythm Rapids','Scale Summit','Harmony Harbor','Classic Castle','Expression Peaks'];

export const NUMW=WORLDS.filter(w=>!w.noRank).length; // numbered worlds (3b is a bonus world between 3 and 4)

export const LOCKED_WORLDS=ALL_WORLD_NAMES.slice(NUMW);
