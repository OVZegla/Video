import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_UI, ROLES, RoleId, ROLE_ORDER} from '../theme';
import {bez, E, keys, mix, mixColor, prog, tw} from '../lib/anim';
import {Icon} from '../components/Icon';
import {Headline} from '../components/Headline';
import {Pill, RoleTile, Surface} from '../components/ui';
import {TerracePhoto} from '../components/Illustrations';
import type {IconName} from '../theme';

// 00–14 s. Everything rests on one person (overload), then the pile
// reorganises into six assistants around one shared folder.

// ————————————————————————————————————————————— Layout

const CX = 960;
const CY = 612;
const SLOT_W = 372;
const SLOT_H = 132;
const DOSSIER = {w: 292, h: 244};

const SLOTS: Record<RoleId, {x: number; y: number; side: -1 | 1}> = {
	secretaire: {x: 480, y: 432, side: -1},
	commercial: {x: 404, y: 612, side: -1},
	stock: {x: 480, y: 792, side: -1},
	web: {x: 1440, y: 432, side: 1},
	com: {x: 1516, y: 612, side: 1},
	compta: {x: 1440, y: 792, side: 1},
};

const TASKS: Record<RoleId, string> = {
	secretaire: 'Classe la note de chantier',
	commercial: 'Prépare le devis terrasse',
	stock: 'Surveille les t-shirts bleus',
	web: 'Met à jour les horaires',
	com: 'Prépare une publication',
	compta: 'Prépare la facture de solde',
};

// ————————————————————————————————————————————— Overload items

type Item = {
	id: string;
	role: RoleId;
	primary?: boolean; // morphs into the role card; others are absorbed
	x: number;
	y: number;
	w: number;
	h: number;
	rot: number;
	at: number; // entry frame
	from: [number, number]; // entry offset
	body: React.ReactNode;
};

const Line: React.FC<{icon: IconName; color: string; kicker: string; time?: string}> = ({icon, color, kicker, time}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
		<div
			style={{
				width: 30,
				height: 30,
				borderRadius: 9,
				background: `${color}1A`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Icon name={icon} size={18} color={color} stroke={2} />
		</div>
		<div style={{fontSize: 15, fontWeight: 620, color: C.ink2, flex: 1}}>{kicker}</div>
		{time ? <div style={{fontSize: 14, color: C.ink3, fontVariantNumeric: 'tabular-nums'}}>{time}</div> : null}
	</div>
);

const T: React.FC<{children: React.ReactNode; size?: number; weight?: number; color?: string}> = ({
	children,
	size = 19,
	weight = 520,
	color = C.ink,
}) => <div style={{fontSize: size, fontWeight: weight, lineHeight: 1.3, color, letterSpacing: '-0.005em'}}>{children}</div>;

const ITEMS: Item[] = [
	{
		id: 'demande',
		role: 'commercial',
		primary: true,
		x: 330,
		y: 212,
		w: 430,
		h: 140,
		rot: -2.4,
		at: 16,
		from: [-70, -40],
		body: (
			<>
				<Line icon="message" color={ROLES.commercial.color} kicker="Demande client" time="08:12" />
				<T>« Bonjour, pouvez-vous me faire un devis pour une terrasse ? »</T>
			</>
		),
	},
	{
		id: 'chantier',
		role: 'secretaire',
		primary: true,
		x: 1580,
		y: 226,
		w: 440,
		h: 140,
		rot: 2,
		at: 38,
		from: [80, -40],
		body: (
			<div style={{display: 'flex', gap: 16}}>
				<TerracePhoto w={92} h={92} radius={12} id="tp-note" />
				<div style={{flex: 1}}>
					<Line icon="pencil" color={ROLES.secretaire.color} kicker="Note de chantier" />
					<T size={18}>Rue des Tilleuls : finir les joints, envoyer les photos.</T>
				</div>
			</div>
		),
	},
	{
		id: 'stock',
		role: 'stock',
		primary: true,
		x: 958,
		y: 150,
		w: 360,
		h: 128,
		rot: -1.2,
		at: 56,
		from: [0, -70],
		body: (
			<>
				<Line icon="bell" color={C.amber} kicker="Alerte de stock" time="09:03" />
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
					<T weight={620}>T-shirt bleu · Taille M</T>
					<Pill tone="wait" size={14}>
						3 disponibles
					</Pill>
				</div>
			</>
		),
	},
	{
		id: 'devis',
		role: 'commercial',
		x: 372,
		y: 872,
		w: 370,
		h: 128,
		rot: 2.2,
		at: 96,
		from: [-70, 50],
		body: (
			<>
				<Line icon="doc" color={ROLES.commercial.color} kicker="Devis à préparer" />
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
					<T weight={620}>Terrasse bois · Mme Martin</T>
				</div>
			</>
		),
	},
	{
		id: 'sms',
		role: 'stock',
		x: 1548,
		y: 878,
		w: 370,
		h: 128,
		rot: -2,
		at: 105,
		from: [70, 50],
		body: (
			<>
				<Line icon="message" color={ROLES.stock.color} kicker="Fournisseur" time="10:26" />
				<T>« Livraison décalée à jeudi. »</T>
			</>
		),
	},
	{
		id: 'rdv',
		role: 'secretaire',
		x: 238,
		y: 548,
		w: 330,
		h: 128,
		rot: -3,
		at: 113,
		from: [-80, 0],
		body: (
			<>
				<Line icon="calendar" color={ROLES.secretaire.color} kicker="Rappel" time="14:30" />
				<T weight={600}>Rendez-vous comptable</T>
			</>
		),
	},
	{
		id: 'site',
		role: 'web',
		primary: true,
		x: 1690,
		y: 560,
		w: 340,
		h: 128,
		rot: 2.6,
		at: 120,
		from: [80, 0],
		body: (
			<>
				<Line icon="browser" color={ROLES.web.color} kicker="Site internet" />
				<T weight={600}>Horaires d’automne à changer</T>
			</>
		),
	},
	{
		id: 'post',
		role: 'com',
		primary: true,
		x: 952,
		y: 950,
		w: 350,
		h: 128,
		rot: 1.2,
		at: 126,
		from: [0, 70],
		body: (
			<>
				<Line icon="megaphone" color={ROLES.com.color} kicker="Réseaux sociaux" />
				<T weight={600}>Publier les réalisations ?</T>
			</>
		),
	},
	{
		id: 'prio',
		role: 'compta',
		primary: true,
		x: 1262,
		y: 968,
		w: 356,
		h: 118,
		rot: -3.2,
		at: 131,
		from: [30, 70],
		body: (
			<>
				<Line icon="receipt" color={ROLES.compta.color} kicker="Paiement en retard" />
				<T weight={600}>Facture de M. Leroy à relancer</T>
			</>
		),
	},
	{
		id: 'appels',
		role: 'secretaire',
		x: 610,
		y: 350,
		w: 250,
		h: 64,
		rot: -1.5,
		at: 136,
		from: [-30, -30],
		body: (
			<div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: -4}}>
				<Icon name="bell" size={20} color={C.amber} stroke={2} />
				<T size={17} weight={620}>2 appels manqués</T>
			</div>
		),
	},
	{
		id: 'avis',
		role: 'com',
		x: 1330,
		y: 744,
		w: 270,
		h: 64,
		rot: 1.8,
		at: 140,
		from: [30, 30],
		body: (
			<div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: -4}}>
				<Icon name="message" size={20} color={ROLES.com.color} stroke={2} />
				<T size={17} weight={620}>Un avis client à lire</T>
			</div>
		),
	},
];

// Every role has exactly one primary card; the unpaid-invoice note becomes
// the accounting assistant.

// ————————————————————————————————————————————— Timing

const FREEZE = 150; // motion stops
const RELEASE = 166; // space opens in the centre
const GATHER = 206; // items fly to the six assistants
const TRANS = 396; // stock card → phone

// ————————————————————————————————————————————— Pieces

const Dossier: React.FC<{f: number}> = ({f}) => {
	const p = prog(f, 196, 232, E.out);
	const w = mix(18, DOSSIER.w, p);
	const h = mix(18, DOSSIER.h, p);
	const out = prog(f, TRANS - 4, TRANS + 14, E.inOut);
	const rows: [IconName, string][] = [
		['message', 'Demandes clients'],
		['pin', 'Chantiers'],
		['box', 'Stock'],
		['image', 'Photos et visuels'],
	];
	const pulse = f > 250 ? 0.5 + 0.5 * Math.sin((f - 250) * 0.12) : 0;
	return (
		<>
			{/* soft blue halo = shared workspace */}
			<div
				style={{
					position: 'absolute',
					left: CX - 360,
					top: CY - 300,
					width: 720,
					height: 600,
					borderRadius: '50%',
					background: 'radial-gradient(closest-side, rgba(46,91,255,0.10), rgba(46,91,255,0))',
					opacity: prog(f, 210, 260) * (1 - out) * (0.85 + 0.15 * pulse),
				}}
			/>
			<Surface
				lift
				radius={mix(9, 26, p)}
				style={{
					left: CX - w / 2,
					top: CY - h / 2,
					width: w,
					height: h,
					background: p < 0.3 ? mixColor(C.blue, '#FFFFFF', p / 0.3) : '#fff',
					opacity: prog(f, 190, 198) * (1 - out),
					transform: `scale(${1 - out * 0.2})`,
				}}
			>
				<div style={{padding: 24, opacity: prog(f, 214, 236)}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
						<div
							style={{
								width: 50,
								height: 50,
								borderRadius: 15,
								background: C.blue,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Icon name="folder" size={28} color="#fff" stroke={2} />
						</div>
						<div>
							<div style={{fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em'}}>Dossier commun</div>
							<div style={{fontSize: 14, color: C.ink3, marginTop: 2}}>Partagé par l’équipe</div>
						</div>
					</div>
					<div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 9}}>
						{rows.map(([ic, label], i) => (
							<div
								key={label}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 10,
									fontSize: 15,
									fontWeight: 540,
									color: C.ink2,
									opacity: prog(f, 226 + i * 5, 242 + i * 5),
									transform: `translateY(${tw(f, 226 + i * 5, 242 + i * 5, 8, 0)}px)`,
								}}
							>
								<Icon name={ic} size={17} color={C.blue} stroke={2} />
								{label}
							</div>
						))}
					</div>
				</div>
			</Surface>
		</>
	);
};

const RoleFace: React.FC<{role: RoleId; f: number; start: number}> = ({role, f, start}) => {
	const r = ROLES[role];
	const i = ROLE_ORDER.indexOf(role);
	const taskIn = prog(f, 268 + i * 6, 290 + i * 6);
	const work = (f - 280 - i * 11) / 70;
	const bar = work <= 0 ? 0 : 0.12 + 0.88 * (1 - Math.exp(-work * 1.6));
	return (
		<div style={{position: 'absolute', inset: 0, padding: '22px 24px', opacity: prog(f, start, start + 14)}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
				<RoleTile role={role} size={48} />
				<div style={{fontFamily: FONT_UI, fontSize: 25, fontWeight: 680, letterSpacing: '-0.015em'}}>{r.label}</div>
			</div>
			<div
				style={{
					marginTop: 14,
					fontSize: 16.5,
					fontWeight: 520,
					color: C.ink2,
					display: 'flex',
					alignItems: 'center',
					gap: 8,
					opacity: taskIn,
					transform: `translateY(${(1 - taskIn) * 8}px)`,
					whiteSpace: 'nowrap',
				}}
			>
				<div
					style={{
						width: 7,
						height: 7,
						borderRadius: 4,
						background: r.color,
						opacity: 0.55 + 0.45 * Math.sin(f * 0.2 + i),
					}}
				/>
				{TASKS[role]}
			</div>
			<div style={{position: 'absolute', left: 24, right: 24, bottom: 16, height: 3, borderRadius: 2, background: C.line}}>
				<div style={{width: `${bar * 100}%`, height: '100%', borderRadius: 2, background: r.color}} />
			</div>
		</div>
	);
};

// Connection geometry between a role card and the shared folder.
const link = (role: RoleId, k = 0): [[number, number], [number, number], [number, number], [number, number]] => {
	const s = SLOTS[role];
	const p0: [number, number] = [s.x - s.side * (SLOT_W / 2), s.y];
	const p3: [number, number] = [CX + s.side * (DOSSIER.w / 2), CY + (s.y - CY) * 0.28 + k];
	const dx = (p3[0] - p0[0]) * 0.55;
	return [p0, [p0[0] + dx, p0[1]], [p3[0] - dx, p3[1]], p3];
};

// Work travelling between assistants through the shared folder.
const PACKETS: {from: RoleId; to: RoleId; label: string; icon: IconName; at: number}[] = [
	{from: 'secretaire', to: 'com', label: 'Photos du chantier', icon: 'image', at: 282},
	{from: 'stock', to: 'commercial', label: 'Disponibilités', icon: 'box', at: 300},
	{from: 'commercial', to: 'compta', label: 'Devis accepté', icon: 'doc', at: 318},
	{from: 'com', to: 'web', label: 'Visuel prêt', icon: 'image', at: 338},
	{from: 'secretaire', to: 'compta', label: 'Facture reçue', icon: 'receipt', at: 354},
];

const Packet: React.FC<{f: number; p: (typeof PACKETS)[number]}> = ({f, p}) => {
	const dur = 40;
	const t = (f - p.at) / dur;
	if (t < 0 || t > 1) return null;
	// leg 1: from → folder, leg 2: folder → to (reversed link)
	const e = E.inOutSoft(t);
	let pt: [number, number];
	if (e < 0.5) {
		const L = link(p.from);
		pt = bez(e * 2, ...L);
	} else {
		const L = link(p.to);
		pt = bez(1 - (e - 0.5) * 2, ...L);
	}
	const vis = Math.min(1, t * 8, (1 - t) * 8);
	return (
		<div
			style={{
				position: 'absolute',
				zIndex: 10,
				left: pt[0],
				top: pt[1],
				transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * vis})`,
				opacity: vis,
				display: 'flex',
				alignItems: 'center',
				gap: 8,
				height: 34,
				padding: '0 13px 0 9px',
				borderRadius: 17,
				background: '#fff',
				boxShadow: `0 0 0 1px ${C.line}, 0 8px 20px -8px rgba(21,23,28,0.3)`,
				fontFamily: FONT_UI,
				fontSize: 14.5,
				fontWeight: 620,
				color: C.ink,
				whiteSpace: 'nowrap',
			}}
		>
			<Icon name={p.icon} size={17} color={ROLES[p.from].color} stroke={2.1} />
			{p.label}
		</div>
	);
};

// ————————————————————————————————————————————— Scene

export const Team: React.FC = () => {
	const f = useCurrentFrame();

	// Camera: a slow squeeze during the overload, release, then a gentle push.
	const cam =
		f < RELEASE
			? keys(f, [
					[0, 1],
					[FREEZE, 1.055],
				], E.inOutSoft)
			: keys(f, [
					[RELEASE, 1.055],
					[GATHER + 30, 1],
					[TRANS - 6, 1.025],
				], E.inOut);

	const toDark = prog(f, TRANS, 420, E.inOut);
	const bg = mixColor(C.paper, C.night, toDark);

	return (
		<AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${cam})`}}>
				{/* ———— connections */}
				<svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
					{ROLE_ORDER.map((role, i) => {
						const d = link(role);
						const path = `M${d[0][0]},${d[0][1]} C${d[1][0]},${d[1][1]} ${d[2][0]},${d[2][1]} ${d[3][0]},${d[3][1]}`;
						const draw = prog(f, 250 + i * 5, 286 + i * 5, E.inOut);
						const out = prog(f, TRANS - 8, TRANS + 6, E.in);
						return (
							<g key={role} opacity={1 - out}>
								<path
									d={path}
									fill="none"
									stroke={ROLES[role].color}
									strokeOpacity={0.45}
									strokeWidth={2}
									pathLength={1}
									strokeDasharray={`${draw} 1`}
								/>
								<circle cx={d[3][0]} cy={d[3][1]} r={4.5 * draw} fill={ROLES[role].color} />
							</g>
						);
					})}
				</svg>

				<Dossier f={f} />

				{/* ———— items → assistants */}
				{ITEMS.map((it, idx) => {
					const enter = prog(f, it.at, it.at + 20, E.out);
					if (enter <= 0) return null;
					// crowding drift towards the centre while it piles up
					const crowd = prog(f, it.at, FREEZE, E.inOutSoft) * 0.035;
					// release: pushed outwards, leaving a void in the centre
					const rel = prog(f, RELEASE + (idx % 4) * 2, RELEASE + 30, E.out);
					const vx = it.x - CX;
					const vy = it.y - CY + 70;
					const len = Math.hypot(vx, vy) || 1;
					const push = rel * 70;
					let x = it.x - vx * crowd + (vx / len) * push + it.from[0] * (1 - enter);
					let y = it.y - vy * crowd + (vy / len) * push + it.from[1] * (1 - enter);
					let w = it.w;
					let h = it.h;
					let rot = it.rot * (1 - rel * 0.4);
					let scale = (0.94 + 0.06 * enter) * (1 - rel * 0.06);
					let opacity = enter;
					let bodyOpacity = 1;
					let radius = 18;

					const s = SLOTS[it.role];
					const g0 = GATHER + (idx % 6) * 4 + (it.primary ? 0 : 8);
					const g = prog(f, g0, g0 + 34, E.inOut);
					if (g > 0) {
						const gx = E.inOut(g);
						const gy = E.out(g);
						x = mix(x, s.x, gx);
						y = mix(y, s.y, gy);
						rot = mix(rot, 0, g);
						if (it.primary) {
							w = mix(w, SLOT_W, g);
							h = mix(h, SLOT_H, g);
							radius = mix(18, 22, g);
							scale = mix(scale, 1, g);
							bodyOpacity = 1 - prog(f, g0, g0 + 14, E.linear);
						} else {
							scale *= mix(1, 0.5, g);
							opacity *= 1 - prog(f, g0 + 16, g0 + 34, E.linear);
						}
					}

					// transition: the stock card becomes the phone screen
					let zIndex = it.primary ? 2 : 1;
					if (it.primary && f >= TRANS - 10) {
						const tt = prog(f, TRANS, 420, E.inOut);
						if (it.role === 'stock') {
							zIndex = 5;
							x = mix(x, CX, tt);
							y = mix(y, 540, tt);
							w = mix(w, 432, tt);
							h = mix(h, 900, tt);
							radius = mix(radius, 52, tt);
						} else {
							const o = prog(f, TRANS - 10, TRANS + 8, E.in);
							opacity *= 1 - o;
							scale *= 1 - o * 0.08;
						}
					}

					const rs = f >= TRANS - 10 && it.role === 'stock' ? prog(f, TRANS - 10, TRANS + 4) : 0;
					return (
						<Surface
							key={it.id}
							radius={radius}
							lift={g < 0.5}
							style={{
								left: x - w / 2,
								top: y - h / 2,
								width: w,
								height: h,
								opacity,
								zIndex,
								transform: `rotate(${rot}deg) scale(${scale})`,
							}}
						>
							<div style={{padding: '18px 20px', opacity: bodyOpacity, width: it.w, boxSizing: 'border-box'}}>
								{it.body}
							</div>
							{it.primary && g > 0 ? <RoleFace role={it.role} f={f} start={g0 + 10} /> : null}
							{rs > 0 ? <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: rs}} /> : null}
						</Surface>
					);
				})}

				{ROLE_ORDER.map((role) =>
					PACKETS.filter((p) => p.from === role).map((p) => <Packet key={p.label} f={f} p={p} />),
				)}
			</AbsoluteFill>

			{/* ———— typography (outside the camera: stays razor sharp) */}
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div style={{position: 'absolute', top: 440}}>
					<Headline lines={['Vous connaissez', 'votre métier.']} f={f} start={8} end={80} size={100} align="center" />
				</div>
				<div style={{position: 'absolute', top: 440}}>
					<Headline
						lines={['Mais il faut aussi', 'gérer tout le reste.']}
						f={f}
						start={90}
						end={RELEASE}
						size={100}
						align="center"
					/>
				</div>
			</AbsoluteFill>
			<div style={{position: 'absolute', top: 128, left: 0, right: 0}}>
				<Headline
					lines={['Et si vous aviez une équipe à vos côtés ?']}
					f={f}
					start={238}
					end={TRANS - 18}
					size={74}
					align="center"
					stagger={2.5}
				/>
			</div>
		</AbsoluteFill>
	);
};
