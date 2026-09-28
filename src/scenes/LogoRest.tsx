import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {C, DURATION, ease, FONT, prog, WIN_W} from '../theme';
import {Card} from '../components/Card';
import {Tricolour} from '../components/Cards';

// Logo recoloured for the LED: navy → white, blue pupil and red sector kept.
const VISION = {src: staticFile('brand/logo-vision-white.png'), w: 844, h: 223};
const URBAINE = {src: staticFile('brand/logo-urbaine-white.png'), w: 1031, h: 223};
const SCALE = (WIN_W - 6) / URBAINE.w; // "Urbaine" fills the window; "Vision" shares its scale

/** Outline-only type (as on the wall sign), white contour. */
const Outlined: React.FC<{text: string}> = ({text}) => (
	<span style={{display: 'inline-grid', fontWeight: 500}}>
		<span style={{gridArea: '1 / 1', color: C.white, WebkitTextStroke: `2.4px ${C.white}`}}>{text}</span>
		<span style={{gridArea: '1 / 1', color: C.black}}>{text}</span>
	</span>
);

/** The logo stacked to fit one window, tagline beneath. */
const Lockup: React.FC<{lf: number}> = ({lf}) => {
	const v = prog(lf, 2, 30, ease.out);
	const u = prog(lf, 8, 36, ease.out);
	const bar = prog(lf, 20, 44, ease.out);
	const tag = (k: number) => prog(lf, 26 + k * 6, 48 + k * 6, ease.out);
	const line: React.CSSProperties = {fontFamily: FONT, fontSize: 15, lineHeight: 1.28, whiteSpace: 'nowrap'};
	return (
		<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
			<div style={{overflow: 'hidden'}}>
				<Img src={VISION.src} style={{display: 'block', width: VISION.w * SCALE, height: VISION.h * SCALE, transform: `translateY(${(1 - v) * 105}%)`}} />
			</div>
			<div style={{overflow: 'hidden', marginTop: 5}}>
				<Img src={URBAINE.src} style={{display: 'block', width: URBAINE.w * SCALE, height: URBAINE.h * SCALE, transform: `translateY(${(1 - u) * 105}%)`}} />
			</div>
			<div style={{height: 16}} />
			<Tricolour p={bar} width={60} />
			<div style={{height: 14}} />
			<div style={{...line, fontWeight: 700, color: C.white, opacity: tag(0)}}>Pensé à Béthune</div>
			<div style={{...line, opacity: tag(1)}}>
				<Outlined text="et ouvert sur" />
			</div>
			<div style={{...line, fontWeight: 700, color: C.brandRed, opacity: tag(2)}}>le monde</div>
		</div>
	);
};

/**
 * The rest pose that opens and closes the loop:
 * blue disc + light-blue orbit (W1) · logo lockup (W3) · red square (W5).
 * `offset` = the Sequence's start, so periodic motion uses global time
 * and frame 900 ≡ frame 0.
 */
export const LogoRest: React.FC<{inAt: number | null; outAt: number | null; offset: number}> = ({inAt, outAt, offset}) => {
	const g = useCurrentFrame() + offset;
	const turn = (g / DURATION) * Math.PI * 2; // one full revolution per loop
	const squareRot = (g / DURATION) * 90; // a square looks identical at 0° and 90°
	return (
		<>
			<Card i={0} inAt={inAt} outAt={outAt}>
				{(lf) => {
					const s = prog(lf, 4, 40, ease.out);
					const ox = Math.cos(turn * 2) * 44;
					const oy = Math.sin(turn * 2) * 44;
					return (
						<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<div style={{position: 'absolute', width: 88, height: 88, borderRadius: '50%', border: `2px solid ${C.sky}`, transform: `scale(${s})`}} />
							<div style={{width: 70, height: 70, borderRadius: '50%', background: C.blue, transform: `scale(${s})`}} />
							<div style={{position: 'absolute', width: 12, height: 12, borderRadius: '50%', background: C.white, transform: `translate(${ox * s}px, ${oy * s}px)`}} />
						</div>
					);
				}}
			</Card>
			<Card i={2} inAt={inAt} outAt={outAt}>
				{(lf) => <Lockup lf={lf} />}
			</Card>
			<Card i={4} inAt={inAt} outAt={outAt}>
				{(lf) => {
					const s = prog(lf, 4, 40, ease.out);
					return (
						<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<div style={{position: 'absolute', width: 84, height: 84, border: `2px solid ${C.ice}`, transform: `scale(${s}) rotate(${-squareRot}deg)`}} />
							<div style={{width: 58, height: 58, background: C.red, transform: `scale(${s}) rotate(${squareRot}deg)`}} />
						</div>
					);
				}}
			</Card>
		</>
	);
};
