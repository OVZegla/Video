import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, ease, FONT, HEIGHT, prog, WIN_W} from '../theme';
import {SweepBand} from '../components/Sweep';
import {HeroCard, SpanHero} from '../components/Cards';
import {Card} from '../components/Card';
import {Ribbon} from '../components/Patterns';
import {Lockup} from '../scenes/LogoRest';
import {Win} from '../scenes/Win';
import {Ground, INK} from '../scenes/palette';
import {DISPLAY} from '../fonts';
import {Laser, PanoCard, PanoStage, Sparks, winWX} from './Pano';
import {Backdrop, BurnLine, CutPanel, EngravePlate, useLogoMask, useNameMasks} from './Objects';
import {MatKind} from './materials';

/**
 * VISION URBAINE — la pub. A 50 s show across the five storefront windows.
 *
 *    0  blackout · a laser burns a line across all five windows → GRAVER · DÉCOUPER · PERSONNALISER
 *  150  band → TOUTES · LES · MATIÈRES          230 band → 5 materials engraved live (oak, alu, acrylic, slate, leather)
 *  420  band → DU PETIT · OBJET · AU · GRAND · FORMAT   500 band → a storefront-wide panel laser-cut, its holes open onto clear glass
 *  720  band → VOTRE · NOM · PARTOUT            800 band → the same name engraved/printed on five objects
 * 1020  band → cards flip: what we do, then who for
 * 1260  band → ENTREZ → · ← C'EST ICI · logo · UN PROJET ? · PARLONS-EN, fade to black → loop
 *
 * Text never crosses a gap between panels (single-window words, or whole-letter
 * splits over the three adjacent right-hand windows). The 3D stages are one
 * panoramic world seen through all five windows.
 */
export const PUB_DURATION = 1500;
const S = {a: 150, aPano: 230, b: 420, bPano: 500, c: 720, cPano: 800, d: 1020, e: 1260};
const SWEEPS = [S.a, S.aPano, S.b, S.bPano, S.c, S.cPano, S.d, S.e];

// world ↔ pixel: y_px = 160 - y * 40
const Y = (px: number) => (160 - px) / 40;

/* ------------------------------------------------ helpers */

/** A dark label plate at the bottom of a window, over the panorama. */
const Caption: React.FC<{i: number; lf: number; start: number; lines: string; dark?: boolean}> = ({i, lf, start, lines, dark = true}) => {
	const p = prog(lf, start, start + 22, ease.out);
	if (p <= 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: i * WIN_W,
				top: HEIGHT - 66,
				width: WIN_W,
				height: 56,
				background: dark ? 'rgba(0,0,0,0.78)' : C.white,
				clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 5,
			}}
		>
			<div style={{width: 26, height: 3, background: C.red}} />
			<div
				style={{
					fontFamily: DISPLAY,
					fontWeight: 800,
					fontStretch: '62%',
					fontSize: 18,
					letterSpacing: '0.05em',
					lineHeight: 1.05,
					color: dark ? C.white : C.blue,
					textAlign: 'center',
					whiteSpace: 'pre-line',
				}}
			>
				{lines}
			</div>
		</div>
	);
};

type Head = {ground: Ground; lines?: string[]; span?: {word: string; part: number}; measure?: string; sub?: string[]};

/** Headline row: one word per window (or a whole-letter split over W3–W5). */
const Headline: React.FC<{inAt: number; outAt: number; heads: Head[]; ribbon: Ribbon}> = ({inAt, outAt, heads, ribbon}) => (
	<>
		{heads.map((h, i) => (
			<Win key={i} i={i} inAt={inAt} outAt={outAt} ground={h.ground} ribbon={ribbon}>
				{(lf) =>
					h.span ? (
						<SpanHero lf={lf} word={h.span.word} parts={3} part={h.span.part} ink={INK[h.ground]} sub={h.sub} />
					) : (
						<HeroCard lf={lf} ink={INK[h.ground]} lines={h.lines ?? []} measure={h.measure} sub={h.sub} />
					)
				}
			</Win>
		))}
	</>
);

/* ------------------------------------------------ A · ignition */
const LINE_Y = Y(232);

const SegA: React.FC = () => {
	const frame = useCurrentFrame();
	const head = interpolate(frame, [8, 62], [-8.6, 8.6], {easing: ease.inOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const laserOn = prog(frame, 4, 10) * (1 - prog(frame, 62, 70));
	const cool = prog(frame, 60, 140);
	return (
		<>
			<PanoCard inAt={null} outAt={S.a}>
				{() => (
					<PanoStage bloom={1.4}>
						<BurnLine head={head} y={LINE_Y} cool={cool} />
						{laserOn > 0 ? (
							<>
								<Laser from={[head, LINE_Y + 1.6, 1.4]} to={[head, LINE_Y, 0.02]} on={laserOn} frame={frame} />
								<Sparks at={() => [head, LINE_Y, 0.05]} frame={frame} rate={laserOn} count={120} />
							</>
						) : null}
					</PanoStage>
				)}
			</PanoCard>
			{/* words rise from the burnt line */}
			{[
				{i: 0, el: (lf: number) => <HeroCard lf={lf} ink={INK.black} lines={['GRAVER']} measure="DÉCOUPER" />},
				{i: 1, el: (lf: number) => <HeroCard lf={lf} ink={INK.black} lines={['DÉCOUPER']} measure="DÉCOUPER" />},
				{i: 2, el: (lf: number) => <SpanHero lf={lf} word="PERSONNALISER" parts={3} part={0} ink={INK.black} />},
				{i: 3, el: (lf: number) => <SpanHero lf={lf} word="PERSONNALISER" parts={3} part={1} ink={INK.black} />},
				{i: 4, el: (lf: number) => <SpanHero lf={lf} word="PERSONNALISER" parts={3} part={2} ink={INK.black} />},
			].map(({i, el}) => {
				const start = 22 + i * 9; // follows the laser head from left to right
				if (frame < start) return null;
				const lf = frame - start;
				const clip = prog(lf, 0, 22, ease.out);
				// Card clips the word away as the tricolour band passes at S.a
				return (
					<Card key={i} i={i} inAt={null} outAt={S.a}>
						{() => (
							<div style={{position: 'absolute', left: 0, top: 0, width: WIN_W, height: 222, clipPath: `inset(${(1 - clip) * 100}% 0 0 0)`}}>
								<div style={{position: 'absolute', left: 0, top: 30, width: WIN_W, height: 200}}>{el(lf)}</div>
							</div>
						)}
					</Card>
				);
			})}
		</>
	);
};

/* ------------------------------------------------ B · materials engraved live */
const MATERIALS: {kind: MatKind; label: string}[] = [
	{kind: 'oak', label: 'BOIS'},
	{kind: 'alu', label: 'MÉTAL'},
	{kind: 'acrylic', label: 'PLEXI'},
	{kind: 'slate', label: 'ARDOISE'},
	{kind: 'leather', label: 'CUIR'},
];

const SegBPano: React.FC<{lf: number}> = ({lf}) => {
	const frame = useCurrentFrame();
	const mask = useLogoMask(820, 1050);
	const w = 2.4;
	const h = 3.0;
	const y0 = 0.75;
	return (
		<PanoStage bloom={1.2}>
			<Backdrop tint="#0b2a9a" />
			{MATERIALS.map((m, i) => {
				const t0 = 18 + i * 7;
				const pr = prog(lf, t0, t0 + 80);
				const turn = prog(lf, 110 + i * 4, 160 + i * 4, ease.inOut);
				const rotY = 0.45 * Math.sin(turn * Math.PI * 1.5) * turn;
				const x = winWX(i);
				const dotX = x + Math.sin(frame * 1.25 + i * 2) * w * 0.36;
				const dotY = y0 + h / 2 - pr * h;
				const on = pr > 0 && pr < 1 ? 1 : 0;
				return (
					<group key={m.kind}>
						<EngravePlate kind={m.kind} w={w} h={h} depth={m.kind === 'acrylic' ? 0.16 : 0.1} mask={mask} progress={pr} position={[x, y0, 0]} rotY={rotY} />
						{on ? (
							<>
								<Laser from={[dotX, y0 + h / 2 + 0.7, 1.3]} to={[dotX, dotY, 0.08]} on={1} frame={frame + i * 3} color={m.kind === 'acrylic' ? '#9fd0ff' : '#ff5a2a'} />
								<Sparks at={() => [dotX, dotY, 0.1]} frame={frame} rate={m.kind === 'acrylic' ? 0.25 : 0.6} count={40} seed={i + 3} />
							</>
						) : null}
					</group>
				);
			})}
		</PanoStage>
	);
};

const SegB: React.FC = () => (
	<>
		<Headline
			inAt={S.a}
			outAt={S.aPano}
			ribbon={{y0: 250, amp: 40, waves: 1.2, n: 7, gap: 9, width: 4.5}}
			heads={[
				{ground: 'red', lines: ['TOUTES'], measure: 'TOUTES'},
				{ground: 'white', lines: ['LES'], measure: 'TOUTES'},
				{ground: 'blue', span: {word: 'MATIÈRES', part: 0}},
				{ground: 'blue', span: {word: 'MATIÈRES', part: 1}},
				{ground: 'blue', span: {word: 'MATIÈRES', part: 2}},
			]}
		/>
		<PanoCard inAt={S.aPano} outAt={S.b}>
			{(lf) => (
				<>
					<SegBPano lf={lf} />
					{MATERIALS.map((m, i) => (
						<Caption key={m.kind} i={i} lf={lf} start={30 + i * 6} lines={m.label} />
					))}
				</>
			)}
		</PanoCard>
	</>
);

/* ------------------------------------------------ C · storefront-wide laser cut */
const SegCPano: React.FC<{lf: number}> = ({lf}) => {
	const frame = useCurrentFrame();
	const pr = prog(lf, 10, 150, ease.soft);
	const headX = -7.7 + pr * 15.4;
	const dotY = Math.sin(frame * 1.7) * 2.9;
	const cutting = pr > 0 && pr < 1;
	const camZ = 10 - 0.5 * Math.sin(prog(lf, 0, 220) * Math.PI);
	return (
		<PanoStage bloom={0.75} camZ={camZ} env={0.45}>
			<CutPanel progress={pr} />
			{/* gantry rail */}
			<mesh position={[0, 3.45, 0.7]}>
				<boxGeometry args={[16.4, 0.12, 0.12]} />
				<meshStandardMaterial color="#2a2c30" metalness={0.8} roughness={0.3} />
			</mesh>
			<Laser from={[headX, 3.25, 0.7]} to={[headX, dotY, 0.06]} on={cutting ? 1 : 0} frame={frame} />
			{cutting ? <Sparks at={() => [headX, dotY, 0.08]} frame={frame} rate={0.8} count={100} seed={9} /> : null}
		</PanoStage>
	);
};

const SegC: React.FC = () => (
	<>
		<Headline
			inAt={S.b}
			outAt={S.bPano}
			ribbon={{y0: 70, amp: 40, waves: 1.3, n: 7, gap: 9, width: 4.5, tilt: 40}}
			heads={[
				{ground: 'sky', lines: ['DU PETIT'], measure: 'DU PETIT'},
				{ground: 'white', lines: ['OBJET'], measure: 'DU PETIT'},
				{ground: 'red', lines: ['AU'], measure: 'FORMAT'},
				{ground: 'blue', lines: ['GRAND'], measure: 'FORMAT'},
				{ground: 'red', lines: ['FORMAT'], measure: 'FORMAT'},
			]}
		/>
		<PanoCard inAt={S.bPano} outAt={S.c}>
			{(lf) => (
				<>
					<SegCPano lf={lf} />
					<Caption i={0} lf={lf} start={170} lines="CLAUSTRAS" />
					<Caption i={2} lf={lf} start={176} lines={'SUR\nMESURE'} />
					<Caption i={4} lf={lf} start={182} lines="AGENCEMENT" />
				</>
			)}
		</PanoCard>
	</>
);

/* ------------------------------------------------ D · your name, everywhere */
const NAMES = ['Léa', 'Tom', 'VOTRE NOM'];
const OBJ: {kind: MatKind; shape: 'rect' | 'round' | 'tag'; w: number; h: number; label: string; print?: boolean}[] = [
	{kind: 'oak', shape: 'round', w: 2.2, h: 2.2, label: 'DESSOUS\nDE VERRE'},
	{kind: 'alu', shape: 'rect', w: 2.4, h: 1.5, label: 'CARTES\nMÉTAL'},
	{kind: 'white', shape: 'rect', w: 2.1, h: 2.6, label: 'IMPRESSION\nUV', print: true},
	{kind: 'slate', shape: 'rect', w: 2.2, h: 2.2, label: 'ARDOISES'},
	{kind: 'leather', shape: 'tag', w: 1.5, h: 2.5, label: 'PORTE-CLÉS\nCUIR'},
];
const CYCLE = 72;

const SegDPano: React.FC<{lf: number}> = ({lf}) => {
	const frame = useCurrentFrame();
	const masks = useNameMasks(NAMES, 900, 900);
	const printMasks = useNameMasks(NAMES, 900, 1100, true);
	return (
		<PanoStage bloom={1.1} threshold={0.93}>
			<Backdrop tint="#6a0f18" />
			{OBJ.map((o, i) => {
				const t = lf - 14 - i * 5;
				const cyc = Math.max(0, Math.min(NAMES.length - 1, Math.floor(t / CYCLE)));
				const ct = t - cyc * CYCLE;
				const pr = t < 0 ? 0 : prog(ct, 0, 40);
				// spin between names; the new mask takes over while edge-on
				const spin = cyc < NAMES.length - 1 ? prog(ct, 52, CYCLE, ease.inOut) : 0;
				const idx = spin > 0.5 ? Math.min(NAMES.length - 1, cyc + 1) : cyc;
				const progress = spin > 0.5 ? 0 : pr;
				const x = winWX(i);
				const y = 0.55;
				const dotX = x + Math.sin(frame * 1.3 + i) * o.w * 0.32;
				const dotY = y + o.h / 2 - pr * o.h;
				const on = t > 0 && pr > 0 && pr < 1 && spin === 0;
				return (
					<group key={i}>
						<EngravePlate
							kind={o.kind}
							shape={o.shape}
							w={o.w}
							h={o.h}
							depth={o.shape === 'round' ? 0.18 : 0.1}
							mask={(o.print ? printMasks : masks)[idx]}
							useMaskColor={o.print}
							progress={progress}
							position={[x, y, 0]}
							rotY={spin * Math.PI * 2 + 0.12 * Math.sin(lf / 40 + i)}
						/>
						{on ? (
							<>
								<Laser from={[dotX, y + o.h / 2 + 0.8, 1.3]} to={[dotX, dotY, 0.08]} on={1} frame={frame + i * 5} color={o.print ? '#9ab8ff' : '#ff5a2a'} />
								{o.print ? null : <Sparks at={() => [dotX, dotY, 0.1]} frame={frame} rate={0.5} count={36} seed={i + 20} />}
							</>
						) : null}
					</group>
				);
			})}
		</PanoStage>
	);
};

const SegD: React.FC = () => (
	<>
		<Headline
			inAt={S.c}
			outAt={S.cPano}
			ribbon={{y0: 230, amp: 55, waves: 1, n: 8, gap: 8, width: 4, tilt: -80}}
			heads={[
				{ground: 'blue', lines: ['VOTRE'], measure: 'VOTRE'},
				{ground: 'white', lines: ['NOM'], measure: 'VOTRE'},
				{ground: 'red', span: {word: 'PARTOUT', part: 0}},
				{ground: 'red', span: {word: 'PARTOUT', part: 1}, sub: ['Gravé, imprimé,', 'personnalisé']},
				{ground: 'red', span: {word: 'PARTOUT', part: 2}},
			]}
		/>
		<PanoCard inAt={S.cPano} outAt={S.d}>
			{(lf) => (
				<>
					<SegDPano lf={lf} />
					{OBJ.map((o, i) => (
						<Caption key={i} i={i} lf={lf} start={24 + i * 6} lines={o.label} />
					))}
				</>
			)}
		</PanoCard>
	</>
);

/* ------------------------------------------------ E · flip cards */
const FACE_A: {ground: Ground; word: string}[] = [
	{ground: 'red', word: 'CONSEIL'},
	{ground: 'white', word: 'DESIGN'},
	{ground: 'blue', word: 'GRAVURE'},
	{ground: 'sky', word: 'DÉCOUPE'},
	{ground: 'red', word: 'IMPRESSION'},
];
const FACE_B: {ground: Ground; word: string}[] = [
	{ground: 'blue', word: 'PARTICULIERS'},
	{ground: 'red', word: 'COMMERÇANTS'},
	{ground: 'white', word: 'ENTREPRISES'},
	{ground: 'blue', word: 'ASSOCIATIONS'},
	{ground: 'sky', word: 'COLLECTIVITÉS'},
];

const Flip: React.FC<{i: number; lf: number}> = ({i, lf}) => {
	const f = prog(lf, 110 + i * 6, 134 + i * 6, ease.inOut);
	const ang = f * 180;
	const face = (g: Ground, word: string, kicker: string, back: boolean, t: number) => (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				backfaceVisibility: 'hidden',
				transform: back ? 'rotateY(180deg)' : undefined,
				background: INK[g].plate,
			}}
		>
			<HeroCard lf={t} ink={INK[g]} lines={[word]} kicker={kicker} measure={back ? 'COLLECTIVITÉS' : 'IMPRESSION'} />
		</div>
	);
	return (
		<div style={{position: 'absolute', inset: 0, perspective: 500}}>
			<div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${ang}deg)`}}>
				{face(FACE_A[i].ground, FACE_A[i].word, 'NOS MÉTIERS', false, lf)}
				{face(FACE_B[i].ground, FACE_B[i].word, 'POUR LES', true, lf - 120 - i * 6)}
			</div>
		</div>
	);
};

const SegE: React.FC = () => (
	<>
		{FACE_A.map((f, i) => (
			<Win key={i} i={i} inAt={S.d} outAt={S.e} ground={f.ground} ribbon={{y0: 60, amp: 30, waves: 2, n: 6, gap: 8, width: 4}}>
				{(lf) => <Flip i={i} lf={lf} />}
			</Win>
		))}
	</>
);

/* ------------------------------------------------ F · call to action */
const Arrow: React.FC<{dir: 1 | -1; lf: number; color: string}> = ({dir, lf, color}) => {
	const bounce = 8 * Math.sin(lf / 6) * prog(lf, 20, 40);
	return (
		<svg width={90} height={50} viewBox="0 0 90 50" style={{transform: `translateX(${dir * bounce}px) scaleX(${dir})`}}>
			<path d="M 4 25 H 70 M 50 6 L 76 25 L 50 44" fill="none" stroke={color} strokeWidth={9} strokeLinecap="square" />
		</svg>
	);
};

const CtaWord: React.FC<{lf: number; g: Ground; lines: string[]; measure: string; arrow?: 1 | -1}> = ({lf, g, lines, measure, arrow}) => (
	<>
		<HeroCard lf={lf} ink={INK[g]} lines={lines} measure={measure} />
		{arrow ? (
			<div style={{position: 'absolute', left: 0, right: 0, top: 232, display: 'flex', justifyContent: 'center', opacity: prog(lf, 16, 30)}}>
				<Arrow dir={arrow} lf={lf} color={INK[g].text} />
			</div>
		) : null}
	</>
);

const SegF: React.FC = () => {
	const frame = useCurrentFrame();
	const fade = prog(frame, PUB_DURATION - 28, PUB_DURATION - 2, ease.inOut);
	return (
		<>
			<Win i={0} inAt={S.e} outAt={null} ground="red" ribbon={{y0: 60, amp: 35, waves: 1.2, n: 7, gap: 9, width: 4.5}}>
				{(lf) => <CtaWord lf={lf} g="red" lines={['ENTREZ']} measure="C'EST ICI" arrow={1} />}
			</Win>
			<Win i={1} inAt={S.e} outAt={null} ground="white" ribbon={{y0: 60, amp: 35, waves: 1.2, n: 7, gap: 9, width: 4.5}}>
				{(lf) => <CtaWord lf={lf} g="white" lines={["C'EST ICI"]} measure="C'EST ICI" arrow={-1} />}
			</Win>
			<Win i={2} inAt={S.e} outAt={null} ground="blue">
				{(lf) => <Lockup lf={lf} />}
			</Win>
			<Win i={3} inAt={S.e} outAt={null} ground="sky" ribbon={{y0: 260, amp: 30, waves: 1.2, n: 7, gap: 9, width: 4.5}}>
				{(lf) => <CtaWord lf={lf} g="sky" lines={['UN', 'PROJET ?']} measure="PARLONS" />}
			</Win>
			<Win i={4} inAt={S.e} outAt={null} ground="red" ribbon={{y0: 260, amp: 30, waves: 1.2, n: 7, gap: 9, width: 4.5}}>
				{(lf) => <CtaWord lf={lf} g="red" lines={['PARLONS', 'EN !']} measure="PARLONS" />}
			</Win>
			{/* fade to black: the loop restarts on the laser in the dark */}
			<AbsoluteFill style={{background: '#000', opacity: fade}} />
		</>
	);
};

/* ------------------------------------------------ composition */
export const VisionUrbainePub: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: C.black, fontFamily: FONT}}>
		<SegA />
		<SegB />
		<SegC />
		<SegD />
		<SegE />
		<SegF />
		{SWEEPS.map((s) => (
			<SweepBand key={s} at={s} />
		))}
	</AbsoluteFill>
);

