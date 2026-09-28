import React, {useId} from 'react';
import {K, SANS} from './theme';

/**
 * Flat Bauhaus product illustrations, drawn in a 200 × 200 box.
 * `m` (0 → 1) reveals the personalisation, swept in by a red laser line.
 */

export const Engrave: React.FC<{m: number; x: number; y: number; w: number; h: number; children: React.ReactNode}> = ({m, x, y, w, h, children}) => {
	const id = 'e' + useId().replace(/[^a-zA-Z0-9]/g, '');
	const lx = x + w * m;
	return (
		<>
			<clipPath id={id}>
				<rect x={x - 2} y={y - 2} width={(w + 4) * m} height={h + 4} />
			</clipPath>
			<g clipPath={`url(#${id})`}>{children}</g>
			{m > 0 && m < 1 && (
				<>
					<line x1={lx} y1={y - 6} x2={lx} y2={y + h + 6} stroke={K.red} strokeWidth={2.5} />
					<circle cx={lx} cy={y + h / 2} r={5} fill={K.red} opacity={0.35} />
				</>
			)}
		</>
	);
};

type IconProps = {m: number};

const Txt: React.FC<{x: number; y: number; size: number; fill: string; children: React.ReactNode; weight?: number; ls?: number}> = ({
	x,
	y,
	size,
	fill,
	children,
	weight = 500,
	ls = 0,
}) => (
	<text x={x} y={y} fontFamily={SANS} fontSize={size} fontWeight={weight} fill={fill} textAnchor="middle" letterSpacing={ls}>
		{children}
	</text>
);

const PhoneCase: React.FC<IconProps> = ({m}) => (
	<>
		<rect x={62} y={28} width={76} height={148} rx={16} fill={K.navy} />
		<rect x={72} y={38} width={30} height={30} rx={8} fill={K.navySoft} />
		<circle cx={80} cy={46} r={4.5} fill="#000" opacity={0.6} />
		<circle cx={94} cy={60} r={4.5} fill="#000" opacity={0.6} />
		<Engrave m={m} x={74} y={86} w={52} h={70}>
			<circle cx={100} cy={112} r={20} fill={K.red} />
			<rect x={80} y={112} width={40} height={20} fill={K.blue} />
			<Txt x={100} y={152} size={13} fill={K.paper} ls={2}>
				LÉA
			</Txt>
		</Engrave>
	</>
);

const Keyring: React.FC<IconProps> = ({m}) => (
	<>
		<circle cx={100} cy={52} r={16} fill="none" stroke={K.grey} strokeWidth={5} />
		<rect x={96} y={64} width={8} height={18} fill={K.grey} />
		<circle cx={100} cy={120} r={44} fill={K.wood} />
		<circle cx={100} cy={82} r={6} fill={K.paper} />
		<Engrave m={m} x={66} y={96} w={68} h={50}>
			<Txt x={100} y={136} size={44} fill={K.woodDeep} weight={700}>
				M&amp;J
			</Txt>
		</Engrave>
	</>
);

const Mug: React.FC<IconProps> = ({m}) => (
	<>
		<path d="M 136 78 h 12 a 24 24 0 0 1 0 48 h -12" fill="none" stroke={K.paperLight} strokeWidth={12} />
		<path d="M 136 78 h 12 a 24 24 0 0 1 0 48 h -12" fill="none" stroke={K.line} strokeWidth={2} />
		<path d="M 52 58 h 88 v 96 a 14 14 0 0 1 -14 14 h -60 a 14 14 0 0 1 -14 -14 z" fill={K.paperLight} stroke={K.line} strokeWidth={2} />
		<Engrave m={m} x={60} y={76} w={72} h={76}>
			<circle cx={96} cy={104} r={22} fill={K.blue} />
			<path d="M 74 104 a 22 22 0 0 1 22 -22 v 22 z" fill={K.red} />
			<Txt x={96} y={146} size={15} fill={K.navy} ls={2}>
				MAMIE
			</Txt>
		</Engrave>
	</>
);

const Bottle: React.FC<IconProps> = ({m}) => (
	<>
		<rect x={86} y={22} width={28} height={22} rx={6} fill={K.wood} />
		<path d="M 90 44 h 20 v 10 q 24 8 24 32 v 80 a 12 12 0 0 1 -12 12 h -44 a 12 12 0 0 1 -12 -12 v -80 q 0 -24 24 -32 z" fill={K.blue} />
		<Engrave m={m} x={72} y={96} w={56} h={60}>
			<Txt x={100} y={124} size={22} fill={K.paper} weight={700}>
				TOM
			</Txt>
			<rect x={82} y={134} width={36} height={4} fill={K.paper} />
			<Txt x={100} y={152} size={11} fill={K.paper} ls={2}>
				RUN 2026
			</Txt>
		</Engrave>
	</>
);

const Notebook: React.FC<IconProps> = ({m}) => (
	<>
		<rect x={52} y={32} width={96} height={136} rx={6} fill={K.navy} />
		<rect x={52} y={32} width={10} height={136} fill={K.navySoft} />
		<rect x={132} y={32} width={6} height={136} fill={K.red} />
		<Engrave m={m} x={68} y={70} w={60} h={60}>
			<circle cx={98} cy={92} r={16} fill="none" stroke={K.wood} strokeWidth={3} />
			<Txt x={98} y={98} size={16} fill={K.wood} weight={700}>
				A
			</Txt>
			<Txt x={98} y={128} size={11} fill={K.wood} ls={2}>
				CARNET
			</Txt>
		</Engrave>
	</>
);

const Cap: React.FC<IconProps> = ({m}) => (
	<>
		<path d="M 40 128 a 60 60 0 0 1 120 0 z" fill={K.navy} />
		<path d="M 150 128 q 34 0 38 14 h -72 z" fill={K.navySoft} />
		<rect x={36} y={126} width={126} height={10} rx={5} fill={K.navySoft} />
		<circle cx={100} cy={68} r={5} fill={K.navySoft} />
		<Engrave m={m} x={68} y={86} w={64} h={36}>
			<circle cx={86} cy={106} r={12} fill={K.red} />
			<rect x={102} y={96} width={22} height={20} fill={K.paper} />
		</Engrave>
	</>
);

const Tshirt: React.FC<IconProps> = ({m}) => (
	<>
		<path d="M 72 30 q 28 18 56 0 l 44 22 l -16 34 l -18 -8 v 94 h -76 v -94 l -18 8 l -16 -34 z" fill={K.blue} />
		<path d="M 72 30 q 28 18 56 0" fill="none" stroke={K.navy} strokeWidth={5} />
		<Engrave m={m} x={70} y={74} w={60} h={70}>
			<path d="M 76 136 l 24 -56 l 24 56 z" fill={K.paper} />
			<circle cx={100} cy={120} r={9} fill={K.red} />
		</Engrave>
	</>
);

const Tote: React.FC<IconProps> = ({m}) => (
	<>
		<path d="M 76 70 v -22 a 24 24 0 0 1 48 0 v 22" fill="none" stroke={K.woodDark} strokeWidth={6} />
		<rect x={48} y={66} width={104} height={112} rx={4} fill={K.sand} />
		<Engrave m={m} x={60} y={82} w={80} h={80}>
			<path d="M 100 92 q 26 18 0 58 q -26 -40 0 -58 z" fill={K.sage} />
			<line x1={100} y1={100} x2={100} y2={152} stroke={K.navy} strokeWidth={3} />
			<Txt x={100} y={170} size={11} fill={K.navy} ls={2}>
				MARCHÉ
			</Txt>
		</Engrave>
	</>
);

const Frame: React.FC<IconProps> = ({m}) => (
	<>
		<rect x={36} y={30} width={128} height={148} fill={K.wood} />
		<rect x={48} y={42} width={104} height={124} fill={K.paperLight} />
		<Engrave m={m} x={56} y={50} w={88} h={108}>
			<rect x={56} y={50} width={88} height={108} fill={K.navy} />
			<circle cx={116} cy={96} r={20} fill={K.red} />
			<path d="M 56 158 v -34 l 30 -24 l 26 22 l 32 -18 v 54 z" fill={K.blue} />
		</Engrave>
	</>
);

const Plexi: React.FC<IconProps> = ({m}) => (
	<>
		<rect x={22} y={50} width={156} height={100} rx={4} fill={K.sky} opacity={0.35} />
		<rect x={22} y={50} width={156} height={100} rx={4} fill="none" stroke={K.sky} strokeWidth={2} />
		<path d="M 30 56 l 30 0 l -24 88 l -6 0 z" fill={K.white} opacity={0.5} />
		{[
			[34, 62],
			[166, 62],
			[34, 138],
			[166, 138],
		].map(([x, y], k) => (
			<circle key={k} cx={x} cy={y} r={6} fill={K.grey} />
		))}
		<Engrave m={m} x={46} y={72} w={108} h={60}>
			<Txt x={100} y={98} size={20} fill={K.navy} weight={700} ls={1}>
				CABINET
			</Txt>
			<Txt x={100} y={120} size={13} fill={K.navy} ls={3}>
				ARCHITECTES
			</Txt>
		</Engrave>
	</>
);

/** The engraved tree (branches + foliage), in the 200 × 200 box. */
export const TreeMark: React.FC<{color: string}> = ({color}) => (
	<>
		{['M 100 150 L 100 104', 'M 100 118 L 76 96', 'M 100 112 L 126 90', 'M 76 96 L 66 78', 'M 76 96 L 86 76', 'M 126 90 L 118 72', 'M 126 90 L 138 76', 'M 100 104 L 100 72'].map((d, k) => (
			<path key={k} d={d} stroke={color} strokeWidth={k === 0 ? 10 : 5} strokeLinecap="round" />
		))}
		{[
			[66, 72, 14],
			[86, 68, 14],
			[100, 62, 16],
			[118, 64, 14],
			[138, 72, 13],
			[80, 88, 12],
			[122, 84, 12],
		].map(([x, y, r], k) => (
			<circle key={k} cx={x} cy={y} r={r} fill={color} />
		))}
		<path d="M 86 152 q 14 -8 28 0" stroke={color} strokeWidth={5} fill="none" />
	</>
);

const Tree: React.FC<IconProps> = ({m}) => (
	<>
		<circle cx={100} cy={100} r={78} fill={K.wood} />
		<circle cx={100} cy={100} r={78} fill="none" stroke={K.woodDark} strokeWidth={3} />
		<Engrave m={m} x={40} y={40} w={120} h={124}>
			<TreeMark color={K.woodDeep} />
		</Engrave>
	</>
);

const Sign: React.FC<IconProps> = ({m}) => (
	<>
		<rect x={20} y={20} width={14} height={160} fill={K.line} />
		<rect x={34} y={56} width={60} height={8} fill={K.navy} />
		<line x1={52} y1={64} x2={52} y2={76} stroke={K.navy} strokeWidth={3} />
		<line x1={84} y1={64} x2={84} y2={76} stroke={K.navy} strokeWidth={3} />
		<circle cx={120} cy={120} r={52} fill={K.navy} />
		<circle cx={120} cy={120} r={52} fill="none" stroke={K.red} strokeWidth={4} />
		<line x1={68} y1={76} x2={96} y2={76} stroke={K.navy} strokeWidth={3} />
		<Engrave m={m} x={80} y={86} w={80} h={70}>
			<path d="M 102 104 h 34 v 22 a 14 14 0 0 1 -14 14 h -6 a 14 14 0 0 1 -14 -14 z" fill={K.paper} />
			<path d="M 136 110 a 8 8 0 0 1 0 14" fill="none" stroke={K.paper} strokeWidth={4} />
			<Txt x={120} y={156} size={12} fill={K.paper} ls={3}>
				CAFÉ
			</Txt>
		</Engrave>
	</>
);

const Wall: React.FC<IconProps> = ({m}) => (
	<>
		<rect x={10} y={20} width={180} height={160} fill={K.paperLight} />
		<rect x={10} y={172} width={180} height={8} fill={K.line} />
		<Engrave m={m} x={14} y={24} w={172} h={146}>
			<path d="M 20 110 q 0 -60 50 -64 q 40 -2 40 30 q 0 30 -40 34 q -20 2 -24 30 q -8 20 -26 10 z" fill={K.navy} />
			<circle cx={56} cy={82} r={18} fill={K.wood} />
			<rect x={100} y={48} width={30} height={70} rx={15} fill={K.wood} />
			{[0, 1, 2, 3].map((k) => (
				<rect key={k} x={104 + k * 6.5} y={52} width={3} height={62} fill={K.woodDark} />
			))}
			<path d="M 136 60 q 40 -10 44 28 q 4 40 -34 44 q -24 2 -18 -30 z" fill={K.blue} />
			<rect x={142} y={130} width={28} height={26} fill={K.red} />
			<Txt x={80} y={150} size={11} fill={K.navy} ls={3}>
				DEMAIN
			</Txt>
		</Engrave>
	</>
);

const Room: React.FC<IconProps> = ({m}) => (
	<>
		<rect x={10} y={16} width={180} height={128} fill={K.paperLight} />
		<rect x={10} y={144} width={180} height={40} fill={K.sand} />
		<Engrave m={m} x={12} y={18} w={176} h={164}>
			<path d="M 10 16 h 70 q 10 40 -20 60 q -30 20 -50 10 z" fill={K.navy} />
			<rect x={96} y={36} width={40} height={50} fill={K.wood} />
			<rect x={102} y={42} width={28} height={38} fill={K.blue} />
			<circle cx={116} cy={56} r={7} fill={K.red} />
			<rect x={146} y={70} width={36} height={6} fill={K.woodDark} />
			<rect x={154} y={56} width={10} height={14} fill={K.red} />
			<path d="M 30 144 v -34 h 60 v 34" fill={K.blue} />
			<rect x={26} y={104} width={68} height={10} rx={5} fill={K.navySoft} />
			<rect x={150} y={118} width={20} height={26} fill={K.paper} stroke={K.line} />
			<path d="M 160 118 q -14 -26 0 -34 q 14 8 0 34" fill={K.sage} />
			<line x1={60} y1={16} x2={60} y2={52} stroke={K.navy} strokeWidth={2} />
			<path d="M 50 52 h 20 l -4 12 h -12 z" fill={K.navy} />
		</Engrave>
	</>
);

export const PRODUCTS = [PhoneCase, Keyring, Mug, Bottle, Notebook, Cap, Tshirt, Tote, Frame, Plexi, Tree, Sign, Wall, Room];

export const Product: React.FC<{i: number; m: number; size: number; style?: React.CSSProperties}> = ({i, m, size, style}) => {
	const C = PRODUCTS[i];
	return (
		<svg viewBox="0 0 200 200" width={size} height={size} style={{overflow: 'visible', ...style}}>
			<C m={m} />
		</svg>
	);
};

// Small line icons for lists.
export const MiniIcon: React.FC<{kind: 'laser' | 'uv' | 'textile' | 'finish'; size?: number; color?: string}> = ({kind, size = 40, color = K.navy}) => (
	<svg viewBox="0 0 40 40" width={size} height={size}>
		{kind === 'laser' && (
			<>
				<rect x={10} y={4} width={20} height={12} fill={color} />
				<line x1={20} y1={16} x2={20} y2={30} stroke={K.red} strokeWidth={3} />
				<rect x={4} y={32} width={32} height={4} fill={color} />
			</>
		)}
		{kind === 'uv' && (
			<>
				<rect x={4} y={10} width={32} height={20} rx={3} fill={color} />
				<rect x={10} y={16} width={6} height={8} fill={K.red} />
				<rect x={17} y={16} width={6} height={8} fill={K.blue} />
				<rect x={24} y={16} width={6} height={8} fill={K.paper} />
			</>
		)}
		{kind === 'textile' && <path d="M 13 6 q 7 5 14 0 l 10 6 l -4 8 l -4 -2 v 18 h -16 v -18 l -4 2 l -4 -8 z" fill={color} />}
		{kind === 'finish' && (
			<>
				<circle cx={20} cy={20} r={14} fill="none" stroke={color} strokeWidth={4} />
				<path d="M 20 6 a 14 14 0 0 1 14 14 h -14 z" fill={K.red} />
			</>
		)}
	</svg>
);
