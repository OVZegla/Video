import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {C} from './theme';
import {SCENES} from './timeline';
import {Team} from './scenes/Team';
import {Voice} from './scenes/Voice';
import {Chantier} from './scenes/Chantier';
import {Brief} from './scenes/Brief';
import {Decide} from './scenes/Decide';
import {End} from './scenes/End';
import {Soundtrack} from './Soundtrack';

type S = {from: number; to: number; lead?: number};
const at = (s: S) => ({from: s.from - (s.lead ?? 0), durationInFrames: s.to - s.from + (s.lead ?? 0)});

// Scenes with a `lead` start early and reveal themselves over the previous
// scene with a shape transition (circle, then rounded-rectangle wipes).
export const Film: React.FC = () => (
	<AbsoluteFill style={{background: C.paper}}>
		<Sequence {...at(SCENES.team)} name="00–14 Surcharge → l’équipe se forme">
			<Team />
		</Sequence>
		<Sequence {...at(SCENES.voice)} name="14–26 Demande vocale, résultat concret">
			<Voice />
		</Sequence>
		<Sequence {...at(SCENES.chantier)} name="26–40 Les assistants coopèrent">
			<Chantier />
		</Sequence>
		<Sequence {...at(SCENES.brief)} name="40–49 Le point du jour">
			<Brief />
		</Sequence>
		<Sequence {...at(SCENES.decide)} name="49–56 Vous gardez la main">
			<Decide />
		</Sequence>
		<Sequence {...at(SCENES.end)} name="56–60 Signature">
			<End />
		</Sequence>
		<Soundtrack />
	</AbsoluteFill>
);
