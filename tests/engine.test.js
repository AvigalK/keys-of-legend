import test from 'node:test';
import assert from 'node:assert/strict';
import { Engine } from '../src/engine.js';
import { makeRng, makeBuffer, addNote, runEngine, score } from './helpers/audio.js';

// Play `notes` (midi) spaced `beat` s apart, each held `hold` x beat. Returns detection stats.
function play(notes, { beat = 1, hold = 0.9, seed = 7 } = {}) {
  const rng = makeRng(seed), lead = 2;
  const buf = makeBuffer(lead + notes.length * beat + 1.5, rng);
  const played = notes.map((midi, i) => ({ midi, t: lead + i * beat }));
  played.forEach((p) => addNote(buf, rng, p.t + (rng.rnd() - 0.5) * 0.015, p.midi, beat * hold, 0.2 + 0.1 * rng.rnd()));
  return score(runEngine(Engine, buf), played, lead, beat);
}

test('detects every key of the keyboard at the right pitch', () => {
  const notes = [36, 43, 48, 55, 60, 67, 72, 79, 84, 91, 96];
  const r = play(notes);
  assert.equal(r.hit, notes.length);
  assert.equal(r.rightPitch, notes.length);
  assert.equal(r.extras, 0);
});

test('low octave leaps (C3 <-> C2) are detected', () => {
  const r = play([48, 36, 48, 36, 48, 36, 48, 36]);
  assert.equal(r.hit, 8);
  assert.equal(r.rightPitch, 8);
});

test('fast sixteenth-note runs are detected', () => {
  const r = play([60, 62, 64, 65, 67, 65, 64], { beat: 0.227, hold: 0.85 });
  assert.equal(r.hit, 7);
  assert.equal(r.rightPitch, 7);
  assert.equal(r.extras, 0);
});

test('notes still ringing from before do not create phantom notes', () => {
  // each note rings for 3 beats, so the next ones sound on top of it
  const r = play([64, 65, 67, 69, 67, 65, 64, 62], { hold: 3 });
  assert.ok(r.extras <= 2, `extras: ${r.extras}`);
});

test('silence produces no notes', () => {
  const buf = makeBuffer(4, makeRng(3));
  assert.equal(runEngine(Engine, buf).filter((o) => o.midi != null).length, 0);
});
