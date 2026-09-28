import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, ease, FONT, prog} from '../theme';
import {Label, Layer, Win} from '../components/primitives';
import {DecorPanel, LaserCut, ProPlaque, Wayfinding} from '../components/Products';

export const CREEZ_LEN = 86;

// Windows open from the centre outwards, and close in the same order.
const ORDER = [2, 1, 3, 0, 4];

/**
 * Four making techniques around the word "CRÉEZ". Each window is revealed by
 * a horizontal shutter mask that opens from its mid-line.
 */
export const Creez: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const shutter = (i: number) => {
		const k = ORDER.indexOf(i);
		const open = prog(frame, k * 4, k * 4 + 18, ease.out);
		const close = prog(frame, 58 + k * 3, 58 + k * 3 + 14, ease.in);
		const v = open * (1 - close);
		return `inset(${(1 - v) * 50}% 0 ${(1 - v) * 50}% 0)`;
	};
	const lp = (i: number) => {
		const k = ORDER.indexOf(i);
		return prog(frame, 20 + k * 3, 34 + k * 3, ease.out) * (1 - prog(frame, 52 + k * 2, 62 + k * 2, ease.in));
	};

	const letters = ['C', 'R', 'E', 'E', 'Z'];
	const accent = spring({frame: frame - 26, fps, config: {damping: 12, stiffness: 120}});

	return (
		<Layer>
			{/* 1 — laser cutting */}
			<Win i={0} style={{clipPath: shutter(0)}}>
				<div style={{position: 'absolute', top: 30}}>
					<LaserCut cut={prog(frame, 12, 50, ease.soft)} pop={prog(frame, 50, 60, ease.out)} />
				</div>
				<Label text="DÉCOUPE LASER" p={lp(0)} accent={C.red} />
			</Win>

			{/* 2 — printed decorative panel */}
			<Win i={1} style={{clipPath: shutter(1)}}>
				<div style={{position: 'absolute', top: 30}}>
					<DecorPanel tiles={prog(frame, 8, 44, ease.soft)} />
				</div>
				<Label text="DÉCOR IMPRIMÉ" p={lp(1)} accent={C.blue} />
			</Win>

			{/* 3 — CRÉEZ */}
			<Win i={2} style={{clipPath: shutter(2)}}>
				<div
					style={{
						position: 'absolute',
						top: 136,
						left: 0,
						width: 128,
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					{letters.map((l, k) => {
						const s = spring({frame: frame - 6 - k * 3, fps, config: {damping: 14, stiffness: 110}});
						const out = prog(frame, 54 + k * 2, 68 + k * 2, ease.in);
						return (
							<div
								key={k}
								style={{
									position: 'relative',
									fontFamily: FONT,
									fontWeight: 800,
									fontSize: 34,
									lineHeight: 1,
									color: C.white,
									transform: `translateY(${(1 - s) * -60 + out * 60}px) rotate(${(1 - s) * -25}deg)`,
									opacity: Math.min(1, s * 2) * (1 - out),
								}}
							>
								{l}
								{k === 2 ? (
									<div
										style={{
											position: 'absolute',
											left: 7,
											top: -9 - (1 - accent) * 30,
											width: 10,
											height: 4,
											background: C.red,
											transform: 'skewY(-28deg)',
											opacity: accent,
										}}
									/>
								) : null}
							</div>
						);
					})}
				</div>
				<div
					style={{
						position: 'absolute',
						left: 64 - 30,
						top: 186,
						display: 'flex',
						height: 3,
						width: 60,
						transform: `scaleX(${prog(frame, 22, 40, ease.out) * (1 - prog(frame, 52, 64, ease.in))})`,
					}}
				>
					<div style={{flex: 1, background: C.blue}} />
					<div style={{flex: 1, background: C.white}} />
					<div style={{flex: 1, background: C.red}} />
				</div>
				{/* slow-rotating half-disc — the one ornament in the centre window */}
				<div
					style={{
						position: 'absolute',
						left: 64 - 30,
						top: 58,
						width: 60,
						height: 30,
						borderRadius: '60px 60px 0 0',
						background: C.blue,
						transformOrigin: '50% 100%',
						transform: `rotate(${-90 + prog(frame, 4, 40, ease.out) * 90 + frame * 0.4}deg)`,
					}}
				/>
			</Win>

			{/* 4 — professional plaque */}
			<Win i={3} style={{clipPath: shutter(3)}}>
				<div
					style={{
						position: 'absolute',
						top: 30,
						transform: `translateY(${(1 - prog(frame, 10, 34, ease.out)) * 24}px)`,
					}}
				>
					<ProPlaque p={prog(frame, 24, 40, ease.out)} />
				</div>
				<Label text="PLAQUE PRO" p={lp(3)} accent={C.white} />
			</Win>

			{/* 5 — wayfinding signage */}
			<Win i={4} style={{clipPath: shutter(4)}}>
				<div style={{position: 'absolute', top: 30}}>
					<Wayfinding a={prog(frame, 16, 36, ease.out)} b={prog(frame, 22, 42, ease.out)} />
				</div>
				<Label text="SIGNALÉTIQUE" p={lp(4)} accent={C.blue} />
			</Win>
		</Layer>
	);
};
