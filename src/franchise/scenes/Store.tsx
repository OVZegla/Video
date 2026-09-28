import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {COPY} from '../copy';
import {clamp01, ease, K, lerp, p, SANS} from '../theme';
import {bodyStyle, Fade, KenBurns, Kicker, Num, Paper, Rise, titleStyle, Tricolour, Window} from '../ui';

// Floor plan, in plan units (1000 × 640 shop, mall walkway below).
const OX = 110;
const OY = 170;

type Zone = {cx: number; cy: number};
const ZONES: Zone[] = [
	{cx: 160, cy: 610}, // LED windows
	{cx: 140, cy: 530}, // welcome kiosk
	{cx: 500, cy: 360}, // central island
	{cx: 20, cy: 330}, // theme walls
	{cx: 790, cy: 455}, // design counter
	{cx: 500, cy: 110}, // glazed workshop
];

const Plan: React.FC<{draw: number; zone: (k: number) => number; hi: (k: number) => number; f: number}> = ({draw, zone, hi, f}) => {
	const glow = 0.6 + 0.4 * Math.sin(f / 6);
	const z = (k: number) => clamp01(zone(k));
	const fillOp = (k: number) => z(k) * (0.55 + 0.45 * hi(k));
	const wallLen = 1000 * 2 + 640 * 2;
	return (
		<svg width={1100} height={860} viewBox="-50 -40 1100 860" style={{position: 'absolute', left: OX - 50, top: OY - 40}}>
			{/* walkway */}
			<rect x={-50} y={660} width={1100} height={160} fill={K.sand} opacity={draw} />
			<text x={500} y={790} textAnchor="middle" fontFamily={SANS} fontSize={20} letterSpacing={8} fill={K.grey} opacity={draw}>
				GALERIE COMMERCIALE
			</text>
			{/* floor */}
			<rect x={0} y={0} width={1000} height={640} fill={K.paperLight} opacity={draw} />
			{/* 6 — workshop */}
			<g opacity={z(5)}>
				<rect x={40} y={30} width={920} height={170} fill={K.sand} opacity={fillOp(5)} />
				{[0, 1, 2, 3, 4].map((k) => (
					<g key={k}>
						<rect x={90 + k * 175} y={62} width={120} height={90} rx={6} fill={K.navy} />
						<rect x={102 + k * 175} y={74} width={96} height={52} fill="#22275F" />
						<circle cx={130 + k * 175 + ((f * 3 + k * 40) % 60)} cy={100} r={5} fill={K.red} opacity={glow} />
					</g>
				))}
				<line x1={40} y1={200} x2={455} y2={200} stroke={K.sky} strokeWidth={10} />
				<line x1={545} y1={200} x2={960} y2={200} stroke={K.sky} strokeWidth={10} />
			</g>
			{/* 4 — theme walls */}
			<g opacity={z(3)}>
				<rect x={0} y={230} width={44} height={340} fill={K.wood} opacity={fillOp(3)} />
				<rect x={956} y={230} width={44} height={170} fill={K.wood} opacity={fillOp(3)} />
				{[0, 1, 2, 3, 4, 5].map((k) => (
					<line key={k} x1={6} y1={250 + k * 56} x2={38} y2={250 + k * 56} stroke={K.woodDark} strokeWidth={3} />
				))}
			</g>
			{/* 3 — central island */}
			<g opacity={z(2)}>
				<rect x={380} y={300} width={240} height={120} rx={14} fill={K.wood} opacity={fillOp(2)} />
				{[0, 1, 2, 3].map((k) => (
					<rect key={k} x={404 + k * 54} y={338} width={30} height={40} rx={4} fill={k % 2 ? K.navy : K.blue} />
				))}
			</g>
			{/* 5 — counter */}
			<g opacity={z(4)}>
				<rect x={700} y={420} width={180} height={70} rx={12} fill={K.navy} opacity={fillOp(4) + 0.3} />
				<rect x={740} y={432} width={50} height={30} fill={K.sky} />
			</g>
			{/* 2 — kiosk */}
			<g opacity={z(1)}>
				<circle cx={140} cy={530} r={40} fill={K.blue} opacity={fillOp(1)} />
				<rect x={124} y={514} width={32} height={32} rx={4} fill={K.paperLight} />
			</g>
			{/* plants */}
			{[
				[70, 250],
				[930, 600],
				[880, 250],
				[330, 580],
			].map(([x, y], k) => (
				<circle key={k} cx={x} cy={y} r={22 * draw} fill={K.sage} opacity={0.8} />
			))}
			{/* walls */}
			<path
				d="M 360 640 L 0 640 L 0 0 L 1000 0 L 1000 640 L 640 640"
				fill="none"
				stroke={K.navy}
				strokeWidth={10}
				strokeDasharray={wallLen}
				strokeDashoffset={wallLen * (1 - draw)}
			/>
			{/* 1 — LED façade */}
			<g opacity={z(0)}>
				<rect x={10} y={628} width={340} height={20} fill={K.blue} />
				<rect x={650} y={628} width={340} height={20} fill={K.blue} />
				<rect x={10} y={648} width={340} height={40} fill={K.blue} opacity={0.18 * glow} />
				<rect x={650} y={648} width={340} height={40} fill={K.blue} opacity={0.18 * glow} />
			</g>
			{/* entrance */}
			<g opacity={draw}>
				<path d="M 500 700 l 0 -44 m -14 14 l 14 -14 l 14 14" stroke={K.red} strokeWidth={4} fill="none" />
			</g>
		</svg>
	);
};

const ZoneNum: React.FC<{k: number; s: number; active: number}> = ({k, s, active}) => (
	<div style={{position: 'absolute', left: OX + ZONES[k].cx - 26, top: OY + ZONES[k].cy - 26}}>
		<Num n={k + 1} size={52} bg={active > 0.5 ? K.red : K.navy} s={s * (1 + 0.15 * active)} />
	</div>
);

/** 6 — the shop, from the 3D view down to its plan. */
export const Store: React.FC = () => {
	const f = useCurrentFrame();
	const c = COPY.store;
	const isoOut = p(f, 110, 140, ease.in);
	const zAt = (k: number) => 170 + k * 44;
	const current = Math.floor((f - zAt(0)) / 44);
	return (
		<AbsoluteFill>
			<Paper />
			<div style={{position: 'absolute', inset: 0, opacity: 1 - isoOut, transform: `scale(${1 - isoOut * 0.08})`}}>
				<Window x={420} y={140} w={1080} h={810} at={8} radius={36}>
					<KenBurns src={staticFile('franchise/vue-iso.jpg')} dur={140} from={1.0} to={1.08} />
				</Window>
				<Fade at={30} style={{position: 'absolute', left: 420, top: 972, width: 1080, textAlign: 'center'}}>
					<div style={{...bodyStyle(K.navySoft, 22), fontStyle: 'italic'}}>{c.iso}</div>
				</Fade>
			</div>
			{f > 120 && (
				<>
					<Plan draw={p(f, 124, 170, ease.inOut)} zone={(k) => p(f, zAt(k), zAt(k) + 18)} hi={(k) => (k === current ? 1 : 0)} f={f} />
					{ZONES.map((_, k) => (
						<ZoneNum key={k} k={k} s={p(f, zAt(k), zAt(k) + 16, ease.back)} active={k === current ? 1 : 0} />
					))}
					<div style={{position: 'absolute', left: 1250, top: 150, width: 600}}>
						<Fade at={130}>
							<Kicker>04 — {COPY.chapters[3]}</Kicker>
						</Fade>
						<div style={{height: 26}} />
						<Rise at={138}>
							<div style={titleStyle(K.navy, 56)}>{c.title}</div>
						</Rise>
						<div style={{height: 40}} />
						<div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
							{c.zones.map((z, k) => {
								const t = p(f, zAt(k), zAt(k) + 16);
								const on = k === current;
								return (
									<div key={z.t} style={{display: 'flex', gap: 22, alignItems: 'center', opacity: t, transform: `translateX(${(1 - t) * 30}px)`}}>
										<Num n={k + 1} size={40} bg={on ? K.red : K.navy} />
										<div>
											<div style={{fontFamily: SANS, fontSize: 30, fontWeight: 500, color: K.navy}}>{z.t}</div>
											<div style={{...bodyStyle(K.navySoft, 21), lineHeight: 1.3}}>{z.d}</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</>
			)}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// 7 — The customer journey, walked on the plan.

const PATH: [number, number][] = [
	[160, 740], // 0  attracted
	[500, 740],
	[500, 560],
	[110, 420], // 3  inspired
	[330, 470],
	[790, 540], // 5  counter
	[660, 540],
	[650, 260],
	[500, 240], // 7  workshop window
	[500, 560],
	[500, 740],
	[860, 740], // 10 leaves
];
const STOPS = [0, 3, 5, 8, 11];
const CUM = PATH.reduce<number[]>((acc, pt, i) => {
	if (i === 0) return [0];
	const [x0, y0] = PATH[i - 1];
	return [...acc, acc[i - 1] + Math.hypot(pt[0] - x0, pt[1] - y0)];
}, []);
const ARRIVE = [40, 120, 200, 280, 380]; // frames when the walker reaches each stop
const LEAVE = [70, 150, 230, 310, 999];

const distAt = (f: number) => {
	for (let s = 0; s < STOPS.length; s++) {
		if (f < ARRIVE[s]) {
			if (s === 0) return 0;
			const t = p(f, LEAVE[s - 1], ARRIVE[s], ease.inOut);
			return lerp(CUM[STOPS[s - 1]], CUM[STOPS[s]], t);
		}
		if (f < LEAVE[s]) return CUM[STOPS[s]];
	}
	return CUM[CUM.length - 1];
};

const pointAt = (d: number): [number, number] => {
	for (let i = 1; i < PATH.length; i++) {
		if (d <= CUM[i]) {
			const t = (d - CUM[i - 1]) / (CUM[i] - CUM[i - 1] || 1);
			return [lerp(PATH[i - 1][0], PATH[i][0], t), lerp(PATH[i - 1][1], PATH[i][1], t)];
		}
	}
	return PATH[PATH.length - 1];
};

export const Journey: React.FC = () => {
	const f = useCurrentFrame();
	const c = COPY.journey;
	const d = distAt(f);
	const [wx, wy] = pointAt(d);
	const trail: string = (() => {
		let s = `M ${PATH[0][0]} ${PATH[0][1]}`;
		for (let i = 1; i < PATH.length && CUM[i - 1] < d; i++) {
			const pt = CUM[i] <= d ? PATH[i] : pointAt(d);
			s += ` L ${pt[0]} ${pt[1]}`;
		}
		return s;
	})();
	const reached = ARRIVE.filter((a) => f >= a).length - 1;
	return (
		<AbsoluteFill>
			<Paper />
			<div style={{opacity: 0.55}}>
				<Plan draw={1} zone={() => 1} hi={() => 0} f={f} />
			</div>
			<svg width={1100} height={860} viewBox="-50 -40 1100 860" style={{position: 'absolute', left: OX - 50, top: OY - 40}}>
				<path d={trail} fill="none" stroke={K.red} strokeWidth={6} strokeDasharray="2 14" strokeLinecap="round" opacity={p(f, 10, 30)} />
				{STOPS.map((s, k) =>
					f >= ARRIVE[k] ? (
						<g key={k}>
							<circle cx={PATH[s][0]} cy={PATH[s][1]} r={30 * p(f, ARRIVE[k], ARRIVE[k] + 14, ease.back)} fill={K.navy} />
							<text x={PATH[s][0]} y={PATH[s][1] + 9} textAnchor="middle" fontFamily={SANS} fontSize={26} fontWeight={500} fill={K.white}>
								{k + 1}
							</text>
						</g>
					) : null,
				)}
				<circle cx={wx} cy={wy} r={34 + 6 * Math.sin(f / 4)} fill={K.red} opacity={0.18 * p(f, 10, 30)} />
				<circle cx={wx} cy={wy} r={16} fill={K.red} opacity={p(f, 10, 30)} />
			</svg>
			<div style={{position: 'absolute', left: 1250, top: 130, width: 600}}>
				<Fade at={10}>
					<Kicker>05 — {COPY.chapters[4]}</Kicker>
				</Fade>
				<div style={{height: 24}} />
				<Rise at={16}>
					<div style={titleStyle(K.navy, 60)}>{c.title}</div>
				</Rise>
				<div style={{height: 20}} />
				<Tricolour p={p(f, 24, 50)} width={160} />
				<div style={{height: 44}} />
				<div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
					{c.steps.map((s, k) => {
						const t = p(f, ARRIVE[k], ARRIVE[k] + 18);
						const on = k === reached;
						return (
							<div
								key={s.t}
								style={{
									display: 'flex',
									gap: 22,
									alignItems: 'flex-start',
									padding: '18px 24px',
									borderRadius: 20,
									background: on ? K.paperLight : 'transparent',
									boxShadow: on ? '0 14px 30px rgba(0,4,79,0.10)' : 'none',
									opacity: 0.18 + t * (on ? 0.82 : 0.5),
								}}
							>
								<Num n={k + 1} size={44} bg={on ? K.red : K.navy} />
								<div>
									<div style={{fontFamily: SANS, fontSize: 32, fontWeight: 500, color: K.navy}}>{s.t}</div>
									<div style={{...bodyStyle(K.navySoft, 22), lineHeight: 1.35}}>{s.d}</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};
