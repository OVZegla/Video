import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_DISPLAY, FONT_UI, RoleId} from '../theme';
import {E, mix, prog, tw} from '../lib/anim';
import {Icon} from '../components/Icon';
import {Headline} from '../components/Headline';
import {Button, Pill, RoleTag, RoleTile, Surface} from '../components/ui';
import {SCENES} from '../timeline';
import {ROW_RECT} from './Brief';

// 49–56 s. Close-up on one prepared result. An explicit validation changes
// its state; the others stay pending. Then the interface steps back.

const LEAD = SCENES.decide.lead;

const DEVIS = {x: 880, y: 118, w: 880, h: 640};
const PENDING: {role: RoleId; title: string}[] = [
	{role: 'stock', title: 'Commande à préparer'},
	{role: 'com', title: 'Publication à relire'},
];
const BTN = {y: DEVIS.y + DEVIS.h - 112}; // action bar top (frame coords)
const VALIDER = {x: DEVIS.x + 40 + 208 + 18 + 104, y: BTN.y + 36}; // centre of the button

export const D = {
	tap: 56,
	h1: 18,
	h2: 80,
	simplify: [172, 198],
} as const;

const Line: React.FC<{k: string; v: string}> = ({k, v}) => (
	<div
		style={{
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			height: 58,
			borderBottom: `1px solid ${C.line}`,
			fontSize: 20,
		}}
	>
		<span style={{color: C.ink2}}>{k}</span>
		<span style={{fontWeight: 640}}>{v}</span>
	</div>
);

export const Decide: React.FC = () => {
	const f = useCurrentFrame();
	const t = f - LEAD;

	// shape transition: the highlighted brief row opens into the full result
	const w = prog(f, 0, LEAD + 4, E.inOut);
	const r0 = ROW_RECT(0);
	const clip = {
		top: mix(r0.y, 0, w),
		left: mix(r0.x, 0, w),
		right: mix(1920 - r0.x - r0.w, 0, w),
		bottom: mix(1080 - r0.y - r0.h, 0, w),
		r: mix(20, 0, w),
	};

	const pressed = Math.max(0, 1 - Math.abs(t - D.tap) / 5);
	const done = prog(t, D.tap + 2, D.tap + 16, E.out);
	const ripple = prog(t, D.tap, D.tap + 26, E.out);
	const next = prog(t, D.tap + 28, D.tap + 44);

	// simplification: everything recedes into one blue point
	const s = prog(t, D.simplify[0], D.simplify[1], E.inOut);
	const cardIn = prog(t, -10, 16, E.out);

	// pointer (a touch, not a cursor)
	const px = mix(1640, VALIDER.x, prog(t, 26, D.tap - 4, E.inOut));
	const py = mix(1120, VALIDER.y, prog(t, 26, D.tap - 4, E.inOut));
	const pOut = prog(t, D.tap + 10, D.tap + 28, E.in);
	const pO = prog(t, 26, 36) * (1 - pOut);

	return (
		<AbsoluteFill
			style={{
				background: C.paper,
				clipPath: `inset(${clip.top}px ${clip.right}px ${clip.bottom}px ${clip.left}px round ${clip.r}px)`,
			}}
		>
			<AbsoluteFill style={{opacity: 1 - s}}>
				<div style={{position: 'absolute', left: 140, top: 318}}>
					<Headline lines={['Vous décidez.']} f={t} start={D.h1} end={D.simplify[0] - 4} size={96} />
				</div>
				<div style={{position: 'absolute', left: 140, top: 440}}>
					<Headline
						lines={['Votre équipe', 'prépare la suite.']}
						f={t}
						start={D.h2}
						end={D.simplify[0] - 4}
						size={70}
						color={C.blue}
						weight={620}
					/>
				</div>
			</AbsoluteFill>

			{/* ———— the prepared result */}
			<Surface
				lift
				radius={32}
				style={{
					left: DEVIS.x,
					top: DEVIS.y,
					width: DEVIS.w,
					height: DEVIS.h,
					opacity: cardIn * (1 - s),
					transform: `translateY(${(1 - cardIn) * 30}px) scale(${1 - s * 0.1})`,
					outline: `${1 + done}px solid ${done > 0.01 ? `rgba(46,91,255,${0.5 * done})` : C.line}`,
				}}
			>
				<div style={{position: 'absolute', left: 40, right: 40, top: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
					<RoleTag role="commercial" size={18} />
					<div style={{position: 'relative', width: 200, height: 40}}>
						<div style={{position: 'absolute', right: 0, top: 0, opacity: 1 - done}}>
							<Pill tone="wait" size={18} icon="eye">
								À vérifier
							</Pill>
						</div>
						<div style={{position: 'absolute', right: 0, top: 0, opacity: done, transform: `scale(${0.8 + 0.2 * prog(t, D.tap + 2, D.tap + 16, E.back)})`}}>
							<Pill tone="blue" size={18} icon="check">
								Validé
							</Pill>
						</div>
					</div>
				</div>
				<div style={{position: 'absolute', left: 40, top: 104}}>
					<div style={{fontFamily: FONT_DISPLAY, fontSize: 50, fontWeight: 700, letterSpacing: '-0.03em'}}>Devis · Pergola en bois</div>
					<div style={{fontSize: 21, color: C.ink2, marginTop: 10}}>Pour M. Robert · préparé à partir de sa demande</div>
				</div>
				<div style={{position: 'absolute', left: 40, right: 40, top: 238}}>
					<Line k="Pergola bois, 4 × 3 m" v="1 ensemble" />
					<Line k="Pose et fixations" v="incluses" />
					<Line k="Délai proposé" v="3 semaines" />
				</div>
				{/* action bar → confirmation */}
				<div
					style={{
						position: 'absolute',
						left: 40,
						right: 40,
						top: BTN.y - DEVIS.y,
						height: 72,
						display: 'flex',
						alignItems: 'center',
						gap: 18,
					}}
				>
					<div style={{opacity: 1 - done * 0.6, width: 208}}>
						<Button size={24} icon="pencil" style={{width: '100%', boxSizing: 'border-box'}}>
							Modifier
						</Button>
					</div>
					<div style={{position: 'relative', width: 208}}>
						<div
							style={{
								position: 'absolute',
								left: '50%',
								top: '50%',
								width: 208,
								height: 62,
								borderRadius: 31,
								border: `2px solid ${C.blue}`,
								transform: `translate(-50%,-50%) scale(${1 + ripple * 0.35}, ${1 + ripple * 0.9})`,
								opacity: t >= D.tap ? (1 - ripple) * 0.7 : 0,
							}}
						/>
						<Button
							size={24}
							kind="primary"
							icon="check"
							press={pressed}
							style={{
								width: '100%',
								boxSizing: 'border-box',
								background: done > 0.5 ? '#E6ECFF' : C.blue,
								color: done > 0.5 ? C.blue : '#fff',
								boxShadow: done > 0.5 ? 'none' : undefined,
							}}
						>
							{done > 0.5 ? 'Validé' : 'Valider'}
						</Button>
					</div>
					<div style={{opacity: 1 - done * 0.6, width: 208}}>
						<Button size={24} icon="clock" style={{width: '100%', boxSizing: 'border-box'}}>
							Plus tard
						</Button>
					</div>
				</div>
				{/* what happens next */}
				<div
					style={{
						position: 'absolute',
						left: 40,
						right: 40,
						top: BTN.y - DEVIS.y - 70,
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						fontSize: 19,
						fontWeight: 560,
						color: C.ink2,
						opacity: next,
						transform: `translateY(${(1 - next) * 8}px)`,
					}}
				>
					<Icon name="check" size={20} color={C.blue} stroke={2.4} />
					<span style={{color: C.blue, fontWeight: 650}}>Validé par vous</span>
					<span style={{color: C.ink3}}>·</span>
					<RoleTile role="commercial" size={30} />
					L’assistant commercial prépare l’envoi au client
				</div>
			</Surface>

			{/* ———— the others stay pending */}
			{PENDING.map((p, i) => {
				const r = prog(t, 6 + i * 6, 26 + i * 6);
				const out = prog(t, D.simplify[0] - 10 + i * 4, D.simplify[0] + 14 + i * 4, E.inOut);
				return (
					<Surface
						key={p.role}
						radius={22}
						style={{
							left: DEVIS.x,
							top: DEVIS.y + DEVIS.h + 22 + i * 100,
							width: DEVIS.w,
							height: 84,
							opacity: r * (1 - out),
							transform: `translateY(${(1 - r) * 20 + out * 20}px)`,
						}}
					>
						<div style={{display: 'flex', alignItems: 'center', gap: 16, height: '100%', padding: '0 28px', fontFamily: FONT_UI}}>
							<RoleTile role={p.role} size={42} />
							<div style={{flex: 1, fontSize: 22, fontWeight: 640}}>{p.title}</div>
							<Pill tone="neutral" size={16} icon="clock">
								En attente
							</Pill>
						</div>
					</Surface>
				);
			})}

			{/* touch indicator */}
			<div
				style={{
					position: 'absolute',
					left: px - 30,
					top: py - 30,
					width: 60,
					height: 60,
					borderRadius: 30,
					background: 'rgba(21,23,28,0.22)',
					boxShadow: '0 0 0 3px rgba(255,255,255,0.9), 0 10px 26px -6px rgba(21,23,28,0.35)',
					opacity: pO,
					transform: `scale(${1 - pressed * 0.2})`,
				}}
			/>

			{/* the one thing that remains: a blue point, carried into the signature */}
			{(() => {
				const d = prog(t, D.simplify[0] + 4, D.simplify[1] + 6, E.inOut);
				if (d <= 0) return null;
				const x = mix(DEVIS.x + DEVIS.w - 110, 960, d);
				const y = mix(DEVIS.y + 56, 540, d);
				const size = tw(t, D.simplify[0] + 4, D.simplify[1] + 6, 44, 22, E.inOut);
				return (
					<div
						style={{
							position: 'absolute',
							left: x - size / 2,
							top: y - size / 2,
							width: size,
							height: size,
							borderRadius: size / 2,
							background: C.blue,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Icon name="check" size={size * 0.6} color="#fff" stroke={2.6} style={{opacity: 1 - d}} />
					</div>
				);
			})()}
		</AbsoluteFill>
	);
};
