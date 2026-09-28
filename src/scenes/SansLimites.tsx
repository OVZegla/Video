import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, ease, FONT, lerp, prog, WIDTH} from '../theme';
import {Layer, Reveal} from '../components/primitives';
import {LOGO_CY} from './LogoScene';

export const SANS_LIMITES_LEN = 60;

/**
 * A single horizon line crosses all five windows and keeps going past the
 * edges. "SANS" rises above it on the left, "LIMITES" hangs below on the
 * right. The line then collapses into the centre window, handing over to
 * the logo, which re-emerges from that exact point.
 */
export const SansLimites: React.FC = () => {
	const frame = useCurrentFrame();

	const draw = prog(frame, 0, 16, ease.out);
	const collapse = prog(frame, 42, 54, ease.inOut);
	const left = lerp(0, WIDTH / 2, collapse);
	const right = lerp(WIDTH * draw, WIDTH / 2, collapse);

	const sans = prog(frame, 8, 24, ease.out) * (1 - prog(frame, 36, 46, ease.in));
	const limites = prog(frame, 12, 28, ease.out) * (1 - prog(frame, 38, 48, ease.in));
	// the red runner overshoots the canvas: no edge, no limit
	const runner = prog(frame, 4, 34, ease.soft);

	return (
		<Layer>
			<div
				style={{
					position: 'absolute',
					// glides onto the logo's axis as it collapses
					top: lerp(159, LOGO_CY - 1, collapse),
					left,
					width: Math.max(0, right - left),
					height: 2,
					background: C.white,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: 155,
					left: lerp(-20, WIDTH + 40, runner),
					width: 10,
					height: 10,
					background: C.red,
					transform: `rotate(${runner * 360}deg)`,
				}}
			/>
			{/* SANS — rises above the line, windows 1–2 */}
			<Reveal
				p={sans}
				style={{position: 'absolute', left: 20, top: 104, height: 54}}
			>
				<div
					style={{
						fontFamily: FONT,
						fontWeight: 800,
						fontSize: 56,
						lineHeight: 1,
						letterSpacing: '0.04em',
						color: C.white,
					}}
				>
					SANS
				</div>
			</Reveal>
			{/* LIMITES — hangs below the line, windows 4–5 */}
			<Reveal
				p={limites}
				dir={-1}
				style={{position: 'absolute', right: 18, top: 166, height: 58}}
			>
				<div
					style={{
						fontFamily: FONT,
						fontWeight: 300,
						fontSize: 56,
						lineHeight: 1,
						letterSpacing: '0.04em',
						color: C.white,
					}}
				>
					LIMITES
				</div>
			</Reveal>
			{/* blue quarter disc tucked in window 3, pivoting on the line */}
			<div
				style={{
					position: 'absolute',
					left: 320 - 36,
					top: 160 - 36,
					width: 36,
					height: 36,
					borderRadius: '36px 0 0 0',
					background: C.blue,
					transformOrigin: '100% 100%',
					transform: `rotate(${lerp(-90, 0, prog(frame, 10, 26, ease.out)) + prog(frame, 38, 48, ease.in) * 90}deg) scale(${1 - prog(frame, 38, 48, ease.in)})`,
					opacity: prog(frame, 10, 14),
				}}
			/>
		</Layer>
	);
};
