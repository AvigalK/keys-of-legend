// Entry point: wires the modules together.
import { Engine, yin } from './engine.js';
import { grade } from './grade.js';
import { L } from './lessons.js';
import { midiName, parseSong } from './notation.js';
import { P, levelOf } from './progress.js';
import { genQuiz } from './quiz.js';
import { kbSVG, scoreSVG, staffSVG } from './render.js';
import { STEPS } from './steps.js';
import { task } from './task.js';
import { SONGS, T } from './tunes.js';
import { WORLDS } from './worlds.js';
import './audio.js';
import './dom.js';
import './hunt.js';
import './improv.js';
import './nav.js';
import './settings-ui.js';
import './song.js';
import './songtab.js';
import './state.js';
import './tuner.js';

window.__kol={scoreSVG,Engine,yin,grade,parseSong,staffSVG,kbSVG,midiName,SONGS,WORLDS,STEPS,genQuiz,task,L,P,levelOf,T};
