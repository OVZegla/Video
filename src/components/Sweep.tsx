import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, DURATION, HEIGHT, WIDTH} from '../theme';

/**
 * Scene changes are carried by a tricolour Bauhaus band that travels across
 * the whole storefront, left → right, through all five windows. Behind the band
 * the new scene appears; ahead of it the old scene is still showing.
 */
export const STRIPES = [
	{w: 16, c: C.red},
	{w: 6, c: 'transparent'},
	{w: 10, c: C.white},
	{w: 6, c: 'transparent'},
	{w: 30, c: C.sky},
	{w: 6, c: 'transparent'},
	{w: 44, c: C.blue},
];
export const BAND = STRIPES.reduce((s, x) => s + x.w, 0);
export const SWEEP_D = 44; // frames for the band to cross the storefront

const sweepEase = Easing.bezier(0.42, 0.1, 0.58, 0.9);

/** x of the band's leading edge (its right side) during the sweep that starts at `S`. */
export const sweepLead = (frame: number, S: number) =>
	interpolate(frame, [S, S + SWEEP_D], [0, WIDTH + BAND], {
		easing: sweepEase,
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

/** Frame at which the band's trailing edge passes x (inverse of sweepLead, approximated). */
export const sweepReaches = (S: number, x: number) => {
	for (let f = 0; f <= SWEEP_D; f++) {
		if (sweepLead(S + f, S) - BAND >= x) return S + f;
	}
	return S + SWEEP_D;
};

export const SweepBand: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	if (frame < at || frame > at + SWEEP_D) return null;
	const lead = sweepLead(frame, at);
	let x = lead - BAND;
	return (
		<>
			{STRIPES.slice()
				.reverse()
				.map((s, k) => {
					const el = s.c === 'transparent' ? null : (
						<div key={k} style={{position: 'absolute', top: 0, left: x, width: s.w, height: HEIGHT, background: s.c}} />
					);
					x += s.w;
					return el;
				})}
		</>
	);
};

/* ------------------------------------------------------------------ lines */

/**
 * Permanent Bauhaus rails crossing all five windows: dashed lines drifting in
 * opposite directions and a couple of runners. Every motion has a period that
 * divides the loop, so frame 900 ≡ frame 0.
 */
export const Rails: React.FC = () => {
	const frame = useCurrentFrame();
	const P = 240; // dash period
	const shift = ((frame / DURATION) * P * 4) % P; // 4 periods per loop
	const dash = (y: number, color: string, h: number, dir: 1 | -1, on: number, opacity = 1) => (
		<div
			style={{
				position: 'absolute',
				left: 0,
				top: y,
				width: WIDTH,
				height: h,
				opacity,
				backgroundImage: `repeating-linear-gradient(90deg, ${color} 0 ${on}px, transparent ${on}px ${P}px)`,
				backgroundPosition: `${dir * shift}px 0`,
			}}
		/>
	);
	// runners: small squares riding the rails, 2 laps per loop
	const lap = (k: number) => ((frame / DURATION) * 2 + k) % 1;
	return (
		<>
			{dash(18, C.sky, 2, 1, 150)}
			{dash(24, C.white, 1, -1, 60, 0.5)}
			{dash(HEIGHT - 20, C.ice, 1, -1, 180, 0.7)}
			<div style={{position: 'absolute', top: 14, left: -10 + lap(0) * (WIDTH + 20), width: 10, height: 10, background: C.red}} />
			<div style={{position: 'absolute', top: HEIGHT - 23, left: WIDTH + 10 - lap(0.5) * (WIDTH + 20), width: 7, height: 7, borderRadius: '50%', background: C.white}} />
		</>
	);
};

/** A line drawn across the storefront (SVG), revealed by `p` 0→1 and erased by `q` 0→1. */
export const CrossLine: React.FC<{
	d: string;
	color: string;
	width: number;
	p: number;
	q?: number;
	opacity?: number;
}> = ({d, color, width, p, q = 0, opacity = 1}) => (
	<svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
		<path
			d={d}
			fill="none"
			stroke={color}
			strokeWidth={width}
			strokeLinecap="butt"
			pathLength={1}
			strokeDasharray={`${Math.max(0, p - q)} 2`}
			strokeDashoffset={-q}
			opacity={opacity}
		/>
	</svg>
);
