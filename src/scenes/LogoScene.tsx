import React from 'react';
import {C, FONT, lerp, WIDTH} from '../theme';
import {LOGO_RATIO, LogoImage} from '../components/Logo';
import {Layer, Reveal} from '../components/primitives';

const LOGO_W = 500;

/** Outline-only type: stroked layer under a black-filled copy (hides inner contours). */
const Outlined: React.FC<{text: string}> = ({text}) => (
	<span style={{display: 'inline-grid', fontWeight: 500}}>
		<span style={{gridArea: '1 / 1', color: C.white, WebkitTextStroke: `2.4px ${C.white}`}}>{text}</span>
		<span style={{gridArea: '1 / 1', color: C.black}}>{text}</span>
	</span>
);
const LOGO_H = LOGO_W / LOGO_RATIO;
export const LOGO_CY = 146;
const LOGO_TOP = LOGO_CY - LOGO_H / 2;

/**
 * The "rest" composition — the loop's anchor pose: the Vision Urbaine logo
 * across the three central windows, the brand tagline and a tricolour rule.
 *
 * `p` = 0 collapsed to a point in the centre window, 1 fully laid out.
 * The scene exits by running p back to 0, and the finale re-enters by running
 * it to 1, so the last frame and the first frame are the same pose.
 * The opening grows out of the centre — exactly where the SANS LIMITES line
 * collapses — so the hand-off reads as one gesture.
 */
export const LogoScene: React.FC<{p: number}> = ({p}) => {
	const seg = (a: number, b: number) =>
		Math.max(0, Math.min(1, (p - a) / (b - a)));

	const line = seg(0, 0.45); // horizon line widens from the centre
	const open = seg(0.2, 0.8); // logo shutter opens outwards
	const lineFade = 1 - seg(0.55, 0.85);
	const bar = seg(0.6, 0.9);
	const tag = seg(0.7, 1);

	const lineW = lerp(0, LOGO_W + 40, line);
	const inset = (1 - open) * 50;

	return (
		<Layer>
			{/* horizon line — the thread that the logo opens from */}
			<div
				style={{
					position: 'absolute',
					top: LOGO_CY - 1,
					left: WIDTH / 2 - lineW / 2,
					width: lineW,
					height: 2,
					background: C.white,
					opacity: lineFade,
				}}
			/>
			{/* logo, opened like a shutter from its centre */}
			<div
				style={{
					position: 'absolute',
					left: WIDTH / 2 - LOGO_W / 2,
					top: LOGO_TOP,
					clipPath: `inset(0 ${inset}% 0 ${inset}%)`,
					transform: `scale(${lerp(1.08, 1, open)})`,
				}}
			>
				<LogoImage width={LOGO_W} />
			</div>
			{/* tricolour rule */}
			<div
				style={{
					position: 'absolute',
					top: 226,
					left: WIDTH / 2 - 27,
					width: 54,
					height: 3,
					display: 'flex',
					transform: `scaleX(${bar})`,
				}}
			>
				<div style={{flex: 1, background: C.blue}} />
				<div style={{flex: 1, background: C.white}} />
				<div style={{flex: 1, background: C.red}} />
			</div>
			{/* tagline — styled like the wall signage: solid · outline · red */}
			<Reveal
				p={tag}
				style={{
					position: 'absolute',
					top: 188,
					left: 0,
					width: WIDTH,
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<div
					style={{
						fontFamily: FONT,
						fontSize: 20,
						lineHeight: 1.25,
						whiteSpace: 'nowrap',
						display: 'flex',
						gap: '0.3em',
					}}
				>
					<span style={{fontWeight: 700, color: C.white}}>Pensé à Béthune</span>
					<Outlined text="et ouvert sur" />
					<span style={{fontWeight: 700, color: C.red}}>le monde</span>
				</div>
			</Reveal>
		</Layer>
	);
};
