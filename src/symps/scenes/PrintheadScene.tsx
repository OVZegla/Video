import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Mural} from '../components/Mural';
import {RevealLine, fontBase} from '../components/Typography';
import {C, HEIGHT, WIDTH, ease, inOut, lerp, prog} from '../theme';

/**
 * Double tête Epson I1600.
 *  1. The two heads side by side, nozzle plates grazed by light:
 *     one for colour (CMYK), one dedicated to white.
 *  2. What the white head makes possible, as an exploded view of the
 *     printed layers: support white, relief, white underlayer, colour.
 */
export const PRINTHEAD_DURATION = 222;
const HEADS_END = 100;

export const PrintheadScene: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<AbsoluteFill style={{opacity: 1 - prog(f, HEADS_END - 14, HEADS_END + 4, ease.inOut)}}>
				<Heads />
			</AbsoluteFill>
			<Sequence from={HEADS_END - 8} layout="none">
				<AbsoluteFill style={{opacity: prog(f, HEADS_END - 8, HEADS_END + 12, ease.inOut)}}>
					<Layers />
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};

// ————————————————————————————————— 1. the heads

const Head: React.FC<{x: number; label: string; inks: string[]; sweep: number; drops: number}> = ({x, label, inks, sweep, drops}) => {
	const f = useCurrentFrame();
	const w = 420;
	const h = 300;
	const plateY = 250;
	return (
		<g transform={`translate(${x - w / 2} 0)`}>
			{/* flat cables */}
			{[0.3, 0.7].map((p) => (
				<rect key={p} x={w * p - 34} y={-60} width={68} height={100} fill="#C9A45A" opacity={0.85} />
			))}
			{/* body */}
			<rect x={0} y={30} width={w} height={h - 60} rx={10} fill="url(#headBody)" />
			<rect x={0} y={30} width={w} height={2} fill="#FFFFFF" opacity={0.25} />
			<text x={24} y={80} fontFamily="SympsInter, Helvetica" fontSize={18} fontWeight={600} letterSpacing={3} fill="#9EA3AB">
				EPSON
			</text>
			<text x={24} y={104} fontFamily="SympsInter, Helvetica" fontSize={14} fontWeight={500} letterSpacing={2} fill="#6E737B">
				I1600
			</text>
			{/* ink ports */}
			{inks.map((c, i) => (
				<g key={i}>
					<rect x={w - 40 - (inks.length - i) * 44} y={48} width={30} height={46} rx={6} fill="#15161A" />
					<circle cx={w - 25 - (inks.length - i) * 44} cy={71} r={8} fill={c} />
				</g>
			))}
			{/* nozzle plate */}
			<rect x={16} y={plateY} width={w - 32} height={40} rx={4} fill="url(#plate)" />
			<clipPath id={`plateClip-${label}`}>
				<rect x={16} y={plateY} width={w - 32} height={40} rx={4} />
			</clipPath>
			<g clipPath={`url(#plateClip-${label})`}>
				<rect x={16 + lerp(-w, w, sweep)} y={plateY} width={w - 32} height={40} fill="url(#plateSweep)" />
			</g>
			{Array.from({length: 4}).map((_, r) =>
				Array.from({length: 46}).map((__, c) => (
					<circle key={`${r}-${c}`} cx={30 + c * 8.3 + (r % 2) * 4} cy={plateY + 9 + r * 7.5} r={1.5} fill="#0A0A0C" />
				)),
			)}
			{/* droplets */}
			{Array.from({length: 18}).map((_, i) => {
				const t = ((f * 1.6 + i * 23) % 60) / 60;
				const cx = 40 + ((i * 37) % (w - 80));
				const col = inks[i % inks.length];
				return <circle key={i} cx={cx} cy={plateY + 44 + t * 170} r={2.2} fill={col} opacity={drops * (1 - t) * 0.9} />;
			})}
			<text x={w / 2} y={plateY + 250} textAnchor="middle" fontFamily="SympsInter, Helvetica" fontSize={20} fontWeight={500} letterSpacing={6} fill="#A1A1A6">
				{label}
			</text>
		</g>
	);
};

const Heads: React.FC = () => {
	const f = useCurrentFrame();
	const t = prog(f, 0, HEADS_END, ease.camera);
	const sweep = prog(f, 10, 80, ease.inOut);
	const drops = prog(f, 40, 60, ease.inOut);
	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: WIDTH / 2 - 560,
					top: 330,
					transform: `scale(${lerp(1.12, 1, t)}) translateY(${lerp(20, 0, t)}px)`,
					transformOrigin: '560px 200px',
					filter: `blur(${lerp(6, 0, prog(f, 0, 36, ease.out))}px)`,
				}}
			>
				<svg width={1120} height={620} viewBox="0 -80 1120 620" style={{overflow: 'visible'}}>
					<defs>
						<linearGradient id="headBody" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0" stopColor="#2A2C31" />
							<stop offset="1" stopColor="#0E0F12" />
						</linearGradient>
						<linearGradient id="plate" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0" stopColor="#8E939B" />
							<stop offset="1" stopColor="#4A4E55" />
						</linearGradient>
						<linearGradient id="plateSweep" x1="0" x2="1" y1="0" y2="0">
							<stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
							<stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.55} />
							<stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
						</linearGradient>
					</defs>
					{/* carriage plate the heads are mounted on (Opaline blue) */}
					<rect x={-20} y={0} width={1160} height={20} rx={4} fill="#1D3A9A" />
					<rect x={-20} y={0} width={1160} height={2} fill="#FFFFFF" opacity={0.3} />
					<Head x={290} label="CMYK" inks={['#00A3E0', '#E4007C', '#FFD400', '#1A1A1E']} sweep={sweep} drops={drops} />
					<Head x={830} label="BLANC" inks={['#F4F4F2', '#F4F4F2']} sweep={Math.max(0, sweep - 0.1)} drops={drops} />
				</svg>
			</div>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 60% at 50% 60%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.9) 100%)'}} />
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 120}}>
				<RevealLine at={12} out={HEADS_END - 18}>
					<div style={{...fontBase, fontSize: 22, fontWeight: 500, letterSpacing: '0.4em', color: C.mist, textAlign: 'center', marginRight: '-0.4em'}}>DOUBLE TÊTE</div>
				</RevealLine>
				<RevealLine at={20} out={HEADS_END - 18} style={{marginTop: 18}}>
					<div style={{...fontBase, fontSize: 84, fontWeight: 600, letterSpacing: '-0.03em', color: C.ink}}>Epson I1600</div>
				</RevealLine>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ————————————————————————————————— 2. exploded layers

const LW = 720;
const LH = 460;

const Slab: React.FC<{z: number; opacity?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({z, opacity = 1, children, style}) => (
	<div
		style={{
			position: 'absolute',
			left: -LW / 2,
			top: -LH / 2,
			width: LW,
			height: LH,
			transform: `translateZ(${z}px)`,
			opacity,
			...style,
		}}
	>
		{children}
	</div>
);

// Relief motif: parallel ridges, printed as stacked passes of white.
const ReliefShape: React.FC<{scale: number}> = ({scale}) => (
	<svg width={LW} height={LH} viewBox={`0 0 ${LW} ${LH}`}>
		{Array.from({length: 7}).map((_, i) => {
			const y = 60 + i * 56;
			const inset = 60 + (1 - scale) * 160;
			return (
				<path
					key={i}
					d={`M ${inset} ${y} C ${LW * 0.35} ${y - 30}, ${LW * 0.65} ${y + 30}, ${LW - inset} ${y}`}
					fill="none"
					stroke="#FFFFFF"
					strokeWidth={18 * scale}
					strokeLinecap="round"
				/>
			);
		})}
	</svg>
);

const LAYERS = [
	{key: 'wall', label: 'Mur', note: 'Brut, sombre, texturé.'},
	{key: 'support', label: 'Blanc de soutien', note: 'Des couleurs éclatantes, même sur fond sombre.'},
	{key: 'relief', label: 'Relief', note: 'Le blanc monte, passe après passe.'},
	{key: 'under', label: 'Sous-couche de blanc', note: 'Sous chaque couleur, une base parfaite.'},
	{key: 'color', label: 'Couleur', note: 'La quadrichromie CMJN, par-dessus.'},
] as const;

/** Exploded view of the printed layers; plays for LAYERS_DURATION frames. */
export const LAYERS_DURATION = PRINTHEAD_DURATION - (HEADS_END - 8);
export const Layers: React.FC = () => {
	const lf = useCurrentFrame(); // relative to the Sequence
	const D = PRINTHEAD_DURATION - (HEADS_END - 8);
	const arrive = (i: number) => prog(lf, 6 + i * 14, 34 + i * 14, ease.out);
	const collapse = prog(lf, D - 40, D - 6, ease.inOut);
	const gap = lerp(62, 8, collapse);
	const spin = lerp(-34, -28, prog(lf, 0, D, ease.camera));
	const zOf = (i: number) => i * gap + (1 - arrive(i)) * 200;

	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: WIDTH * 0.37, top: HEIGHT * 0.66, perspective: 2600}}>
				<div style={{transformStyle: 'preserve-3d', transform: `rotateX(58deg) rotateZ(${spin}deg)`}}>
					{/* wall */}
					<Slab z={zOf(0)} opacity={arrive(0)} style={{background: 'linear-gradient(135deg, #3A3633, #1C1A19)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)'}}>
						<div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 2px, rgba(0,0,0,0) 2px 70px), repeating-linear-gradient(90deg, rgba(0,0,0,0.2) 0 2px, rgba(0,0,0,0) 2px 140px)'}} />
					</Slab>
					{/* support white */}
					<Slab z={zOf(1)} opacity={arrive(1) * 0.96} style={{background: '#F2F2EF', boxShadow: '0 0 0 1px rgba(255,255,255,0.4)'}} />
					{/* relief: stacked white passes */}
					{[0, 1, 2, 3].map((k) => (
						<Slab key={k} z={zOf(2) + k * lerp(9, 3, collapse)} opacity={arrive(2)}>
							<ReliefShape scale={1 - k * 0.14} />
						</Slab>
					))}
					{/* white underlayer (under the coloured areas only) */}
					<Slab z={zOf(3)} opacity={arrive(3) * 0.95}>
						<svg width={LW} height={LH}>
							<circle cx={LW * 0.3} cy={LH * 0.42} r={140} fill="#FAFAF8" />
							<rect x={LW * 0.52} y={LH * 0.12} width={LW * 0.36} height={LH * 0.76} rx={24} fill="#FAFAF8" />
						</svg>
					</Slab>
					{/* colour */}
					<Slab z={zOf(4)} opacity={arrive(4)} style={{overflow: 'hidden'}}>
						<svg width={LW} height={LH}>
							<defs>
								<clipPath id="colourShapes">
									<circle cx={LW * 0.3} cy={LH * 0.42} r={140} />
									<rect x={LW * 0.52} y={LH * 0.12} width={LW * 0.36} height={LH * 0.76} rx={24} />
								</clipPath>
							</defs>
							<g clipPath="url(#colourShapes)">
								<foreignObject width={LW} height={LH}>
									<Mural style="blobs" palette={['#0B1C4A', '#2F7BFF', '#E0233D', '#FFC83D', '#00A3E0']} width={LW} height={LH} />
								</foreignObject>
							</g>
						</svg>
					</Slab>
				</div>
			</div>

			{/* labels */}
			<div style={{position: 'absolute', left: WIDTH * 0.64, top: 330, display: 'flex', flexDirection: 'column-reverse', gap: 30}}>
				{LAYERS.map((l, i) => {
					const o = inOut(lf, 14 + i * 14, 40 + i * 14, D - 30, D - 10, ease.inOut);
					return (
						<div key={l.key} style={{opacity: o, transform: `translateX(${(1 - prog(lf, 14 + i * 14, 44 + i * 14, ease.out)) * 30}px)`}}>
							<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
								<div style={{width: 28, height: 2, background: l.key === 'color' ? C.blue : l.key === 'wall' ? '#6E6E73' : '#FFFFFF'}} />
								<div style={{...fontBase, fontSize: 30, fontWeight: 500, letterSpacing: '-0.01em', color: C.ink}}>{l.label}</div>
							</div>
							<div style={{...fontBase, fontSize: 20, fontWeight: 300, color: C.mist, marginLeft: 44, marginTop: 6}}>{l.note}</div>
						</div>
					);
				})}
			</div>

			<AbsoluteFill style={{alignItems: 'center', paddingTop: 96}}>
				<RevealLine at={4} out={D - 30}>
					<div style={{...fontBase, fontSize: 56, fontWeight: 500, letterSpacing: '-0.03em', color: C.ink}}>Le blanc change tout.</div>
				</RevealLine>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
