import {Easing, interpolate} from 'remotion';

export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;

export const FONT = 'SympsInter';

export const C = {
	black: '#000000',
	ink: '#F5F5F7',
	mist: '#A1A1A6',
	grey: '#6E6E73',
	dark: '#1D1D1F',
	blue: '#2F7BFF',
	blueSoft: '#7FAEFF',
	red: '#E0233D',
	ruby: '#8E1428',
} as const;

// A small easing vocabulary, used everywhere so motion feels like one hand.
export const ease = {
	// long, cinematic ease-in-out (camera moves)
	camera: Easing.bezier(0.45, 0, 0.15, 1),
	// fast start, very long settle (typography, reveals)
	out: Easing.bezier(0.16, 1, 0.3, 1),
	// symmetrical, soft
	inOut: Easing.bezier(0.65, 0, 0.35, 1),
	in: Easing.bezier(0.55, 0, 0.9, 0.3),
	linear: (t: number) => t,
};

type EaseFn = (t: number) => number;

/** 0 → 1 between two frames, clamped, with easing. */
export const prog = (frame: number, start: number, end: number, e: EaseFn = ease.out) =>
	interpolate(frame, [start, end], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: e,
	});

/** Fade in over [a, b], hold, fade out over [c, d]. */
export const inOut = (frame: number, a: number, b: number, c: number, d: number, e: EaseFn = ease.inOut) =>
	Math.min(prog(frame, a, b, e), 1 - prog(frame, c, d, e));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
