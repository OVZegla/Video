import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {PRODUCT_IMAGES} from '../data/assets.generated';
import type {DetailKey, Product} from '../data/products';
import {HEIGHT, WIDTH, ease, lerp, prog} from '../theme';
import {Machine, machineGeometry} from './Machine';

export type Focus = DetailKey | 'carriage' | 'cartridges' | 'uv' | 'base';

// Nearest equivalent on the vector render for details named on photos.
const VECTOR_POINT: Record<Focus, 'carriageCenter' | 'cartridges' | 'uv' | 'wheel' | 'ink' | 'rail' | 'base'> = {
	wheel: 'wheel',
	ink: 'ink',
	head: 'carriageCenter',
	panel: 'base',
	cable: 'rail',
	connector: 'rail',
	screen: 'carriageCenter',
	top: 'rail',
	rail: 'rail',
	carriage: 'carriageCenter',
	cartridges: 'cartridges',
	uv: 'uv',
	base: 'base',
};

/**
 * Macro close-up of a machine detail, lit by a slowly travelling light,
 * with a gentle focus pull on entry. On the official photo when the detail
 * is located on it (`product.details`), otherwise on the vector render.
 * `zoom` = rendered height of the whole machine, in px.
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
	const tx = target[0] * WIDTH + lerp(0, drift[0], t);
	const ty = target[1] * HEIGHT + lerp(0, drift[1], t);

	const photo = PRODUCT_IMAGES[product.id];
	const onPhoto = photo ? product.details?.[focus as DetailKey] : undefined;
	let subject: React.ReactNode;
	let left: number;
	let top: number;
	if (photo && onPhoto) {
		const w = (zoom * photo.w) / photo.h;
		left = tx - onPhoto[0] * w;
		top = ty - onPhoto[1] * zoom;
		subject = <Img src={staticFile(photo.src)} style={{width: w, height: zoom, display: 'block'}} />;
	} else {
		const point = machineGeometry(product.look, head)[VECTOR_POINT[focus]];
		const k = zoom / 1000;
		left = tx - point.x * k;
		top = ty - point.y * k;
		subject = <Machine product={product} height={zoom} head={head} uv={uv} rim={rim} forceVector />;
	}

	const lx = lerp(light[0][0], light[1][0], t) * WIDTH;
	const ly = lerp(light[0][1], light[1][1], t) * HEIGHT;
	const blur = rackFocus ? lerp(8, 0, prog(f, 0, duration * 0.45, ease.out)) : 0;

	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<div style={{position: 'absolute', left, top, filter: blur > 0.05 ? `blur(${blur}px)` : undefined}}>
				{subject}
			</div>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse ${lightSize}px ${lightSize * 0.75}px at ${lx}px ${ly}px, rgba(0,0,0,0) 0%, rgba(0,0,0,${0.5 * darkness}) 45%, rgba(0,0,0,${darkness}) 100%)`,
				}}
			/>
		</AbsoluteFill>
	);
};
