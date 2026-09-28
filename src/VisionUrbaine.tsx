import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {C} from './theme';
import {SweepBand} from './components/Sweep';
import {LogoRest} from './scenes/LogoRest';
import {SceneA, SceneB, SceneC} from './scenes/Scenes';

/**
 * 30 s seamless loop for 5 separate LED windows (128 × 320 each).
 *
 * Every window has a coloured ground with Bauhaus motifs; a flowing bundle of
 * stripes crosses all five. Every word and every product lives inside ONE
 * window (on a plate that masks the motifs), so the physical gaps between
 * panels never cut a letter. A tricolour band sweeps across to change scenes.
 *
 *   0 ─  90   logo at rest (continues from the end of the loop)
 *  90         band → IMAGINEZ · plexi imprimé · mug · bois gravé · plexi lumineux
 * 330         band → plaques · enseignes · PERSONNALISEZ · décors · découpe laser
 * 570         band → CRÉEZ · fabriqué à Béthune (laser) · l'œil · SANS · LIMITES
 * 800         band → logo, settles and holds — frame 900 ≡ frame 0
 */
const S = [90, 330, 570, 800] as const;

export const VisionUrbaine: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: C.black}}>
		<Sequence name="Logo (début)" layout="none">
			<LogoRest inAt={null} outAt={S[0]} />
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
			<LogoRest inAt={S[3]} outAt={null} />
		</Sequence>

		{S.map((s) => (
			<SweepBand key={s} at={s} />
		))}
	</AbsoluteFill>
);
