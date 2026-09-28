import React from 'react';
import {C, ease, FONT, HEIGHT, prog, WIN_W} from '../theme';
import {DISPLAY} from '../fonts';
import {RiseLetters, useFitSize} from './FitText';
import {Stage} from '../three/Stage';

const HERO_FONT = `800 extra-condensed {s}px ${DISPLAY}`;

export const Tricolour: React.FC<{p: number; width?: number}> = ({p, width = 42}) => (
	<div style={{display: 'flex', width, height: 3, transform: `scaleX(${p})`}}>
		<div style={{flex: 1, background: C.blue}} />
		<div style={{flex: 1, background: C.white}} />
		<div style={{flex: 1, background: C.red}} />
	</div>
);

/**
 * A typographic window: one word, sized to fill the window width
 * (condensed Archivo), a tricolour rule and a two-line subtitle.
 */
export const HeroCard: React.FC<{
	lf: number;
	word: string;
	sub?: [string, string];
	maxSize?: number;
	color?: string;
	measure?: string; // size the word as if it were this one (to match neighbours)
}> = ({lf, word, sub, maxSize = 76, color = C.white, measure}) => {
	const size = useFitSize(measure ?? word, HERO_FONT, WIN_W - 18, maxSize, 0.01);
	if (!size) return null;
	const rule = prog(lf, 22, 44, ease.out);
	const subP = prog(lf, 30, 52, ease.out);
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
			<RiseLetters
				text={word}
				lf={lf}
				start={8}
				ease={ease.out}
				style={{
					fontFamily: DISPLAY,
					fontWeight: 800,
					fontStretch: '62%',
					fontSize: size,
					lineHeight: 1.02,
					letterSpacing: '0.01em',
					color,
				}}
			/>
			{sub ? (
				<div
					style={{
						fontFamily: FONT,
						fontWeight: 500,
						fontSize: 12.5,
						lineHeight: 1.35,
						color: C.white,
						textAlign: 'center',
						opacity: subP,
						transform: `translateY(${(1 - subP) * 8}px)`,
					}}
				>
					{sub[0]}
					<br />
					{sub[1]}
				</div>
			) : null}
		</div>
	);
};

/**
 * A product window: a small photographic 3D stage and a caption.
 */
export const ProductCard: React.FC<{
	lf: number;
	title: string;
	subtitle?: string;
	accent: string;
	camZ?: number;
	camY?: number;
	children: React.ReactNode;
}> = ({lf, title, subtitle, accent, camZ = 6.2, camY = 0.8, children}) => {
	const cap = prog(lf, 26, 48, ease.out);
	const settle = prog(lf, 0, 50, ease.out);
	return (
		<>
			<div
				style={{
					position: 'absolute',
					top: 14,
					left: 0,
					transform: `translateY(${(1 - settle) * 18}px) scale(${0.92 + 0.08 * settle})`,
				}}
			>
				<Stage width={WIN_W} height={220} camZ={camZ} camY={camY}>
					{children}
				</Stage>
			</div>
			<div
				style={{
					position: 'absolute',
					top: HEIGHT - 76,
					left: 0,
					width: WIN_W,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 6,
				}}
			>
				<div style={{width: 22 * cap, height: 2, background: accent}} />
				<div
					style={{
						fontFamily: DISPLAY,
						fontWeight: 700,
						fontStretch: '75%',
						fontSize: 16,
						letterSpacing: '0.08em',
						color: C.white,
						textAlign: 'center',
						lineHeight: 1.15,
						opacity: cap,
						transform: `translateY(${(1 - cap) * 6}px)`,
						whiteSpace: 'pre-line',
					}}
				>
					{title}
				</div>
				{subtitle ? (
					<div
						style={{
							fontFamily: FONT,
							fontWeight: 400,
							fontSize: 11,
							color: C.white,
							opacity: 0.8 * cap,
							textAlign: 'center',
						}}
					>
						{subtitle}
					</div>
				) : null}
			</div>
		</>
	);
};
