import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Grain, Vignette} from '../symps/components/Stage';
import {PRODUCTS, productById} from '../symps/data/products';
import {ensureSympsFonts} from '../symps/fonts';
import {Intro3D, INTRO3D} from './film/Intro3D';
import {OPALINE3D, OpalineHero3D, PRODUCT3D, ProductShot3D} from './film/ProductShots3D';
import {BRAND3D, BrandCircle3D, EPSON3D, Epson3D, LINEUP3D, Lineup3D, PRINT3D, PrintDemo3D, TECH3D, Tech3D} from './film/Scenes3D';
import {OUTRO_DURATION, Outro} from '../symps/scenes/Outro';

/**
 * SYMP'S — the range, in 3D. Master timeline: segments play back to back
 * (hard cuts and whip-pans are built into the shots themselves).
 */
type Seg = {key: string; dur: number; render: () => React.ReactNode};

const shot = (id: string, move: 'drive' | 'orbit' | 'crane' | 'spin', look: 'studio' | 'bright' | 'edge' | 'red' = 'studio', textSide: 'left' | 'right' = 'left'): Seg => ({
	key: id,
	dur: PRODUCT3D,
	render: () => <ProductShot3D product={productById(id)} move={move} look={look} textSide={textSide} />,
});

export const SEGMENTS: Seg[] = [
	{key: 'intro', dur: INTRO3D, render: () => <Intro3D />},
	{key: 'opaline', dur: OPALINE3D, render: () => <OpalineHero3D product={productById('opaline')} />},
	shot('m1', 'drive', 'studio', 'right'),
	shot('graphite', 'orbit', 'studio', 'left'),
	shot('black-2', 'crane', 'edge', 'right'),
	{key: 'brand', dur: BRAND3D, render: () => <BrandCircle3D ids={['opaline', 'm1', 'graphite', 'black-2']} />},
	shot('white', 'spin', 'bright', 'left'),
	shot('t1000', 'crane', 'studio', 'right'),
	shot('access', 'drive', 'studio', 'left'),
	shot('ruby', 'orbit', 'red', 'right'),
	{key: 'print', dur: PRINT3D, render: () => <PrintDemo3D />},
	{key: 'tech', dur: TECH3D, render: () => <Tech3D />},
	{key: 'epson', dur: EPSON3D, render: () => <Epson3D />},
	{key: 'lineup', dur: LINEUP3D, render: () => <Lineup3D ids={PRODUCTS.map((p) => p.id)} />},
	{key: 'outro', dur: OUTRO_DURATION, render: () => <Outro />},
];

const starts = SEGMENTS.reduce<number[]>((acc, _s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + SEGMENTS[i - 1].dur], []);
export const SYMPS3D_DURATION = starts[starts.length - 1] + SEGMENTS[SEGMENTS.length - 1].dur;

export const SympsFilm3D: React.FC = () => {
	ensureSympsFonts();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{SEGMENTS.map((s, i) => (
				<Sequence key={s.key} name={s.key} from={starts[i]} durationInFrames={s.dur}>
					{s.render()}
				</Sequence>
			))}
			<Vignette strength={0.3} />
			<Grain opacity={0.06} />
		</AbsoluteFill>
	);
};
