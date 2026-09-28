import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, ease, FONT, HEIGHT, prog, WIDTH, WIN_COUNT, WIN_W, winX} from '../theme';
import {Layer, Win} from '../components/primitives';

export const PERSONNALISEZ_LEN = 84;

const WORD_W = 1010; // measured width of the word at 118px

type Finish = {fill: string; stroke?: string};

/**
 * Outlined type is built as two layers (thick-stroked word + black word on
 * top) so only the outer contour shows — no overlapping glyph contours.
 */
const Word: React.FC<{x: number; color: string; stroke: number}> = ({x, color, stroke}) => (
	<div
		style={{
			position: 'absolute',
			left: x,
			top: 0,
			height: HEIGHT,
			display: 'flex',
			alignItems: 'center',
			whiteSpace: 'nowrap',
			fontFamily: FONT,
			fontWeight: 800,
			fontSize: 118,
			lineHeight: 1,
			letterSpacing: '0.01em',
			color,
			WebkitTextStroke: stroke ? `${stroke}px ${color}` : undefined,
		}}
	>
		PERSONNALISEZ
	</div>
);
// The same word, "personalised" differently by each window.
const FINISHES: Finish[] = [
	{fill: C.white},
	{fill: 'transparent', stroke: C.white},
	{fill: C.blue},
	{fill: 'transparent', stroke: C.red},
	{fill: C.red},
];

/**
 * "PERSONNALISEZ" travels through the storefront. As it crosses each window
 * it takes on that window's finish: solid, outlined, blue, red outline, red.
 */
export const Personnalisez: React.FC = () => {
	const frame = useCurrentFrame();
	const x = interpolate(frame, [0, PERSONNALISEZ_LEN], [WIDTH + 10, -WORD_W - 10], {
		easing: Easing.bezier(0.33, 0.12, 0.67, 0.88),
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	// thin guide rules that frame the word's travel
	const rules = prog(frame, 0, 18, ease.out) * (1 - prog(frame, 66, 84, ease.in));

	return (
		<Layer>
			{Array.from({length: WIN_COUNT}, (_, i) => {
				const f = FINISHES[i];
				return (
					<Win key={i} i={i}>
						<div
							style={{
								position: 'absolute',
								left: 10 + (WIN_W - 20) * (i % 2 === 0 ? 0 : 1 - rules),
								width: (WIN_W - 20) * rules,
								top: i % 2 === 0 ? 84 : 234,
								height: 1,
								background: C.white,
								opacity: 0.45,
							}}
						/>
						<Word x={x - winX(i)} color={f.stroke ?? f.fill} stroke={f.stroke ? 3.4 : 0} />
						{f.stroke ? <Word x={x - winX(i)} color={C.black} stroke={0} /> : null}
					</Win>
				);
			})}
		</Layer>
	);
};
