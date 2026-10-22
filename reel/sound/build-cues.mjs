// Generates sound/cues.json (with music) and sound/cues-sfx.json (effects only) from src/timing.js,
// so every sound sits on the same frame as its picture.
//   node sound/build-cues.mjs && python3 <skill>/scripts/sound.py sound/cues.json public/sound.wav
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { T, FPS, DURATION, SWIPE_IN, BAR } from "../src/timing.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const sfx = (name) => path.join(here, name);
const semis = (n) => 2 ** (n / 12);
// house bed chords per bar: Am F C G (repeating). add-to-cart plays F+C; shift by whole semitones into each chord.
const CART_SHIFT = { 0: 4, 1: 0, 2: -5, 3: 2 }; // Am -> A+E, F -> F+C, C -> C+G, G -> G+D
const barChord = (frame) => Math.floor(frame / BAR) % 4;

const fx = [
  // cold open
  { type: "whoosh", start: 0, end: 12, gain: 0.08 },
  { type: "tick", frame: T.pretty + 2, gain: 0.12 },
  { type: "click", frame: T.starts, gain: 0.18, freq: 880, pan: -0.2 },
  { type: "click", frame: T.here, gain: 0.18, freq: 1318.5, pan: 0.2 },
  { type: "glint", frame: T.sparkle, gain: 0.07, freq: 1760, pan: 0.3 },
];

// the blush swipe: a pass-by into every cut, a soft landing on the cut
const cuts = [...T.products, T.promise];
const swooshF = [900, 1200, 1000, 1400, 800];
cuts.forEach((t, i) => {
  fx.push({ type: "swoosh", start: t - SWIPE_IN - 2, end: t + 5, gain: 0.32, f: swooshF[i] });
  fx.push({ type: "thump", frame: t, gain: 0.35, freq: 55 });
});

// price reveals in each product chapter
T.products.forEach((t, i) => {
  fx.push({ type: "pop", frame: t + T.pricePop, gain: 0.45, pan: -0.1 });
  fx.push({ type: "cash", frame: t + T.strike, gain: 0.35, pan: 0.2 });
  fx.push({ type: "sample", file: sfx("add-to-cart.ogg"), frame: t + T.pill, gain: 0.5, rate: semis(CART_SHIFT[barChord(t + T.pill)]) });
});

// promises (bar in F)
const [l1, l2, l3] = T.lines;
fx.push({ type: "slap", frame: l1, gain: 0.5 });
fx.push({ type: "whoosh", start: l2 - 4, end: l2 + 10, gain: 0.1 });
[698.46, 880, 1046.5, 1396.9].forEach((freq, i) => fx.push({ type: "blip", frame: l3 + i * 3, gain: 0.25, freq }));

// finale: swipe in, suck to the disc, dead air, hit, details
fx.push({ type: "swoosh", start: T.cover - SWIPE_IN - 2, end: T.cover + 4, gain: 0.32, f: 1100 });
fx.push({ type: "riser", start: T.cover - 20, end: T.gap - 1, gain: 0.5 });
fx.push({ type: "impact", frame: T.hit, gain: 0.95 });
fx.push({ type: "pad", start: T.hit, gain: 0.06, chord: [130.81, 196.0, 261.63, 329.63, 392.0] });
fx.push({ type: "chime", frame: T.arabic, gain: 0.2, freq: 1318.5 });
fx.push({ type: "whoosh", start: T.tagline - 4, end: T.tagline + 12, gain: 0.08 });
fx.push({ type: "click", frame: T.url, gain: 0.25, freq: 784 });
fx.push({ type: "sample", file: sfx("success.ogg"), frame: T.code, gain: 0.45 }); // D+B, in the G bar
fx.push({ type: "glint", frame: T.sheen, gain: 0.06, freq: 2349.3 });

const bed = {
  type: "house", start: 0, end: DURATION, gain: 0.55, bpm: 120,
  sections: [[0, "intro"], [T.products[0], "drop"], [T.promise, "break"], [T.gap, "gap"], [T.hit, "drop"]],
  lp_auto: [[0, 700], [T.products[0] - 6, 1100], [T.products[0], 18000]],
};

const base = { fps: FPS, duration: DURATION / FPS, seed: 11, peak_db: -3, fade_out: 0.5 };
fs.writeFileSync(path.join(here, "cues.json"), JSON.stringify({ ...base, cues: [bed, ...fx] }, null, 2));
fs.writeFileSync(path.join(here, "cues-sfx.json"), JSON.stringify({ ...base, cues: fx }, null, 2));
console.log(`cues: ${fx.length} effects (+ house bed)`);
