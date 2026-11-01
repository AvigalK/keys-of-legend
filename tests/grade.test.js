import test from 'node:test';
import assert from 'node:assert/strict';
import { grade } from '../src/grade.js';
import { parseSong } from '../src/notation.js';

const BEAT = 0.5;
const expected = (text) => parseSong(text).notes.map((n) => ({ ...n, t: 2 + n.beat * BEAT, durSec: n.dur * BEAT }));
const played = (list) => list.map(([beat, midi, dt = 0]) => ({ t: 2 + beat * BEAT + dt, midi }));

test('a clean run is clean', () => {
  const g = grade(expected('C4 D4 E4'), played([[0, 60], [1, 62], [2, 64]]), { beat: BEAT });
  assert.equal(g.clean, true);
  assert.equal(g.correct, 3);
});

test('a wrong note, a late note and an extra note are all reported', () => {
  const g = grade(expected('C4 D4 E4 F4'), played([[0, 60], [1, 63], [2, 64, 0.2], [3, 65], [3.5, 70]]), { beat: BEAT });
  assert.equal(g.clean, false);
  assert.equal(g.res[1].status, 'wrong');
  assert.equal(g.res[2].timing, 'late');
  assert.equal(g.extras.length, 1);
});

test('a missed note is reported', () => {
  const g = grade(expected('C4 D4'), played([[0, 60]]), { beat: BEAT });
  assert.equal(g.res[1].status, 'miss');
});

test('octave is ignored unless strict', () => {
  const lax = grade(expected('C4'), played([[0, 72]]), { beat: BEAT });
  const strict = grade(expected('C4'), played([[0, 72]]), { beat: BEAT, strictOctave: true });
  assert.equal(lax.res[0].status, 'hit');
  assert.equal(strict.res[0].status, 'wrong');
});

test('any note of a chord counts', () => {
  const g = grade(expected('C3+E3+G3'), played([[0, 55]]), { beat: BEAT });
  assert.equal(g.res[0].status, 'hit');
});
