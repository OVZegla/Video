import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ease, HEIGHT, prog, WIN_W, winX} from '../theme';

export const STAGGER = 6; // frames between neighbouring windows
export const WIPE = 26; // duration of one window's wipe

/**
 * One window's content for one scene. It is revealed by a vertical wipe led by
 * a thin accent bar and wiped away the same way. Everything stays inside its
 * own 128 px window, so nothing is ever cut by the gaps between LED panels.
 *
 * Children get `lf`: frames since this card started to appear.
 */
export const Card: React.FC<{
	i: number;
	inAt: number; // global frame the scene starts entering (window 0)
	outAt: number; // global frame the scene starts leaving (window 0)
	accent: string;
	children: (lf: number) => React.ReactNode;
}> = ({i, inAt, outAt, accent, children}) => {
	const frame = useCurrentFrame();
	const start = inAt + i * STAGGER;
	const leave = outAt + i * STAGGER;
	if (frame < start || frame > leave + WIPE) return null;

	const e = prog(frame, start, start + WIPE, ease.inOut);
	const x = prog(frame, leave, leave + WIPE, ease.inOut);
	const clip = x > 0 ? `inset(${x * 100}% 0 0 0)` : `inset(0 0 ${(1 - e) * 100}% 0)`;
	const barY = x > 0 ? x * HEIGHT : e * HEIGHT;
	const showBar = (e > 0 && e < 1) || (x > 0 && x < 1);

	return (
		<div style={{position: 'absolute', left: winX(i), top: 0, width: WIN_W, height: HEIGHT}}>
			<div style={{position: 'absolute', inset: 0, clipPath: clip, overflow: 'hidden'}}>
				{children(frame - start)}
			</div>
			{showBar ? (
				<div
					style={{
						position: 'absolute',
						left: 10,
						width: WIN_W - 20,
						top: barY - 1.5,
						height: 3,
						background: accent,
					}}
				/>
			) : null}
		</div>
	);
};
