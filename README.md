# Keys of Legend 🎹

Gamified piano lessons for a 61-key keyboard, from zero to real repertoire. The app listens through the phone's microphone and checks the notes you play and your timing.

**▶ Open it:** https://avigalk.github.io/keys-of-legend/


## What's inside

- **Learn** — a world map of quests and boss battles, with sheet music, finger numbers, XP, levels, ranks, streaks and achievements
- **Song** — play any piece with a count-in; every note is graded right/wrong and early/late
- **Hunt** — note-reading game on the grand staff
- **Tuner** — check the mic hears your keyboard
- **No-mic mode** — every step can be self-checked; **admin mode** previews any level without saving

## The worlds

| # | World | You learn | Boss song |
|---|---|---|---|
| 0 | Tutorial Island | posture, hand shape, finding keys, steady pulse | The Gatekeeper |
| 1 | Middle C Meadows | C position, note values, treble & bass staff | Ode to Joy |
| 2 | Grand Staff Grove | landmark notes, intervals, 3/4, hands together, dynamics, hands apart, hearing intervals | Au Clair de la Lune |
| 3 | Rhythm Rapids | eighths, dotted rhythms, staccato/legato, sharps & flats, pickups, sixteenths, syncopation | When the Saints |
| 3b | Shift & Cross | bonus world between 3 and 4: hand shifts, thumb-under, finger-over, finger substitution, leaps | The Crossing Bridge |
| 4 | Scale Summit | major scales, key signatures, triads, I–IV–V, scales hands together, dominant 7th, I–V–vi–IV, pentatonic improv, circle of fifths | Amazing Grace |
| 5 | Harmony Harbor | inversions, Alberti bass, minor keys, ear training, 6/8, composing, 7th chords, lead sheets, more keys | Greensleeves |
| 6 | Classic Castle | reading real scores, 2-octave scales, arpeggios, memorising, first performance | Schumann's Melodie, Minuet in G |
| 7 | Expression Peaks | *coming next* — Bach Prelude in C, Clementi, Für Elise, Gymnopédie | — |

All music is traditional or public domain. Melodie and the Minuet in G were converted from [Mutopia Project](https://www.mutopiaproject.org) public-domain editions.

## Tech

One self-contained `index.html` — no build step, no server, no account. Pitch detection runs in the browser (YIN), and progress is stored on the device (Settings → backup code to move it).
