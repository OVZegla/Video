import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Wipe} from '../franchise/Franchise';
import {K, p, SANS} from '../franchise/theme';
import {Logo} from '../franchise/ui';
import {INTRO, MODULES} from './copy';
import {IntroBuild, IntroProgram, IntroSkills, ModuleScene, moduleBeats, OutroBrand, OutroPillars} from './scenes';

// Timeline. `module` is the index into MODULES, or -1 for intro / outro.
type Part = {C: React.FC; len: number; module: number; wipe: boolean};

const MOD_SCENES: Part[] = MODULES.map((m, i) => ({
	C: () => <ModuleScene i={i} />,
	len: moduleBeats(m).len,
	module: i,
	wipe: i === 0,
}));

const PARTS: Part[] = [
	{C: IntroBuild, len: 200, module: -1, wipe: false},
	{C: IntroSkills, len: 230, module: -1, wipe: true},
	{C: IntroProgram, len: 320, module: -1, wipe: true},
	...MOD_SCENES,
	{C: OutroPillars, len: 190, module: -1, wipe: true},
	{C: OutroBrand, len: 300, module: -1, wipe: true},
];

const STARTS = PARTS.map((_, i) => PARTS.slice(0, i).reduce((a, s) => a + s.len, 0));
export const FORMATION_DURATION = STARTS[STARTS.length - 1] + PARTS[PARTS.length - 1].len;

/** Logo, film title and the 13-module progress track, during the modules. */
const Chrome: React.FC = () => {
	const f = useCurrentFrame();
	const i = STARTS.findIndex((s, k) => f >= s && f < s + PARTS[k].len);
	const firstMod = PARTS.findIndex((x) => x.module === 0);
	const lastMod = PARTS.findIndex((x) => x.module === MODULES.length - 1);
	const a = STARTS[firstMod];
	const b = STARTS[lastMod] + PARTS[lastMod].len;
	const vis = p(f, a + 10, a + 30) * (1 - p(f, b - 20, b - 4));
	if (vis <= 0 || i < 0) return null;
	const cur = PARTS[i].module;
	const local = cur >= 0 ? (f - STARTS[i]) / PARTS[i].len : 1;
	const n = MODULES.length;
	const gap = 12;
	const w = (1700 - gap * (n - 1)) / n;
	return (
		<AbsoluteFill style={{opacity: vis}}>
			<div style={{position: 'absolute', left: 64, top: 50}}>
				<Logo width={250} />
			</div>
			<div style={{position: 'absolute', right: 64, top: 52, fontFamily: SANS, fontSize: 20, letterSpacing: '0.24em', textTransform: 'uppercase', color: K.navySoft}}>
				{INTRO.chrome}
			</div>
			{MODULES.map((m, k) => {
				const fill = k < cur ? 1 : k === cur ? local : 0;
				const on = k === cur;
				return (
					<div key={m.n} style={{position: 'absolute', left: 110 + k * (w + gap), top: 1000, width: w}}>
						<div style={{fontFamily: SANS, fontSize: 16, fontWeight: on ? 500 : 400, color: on ? K.red : k < cur ? K.navy : K.grey, letterSpacing: '0.1em', marginBottom: 8}}>{m.n}</div>
						<div style={{position: 'relative', height: on ? 5 : 3, background: K.line, borderRadius: 3}}>
							<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, background: on ? K.red : K.navy, borderRadius: 3}} />
						</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

export const Formation: React.FC = () => (
	<AbsoluteFill style={{background: K.paper}}>
		{PARTS.map(({C, len}, i) => (
			<Sequence key={i} from={STARTS[i]} durationInFrames={len}>
				<C />
			</Sequence>
		))}
		<Chrome />
		{PARTS.map((part, i) => (part.wipe ? <Wipe key={i} at={STARTS[i]} /> : null))}
	</AbsoluteFill>
);
