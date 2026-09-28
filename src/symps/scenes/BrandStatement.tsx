import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Studio, type StudioItem} from '../components/Studio';
import {RevealLine, fontBase} from '../components/Typography';
import type {Product} from '../data/products';
import {C, ease, lerp, prog} from '../theme';

/**
 * Mid-film pause: the machines seen so far, together in one dark studio.
 * The camera slowly pulls back as each one lights up.
 */
export const BrandStatement: React.FC<{products: Product[]; duration: number}> = ({products, duration}) => {
	const f = useCurrentFrame();
	const t = prog(f, 0, duration, ease.camera);

	// V-shaped arrangement: first two in front, the rest recede to the sides.
	const slots = [
		{x: 760, floorY: 930, base: 600},
		{x: 1160, floorY: 930, base: 600},
		{x: 360, floorY: 860, base: 480},
		{x: 1560, floorY: 860, base: 480},
		{x: 60, floorY: 820, base: 400},
		{x: 1860, floorY: 820, base: 400},
	];
	const items: StudioItem[] = products.slice(0, slots.length).map((product, i) => ({
		product,
		...slots[i],
		at: 4 + i * 16,
		depth: slots[i].floorY < 900 ? 0.4 : 0,
		blur: slots[i].floorY < 900 ? 0.6 : 0,
	}));

	const line: React.CSSProperties = {...fontBase, fontSize: 68, fontWeight: 500, letterSpacing: '-0.03em', color: C.ink, textAlign: 'center'};
	const third = duration / 3;

	return (
		<AbsoluteFill>
			<Studio
				items={items}
				horizon={700}
				camera={{scale: lerp(1.32, 1, t), x: 0, y: lerp(40, 0, t), originY: 700}}
			/>
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 128}}>
				<div style={{position: 'relative', width: '100%', height: 100}}>
					<AbsoluteFill style={{alignItems: 'center'}}>
						<RevealLine at={14} out={third + 4}>
							<div style={line}>Une gamme.</div>
						</RevealLine>
					</AbsoluteFill>
					<AbsoluteFill style={{alignItems: 'center'}}>
						<RevealLine at={third + 14} out={third * 2 + 4}>
							<div style={{...line, fontWeight: 300}}>Plusieurs façons de créer.</div>
						</RevealLine>
					</AbsoluteFill>
					<AbsoluteFill style={{alignItems: 'center'}}>
						<RevealLine at={third * 2 + 14}>
							<div style={line}>Une seule vision.</div>
						</RevealLine>
					</AbsoluteFill>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
