import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Studio, type StudioItem} from '../components/Studio';
import {RevealLine, Wordmark, fontBase} from '../components/Typography';
import type {Product} from '../data/products';
import {C, ease, lerp, prog} from '../theme';

/**
 * The whole range in one composed frame: foreground, middle ground and
 * background rows, each machine lit in turn from the back to the front.
 * Slots are filled in data order, so reordering PRODUCTS re-casts the shot.
 */
const SLOTS: Omit<StudioItem, 'product' | 'at'>[] = [
	// foreground
	{x: 740, floorY: 985, base: 540},
	{x: 1180, floorY: 985, base: 540},
	// middle ground
	{x: 430, floorY: 915, base: 450, blur: 0.4, depth: 0.2},
	{x: 1490, floorY: 915, base: 450, blur: 0.4, depth: 0.2},
	// background
	{x: 960, floorY: 860, base: 390, blur: 0.9, depth: 0.4},
	{x: 250, floorY: 860, base: 390, blur: 0.9, depth: 0.4},
	{x: 1670, floorY: 860, base: 390, blur: 0.9, depth: 0.4},
	{x: 1310, floorY: 845, base: 360, blur: 1.1, depth: 0.5},
	{x: 610, floorY: 845, base: 360, blur: 1.1, depth: 0.5},
];

/** Which product goes to which slot (by id); unknown/extra products fill the remaining slots. */
const CASTING = ['opaline', 'black-2', 'm1', 'graphite', 't1000', 'white', 'ruby', 'access'];

export const ProductLineup: React.FC<{products: Product[]; duration: number}> = ({products, duration}) => {
	const f = useCurrentFrame();
	const t = prog(f, 0, duration, ease.camera);

	const ordered = [
		...CASTING.map((id) => products.find((p) => p.id === id)).filter((p): p is Product => Boolean(p)),
		...products.filter((p) => !CASTING.includes(p.id)),
	].slice(0, SLOTS.length);

	// light up from the back to the front
	const byDepth = ordered.map((p, i) => ({p, slot: SLOTS[i]})).sort((a, b) => a.slot.floorY - b.slot.floorY);
	const items: StudioItem[] = byDepth.map(({p, slot}, k) => ({product: p, ...slot, at: 4 + k * 9}));

	const textOut = 112;
	return (
		<AbsoluteFill>
			<Studio
				items={items}
				horizon={760}
				head={0.4}
				camera={{scale: lerp(1.3, 1.16, t), x: lerp(-60, 0, t), y: lerp(20, 0, t), originY: 760}}
			/>
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 120}}>
				<RevealLine at={44} out={textOut}>
					<div style={{...fontBase, fontSize: 60, fontWeight: 500, letterSpacing: '-0.03em', color: C.ink}}>
						Une gamme pensée pour chaque projet.
					</div>
				</RevealLine>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 110}}>
				<RevealLine at={textOut + 20} dur={44} blur={14} rise={0.35}>
					<Wordmark size={96} sweep={prog(f, textOut + 34, textOut + 80, ease.inOut)} />
				</RevealLine>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
