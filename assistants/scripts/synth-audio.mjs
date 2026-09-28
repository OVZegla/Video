// Original soundtrack, synthesised offline and deterministically (no samples,
// no third-party music). Writes public/audio/soundtrack.wav (48 kHz, stereo,
// 16-bit, exactly 60 s).
//
//   node scripts/synth-audio.mjs
//
// Music: 100 BPM, a discreet electronic bed in C major / A minor
// (Fmaj9 – C/E – Am7 – G6sus). Sections follow the film:
//   0–5 s    tension: muted ostinato that gets denser (overload)
//   5–5.5 s  cut (the image freezes)
//   6.5–14   pads open: the team forms
//   14–40    soft groove: kick, shaker, bass, delayed plucks
//   40–50    calm: drums out (daily brief)
//   50–56    light pulse returns (the decision)
//   56–60    final chord, ring-out
// Sound design follows scripts/cues.mjs.

import fs from 'node:fs';
import path from 'node:path';
import {CUES} from './cues.mjs';

const SR = 48000;
const DUR = 60;
const N = SR * DUR;
const FPS = 30;

const music = [new Float32Array(N), new Float32Array(N)];
const sfx = [new Float32Array(N), new Float32Array(N)];
const verbSend = new Float32Array(N);
const delaySend = new Float32Array(N);

// ———————————————————————————————————————— helpers

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const TAU = Math.PI * 2;
let seed = 0x2f5bff;
const rnd = () => {
	// mulberry32
	seed |= 0;
	seed = (seed + 0x6d2b79f5) | 0;
	let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const clampI = (i) => Math.max(0, Math.min(N, i));
const pan2 = (p) => [Math.cos((p + 1) * Math.PI / 4), Math.sin((p + 1) * Math.PI / 4)];

/** Adds a voice rendered by fn(t, i) (t = seconds since start) into a bus. */
function add(bus, t0, dur, fn, {pan = 0, gain = 1, verb = 0, delay = 0} = {}) {
	const a = clampI(Math.floor(t0 * SR));
	const b = clampI(Math.ceil((t0 + dur) * SR));
	const [gl, gr] = pan2(pan);
	for (let i = a; i < b; i++) {
		const t = i / SR - t0;
		const v = fn(t) * gain;
		bus[0][i] += v * gl;
		bus[1][i] += v * gr;
		if (verb) verbSend[i] += v * verb;
		if (delay) delaySend[i] += v * delay;
	}
}

const env = (t, a, r, dur) => {
	if (t < 0) return 0;
	if (t < a) return t / a;
	if (t > dur - r) return Math.max(0, (dur - t) / r);
	return 1;
};

// ———————————————————————————————————————— instruments

function pad(notes, t0, dur, amp = 0.05, bright = 1) {
	notes.forEach((m, k) => {
		for (const [det, pan] of [
			[-5, -0.55],
			[5, 0.55],
		]) {
			const f = mtof(m) * Math.pow(2, det / 1200);
			const ph = rnd() * TAU;
			add(
				music,
				t0,
				dur,
				(t) => {
					let s = 0;
					for (let h = 1; h <= 7; h++) {
						if (f * h > 6000) break;
						s += Math.sin(TAU * f * h * t + ph * h) / Math.pow(h, 1.6 + (1 - bright) * 0.8);
					}
					const lfo = 1 + 0.12 * Math.sin(TAU * 0.13 * t + k);
					return s * env(t, 1.4, 1.8, dur) * lfo;
				},
				{pan: pan * (0.4 + 0.15 * k), gain: amp / Math.sqrt(notes.length), verb: 0.5},
			);
		}
	});
}

function pluck(m, t0, amp = 0.08, {pan = 0, decay = 0.32, delay = 0.35, verb = 0.3, muted = false} = {}) {
	const f = mtof(m);
	const dur = decay * 6;
	add(
		music,
		t0,
		dur,
		(t) => {
			const e = Math.min(1, t / 0.004) * Math.exp(-t / (muted ? decay * 0.4 : decay));
			const b = Math.exp(-t / (decay * 0.5));
			return (Math.sin(TAU * f * t) + 0.35 * b * Math.sin(TAU * 2 * f * t) + 0.12 * b * Math.sin(TAU * 3 * f * t)) * e;
		},
		{pan, gain: amp, delay, verb},
	);
}

function bell(m, t0, amp = 0.06, pan = 0) {
	const f = mtof(m);
	add(
		music,
		t0,
		3,
		(t) => {
			const e = Math.min(1, t / 0.003);
			return (
				e *
				(Math.sin(TAU * f * t) * Math.exp(-t / 0.9) +
					0.25 * Math.sin(TAU * f * 2.76 * t) * Math.exp(-t / 0.3) +
					0.1 * Math.sin(TAU * f * 5.4 * t) * Math.exp(-t / 0.12))
			);
		},
		{pan, gain: amp, verb: 0.55, delay: 0.25},
	);
}

function bass(m, t0, dur, amp = 0.14) {
	const f = mtof(m);
	add(
		music,
		t0,
		dur + 0.2,
		(t) => {
			const e = Math.min(1, t / 0.01) * (t > dur ? Math.max(0, 1 - (t - dur) / 0.2) : 1) * (0.75 + 0.25 * Math.exp(-t / 0.3));
			return (Math.sin(TAU * f * t) + 0.22 * Math.sin(TAU * 2 * f * t)) * e;
		},
		{gain: amp},
	);
}

function kick(t0, amp = 0.32) {
	add(
		music,
		t0,
		0.5,
		(t) => {
			// pitch glides 124 → 44 Hz (phase integrated analytically)
			const ph = TAU * (44 * t + 80 * 0.03 * (1 - Math.exp(-t / 0.03)));
			return Math.sin(ph) * Math.exp(-t / 0.22) * Math.min(1, t / 0.002);
		},
		{gain: amp},
	);
}

function hat(t0, amp = 0.03, pan = 0.3, len = 0.04) {
	let hp = 0;
	let prev = 0;
	add(
		music,
		t0,
		len * 5,
		(t) => {
			const x = noise();
			hp = 0.6 * (hp + x - prev);
			prev = x;
			return hp * Math.exp(-t / len);
		},
		{pan, gain: amp, verb: 0.1},
	);
}

// ———————————————————————————————————————— sound design

function tick(t0, v, pitch = 0) {
	const f = 1500 + pitch * 90;
	add(sfx, t0, 0.12, (t) => Math.sin(TAU * f * t) * Math.exp(-t / 0.018) + 0.3 * noise() * Math.exp(-t / 0.003), {
		pan: ((pitch % 5) - 2) * 0.18,
		gain: 0.16 * v,
		verb: 0.25,
	});
	add(sfx, t0, 0.15, (t) => Math.sin(TAU * 180 * t) * Math.exp(-t / 0.03), {gain: 0.12 * v});
}

function blip(t0, v, pitch = 0) {
	const f = mtof(84 + [0, 2, 4, 7, 9][pitch % 5]);
	add(sfx, t0, 0.3, (t) => Math.sin(TAU * f * t) * Math.exp(-t / 0.05) * Math.min(1, t / 0.003), {
		pan: (pitch % 2 ? 0.35 : -0.35),
		gain: 0.12 * v,
		verb: 0.4,
	});
}

function whoosh(t0, dur, v, dir = 'in') {
	// band-passed noise, centre frequency sweeping
	let low = 0;
	let band = 0;
	const [fa, fb] = dir === 'in' ? [300, 2400] : [2600, 350];
	for (const [pan, s] of [
		[-0.5, 0],
		[0.5, 0.07],
	]) {
		low = 0;
		band = 0;
		add(
			sfx,
			t0 + s,
			dur,
			(t) => {
				const p = t / dur;
				const fc = fa * Math.pow(fb / fa, p);
				const fq = 2 * Math.sin(Math.PI * fc / SR);
				const x = noise();
				low += fq * band;
				const high = x - low - 0.9 * band;
				band += fq * high;
				const e = Math.sin(Math.PI * Math.min(1, p)) ** 2;
				return band * e;
			},
			{pan, gain: 0.33 * v, verb: 0.35},
		);
	}
}

function pop(t0, v) {
	add(sfx, t0, 0.5, (t) => {
		const f = 220 + 440 * Math.exp(-t / 0.02);
		return Math.sin(TAU * f * t) * Math.exp(-t / 0.09) * Math.min(1, t / 0.002);
	}, {gain: 0.3 * v, verb: 0.35});
	bellSfx(t0 + 0.02, 76, 0.1 * v);
}

function bellSfx(t0, m, amp, pan = 0) {
	const f = mtof(m);
	add(
		sfx,
		t0,
		2,
		(t) =>
			Math.min(1, t / 0.002) *
			(Math.sin(TAU * f * t) * Math.exp(-t / 0.45) + 0.2 * Math.sin(TAU * f * 2.76 * t) * Math.exp(-t / 0.15)),
		{pan, gain: amp, verb: 0.5},
	);
}

function card(t0, v) {
	add(sfx, t0, 0.2, (t) => noise() * Math.exp(-t / 0.012) * 0.5 + Math.sin(TAU * 900 * t) * Math.exp(-t / 0.03), {
		gain: 0.1 * v,
		verb: 0.3,
	});
	add(sfx, t0, 0.3, (t) => Math.sin(TAU * (500 + 300 * Math.min(1, t / 0.06)) * t) * Math.exp(-t / 0.06), {gain: 0.1 * v, verb: 0.3});
}

function voiceOn(t0, v) {
	add(sfx, t0, 0.35, (t) => {
		const f = 620 + 380 * Math.min(1, t / 0.09);
		return Math.sin(TAU * f * t) * Math.exp(-t / 0.08) * Math.min(1, t / 0.004);
	}, {gain: 0.2 * v, verb: 0.35});
	add(sfx, t0 + 0.09, 0.4, (t) => Math.sin(TAU * 1240 * t) * Math.exp(-t / 0.07) * Math.min(1, t / 0.003), {gain: 0.12 * v, verb: 0.35});
}

function send(t0, v) {
	add(sfx, t0, 0.3, (t) => {
		const f = 900 + 700 * Math.min(1, t / 0.07);
		return Math.sin(TAU * f * t) * Math.exp(-t / 0.05) * Math.min(1, t / 0.003);
	}, {gain: 0.16 * v, verb: 0.3});
}

function ready(t0, v, pitch = 0) {
	const base = 76 + [0, 2, 4, 7][pitch % 4];
	bellSfx(t0, base, 0.16 * v, -0.2);
	bellSfx(t0 + 0.09, base + 7, 0.13 * v, 0.2);
}

function chime(t0, v, notes) {
	notes.forEach((m, i) => bellSfx(t0 + i * 0.11, m, 0.14 * v, i % 2 ? 0.3 : -0.3));
}

function drop(t0, v) {
	add(sfx, t0, 0.5, (t) => Math.sin(TAU * (70 + 60 * Math.exp(-t / 0.04)) * t) * Math.exp(-t / 0.12), {gain: 0.4 * v});
	add(sfx, t0, 0.1, (t) => noise() * Math.exp(-t / 0.008), {gain: 0.08 * v, verb: 0.3});
}

function validate(t0, v) {
	// press + confirmation: a bright rising major arpeggio
	add(sfx, t0, 0.1, (t) => noise() * Math.exp(-t / 0.006), {gain: 0.1 * v});
	add(sfx, t0, 0.2, (t) => Math.sin(TAU * 160 * t) * Math.exp(-t / 0.04), {gain: 0.25 * v});
	[72, 76, 79, 84].forEach((m, i) => bellSfx(t0 + 0.05 + i * 0.07, m, (0.17 - i * 0.015) * v, i % 2 ? 0.25 : -0.25));
}

// ———————————————————————————————————————— music

const BEAT = 0.6;
const BAR = BEAT * 4;
const CH = [
	{bass: 41, pad: [57, 60, 64, 67], arp: [65, 69, 72, 76, 79]}, // Fmaj9
	{bass: 40, pad: [55, 60, 64, 67], arp: [64, 67, 72, 74, 79]}, // C/E
	{bass: 45, pad: [55, 60, 64, 69], arp: [64, 69, 72, 76, 81]}, // Am7
	{bass: 43, pad: [55, 62, 64, 69], arp: [62, 67, 69, 74, 79]}, // G6sus
];

// A — overload (0–5.0 s): muted ostinato, denser and denser, then a cut.
for (let t = 0.35; t < 5.0; ) {
	const dense = t > 3.0;
	const k = Math.round(t / 0.15);
	pluck(k % 2 ? 76 : 69, t, 0.05 + 0.03 * (t / 5), {pan: k % 2 ? 0.3 : -0.3, decay: 0.12, delay: 0.1, verb: 0.15, muted: true});
	t += dense ? 0.15 : 0.3;
}
add(music, 0, 5.0, (t) => Math.sin(TAU * 55 * t) * Math.min(1, t / 1.5) * (t > 4.97 ? 0 : 1), {gain: 0.08});
add(music, 0.3, 4.7, (t) => Math.sin(TAU * mtof(64) * t) * 0.5 * Math.min(1, t / 3) * env(t, 0.5, 0.03, 4.7), {gain: 0.02, verb: 0.4});

// B — the team forms (6.5–13.8 s)
const T_B = 6.5;
const T_C = 13.8;
pad(CH[0].pad, T_B, 2.6 + 0.8, 0.07, 0.6);
bass(CH[0].bass - 12, T_B, 2.8, 0.12);
pad(CH[1].pad, T_B + 2.5, 2.6, 0.07, 0.7);
bass(CH[1].bass - 12, T_B + 2.5, 2.4, 0.12);
pad(CH[2].pad, T_B + 4.9, 2.6, 0.07, 0.8);
bass(CH[2].bass - 12, T_B + 4.9, 2.4, 0.12);
for (let i = 0; i < 9; i++) {
	const t = 8.2 + i * BEAT;
	if (t > T_C - 0.1) break;
	const c = CH[t < T_B + 4.9 ? 1 : 2];
	pluck(c.arp[[0, 2, 1, 3, 2, 4, 3, 1, 2][i]], t, 0.05, {pan: i % 2 ? 0.4 : -0.4, decay: 0.35});
}

// C — groove (13.8–40.2 s), D — calm (40.2–49.8), E — pulse (49.8–56)
const T_D = T_C + BAR * 11; // 40.2
const T_E = T_D + BAR * 4; // 49.8
const T_F = 56.0;
for (let bar = 0; ; bar++) {
	const t0 = T_C + bar * BAR;
	if (t0 >= T_F - 0.01) break;
	const c = CH[bar % 4];
	const len = Math.min(BAR, T_F - t0);
	const sec = t0 < T_D ? 'C' : t0 < T_E ? 'D' : 'E';
	pad(c.pad, t0, len + 0.9, sec === 'D' ? 0.075 : 0.06, sec === 'C' ? 0.85 : 0.7);
	// bass
	if (sec === 'D') bass(c.bass - 12, t0, len - 0.1, 0.1);
	else {
		bass(c.bass - 12, t0, BEAT * 1.4, 0.13);
		bass(c.bass - 12, t0 + BEAT * 2.5, BEAT * 1.2, 0.1);
	}
	for (let s = 0; s < 16; s++) {
		const t = t0 + s * (BEAT / 4);
		if (t >= T_F - 0.3) break;
		// drums
		if (sec === 'C') {
			if (s % 8 === 0) kick(t, 0.26);
			if (s % 4 === 2) hat(t, 0.028, 0.25, 0.05);
			hat(t, s % 2 ? 0.008 : 0.012, -0.35, 0.02);
		} else if (sec === 'E') {
			if (s % 8 === 0) kick(t, 0.2);
			if (s % 4 === 2) hat(t, 0.02, 0.25, 0.04);
		}
		// arpeggio: 8ths in C and E, quarters in D
		const step = sec === 'D' ? 4 : 2;
		if (s % step === 0) {
			const idx = [0, 2, 4, 1, 3, 2, 4, 3][(s / step + bar) % 8];
			if (sec === 'D') bell(c.arp[idx] + 12, t, 0.03, idx % 2 ? 0.35 : -0.35);
			else pluck(c.arp[idx], t, 0.042, {pan: (s / step) % 2 ? 0.45 : -0.45, decay: 0.28});
		}
	}
}

// F — final chord (56 s → end): Cmaj9, with a bell on top.
pad([55, 59, 62, 64, 67], T_F, DUR - T_F + 0.5, 0.085, 0.75);
bass(36, T_F, 3.3, 0.14);
bell(76, T_F + 0.02, 0.05, -0.3);
bell(83, T_F + 0.3, 0.035, 0.3);
bell(88, T_F + 0.62, 0.025, 0);

// ———————————————————————————————————————— cues

for (const c of CUES) {
	const t = c.f / FPS;
	switch (c.type) {
		case 'tick': tick(t, c.v, c.pitch); break;
		case 'blip': blip(t, c.v, c.pitch); break;
		case 'whoosh': whoosh(t - c.dur * 0.35, c.dur, c.v, c.dir); break;
		case 'pop': pop(t, c.v); break;
		case 'chime': chime(t, c.v, c.notes); break;
		case 'card': card(t, c.v); break;
		case 'voiceOn': voiceOn(t, c.v); break;
		case 'send': send(t, c.v); break;
		case 'ready': ready(t, c.v, c.pitch ?? 0); break;
		case 'drop': drop(t, c.v); break;
		case 'validate': validate(t, c.v); break;
		default: throw new Error(`unknown cue ${c.type}`);
	}
}

// ———————————————————————————————————————— effects

// Ping-pong delay (dotted eighth).
{
	const d = Math.round(BEAT * 0.75 * SR);
	const L = new Float32Array(N);
	const R = new Float32Array(N);
	let lpL = 0;
	let lpR = 0;
	for (let i = 0; i < N; i++) {
		const inL = delaySend[i] + (i >= d ? R[i - d] * 0.38 : 0);
		const inR = i >= d ? L[i - d] * 0.9 : 0;
		lpL += 0.35 * (inL - lpL);
		lpR += 0.35 * (inR - lpR);
		L[i] = lpL;
		R[i] = lpR;
		music[0][i] += L[i] * 0.45;
		music[1][i] += R[i] * 0.45;
		verbSend[i] += (L[i] + R[i]) * 0.15;
	}
}

// Schroeder/Freeverb-style reverb.
function reverb(input, spread) {
	const combs = [1557, 1617, 1491, 1422, 1277, 1356].map((n) => ({buf: new Float32Array(n + spread), i: 0, lp: 0}));
	const aps = [556, 441, 341].map((n) => ({buf: new Float32Array(n + spread), i: 0}));
	const out = new Float32Array(N);
	for (let n = 0; n < N; n++) {
		const x = input[n] * 0.2;
		let s = 0;
		for (const c of combs) {
			const y = c.buf[c.i];
			c.lp = y * 0.72 + c.lp * 0.28;
			c.buf[c.i] = x + c.lp * 0.86;
			c.i = (c.i + 1) % c.buf.length;
			s += y;
		}
		for (const a of aps) {
			const y = a.buf[a.i];
			const v = s + y * 0.5;
			a.buf[a.i] = v;
			s = y - v * 0.5;
			a.i = (a.i + 1) % a.buf.length;
		}
		out[n] = s;
	}
	return out;
}
const vL = reverb(verbSend, 0);
const vR = reverb(verbSend, 23);

// ———————————————————————————————————————— mix & master

const out = [new Float32Array(N), new Float32Array(N)];
for (let i = 0; i < N; i++) {
	const t = i / SR;
	const fadeIn = Math.min(1, t / 0.05);
	const fadeOut = Math.min(1, (DUR - t) / 1.6);
	for (let ch = 0; ch < 2; ch++) {
		const v = (music[ch][i] * 0.9 + sfx[ch][i] * 1.0 + (ch ? vR[i] : vL[i]) * 0.55) * fadeIn * Math.max(0, fadeOut);
		out[ch][i] = v;
	}
}
let peak = 0;
let sum = 0;
for (let i = 0; i < N; i++)
	for (let ch = 0; ch < 2; ch++) {
		peak = Math.max(peak, Math.abs(out[ch][i]));
		sum += out[ch][i] ** 2;
	}
const rms = Math.sqrt(sum / (2 * N));
// Target a discreet level: RMS ≈ -21 dBFS, peaks soft-limited below -1 dBFS.
const target = Math.pow(10, -21 / 20);
const g = target / rms;
const ceil = Math.pow(10, -1 / 20);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write('WAVE', 8);
buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write('data', 36);
buf.writeUInt32LE(N * 4, 40);
let clipped = 0;
let outPeak = 0;
for (let i = 0; i < N; i++)
	for (let ch = 0; ch < 2; ch++) {
		let x = out[ch][i] * g;
		// soft knee above -6 dBFS
		const k = 0.5;
		const ax = Math.abs(x);
		if (ax > k) x = Math.sign(x) * (k + (ceil - k) * Math.tanh((ax - k) / (ceil - k)));
		if (Math.abs(x) >= ceil) clipped++;
		outPeak = Math.max(outPeak, Math.abs(x));
		buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, x)) * 32767), 44 + (i * 2 + ch) * 2);
	}
const file = path.join(path.dirname(new URL(import.meta.url).pathname), '../public/audio/soundtrack.wav');
fs.mkdirSync(path.dirname(file), {recursive: true});
fs.writeFileSync(file, buf);
console.log(
	`✔ ${path.relative(process.cwd(), file)} — ${DUR} s, pre-gain peak ${(20 * Math.log10(peak)).toFixed(1)} dBFS, ` +
		`gain ${(20 * Math.log10(g)).toFixed(1)} dB, output peak ${(20 * Math.log10(outPeak)).toFixed(1)} dBFS, RMS -21 dBFS, ${clipped} samples at ceiling`,
);
