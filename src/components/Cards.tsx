import React from 'react';
import {C, ease, FONT, HEIGHT, prog, WIN_W} from '../theme';
import {DISPLAY} from '../fonts';
import {RiseLetters, useFitSize} from './FitText';
import {Stage} from '../three/Stage';

const HERO_FONT = `800 extra-condensed {s}px ${DISPLAY}`;

export const Tricolour: React.FC<{p: number; width?: number; height?: number}> = ({p, width = 54, height = 4}) => (
	<div style={{display: 'flex', width, height, transform: `scaleX(${p})`}}>
		<div style={{flex: 1, background: C.blue}} />
		<div style={{flex: 1, background: C.white}} />
		<div style={{flex: 1, background: C.red}} />
	</div>
);

/**
 * A typographic window: one word (or one word split over lines) sized to fill
 * the window width in condensed Archivo, a tricolour rule and a subtitle.
 */
export const HeroCard: React.FC<{
	lf: number;
	lines: string[];
	sub?: string[];
	maxSize?: number;
	color?: string;
	accentLine?: number; // index of a line drawn in light blue
	measure?: string; // size as if the longest line were this (to match neighbours)
}> = ({lf, lines, sub, maxSize = 96, color = C.white, accentLine, measure}) => {
	const longest = measure ?? lines.reduce((a, b) => (b.length > a.length ? b : a));
	const size = useFitSize(longest, HERO_FONT, WIN_W - 10, maxSize, 0.01);
	if (!size) return null;
	const rule = prog(lf, 20, 44, ease.out);
	const subP = prog(lf, 28, 54, ease.out);
	// a slow "breath" so the type stays alive while it is read
	const breathe = 1 + 0.018 * Math.sin(lf / 38);
	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 12,
			}}
		>
			<Tricolour p={rule} />
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
							color: k === accentLine ? C.sky : color,
						}}
					/>
				))}
			</div>
			{sub ? (
				<div
					style={{
						fontFamily: FONT,
						fontWeight: 500,
						fontSize: 14.5,
						lineHeight: 1.3,
						color: C.ice,
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
	);
};

/**
 * A product window: a large photographic 3D stage and a caption.
 * The product arrives with a half-turn and settles; the camera keeps a slow orbit.
 */
export const ProductCard: React.FC<{
	lf: number;
	title: string;
	accent: string;
	camZ?: number;
	camY?: number;
	lookY?: number;
	floorY?: number;
	children: React.ReactNode;
}> = ({lf, title, accent, camZ = 7, camY = 1.0, lookY = -0.1, floorY, children}) => {
	const cap = prog(lf, 22, 46, ease.out);
	const settle = prog(lf, 0, 46, ease.out);
	const orbit = 0.16 * Math.sin(lf / 70);
	return (
		<>
			<div
				style={{
					position: 'absolute',
					top: 4,
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
					top: HEIGHT - 70,
					left: 0,
					width: WIN_W,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 7,
				}}
			>
				<div style={{width: 30 * cap, height: 3, background: accent}} />
				<div
					style={{
						fontFamily: DISPLAY,
						fontWeight: 700,
						fontStretch: '62%',
						fontSize: 19,
						letterSpacing: '0.05em',
						color: C.white,
						textAlign: 'center',
						lineHeight: 1.08,
						opacity: cap,
						transform: `translateY(${(1 - cap) * 8}px)`,
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
