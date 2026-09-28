import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {HEIGHT, WIDTH, ease, lerp, prog} from '../theme';

/**
 * The mast of the outgoing machine turns into a line of light, which then
 * glides across the frame; the next product is revealed in its wake.
 *
 * Timing is shared with the master timeline through `lineState`.
 */
export const LINE_DURATION = 40;
const GROW_END = 0.36;

export const lineState = (frame: number, fromX: number, direction: 1 | -1) => {
	const u = frame / LINE_DURATION;
	const grow = prog(u, 0, GROW_END, ease.out);
	const travel = prog(u, GROW_END * 0.8, 1, ease.inOut);
	const toX = direction < 0 ? -40 : WIDTH + 40;
	return {
		grow,
		travel,
		x: lerp(fromX, toX, travel),
		/** how dark the outgoing shot becomes (it gives way to the line) */
		dim: prog(u, 0, GROW_END * 1.1, ease.inOut),
		/** opacity of the incoming shot */
		incoming: prog(u, GROW_END * 0.8, GROW_END * 0.8 + 0.3, ease.inOut),
		fade: 1 - prog(u, 0.82, 1, ease.inOut),
	};
};

/** Mask that shows the incoming shot only on the far side of the line. */
export const lineMask = (x: number, direction: 1 | -1): React.CSSProperties => {
	const soft = 140;
	const g =
		direction < 0
			? `linear-gradient(90deg, rgba(0,0,0,0) ${x}px, #000 ${x + soft}px)`
			: `linear-gradient(90deg, #000 ${x - soft}px, rgba(0,0,0,0) ${x}px)`;
	return {WebkitMaskImage: g, maskImage: g};
};

export const LineTransition: React.FC<{fromX: number; direction: 1 | -1; color?: string}> = ({fromX, direction, color = '#DCE8FF'}) => {
	const f = useCurrentFrame();
	const s = lineState(f, fromX, direction);
	const h = HEIGHT * s.grow;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{/* soft bloom */}
			<div
				style={{
					position: 'absolute',
					left: s.x - 40,
					width: 80,
					top: (HEIGHT - h) / 2,
					height: h,
					background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(120,170,255,0.35), rgba(0,0,0,0) 70%)`,
					opacity: s.fade * 0.8,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: s.x - 1,
					width: 2,
					top: (HEIGHT - h) / 2,
					height: h,
					background: `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${color} 18%, #FFFFFF 50%, ${color} 82%, rgba(255,255,255,0) 100%)`,
					boxShadow: '0 0 18px rgba(140,185,255,0.7)',
					opacity: s.fade,
				}}
			/>
		</AbsoluteFill>
	);
};
