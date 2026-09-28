import {Easing, interpolate} from 'remotion';

// Canvas: 5 adjacent storefront windows, each 128 × 320.
export const WIDTH = 640;
export const HEIGHT = 320;
export const FPS = 30;
export const DURATION = 450; // 15 s — frame 450 ≡ frame 0 (seamless loop)

export const WIN_W = 128;
export const WIN_COUNT = 5;
export const winX = (i: number) => i * WIN_W;
export const winCX = (i: number) => i * WIN_W + WIN_W / 2;

// Palette — tuned for an LED mesh: pure black reads as transparent glass.
export const C = {
	black: '#000000',
	white: '#F6F5F0',
	blue: '#2451FF',
	blueDeep: '#0B2FD6',
	red: '#F2352B',
	grey: '#3A3A3A',
	wood: '#B7773E',
	woodDark: '#8A5328',
	woodLight: '#D39A5E',
	// official brand colours, sampled from the logo file
	brandNavy: '#00044F',
	brandRed: '#FF0508',
} as const;

export const FONT = 'Jost';

// Easing vocabulary: few curves, used consistently.
export const ease = {
	inOut: Easing.bezier(0.65, 0, 0.35, 1),
	out: Easing.bezier(0.16, 1, 0.3, 1),
	in: Easing.bezier(0.7, 0, 0.84, 0),
	soft: Easing.bezier(0.45, 0, 0.2, 1),
};

type EaseFn = (t: number) => number;

/** Clamped 0→1 progress between two frames with an easing curve. */
export const prog = (
	frame: number,
	start: number,
	end: number,
	easing: EaseFn = ease.inOut,
) =>
	interpolate(frame, [start, end], [0, 1], {
		easing,
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
