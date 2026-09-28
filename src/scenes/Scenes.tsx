import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, ease, prog} from '../theme';
import {Card} from '../components/Card';
import {HeroCard, ProductCard, spinIn} from '../components/Cards';
import {CrossLine, SWEEP_D} from '../components/Sweep';
import {EyeMark} from '../components/Logo';
import {Mug} from '../three/models/Mug';
import {EngravedAcrylic, PrintedAcrylic} from '../three/models/Acrylic';
import {LaserCutRosette, WoodPanel} from '../three/models/Wood';
import {BladeSign, DecorPanel, MetalPlaque} from '../three/models/Signage';
import {LaserCutting} from '../three/models/LaserCutting';

type SceneProps = {inAt: number; outAt: number};

/** Bauhaus lines that cross the storefront for the life of a scene. */
const SceneLines: React.FC<SceneProps & {lines: {d: string; color: string; width: number; opacity?: number; delay?: number}[]}> = ({inAt, outAt, lines}) => {
	const frame = useCurrentFrame();
	if (frame < inAt || frame > outAt + SWEEP_D) return null;
	return (
		<>
			{lines.map((l, k) => {
				const d0 = inAt + SWEEP_D * 0.6 + (l.delay ?? 0);
				const p = prog(frame, d0, d0 + 50, ease.inOut);
				const q = prog(frame, outAt - 34 + k * 4, outAt + 6 + k * 4, ease.inOut);
				return <CrossLine key={k} d={l.d} color={l.color} width={l.width} p={p} q={q} opacity={l.opacity} />;
			})}
		</>
	);
};

/* ------------------------------------------------ A — IMAGINEZ */
export const SceneA: React.FC<SceneProps> = ({inAt, outAt}) => (
	<>
		<SceneLines
			inAt={inAt}
			outAt={outAt}
			lines={[
				{d: 'M -20 262 C 160 150, 480 150, 660 262', color: C.sky, width: 2.5},
				{d: 'M -20 244 H 660', color: C.white, width: 1, opacity: 0.45, delay: 10},
			]}
		/>
		<Card i={0} inAt={inAt} outAt={outAt}>
			{(lf) => <HeroCard lf={lf} lines={['IMAGINEZ']} sub={['Vos idées,', 'notre savoir-faire']} />}
		</Card>
		<Card i={1} inAt={inAt} outAt={outAt}>
			{(lf) => (
				<ProductCard lf={lf} title={'PLEXI\nIMPRIMÉ'} accent={C.sky} floorY={-1.02}>
					<PrintedAcrylic rotY={spinIn(lf, -0.2, 0.3, 58)} />
				</ProductCard>
			)}
		</Card>
		<Card i={2} inAt={inAt} outAt={outAt}>
			{(lf) => (
				<ProductCard lf={lf} title={'OBJETS\nPERSONNALISÉS'} accent={C.white} camZ={6.6} floorY={-1}>
					<Mug rotY={-1.25 + 1.0 * prog(lf, 0, 120, ease.out) + 0.18 * Math.sin(lf / 50) + Math.PI * (1 - prog(lf, 0, 64, ease.out))} />
				</ProductCard>
			)}
		</Card>
		<Card i={3} inAt={inAt} outAt={outAt}>
			{(lf) => (
				<ProductCard lf={lf} title={'BOIS\nGRAVÉ'} accent={C.red} floorY={-1.02}>
					<WoodPanel rotY={spinIn(lf, 0.18, 0.28, 64)} />
				</ProductCard>
			)}
		</Card>
		<Card i={4} inAt={inAt} outAt={outAt}>
			{(lf) => (
				<ProductCard lf={lf} title={'PLEXI\nLUMINEUX'} accent={C.blue} floorY={-0.96}>
					<EngravedAcrylic rotY={spinIn(lf, -0.15, 0.25, 70)} glow={prog(lf, 30, 70, ease.inOut) * (0.85 + 0.15 * Math.sin(lf / 9))} />
				</ProductCard>
			)}
		</Card>
	</>
);

/* ------------------------------------------------ B — PERSONNALISEZ */
export const SceneB: React.FC<SceneProps> = ({inAt, outAt}) => (
	<>
		<SceneLines
			inAt={inAt}
			outAt={outAt}
			lines={[
				{d: 'M -20 40 H 236 V 278 H 660', color: C.blue, width: 3},
				{d: 'M -20 50 H 226 V 288 H 660', color: C.sky, width: 1.5, delay: 8},
			]}
		/>
		<Card i={0} inAt={inAt} outAt={outAt}>
			{(lf) => (
				<ProductCard lf={lf} title={'PLAQUES\nPRO'} accent={C.white} camZ={7.3}>
					<MetalPlaque rotY={spinIn(lf, 0.12, 0.3, 60)} />
				</ProductCard>
			)}
		</Card>
		<Card i={1} inAt={inAt} outAt={outAt}>
			{(lf) => (
				<ProductCard lf={lf} title="ENSEIGNES" accent={C.red} camZ={6.7} camY={0.5} lookY={-0.2}>
					<group position={[0.05, -0.15, 0]}>
						<BladeSign
							rotY={-0.4 + 0.22 * Math.sin(lf / 60) + 1.4 * (1 - prog(lf, 0, 60, ease.out))}
							swing={0.32 * Math.exp(-lf / 50) * Math.sin(lf / 8) + 0.04 * Math.sin(lf / 26)}
						/>
					</group>
				</ProductCard>
			)}
		</Card>
		<Card i={2} inAt={inAt} outAt={outAt}>
			{(lf) => <HeroCard lf={lf} lines={['PERSON-', 'NALISEZ']} accentLine={1} sub={['Chaque pièce', 'est unique']} />}
		</Card>
		<Card i={3} inAt={inAt} outAt={outAt}>
			{(lf) => (
				<ProductCard lf={lf} title={'DÉCORS\nIMPRIMÉS'} accent={C.sky} floorY={-1.02}>
					<DecorPanel rotY={spinIn(lf, -0.15, 0.3, 62)} />
				</ProductCard>
			)}
		</Card>
		<Card i={4} inAt={inAt} outAt={outAt}>
			{(lf) => (
				<ProductCard lf={lf} title={'DÉCOUPE\nLASER'} accent={C.red} camZ={6.8} floorY={-1.0}>
					<LaserCutRosette rotY={spinIn(lf, 0.2, 0.45, 44)} />
				</ProductCard>
			)}
		</Card>
	</>
);

/* ------------------------------------------------ C — CRÉEZ · SANS LIMITES */
const LaserWindow: React.FC<{lf: number}> = ({lf}) => {
	const frame = useCurrentFrame();
	return (
		<ProductCard lf={lf} title={'FABRIQUÉ\nÀ BÉTHUNE'} accent={C.white} camZ={8.6} camY={1.8} lookY={0}>
			<LaserCutting cut={prog(lf, 20, 180, ease.soft)} frame={frame} />
		</ProductCard>
	);
};

export const SceneC: React.FC<SceneProps> = ({inAt, outAt}) => (
	<>
		<SceneLines
			inAt={inAt}
			outAt={outAt}
			lines={[
				{d: 'M -20 236 H 700', color: C.red, width: 3},
				{d: 'M -20 60 L 256 60 L 384 36 L 660 36', color: C.sky, width: 2, delay: 12},
			]}
		/>
		<Card i={0} inAt={inAt} outAt={outAt}>
			{(lf) => <HeroCard lf={lf} lines={['CRÉEZ']} sub={['Du prototype', 'à la série']} maxSize={78} />}
		</Card>
		<Card i={1} inAt={inAt} outAt={outAt}>
			{(lf) => <LaserWindow lf={lf} />}
		</Card>
		<Card i={2} inAt={inAt} outAt={outAt}>
			{(lf) => (
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<div style={{position: 'absolute', width: 118, height: 118, borderRadius: '50%', border: `2px solid ${C.ice}`, opacity: prog(lf, 20, 50), transform: `scale(${0.8 + 0.2 * prog(lf, 20, 60, ease.out) + 0.03 * Math.sin(lf / 20)})`}} />
					<div style={{transform: `rotate(${(1 - prog(lf, 0, 90, ease.out)) * -120 + 6 * Math.sin(lf / 45)}deg)`}}>
						<EyeMark size={112} p={prog(lf, 6, 70, ease.inOut)} />
					</div>
				</div>
			)}
		</Card>
		<Card i={3} inAt={inAt} outAt={outAt}>
			{(lf) => <HeroCard lf={lf} lines={['SANS']} measure="LIMITES" />}
		</Card>
		<Card i={4} inAt={inAt} outAt={outAt}>
			{(lf) => <HeroCard lf={lf} lines={['LIMITES']} accentLine={0} />}
		</Card>
	</>
);
