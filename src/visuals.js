// Looping animated diagrams for lessons (SVG + SMIL, no files to load, work offline).
// A step shows one with `vis:'name'`. Tap a diagram to pause / resume it.
import { N, isWhite } from './notation.js';

const GOLD = '#e2a83b', ORANGE = '#f08a4b', IVORY = '#f7f4ee', EBONY = '#1a1622', INK = '#2b2733', MUTE = '#a49fb8', GOOD = '#5fcf8f';
const FONT = '-apple-system,Segoe UI,sans-serif';
const W = 340;

const anim = (attr, values, keyTimes, dur, extra = '') =>
  `<animate attributeName="${attr}" values="${values.join(';')}" keyTimes="${keyTimes.map(k => +k.toFixed(4)).join(';')}" dur="${dur}s" repeatCount="indefinite" calcMode="discrete" ${extra}/>`;

// colour of an element that lights up for [start, start+len) seconds of a D-second loop
function blink(base, on, start, len, D) {
  const e = Math.min(start + len, D - 0.001);
  return start <= 0
    ? anim('fill', [on, base], [0, e / D], D)
    : anim('fill', [base, on, base], [0, start / D, e / D], D);
}
// opacity 0/1 window
function show(start, len, D) {
  const e = Math.min(start + len, D - 0.001);
  return start <= 0
    ? anim('opacity', [1, 0], [0, e / D], D)
    : anim('opacity', [0, 1, 0], [0, start / D, e / D], D);
}
const text = (x, y, s, size = 12, fill = MUTE, weight = 700, anchor = 'middle', anim = '') =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${fill}" font-family="${FONT}"${anim ? ' opacity="0"' : ''}>${s}${anim}</text>`;

// keyboard geometry for from..to (note names). Returns draw helpers.
function geom(fromName, toName, H = 88) {
  const from = N(fromName), to = N(toName), whites = [];
  for (let m = from; m <= to; m++) if (isWhite(m)) whites.push(m);
  const ww = W / whites.length, bw = ww * 0.6, bh = H * 0.62;
  const wx = m => whites.indexOf(m) * ww;
  const cx = m => (isWhite(m) ? wx(m) + ww / 2 : wx(m - 1) + ww);
  const blacks = [];
  for (let m = from; m < to; m++) if (isWhite(m) && !isWhite(m + 1)) blacks.push(m + 1);
  return { from, to, whites, blacks, ww, bw, bh, H, wx, cx };
}

// draws the base keyboard; `lit` maps midi -> [start,len] to light that key in the loop of D seconds
function keyboard(g, lit = {}, D = 4, colorOn = GOLD, colorOnBlack = ORANGE) {
  let o = '';
  g.whites.forEach(m => {
    const l = lit[m];
    o += `<rect x="${g.wx(m) + 0.5}" y="0.5" width="${g.ww - 1}" height="${g.H}" rx="${Math.min(4, g.ww * 0.15)}" fill="${IVORY}" stroke="${INK}">${l ? blink(IVORY, colorOn, l[0], l[1], D) : ''}</rect>`;
  });
  g.blacks.forEach(m => {
    const l = lit[m];
    o += `<rect x="${g.cx(m) - g.bw / 2}" y="0.5" width="${g.bw}" height="${g.bh}" rx="2" fill="${EBONY}">${l ? blink(EBONY, colorOnBlack, l[0], l[1], D) : ''}</rect>`;
  });
  return o;
}

const wrap = (h, body, label) =>
  `<div class="vis" role="img" aria-label="${label}"><svg viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg">${body}</svg><div class="vis-cap">▶ tap to pause</div></div>`;

// ---------- the diagrams ----------

// finger numbers / notes played in order on a keyboard: seq = [[noteName, label], ...]
function sequence(from, to, seq, step, cap, extra = null) {
  const g = geom(from, to), D = seq.length * step + step;
  const lit = {};
  seq.forEach(([n], i) => { lit[N(n)] = [i * step, step * 0.9]; });
  let o = keyboard(g, lit, D);
  seq.forEach(([n, lab], i) => {
    const m = N(n), black = !isWhite(m);
    o += text(g.cx(m), black ? g.bh - 5 : g.H - 8, lab, Math.max(11, Math.min(20, g.ww * 0.5)), '#221a05', 800, 'middle', show(i * step, step * 0.9, D));
  });
  if (extra) o += extra(g, D, step);
  return wrap(g.H + (extra ? 64 : 10), o, cap);
}


// ----- drawn hand over a keyboard: fingers press in turn, hand shifts, thumb tucks -----
const SKIN = '#e8bd98', SKIN_EDGE = '#b98a62', NAIL = '#f6dccb';
// toggles a translate between two values; wins = [[start,len],...] inside a D-second loop
function tAnim(wins, D, on, off = '0 0') {
  const ev = [];
  wins.slice().sort((a, b) => a[0] - b[0]).forEach(([st, ln]) => { ev.push([st, on]); ev.push([Math.min(st + ln, D - 0.001), off]); });
  const vals = [], keys = [];
  if (!ev.length || ev[0][0] > 0) { vals.push(off); keys.push(0); }
  ev.forEach(([t, v]) => { if (vals.length && vals[vals.length - 1] === v && keys[keys.length - 1] === t) return; vals.push(v); keys.push(t / D); });
  return `<animateTransform attributeName="transform" type="translate" values="${vals.join(';')}" keyTimes="${keys.map(k => +k.toFixed(4)).join(';')}" dur="${D}s" repeatCount="indefinite" calcMode="discrete"/>`;
}
// piecewise-constant translate from per-entry values [[t, 'x y'], ...]
function stepAnim(pts, D) {
  const vals = [], keys = [];
  pts.forEach(([t, v]) => { if (vals.length && vals[vals.length - 1] === v) return; vals.push(v); keys.push(t / D); });
  keys[0] = 0;
  return `<animateTransform attributeName="transform" type="translate" values="${vals.join(';')}" keyTimes="${keys.map(k => +k.toFixed(4)).join(';')}" dur="${D}s" repeatCount="indefinite" calcMode="discrete"/>`;
}

// opt: from,to (keyboard), hand 'R'|'L', anchor (white-key index of the thumb's key for RH, of the pinky's key for LH),
// entries: [{n:'C4', f:1, t, len, shift (white keys), tOff (white keys, thumb only)}], step, cap, extra(g,D,step)
function handOn(opt) {
  const H = 110, g = geom(opt.from, opt.to, H), step = opt.step || 0.8;
  const E = opt.entries.map((e, i) => ({ t: i * step, len: step * 0.9, shift: 0, tOff: 0, ...e }));
  const D = Math.max(...E.map(e => e.t + e.len)) + step;
  const lit = {};
  E.forEach(e => { lit[N(e.n)] = [e.t, e.len]; });
  let o = keyboard(g, lit, D);
  const fw = Math.min(g.ww * 0.66, 30), ww = g.ww;
  const xf = f => (opt.anchor + (opt.hand === 'R' ? f - 1 : 5 - f)) * ww + ww / 2;
  const tip = { 1: 70, 2: 36, 3: 28, 4: 36, 5: 50 }, top = { 1: 96, 2: 80, 3: 78, 4: 80, 5: 86 };
  const xs = [1, 2, 3, 4, 5].map(xf), pl = Math.min(...xs) - fw / 2 - 2, pr = Math.max(...xs) + fw / 2 + 2;
  const shiftPts = E.map(e => [e.t, `${e.shift * ww} 0`]);
  o += `<g>${stepAnim(shiftPts, D)}`;
  // palm + wrist
  o += `<path d="M${pl} 86 Q${pl} 76 ${pl + 12} 76 L${pr - 12} 76 Q${pr} 76 ${pr} 86 L${pr - 6} ${H + 22} L${pl + 6} ${H + 22} Z" fill="${SKIN}" stroke="${SKIN_EDGE}" stroke-width="1.5"/>`;
  [1, 2, 3, 4, 5].forEach(f => {
    const x = xf(f), wins = E.filter(e => e.f === f).map(e => [e.t, e.len]);
    const dip = wins.length ? tAnim(wins, D, '0 8') : '';
    const body = `<line x1="${x}" y1="${top[f]}" x2="${x}" y2="${tip[f]}" stroke="${SKIN_EDGE}" stroke-width="${fw + 3}" stroke-linecap="round"/>`
      + `<line x1="${x}" y1="${top[f]}" x2="${x}" y2="${tip[f]}" stroke="${SKIN}" stroke-width="${fw}" stroke-linecap="round"/>`
      + `<ellipse cx="${x}" cy="${tip[f] - 3}" rx="${fw * 0.34}" ry="${fw * 0.4}" fill="${NAIL}" stroke="${SKIN_EDGE}" stroke-width="0.8"/>`
      + text(x, tip[f] + 2, String(f), Math.max(11, Math.min(16, fw * 0.5)), '#6b4a2a', 800);
    const inner = `<g>${dip}${body}</g>`;
    if (f === 1 && E.some(e => e.tOff)) {
      const pts = E.map(e => [e.t, `${e.tOff * ww} ${e.tOff ? -4 : 0}`]);
      o += `<g>${stepAnim(pts, D)}${inner}</g>`;
    } else o += inner;
  });
  o += '</g>';
  if (opt.extra) o += opt.extra(g, D, step);
  return wrap(H + (opt.extra ? 70 : 28), o, opt.cap);
}
const arrow = (g, a, b, t, len, D, label, y0 = 118) => {
  const xa = g.cx(N(a)), xb = g.cx(N(b));
  return `<path d="M${xa} ${y0} C ${xa} ${y0 + 26}, ${xb} ${y0 + 26}, ${xb} ${y0}" fill="none" stroke="${GOOD}" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 4" opacity="0">${show(t, len, D)}</path>`
    + text((xa + xb) / 2, y0 + 44, label, 12, GOOD, 800, 'middle', show(t, len, D));
};

const VIS = {
  // Where the black keys are: groups of 2 and 3 -> C and F
  blackkeys() {
    const g = geom('C4', 'B4', 96), D = 6;
    const lit = {};
    // group of 2 (C#, D#) for 0-2s, group of 3 (F#, G#, A#) for 3-5s
    [N('C#4'), N('D#4')].forEach(m => { lit[m] = [0, 2.6]; });
    [N('F#4'), N('G#4'), N('A#4')].forEach(m => { lit[m] = [3, 2.6]; });
    lit[N('C4')] = [1, 1.6]; lit[N('F4')] = [4, 1.6];
    let o = keyboard(g, lit, D);
    o += text(g.cx(N('C#4')) + g.ww / 2, g.H + 20, 'group of 2', 13, ORANGE, 800, 'middle', show(0, 2.6, D));
    o += text(g.cx(N('G#4')), g.H + 20, 'group of 3', 13, ORANGE, 800, 'middle', show(3, 2.6, D));
    o += text(g.cx(N('C4')), g.H - 8, 'C', 18, '#221a05', 800, 'middle', show(1, 1.6, D));
    o += text(g.cx(N('F4')), g.H - 8, 'F', 18, '#221a05', 800, 'middle', show(4, 1.6, D));
    return wrap(g.H + 30, o, 'Black keys come in groups of 2 and 3. C is left of the group of 2, F is left of the group of 3.');
  },

  // Five-finger position: thumb to pinky across C D E F G
  fivefinger() {
    return handOn({ from: 'C4', to: 'G4', hand: 'R', anchor: 0, step: 0.8, cap: 'Right hand five-finger position: fingers 1 to 5 press C D E F G in turn.',
      entries: [['C4', 1], ['D4', 2], ['E4', 3], ['F4', 4], ['G4', 5]].map(([n, f]) => ({ n, f })) });
  },
  fivefingerLH() {
    return handOn({ from: 'C3', to: 'G3', hand: 'L', anchor: 0, step: 0.8, cap: 'Left hand five-finger position: fingers 5 to 1 press C D E F G in turn.',
      entries: [['C3', 5], ['D3', 4], ['E3', 3], ['F3', 2], ['G3', 1]].map(([n, f]) => ({ n, f })) });
  },

  // Side view of a relaxed curved hand, dropping its weight into a key
  hand() {
    const D = 2.6, dip = `<animateTransform attributeName="transform" type="translate" values="0 0;0 5;0 0" keyTimes="0;0.4;1" dur="${D}s" repeatCount="indefinite"/>`;
    let o = '';
    o += `<rect x="30" y="110" width="118" height="44" rx="5" fill="${IVORY}" stroke="${INK}"/>`;
    o += `<rect x="154" y="110" width="132" height="44" rx="5" fill="${IVORY}" stroke="${INK}"><animate attributeName="y" values="110;114;110" keyTimes="0;0.4;1" dur="${D}s" repeatCount="indefinite"/></rect>`;
    o += `<g>${dip}`;
    // sleeve + forearm, level
    o += `<path d="M6 44 L52 44 L52 80 L6 82 Z" fill="#4c2234"/>`;
    o += `<path d="M52 46 L118 48 C 142 48 156 52 160 64 L156 84 C 150 90 130 90 112 88 L52 80 Z" fill="${SKIN}" stroke="${SKIN_EDGE}" stroke-width="1.5"/>`;
    // back finger (depth) and front finger, two segments each, curved
    o += `<path d="M150 62 C 176 54, 196 66, 202 92" fill="none" stroke="#d3aa86" stroke-width="15" stroke-linecap="round"/>`;
    o += `<path d="M158 70 C 186 62, 208 76, 214 106" fill="none" stroke="${SKIN_EDGE}" stroke-width="18" stroke-linecap="round"/>`;
    o += `<path d="M158 70 C 186 62, 208 76, 214 106" fill="none" stroke="${SKIN}" stroke-width="15" stroke-linecap="round"/>`;
    o += `<ellipse cx="214" cy="104" rx="6" ry="5" fill="${NAIL}" opacity="0.0"/>`;
    o += `<circle cx="214" cy="106" r="7.5" fill="${GOLD}" opacity="0.9"/>`;
    o += `<circle cx="158" cy="68" r="4.5" fill="${SKIN_EDGE}"/>`;
    o += `</g>`;
    // coin balanced on the back of the hand
    o += `<ellipse cx="108" cy="42" rx="12" ry="3.6" fill="${GOLD}" stroke="#8a6a1f"><animateTransform attributeName="transform" type="translate" values="0 0;0 5;0 0" keyTimes="0;0.4;1" dur="${D}s" repeatCount="indefinite"/></ellipse>`;
    // labels with leader lines
    o += `<line x1="108" y1="32" x2="108" y2="22" stroke="${MUTE}"/>` + text(108, 14, 'wrist level · coin stays put', 12, '#6b5a4a', 800);
    o += `<line x1="160" y1="60" x2="196" y2="30" stroke="${MUTE}"/>` + text(200, 28, 'knuckle bridge up', 12, '#6b5a4a', 800, 'start');
    o += `<line x1="216" y1="112" x2="238" y2="128" stroke="${MUTE}"/>` + text(236, 134, 'fingertip lands', 12, '#8a5a00', 800, 'start');
    o += text(40, 150, 'weight drops in', 12, '#6b5a4a', 700, 'start');
    return wrap(160, o, 'Side view of a relaxed, curved hand with a level wrist, dropping its weight into one key.');
  },

  // Seated posture, side view
  posture() {
    const D = 8;
    let o = '';
    o += `<rect x="0" y="176" width="${W}" height="6" fill="#cdb7b2"/>`; // floor
    o += `<rect x="248" y="104" width="86" height="8" rx="3" fill="${INK}"/><rect x="262" y="112" width="6" height="64" fill="${INK}"/><rect x="316" y="112" width="6" height="64" fill="${INK}"/>`; // keyboard on a stand
    o += `<rect x="78" y="122" width="62" height="7" rx="3" fill="#8a6a4a"/><rect x="84" y="129" width="6" height="47" fill="#8a6a4a"/>`; // seat
    // body: head, torso, upper arm, forearm (level), thigh, shin, foot
    o += `<circle cx="112" cy="26" r="14" fill="${SKIN}" stroke="${SKIN_EDGE}" stroke-width="1.5"/>`;
    o += `<path d="M112 42 L112 118" stroke="#4c2234" stroke-width="22" stroke-linecap="round"/>`;
    o += `<path d="M112 60 L128 92" stroke="#6a3550" stroke-width="10" stroke-linecap="round"/>`;
    o += `<path d="M128 92 L238 100" stroke="${SKIN}" stroke-width="9" stroke-linecap="round"/>`;
    o += `<path d="M116 122 L190 122" stroke="#3a3a52" stroke-width="13" stroke-linecap="round"/>`;
    o += `<path d="M190 122 L190 168" stroke="#3a3a52" stroke-width="12" stroke-linecap="round"/>`;
    o += `<path d="M190 172 L210 172" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>`;
    const tags = [
      [0, 'shoulders down · neck long', 120, 8, 'start', 140, 22],
      [2, 'elbow ≈ key height', 150, 82, 'start', 150, 90],
      [4, 'front half of the seat', 20, 150, 'start', 82, 126],
      [6, 'feet flat on the floor', 150, 192, 'start', 196, 172]
    ];
    tags.forEach(([t, lab, x, y, anc, lx, ly]) => {
      o += `<circle cx="${lx}" cy="${ly}" r="6" fill="none" stroke="${GOLD}" stroke-width="3" opacity="0">${show(t, 2, D)}</circle>`;
      o += text(x, y, lab, 13, '#8a5a00', 800, anc, show(t, 2, D));
    });
    return wrap(186, o, 'Side view of a seated pianist: shoulders down, forearm level with the keys at elbow height, sitting on the front half of the seat, feet flat.');
  },

  // Steady pulse: pendulum swinging once per second (60 bpm) and four beat dots
  pulse() {
    const D = 4;
    let o = `<line x1="170" y1="130" x2="170" y2="20" stroke="${MUTE}" stroke-width="5" stroke-linecap="round">
      <animateTransform attributeName="transform" type="rotate" values="-26 170 130;26 170 130;-26 170 130" keyTimes="0;0.5;1" dur="2s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/></line>`;
    o += `<circle cx="170" cy="130" r="9" fill="${INK}"/>`;
    o += `<rect x="150" y="128" width="40" height="22" rx="5" fill="${INK}"/>`;
    [1, 2, 3, 4].forEach((b, i) => {
      const x = 60 + i * 74;
      o += `<circle cx="${x}" cy="176" r="14" fill="#4c2234" stroke="${INK}">${blink('#4c2234', i === 0 ? '#fff' : GOLD, i, 0.5, D)}</circle>`;
      o += text(x, 181, String(b), 14, '#221a05', 800, 'middle', show(i, 0.5, D));
    });
    o += text(170, 214, 'one swing = one beat = one note at 60 bpm', 12, MUTE, 700);
    return wrap(224, o, 'A metronome swinging once per second while four beat dots light in turn.');
  },

  // Note values: whole, half and quarter against a four-beat bar with a moving playhead
  values() {
    const D = 4, x0 = 40, bw = 270, bh = 26;
    const rows = [['Whole', 4, 'lasts 4'], ['Half', 2, 'lasts 2'], ['Quarter', 1, 'lasts 1']];
    let o = '';
    rows.forEach(([name, beats, lab], r) => {
      const y = 14 + r * 46, n = 4 / beats, w = bw / n;
      for (let i = 0; i < n; i++) {
        o += `<rect x="${x0 + i * w + 1}" y="${y}" width="${w - 2}" height="${bh}" rx="5" fill="#4c2234" stroke="${INK}">${blink('#4c2234', r === 0 ? GOLD : r === 1 ? ORANGE : GOOD, i * beats, 0.35, D)}</rect>`;
        o += text(x0 + i * w + w / 2, y + 18, beats === 4 ? 'whole' : beats === 2 ? 'half' : 'quarter', 11, IVORY, 800);
      }
      o += text(2, y + 18, '', 10, MUTE, 700, 'start');
    });
    // beat numbers + playhead
    [1, 2, 3, 4].forEach((b, i) => { o += text(x0 + i * (bw / 4) + bw / 8, 156, String(b), 14, MUTE, 800); });
    o += `<line x1="${x0}" x2="${x0}" y1="6" y2="146" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><animate attributeName="x1" values="${x0};${x0 + bw}" dur="${D}s" repeatCount="indefinite"/><animate attributeName="x2" values="${x0};${x0 + bw}" dur="${D}s" repeatCount="indefinite"/></line>`;
    o += text(170, 178, 'count 1-2-3-4 and play when the bar lights up', 12, MUTE, 700);
    return wrap(186, o, 'A four-beat bar: one whole note, two half notes or four quarter notes, with a moving playhead.');
  },

  // A triad: skip a key, play, skip a key, play — all three sound together
  triad() {
    return handOn({ from: 'C4', to: 'B4', hand: 'R', anchor: 0, step: 1.2, cap: 'A triad built by skipping a key between each note: C, E, G, played with fingers 1, 3 and 5.',
      entries: [{ n: 'C4', f: 1, t: 0, len: 4.4 }, { n: 'E4', f: 3, t: 1.2, len: 3.2 }, { n: 'G4', f: 5, t: 2.4, len: 2.0 }],
      extra: (g, D) => text(g.cx(N('D4')), 150, 'skip', 12, GOLD, 800, 'middle', show(0.4, 1.2, D)) + text(g.cx(N('F4')), 150, 'skip', 12, GOLD, 800, 'middle', show(1.6, 1.2, D))
        + text(170, 170, 'root · 3rd · 5th = one chord', 13, '#6b5a4a', 700, 'middle', show(2.6, 2.4, D)) });
  },

  // Thumb-under going up (RH): 1 2 3 [thumb tucks] 1 2 3 4 5
  thumbunder() {
    const seq = [['C4', 1, 0, 0], ['D4', 2, 0, 0], ['E4', 3, 0, 2], ['F4', 1, 3, 0], ['G4', 2, 3, 0], ['A4', 3, 3, 0], ['B4', 4, 3, 0], ['C5', 5, 3, 0]];
    return handOn({ from: 'C4', to: 'C5', hand: 'R', anchor: 0, step: 0.9, cap: 'Right hand going up a scale: while finger 3 plays, the thumb tucks under so it is ready on F and the hand never stops.',
      entries: seq.map(([n, f, shift, tOff]) => ({ n, f, shift, tOff })),
      extra: (g, D) => arrow(g, 'E4', 'F4', 1.8, 0.9, D, 'thumb tucks under — early!') });
  },

  // Finger-over coming down (RH): 5 4 3 2 1 [3 crosses over]
  fingerover() {
    const seq = [['C5', 5, 3, 0], ['B4', 4, 3, 0], ['A4', 3, 3, 0], ['G4', 2, 3, 0], ['F4', 1, 3, 0], ['E4', 3, 0, 3], ['D4', 2, 0, 3], ['C4', 1, 0, 0]];
    return handOn({ from: 'C4', to: 'C5', hand: 'R', anchor: 0, step: 0.9, cap: 'Right hand coming down: after the thumb plays F, finger 3 crosses over it to E.',
      entries: seq.map(([n, f, shift, tOff]) => ({ n, f, shift, tOff })),
      extra: (g, D) => arrow(g, 'F4', 'E4', 4.5, 1.8, D, '3 crosses over the thumb') });
  },

  // Alberti bass: low - high - middle - high, wrist rocking (left hand)
  alberti() {
    const pat = [['C3', 5], ['G3', 1], ['E3', 3], ['G3', 1]];
    return handOn({ from: 'C3', to: 'G3', hand: 'L', anchor: 0, step: 0.5, cap: 'Alberti bass in the left hand: low, high, middle, high, repeating.',
      entries: [...pat, ...pat].map(([n, f]) => ({ n, f })) });
  },

  // Octave / leap: land on the right key without looking
  leap() {
    return sequence('C2', 'C4', [['C3', '5'], ['C2', '5'], ['C3', '5'], ['C2', '5']], 0.9, 'Left hand leaping by an octave from C3 down to C2 and back.');
  }
};

export const VIS_NAMES = Object.keys(VIS);
export function visualHtml(name) {
  const f = VIS[name];
  return f ? f() : '';
}

// tap a diagram to pause / resume
export function wireVisuals(root) {
  root.querySelectorAll('.vis').forEach(v => {
    const svg = v.querySelector('svg'), cap = v.querySelector('.vis-cap');
    if (!svg || !svg.pauseAnimations) return;
    let paused = false;
    v.onclick = () => {
      paused = !paused;
      if (paused) svg.pauseAnimations(); else svg.unpauseAnimations();
      cap.textContent = paused ? '⏸ paused — tap to play' : '▶ tap to pause';
    };
  });
}
