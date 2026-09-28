import React from 'react';
import {C, ease, FONT, HEIGHT, prog, WIN_W} from '../theme';
import {DISPLAY} from '../fonts';
import {RiseLetters, useFitSize, useSplitFit} from './FitText';
import {Stage} from '../three/Stage';

const HERO_FONT = `800 extra-condensed {s}px ${DISPLAY}`;

export const Tricolour: React.FC<{p: number; width?: number; height?: number; mid?: string}> = ({p, width = 54, height = 4, mid = C.white}) => (
	<div style={{display: 'flex', width, height, transform: `scaleX(${p})`}}>
		<div style={{flex: 1, background: C.blue}} />
		<div style={{flex: 1, background: mid}} />
		<div style={{flex: 1, background: C.red}} />
	</div>
);

export type Ink = {text: string; sub: string; accent: string; plate: string};

/**
 * A typographic window: one word (or one word split over lines) sized to fill
 * the window width in condensed Archivo, on a solid plate that masks the
 * patterns behind it, with a tricolour rule and a subtitle.
 */
export const HeroCard: React.FC<{
	lf: number;
	lines: string[];
	ink: Ink;
	sub?: string[];
	maxSize?: number;
	accentLine?: number; // index of a line drawn in the accent colour
	measure?: string; // size as if the longest line were this (to match neighbours)
	kicker?: string; // small label above the rule, e.g. a category number
}> = ({lf, lines, ink, sub, maxSize = 96, accentLine, measure, kicker}) => {
	const longest = measure ?? lines.reduce((a, b) => (b.length > a.length ? b : a));
	const size = useFitSize(longest, HERO_FONT, WIN_W - 14, maxSize, 0.01);
	if (!size) return null;
	const plate = prog(lf, 0, 26, ease.out);
	const rule = prog(lf, 20, 44, ease.out);
	const subP = prog(lf, 28, 54, ease.out);
	const breathe = 1 + 0.018 * Math.sin(lf / 38);
	return (
		<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center'}}>
			<div
				style={{
					width: WIN_W,
					padding: '16px 0 18px',
					background: ink.plate,
					clipPath: `inset(0 ${(1 - plate) * 100}% 0 0)`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 11,
				}}
			>
				{kicker ? (
					<div style={{fontFamily: FONT, fontWeight: 600, fontSize: 13, letterSpacing: '0.3em', paddingLeft: '0.3em', color: ink.sub, opacity: rule}}>{kicker}</div>
				) : null}
				<Tricolour p={rule} mid={ink.plate === C.white ? C.sky : C.white} />
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${breathe})`}}>
					{lines.map((line, k) => (
						<RiseLetters
							key={k}
							text={line}
							lf={lf}
							start={6 + k * 8}
							ease={ease.out}
							stagger={2}
							dur={20}
							style={{
								fontFamily: DISPLAY,
								fontWeight: 800,
								fontStretch: '62%',
								fontSize: size,
								lineHeight: 0.98,
								letterSpacing: '0.01em',
								color: k === accentLine ? ink.accent : ink.text,
							}}
						/>
					))}
				</div>
				{sub ? (
					<div
						style={{
							fontFamily: FONT,
							fontWeight: 600,
							fontSize: 14.5,
							lineHeight: 1.3,
							color: ink.sub,
							textAlign: 'center',
							opacity: subP,
							transform: `translateY(${(1 - subP) * 10}px)`,
						}}
					>
						{sub.map((s, k) => (
							<div key={k}>{s}</div>
						))}
					</div>
				) : null}
			</div>
		</div>
	);
};

/**
 * A product window: a large photographic 3D stage and a caption on a plate.
 * The product arrives with a quarter-turn and settles; the camera keeps a slow orbit.
 */
export const ProductCard: React.FC<{
	lf: number;
	title: string;
	ink: Ink;
	camZ?: number;
	camY?: number;
	lookY?: number;
	floorY?: number;
	children: React.ReactNode;
}> = ({lf, title, ink, camZ = 7, camY = 1.0, lookY = -0.1, floorY, children}) => {
	const cap = prog(lf, 22, 46, ease.out);
	const settle = prog(lf, 0, 46, ease.out);
	const orbit = 0.16 * Math.sin(lf / 70);
	return (
		<>
			<div
				style={{
					position: 'absolute',
					top: 2,
					left: 0,
					transform: `translateY(${(1 - settle) * 26}px) scale(${0.86 + 0.14 * settle})`,
				}}
			>
				<Stage width={WIN_W} height={244} camZ={camZ - 0.25 * Math.sin(lf / 90)} camY={camY} lookY={lookY} orbit={orbit} floorY={floorY}>
					{children}
				</Stage>
			</div>
			<div
				style={{
					position: 'absolute',
					top: HEIGHT - 72,
					left: 0,
					width: WIN_W,
					height: 60,
					background: ink.plate,
					clipPath: `inset(0 ${(1 - cap) * 100}% 0 0)`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 6,
				}}
			>
				<div style={{width: 30 * cap, height: 3, background: ink.accent}} />
				<div
					style={{
						fontFamily: DISPLAY,
						fontWeight: 800,
						fontStretch: '62%',
						fontSize: 19,
						letterSpacing: '0.05em',
						color: ink.text,
						textAlign: 'center',
						lineHeight: 1.05,
						whiteSpace: 'pre-line',
					}}
				>
					{title}
				</div>
			</div>
		</>
	);
};

/** Entry spin for products: a quarter-turn that eases into the resting angle (the back never shows). */
export const spinIn = (lf: number, base = 0, sway = 0.25, period = 60) =>
	base + Math.PI * 0.45 * (1 - prog(lf, 0, 64, ease.out)) + sway * Math.sin(lf / period);

/**
 * One slice of a word that spans several adjacent windows. Each window shows
 * whole letters only, justified across its width, on the same plate colour,
 * so the word reads as one line across the storefront.
 */
export const SpanHero: React.FC<{
	lf: number;
	word: string;
	parts: number; // how many windows the word spans
	part: number; // which slice this window shows
	ink: Ink;
	sub?: string[];
	maxSize?: number;
}> = ({lf, word, parts, part, ink, sub, maxSize = 92}) => {
	const fit = useSplitFit(word, parts, HERO_FONT, WIN_W - 6, maxSize);
	if (!fit) return null;
	const letters = fit.groups[part].split('');
	const plate = prog(lf, 0, 26, ease.out);
	const rule = prog(lf, 20, 44, ease.out);
	const subP = prog(lf, 28, 54, ease.out);
	return (
		<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center'}}>
			<div
				style={{
					width: WIN_W,
					padding: '16px 0 18px',
					background: ink.plate,
					clipPath: `inset(0 ${(1 - plate) * 100}% 0 0)`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 11,
				}}
			>
				<div style={{height: 4, display: 'flex', alignItems: 'center'}}>
					{part === Math.floor(parts / 2) ? <Tricolour p={rule} mid={ink.plate === C.white ? C.sky : C.white} /> : null}
				</div>
				<div
					style={{
						width: WIN_W - 6,
						display: 'flex',
						justifyContent: letters.length > 1 ? 'space-between' : 'center',
						overflow: 'hidden',
						fontFamily: DISPLAY,
						fontWeight: 800,
						fontStretch: '62%',
						fontSize: fit.size,
						lineHeight: 0.98,
						color: ink.text,
					}}
				>
					{letters.map((ch, k) => {
						const t = Math.max(0, Math.min(1, (lf - 6 - k * 3) / 22));
						return (
							<span key={k} style={{display: 'inline-block', transform: `translateY(${(1 - ease.out(t)) * 110}%)`}}>
								{ch}
							</span>
						);
					})}
				</div>
				<div
					style={{
						minHeight: 38, // same height in every slice so the letters line up across windows
						fontFamily: FONT,
						fontWeight: 600,
						fontSize: 14.5,
						lineHeight: 1.3,
						color: ink.sub,
						textAlign: 'center',
						opacity: subP,
					}}
				>
					{sub ? sub.map((s, k) => <div key={k}>{s}</div>) : null}
				</div>
			</div>
		</div>
	);
};
