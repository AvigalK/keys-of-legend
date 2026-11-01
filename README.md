# Keys of Legend 🎹

Gamified piano lessons for a 61-key keyboard, from zero to real repertoire. The app listens through the phone's microphone and checks the notes you play and your timing.

**▶ Open it:** https://avigalk.github.io/keys-of-legend/


## What's inside

- **Learn** — a world map of quests and boss battles, with sheet music, finger numbers, XP, levels, ranks, streaks and achievements. Quests mix reading, quizzes, ear training (intervals, major/minor, 7th chords), mic-checked pieces and an improvisation step
- **Song** — play any piece with a count-in; every note is graded right/wrong and early/late. The **Custom** box accepts any riff in the app's note format (e.g. `E2+B2e/5 E4q/3 Rq`), so you can practise your own
- **Hunt** — note-reading game on the grand staff
- **Tuner** — check the mic hears your keyboard
- **No-mic mode** — every step can be self-checked; **admin mode** previews any level without saving

## The worlds

| # | World | You learn | Boss song |
|---|---|---|---|
| 0 | Tutorial Island | posture, hand shape, finding keys, steady pulse | The Gatekeeper |
| 1 | Middle C Meadows | C position, note values, treble & bass staff | Ode to Joy |
| 2 | Grand Staff Grove | landmark notes, intervals, 3/4, hands together, dynamics, hands apart, hearing intervals | Storm Warning |
| 3 | Rhythm Rapids | eighths, dotted rhythms, staccato/legato, sharps & flats, pickups, sixteenths, syncopation | Rapid Fire |
| 3b | Shift & Cross | bonus world between 3 and 4 (no rank change): hand shifts, thumb-under, finger-over, finger substitution, leaps, pinky slide | The Crossing Bridge (Bridge Burner) |
| 4 | Scale Summit | major scales, key signatures, triads, I–IV–V, scales hands together, dominant 7th, I–V–vi–IV, pentatonic improv, circle of fifths | Ember Waltz |
| 5 | Harmony Harbor | inversions, Alberti bass, minor keys, ear training, 6/8, composing, 7th chords, lead sheets, more keys | Dark Tide |
| 6 | Classic Castle | reading real scores, 2-octave scales, arpeggios, memorising, first performance | Schumann's Melodie, Minuet in G |
| 7 | Expression Peaks | *coming next* — Bach Prelude in C, Clementi, Für Elise, Gymnopédie | — |

The rock and metal-style pieces (Thunder Steps, Storm Warning, Rapid Fire, Bridge Burner, Ember Waltz, Dark Tide) are original compositions written for this app. Classical pieces are public domain. Melodie and the Minuet in G were converted from [Mutopia Project](https://www.mutopiaproject.org) public-domain editions.

Display type is [Barlow Condensed](https://github.com/jpt/barlow) (SIL Open Font License, see `fonts/OFL.txt`), bundled so the app works offline.

## Tech

Plain ES modules, no build step: GitHub Pages serves the files as they are. Pitch detection runs in the browser: YIN for the pitch, plus a spectral check that ignores notes still ringing from before, so held or overlapping notes don't produce phantom notes. Progress is stored on the device (Settings → backup code to move it).

## Development

```
npm ci            # once
npm run serve     # http://localhost:8000 (the mic needs http://localhost or https)
npm run check     # lint + unit tests + browser smoke test (what CI runs)
```

| Path | What lives there |
|---|---|
| `index.html`, `styles.css` | page shell and styles |
| `src/notation.js` | note names, the text note format and its parser (pure) |
| `src/engine.js`, `src/grade.js` | pitch/onset detection and run grading (pure) |
| `src/render.js`, `src/quiz.js` | keyboard / staff / sheet-music SVG and quiz generators (pure) |
| `src/tunes.js`, `src/worlds.js` | the pieces and the lesson content (data) |
| `src/audio.js`, `src/song.js`, `src/task.js`, `src/improv.js`, `src/hunt.js`, `src/tuner.js` | microphone, graded song runs and the other mic-checked activities |
| `src/lessons.js`, `src/steps.js`, `src/progress.js`, `src/nav.js`, `src/songtab.js`, `src/settings-ui.js` | map, lesson player, XP/ranks, tabs |
| `src/main.js` | entry point |
| `tests/` | `node --test` unit tests (notation, grading, engine on synthetic piano audio, all lesson content) and a Playwright smoke test that clicks through every quest |

To add a piece, write it in the note format in `src/tunes.js` and reference it from a quest in `src/worlds.js`; `npm test` checks that every piece parses, has whole bars, valid fingers and stays on the keyboard.

Note for phones: after a deploy, iOS may keep the old modules for a while. Close the app fully, or reload the page once, to pick up the update.

## Not in the app yet

Triplets (the note format can't write them), World 7, and drawing the A and E major key signatures. Your chat teacher covers those.
