import React from 'react';
import {useCurrentFrame} from 'remotion';
import {HEIGHT, WIN_W, winX} from '../theme';
import {BAND, sweepLead, sweepReaches} from './Sweep';

/**
 * One window's content for one scene. It appears behind the tricolour band of
 * sweep `inAt` and disappears ahead of the band of sweep `outAt`. Content is
 * clipped to its own 128 px window, so the gaps between LED panels never cut
 * a letter; only the band and the Bauhaus lines travel across windows.
 *
 * Children get `lf`: frames since the band uncovered this window.
 */
export const Card: React.FC<{
	i: number;
	inAt: number | null; // sweep that reveals the scene (null = already visible)
	outAt: number | null; // sweep that removes it (null = stays)
	children: (lf: number) => React.ReactNode;
}> = ({i, inAt, outAt, children}) => {
	const frame = useCurrentFrame();
	const x0 = winX(i);
	const x1 = x0 + WIN_W;
	const trailIn = inAt === null ? Infinity : sweepLead(frame, inAt) - BAND;
	const leadOut = outAt === null ? -Infinity : frame < outAt ? -Infinity : sweepLead(frame, outAt);
	const left = Math.max(x0, leadOut);
	const right = Math.min(x1, trailIn);
	if (inAt !== null && frame < inAt) return null;
	if (right <= left) return null;

	const start = inAt === null ? -10000 : sweepReaches(inAt, x0);
	const lf = frame - start;

	return (
		<div
			style={{
				position: 'absolute',
				left: x0,
				top: 0,
				width: WIN_W,
				height: HEIGHT,
				overflow: 'hidden',
				clipPath: `inset(0 ${x1 - right}px 0 ${left - x0}px)`,
			}}
		>
			{children(lf)}
		</div>
	);
};
