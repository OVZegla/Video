import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, ease, prog} from '../theme';
import {Card} from '../components/Card';
import {HeroCard, ProductCard} from '../components/Cards';
import {EyeMark} from '../components/Logo';
import {Mug} from '../three/models/Mug';
import {EngravedAcrylic, PrintedAcrylic} from '../three/models/Acrylic';
import {LaserCutRosette, WoodPanel} from '../three/models/Wood';
import {BladeSign, DecorPanel, MetalPlaque} from '../three/models/Signage';
import {LaserCutting} from '../three/models/LaserCutting';

type SceneProps = {inAt: number; outAt: number};

/** Gentle product "turntable": settles from an angle, then sways slowly. */
const turn = (lf: number, base = 0, from = 0.6, sway = 0.22) =>
	base + from * (1 - prog(lf, 0, 70, ease.out)) + sway * Math.sin(lf / 55);

/* ------------------------------------------------ A — IMAGINEZ */
export const SceneA: React.FC<SceneProps> = ({inAt, outAt}) => (
	<>
		<Card i={0} inAt={inAt} outAt={outAt} accent={C.blue}>
			{(lf) => <HeroCard lf={lf} word="IMAGINEZ" sub={['Vos idées,', 'notre savoir-faire']} />}
		</Card>
		<Card i={1} inAt={inAt} outAt={outAt} accent={C.white}>
			{(lf) => (
				<ProductCard lf={lf} title="PLEXI IMPRIMÉ" accent={C.blue}>
					<PrintedAcrylic rotY={turn(lf, -0.15)} />
				</ProductCard>
			)}
		</Card>
		<Card i={2} inAt={inAt} outAt={outAt} accent={C.red}>
			{(lf) => (
				<ProductCard lf={lf} title={'OBJETS\nPERSONNALISÉS'} accent={C.white} camZ={5.6}>
					<Mug rotY={-1.35 + 1.1 * prog(lf, 0, 110, ease.out) + 0.1 * Math.sin(lf / 50)} />
				</ProductCard>
			)}
		</Card>
		<Card i={3} inAt={inAt} outAt={outAt} accent={C.blue}>
			{(lf) => (
				<ProductCard lf={lf} title="BOIS GRAVÉ" accent={C.red}>
					<WoodPanel rotY={turn(lf, 0.12, -0.6)} />
				</ProductCard>
			)}
		</Card>
		<Card i={4} inAt={inAt} outAt={outAt} accent={C.red}>
			{(lf) => (
				<ProductCard lf={lf} title={'PLEXI GRAVÉ\nLUMINEUX'} accent={C.blue}>
					<EngravedAcrylic rotY={turn(lf, -0.1, 0.5, 0.18)} glow={prog(lf, 30, 70, ease.inOut)} />
				</ProductCard>
			)}
		</Card>
	</>
);

/* ------------------------------------------------ B — PERSONNALISEZ */
export const SceneB: React.FC<SceneProps> = ({inAt, outAt}) => (
	<>
		<Card i={0} inAt={inAt} outAt={outAt} accent={C.blue}>
			{(lf) => (
				<ProductCard lf={lf} title={'PLAQUES\nPRO'} accent={C.white} camZ={7}>
					<MetalPlaque rotY={turn(lf, 0.1, -0.7)} />
				</ProductCard>
			)}
		</Card>
		<Card i={1} inAt={inAt} outAt={outAt} accent={C.white}>
			{(lf) => (
				<ProductCard lf={lf} title="ENSEIGNES" accent={C.red} camY={0.6}>
					<group position={[0.05, -0.1, 0]}>
						<BladeSign
							rotY={-0.35 + 0.12 * Math.sin(lf / 60)}
							swing={0.3 * Math.exp(-lf / 45) * Math.sin(lf / 8) + 0.03 * Math.sin(lf / 28)}
						/>
					</group>
				</ProductCard>
			)}
		</Card>
		<Card i={2} inAt={inAt} outAt={outAt} accent={C.red}>
			{(lf) => <HeroCard lf={lf} word="PERSONNALISEZ" sub={['Chaque pièce', 'est unique']} />}
		</Card>
		<Card i={3} inAt={inAt} outAt={outAt} accent={C.blue}>
			{(lf) => (
				<ProductCard lf={lf} title={'DÉCORS\nIMPRIMÉS'} accent={C.blue}>
					<DecorPanel rotY={turn(lf, -0.12)} />
				</ProductCard>
			)}
		</Card>
		<Card i={4} inAt={inAt} outAt={outAt} accent={C.red}>
			{(lf) => (
				<ProductCard lf={lf} title="DÉCOUPE LASER" accent={C.red} camZ={6.6}>
					<LaserCutRosette rotY={0.35 * Math.sin(lf / 40) + 0.9 * (1 - prog(lf, 0, 70, ease.out))} rotX={-0.15} />
				</ProductCard>
			)}
		</Card>
	</>
);

/* ------------------------------------------------ C — CRÉEZ · SANS LIMITES */
const LaserWindow: React.FC<{lf: number}> = ({lf}) => {
	const frame = useCurrentFrame();
	return (
		<ProductCard lf={lf} title={'FABRIQUÉ\nÀ BÉTHUNE'} accent={C.white} camZ={8.2} camY={1.4}>
			<LaserCutting cut={prog(lf, 24, 170, ease.soft)} frame={frame} />
		</ProductCard>
	);
};

export const SceneC: React.FC<SceneProps> = ({inAt, outAt}) => (
	<>
		<Card i={0} inAt={inAt} outAt={outAt} accent={C.blue}>
			{(lf) => <HeroCard lf={lf} word="CRÉEZ" sub={['Du prototype', 'à la série']} maxSize={64} />}
		</Card>
		<Card i={1} inAt={inAt} outAt={outAt} accent={C.white}>
			{(lf) => <LaserWindow lf={lf} />}
		</Card>
		<Card i={2} inAt={inAt} outAt={outAt} accent={C.red}>
			{(lf) => (
				<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<div style={{transform: `rotate(${prog(lf, 0, 80, ease.out) * 40 - 40}deg)`}}>
						<EyeMark size={104} p={prog(lf, 8, 70, ease.inOut)} />
					</div>
				</div>
			)}
		</Card>
		<Card i={3} inAt={inAt} outAt={outAt} accent={C.blue}>
			{(lf) => <HeroCard lf={lf} word="SANS" measure="LIMITES" />}
		</Card>
		<Card i={4} inAt={inAt} outAt={outAt} accent={C.red}>
			{(lf) => <HeroCard lf={lf} word="LIMITES" color={C.white} />}
		</Card>
	</>
);
