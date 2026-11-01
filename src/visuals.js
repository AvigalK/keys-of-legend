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
    return sequence('C4', 'G4', [['C4', '1'], ['D4', '2'], ['E4', '3'], ['F4', '4'], ['G4', '5']], 0.7, 'Right hand five-finger position: fingers 1 to 5 play C D E F G in turn.');
  },
  fivefingerLH() {
    return sequence('C3', 'G3', [['C3', '5'], ['D3', '4'], ['E3', '3'], ['F3', '2'], ['G3', '1']], 0.7, 'Left hand five-finger position: fingers 5 to 1 play C D E F G in turn.');
  },

  // Side view of a relaxed curved hand, dropping its weight into a key
  hand() {
    const D = 2.4;
    const keyAnim = (y0, y1) => `<animate attributeName="y" values="${y0};${y1};${y0}" keyTimes="0;0.4;1" dur="${D}s" repeatCount="indefinite"/>`;
    const dip = `<animateTransform attributeName="transform" type="translate" values="0 0;0 4;0 0" keyTimes="0;0.4;1" dur="${D}s" repeatCount="indefinite"/>`;
    let o = `<rect x="0" y="0" width="${W}" height="150" fill="none"/>`;
    // key bed
    o += `<rect x="150" y="104" width="150" height="40" rx="5" fill="${IVORY}" stroke="${INK}">${keyAnim(104, 108)}</rect>`;
    o += `<rect x="30" y="104" width="118" height="40" rx="5" fill="${IVORY}" stroke="${INK}"/>`;
    // hand group: forearm line, back of hand, curved finger, fingertip pad
    o += `<g>${dip}`;
    o += `<path d="M14 60 L100 60" stroke="#d9a982" stroke-width="16" stroke-linecap="round"/>`; // wrist/forearm, level
    o += `<path d="M100 60 L150 60" stroke="#d9a982" stroke-width="22" stroke-linecap="round"/>`; // back of hand
    o += `<path d="M150 60 C 182 58, 200 74, 206 98" fill="none" stroke="#d9a982" stroke-width="15" stroke-linecap="round"/>`; // curved finger
    o += `<circle cx="206" cy="100" r="8" fill="#e8bd98" stroke="${GOLD}" stroke-width="2.5"/>`; // fingertip pad
    o += `<circle cx="150" cy="60" r="4" fill="${GOLD}"/>`; // knuckle
    o += `</g>`;
    // coin on the back of the hand
    o += `<ellipse cx="124" cy="46" rx="11" ry="3.5" fill="${GOLD}" stroke="#8a6a1f"><animateTransform attributeName="transform" type="translate" values="0 0;0 4;0 0" keyTimes="0;0.4;1" dur="${D}s" repeatCount="indefinite"/></ellipse>`;
    // labels
    o += text(124, 26, 'wrist level — coin stays put', 12, MUTE, 700);
    o += text(190, 164, 'play on the fingertip', 12, GOLD, 800, 'middle');
    o += text(214, 52, 'knuckle bridge up', 12, MUTE, 700, 'start');
    return wrap(172, o, 'Side view of a relaxed, curved hand with a level wrist, dropping its weight into one key.');
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

  // A triad: skip a key, play, skip a key, play — then all together
  triad() {
    const g = geom('C4', 'B4', 88), D = 5.2;
    const lit = { [N('C4')]: [0, 4.4], [N('E4')]: [1.2, 3.2], [N('G4')]: [2.4, 2.0] };
    let o = keyboard(g, lit, D);
    [['C4', '1'], ['E4', '3'], ['G4', '5']].forEach(([n, f], i) => {
      o += text(g.cx(N(n)), g.H - 8, f, 18, '#221a05', 800, 'middle', show(i * 1.2, 4.4 - i * 1.2, D));
    });
    // "skip a key" hops
    [['C4', 'E4', 0.6], ['E4', 'G4', 1.8]].forEach(([a, b, t]) => {
      const xa = g.cx(N(a)), xb = g.cx(N(b)), mid = (xa + xb) / 2;
      o += `<path d="M${xa} ${g.H + 8} Q ${mid} ${g.H + 34} ${xb} ${g.H + 8}" fill="none" stroke="${GOLD}" stroke-width="2.5" stroke-linecap="round" opacity="0">${show(t, 1.6, D)}</path>`;
    });
    o += text(g.cx(N('D4')), g.H + 38, 'skip', 12, GOLD, 800, 'middle', show(0.6, 1.2, D));
    o += text(g.cx(N('F4')), g.H + 38, 'skip', 12, GOLD, 800, 'middle', show(1.8, 1.2, D));
    o += text(170, g.H + 62, 'root · 3rd · 5th = one chord', 12, MUTE, 700, 'middle', show(3.2, 2, D));
    return wrap(g.H + 72, o, 'A triad built by skipping a key between each note: C, E, G.');
  },

  // Thumb-under going up (RH): 1 2 3 [thumb tucks] 1 2 3 4 5
  thumbunder() {
    const seq = [['C4', '1'], ['D4', '2'], ['E4', '3'], ['F4', '1'], ['G4', '2'], ['A4', '3'], ['B4', '4'], ['C5', '5']], step = 0.8;
    return sequence('C4', 'C5', seq, step, 'Right hand going up a scale: after finger 3 the thumb tucks under so the hand does not stop.', (g, D) => {
      const xa = g.cx(N('E4')), xb = g.cx(N('F4'));
      return `<path d="M${xa} ${g.H + 8} C ${xa} ${g.H + 40}, ${xb} ${g.H + 40}, ${xb} ${g.H + 8}" fill="none" stroke="${GOOD}" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 4" opacity="0">${show(1.6, 1.6, D)}</path>`
        + text((xa + xb) / 2, g.H + 56, 'thumb tucks under — early!', 12, GOOD, 800, 'middle', show(1.6, 1.6, D));
    });
  },

  // Finger-over coming down (RH): 5 4 3 2 1 [3 crosses over]
  fingerover() {
    const seq = [['C5', '5'], ['B4', '4'], ['A4', '3'], ['G4', '2'], ['F4', '1'], ['E4', '3'], ['D4', '2'], ['C4', '1']], step = 0.8;
    return sequence('C4', 'C5', seq, step, 'Right hand coming down: after the thumb plays F, finger 3 crosses over it to E.', (g, D) => {
      const xa = g.cx(N('F4')), xb = g.cx(N('E4'));
      return `<path d="M${xa} ${g.H + 8} C ${xa} ${g.H + 40}, ${xb} ${g.H + 40}, ${xb} ${g.H + 8}" fill="none" stroke="${GOOD}" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 4" opacity="0">${show(3.2, 1.6, D)}</path>`
        + text((xa + xb) / 2, g.H + 56, '3 crosses over the thumb', 12, GOOD, 800, 'middle', show(3.2, 1.6, D));
    });
  },

  // Alberti bass: low - high - middle - high, wrist rocking
  alberti() {
    return sequence('C3', 'G3', [['C3', '5'], ['G3', '1'], ['E3', '3'], ['G3', '1'], ['C3', '5'], ['G3', '1'], ['E3', '3'], ['G3', '1']], 0.45, 'Alberti bass in the left hand: low, high, middle, high, repeating.');
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
