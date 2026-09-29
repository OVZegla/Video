import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {COPY} from './copy';
import {Concept, Intro, Pillars} from './scenes/Opening';
import {Custom, Franchise as FranchiseScene, Outro} from './scenes/Finale';
import {Journey, Store} from './scenes/Store';
import {Led, Possible} from './scenes/Showcase';
import {Workshop} from './scenes/Workshop';
import {ease, FW, K, lerp, p, SANS} from './theme';
import {Logo} from './ui';

// Timeline (frames @ 30 fps). `chapter` indexes COPY.chapters (-1: no chrome).
const SCENES: {C: React.FC; len: number; chapter: number}[] = [
	{C: Intro, len: 240, chapter: -1},
	{C: Concept, len: 360, chapter: 0},
	{C: Pillars, len: 270, chapter: 0},
	{C: Possible, len: 450, chapter: 1},
	{C: Led, len: 450, chapter: 2},
	{C: Store, len: 480, chapter: 3},
	{C: Journey, len: 450, chapter: 4},
	{C: Workshop, len: 450, chapter: 5},
	{C: Custom, len: 390, chapter: 6},
	{C: FranchiseScene, len: 390, chapter: 7},
	{C: Outro, len: 300, chapter: -1},
];

const STARTS = SCENES.map((_, i) => SCENES.slice(0, i).reduce((a, s) => a + s.len, 0));
export const FRANCHISE_DURATION = STARTS[STARTS.length - 1] + SCENES[SCENES.length - 1].len;

const WIPE = 30; // frames; the navy panel fully covers the frame at its midpoint

/** Tricolour-edged navy panel sweeping across; scenes swap underneath it. */
export const Wipe: React.FC<{at: number}> = ({at}) => {
	const f = useCurrentFrame();
	const t = p(f, at - WIPE / 2, at + WIPE / 2, ease.inOut);
	if (t <= 0 || t >= 1) return null;
	const stripe = 46;
	const body = FW + 400;
	const total = body + stripe * 6;
	const x = lerp(FW, -total, t);
	const bands = [K.red, K.paperLight, K.blue, K.navy, K.blue, K.paperLight, K.red];
	const widths = [stripe, stripe, stripe, body, stripe, stripe, stripe];
	let acc = 0;
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			{bands.map((c, k) => {
				const left = x + acc;
				acc += widths[k];
				return <div key={k} style={{position: 'absolute', top: -60, bottom: -60, left, width: widths[k] + 1, background: c, transform: 'skewX(-12deg)'}} />;
			})}
		</AbsoluteFill>
	);
};

/** Logo, chapter and progress, over the content scenes. */
const Chrome: React.FC = () => {
	const f = useCurrentFrame();
	const i = STARTS.findIndex((s, k) => f >= s && f < s + SCENES[k].len);
	const ch = i < 0 ? -1 : SCENES[i].chapter;
	const first = STARTS[1];
	const last = STARTS[SCENES.length - 1];
	const vis = p(f, first + 10, first + 30) * (1 - p(f, last - 20, last - 5));
	if (vis <= 0) return null;
	const prog = (f - first) / (last - first);
	return (
		<AbsoluteFill style={{opacity: vis}}>
			<div style={{position: 'absolute', left: 64, top: 50}}>
				<Logo width={250} />
			</div>
			{ch >= 0 && (
				<div
					style={{
						position: 'absolute',
						right: 64,
						top: 50,
						fontFamily: SANS,
						fontSize: 20,
						letterSpacing: '0.24em',
						textTransform: 'uppercase',
						color: K.navySoft,
						display: 'flex',
						gap: 16,
					}}
				>
					<span style={{color: K.red, fontWeight: 500}}>{String(ch + 1).padStart(2, '0')}</span>
					<span>{COPY.chapters[ch]}</span>
				</div>
			)}
			<div style={{position: 'absolute', left: 64, right: 64, bottom: 36, height: 3, background: K.line}}>
				<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(1, prog)) * 100}%`, background: K.navy}} />
			</div>
		</AbsoluteFill>
	);
};

export const Franchise: React.FC = () => (
	<AbsoluteFill style={{background: K.paper}}>
		{SCENES.map(({C, len}, i) => (
			<Sequence key={i} from={STARTS[i]} durationInFrames={len}>
				<C />
			</Sequence>
		))}
		<Chrome />
		{STARTS.slice(1).map((s) => (
			<Wipe key={s} at={s} />
		))}
	</AbsoluteFill>
);
