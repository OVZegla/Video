import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, HEIGHT, WIDTH} from '../theme';

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
