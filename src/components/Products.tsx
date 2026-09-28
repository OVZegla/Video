import React from 'react';
import {C, FONT} from '../theme';
import {EyeMark} from './Logo';

/**
 * Product illustrations. Each one draws inside a 128 × 200 box
 * (one window wide) and exposes a small set of 0→1 animation inputs.
 */

const Box: React.FC<{children: React.ReactNode}> = ({children}) => (
	<svg width={128} height={200} viewBox="0 0 128 200" style={{overflow: 'visible'}}>
		{children}
	</svg>
);

/* ------------------------------------------------ printed acrylic panel */
export const PrintedAcrylic: React.FC<{shine: number}> = ({shine}) => {
	const x = 26;
	const y = 44;
	const w = 76;
	const h = 108;
	const sx = -60 + shine * 200;
	return (
		<Box>
			<defs>
				<linearGradient id="pa-sky" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={C.blueDeep} />
					<stop offset="1" stopColor={C.blue} />
				</linearGradient>
				<clipPath id="pa-clip">
					<rect x={x} y={y} width={w} height={h} rx={3} />
				</clipPath>
			</defs>
			{/* acrylic thickness */}
			<rect x={x + 4} y={y + 4} width={w} height={h} rx={3} fill="none" stroke={C.white} strokeOpacity={0.22} />
			<g clipPath="url(#pa-clip)">
				<rect x={x} y={y} width={w} height={h} fill="url(#pa-sky)" />
				<circle cx={x + w * 0.62} cy={y + h * 0.42} r={22} fill={C.red} />
				<rect x={x} y={y + h * 0.66} width={w} height={h * 0.34} fill={C.black} opacity={0.85} />
				<rect x={x + 10} y={y + h * 0.66 - 22} width={14} height={22} fill={C.white} />
				<rect x={x + 28} y={y + h * 0.66 - 34} width={10} height={34} fill={C.white} opacity={0.85} />
				<rect x={x + 8} y={y + h * 0.78} width={40} height={2} fill={C.white} />
				<rect x={x + 8} y={y + h * 0.84} width={26} height={2} fill={C.white} opacity={0.6} />
				{/* gloss sweep */}
				<polygon
					points={`${sx},${y - 10} ${sx + 18},${y - 10} ${sx - 22},${y + h + 10} ${sx - 40},${y + h + 10}`}
					fill={C.white}
					opacity={0.28}
				/>
			</g>
			<rect x={x} y={y} width={w} height={h} rx={3} fill="none" stroke={C.white} strokeOpacity={0.75} strokeWidth={1.2} />
			{[
				[x + 6, y + 6],
				[x + w - 6, y + 6],
				[x + 6, y + h - 6],
				[x + w - 6, y + h - 6],
			].map(([cx, cy], k) => (
				<circle key={k} cx={cx} cy={cy} r={2.2} fill={C.white} opacity={0.9} />
			))}
		</Box>
	);
};

/* ------------------------------------------------ engraved acrylic */
export const EngravedAcrylic: React.FC<{draw: number}> = ({draw}) => {
	const x = 24;
	const y = 40;
	const w = 80;
	const h = 116;
	const dash = (d: number) => ({
		pathLength: 1,
		strokeDasharray: 1,
		strokeDashoffset: 1 - Math.max(0, Math.min(1, d)),
	});
	return (
		<Box>
			<rect x={x} y={y} width={w} height={h} rx={10} fill={C.white} fillOpacity={0.06} stroke={C.white} strokeOpacity={0.6} strokeWidth={1.2} />
			<rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx={8} fill="none" stroke={C.white} strokeOpacity={0.15} />
			{/* engraved circle + mark */}
			<circle cx={64} cy={84} r={24} fill="none" stroke={C.white} strokeWidth={1.4} {...dash(draw * 1.6)} transform="rotate(-90 64 84)" />
			<foreignObject x={48} y={68} width={32} height={32}>
				<EyeMark size={32} p={Math.max(0, Math.min(1, (draw - 0.3) * 1.8))} mono />
			</foreignObject>
			{/* engraved text lines */}
			<path d={`M ${x + 16} 126 H ${x + w - 16}`} stroke={C.white} strokeWidth={2} {...dash(draw * 1.8 - 0.6)} />
			<path d={`M ${x + 24} 136 H ${x + w - 24}`} stroke={C.white} strokeOpacity={0.6} strokeWidth={1.4} {...dash(draw * 1.8 - 0.8)} />
		</Box>
	);
};

/* ------------------------------------------------ wood panel */
export const WoodPanel: React.FC<{burn: number}> = ({burn}) => {
	const x = 24;
	const y = 46;
	const w = 80;
	const h = 104;
	const grains = Array.from({length: 11}, (_, k) => {
		const gy = y + 6 + k * 9.5;
		const a = 2 + (k % 3);
		return `M ${x} ${gy} C ${x + 20} ${gy - a} ${x + 40} ${gy + a * 1.4} ${x + w} ${gy - a * 0.6}`;
	});
	return (
		<Box>
			<defs>
				<linearGradient id="wood" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor={C.woodLight} />
					<stop offset="1" stopColor={C.wood} />
				</linearGradient>
				<clipPath id="wood-clip">
					<rect x={x} y={y} width={w} height={h} rx={2} />
				</clipPath>
			</defs>
			<rect x={x + 3} y={y + 3} width={w} height={h} rx={2} fill={C.woodDark} />
			<g clipPath="url(#wood-clip)">
				<rect x={x} y={y} width={w} height={h} fill="url(#wood)" />
				{grains.map((d, k) => (
					<path key={k} d={d} stroke={C.woodDark} strokeOpacity={0.45} strokeWidth={1} fill="none" />
				))}
				<ellipse cx={x + 58} cy={y + 30} rx={6} ry={3} fill={C.woodDark} opacity={0.5} />
			</g>
			{/* laser-burned marking */}
			<g opacity={burn}>
				<foreignObject x={64 - 24} y={y + 22} width={48} height={48}>
					<EyeMark size={48} ink="#3B200D" mono />
				</foreignObject>
				<rect x={x + 18} y={y + 80} width={w - 36} height={2} fill="#3B200D" />
				<rect x={x + 26} y={y + 87} width={w - 52} height={1.5} fill="#3B200D" opacity={0.7} />
			</g>
		</Box>
	);
};

/* ------------------------------------------------ personalised mug */
export const Mug: React.FC<{print: number}> = ({print}) => {
	return (
		<Box>
			<defs>
				<linearGradient id="mug" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#C9C9C4" />
					<stop offset="0.35" stopColor={C.white} />
					<stop offset="1" stopColor="#A9A9A4" />
				</linearGradient>
				<clipPath id="mug-clip">
					<path d="M 30 62 H 90 V 140 Q 90 152 78 152 H 42 Q 30 152 30 140 Z" />
				</clipPath>
			</defs>
			<path d="M 90 78 C 112 78 112 124 90 124" fill="none" stroke="#BDBDB8" strokeWidth={8} />
			<path d="M 30 62 H 90 V 140 Q 90 152 78 152 H 42 Q 30 152 30 140 Z" fill="url(#mug)" />
			<ellipse cx={60} cy={62} rx={30} ry={4.5} fill="#8E8E8A" />
			<g clipPath="url(#mug-clip)">
				<rect x={30} y={88} width={60 * print} height={30} fill={C.blue} />
				<circle cx={50} cy={103} r={9 * print} fill={C.red} />
				<text x={72} y={108} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={13} fill={C.white} opacity={print}>
					LÉA
				</text>
			</g>
		</Box>
	);
};

/* ------------------------------------------------ projecting blade sign */
export const BladeSign: React.FC<{swing: number; light: number}> = ({swing, light}) => {
	return (
		<Box>
			<rect x={14} y={40} width={4} height={24} fill={C.white} opacity={0.7} />
			<rect x={14} y={50} width={96} height={3} fill={C.white} />
			<g transform={`rotate(${swing} 64 52)`}>
				<line x1={30} y1={52} x2={30} y2={70} stroke={C.white} strokeWidth={1} />
				<line x1={98} y1={52} x2={98} y2={70} stroke={C.white} strokeWidth={1} />
				<rect x={20} y={70} width={88} height={76} rx={2} fill={C.blue} />
				<rect x={20} y={70} width={10} height={76} fill={C.red} />
				<circle cx={80} cy={96} r={11} fill="none" stroke={C.white} strokeWidth={2} />
				<circle cx={80} cy={96} r={4} fill={C.white} opacity={0.4 + 0.6 * light} />
				<text x={69} y={132} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={13} letterSpacing={1.6} fill={C.white}>
					OUVERT
				</text>
			</g>
		</Box>
	);
};

/* ------------------------------------------------ laser-cut rosette */
const rosette = (theta: number, R: number) => R * (1 + 0.16 * Math.cos(8 * theta));

export const LaserCut: React.FC<{cut: number; pop: number}> = ({cut, pop}) => {
	const cx = 64;
	const cy = 100;
	const R = 40;
	const N = 240;
	const pts: string[] = [];
	for (let k = 0; k <= N; k++) {
		const th = (k / N) * Math.PI * 2 - Math.PI / 2;
		const r = rosette(th, R);
		pts.push(`${(cx + r * Math.cos(th)).toFixed(2)},${(cy + r * Math.sin(th)).toFixed(2)}`);
	}
	const d = `M ${pts.join(' L ')} Z`;
	const th = cut * Math.PI * 2 - Math.PI / 2;
	const hr = rosette(th, R);
	const hx = cx + hr * Math.cos(th);
	const hy = cy + hr * Math.sin(th);
	const cutting = cut > 0 && cut < 1;
	return (
		<Box>
			{/* sheet */}
			<rect x={14} y={46} width={100} height={108} fill={C.white} opacity={0.05 * (1 - pop)} />
			<rect x={14} y={46} width={100} height={108} fill="none" stroke={C.white} strokeOpacity={0.25 * (1 - pop)} strokeDasharray="3 4" />
			{/* the freed piece */}
			<g transform={`translate(0 ${-6 * pop}) rotate(${pop * 22.5} ${cx} ${cy})`}>
				<path d={d} fill={C.white} opacity={pop} />
				<circle cx={cx} cy={cy} r={11} fill={C.black} opacity={pop} />
				<circle cx={cx} cy={cy} r={5} fill={C.red} opacity={pop} />
			</g>
			<path d={d} fill="none" stroke={C.red} strokeWidth={1.6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cut} opacity={1 - pop} />
			{cutting ? (
				<g>
					<circle cx={hx} cy={hy} r={7} fill={C.red} opacity={0.35} />
					<circle cx={hx} cy={hy} r={2.4} fill={C.white} />
					<line x1={hx} y1={hy} x2={hx} y2={20} stroke={C.red} strokeOpacity={0.5} strokeWidth={0.8} />
				</g>
			) : null}
		</Box>
	);
};

/* ------------------------------------------------ printed decorative panel */
const TILE = [
	'q-tl-blue',
	'sq-red',
	'half-white',
	'dot-blue',
	'half-red',
	'q-br-white',
	'q-tl-white',
	'dot-red',
	'sq-blue',
	'q-br-red',
	'half-blue',
	'dot-white',
];

const colorOf = (s: string) =>
	s.endsWith('blue') ? C.blue : s.endsWith('red') ? C.red : C.white;

export const DecorPanel: React.FC<{tiles: number}> = ({tiles}) => {
	const s = 28;
	const ox = 22;
	const oy = 44;
	return (
		<Box>
			{TILE.map((kind, k) => {
				const col = k % 3;
				const row = Math.floor(k / 3);
				const x = ox + col * s;
				const y = oy + row * s;
				const local = Math.max(0, Math.min(1, tiles * 1.8 - k * 0.07));
				const c = colorOf(kind);
				const r = s - 2;
				let shape: React.ReactNode;
				if (kind.startsWith('q-tl')) {
					shape = <path d={`M ${x + 1} ${y + 1} h ${r} a ${r} ${r} 0 0 1 ${-r} ${r} Z`} fill={c} />;
				} else if (kind.startsWith('q-br')) {
					shape = <path d={`M ${x + s - 1} ${y + s - 1} h ${-r} a ${r} ${r} 0 0 1 ${r} ${-r} Z`} fill={c} />;
				} else if (kind.startsWith('half')) {
					shape = <path d={`M ${x + 1} ${y + s - 1} a ${r / 2} ${r / 2} 0 0 1 ${r} 0 Z`} fill={c} />;
				} else if (kind.startsWith('dot')) {
					shape = <circle cx={x + s / 2} cy={y + s / 2} r={s / 4} fill={c} />;
				} else {
					shape = <rect x={x + 5} y={y + 5} width={s - 10} height={s - 10} fill={c} />;
				}
				return (
					<g
						key={kind}
						opacity={local}
						transform={`translate(${x + s / 2} ${y + s / 2}) scale(${0.4 + 0.6 * local}) rotate(${(1 - local) * 90}) translate(${-(x + s / 2)} ${-(y + s / 2)})`}
					>
						{shape}
					</g>
				);
			})}
			<rect x={ox} y={oy} width={s * 3} height={s * 4} fill="none" stroke={C.white} strokeOpacity={0.4 * tiles} />
		</Box>
	);
};

/* ------------------------------------------------ professional plaque */
export const ProPlaque: React.FC<{p: number}> = ({p}) => {
	const x = 18;
	const y = 66;
	const w = 92;
	const h = 66;
	return (
		<Box>
			<defs>
				<linearGradient id="brushed" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#E9E9E4" />
					<stop offset="0.5" stopColor="#9C9C98" />
					<stop offset="1" stopColor="#D6D6D1" />
				</linearGradient>
			</defs>
			<rect x={x + 3} y={y + 4} width={w} height={h} fill={C.white} opacity={0.12} />
			<rect x={x} y={y} width={w} height={h} fill="url(#brushed)" />
			<rect x={x} y={y} width={6} height={h} fill={C.blue} />
			{[
				[x + 12, y + 7],
				[x + w - 7, y + 7],
				[x + 12, y + h - 7],
				[x + w - 7, y + h - 7],
			].map(([cx, cy], k) => (
				<circle key={k} cx={cx} cy={cy} r={2.4} fill="#5A5A58" />
			))}
			<g opacity={p}>
				<text x={x + 18} y={y + 30} fontFamily={FONT} fontWeight={800} fontSize={13} letterSpacing={1.4} fill="#111">
					ATELIER
				</text>
				<rect x={x + 18} y={y + 37} width={44 * p} height={2} fill={C.red} />
				<text x={x + 18} y={y + 52} fontFamily={FONT} fontWeight={500} fontSize={8} letterSpacing={1.2} fill="#222">
					ARCHITECTES
				</text>
			</g>
		</Box>
	);
};

/* ------------------------------------------------ wayfinding signage */
export const Wayfinding: React.FC<{a: number; b: number}> = ({a, b}) => {
	return (
		<Box>
			<rect x={62} y={40} width={4} height={122} fill={C.white} opacity={0.55} />
			<g transform={`translate(${(1 - a) * 90} 0)`} opacity={a}>
				<path d="M 16 66 H 98 L 112 80 L 98 94 H 16 Z" fill={C.blue} />
				<text x={24} y={85} fontFamily={FONT} fontWeight={700} fontSize={12} letterSpacing={1.2} fill={C.white}>
					ACCUEIL
				</text>
			</g>
			<g transform={`translate(${-(1 - b) * 90} 0)`} opacity={b}>
				<path d="M 112 104 H 30 L 16 118 L 30 132 H 112 Z" fill={C.white} />
				<text x={104} y={123} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={12} letterSpacing={1.2} fill={C.black}>
					ATELIER
				</text>
				<rect x={104} y={104} width={8} height={28} fill={C.red} />
			</g>
		</Box>
	);
};
