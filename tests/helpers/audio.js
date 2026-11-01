// Deterministic synthetic "piano heard through a phone mic" for engine tests.
export const SR = 48000;
export function makeRng(seed) {
  let s = seed >>> 0;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const gauss = () => { let u = 0; for (let i = 0; i < 6; i++) u += rnd(); return (u - 3) / Math.sqrt(0.5); };
  return { rnd, gauss };
}
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

export function makeBuffer(seconds, rng, noise = 0.002) {
  const buf = new Float32Array(Math.floor(seconds * SR));
  let y = 0;
  for (let i = 0; i < buf.length; i++) { y += 0.1 * (rng.gauss() - y); buf[i] = noise * (0.5 * rng.gauss() + 3 * y); }
  return buf;
}
// A struck note: inharmonic partials, a weak fundamental on low notes (small speaker), exponential decay,
// and a quick release after `dur` seconds like a key coming up.
export function addNote(buf, rng, t0, midi, dur, vel = 0.25) {
  const f = hz(midi), s0 = Math.floor(t0 * SR), n = Math.floor(dur * SR);
  const fund = f >= 300 ? 1 : Math.max(0.05, Math.pow(f / 300, 2.2));
  const parts = [];
  for (let h = 1; h <= 12; h++) {
    const fh = f * h * Math.sqrt(1 + 0.0003 * h * h);
    if (fh > SR / 2.2) break;
    parts.push({ w: (2 * Math.PI * fh) / SR, a: Math.pow(h, -0.9) * (h === 1 ? fund : 1), d: 2.2 / (1 + 0.4 * (h - 1)), ph: rng.rnd() * 6.28 });
  }
  for (let i = 0; i < n && s0 + i < buf.length; i++) {
    const t = i / SR;
    let v = 0;
    for (const p of parts) v += p.a * Math.sin(p.w * i + p.ph) * Math.exp(-t / p.d);
    buf[s0 + i] += vel * Math.min(1, t / 0.004) * Math.min(1, (n - i) / (0.03 * SR)) * v * 0.35;
  }
}
// Feed audio through an Engine and collect its onsets.
export function runEngine(Engine, buf) {
  const eng = new Engine(SR);
  eng.sensDb = 12;
  const onsets = [];
  eng.on('onset', (e) => onsets.push(e));
  for (let i = 0; i < buf.length; i += 1024) eng.push(buf.subarray(i, Math.min(buf.length, i + 1024)));
  return onsets;
}
// Match detected onsets to the notes that were played; count extras inside the played window.
export function score(onsets, played, lead, beat) {
  const used = new Set();
  let hit = 0, rightPitch = 0;
  for (const p of played) {
    let bi = -1, bd = Infinity;
    onsets.forEach((o, i) => {
      if (used.has(i) || o.t < lead - 0.4) return;
      const d = Math.abs(o.t - p.t);
      if (d < 0.45 * beat && d < bd) { bd = d; bi = i; }
    });
    if (bi >= 0) {
      used.add(bi); hit++;
      if (onsets[bi].midi != null && (((onsets[bi].midi - p.midi) % 12) + 12) % 12 === 0) rightPitch++;
    }
  }
  const end = played[played.length - 1].t + beat;
  const extras = onsets.filter((o, i) => !used.has(i) && o.midi != null && o.t >= lead - 0.4 && o.t <= end).length;
  return { hit, rightPitch, extras };
}
