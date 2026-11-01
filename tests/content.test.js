import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSong, LOW_MIDI, HIGH_MIDI } from '../src/notation.js';
import { WORLDS, LOCKED_WORLDS, NUMW } from '../src/worlds.js';
import { genQuiz } from '../src/quiz.js';
import { pieceView } from '../src/render.js';
import { SONGS } from '../src/tunes.js';
import { VIS_NAMES, visualHtml } from '../src/visuals.js';

const quests = WORLDS.flatMap((w) => [...w.quests, w.boss]);
const steps = quests.flatMap((q) => q.steps.map((s, i) => ({ q, s, i, tag: `${q.id} step ${i + 1} "${s.title}"` })));
const songSteps = steps.filter(({ s }) => s.t === 'song');

test('world order and bookkeeping', () => {
  assert.deepEqual(WORLDS.map((w) => w.id), [0, 1, 2, 3, '3b', 4, 5, 6]);
  assert.equal(NUMW, 7); // World 3b is a bonus world: it gives no rank
  assert.deepEqual(LOCKED_WORLDS, ['Expression Peaks']);
});

test('quest ids are unique and every quest has steps', () => {
  const ids = quests.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length);
  quests.forEach((q) => assert.ok(q.steps.length > 0, q.id));
});

test('every song step has text that parses, with whole bars, valid fingers and keyboard range', () => {
  for (const { s, tag } of songSteps) {
    assert.ok(s.text, `${tag}: missing text`);
    const p = parseSong(s.text);
    assert.deepEqual(p.errors, [], `${tag}: parse errors`);
    const bpb = s.bpb || 4;
    assert.ok(Math.abs(p.totalBeats / bpb - Math.round(p.totalBeats / bpb)) < 1e-6, `${tag}: ${p.totalBeats} beats is not whole bars of ${bpb}`);
    for (const n of p.notes) {
      for (const pt of n.parts) assert.ok(pt.midi >= LOW_MIDI && pt.midi <= HIGH_MIDI, `${tag}: ${pt.name} out of range`);
      if (n.finger != null) assert.ok(n.finger >= 1 && n.finger <= 5, `${tag}: bad finger`);
    }
  }
});

test('every song step draws in all three views', () => {
  for (const { s, tag } of songSteps) {
    for (const view of ['staff', 'both', 'names']) assert.ok(pieceView(s.text, view, s.bpb, s).length > 20, `${tag}: empty ${view}`);
  }
});

test('Song tab pieces parse', () => {
  for (const song of SONGS.filter((x) => x.text)) assert.deepEqual(parseSong(song.text).errors, [], song.id);
});

test('every quiz generates valid questions (answer among distinct options)', () => {
  const quizzes = steps.filter(({ s }) => s.t === 'quiz');
  assert.ok(quizzes.length > 30);
  for (const { s, tag } of quizzes) {
    for (let rep = 0; rep < 5; rep++) {
      const qs = genQuiz(s);
      assert.ok(s.pass <= qs.length, `${tag}: pass ${s.pass} > ${qs.length} questions`);
      qs.forEach((Q, i) => {
        assert.ok(Q.opts.includes(Q.a), `${tag} q${i + 1}: answer not in options`);
        assert.equal(new Set(Q.opts).size, Q.opts.length, `${tag} q${i + 1}: duplicate options`);
      });
    }
  }
});

test('every lesson visual exists, renders and animates', () => {
  for (const name of VIS_NAMES) {
    const h = visualHtml(name);
    assert.ok(h.includes('<svg') && h.includes('<animate'), `${name}: no animated svg`);
    assert.ok(!/NaN|undefined/.test(h), `${name}: bad number in svg`);
  }
  for (const { s, tag } of steps.filter(({ s }) => s.vis)) assert.ok(VIS_NAMES.includes(s.vis), `${tag}: unknown vis "${s.vis}"`);
});
