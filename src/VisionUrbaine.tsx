import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {C} from './theme';
import {SweepBand} from './components/Sweep';
import {LogoRest} from './scenes/LogoRest';
import {SceneC, SceneE, SceneF} from './scenes/Scenes';
import {SceneDeco, SceneEvents, SceneIntro, SceneLight, SceneSignage, SceneSmall} from './scenes/Categories';

/**
 * 83 s seamless loop for 5 separate LED windows (128 × 320 each): a burst of
 * ideas, category by category. Each category opens with a header window
 * ("Exemples de réalisations") and four product windows, some of which swap
 * to a second product halfway through.
 *
 * Every window has a coloured ground with Bauhaus motifs; a flowing bundle of
 * stripes crosses all five. Words and products stay inside one window; the
 * one word that spans windows (PERSONNALISEZ, on the three right-hand ones)
 * is split between whole letters, so the gaps between panels never cut a
 * letter. A tricolour band sweeps across the storefront to change scenes.
 *
 *    0        logo at rest (continues from the end of the loop)
 *   90  band → IMAGINEZ · (eye) · PERSONNALISEZ over W3–W5
 *  300  band → 01 petits objets: mugs (names cycling), t-shirts/tote bags, caps/bottles, keychains
 *  600  band → 02 signalétique: plaques pro/de porte, enseignes, totems, plaques de rue/plexi
 *  900  band → 03 déco intérieure: claustras, plexi/bois gravé, métal découpé/murs rétroéclairés, décors
 * 1200  band → 04 mariages & événements: gobelets, panneaux, plaques gravées, marque-places
 * 1500  band → 05 plexi lumineux: the storefront goes dark, engraved panels light up
 * 1770  band → FABRIQUER · SIGNALER · DÉCORER · VALORISER · GRAVER
 * 1950  band → CRÉEZ · fabriqué à Béthune (laser) · découpe laser · SANS · LIMITES
 * 2190  band → CRÉER · AUJOURD'HUI · UN DEMAIN · PLUS · BEAU
 * 2390  band → logo, settles and holds — frame 2490 ≡ frame 0
 */
const S = [90, 300, 600, 900, 1200, 1500, 1770, 1950, 2190, 2390] as const;

export const VisionUrbaine: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: C.black}}>
		<Sequence name="Logo (début)" layout="none">
			<LogoRest inAt={null} outAt={S[0]} />
		</Sequence>
		<Sequence name="Intro — IMAGINEZ / PERSONNALISEZ" layout="none">
			<SceneIntro inAt={S[0]} outAt={S[1]} />
		</Sequence>
		<Sequence name="01 Petits objets" layout="none">
			<SceneSmall inAt={S[1]} outAt={S[2]} />
		</Sequence>
		<Sequence name="02 Signalétique" layout="none">
			<SceneSignage inAt={S[2]} outAt={S[3]} />
		</Sequence>
		<Sequence name="03 Déco intérieure" layout="none">
			<SceneDeco inAt={S[3]} outAt={S[4]} />
		</Sequence>
		<Sequence name="04 Mariages & événements" layout="none">
			<SceneEvents inAt={S[4]} outAt={S[5]} />
		</Sequence>
		<Sequence name="05 Plexi lumineux" layout="none">
			<SceneLight inAt={S[5]} outAt={S[6]} />
		</Sequence>
		<Sequence name="Verbes" layout="none">
			<SceneE inAt={S[6]} outAt={S[7]} />
		</Sequence>
		<Sequence name="CRÉEZ / SANS LIMITES" layout="none">
			<SceneC inAt={S[7]} outAt={S[8]} />
		</Sequence>
		<Sequence name="Créer aujourd'hui…" layout="none">
			<SceneF inAt={S[8]} outAt={S[9]} />
		</Sequence>
		<Sequence name="Logo (fin)" layout="none">
			<LogoRest inAt={S[9]} outAt={null} />
		</Sequence>

		{S.map((s) => (
			<SweepBand key={s} at={s} />
		))}
	</AbsoluteFill>
);
