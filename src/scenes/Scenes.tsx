import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, ease, prog} from '../theme';
import {HeroCard, ProductCard, spinIn} from '../components/Cards';
import {Motif, Ribbon} from '../components/Patterns';
import {LaserCutRosette} from '../three/models/Wood';
import {LaserCutting} from '../three/models/LaserCutting';
import {INK} from './palette';
import {Win} from './Win';

type SceneProps = {inAt: number; outAt: number};

/* ------------------------------------------------ E — the verbs of the showroom wall */
const RIBBON_E: Ribbon = {y0: 250, amp: 40, waves: 2, n: 6, gap: 8, width: 4};
const VERBS: {word: string; ground: 'red' | 'white' | 'blue' | 'sky' | 'deep'; motifs: Motif[]}[] = [
	{word: 'FABRIQUER', ground: 'red', motifs: [{kind: 'vstripes', x: 14, y: 0, w: 100, h: 80, n: 7}]},
	{word: 'SIGNALER', ground: 'white', motifs: [{kind: 'tri', x: 16, y: 16, cell: 32, cols: 3, rows: 2}]},
	{word: 'DÉCORER', ground: 'blue', motifs: [{kind: 'half', cx: 64, cy: 0, r: 60, rot: 180}]},
	{word: 'VALORISER', ground: 'sky', motifs: [{kind: 'arcs', cx: 128, cy: 0, r: 100, n: 5, rot: 90}]},
	{word: 'GRAVER', ground: 'deep', motifs: [{kind: 'eye', cx: 64, cy: 58, r: 40, accent: C.red, hole: C.blueDeep, pupil: C.white}]},
];

export const SceneE: React.FC<SceneProps> = ({inAt, outAt}) => (
	<>
		{VERBS.map((v, i) => (
			<Win key={v.word} i={i} inAt={inAt} outAt={outAt} ground={v.ground} ribbon={RIBBON_E} motifs={v.motifs}>
				{(lf) => <HeroCard lf={lf} ink={INK[v.ground]} lines={[v.word]} measure="VALORISER" />}
			</Win>
		))}
	</>
);

/* ------------------------------------------------ F — CRÉER AUJOURD'HUI UN DEMAIN PLUS BEAU */
const RIBBON_F: Ribbon = {y0: 70, amp: 50, waves: 1.1, n: 7, gap: 9, width: 4.5, tilt: -40};

export const SceneF: React.FC<SceneProps> = ({inAt, outAt}) => (
	<>
		<Win i={0} inAt={inAt} outAt={outAt} ground="blue" ribbon={RIBBON_F}
			motifs={[{kind: 'tri', x: 16, y: 256, cell: 32, cols: 3, rows: 2}]}
		>
			{(lf) => <HeroCard lf={lf} ink={INK.blue} lines={['CRÉER']} measure="DEMAIN" />}
		</Win>
		<Win i={1} inAt={inAt} outAt={outAt} ground="white" ribbon={RIBBON_F}
			motifs={[{kind: 'vstripes', x: 14, y: 262, w: 100, h: 58, n: 7, from: 'bottom'}]}
		>
			{(lf) => <HeroCard lf={lf} ink={INK.white} lines={["AUJOURD'HUI"]} />}
		</Win>
		<Win i={2} inAt={inAt} outAt={outAt} ground="red" ribbon={RIBBON_F}
			motifs={[{kind: 'half', cx: 64, cy: 320, r: 56, rot: 0}]}
		>
			{(lf) => <HeroCard lf={lf} ink={INK.red} lines={['UN', 'DEMAIN']} measure="DEMAIN" />}
		</Win>
		<Win i={3} inAt={inAt} outAt={outAt} ground="sky" ribbon={RIBBON_F}
			motifs={[{kind: 'arcs', cx: 0, cy: 320, r: 110, n: 5, rot: -90}]}
		>
			{(lf) => <HeroCard lf={lf} ink={INK.sky} lines={['PLUS']} measure="DEMAIN" />}
		</Win>
		<Win i={4} inAt={inAt} outAt={outAt} ground="blue" ribbon={RIBBON_F}
			motifs={[{kind: 'quarter', cx: 128, cy: 320, r: 100, rot: 180}]}
		>
			{(lf) => <HeroCard lf={lf} ink={INK.blue} lines={['BEAU']} measure="DEMAIN" accentLine={0} />}
		</Win>
	</>
);

/* ------------------------------------------------ C — CRÉEZ · SANS LIMITES */
const RIBBON_C: Ribbon = {y0: 160, amp: 95, waves: 0.9, n: 7, gap: 9, width: 4.5};

const LaserWindow: React.FC<{lf: number}> = ({lf}) => {
	const frame = useCurrentFrame();
	return (
		<ProductCard lf={lf} title={'FABRIQUÉ\nÀ BÉTHUNE'} ink={INK.ice} camZ={8.6} camY={1.8} lookY={0}>
			<LaserCutting cut={prog(lf, 20, 180, ease.soft)} frame={frame} />
		</ProductCard>
	);
};

export const SceneC: React.FC<SceneProps> = ({inAt, outAt}) => (
	<>
		<Win i={0} inAt={inAt} outAt={outAt} ground="red" ribbon={RIBBON_C}
			motifs={[{kind: 'half', cx: 64, cy: 0, r: 52, rot: 180}]}
		>
			{(lf) => <HeroCard lf={lf} ink={INK.red} lines={['CRÉEZ']} sub={['Du prototype', 'à la série']} maxSize={80} />}
		</Win>
		<Win i={1} inAt={inAt} outAt={outAt} ground="ice" ribbon={RIBBON_C}>
			{(lf) => <LaserWindow lf={lf} />}
		</Win>
		<Win i={2} inAt={inAt} outAt={outAt} ground="white"
			motifs={[
				{kind: 'vstripes', x: 0, y: 0, w: 128, h: 46, n: 9},
			]}
		>
			{(lf) => (
				<ProductCard lf={lf} title={'DÉCOUPE\nLASER'} ink={INK.white} camZ={6.8} floorY={-1.0}>
					<LaserCutRosette rotY={spinIn(lf, 0.2, 0.45, 44)} />
				</ProductCard>
			)}
		</Win>
		<Win i={3} inAt={inAt} outAt={outAt} ground="sky" ribbon={RIBBON_C}
			motifs={[{kind: 'tri', x: 16, y: 256, cell: 32, cols: 3, rows: 2}]}
		>
			{(lf) => <HeroCard lf={lf} ink={INK.sky} lines={['SANS']} measure="LIMITES" />}
		</Win>
		<Win i={4} inAt={inAt} outAt={outAt} ground="blue" ribbon={RIBBON_C}
			motifs={[{kind: 'quarter', cx: 128, cy: 320, r: 100, rot: 180}]}
		>
			{(lf) => <HeroCard lf={lf} ink={INK.blue} lines={['LIMITES']} />}
		</Win>
	</>
);
