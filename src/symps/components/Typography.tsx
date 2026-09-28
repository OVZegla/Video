import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, FONT, ease, prog} from '../theme';

export const fontBase: React.CSSProperties = {
	fontFamily: `${FONT}, 'Helvetica Neue', Helvetica, Arial, sans-serif`,
	fontFeatureSettings: '"ss01", "cv11"',
	WebkitFontSmoothing: 'antialiased',
};

/**
 * A line of type that rises out of an invisible slot, sharpening as it lands.
 * `at` = first frame of the reveal, `out` = first frame of the exit (optional).
 */
export const RevealLine: React.FC<{
	at: number;
	out?: number;
	dur?: number;
	outDur?: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
	rise?: number;
	blur?: number;
}> = ({at, out, dur = 34, outDur = 20, children, style, rise = 0.6, blur = 10}) => {
	const f = useCurrentFrame();
	const p = prog(f, at, at + dur, ease.out);
	const q = out === undefined ? 0 : prog(f, out, out + outDur, ease.inOut);
	const opacity = Math.min(prog(f, at, at + dur * 0.7, ease.inOut), 1 - q);
	return (
		<div style={{overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em', ...style}}>
			<div
				style={{
					transform: `translateY(${(1 - p) * rise * 100}%)`,
					opacity,
					filter: `blur(${(1 - p) * blur + q * blur * 0.6}px)`,
				}}
			>
				{children}
			</div>
		</div>
	);
};

/** Short accent rule that draws itself. */
export const Rule: React.FC<{at: number; color?: string; width?: number; out?: number}> = ({at, color = C.blue, width = 56, out}) => {
	const f = useCurrentFrame();
	const p = prog(f, at, at + 30, ease.out);
	const q = out === undefined ? 0 : prog(f, out, out + 18, ease.inOut);
	return <div style={{width: width * p, height: 2, background: color, opacity: 1 - q, boxShadow: `0 0 12px ${color}`}} />;
};

/** SYMP'S wordmark (typeset: the official logo file can replace it in public/symps/brand). */
export const Wordmark: React.FC<{
	size: number;
	color?: string;
	accent?: string;
	/** position of the light passing across the letters, 0 → 1 (undefined: no sweep) */
	sweep?: number;
	sub?: boolean;
	subOpacity?: number;
}> = ({size, color = C.ink, accent = C.blue, sweep, sub, subOpacity = 1}) => {
	const text: React.CSSProperties = {
		...fontBase,
		fontSize: size,
		fontWeight: 600,
		letterSpacing: '0.16em',
		marginRight: '-0.16em',
		lineHeight: 1,
		whiteSpace: 'nowrap',
	};
	const sweepStyle: React.CSSProperties | undefined =
		sweep === undefined
			? undefined
			: {
					position: 'absolute',
					inset: 0,
					backgroundImage: `linear-gradient(100deg, rgba(255,255,255,0) ${sweep * 160 - 40}%, rgba(255,255,255,0.95) ${sweep * 160 - 20}%, rgba(255,255,255,0) ${sweep * 160}%)`,
					WebkitBackgroundClip: 'text',
					backgroundClip: 'text',
					color: 'transparent',
				};
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.32}}>
			<div style={{position: 'relative'}}>
				<div style={{...text, color}}>
					SYMP<span style={{color: accent}}>’</span>S
				</div>
				{sweepStyle && <div style={{...text, ...sweepStyle}}>SYMP’S</div>}
			</div>
			{sub && (
				<div
					style={{
						...fontBase,
						fontSize: size * 0.12,
						fontWeight: 500,
						letterSpacing: '0.55em',
						marginRight: '-0.55em',
						color: C.mist,
						opacity: subOpacity,
						whiteSpace: 'nowrap',
					}}
				>
					WALL PRINTING TECHNOLOGY
				</div>
			)}
		</div>
	);
};
