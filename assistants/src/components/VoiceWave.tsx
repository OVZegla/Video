import React from 'react';

/**
 * Deterministic voice waveform: rounded bars whose height follows a
 * syllable-like envelope. `level` (0..1) fades the whole wave in/out.
 */
export const VoiceWave: React.FC<{
	f: number;
	bars?: number;
	width: number;
	height: number;
	color: string;
	level: number;
	seed?: number;
}> = ({f, bars = 32, width, height, color, level, seed = 1}) => {
	const gap = width / bars;
	const bw = Math.max(2, gap * 0.46);
	return (
		<svg width={width} height={height} style={{display: 'block', overflow: 'visible'}}>
			{new Array(bars).fill(0).map((_, i) => {
				const x = i * gap + gap / 2;
				const centre = 1 - Math.pow(Math.abs(i / (bars - 1) - 0.5) * 2, 2) * 0.55;
				const syll = 0.5 + 0.5 * Math.sin(f * 0.55 + seed * 3 + Math.sin(f * 0.13 + seed) * 2);
				const n =
					0.55 * Math.abs(Math.sin(i * 1.7 + f * 0.42 + seed)) +
					0.45 * Math.abs(Math.sin(i * 0.63 - f * 0.31 + seed * 2.1));
				const a = Math.max(0.08, level * centre * (0.25 + 0.75 * n) * (0.45 + 0.55 * syll));
				const h = Math.max(bw, a * height);
				return <rect key={i} x={x - bw / 2} y={(height - h) / 2} width={bw} height={h} rx={bw / 2} fill={color} />;
			})}
		</svg>
	);
};

/** Static waveform for a recorded voice note (drawn up to `played`). */
export const VoiceNoteWave: React.FC<{
	width: number;
	height: number;
	color: string;
	dim: string;
	played: number;
	bars?: number;
}> = ({width, height, color, dim, played, bars = 34}) => {
	const gap = width / bars;
	const bw = gap * 0.5;
	return (
		<svg width={width} height={height} style={{display: 'block'}}>
			{new Array(bars).fill(0).map((_, i) => {
				const v = 0.2 + 0.8 * Math.abs(Math.sin(i * 1.31) * Math.cos(i * 0.47 + 1));
				const h = Math.max(bw, v * height);
				return (
					<rect
						key={i}
						x={i * gap + (gap - bw) / 2}
						y={(height - h) / 2}
						width={bw}
						height={h}
						rx={bw / 2}
						fill={i / bars < played ? color : dim}
					/>
				);
			})}
		</svg>
	);
};
