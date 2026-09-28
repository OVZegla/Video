import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {C, DURATION, ease, FONT, prog, WIN_W} from '../theme';
import {Card} from '../components/Card';

const VISION = {src: staticFile('brand/logo-vision.png'), w: 844, h: 223};
const URBAINE = {src: staticFile('brand/logo-urbaine.png'), w: 1031, h: 223};
const SCALE = (WIN_W - 16) / URBAINE.w; // "Urbaine" fills the window; "Vision" shares its scale

/** Outlined type as on the wall sign: white letters with a navy contour. */
const Outlined: React.FC<{text: string}> = ({text}) => (
	<span style={{display: 'inline-grid', fontWeight: 500}}>
		<span style={{gridArea: '1 / 1', color: C.brandNavy, WebkitTextStroke: `2.2px ${C.brandNavy}`}}>{text}</span>
		<span style={{gridArea: '1 / 1', color: C.white}}>{text}</span>
	</span>
);

/** The logo stacked to fit a single window, with the tagline beneath it. */
const Lockup: React.FC<{lf: number}> = ({lf}) => {
	const logo = prog(lf, 4, 34, ease.out);
	const tag = (k: number) => prog(lf, 24 + k * 6, 44 + k * 6, ease.out);
	const line: React.CSSProperties = {fontFamily: FONT, fontSize: 13.5, lineHeight: 1.3, whiteSpace: 'nowrap'};
	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<div style={{opacity: logo, transform: `translateY(${(1 - logo) * 10}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
				<Img src={VISION.src} style={{width: VISION.w * SCALE, height: VISION.h * SCALE}} />
				<Img src={URBAINE.src} style={{width: URBAINE.w * SCALE, height: URBAINE.h * SCALE}} />
			</div>
			<div style={{height: 16}} />
			<div style={{...line, fontWeight: 700, color: C.brandNavy, opacity: tag(0)}}>Pensé à Béthune</div>
			<div style={{...line, opacity: tag(1)}}>
				<Outlined text="et ouvert sur" />
			</div>
			<div style={{...line, fontWeight: 700, color: C.brandRed, opacity: tag(2)}}>le monde</div>
		</div>
	);
};

/**
 * The rest pose that opens and closes the loop:
 * blue disc (window 1) · logo lockup (window 3) · red square (window 5).
 * Settled content never depends on `lf`, so frame 900 ≡ frame 0.
 */
export const LogoRest: React.FC<{inAt: number; outAt: number; offset: number}> = ({inAt, outAt, offset}) => {
	const frame = useCurrentFrame();
	// a quarter-turn per loop: a square looks identical at 0° and 90°
	const squareRot = ((frame + offset) / DURATION) * 90; // offset = the Sequence's start → global time
	return (
		<>
			<Card i={0} inAt={inAt} outAt={outAt} accent={C.blue}>
				{(lf) => {
					const s = prog(lf, 6, 40, ease.out);
					return (
						<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<div style={{width: 64, height: 64, borderRadius: '50%', background: C.blue, transform: `scale(${s})`}} />
						</div>
					);
				}}
			</Card>
			<Card i={2} inAt={inAt - 2 * 6 + 6} outAt={outAt - 2 * 6 + 6} accent={C.white}>
				{(lf) => <Lockup lf={lf} />}
			</Card>
			<Card i={4} inAt={inAt - 4 * 6 + 12} outAt={outAt - 4 * 6 + 12} accent={C.red}>
				{(lf) => {
					const s = prog(lf, 6, 40, ease.out);
					return (
						<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<div style={{width: 50, height: 50, background: C.red, transform: `scale(${s}) rotate(${squareRot}deg)`}} />
						</div>
					);
				}}
			</Card>
		</>
	);
};
