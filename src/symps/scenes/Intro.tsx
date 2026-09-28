import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {DetailShot} from '../components/DetailShot';
import {RevealLine, Wordmark, fontBase} from '../components/Typography';
import type {Product} from '../data/products';
import {C, ease, inOut, prog} from '../theme';

/**
 * 0–5.5 s. Out of black: three macro details of the flagship (caster,
 * cartridges, rail + UV lamp), each grazed by a single light. Then the name,
 * then the promise.
 */
export const INTRO_DURATION = 170;

const Shot: React.FC<{from: number; dur: number; fadeIn?: number; fadeOut?: number; children: React.ReactNode}> = ({from, dur, fadeIn = 18, fadeOut = 18, children}) => {
	const f = useCurrentFrame();
	const o = inOut(f, from, from + fadeIn, from + dur - fadeOut, from + dur, ease.inOut);
	return (
		<Sequence from={from} durationInFrames={dur} layout="none">
			<AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>
		</Sequence>
	);
};

export const Intro: React.FC<{product: Product}> = ({product}) => {
	const f = useCurrentFrame();
	const wordOut = prog(f, 104, 120, ease.inOut);

	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Shot from={6} dur={62} fadeIn={30}>
				<DetailShot
					product={product}
					focus="wheel"
					zoom={4600}
					duration={62}
					target={[0.44, 0.58]}
					drift={[-70, -10]}
					light={[
						[0.25, 0.35],
						[0.6, 0.5],
					]}
					lightSize={950}
				/>
			</Shot>
			<Shot from={54} dur={64}>
				<DetailShot
					product={product}
					focus="ink"
					zoom={4200}
					head={0.3}
					duration={64}
					target={[0.62, 0.82]}
					drift={[50, 0]}
					light={[
						[0.3, 0.75],
						[0.5, 0.85],
					]}
					lightSize={1000}
				/>
			</Shot>
			<Shot from={104} dur={66} fadeOut={1}>
				<DetailShot
					product={product}
					focus="panel"
					zoom={4000}
					head={0.3}
					uv={1}
					duration={66}
					target={[0.76, 0.3]}
					drift={[0, 60]}
					light={[
						[0.72, 0.2],
						[0.78, 0.45],
					]}
					lightSize={800}
					darkness={0.98}
				/>
			</Shot>

			{/* SYMP'S */}
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingBottom: 170, opacity: 1 - wordOut}}>
				<RevealLine at={66} dur={44} blur={14} rise={0.35}>
					<Wordmark size={118} sweep={prog(f, 78, 118, ease.inOut)} />
				</RevealLine>
			</AbsoluteFill>

			{/* L'impression murale. Réinventée. */}
			<AbsoluteFill style={{justifyContent: 'center', paddingLeft: 230}}>
				<RevealLine at={114} dur={40}>
					<div style={{...fontBase, fontSize: 76, fontWeight: 600, letterSpacing: '-0.03em', color: C.ink, lineHeight: 1.1}}>
						L’impression murale.
					</div>
				</RevealLine>
				<RevealLine at={130} dur={40}>
					<div style={{...fontBase, fontSize: 76, fontWeight: 200, letterSpacing: '-0.03em', color: C.ink, lineHeight: 1.1}}>
						Réinventée.
					</div>
				</RevealLine>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
