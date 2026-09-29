import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {HEIGHT, WIDTH, WIN_W} from '../theme';

/**
 * Bauhaus pattern vocabulary (after the brand's graphic motif): flowing bundles
 * of parallel stripes, vertical stripe blocks, triangle checkers, half discs,
 * concentric arcs and the hatched "eye". Every motif is drawn in window
 * coordinates (128 × 320) and animated by `p` (0 → 1).
 */

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

export type Motif =
	| {kind: 'vstripes'; x: number; y: number; w: number; h: number; n: number; from?: 'top' | 'bottom'}
	| {kind: 'hstripes'; x: number; y: number; w: number; h: number; n: number}
	| {kind: 'tri'; x: number; y: number; cell: number; cols: number; rows: number}
	| {kind: 'half'; cx: number; cy: number; r: number; rot: number}
	| {kind: 'quarter'; cx: number; cy: number; r: number; rot: number}
	| {kind: 'arcs'; cx: number; cy: number; r: number; n: number; rot: number}
	| {kind: 'eye'; cx: number; cy: number; r: number; accent: string; hole: string; pupil?: string}
	| {kind: 'disc'; cx: number; cy: number; r: number};

export const MotifShape: React.FC<{m: Motif; color: string; p: number}> = ({m, color, p}) => {
	switch (m.kind) {
		case 'vstripes': {
			const sw = m.w / (m.n * 2 - 1);
			return (
				<>
					{Array.from({length: m.n}, (_, k) => {
						const t = easeOut(p * 1.6 - k * 0.06);
						const h = m.h * t;
						const y = m.from === 'bottom' ? m.y + m.h - h : m.y;
						return <rect key={k} x={m.x + k * sw * 2} y={y} width={sw} height={h} fill={color} />;
					})}
				</>
			);
		}
		case 'hstripes': {
			const sh = m.h / (m.n * 2 - 1);
			return (
				<>
					{Array.from({length: m.n}, (_, k) => (
						<rect key={k} x={m.x} y={m.y + k * sh * 2} width={m.w * easeOut(p * 1.6 - k * 0.07)} height={sh} fill={color} />
					))}
				</>
			);
		}
		case 'tri': {
			const out: React.ReactNode[] = [];
			for (let r = 0; r < m.rows; r++) {
				for (let c = 0; c < m.cols; c++) {
					const k = r * m.cols + c;
					const t = easeOut(p * 1.8 - k * 0.08);
					const x = m.x + c * m.cell;
					const y = m.y + r * m.cell;
					const flip = (r + c) % 2 === 0;
					const pts = flip
						? `${x},${y} ${x + m.cell},${y} ${x},${y + m.cell}`
						: `${x + m.cell},${y} ${x + m.cell},${y + m.cell} ${x},${y + m.cell}`;
					out.push(
						<polygon
							key={k}
							points={pts}
							fill={color}
							transform={`translate(${x + m.cell / 2} ${y + m.cell / 2}) scale(${t}) translate(${-(x + m.cell / 2)} ${-(y + m.cell / 2)})`}
						/>,
					);
				}
			}
			return <>{out}</>;
		}
		case 'half':
		case 'quarter': {
			const sweep = m.kind === 'half' ? 180 : 90;
			const rot = m.rot + (1 - easeOut(p)) * -90;
			const a1 = (sweep * Math.PI) / 180;
			const d =
				m.kind === 'half'
					? `M ${-m.r} 0 A ${m.r} ${m.r} 0 0 1 ${m.r} 0 Z`
					: `M 0 0 L ${m.r} 0 A ${m.r} ${m.r} 0 0 1 ${m.r * Math.cos(a1)} ${m.r * Math.sin(a1)} Z`;
			return <path d={d} fill={color} transform={`translate(${m.cx} ${m.cy}) rotate(${rot}) scale(${easeOut(p)})`} />;
		}
		case 'arcs': {
			const gap = m.r / (m.n * 2);
			return (
				<g transform={`translate(${m.cx} ${m.cy}) rotate(${m.rot})`}>
					{Array.from({length: m.n}, (_, k) => {
						const r = m.r - k * gap * 2 - gap / 2;
						const t = easeOut(p * 1.5 - k * 0.08);
						return (
							<path
								key={k}
								d={`M ${r} 0 A ${r} ${r} 0 0 1 0 ${r}`}
								fill="none"
								stroke={color}
								strokeWidth={gap}
								pathLength={1}
								strokeDasharray={`${t} 1`}
							/>
						);
					})}
				</g>
			);
		}
		case 'eye': {
			const ringW = m.r * 0.42;
			const rr = m.r - ringW / 2;
			const t = easeOut(p);
			const a0 = -Math.PI * 0.38;
			const a1 = -Math.PI * 0.06;
			// hatched sector: short radial strokes across the ring
			const hatch = Array.from({length: 11}, (_, k) => {
				const a = a0 + ((a1 - a0) * (k + 0.5)) / 11;
				return (
					<line
						key={k}
						x1={Math.cos(a) * (m.r - ringW)}
						y1={Math.sin(a) * (m.r - ringW)}
						x2={Math.cos(a) * m.r}
						y2={Math.sin(a) * m.r}
						stroke={m.accent}
						strokeWidth={m.r * 0.045}
					/>
				);
			});
			return (
				<g transform={`translate(${m.cx} ${m.cy}) rotate(${(1 - t) * -140}) scale(${0.6 + 0.4 * t})`} opacity={clamp(p * 3)}>
					<circle r={rr} fill="none" stroke={color} strokeWidth={ringW} pathLength={1} strokeDasharray={`${t} 1`} transform="rotate(-60)" />
					<path
						d={`M ${Math.cos(a0) * (m.r + 1)} ${Math.sin(a0) * (m.r + 1)} A ${m.r + 1} ${m.r + 1} 0 0 1 ${Math.cos(a1) * (m.r + 1)} ${Math.sin(a1) * (m.r + 1)} L ${Math.cos(a1) * (m.r - ringW - 1)} ${Math.sin(a1) * (m.r - ringW - 1)} A ${m.r - ringW - 1} ${m.r - ringW - 1} 0 0 0 ${Math.cos(a0) * (m.r - ringW - 1)} ${Math.sin(a0) * (m.r - ringW - 1)} Z`}
						fill={m.hole}
						opacity={t}
					/>
					<g opacity={t}>{hatch}</g>
					<circle r={(m.r - ringW) * 0.62 * t} fill={m.pupil ?? color} />
				</g>
			);
		}
		case 'disc':
			return <circle cx={m.cx} cy={m.cy} r={m.r * easeOut(p)} fill={color} />;
	}
};

/**
 * The flowing stripe bundle that crosses all five windows. It is drawn in
 * global canvas coordinates and each window renders its own slice (offset by
 * the window's x), so the ribbon is continuous across the storefront while its
 * colour follows each window's palette.
 */
export type Ribbon = {y0: number; amp: number; waves: number; n: number; gap: number; width: number; tilt?: number};

const ribbonPaths = (rb: Ribbon, frame: number, x0: number, duration: number) => {
	// phase: 2 full cycles per loop → seamless whatever the composition length
	const phase = (frame / duration) * Math.PI * 2 * 2;
	const paths: string[] = [];
	for (let k = 0; k < rb.n; k++) {
		const off = (k - (rb.n - 1) / 2) * rb.gap;
		let d = '';
		for (let gx = x0 - 8; gx <= x0 + WIN_W + 8; gx += 3) {
			const u = gx / WIDTH;
			// the bundle pinches and fans like the brand motif
			const fan = 0.65 + 0.35 * Math.cos(u * Math.PI * 2 * rb.waves + phase * 0.5);
			const y = rb.y0 + (rb.tilt ?? 0) * (u - 0.5) + rb.amp * Math.sin(u * Math.PI * 2 * rb.waves + phase) + off * fan;
			d += `${d ? 'L' : 'M'} ${(gx - x0).toFixed(1)} ${y.toFixed(1)} `;
		}
		paths.push(d);
	}
	return paths;
};

export type WindowStyle = {
	bg: string;
	fg: string; // motif colour
	motifs: Motif[];
	ribbon?: Ribbon;
	ribbonColor?: string;
};

/** A window's coloured ground with its Bauhaus motifs and its slice of the ribbon. */
export const WindowBg: React.FC<{i: number; style: WindowStyle; lf: number}> = ({i, style, lf}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const p = (k: number) => clamp((lf - 4 - k * 8) / 40);
	const rp = clamp((lf - 10) / 40);
	return (
		<svg width={WIN_W} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
			<rect width={WIN_W} height={HEIGHT} fill={style.bg} />
			{style.motifs.map((m, k) => (
				<MotifShape key={k} m={m} color={style.fg} p={p(k)} />
			))}
			{style.ribbon
				? ribbonPaths(style.ribbon, frame, i * WIN_W, durationInFrames).map((d, k) => (
						<path
							key={k}
							d={d}
							fill="none"
							stroke={style.ribbonColor ?? style.fg}
							strokeWidth={style.ribbon!.width}
							strokeLinecap="butt"
							pathLength={1}
							strokeDasharray={`${easeOut(rp * 1.4 - k * 0.05)} 1`}
						/>
					))
				: null}
		</svg>
	);
};
