import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {C} from './theme';
import {SweepBand} from './components/Sweep';
import {LogoRest} from './scenes/LogoRest';
import {SceneA, SceneB, SceneC, SceneD, SceneE, SceneF} from './scenes/Scenes';

/**
 * 52 s seamless loop for 5 separate LED windows (128 × 320 each).
 *
 * Every window has a coloured ground with Bauhaus motifs; a flowing bundle of
 * stripes crosses all five. Words and products stay inside one window (on a
 * plate that masks the motifs); the one word that spans windows
 * (PERSONNALISEZ, on the three right-hand ones) is split between whole letters,
 * so the physical gaps between panels never cut a letter. A tricolour band
 * sweeps across the storefront to change scenes.
 *
 *    0        logo at rest (continues from the end of the loop)
 *   90  band → IMAGINEZ · plexi imprimé · mug · bois gravé · plexi lumineux
 *  330  band → plaques · enseignes · PERSONNALISEZ (over W3–W5)
 *  570  band → claustras · murs rétroéclairés · DÉCOREZ · métal découpé · décors muraux
 *  840  band → FABRIQUER · SIGNALER · DÉCORER · VALORISER · GRAVER
 * 1020  band → CRÉEZ · fabriqué à Béthune (laser) · découpe laser · SANS · LIMITES
 * 1260  band → CRÉER · AUJOURD'HUI · UN DEMAIN · PLUS · BEAU
 * 1460  band → logo, settles and holds — frame 1560 ≡ frame 0
 */
const S = [90, 330, 570, 840, 1020, 1260, 1460] as const;

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
		<Sequence name="D — DÉCOREZ" layout="none">
			<SceneD inAt={S[2]} outAt={S[3]} />
		</Sequence>
		<Sequence name="E — verbes" layout="none">
			<SceneE inAt={S[3]} outAt={S[4]} />
		</Sequence>
		<Sequence name="C — CRÉEZ / SANS LIMITES" layout="none">
			<SceneC inAt={S[4]} outAt={S[5]} />
		</Sequence>
		<Sequence name="F — créer aujourd'hui…" layout="none">
			<SceneF inAt={S[5]} outAt={S[6]} />
		</Sequence>
		<Sequence name="Logo (fin)" layout="none">
			<LogoRest inAt={S[6]} outAt={null} />
		</Sequence>

		{S.map((s) => (
			<SweepBand key={s} at={s} />
		))}
	</AbsoluteFill>
);
