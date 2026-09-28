import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {C, DURATION, WIN_COUNT, WIN_W, winX} from './theme';
import {Rails, SweepBand} from './components/Sweep';
import {LogoRest} from './scenes/LogoRest';
import {SceneA, SceneB, SceneC} from './scenes/Scenes';

/**
 * 30 s seamless loop for 5 separate LED windows (128 × 320 each).
 *
 * Every word and every product lives inside ONE window, so the physical gaps
 * between panels never cut a letter. What travels across the windows is
 * graphic only: the tricolour band that changes the scenes, and Bauhaus lines.
 *
 *   0 ─  90   logo at rest (continues from the end of the loop)
 *  90         band → IMAGINEZ · plexi imprimé · mug · bois gravé · plexi lumineux
 * 330         band → plaques · enseignes · PERSONNALISEZ · décors · découpe laser
 * 570         band → CRÉEZ · fabriqué à Béthune (laser) · l'œil · SANS · LIMITES
 * 800         band → logo, settles and holds — frame 900 ≡ frame 0
 */
const S = [90, 330, 570, 800] as const;

/** Registration ticks in each window's corners. */
const WindowTicks: React.FC = () => {
	const frame = useCurrentFrame();
	const o = 0.2 + 0.08 * Math.sin((frame / DURATION) * Math.PI * 2 * 3);
	const L = 7;
	const m = 5;
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
						<div style={{position: 'absolute', left: winX(i) + x + (sx < 0 ? -L : 0), top: y, width: L, height: 1, background: C.ice, opacity: o}} />
						<div style={{position: 'absolute', left: winX(i) + x, top: y + (sy < 0 ? -L : 0), width: 1, height: L, background: C.ice, opacity: o}} />
					</React.Fragment>
				)),
			)}
		</AbsoluteFill>
	);
};

export const VisionUrbaine: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: C.black}}>
		<WindowTicks />
		<Rails />

		<Sequence name="Logo (début)" layout="none">
			<LogoRest inAt={null} outAt={S[0]} offset={0} />
		</Sequence>
		<Sequence name="A — IMAGINEZ" layout="none">
			<SceneA inAt={S[0]} outAt={S[1]} />
		</Sequence>
		<Sequence name="B — PERSONNALISEZ" layout="none">
			<SceneB inAt={S[1]} outAt={S[2]} />
		</Sequence>
		<Sequence name="C — CRÉEZ / SANS LIMITES" layout="none">
			<SceneC inAt={S[2]} outAt={S[3]} />
		</Sequence>
		<Sequence name="Logo (fin)" layout="none">
			<LogoRest inAt={S[3]} outAt={null} offset={0} />
		</Sequence>

		{S.map((s) => (
			<SweepBand key={s} at={s} />
		))}
	</AbsoluteFill>
);
