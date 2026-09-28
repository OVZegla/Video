import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, ease, FONT, prog, WIN_W} from '../theme';
import {Tricolour} from '../components/Cards';
import {Ribbon} from '../components/Patterns';
import {Win} from './Win';

// Logo recoloured for the LED: navy → white, blue pupil and red sector kept.
const VISION = {src: staticFile('brand/logo-vision-white.png'), w: 844, h: 223};
const URBAINE = {src: staticFile('brand/logo-urbaine-white.png'), w: 1031, h: 223};
const SCALE = (WIN_W - 8) / URBAINE.w; // "Urbaine" fills the window; "Vision" shares its scale

const RIBBON_LOGO: Ribbon = {y0: 170, amp: 80, waves: 1.1, n: 7, gap: 9, width: 4.5, tilt: -30};

/** The logo stacked to fit one window, tagline beneath (all white), on a plate. */
const Lockup: React.FC<{lf: number}> = ({lf}) => {
	const plate = prog(lf, 0, 26, ease.out);
	const v = prog(lf, 4, 32, ease.out);
	const u = prog(lf, 10, 38, ease.out);
	const bar = prog(lf, 20, 44, ease.out);
	const tag = (k: number) => prog(lf, 26 + k * 6, 48 + k * 6, ease.out);
	const line: React.CSSProperties = {fontFamily: FONT, fontSize: 15, fontWeight: 600, lineHeight: 1.28, whiteSpace: 'nowrap', color: C.white};
	return (
		<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center'}}>
			<div
				style={{
					width: WIN_W,
					padding: '20px 0',
					background: C.blue,
					clipPath: `inset(0 ${(1 - plate) * 100}% 0 0)`,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<div style={{overflow: 'hidden'}}>
					<Img src={VISION.src} style={{display: 'block', width: VISION.w * SCALE, height: VISION.h * SCALE, transform: `translateY(${(1 - v) * 105}%)`}} />
				</div>
				<div style={{overflow: 'hidden', marginTop: 5}}>
					<Img src={URBAINE.src} style={{display: 'block', width: URBAINE.w * SCALE, height: URBAINE.h * SCALE, transform: `translateY(${(1 - u) * 105}%)`}} />
				</div>
				<div style={{height: 14}} />
				<Tricolour p={bar} width={60} />
				<div style={{height: 12}} />
				<div style={{...line, opacity: tag(0)}}>Pensé à Béthune</div>
				<div style={{...line, opacity: tag(1)}}>et ouvert sur</div>
				<div style={{...line, opacity: tag(2)}}>le monde</div>
			</div>
		</div>
	);
};

/**
 * The rest pose that opens and closes the loop: five coloured windows with
 * Bauhaus motifs and the ribbon, the logo lockup in the centre window.
 * Settled content never depends on `lf`; the ribbon's motion is periodic
 * over the loop, so frame 900 ≡ frame 0.
 */
export const LogoRest: React.FC<{inAt: number | null; outAt: number | null}> = ({inAt, outAt}) => (
	<>
		<Win i={0} inAt={inAt} outAt={outAt} ground="red" ribbon={RIBBON_LOGO}
			motifs={[
				{kind: 'vstripes', x: 14, y: 0, w: 100, h: 92, n: 7},
				{kind: 'half', cx: 64, cy: 320, r: 60, rot: 0},
			]}
		/>
		<Win i={1} inAt={inAt} outAt={outAt} ground="sky" ribbon={RIBBON_LOGO}
			motifs={[
				{kind: 'tri', x: 16, y: 20, cell: 32, cols: 3, rows: 2},
				{kind: 'arcs', cx: 0, cy: 320, r: 110, n: 5, rot: -90},
			]}
		/>
		<Win i={2} inAt={inAt} outAt={outAt} ground="blue" ribbon={RIBBON_LOGO}
			motifs={[{kind: 'quarter', cx: 128, cy: 0, r: 70, rot: 90}]}
		>
			{(lf) => <Lockup lf={lf} />}
		</Win>
		<Win i={3} inAt={inAt} outAt={outAt} ground="white" ribbon={RIBBON_LOGO}
			motifs={[
				{kind: 'eye', cx: 64, cy: 84, r: 50, accent: C.red, hole: C.white, pupil: C.blue},
				{kind: 'vstripes', x: 14, y: 250, w: 100, h: 70, n: 7, from: 'bottom'},
			]}
		/>
		<Win i={4} inAt={inAt} outAt={outAt} ground="blue" ribbon={RIBBON_LOGO}
			motifs={[
				{kind: 'half', cx: 128, cy: 110, r: 58, rot: -90},
				{kind: 'tri', x: 0, y: 256, cell: 32, cols: 4, rows: 2},
			]}
		/>
	</>
);
