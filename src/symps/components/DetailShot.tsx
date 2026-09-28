import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {Product} from '../data/products';
import {HEIGHT, WIDTH, ease, lerp, prog} from '../theme';
import {Machine, machineGeometry} from './Machine';

export type Focus = 'wheel' | 'carriage' | 'cartridges' | 'rail' | 'ink' | 'uv' | 'base';

/**
 * Macro close-up of a machine detail, lit by a slowly travelling light,
 * with a gentle focus pull on entry. Always uses the vector render, which
 * stays sharp at any magnification.
 */
export const DetailShot: React.FC<{
	product: Product;
	focus: Focus;
	/** machine height in px: 4000 = strong macro */
	zoom: number;
	duration: number;
	/** where the detail sits on screen (0–1) */
	target?: [number, number];
	/** camera drift in px over the shot */
	drift?: [number, number];
	/** light travels from → to (screen fractions) */
	light?: [[number, number], [number, number]];
	lightSize?: number;
	head?: number;
	uv?: number;
	rim?: number;
	darkness?: number;
	rackFocus?: boolean;
}> = ({
	product,
	focus,
	zoom,
	duration,
	target = [0.5, 0.5],
	drift = [-60, 0],
	light = [
		[0.3, 0.4],
		[0.7, 0.55],
	],
	lightSize = 900,
	head = 0.35,
	uv = 0,
	rim = 0.2,
	darkness = 0.97,
	rackFocus = true,
}) => {
	const f = useCurrentFrame();
	const t = prog(f, 0, duration, ease.camera);
	const g = machineGeometry(product.look, head);
	const point = g[focus === 'cartridges' ? 'cartridges' : focus === 'carriage' ? 'carriageCenter' : focus];
	const k = zoom / 1000;

	const tx = target[0] * WIDTH + lerp(0, drift[0], t);
	const ty = target[1] * HEIGHT + lerp(0, drift[1], t);
	const left = tx - point.x * k;
	const top = ty - point.y * k;

	const lx = lerp(light[0][0], light[1][0], t) * WIDTH;
	const ly = lerp(light[0][1], light[1][1], t) * HEIGHT;
	const blur = rackFocus ? lerp(8, 0, prog(f, 0, duration * 0.45, ease.out)) : 0;

	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<div style={{position: 'absolute', left, top, filter: blur > 0.05 ? `blur(${blur}px)` : undefined}}>
				<Machine product={product} height={zoom} head={head} uv={uv} rim={rim} forceVector />
			</div>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse ${lightSize}px ${lightSize * 0.75}px at ${lx}px ${ly}px, rgba(0,0,0,0) 0%, rgba(0,0,0,${0.5 * darkness}) 45%, rgba(0,0,0,${darkness}) 100%)`,
				}}
			/>
		</AbsoluteFill>
	);
};
