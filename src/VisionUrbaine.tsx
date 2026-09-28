import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {C, DURATION, WIN_COUNT, WIN_W, winX} from './theme';
import {STAGGER, WIPE} from './components/Card';
import {LogoRest} from './scenes/LogoRest';
import {SceneA, SceneB, SceneC} from './scenes/Scenes';

/**
 * 30 s seamless loop for 5 separate LED windows (128 × 320 each).
 *
 * Rule of the piece: every word and every object lives inside ONE window.
 * The physical gaps between panels (door, counter opening, mullions) can
 * never cut a letter. Scenes change window by window with a vertical wipe
 * that travels left → right across the storefront.
 *
 *   0 ─ 100   logo at rest (continues from the end of the loop), then wipes out
 * 100 ─ 350   IMAGINEZ · plexi imprimé · objets personnalisés · bois gravé · plexi lumineux
 * 350 ─ 600   plaques pro · enseignes · PERSONNALISEZ · décors imprimés · découpe laser
 * 600 ─ 820   CRÉEZ · fabriqué à Béthune (laser live) · l'œil · SANS · LIMITES
 * 820 ─ 900   logo wipes back in and holds — frame 900 ≡ frame 0
 */
const T = {
	logoOut: 70,
	a: [100, 320] as const,
	b: [350, 570] as const,
	c: [600, 790] as const,
	logoIn: 820,
};

// How long a scene stays mounted after its exit starts (last window + wipe).
const TAIL = STAGGER * (WIN_COUNT - 1) + WIPE + 2;

/** Registration ticks in each window's corners — a quiet, constant frame. */
const WindowTicks: React.FC = () => {
	const frame = useCurrentFrame();
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
						<div style={{position: 'absolute', left: winX(i) + x + (sx < 0 ? -L : 0), top: y, width: L, height: 1, background: C.white, opacity: breathe}} />
						<div style={{position: 'absolute', left: winX(i) + x, top: y + (sy < 0 ? -L : 0), width: 1, height: L, background: C.white, opacity: breathe}} />
					</React.Fragment>
				)),
			)}
		</AbsoluteFill>
	);
};

const scene = (inAt: number, outAt: number) => ({from: inAt, durationInFrames: outAt + TAIL - inAt});

export const VisionUrbaine: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: C.black}}>
		<WindowTicks />

		<Sequence durationInFrames={T.logoOut + TAIL} name="Logo — repos (début)" layout="none">
			<LogoRest inAt={-1000} outAt={T.logoOut} offset={0} />
		</Sequence>

		<Sequence {...scene(...T.a)} name="A — IMAGINEZ">
			<SceneA inAt={0} outAt={T.a[1] - T.a[0]} />
		</Sequence>

		<Sequence {...scene(...T.b)} name="B — PERSONNALISEZ">
			<SceneB inAt={0} outAt={T.b[1] - T.b[0]} />
		</Sequence>

		<Sequence {...scene(...T.c)} name="C — CRÉEZ / SANS LIMITES">
			<SceneC inAt={0} outAt={T.c[1] - T.c[0]} />
		</Sequence>

		<Sequence from={T.logoIn} name="Logo — repos (fin)" layout="none">
			<LogoRest inAt={0} outAt={100000} offset={T.logoIn} />
		</Sequence>
	</AbsoluteFill>
);
