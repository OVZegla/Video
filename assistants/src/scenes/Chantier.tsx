import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_UI} from '../theme';
import {bez, E, mix, prog, tw} from '../lib/anim';
import {Icon} from '../components/Icon';
import {Headline} from '../components/Headline';
import {Button, JobTag, Kicker, Pill, RoleTag, RoleTile, Surface} from '../components/ui';
import {TerracePhoto} from '../components/Illustrations';
import {VoiceNoteWave} from '../components/VoiceWave';
import {DOC, DOCS} from '../components/Docs';
import {SCENES} from '../timeline';

// 26–40 s. One job folder feeds four prepared deliverables.

const LEAD = SCENES.chantier.lead;

// Local timeline (t = 0 at 26 s).
export const K = {
	photo: [20, 50],
	note: 50,
	words: 62,
	collapse: [104, 126],
	h1: 100,
	emerge: 116, // first deliverable
	gap: 38,
	h2: 190,
	panel: [306, 340],
	end: 420,
} as const;

// Layout
const DOS = {x: 220, y: 262, w: 500, h: 712};
const PHOTO = {x: DOS.x + 24, y: DOS.y + 142, w: 452, h: 290};
const NOTE = {x: DOS.x + 24, y: DOS.y + 452, w: 452, h: 70};
const SC = 0.94; // deliverable scale in the grid
const SLOTS = [
	{x: 800, y: 262},
	{x: 1268, y: 262},
	{x: 800, y: 636},
	{x: 1268, y: 636},
];
const HERO = {cx: 1250, cy: 600, s: 1.3};
const PANEL = {x: 390, y: 196, w: 1140, h: 708};
const ROW_H = 130;
const THUMB = 0.27;
const rowY = (i: number) => PANEL.y + 136 + i * ROW_H;

const docT = (i: number) => K.emerge + i * K.gap;

// ————————————————————————————————————————————— Folder

const Folder: React.FC<{t: number}> = ({t}) => {
	const enter = prog(t, -4, 22);
	const out = prog(t, K.panel[0] - 8, K.panel[0] + 18, E.inOut);
	const photoLanded = prog(t, K.photo[1] - 6, K.photo[1] + 2);
	const noteIn = prog(t, K.note, K.note + 14);
	const played = tw(t, K.words - 4, K.words + 40, 0, 1, E.linear);
	const transcript = prog(t, K.collapse[1] - 6, K.collapse[1] + 8);
	return (
		<Surface
			lift
			radius={28}
			style={{
				left: DOS.x - out * 80,
				top: DOS.y,
				width: DOS.w,
				height: DOS.h,
				opacity: enter * (1 - out),
				transform: `translateY(${(1 - enter) * 20}px) scale(${1 - out * 0.06})`,
			}}
		>
			<div style={{position: 'absolute', left: 24, top: 24, right: 24, display: 'flex', alignItems: 'center', gap: 14}}>
				<div
					style={{
						width: 52,
						height: 52,
						borderRadius: 16,
						background: C.blue,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Icon name="folder" size={28} color="#fff" stroke={2} />
				</div>
				<div style={{flex: 1}}>
					<div style={{fontSize: 26, fontWeight: 720, letterSpacing: '-0.02em'}}>Terrasse en bois</div>
					<div style={{fontSize: 15, color: C.ink3, marginTop: 3}}>Mme Martin · chantier terminé</div>
				</div>
				<JobTag size={15} />
			</div>
			<div
				style={{
					position: 'absolute',
					left: 24,
					top: 108,
					fontSize: 14,
					fontWeight: 600,
					color: C.ink3,
					letterSpacing: '0.06em',
					textTransform: 'uppercase',
				}}
			>
				Ajouté à l’instant
			</div>
			{/* photo slot (the photo itself flies in above) */}
			<div
				style={{
					position: 'absolute',
					left: PHOTO.x - DOS.x,
					top: PHOTO.y - DOS.y,
					width: PHOTO.w,
					height: PHOTO.h,
					borderRadius: 16,
					border: `1.5px dashed rgba(46,91,255,${0.35 * (1 - photoLanded)})`,
					background: `rgba(46,91,255,${0.04 * (1 - photoLanded)})`,
				}}
			/>
			{/* voice note */}
			<div
				style={{
					position: 'absolute',
					left: NOTE.x - DOS.x,
					top: NOTE.y - DOS.y,
					width: NOTE.w,
					height: NOTE.h,
					borderRadius: 18,
					background: 'rgba(46,91,255,0.07)',
					display: 'flex',
					alignItems: 'center',
					gap: 16,
					padding: '0 18px 0 12px',
					opacity: noteIn,
					transform: `translateY(${(1 - noteIn) * 10}px)`,
				}}
			>
				<div
					style={{
						width: 46,
						height: 46,
						borderRadius: 23,
						background: C.blue,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Icon name="mic" size={24} color="#fff" stroke={2} />
				</div>
				<VoiceNoteWave width={290} height={34} color={C.blue} dim="rgba(46,91,255,0.25)" played={played} bars={36} />
				<div style={{fontSize: 16, fontWeight: 650, color: C.blue, fontVariantNumeric: 'tabular-nums'}}>0:04</div>
			</div>
			<div
				style={{
					position: 'absolute',
					left: 24,
					right: 24,
					top: NOTE.y - DOS.y + NOTE.h + 14,
					fontSize: 17,
					color: C.ink2,
					fontWeight: 520,
					opacity: transcript,
				}}
			>
				{'« Chantier terminé. Prépare la suite. »'}
			</div>
			{/* who is working on this folder */}
			<div
				style={{
					position: 'absolute',
					left: 24,
					right: 24,
					bottom: 22,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					fontSize: 15,
					color: C.ink3,
					fontWeight: 560,
				}}
			>
				<span style={{marginRight: 4}}>Sur ce dossier</span>
				{DOCS.map((d, i) => {
					const on = prog(t, docT(i) - 2, docT(i) + 10);
					return (
						<div key={d.role} style={{opacity: 0.25 + 0.75 * on, transform: `scale(${0.9 + 0.1 * on})`}}>
							<RoleTile role={d.role} size={36} solid={on > 0.5} />
						</div>
					);
				})}
			</div>
		</Surface>
	);
};

// ————————————————————————————————————————————— Deliverables

const Deliverable: React.FC<{t: number; i: number}> = ({t, i}) => {
	const t0 = docT(i);
	const e = prog(t, t0, t0 + 24, E.out); // folder → hero
	if (e <= 0) return null;
	const s = prog(t, t0 + 36, t0 + 58, E.inOut); // hero → slot
	const p = prog(t, K.panel[0] + i * 3, K.panel[1] + i * 3, E.inOut); // slot → panel row
	const slot = SLOTS[i];
	const src = {x: DOS.x + DOS.w - 30, y: DOS.y + DOS.h - 70, s: 0.12};
	const hero = {x: HERO.cx - (DOC.w * HERO.s) / 2, y: HERO.cy - (DOC.h * HERO.s) / 2, s: HERO.s};
	const row = {x: PANEL.x + 30, y: rowY(i) + (ROW_H - DOC.h * THUMB) / 2 - 6, s: THUMB};
	let x = mix(src.x, hero.x, E.inOut(e));
	let y = mix(src.y, hero.y, e);
	let sc = mix(src.s, hero.s, e);
	x = mix(x, slot.x, s);
	y = mix(y, slot.y, s);
	sc = mix(sc, SC, s);
	x = mix(x, row.x, p);
	y = mix(y, row.y, p);
	sc = mix(sc, row.s, p);
	// the next deliverable steals the stage: settled ones step back a touch
	const next = i < 3 ? prog(t, docT(i + 1), docT(i + 1) + 16) : 0;
	const dim = s >= 1 && p === 0 ? 1 - 0.1 * next * (1 - prog(t, docT(3) + 40, docT(3) + 60)) : 1;
	const Comp = DOCS[i].C;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: DOC.w,
				height: DOC.h,
				transformOrigin: '0 0',
				transform: `scale(${sc})`,
				zIndex: s < 1 ? 10 + i : 5,
				opacity: Math.min(1, e * 3) * dim,
				borderRadius: 22,
				overflow: 'hidden',
				boxShadow: `0 0 0 ${1 / sc}px ${C.line}, 0 ${mix(30, 8, s)}px ${mix(70, 24, s)}px -${mix(24, 10, s)}px rgba(21,23,28,${mix(0.3, 0.16, s)})`,
			}}
		>
			<Comp />
		</div>
	);
};

const Links: React.FC<{t: number}> = ({t}) => {
	const out = prog(t, K.panel[0] - 10, K.panel[0] + 6);
	const p0: [number, number] = [DOS.x + DOS.w, DOS.y + DOS.h - 70];
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 1 - out}}>
			{SLOTS.map((sl, i) => {
				const d = prog(t, docT(i) + 40, docT(i) + 64, E.inOut);
				const p3: [number, number] = [sl.x, sl.y + (DOC.h * SC) / 2];
				const c1: [number, number] = [p0[0] + 80, p0[1]];
				const c2: [number, number] = [p3[0] - 80, p3[1]];
				const dot = bez(prog(t, docT(i) + 40, docT(i) + 64, E.inOut), p0, c1, c2, p3);
				return (
					<g key={i}>
						<path
							d={`M${p0[0]},${p0[1]} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p3[0]},${p3[1]}`}
							fill="none"
							stroke={C.blue}
							strokeOpacity={0.35}
							strokeWidth={2}
							pathLength={1}
							strokeDasharray={`${d} 1`}
						/>
						{d > 0 && d < 1 ? <circle cx={dot[0]} cy={dot[1]} r={5} fill={C.blue} /> : null}
					</g>
				);
			})}
			<circle cx={p0[0]} cy={p0[1]} r={6 * prog(t, docT(0) + 36, docT(0) + 44)} fill={C.blue} />
		</svg>
	);
};

// ————————————————————————————————————————————— Review panel

const Panel: React.FC<{t: number}> = ({t}) => {
	const p = prog(t, K.panel[0], K.panel[1] + 6, E.inOut);
	if (p <= 0) return null;
	const status: [string, 'neutral' | 'wait' | 'ok'][] = [
		['Classée', 'neutral'],
		['À vérifier', 'wait'],
		['Proposée', 'ok'],
		['À relire', 'wait'],
	];
	return (
		<Surface
			lift
			radius={30}
			style={{
				left: PANEL.x,
				top: PANEL.y,
				width: PANEL.w,
				height: PANEL.h,
				opacity: Math.min(1, p * 2.5),
				transform: `scale(${0.96 + 0.04 * p})`,
			}}
		>
			<div style={{position: 'absolute', left: 36, right: 36, top: 34, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
				<div>
					<JobTag size={15} />
					<div style={{fontSize: 36, fontWeight: 720, letterSpacing: '-0.025em', marginTop: 12}}>
						Quatre résultats préparés
					</div>
				</div>
				<div style={{fontSize: 17, color: C.ink3, fontWeight: 540, marginTop: 36}}>Rien ne part sans votre accord</div>
			</div>
			{DOCS.map((d, i) => {
				const r = prog(t, K.panel[0] + 16 + i * 4, K.panel[1] + 10 + i * 4);
				return (
					<div
						key={d.role}
						style={{
							position: 'absolute',
							left: 36,
							right: 36,
							top: rowY(i) - PANEL.y,
							height: ROW_H,
							borderTop: `1px solid ${C.line}`,
							display: 'flex',
							alignItems: 'center',
							paddingLeft: DOC.w * THUMB + 26,
							opacity: r,
							transform: `translateX(${(1 - r) * 14}px)`,
							fontFamily: FONT_UI,
						}}
					>
						<div style={{flex: 1}}>
							<div style={{fontSize: 23, fontWeight: 660, letterSpacing: '-0.01em'}}>{d.title}</div>
							<RoleTag role={d.role} size={15} style={{marginTop: 8}} />
						</div>
						<Pill tone={status[i][1]} size={15} style={{marginRight: 24}}>
							{status[i][0]}
						</Pill>
						<Button size={17} style={{marginRight: 12}} icon="eye">
							Voir
						</Button>
						<Button size={17} kind="primary" icon="check">
							Valider
						</Button>
					</div>
				);
			})}
		</Surface>
	);
};

// ————————————————————————————————————————————— Scene

export const Chantier: React.FC = () => {
	const f = useCurrentFrame();
	const t = f - LEAD;

	// shape transition: paper grows out of the draft's status pill
	const wipe = prog(f, 0, LEAD + 4, E.inOut);
	const origin = {x: 330, y: 822};
	const radius = wipe * 2300;

	// the spoken note, large, then folded into the folder
	const c = prog(t, K.collapse[0], K.collapse[1], E.inOut);
	const qx = mix(840, NOTE.x + 10, c);
	const qy = mix(430, NOTE.y + NOTE.h + 12, c);
	const qs = mix(1, 0.2, c);
	const headOut = K.panel[0] - 14;

	return (
		<AbsoluteFill style={{clipPath: `circle(${radius}px at ${origin.x}px ${origin.y}px)`, background: C.paper}}>
			<Kicker
				style={{
					position: 'absolute',
					left: DOS.x,
					top: 72,
					display: 'flex',
					alignItems: 'center',
					gap: 10,
					opacity: prog(t, 4, 18) * (1 - prog(t, headOut, headOut + 10)),
				}}
			>
				<Icon name="clock" size={17} color={C.ink3} /> Fin de chantier · 17:40
			</Kicker>
			<div style={{position: 'absolute', left: DOS.x, top: 116, display: 'flex', gap: 26}}>
				<Headline lines={['Une demande.']} f={t} start={K.h1} end={headOut} size={80} />
				<Headline
					lines={[{text: 'Plusieurs tâches préparées.', color: C.blue}]}
					f={t}
					start={K.h2}
					end={headOut}
					size={80}
					stagger={3}
				/>
			</div>

			<Folder t={t} />
			<Links t={t} />

			{/* the photo arrives from the handset */}
			{(() => {
				const p = prog(t, K.photo[0], K.photo[1], E.out);
				const out = prog(t, K.panel[0] - 8, K.panel[0] + 18, E.inOut);
				if (p <= 0) return null;
				const x = mix(1500, PHOTO.x, E.inOut(p)) - out * 80;
				const y = mix(760, PHOTO.y, p);
				const r = mix(7, 0, p);
				const sc = mix(1.25, 1, p);
				return (
					<div
						style={{
							position: 'absolute',
							left: x,
							top: y,
							transform: `rotate(${r}deg) scale(${sc * (1 - out * 0.06)})`,
							transformOrigin: '0 0',
							borderRadius: 16,
							boxShadow: `0 ${mix(40, 2, p)}px ${mix(80, 6, p)}px -20px rgba(21,23,28,${mix(0.4, 0.15, p)})`,
							opacity: Math.min(1, p * 4) * (1 - out),
						}}
					>
						<TerracePhoto w={PHOTO.w} h={PHOTO.h} radius={16} id="tp-main" />
						<div style={{position: 'absolute', left: 14, top: 14, opacity: prog(t, K.photo[1], K.photo[1] + 10)}}>
							<Pill tone="neutral" size={13} icon="camera" style={{background: 'rgba(255,255,255,0.9)'}}>
								Photo de réalisation
							</Pill>
						</div>
					</div>
				);
			})()}

			{/* spoken note */}
			<div
				style={{
					position: 'absolute',
					left: qx,
					top: qy,
					transformOrigin: '0 0',
					transform: `scale(${qs})`,
					opacity: 1 - prog(t, K.collapse[0] + 10, K.collapse[1]),
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26, opacity: prog(t, K.note, K.note + 10)}}>
					<Icon name="mic" size={22} color={C.blue} />
					<Kicker size={16} color={C.ink3}>
						Note vocale · 0:04
					</Kicker>
				</div>
				<Headline
					lines={['« Chantier terminé.', 'Prépare la suite. »']}
					f={t}
					start={K.words}
					stagger={7}
					size={96}
					weight={640}
				/>
			</div>

			{DOCS.map((d, i) => (
				<Deliverable key={d.role} t={t} i={i} />
			))}

			{/* deliverables (z-index ≥ 5) stay above the panel and become its thumbnails */}
			<Panel t={t} />
		</AbsoluteFill>
	);
};
