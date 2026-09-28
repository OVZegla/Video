import {Easing, interpolate} from 'remotion';

// Franchise film — 1920 × 1080, 30 fps.
export const FW = 1920;
export const FH = 1080;
export const FFPS = 30;

// Bauhaus, "bobo chic": warm paper grounds, brand navy, a bright blue and the
// brand red, with wood and a touch of sage for the plants.
export const K = {
	paper: '#F4F0E7',
	paperLight: '#FBF9F4',
	sand: '#E7DFCF',
	line: '#D6CDBB',
	navy: '#00044F',
	navySoft: '#1A1F66',
	blue: '#1F4BFF',
	sky: '#9DBBFF',
	red: '#EE2B24',
	wood: '#CFA271',
	woodDark: '#9C6B3A',
	woodDeep: '#6E4524',
	sage: '#7E957A',
	grey: '#8C8FA3',
	white: '#FFFFFF',
} as const;

export const SANS = 'Jost';

export const ease = {
	inOut: Easing.bezier(0.65, 0, 0.35, 1),
	out: Easing.bezier(0.16, 1, 0.3, 1),
	in: Easing.bezier(0.7, 0, 0.84, 0),
	soft: Easing.bezier(0.45, 0, 0.2, 1),
	back: Easing.bezier(0.34, 1.56, 0.64, 1),
};

/** Clamped 0 → 1 progress between two frames. */
export const p = (f: number, a: number, b: number, e: (t: number) => number = ease.out) =>
	interpolate(f, [a, b], [0, 1], {easing: e, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Fade in over [a, a+d], fade out over [b-d, b] (b optional). */
export const inOut = (f: number, a: number, b?: number, d = 14) =>
	Math.min(p(f, a, a + d), b === undefined ? 1 : 1 - p(f, b - d, b, ease.in));
