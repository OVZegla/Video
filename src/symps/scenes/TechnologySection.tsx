import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {DetailShot} from '../components/DetailShot';
import {Mural} from '../components/Mural';
import {fontBase} from '../components/Typography';
import type {Product} from '../data/products';
import {C, HEIGHT, WIDTH, ease, inOut, lerp, prog} from '../theme';

export const BEAT = 44;
const WORDS = ['PRÉCISION', 'COULEUR', 'TECHNOLOGIE', 'CRÉATIVITÉ'] as const;
const WORD_Y = [0.5, 0.36, 0.68, 0.5];
export const TECH_DURATION = BEAT * WORDS.length + 8;

/** Underside of a print head: nozzle rows on brushed steel, a light grazing across. */
const NozzlePlate: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const t = prog(f, 0, dur, ease.camera);
	const sweep = lerp(-0.2, 1.2, prog(f, 0, dur, ease.inOut));
	const rows = 8;
	const cols = 90;
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: -100, transform: `translateX(${lerp(40, -40, t)}px) rotate(-8deg) scale(${lerp(1.08, 1.0, t)})`}}>
				<svg width={WIDTH + 200} height={HEIGHT + 200}>
					<defs>
						<linearGradient id="plate" x1="0" x2="1" y1="0" y2="0">
							<stop offset="0" stopColor="#15161A" />
							<stop offset={Math.max(0, sweep - 0.15)} stopColor="#1E2025" />
							<stop offset={Math.min(1, Math.max(0, sweep))} stopColor="#8A8F98" />
							<stop offset={Math.min(1, sweep + 0.15)} stopColor="#1E2025" />
							<stop offset="1" stopColor="#15161A" />
						</linearGradient>
					</defs>
					<rect x={0} y={380} width={WIDTH + 200} height={520} rx={16} fill="url(#plate)" />
					{Array.from({length: 40}).map((_, i) => (
						<rect key={i} x={0} y={390 + i * 13} width={WIDTH + 200} height={1} fill="#FFFFFF" opacity={0.025} />
					))}
					{Array.from({length: rows}).map((_, r) =>
						Array.from({length: cols}).map((__, c) => (
							<circle
								key={`${r}-${c}`}
								cx={40 + c * 24 + (r % 2) * 12}
								cy={470 + r * 44}
								r={3.2}
								fill="#050506"
								stroke="#9AA0AA"
								strokeOpacity={0.25}
								strokeWidth={0.8}
							/>
						)),
					)}
				</svg>
			</div>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 55% at 50% 55%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.95) 100%)'}} />
		</AbsoluteFill>
	);
};

const Word: React.FC<{text: string; dur: number; y: number}> = ({text, dur, y}) => {
	const f = useCurrentFrame();
	const p = prog(f, 4, 34, ease.out);
	const q = prog(f, dur - 10, dur, ease.inOut);
	return (
		<AbsoluteFill style={{alignItems: 'center'}}>
			<div
				style={{
					...fontBase,
					position: 'absolute',
					top: y * HEIGHT - 100,
					fontSize: 188,
					lineHeight: '200px',
					fontWeight: 600,
					color: C.ink,
					letterSpacing: `${lerp(0.14, -0.03, p)}em`,
					opacity: Math.min(prog(f, 4, 22, ease.inOut), 1 - q),
					filter: `blur(${(1 - p) * 16 + q * 8}px)`,
					transform: `scale(${lerp(1.04, 1, p)})`,
					whiteSpace: 'nowrap',
				}}
			>
				{text}
			</div>
		</AbsoluteFill>
	);
};

export const TechnologySection: React.FC<{product: Product}> = ({product}) => {
	const f = useCurrentFrame();
	const dur = BEAT + 8;
	const visuals = [
		<NozzlePlate key="n" dur={dur} />,
		<DetailShot key="c" product={product} focus="ink" zoom={5200} head={0.3} duration={dur} target={[0.5, 0.74]} drift={[-80, 0]} light={[[0.4, 0.74], [0.6, 0.74]]} lightSize={1300} rackFocus={false} />,
		<DetailShot key="u" product={product} focus="head" zoom={4600} head={0.3} uv={1} duration={dur} target={[0.5, 0.3]} drift={[70, 0]} light={[[0.4, 0.3], [0.6, 0.3]]} lightSize={1200} rackFocus={false} />,
		<CreativityWall key="w" dur={dur} />,
	];
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{WORDS.map((w, i) => {
				const from = i * BEAT;
				const o = inOut(f, from, from + 8, from + dur - 8, from + dur, ease.inOut);
				return (
					<Sequence key={w} from={from} durationInFrames={dur} layout="none">
						<AbsoluteFill style={{opacity: o}}>
							<AbsoluteFill style={{opacity: 0.55}}>{visuals[i]}</AbsoluteFill>
							<Word text={w} dur={dur} y={WORD_Y[i]} />
						</AbsoluteFill>
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};

const CreativityWall: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000', transform: `scale(${lerp(1.08, 1, prog(f, 0, dur, ease.camera))})`}}>
			<Mural style="blobs" palette={['#0B1020', '#2F7BFF', '#E0233D', '#7FAEFF', '#3B1E6B']} width={WIDTH} height={HEIGHT} print={prog(f, 0, dur - 6, ease.inOut)} swaths={14} />
		</AbsoluteFill>
	);
};
