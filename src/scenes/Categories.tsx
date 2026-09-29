import React from 'react';
import {C, ease, HEIGHT, prog} from '../theme';
import {HeroCard, ProductCard, SpanHero, spinIn} from '../components/Cards';
import {Motif, Ribbon} from '../components/Patterns';
import {Mug} from '../three/models/Mug';
import {Bottle, Cap, Keychains, ToteBag, TShirt} from '../three/models/SmallObjects';
import {BladeSign, DecorPanel, MetalPlaque} from '../three/models/Signage';
import {BrassPlaque, DoorPlate, EventCup, LitAcrylic, LitDesign, PlaceCards, StreetSign, Totem, WeddingSign} from '../three/models/Events';
import {BacklitPanel, MetalScreen, PalmClaustra} from '../three/models/Interior';
import {PrintedAcrylic} from '../three/models/Acrylic';
import {WoodPanel} from '../three/models/Wood';
import {Ground, INK} from './palette';
import {Win} from './Win';

type SceneProps = {inAt: number; outAt: number};

/** A product shown in a window: its caption, camera framing and 3D model. */
type Item = {
	title: string;
	camZ?: number;
	camY?: number;
	lookY?: number;
	floorY?: number;
	model: (lf: number) => React.ReactNode;
};

const SWAP = 150; // frames after which a window with two items swaps to the second
const SWAP_WIPE = 18;

/** Shows item `a`, then wipes (bottom → top) to item `b` halfway through the scene. */
const ItemWindow: React.FC<{lf: number; ground: Ground; a: Item; b?: Item}> = ({lf, ground, a, b}) => {
	const ink = INK[ground];
	const card = (it: Item, t: number) => (
		<ProductCard lf={t} title={it.title} ink={ink} camZ={it.camZ} camY={it.camY} lookY={it.lookY} floorY={it.floorY}>
			{it.model(t)}
		</ProductCard>
	);
	if (!b || lf < SWAP) return card(a, lf);
	const w = prog(lf, SWAP, SWAP + SWAP_WIPE, ease.inOut);
	return (
		<>
			{w < 1 ? <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 0 ${w * 100}% 0)`}}>{card(a, lf)}</div> : null}
			<div style={{position: 'absolute', inset: 0, clipPath: `inset(${(1 - w) * 100}% 0 0 0)`}}>{card(b, lf - SWAP)}</div>
			{w > 0 && w < 1 ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: (1 - w) * HEIGHT - 2, height: 4, background: ink.accent}} />
			) : null}
		</>
	);
};

type Slot =
	| {kind: 'header'; ground: Ground; kicker: string; lines: string[]; measure?: string; motifs?: Motif[]}
	| {kind: 'item'; ground: Ground; a: Item; b?: Item; motifs?: Motif[]};

const CategoryScene: React.FC<SceneProps & {slots: Slot[]; ribbon?: Ribbon}> = ({inAt, outAt, slots, ribbon}) => (
	<>
		{slots.map((s, i) => (
			<Win key={i} i={i} inAt={inAt} outAt={outAt} ground={s.ground} ribbon={ribbon} motifs={s.motifs}>
				{(lf) =>
					s.kind === 'header' ? (
						<HeroCard lf={lf} ink={INK[s.ground]} kicker={s.kicker} lines={s.lines} measure={s.measure} sub={['Exemples', 'de réalisations']} />
					) : (
						<ItemWindow lf={lf} ground={s.ground} a={s.a} b={s.b} />
					)
				}
			</Win>
		))}
	</>
);

/* ------------------------------------------------ intro: IMAGINEZ · PERSONNALISEZ */
const RIBBON_I: Ribbon = {y0: 230, amp: 55, waves: 1, n: 8, gap: 8, width: 4, tilt: -80};

export const SceneIntro: React.FC<SceneProps> = ({inAt, outAt}) => (
	<>
		<Win i={0} inAt={inAt} outAt={outAt} ground="blue" ribbon={RIBBON_I}
			motifs={[{kind: 'vstripes', x: 14, y: 250, w: 100, h: 70, n: 7, from: 'bottom'}]}
		>
			{(lf) => <HeroCard lf={lf} ink={INK.blue} lines={['IMAGINEZ']} sub={['Des idées', 'à l’infini']} />}
		</Win>
		<Win i={1} inAt={inAt} outAt={outAt} ground="white" ribbon={RIBBON_I}
			motifs={[
				{kind: 'eye', cx: 64, cy: 110, r: 52, accent: C.red, hole: C.white, pupil: C.blue},
				{kind: 'tri', x: 16, y: 240, cell: 32, cols: 3, rows: 2},
			]}
		/>
		<Win i={2} inAt={inAt} outAt={outAt} ground="red" ribbon={RIBBON_I}
			motifs={[{kind: 'arcs', cx: 128, cy: 320, r: 90, n: 4, rot: 180}]}
		>
			{(lf) => <SpanHero lf={lf} word="PERSONNALISEZ" parts={3} part={0} ink={INK.red} />}
		</Win>
		<Win i={3} inAt={inAt} outAt={outAt} ground="blue" ribbon={RIBBON_I}
			motifs={[{kind: 'tri', x: 0, y: 0, cell: 32, cols: 4, rows: 2}]}
		>
			{(lf) => <SpanHero lf={lf} word="PERSONNALISEZ" parts={3} part={1} ink={INK.red} sub={['Tout', 'se personnalise']} />}
		</Win>
		<Win i={4} inAt={inAt} outAt={outAt} ground="sky" ribbon={RIBBON_I}
			motifs={[{kind: 'quarter', cx: 128, cy: 0, r: 96, rot: 90}, {kind: 'half', cx: 64, cy: 320, r: 50, rot: 0}]}
		>
			{(lf) => <SpanHero lf={lf} word="PERSONNALISEZ" parts={3} part={2} ink={INK.red} />}
		</Win>
	</>
);

/* ------------------------------------------------ 01 · petits objets */
const MUG_NAMES = ['Léa', 'Tom', 'Chloé', 'Hugo', 'Inès', 'Jules', 'Emma', 'Noah'];
const MUG_TURN = 72; // frames per revolution; the name changes while the print faces away

export const SceneSmall: React.FC<SceneProps> = (p) => (
	<CategoryScene
		{...p}
		ribbon={{y0: 60, amp: 36, waves: 1.3, n: 7, gap: 9, width: 4.5, tilt: 40}}
		slots={[
			{kind: 'header', ground: 'red', kicker: '01', lines: ['PETITS', 'OBJETS'], measure: 'OBJETS', motifs: [{kind: 'vstripes', x: 14, y: 250, w: 100, h: 70, n: 7, from: 'bottom'}]},
			{
				kind: 'item',
				ground: 'ice',
				motifs: [{kind: 'quarter', cx: 128, cy: 320, r: 100, rot: 180}],
				a: {
					title: 'MUGS',
					camZ: 9.4,
					camY: 1.9,
					lookY: -0.2,
					floorY: -0.9,
					// continuous turn; the name changes each time the print is at the back
					model: (lf) => (
						<Mug rotY={-0.5 + (lf / MUG_TURN) * Math.PI * 2} names={MUG_NAMES} nameIndex={Math.floor((lf + MUG_TURN / 2) / MUG_TURN)} />
					),
				},
			},
			{
				kind: 'item',
				ground: 'blue',
				motifs: [{kind: 'arcs', cx: 0, cy: 320, r: 110, n: 5, rot: -90}],
				a: {title: 'T-SHIRTS', camZ: 7.4, floorY: -1.25, model: (lf) => <TShirt rotY={spinIn(lf, -0.15, 0.2, 60)} swing={0.04 * Math.sin(lf / 22)} />},
				b: {title: 'TOTE BAGS', camZ: 7.2, floorY: -1.3, model: (lf) => <ToteBag rotY={spinIn(lf, 0.2, 0.25, 60)} swing={0.03 * Math.sin(lf / 25)} />},
			},
			{
				kind: 'item',
				ground: 'white',
				motifs: [{kind: 'tri', x: 16, y: 16, cell: 32, cols: 3, rows: 1}],
				a: {title: 'CASQUETTES', camZ: 6.2, camY: 1.4, floorY: -0.95, model: (lf) => <Cap rotY={-0.3 + 0.22 * Math.sin(lf / 45)} />},
				b: {title: 'GOURDES', camZ: 7.2, floorY: -1.12, model: (lf) => <Bottle rotY={spinIn(lf, -0.1, 0.35, 50)} name="Hugo" />},
			},
			{
				kind: 'item',
				ground: 'sky',
				motifs: [{kind: 'half', cx: 128, cy: 60, r: 50, rot: -90}],
				a: {title: 'PORTE-CLÉS', camZ: 7.6, camY: 1.2, lookY: 0.15, floorY: -1.1, model: (lf) => <Keychains rotY={0.25 * Math.sin(lf / 50)} t={lf} />},
			},
		]}
	/>
);

/* ------------------------------------------------ 02 · signalétique */
export const SceneSignage: React.FC<SceneProps> = (p) => (
	<CategoryScene
		{...p}
		ribbon={{y0: 250, amp: 45, waves: 1.1, n: 7, gap: 9, width: 4.5, tilt: -50}}
		slots={[
			{
				kind: 'item',
				ground: 'white',
				motifs: [{kind: 'vstripes', x: 0, y: 0, w: 128, h: 40, n: 9}],
				a: {title: 'PLAQUES\nPRO', camZ: 7.3, model: (lf) => <MetalPlaque rotY={spinIn(lf, 0.12, 0.3, 60)} />},
				b: {title: 'PLAQUES\nDE PORTE', camZ: 7.3, model: (lf) => <DoorPlate rotY={spinIn(lf, -0.12, 0.3, 60)} />},
			},
			{
				kind: 'item',
				ground: 'red',
				motifs: [{kind: 'arcs', cx: 0, cy: 0, r: 100, n: 5, rot: 0}],
				a: {
					title: 'ENSEIGNES',
					camZ: 6.7,
					camY: 0.5,
					lookY: -0.2,
					model: (lf) => (
						<group position={[0.05, -0.15, 0]}>
							<BladeSign rotY={-0.4 + 0.22 * Math.sin(lf / 60) + 0.9 * (1 - prog(lf, 0, 60, ease.out))} swing={0.32 * Math.exp(-lf / 50) * Math.sin(lf / 8) + 0.04 * Math.sin(lf / 26)} />
						</group>
					),
				},
			},
			{
				kind: 'item',
				ground: 'ice',
				motifs: [{kind: 'quarter', cx: 0, cy: 320, r: 100, rot: -90}],
				a: {title: 'TOTEMS\n& FLÉCHAGE', camZ: 7.6, floorY: -1.2, model: (lf) => <Totem rotY={spinIn(lf, 0.35, 0.3, 60)} />},
			},
			{
				kind: 'item',
				ground: 'sky',
				motifs: [{kind: 'tri', x: 16, y: 256, cell: 32, cols: 3, rows: 2}],
				a: {title: 'PLAQUES\nDE RUE', camZ: 7, model: (lf) => <StreetSign rotY={spinIn(lf, -0.15, 0.3, 60)} />},
				b: {title: 'PLEXI\nIMPRIMÉ', camZ: 7, floorY: -1.02, model: (lf) => <PrintedAcrylic rotY={spinIn(lf, -0.2, 0.3, 58)} />},
			},
			{kind: 'header', ground: 'blue', kicker: '02', lines: ['SIGNALÉTIQUE'], motifs: [{kind: 'half', cx: 64, cy: 0, r: 56, rot: 180}]},
		]}
	/>
);

/* ------------------------------------------------ 03 · déco & agencement */
export const SceneDeco: React.FC<SceneProps> = (p) => (
	<CategoryScene
		{...p}
		ribbon={{y0: 120, amp: 70, waves: 1.4, n: 7, gap: 9, width: 4.5, tilt: 60}}
		slots={[
			{kind: 'header', ground: 'deep', kicker: '03', lines: ['DÉCO', 'INTÉRIEURE'], measure: 'INTÉRIEURE', motifs: [{kind: 'vstripes', x: 14, y: 0, w: 100, h: 64, n: 7}]},
			{
				kind: 'item',
				ground: 'blue',
				motifs: [{kind: 'arcs', cx: 128, cy: 320, r: 100, n: 5, rot: 180}],
				a: {title: 'CLAUSTRAS', camZ: 8, floorY: -1.3, model: (lf) => <PalmClaustra rotY={spinIn(lf, 0.3, 0.3, 64)} glow={prog(lf, 20, 60, ease.inOut)} />},
			},
			{
				kind: 'item',
				ground: 'white',
				motifs: [{kind: 'tri', x: 16, y: 256, cell: 32, cols: 3, rows: 2}],
				a: {title: 'PLEXI\nDÉCORATIF', camZ: 7, floorY: -1.02, model: (lf) => <PrintedAcrylic rotY={spinIn(lf, -0.2, 0.3, 58)} />},
				b: {title: 'BOIS\nGRAVÉ', camZ: 7, floorY: -1.02, model: (lf) => <WoodPanel rotY={spinIn(lf, 0.18, 0.28, 64)} />},
			},
			{
				kind: 'item',
				ground: 'red',
				motifs: [{kind: 'quarter', cx: 0, cy: 0, r: 90, rot: 0}],
				a: {title: 'MÉTAL\nDÉCOUPÉ', camZ: 7.6, floorY: -1.1, model: (lf) => <MetalScreen rotY={spinIn(lf, 0.25, 0.3, 58)} glow={prog(lf, 30, 70, ease.inOut)} />},
				b: {title: 'MURS\nRÉTROÉCLAIRÉS', camZ: 8, floorY: -1.3, model: (lf) => <BacklitPanel rotY={spinIn(lf, -0.2, 0.25, 70)} glow={prog(lf, 24, 70, ease.inOut)} />},
			},
			{
				kind: 'item',
				ground: 'ice',
				motifs: [{kind: 'eye', cx: 64, cy: 50, r: 36, accent: C.red, hole: C.ice, pupil: C.blue}],
				a: {title: 'DÉCORS\nMURAUX', camZ: 7, floorY: -1.02, model: (lf) => <DecorPanel rotY={spinIn(lf, -0.15, 0.3, 62)} />},
			},
		]}
	/>
);

/* ------------------------------------------------ 04 · mariages & événements */
export const SceneEvents: React.FC<SceneProps> = (p) => (
	<CategoryScene
		{...p}
		ribbon={{y0: 200, amp: 60, waves: 1, n: 7, gap: 9, width: 4.5, tilt: -30}}
		slots={[
			{
				kind: 'item',
				ground: 'sky',
				motifs: [{kind: 'half', cx: 0, cy: 70, r: 56, rot: 90}],
				a: {title: 'GOBELETS', camZ: 6.6, floorY: -0.92, model: (lf) => <EventCup rotY={0.4 * Math.sin(lf / 45)} />},
			},
			{
				kind: 'item',
				ground: 'blue',
				motifs: [{kind: 'vstripes', x: 14, y: 262, w: 100, h: 58, n: 7, from: 'bottom'}],
				a: {title: 'PANNEAUX\nDE MARIAGE', camZ: 7.6, floorY: -1.3, model: (lf) => <WeddingSign rotY={spinIn(lf, 0.15, 0.25, 60)} />},
			},
			{
				kind: 'item',
				ground: 'white',
				motifs: [{kind: 'arcs', cx: 128, cy: 0, r: 100, n: 5, rot: 90}],
				a: {title: 'PLAQUES\nGRAVÉES', camZ: 7.2, model: (lf) => <BrassPlaque rotY={spinIn(lf, -0.15, 0.3, 60)} />},
			},
			{
				kind: 'item',
				ground: 'ice',
				motifs: [{kind: 'tri', x: 16, y: 16, cell: 32, cols: 3, rows: 1}],
				a: {title: 'MARQUE-\nPLACES', camZ: 7.4, camY: 2.2, floorY: -1.1, model: (lf) => <PlaceCards rotY={spinIn(lf, -0.25, 0.25, 60)} />},
			},
			{kind: 'header', ground: 'red', kicker: '04', lines: ['MARIAGES', 'FÊTES', 'SALONS'], measure: 'MARIAGES', motifs: [{kind: 'quarter', cx: 128, cy: 320, r: 100, rot: 180}]},
		]}
	/>
);

/* ------------------------------------------------ 05 · lumière: the storefront goes dark, panels light up */
const LIT: {design: LitDesign; delay: number}[] = [
	{design: 'logo', delay: 30},
	{design: 'bienvenue', delay: 55},
	{design: 'wedding', delay: 80},
	{design: 'open', delay: 105},
];

/** Switch-on with a short neon-like flicker, then steady. */
const ignite = (lf: number, delay: number) => {
	const t = lf - delay;
	if (t < 0) return 0;
	if (t < 14) return [0.6, 0.1, 0.9, 0.2, 1, 0.5, 1][Math.floor(t / 2)] ?? 1;
	return 1;
};

export const SceneLight: React.FC<SceneProps> = ({inAt, outAt}) => (
	<>
		{[0, 1, 3, 4].map((i, k) => (
			<Win key={i} i={i} inAt={inAt} outAt={outAt} ground="black">
				{(lf) => (
					<ProductCard lf={lf} title={['LOGO\nLUMINEUX', 'PLEXI\nGRAVÉ', 'CADEAUX\nMARIAGE', 'ENSEIGNE\nLED'][k]} ink={INK.black} camZ={7} camY={0.9}>
						<LitAcrylic design={LIT[k].design} on={ignite(lf, LIT[k].delay)} rotY={0.18 * Math.sin(lf / 70 + k)} />
					</ProductCard>
				)}
			</Win>
		))}
		<Win i={2} inAt={inAt} outAt={outAt} ground="black">
			{(lf) => <HeroCard lf={lf} ink={INK.black} kicker="05" lines={['PLEXI', 'LUMINEUX']} measure="LUMINEUX" sub={['Exemples', 'de réalisations']} />}
		</Win>
	</>
);
