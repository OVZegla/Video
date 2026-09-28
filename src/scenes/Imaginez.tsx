import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, ease, FONT, HEIGHT, prog, WIDTH, WIN_COUNT, winX} from '../theme';
import {Layer, Win} from '../components/primitives';

export const IMAGINEZ_LEN = 92;

/**
 * One word, five windows. Each window carries its own slice of "IMAGINEZ",
 * arriving from alternate directions; they lock into a single line, drift
 * apart in gentle parallax, then leave the way they came (inverted).
 */
export const Imaginez: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const discIn = spring({frame: frame - 10, fps, config: {damping: 200}, durationInFrames: 30});
	const discOut = prog(frame, 64, 86, ease.in);
	const barIn = prog(frame, 22, 44, ease.out);
	const barOut = prog(frame, 60, 80, ease.in);

	return (
		<Layer>
			{/* Bauhaus backdrop: blue disc behind the "G", red rule under "EZ" */}
			<div
				style={{
					position: 'absolute',
					left: 250 - 58,
					top: 160 - 58 + discOut * 140,
					width: 116,
					height: 116,
					borderRadius: '50%',
					background: C.blue,
					transform: `scale(${discIn * (1 - discOut * 0.6)})`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 420 + barOut * 260,
					top: 214,
					width: 150 * barIn,
					height: 6,
					background: C.red,
				}}
			/>
			{Array.from({length: WIN_COUNT}, (_, i) => {
				const dir = i % 2 === 0 ? 1 : -1;
				const enter = spring({
					frame: frame - i * 3,
					fps,
					config: {damping: 18, mass: 0.7, stiffness: 90},
				});
				const exit = prog(frame, 62 + i * 3, 62 + i * 3 + 20, ease.in);
				// Subtle parallax while the word holds: each pane drifts at its own rate.
				const drift = (i - 2) * 0.05 * Math.max(0, Math.min(frame - 20, 44));
				const y = dir * HEIGHT * (1 - enter) - dir * HEIGHT * exit + drift;
				return (
					<Win key={i} i={i}>
						<div
							style={{
								position: 'absolute',
								left: -winX(i),
								top: 0,
								width: WIDTH,
								height: HEIGHT,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								transform: `translateY(${y}px)`,
							}}
						>
							<div
								style={{
									fontFamily: FONT,
									fontWeight: 800,
									fontSize: 96,
									letterSpacing: '0.03em',
									paddingLeft: '0.03em',
									color: C.white,
									lineHeight: 1,
								}}
							>
								IMAGINEZ
							</div>
						</div>
					</Win>
				);
			})}
		</Layer>
	);
};
