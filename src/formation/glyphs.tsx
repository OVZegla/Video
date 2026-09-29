import React from 'react';
import {K} from '../franchise/theme';

/**
 * Flat Bauhaus pictograms in a 100 × 100 box: navy, blue, red and wood,
 * geometric primitives only, so they sit with the brand's shapes.
 */
const N = K.navy;
const B = K.blue;
const R = K.red;
const W = K.wood;
const P = K.paperLight;
const S = K.sky;

const G: Record<string, React.ReactNode> = {
	house: (
		<>
			<path d="M 14 48 L 50 16 L 86 48 Z" fill={R} />
			<rect x={22} y={48} width={56} height={40} fill={N} />
			<rect x={44} y={62} width={14} height={26} fill={W} />
		</>
	),
	shop: (
		<>
			<rect x={16} y={40} width={68} height={48} fill={N} />
			{[0, 1, 2, 3].map((k) => (
				<path key={k} d={`M ${12 + k * 19} 40 a 9.5 9.5 0 0 0 19 0 L ${31 + k * 19} 22 L ${12 + k * 19} 22 Z`} fill={k % 2 ? P : R} />
			))}
			<rect x={26} y={56} width={22} height={32} fill={S} />
			<rect x={56} y={56} width={18} height={16} fill={W} />
		</>
	),
	building: (
		<>
			<rect x={24} y={12} width={52} height={78} fill={N} />
			{[0, 1, 2, 3].map((r) =>
				[0, 1, 2].map((c) => <rect key={`${r}${c}`} x={31 + c * 14} y={20 + r * 15} width={9} height={9} fill={(r + c) % 3 ? S : B} />),
			)}
			<rect x={42} y={76} width={16} height={14} fill={W} />
		</>
	),
	people: (
		<>
			<circle cx={32} cy={32} r={11} fill={B} />
			<path d="M 14 80 a 18 22 0 0 1 36 0 Z" fill={B} />
			<circle cx={66} cy={30} r={12} fill={R} />
			<path d="M 46 82 a 20 24 0 0 1 40 0 Z" fill={N} />
		</>
	),
	flag: (
		<>
			<rect x={24} y={12} width={6} height={78} fill={N} />
			<path d="M 30 16 h 44 l -10 14 l 10 14 h -44 z" fill={R} />
			<rect x={16} y={86} width={24} height={6} fill={N} />
		</>
	),
	pin: (
		<>
			<path d="M 50 92 C 30 64 22 54 22 40 a 28 28 0 0 1 56 0 C 78 54 70 64 50 92 Z" fill={R} />
			<circle cx={50} cy={40} r={11} fill={P} />
		</>
	),
	target: (
		<>
			<circle cx={50} cy={50} r={40} fill={N} />
			<circle cx={50} cy={50} r={28} fill={P} />
			<circle cx={50} cy={50} r={16} fill={B} />
			<circle cx={50} cy={50} r={6} fill={R} />
		</>
	),
	laser: (
		<>
			<rect x={12} y={20} width={76} height={60} rx={6} fill={N} />
			<rect x={20} y={28} width={60} height={30} fill="#2A2F6E" />
			<rect x={20} y={40} width={60} height={5} fill={S} />
			<rect x={44} y={36} width={12} height={12} fill={P} />
			<circle cx={50} cy={50} r={3} fill={R} />
			<rect x={20} y={66} width={20} height={6} fill={W} />
		</>
	),
	printer: (
		<>
			<rect x={26} y={14} width={48} height={22} fill={P} stroke={N} strokeWidth={3} />
			<rect x={12} y={34} width={76} height={36} rx={6} fill={N} />
			<rect x={26} y={60} width={48} height={28} fill={P} stroke={N} strokeWidth={3} />
			<rect x={32} y={68} width={10} height={12} fill={R} />
			<rect x={45} y={68} width={10} height={12} fill={B} />
			<rect x={58} y={68} width={10} height={12} fill={W} />
			<circle cx={78} cy={44} r={4} fill={R} />
		</>
	),
	cutter: (
		<>
			<rect x={10} y={30} width={80} height={16} rx={6} fill={N} />
			<path d="M 44 46 L 50 60 L 56 46 Z" fill={R} />
			<rect x={16} y={64} width={68} height={22} fill={W} />
			<path d="M 22 75 q 14 -12 28 0 t 28 0" stroke={N} strokeWidth={3} fill="none" strokeDasharray="4 4" />
		</>
	),
	press: (
		<>
			<rect x={18} y={16} width={64} height={18} rx={4} fill={N} />
			<rect x={46} y={34} width={8} height={14} fill={N} />
			<rect x={22} y={48} width={56} height={10} fill={R} />
			<path d="M 34 60 q 16 8 32 0 l 10 6 l -6 10 l -4 -2 v 14 h -32 v -14 l -4 2 l -6 -10 z" fill={B} />
		</>
	),
	shield: (
		<>
			<path d="M 50 10 L 84 22 V 48 C 84 70 68 84 50 92 C 32 84 16 70 16 48 V 22 Z" fill={N} />
			<path d="M 34 50 L 46 62 L 68 38" stroke={P} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
		</>
	),
	sliders: (
		<>
			{[0, 1, 2].map((k) => (
				<g key={k}>
					<rect x={14} y={24 + k * 26} width={72} height={5} rx={2} fill={N} />
					<circle cx={[34, 66, 48][k]} cy={26.5 + k * 26} r={9} fill={[R, B, W][k]} />
				</g>
			))}
		</>
	),
	screen: (
		<>
			<rect x={10} y={16} width={80} height={54} rx={5} fill={N} />
			<rect x={16} y={22} width={68} height={42} fill={P} />
			<circle cx={40} cy={43} r={12} fill={B} />
			<rect x={56} y={32} width={20} height={22} fill={R} />
			<rect x={42} y={70} width={16} height={10} fill={N} />
			<rect x={30} y={80} width={40} height={6} fill={N} />
		</>
	),
	file: (
		<>
			<path d="M 22 8 H 62 L 80 26 V 92 H 22 Z" fill={P} stroke={N} strokeWidth={4} />
			<path d="M 62 8 V 26 H 80" fill="none" stroke={N} strokeWidth={4} />
			<circle cx={42} cy={48} r={10} fill={R} />
			<path d="M 30 80 L 46 62 L 58 72 L 70 58 V 80 Z" fill={B} />
		</>
	),
	ruler: (
		<>
			<rect x={8} y={36} width={84} height={28} fill={W} transform="rotate(-30 50 50)" />
			{Array.from({length: 8}, (_, k) => (
				<rect key={k} x={14 + k * 10} y={36} width={3} height={k % 2 ? 8 : 14} fill={N} transform="rotate(-30 50 50)" />
			))}
		</>
	),
	swatch: (
		<>
			<rect x={12} y={20} width={30} height={60} rx={4} fill={W} transform="rotate(-14 27 80)" />
			<rect x={35} y={20} width={30} height={60} rx={4} fill={S} transform="rotate(0 50 80)" />
			<rect x={58} y={20} width={30} height={60} rx={4} fill="#B8BCC8" transform="rotate(14 73 80)" />
		</>
	),
	check: (
		<>
			<circle cx={50} cy={50} r={40} fill={B} />
			<path d="M 30 52 L 44 66 L 72 36" stroke={P} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
		</>
	),
	wrench: (
		<>
			<path d="M 64 12 a 22 22 0 0 0 -20 30 L 12 74 L 26 88 L 58 56 a 22 22 0 0 0 30 -20 L 76 48 L 62 42 L 56 28 Z" fill={N} />
			<circle cx={20} cy={80} r={4} fill={W} />
		</>
	),
	drop: (
		<>
			<path d="M 50 10 C 66 34 78 48 78 64 a 28 28 0 0 1 -56 0 C 22 48 34 34 50 10 Z" fill={B} />
			<path d="M 38 62 a 12 12 0 0 0 12 14" stroke={P} strokeWidth={5} fill="none" strokeLinecap="round" />
		</>
	),
	gauge: (
		<>
			<path d="M 12 70 a 38 38 0 0 1 76 0 Z" fill={N} />
			<path d="M 12 70 a 38 38 0 0 1 22 -34 L 50 70 Z" fill={R} />
			<line x1={50} y1={70} x2={72} y2={44} stroke={P} strokeWidth={5} strokeLinecap="round" />
			<circle cx={50} cy={70} r={7} fill={W} />
		</>
	),
	warning: (
		<>
			<path d="M 50 10 L 92 86 H 8 Z" fill={R} strokeLinejoin="round" />
			<rect x={46} y={36} width={8} height={28} rx={3} fill={P} />
			<circle cx={50} cy={74} r={5} fill={P} />
		</>
	),
	headset: (
		<>
			<path d="M 18 58 V 48 a 32 32 0 0 1 64 0 V 58" stroke={N} strokeWidth={7} fill="none" />
			<rect x={12} y={50} width={16} height={28} rx={6} fill={R} />
			<rect x={72} y={50} width={16} height={28} rx={6} fill={R} />
			<path d="M 80 78 q 0 12 -22 12" stroke={N} strokeWidth={4} fill="none" />
			<circle cx={56} cy={90} r={5} fill={B} />
		</>
	),
	calendar: (
		<>
			<rect x={14} y={20} width={72} height={68} rx={6} fill={P} stroke={N} strokeWidth={4} />
			<rect x={14} y={20} width={72} height={18} fill={N} />
			<rect x={28} y={12} width={6} height={16} fill={R} />
			<rect x={66} y={12} width={6} height={16} fill={R} />
			{[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={22 + c * 15} y={46 + r * 13} width={10} height={8} fill={r === 1 && c === 2 ? R : S} />))}
		</>
	),
	tag: (
		<>
			<path d="M 12 46 L 46 12 H 88 V 54 L 54 88 Z" fill={R} />
			<circle cx={72} cy={28} r={7} fill={P} />
			<text x={52} y={64} fontFamily="Jost" fontWeight={700} fontSize={26} fill={P} textAnchor="middle" transform="rotate(-45 52 56)">
				€
			</text>
		</>
	),
	coins: (
		<>
			{[0, 1, 2, 3].map((k) => (
				<ellipse key={k} cx={40} cy={80 - k * 12} rx={24} ry={8} fill={k % 2 ? W : K.woodDark} />
			))}
			<circle cx={70} cy={40} r={18} fill={B} />
			<text x={70} y={48} fontFamily="Jost" fontWeight={700} fontSize={22} fill={P} textAnchor="middle">
				€
			</text>
		</>
	),
	bubble: (
		<>
			<path d="M 10 18 H 70 V 56 H 34 L 20 70 V 56 H 10 Z" fill={B} />
			<path d="M 38 44 H 90 V 78 H 82 V 90 L 70 78 H 38 Z" fill={R} />
			<circle cx={52} cy={61} r={3.5} fill={P} />
			<circle cx={64} cy={61} r={3.5} fill={P} />
			<circle cx={76} cy={61} r={3.5} fill={P} />
		</>
	),
	question: (
		<>
			<circle cx={50} cy={50} r={40} fill={N} />
			<text x={50} y={68} fontFamily="Jost" fontWeight={700} fontSize={52} fill={P} textAnchor="middle">
				?
			</text>
		</>
	),
	doc: (
		<>
			<rect x={20} y={10} width={60} height={80} fill={P} stroke={N} strokeWidth={4} />
			<rect x={28} y={20} width={26} height={6} fill={N} />
			{[0, 1, 2, 3].map((k) => (
				<rect key={k} x={28} y={36 + k * 10} width={44} height={3} fill={S} />
			))}
			<rect x={50} y={74} width={22} height={8} fill={R} />
		</>
	),
	stamp: (
		<>
			<circle cx={50} cy={50} r={38} fill="none" stroke={R} strokeWidth={6} />
			<circle cx={50} cy={50} r={28} fill="none" stroke={R} strokeWidth={2} />
			<text x={50} y={58} fontFamily="Jost" fontWeight={700} fontSize={22} fill={R} textAnchor="middle" transform="rotate(-14 50 50)">
				BAT
			</text>
		</>
	),
	truck: (
		<>
			<rect x={8} y={30} width={52} height={40} fill={N} />
			<path d="M 60 42 H 78 L 92 56 V 70 H 60 Z" fill={B} />
			<circle cx={26} cy={74} r={9} fill={W} />
			<circle cx={76} cy={74} r={9} fill={W} />
			<rect x={16} y={40} width={24} height={4} fill={R} />
		</>
	),
	heart: <path d="M 50 86 C 16 62 10 46 10 34 a 20 20 0 0 1 40 -6 a 20 20 0 0 1 40 6 C 90 46 84 62 50 86 Z" fill={R} />,
	phone: (
		<>
			<rect x={26} y={8} width={48} height={84} rx={9} fill={N} />
			<rect x={31} y={18} width={38} height={62} fill={P} />
			<rect x={34} y={22} width={15} height={15} fill={B} />
			<rect x={51} y={22} width={15} height={15} fill={R} />
			<rect x={34} y={39} width={15} height={15} fill={W} />
			<rect x={51} y={39} width={15} height={15} fill={S} />
			<rect x={34} y={58} width={32} height={4} fill={N} />
			<rect x={34} y={66} width={22} height={4} fill={S} />
		</>
	),
	camera: (
		<>
			<rect x={10} y={30} width={80} height={54} rx={8} fill={N} />
			<rect x={30} y={20} width={24} height={12} fill={N} />
			<circle cx={50} cy={57} r={19} fill={P} />
			<circle cx={50} cy={57} r={12} fill={B} />
			<circle cx={78} cy={40} r={4} fill={R} />
		</>
	),
	megaphone: (
		<>
			<path d="M 18 40 L 70 16 V 84 L 18 60 Z" fill={R} />
			<rect x={10} y={40} width={14} height={20} fill={N} />
			<rect x={26} y={60} width={12} height={24} rx={3} fill={N} />
			<path d="M 80 38 q 10 12 0 24" stroke={B} strokeWidth={5} fill="none" strokeLinecap="round" />
		</>
	),
	star: <path d="M 50 8 L 61 38 L 92 38 L 67 57 L 76 88 L 50 70 L 24 88 L 33 57 L 8 38 L 39 38 Z" fill={W} />,
	handshake: (
		<>
			<path d="M 6 44 L 30 30 L 52 42 L 40 52 Z" fill={B} />
			<path d="M 94 44 L 70 30 L 48 44 L 60 70 Z" fill={N} />
			<path d="M 30 50 L 52 42 L 70 60 L 58 72 Z" fill={W} />
			<circle cx={34} cy={60} r={5} fill={R} />
		</>
	),
	mail: (
		<>
			<rect x={10} y={24} width={80} height={54} rx={4} fill={B} />
			<path d="M 10 28 L 50 56 L 90 28" stroke={P} strokeWidth={5} fill="none" />
			<circle cx={84} cy={24} r={10} fill={R} />
		</>
	),
	loop: (
		<>
			<path d="M 26 52 a 24 24 0 0 1 42 -16" stroke={B} strokeWidth={9} fill="none" />
			<path d="M 74 48 a 24 24 0 0 1 -42 16" stroke={R} strokeWidth={9} fill="none" />
			<path d="M 60 24 L 76 34 L 60 44 Z" fill={B} />
			<path d="M 40 56 L 24 66 L 40 76 Z" fill={R} />
		</>
	),
	chart: (
		<>
			<rect x={12} y={12} width={4} height={76} fill={N} />
			<rect x={12} y={84} width={78} height={4} fill={N} />
			<rect x={24} y={58} width={12} height={26} fill={S} />
			<rect x={42} y={44} width={12} height={40} fill={B} />
			<rect x={60} y={30} width={12} height={54} fill={N} />
			<path d="M 22 54 L 46 38 L 62 44 L 86 16" stroke={R} strokeWidth={4} fill="none" />
		</>
	),
	box: (
		<>
			<path d="M 50 12 L 88 30 V 72 L 50 90 L 12 72 V 30 Z" fill={W} />
			<path d="M 12 30 L 50 48 L 88 30" stroke={K.woodDark} strokeWidth={4} fill="none" />
			<path d="M 50 48 V 90" stroke={K.woodDark} strokeWidth={4} />
			<path d="M 30 21 L 68 39" stroke={N} strokeWidth={6} />
		</>
	),
	palette: (
		<>
			<path d="M 50 10 a 40 40 0 1 0 6 80 c -8 -10 0 -18 10 -16 c 14 2 24 -8 24 -24 C 90 26 72 10 50 10 Z" fill={N} />
			<circle cx={30} cy={44} r={7} fill={R} />
			<circle cx={44} cy={28} r={7} fill={B} />
			<circle cx={64} cy={30} r={7} fill={P} />
			<circle cx={74} cy={50} r={7} fill={W} />
		</>
	),
	brand: (
		<>
			<rect x={10} y={10} width={80} height={80} rx={6} fill={N} />
			<text x={50} y={66} fontFamily="Jost" fontWeight={500} fontSize={44} fill={P} textAnchor="middle">
				Aa
			</text>
			<rect x={22} y={76} width={16} height={5} fill={P} />
			<rect x={42} y={76} width={16} height={5} fill={S} />
			<rect x={62} y={76} width={16} height={5} fill={R} />
		</>
	),
	key: (
		<>
			<circle cx={32} cy={50} r={20} fill={W} />
			<circle cx={32} cy={50} r={8} fill={P} />
			<rect x={50} y={46} width={40} height={8} fill={W} />
			<rect x={74} y={54} width={6} height={12} fill={W} />
			<rect x={84} y={54} width={6} height={16} fill={W} />
		</>
	),
	bulb: (
		<>
			<path d="M 50 8 a 28 28 0 0 1 16 51 V 70 H 34 V 59 A 28 28 0 0 1 50 8 Z" fill={W} />
			<rect x={34} y={74} width={32} height={6} fill={N} />
			<rect x={38} y={84} width={24} height={6} fill={N} />
			<path d="M 42 44 L 50 54 L 58 44" stroke={K.woodDeep} strokeWidth={3} fill="none" />
		</>
	),
	grid: (
		<>
			{[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={12 + c * 27} y={12 + r * 27} width={22} height={22} rx={3} fill={[N, B, R, W, S][(r * 3 + c) % 5]} />))}
		</>
	),
	network: (
		<>
			{[
				[50, 50, 50, 16],
				[50, 50, 18, 76],
				[50, 50, 82, 76],
				[50, 16, 18, 76],
				[50, 16, 82, 76],
			].map(([a, b, c, d], k) => (
				<line key={k} x1={a} y1={b} x2={c} y2={d} stroke={S} strokeWidth={4} />
			))}
			<circle cx={50} cy={50} r={13} fill={R} />
			<circle cx={50} cy={16} r={10} fill={N} />
			<circle cx={18} cy={76} r={10} fill={B} />
			<circle cx={82} cy={76} r={10} fill={N} />
		</>
	),
	rocket: (
		<>
			<path d="M 50 8 C 70 24 72 50 64 70 H 36 C 28 50 30 24 50 8 Z" fill={P} stroke={N} strokeWidth={4} />
			<circle cx={50} cy={38} r={9} fill={B} />
			<path d="M 36 56 L 20 74 L 36 70 Z" fill={R} />
			<path d="M 64 56 L 80 74 L 64 70 Z" fill={R} />
			<path d="M 42 72 L 50 94 L 58 72 Z" fill={W} />
		</>
	),
	trend: (
		<>
			<path d="M 10 80 L 36 54 L 54 66 L 88 24" stroke={B} strokeWidth={8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
			<path d="M 70 20 H 92 V 42 Z" fill={B} />
			<circle cx={36} cy={54} r={6} fill={R} />
			<circle cx={54} cy={66} r={6} fill={R} />
		</>
	),
};

export type GlyphName = keyof typeof G;

export const Glyph: React.FC<{name: string; size: number; style?: React.CSSProperties}> = ({name, size, style}) => (
	<svg viewBox="0 0 100 100" width={size} height={size} style={{overflow: 'visible', ...style}}>
		{G[name]}
	</svg>
);
