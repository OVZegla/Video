import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, ease, HEIGHT, prog, WIN_W} from '../theme';
import {HeroCard, ProductCard, spinIn} from '../components/Cards';
import {MotifShape, Ribbon} from '../components/Patterns';
import {Mug} from '../three/models/Mug';
import {EngravedAcrylic, PrintedAcrylic} from '../three/models/Acrylic';
import {LaserCutRosette, WoodPanel} from '../three/models/Wood';
import {BladeSign, DecorPanel, MetalPlaque} from '../three/models/Signage';
import {LaserCutting} from '../three/models/LaserCutting';
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
		<Win i={2} inAt={inAt} outAt={outAt} ground="red" ribbon={RIBBON_B}
			motifs={[
				{kind: 'eye', cx: 64, cy: 44, r: 34, accent: C.white, hole: C.red},
				{kind: 'arcs', cx: 128, cy: 320, r: 90, n: 4, rot: 180},
			]}
		>
			{(lf) => <HeroCard lf={lf} ink={INK.red} lines={['PERSON-', 'NALISEZ']} accentLine={1} sub={['Chaque pièce', 'est unique']} />}
		</Win>
		<Win i={3} inAt={inAt} outAt={outAt} ground="ice" ribbon={RIBBON_B}
			motifs={[{kind: 'tri', x: 0, y: 0, cell: 32, cols: 4, rows: 1}]}
		>
			{(lf) => (
				<ProductCard lf={lf} title={'DÉCORS\nIMPRIMÉS'} ink={INK.ice} floorY={-1.02}>
					<DecorPanel rotY={spinIn(lf, -0.15, 0.3, 62)} />
				</ProductCard>
			)}
		</Win>
		<Win i={4} inAt={inAt} outAt={outAt} ground="blue" ribbon={RIBBON_B}
			motifs={[{kind: 'quarter', cx: 128, cy: 0, r: 96, rot: 90}]}
		>
			{(lf) => (
				<ProductCard lf={lf} title={'DÉCOUPE\nLASER'} ink={INK.blue} camZ={6.8} floorY={-1.0}>
					<LaserCutRosette rotY={spinIn(lf, 0.2, 0.45, 44)} />
				</ProductCard>
			)}
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

const BigEye: React.FC<{lf: number}> = ({lf}) => (
	<svg width={WIN_W} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
		<g transform={`rotate(${6 * Math.sin(lf / 45)} 64 160)`}>
			<MotifShape
				m={{kind: 'eye', cx: 64, cy: 160, r: 56, accent: C.red, hole: C.white, pupil: C.blue}}
				color={C.brandNavy}
				p={prog(lf, 6, 60, ease.soft)}
			/>
		</g>
	</svg>
);

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
				{kind: 'vstripes', x: 0, y: 274, w: 128, h: 46, n: 9, from: 'bottom'},
			]}
		>
			{(lf) => <BigEye lf={lf} />}
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
