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

## Tech

One self-contained `index.html` — no build step, no server, no account. Pitch detection runs in the browser: YIN for the pitch, plus a spectral check that ignores notes still ringing from before, so held or overlapping notes don't produce phantom notes. Progress is stored on the device (Settings → backup code to move it).

## Not in the app yet

Triplets (the note format can't write them), World 7, and drawing the A and E major key signatures. Your chat teacher covers those.
