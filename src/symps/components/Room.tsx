import React, {useId} from 'react';
import {HEIGHT, WIDTH} from '../theme';
import {Mural, type MuralStyle} from './Mural';

export type RoomKind = 'hotel' | 'restaurant' | 'retail' | 'office' | 'home' | 'event';

/** Back wall in screen space: the printed surface. */
export const WALL = {x: 300, y: 150, w: 1320, h: 680};
const FL = WALL.y + WALL.h; // floor line on the back wall

/**
 * A minimal architectural space in one-point perspective, lit at night.
 * Furniture is reduced to quiet silhouettes: the wall is the subject.
 */
export const Room: React.FC<{
	kind: RoomKind;
	mural: {style: MuralStyle; palette: string[]};
	print: number;
	image?: string;
	floor?: string;
	ceiling?: string;
	side?: string;
}> = ({kind, mural, print, image, floor = '#16171A', ceiling = '#0C0C0E', side = '#1E1F23'}) => {
	const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
	const id = (n: string) => `${n}-${uid}`;
	const url = (n: string) => `url(#${id(n)})`;
	const R = WALL.x + WALL.w;

	return (
		<div style={{position: 'absolute', inset: 0}}>
			<svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
				<defs>
					<linearGradient id={id('floor')} x1="0" x2="0" y1="0" y2="1">
						<stop offset="0" stopColor={floor} />
						<stop offset="1" stopColor="#050506" />
					</linearGradient>
					<linearGradient id={id('ceil')} x1="0" x2="0" y1="1" y2="0">
						<stop offset="0" stopColor={ceiling} />
						<stop offset="1" stopColor="#000" />
					</linearGradient>
					<linearGradient id={id('sideL')} x1="1" x2="0" y1="0" y2="0">
						<stop offset="0" stopColor={side} />
						<stop offset="1" stopColor="#050506" />
					</linearGradient>
					<linearGradient id={id('sideR')} x1="0" x2="1" y1="0" y2="0">
						<stop offset="0" stopColor={side} />
						<stop offset="1" stopColor="#050506" />
					</linearGradient>
				</defs>
				<polygon points={`0,0 ${WIDTH},0 ${R},${WALL.y} ${WALL.x},${WALL.y}`} fill={url('ceil')} />
				<polygon points={`0,0 ${WALL.x},${WALL.y} ${WALL.x},${FL} 0,${HEIGHT}`} fill={url('sideL')} />
				<polygon points={`${WIDTH},0 ${R},${WALL.y} ${R},${FL} ${WIDTH},${HEIGHT}`} fill={url('sideR')} />
				<polygon points={`${WALL.x},${FL} ${R},${FL} ${WIDTH},${HEIGHT} 0,${HEIGHT}`} fill={url('floor')} />
				{/* ceiling light line */}
				<polygon points={`${WALL.x + 60},${WALL.y - 16} ${R - 60},${WALL.y - 16} ${R - 40},${WALL.y - 8} ${WALL.x + 40},${WALL.y - 8}`} fill="#FFFFFF" opacity={0.08} />
			</svg>

			{/* the wall: blank plaster underneath, print on top */}
			<div style={{position: 'absolute', left: WALL.x, top: WALL.y, width: WALL.w, height: WALL.h, background: '#E9E7E2', overflow: 'hidden'}}>
				<Mural style={mural.style} palette={mural.palette} width={WALL.w} height={WALL.h} print={print} image={image} swaths={11} />
				{/* grazing wall-washer light from the ceiling */}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background:
							'linear-gradient(180deg, rgba(255,250,240,0.10) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.18) 75%, rgba(0,0,0,0.45) 100%), linear-gradient(90deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.35) 100%)',
					}}
				/>
			</div>

			{/* floor reflection of the wall */}
			<div
				style={{
					position: 'absolute',
					left: WALL.x,
					top: FL,
					width: WALL.w,
					height: 120,
					background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0))',
				}}
			/>

			<svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
				<defs>
					<radialGradient id={id('shadow')} cx="0.5" cy="0.5" r="0.5">
						<stop offset="0" stopColor="#000" stopOpacity={0.55} />
						<stop offset="1" stopColor="#000" stopOpacity={0} />
					</radialGradient>
					<radialGradient id={id('warm')} cx="0.5" cy="0.5" r="0.5">
						<stop offset="0" stopColor="#FFD9A0" stopOpacity={0.55} />
						<stop offset="1" stopColor="#FFD9A0" stopOpacity={0} />
					</radialGradient>
					<linearGradient id={id('cone')} x1="0" x2="0" y1="0" y2="1">
						<stop offset="0" stopColor="#FFFFFF" stopOpacity={0.16} />
						<stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
					</linearGradient>
				</defs>
				<Furniture kind={kind} url={url} />
			</svg>
		</div>
	);
};

const Furniture: React.FC<{kind: RoomKind; url: (n: string) => string}> = ({kind, url}) => {
	const dark = '#0E0F11';
	const mid = '#1B1C20';
	switch (kind) {
		case 'hotel':
			return (
				<g>
					<ellipse cx={960} cy={1010} rx={520} ry={40} fill={url('shadow')} />
					{/* reception desk */}
					<rect x={560} y={820} width={800} height={190} fill={mid} />
					<rect x={540} y={806} width={840} height={18} fill="#2A2B30" />
					<rect x={540} y={806} width={840} height={2} fill="#FFFFFF" opacity={0.25} />
					<rect x={600} y={990} width={720} height={4} fill="#FFE0B0" opacity={0.35} />
					{[760, 1160].map((x) => (
						<g key={x}>
							<line x1={x} x2={x} y1={150} y2={420} stroke="#000" strokeWidth={2} />
							<ellipse cx={x} cy={450} rx={120} ry={60} fill={url('warm')} />
							<rect x={x - 46} y={420} width={92} height={30} rx={15} fill="#16171A" />
							<rect x={x - 40} y={446} width={80} height={4} rx={2} fill="#FFE4BD" opacity={0.9} />
						</g>
					))}
				</g>
			);
		case 'restaurant':
			return (
				<g>
					{[620, 960, 1300].map((x) => (
						<g key={x}>
							<line x1={x} x2={x} y1={150} y2={380} stroke="#000" strokeWidth={2} />
							<ellipse cx={x} cy={420} rx={140} ry={80} fill={url('warm')} />
							<path d={`M ${x - 50} 412 Q ${x} 350 ${x + 50} 412 Z`} fill="#121214" />
							<ellipse cx={x} cy={412} rx={50} ry={5} fill="#FFE2B8" opacity={0.95} />
						</g>
					))}
					{[700, 1220].map((x) => (
						<g key={x}>
							<ellipse cx={x} cy={1020} rx={220} ry={26} fill={url('shadow')} />
							<rect x={x - 12} y={880} width={24} height={140} fill={dark} />
							<ellipse cx={x} cy={880} rx={170} ry={22} fill={mid} />
							<ellipse cx={x} cy={876} rx={170} ry={20} fill="#26272C" />
							{[-1, 1].map((s) => (
								<g key={s}>
									<rect x={x + s * 230 - 45} y={760} width={90} height={150} rx={30} fill={dark} />
									<rect x={x + s * 230 - 50} y={890} width={100} height={30} rx={8} fill={dark} />
								</g>
							))}
						</g>
					))}
				</g>
			);
		case 'retail':
			return (
				<g>
					<ellipse cx={720} cy={1030} rx={360} ry={30} fill={url('shadow')} />
					<rect x={420} y={640} width={10} height={390} fill="#2B2C31" />
					<rect x={1010} y={640} width={10} height={390} fill="#2B2C31" />
					<rect x={420} y={640} width={600} height={8} fill="#3A3B41" />
					{[0, 1, 2, 3, 4, 5].map((i) => {
						const x = 470 + i * 88;
						const col = ['#2A2622', '#3A3530', '#1E1F24', '#4A443D', '#26282E', '#34302B'][i];
						return (
							<g key={i}>
								<path d={`M ${x + 30} 648 L ${x + 30} 660`} stroke="#555" strokeWidth={2} />
								<path d={`M ${x} 680 L ${x + 60} 680 L ${x + 70} ${880 + (i % 2) * 40} L ${x - 10} ${880 + (i % 2) * 40} Z`} fill={col} />
								<path d={`M ${x} 680 L ${x + 30} 662 L ${x + 60} 680`} fill={col} />
							</g>
						);
					})}
					<ellipse cx={1380} cy={1030} rx={200} ry={24} fill={url('shadow')} />
					<rect x={1240} y={820} width={280} height={210} fill={mid} />
					<rect x={1240} y={820} width={280} height={2} fill="#FFFFFF" opacity={0.2} />
					<path d={`M 1360 820 Q 1340 760 1370 720 L 1390 720 Q 1420 760 1400 820 Z`} fill="#CFC7BB" />
				</g>
			);
		case 'office':
			return (
				<g>
					<ellipse cx={960} cy={1030} rx={640} ry={40} fill={url('shadow')} />
					<rect x={440} y={860} width={1040} height={20} fill="#2E2F35" />
					<rect x={440} y={860} width={1040} height={2} fill="#FFFFFF" opacity={0.2} />
					{[520, 1380].map((x) => (
						<rect key={x} x={x} y={880} width={16} height={150} fill={dark} />
					))}
					{[600, 820, 1040, 1260].map((x) => (
						<g key={x}>
							<rect x={x} y={760} width={110} height={120} rx={24} fill={dark} />
						</g>
					))}
					<path d="M 900 858 L 1010 858 L 1000 800 L 910 800 Z" fill="#3A3C42" />
					<rect x={907} y={802} width={96} height={2} fill="#9FC2FF" opacity={0.5} />
					{[0, 1, 2].map((i) => (
						<rect key={i} x={560 + i * 400} y={40} width={200} height={6} fill="#FFFFFF" opacity={0.35} />
					))}
				</g>
			);
		case 'home':
			return (
				<g>
					<ellipse cx={900} cy={1040} rx={560} ry={40} fill={url('shadow')} />
					{/* sofa */}
					<rect x={420} y={800} width={900} height={120} rx={40} fill="#2C2926" />
					<rect x={400} y={870} width={940} height={130} rx={36} fill="#35312D" />
					<rect x={440} y={880} width={860} height={3} fill="#FFFFFF" opacity={0.08} />
					{/* coffee table */}
					<ellipse cx={880} cy={1050} rx={200} ry={20} fill="#1C1B1A" />
					{/* plant */}
					<rect x={1470} y={900} width={90} height={120} rx={10} fill="#2A2724" />
					{Array.from({length: 9}).map((_, i) => {
						const a = -80 + i * 20;
						return (
							<path
								key={i}
								transform={`translate(1515 905) rotate(${a})`}
								d="M 0 0 C 40 -40 40 -150 0 -200 C -40 -150 -40 -40 0 0 Z"
								fill={i % 2 ? '#1F2A20' : '#26332A'}
							/>
						);
					})}
					{/* floor lamp */}
					<line x1={300} x2={300} y1={560} y2={1030} stroke="#111" strokeWidth={4} />
					<ellipse cx={300} cy={560} rx={110} ry={70} fill={url('warm')} />
					<path d="M 250 560 L 350 560 L 330 500 L 270 500 Z" fill="#DCCFB8" opacity={0.9} />
				</g>
			);
		case 'event':
			return (
				<g>
					{[560, 960, 1360].map((x) => (
						<polygon key={x} points={`${x - 20},0 ${x + 20},0 ${x + 260},${HEIGHT} ${x - 260},${HEIGHT}`} fill={url('cone')} />
					))}
					<rect x={260} y={930} width={1400} height={150} fill="#0B0B0D" />
					<rect x={260} y={930} width={1400} height={2} fill="#FFFFFF" opacity={0.2} />
					<rect x={260} y={938} width={1400} height={3} fill="#2F7BFF" opacity={0.5} />
					{/* audience, out of focus */}
					{Array.from({length: 14}).map((_, i) => (
						<g key={i} opacity={0.95}>
							<circle cx={120 + i * 130 + (i % 2) * 30} cy={1010 + (i % 3) * 12} r={34} fill="#050506" />
							<rect x={70 + i * 130 + (i % 2) * 30} y={1040 + (i % 3) * 12} width={100} height={80} rx={40} fill="#050506" />
						</g>
					))}
				</g>
			);
	}
};
