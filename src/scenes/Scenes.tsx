import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, ease, prog} from '../theme';
import {HeroCard, ProductCard, SpanHero, spinIn} from '../components/Cards';
import {Motif, Ribbon} from '../components/Patterns';
import {Mug} from '../three/models/Mug';
import {EngravedAcrylic, PrintedAcrylic} from '../three/models/Acrylic';
import {LaserCutRosette, WoodPanel} from '../three/models/Wood';
import {BladeSign, DecorPanel, MetalPlaque} from '../three/models/Signage';
import {LaserCutting} from '../three/models/LaserCutting';
import {BacklitPanel, Claustra, MetalScreen} from '../three/models/Interior';
import {INK} from './palette';
import {Win} from './Win';

type SceneProps = {inAt: number; outAt: number};

/* ------------------------------------------------ A — IMAGINEZ */
const RIBBON_A: Ribbon = {y0: 70, amp: 38, waves: 1.25, n: 7, gap: 9, width: 4.5, tilt: 40};

export const SceneA: React.FC<SceneProps> = ({inAt, outAt}) => (
	<>
		<Win i={0} inAt={inAt} outAt={outAt} ground="blue" ribbon={RIBBON_A}
			motifs={[
				{kind: 'vstripes', x: 14, y: 236, w: 100, h: 84, n: 7, from: 'bottom'},
			]}
		>
			{(lf) => <HeroCard lf={lf} ink={INK.blue} lines={['IMAGINEZ']} sub={['Vos idées,', 'notre savoir-faire']} />}
		</Win>
		<Win i={1} inAt={inAt} outAt={outAt} ground="ice" ribbon={RIBBON_A}
			motifs={[{kind: 'quarter', cx: 128, cy: 320, r: 110, rot: 180}]}
		>
			{(lf) => (
				<ProductCard lf={lf} title={'PLEXI\nIMPRIMÉ'} ink={INK.ice} floorY={-1.02}>
					<PrintedAcrylic rotY={spinIn(lf, -0.2, 0.3, 58)} />
				</ProductCard>
			)}
		</Win>
		<Win i={2} inAt={inAt} outAt={outAt} ground="red" ribbon={RIBBON_A}
			motifs={[{kind: 'arcs', cx: 0, cy: 320, r: 120, n: 5, rot: -90}]}
		>
			{(lf) => (
				<ProductCard lf={lf} title={'OBJETS\nPERSONNALISÉS'} ink={INK.red} camZ={9.6} camY={1.9} lookY={-0.2} floorY={-0.9}>
					<Mug rotY={-1.1 + 0.55 * prog(lf, 0, 120, ease.out) + 0.22 * Math.sin(lf / 55) + Math.PI * 0.4 * (1 - prog(lf, 0, 64, ease.out))} />
				</ProductCard>
			)}
		</Win>
		<Win i={3} inAt={inAt} outAt={outAt} ground="white" ribbon={RIBBON_A}
			motifs={[{kind: 'tri', x: 16, y: 240, cell: 32, cols: 3, rows: 2}]}
		>
			{(lf) => (
				<ProductCard lf={lf} title={'BOIS\nGRAVÉ'} ink={INK.white} floorY={-1.02}>
					<WoodPanel rotY={spinIn(lf, 0.18, 0.28, 64)} />
				</ProductCard>
			)}
		</Win>
		<Win i={4} inAt={inAt} outAt={outAt} ground="deep" ribbon={RIBBON_A}
			motifs={[{kind: 'half', cx: 64, cy: 320, r: 60, rot: 0}]}
		>
			{(lf) => (
				<ProductCard lf={lf} title={'PLEXI\nLUMINEUX'} ink={INK.deep} floorY={-0.96}>
					<EngravedAcrylic rotY={spinIn(lf, -0.15, 0.25, 70)} glow={prog(lf, 30, 70, ease.inOut) * (0.85 + 0.15 * Math.sin(lf / 9))} />
				</ProductCard>
			)}
		</Win>
	</>
);

/* ------------------------------------------------ B — PERSONNALISEZ */
const RIBBON_B: Ribbon = {y0: 230, amp: 55, waves: 1, n: 8, gap: 8, width: 4, tilt: -80};

export const SceneB: React.FC<SceneProps> = ({inAt, outAt}) => (
	<>
		<Win i={0} inAt={inAt} outAt={outAt} ground="sky" ribbon={RIBBON_B}
			motifs={[{kind: 'half', cx: 0, cy: 70, r: 56, rot: 90}]}
		>
			{(lf) => (
				<ProductCard lf={lf} title={'PLAQUES\nPRO'} ink={INK.sky} camZ={7.3}>
					<MetalPlaque rotY={spinIn(lf, 0.12, 0.3, 60)} />
				</ProductCard>
			)}
		</Win>
		<Win i={1} inAt={inAt} outAt={outAt} ground="white" ribbon={RIBBON_B}
			motifs={[{kind: 'vstripes', x: 70, y: 0, w: 58, h: 70, n: 5}]}
		>
			{(lf) => (
				<ProductCard lf={lf} title="ENSEIGNES" ink={INK.white} camZ={6.7} camY={0.5} lookY={-0.2}>
					<group position={[0.05, -0.15, 0]}>
						<BladeSign
							rotY={-0.4 + 0.22 * Math.sin(lf / 60) + 0.9 * (1 - prog(lf, 0, 60, ease.out))}
							swing={0.32 * Math.exp(-lf / 50) * Math.sin(lf / 8) + 0.04 * Math.sin(lf / 26)}
						/>
					</group>
				</ProductCard>
			)}
		</Win>
		{/* PERSONNALISEZ spans the three right-hand windows, whole letters per window */}
		<Win i={2} inAt={inAt} outAt={outAt} ground="red" ribbon={RIBBON_B}
			motifs={[
				{kind: 'eye', cx: 64, cy: 50, r: 36, accent: C.white, hole: C.red},
				{kind: 'arcs', cx: 128, cy: 320, r: 90, n: 4, rot: 180},
			]}
		>
			{(lf) => <SpanHero lf={lf} word="PERSONNALISEZ" parts={3} part={0} ink={INK.red} />}
		</Win>
		<Win i={3} inAt={inAt} outAt={outAt} ground="blue" ribbon={RIBBON_B}
			motifs={[
				{kind: 'tri', x: 0, y: 0, cell: 32, cols: 4, rows: 2},
				{kind: 'vstripes', x: 14, y: 262, w: 100, h: 58, n: 7, from: 'bottom'},
			]}
		>
			{(lf) => <SpanHero lf={lf} word="PERSONNALISEZ" parts={3} part={1} ink={INK.red} sub={['Chaque pièce', 'est unique']} />}
		</Win>
		<Win i={4} inAt={inAt} outAt={outAt} ground="sky" ribbon={RIBBON_B}
			motifs={[
				{kind: 'quarter', cx: 128, cy: 0, r: 96, rot: 90},
				{kind: 'half', cx: 64, cy: 320, r: 50, rot: 0},
			]}
		>
			{(lf) => <SpanHero lf={lf} word="PERSONNALISEZ" parts={3} part={2} ink={INK.red} />}
		</Win>
	</>
);

/* ------------------------------------------------ D — DÉCOREZ : agencement, grands formats */
const RIBBON_D: Ribbon = {y0: 120, amp: 70, waves: 1.4, n: 7, gap: 9, width: 4.5, tilt: 60};

export const SceneD: React.FC<SceneProps> = ({inAt, outAt}) => (
	<>
		<Win i={0} inAt={inAt} outAt={outAt} ground="ice" ribbon={RIBBON_D}
			motifs={[{kind: 'half', cx: 128, cy: 60, r: 50, rot: -90}]}
		>
			{(lf) => (
				<ProductCard lf={lf} title={'CLAUSTRAS\nBOIS'} ink={INK.ice} camZ={7.4} floorY={-1.15}>
					<Claustra rotY={spinIn(lf, 0.35, 0.3, 64)} />
				</ProductCard>
			)}
		</Win>
		<Win i={1} inAt={inAt} outAt={outAt} ground="red" ribbon={RIBBON_D}
			motifs={[{kind: 'arcs', cx: 0, cy: 0, r: 100, n: 5, rot: 0}]}
		>
			{(lf) => (
				<ProductCard lf={lf} title={'MURS\nRÉTROÉCLAIRÉS'} ink={INK.red} camZ={8} floorY={-1.3}>
					<BacklitPanel rotY={spinIn(lf, -0.2, 0.25, 70)} glow={prog(lf, 24, 70, ease.inOut) * (0.9 + 0.1 * Math.sin(lf / 17))} />
				</ProductCard>
			)}
		</Win>
		<Win i={2} inAt={inAt} outAt={outAt} ground="blue" ribbon={RIBBON_D}
			motifs={[
				{kind: 'vstripes', x: 14, y: 0, w: 100, h: 64, n: 7},
				{kind: 'tri', x: 16, y: 256, cell: 32, cols: 3, rows: 2},
			]}
		>
			{(lf) => <HeroCard lf={lf} ink={INK.blue} lines={['DÉCOREZ']} sub={['Du petit objet', "à l'agencement", 'complet']} />}
		</Win>
		<Win i={3} inAt={inAt} outAt={outAt} ground="white" ribbon={RIBBON_D}
			motifs={[{kind: 'quarter', cx: 0, cy: 320, r: 110, rot: -90}]}
		>
			{(lf) => (
				<ProductCard lf={lf} title={'MÉTAL\nDÉCOUPÉ'} ink={INK.white} camZ={7.6} floorY={-1.1}>
					<MetalScreen rotY={spinIn(lf, 0.25, 0.3, 58)} glow={prog(lf, 30, 70, ease.inOut)} />
				</ProductCard>
			)}
		</Win>
		<Win i={4} inAt={inAt} outAt={outAt} ground="deep" ribbon={RIBBON_D}
			motifs={[{kind: 'eye', cx: 64, cy: 280, r: 40, accent: C.red, hole: C.blueDeep, pupil: C.white}]}
		>
			{(lf) => (
				<ProductCard lf={lf} title={'DÉCORS\nMURAUX'} ink={INK.deep} floorY={-1.02}>
					<DecorPanel rotY={spinIn(lf, -0.15, 0.3, 62)} />
				</ProductCard>
			)}
		</Win>
	</>
);

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
