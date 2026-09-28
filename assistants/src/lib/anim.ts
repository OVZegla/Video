import {Easing, interpolate} from 'remotion';

// House easings. Expo-out for arrivals, a firm in-out for camera and
// transitions, a whisper of overshoot for small UI confirmations.
export const E = {
	out: Easing.bezier(0.16, 1, 0.3, 1),
	outSoft: Easing.bezier(0.25, 1, 0.5, 1),
	inOut: Easing.bezier(0.65, 0, 0.35, 1),
	inOutSoft: Easing.bezier(0.45, 0, 0.25, 1),
	in: Easing.bezier(0.55, 0, 0.9, 0.4),
	back: Easing.bezier(0.34, 1.4, 0.64, 1),
	linear: (t: number) => t,
};

/** Clamped tween of a single value between two frames. */
export const tw = (
	f: number,
	f0: number,
	f1: number,
	a = 0,
	b = 1,
	ease: (t: number) => number = E.out,
) =>
	interpolate(f, [f0, f1], [a, b], {
		easing: ease,
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

/** 0→1 progress between two frames. */
export const prog = (f: number, f0: number, f1: number, ease: (t: number) => number = E.out) =>
	tw(f, f0, f1, 0, 1, ease);

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Keyframed value: [[frame, value], ...] with an easing per segment. */
export const keys = (f: number, k: [number, number][], ease: (t: number) => number = E.inOut) => {
	if (f <= k[0][0]) return k[0][1];
	for (let i = 0; i < k.length - 1; i++) {
		const [f0, v0] = k[i];
		const [f1, v1] = k[i + 1];
		if (f <= f1) return mix(v0, v1, ease((f - f0) / (f1 - f0)));
	}
	return k[k.length - 1][1];
};

/** Hex colour interpolation. */
export const mixColor = (a: string, b: string, t: number) => {
	const pa = parseInt(a.slice(1), 16);
	const pb = parseInt(b.slice(1), 16);
	const ch = (p: number, s: number) => (p >> s) & 255;
	const c = (s: number) => Math.round(mix(ch(pa, s), ch(pb, s), t));
	return `rgb(${c(16)},${c(8)},${c(0)})`;
};

/** Deterministic pseudo-random in [0,1). */
export const rand = (seed: number) => {
	const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};

/** Cubic Bézier point. */
export const bez = (
	t: number,
	p0: [number, number],
	p1: [number, number],
	p2: [number, number],
	p3: [number, number],
): [number, number] => {
	const u = 1 - t;
	const a = u * u * u;
	const b = 3 * u * u * t;
	const c = 3 * u * t * t;
	const d = t * t * t;
	return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
};
