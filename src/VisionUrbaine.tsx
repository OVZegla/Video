import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {C, DURATION, ease, prog, WIN_COUNT, WIN_W, winX} from './theme';
import {LogoScene} from './scenes/LogoScene';
import {Imaginez, IMAGINEZ_LEN} from './scenes/Imaginez';
import {Materials, MATERIALS_LEN} from './scenes/Materials';
import {Personnalisez, PERSONNALISEZ_LEN} from './scenes/Personnalisez';
import {Creez, CREEZ_LEN} from './scenes/Creez';
import {SansLimites, SANS_LIMITES_LEN} from './scenes/SansLimites';

/**
 * Timeline (30 fps, 450 frames, seamless):
 *
 *   0 ─ 58   logo at rest → folds back into the centre
 *  50 ─ 142  IMAGINEZ
 * 130 ─ 234  product conveyor (acrylic, engraving, wood, objects, sign)
 * 224 ─ 308  PERSONNALISEZ
 * 296 ─ 382  CRÉEZ + laser / decor / plaque / signage
 * 368 ─ 428  SANS LIMITES → line collapses to the centre
 * 420 ─ 450  logo re-emerges from the centre and settles
 *
 * The logo's exit is the time-mirror of its entry, and frame 450 lands on
 * the exact pose of frame 0, so the loop has no seam.
 */
const T = {
	logoOut: [30, 58] as const,
	imaginez: 50,
	materials: 130,
	personnalisez: 224,
	creez: 296,
	sansLimites: 368,
	logoIn: [420, 446] as const,
};

/** Registration ticks in each window's corners — a quiet, constant frame. */
const WindowTicks: React.FC = () => {
	const frame = useCurrentFrame();
	// periodic over the full loop so it never jumps at the seam
	const breathe = 0.16 + 0.06 * Math.sin((frame / DURATION) * Math.PI * 2 * 3);
	const L = 7;
	const m = 6;
	return (
		<AbsoluteFill>
			{Array.from({length: WIN_COUNT}, (_, i) =>
				[
					[m, m, 1, 1],
					[WIN_W - m, m, -1, 1],
					[m, 320 - m, 1, -1],
					[WIN_W - m, 320 - m, -1, -1],
				].map(([x, y, sx, sy], k) => (
					<React.Fragment key={`${i}-${k}`}>
						<div
							style={{
								position: 'absolute',
								left: winX(i) + x + (sx < 0 ? -L : 0),
								top: y,
								width: L,
								height: 1,
								background: C.white,
								opacity: breathe,
							}}
						/>
						<div
							style={{
								position: 'absolute',
								left: winX(i) + x,
								top: y + (sy < 0 ? -L : 0),
								width: 1,
								height: L,
								background: C.white,
								opacity: breathe,
							}}
						/>
					</React.Fragment>
				)),
			)}
		</AbsoluteFill>
	);
};

export const VisionUrbaine: React.FC = () => {
	const frame = useCurrentFrame();
	const logoOut = 1 - prog(frame, T.logoOut[0], T.logoOut[1], ease.inOut);
	const logoIn = prog(frame, T.logoIn[0], T.logoIn[1], ease.inOut);

	return (
		<AbsoluteFill style={{backgroundColor: C.black}}>
			<WindowTicks />

			<Sequence durationInFrames={T.logoOut[1]} name="Logo — exit">
				<LogoScene p={logoOut} />
			</Sequence>

			<Sequence from={T.imaginez} durationInFrames={IMAGINEZ_LEN} name="IMAGINEZ">
				<Imaginez />
			</Sequence>

			<Sequence from={T.materials} durationInFrames={MATERIALS_LEN} name="Matériaux">
				<Materials />
			</Sequence>

			<Sequence from={T.personnalisez} durationInFrames={PERSONNALISEZ_LEN} name="PERSONNALISEZ">
				<Personnalisez />
			</Sequence>

			<Sequence from={T.creez} durationInFrames={CREEZ_LEN} name="CRÉEZ">
				<Creez />
			</Sequence>

			<Sequence from={T.sansLimites} durationInFrames={SANS_LIMITES_LEN} name="SANS LIMITES">
				<SansLimites />
			</Sequence>

			<Sequence from={T.logoIn[0]} name="Logo — entry">
				<LogoScene p={logoIn} />
			</Sequence>
		</AbsoluteFill>
	);
};
