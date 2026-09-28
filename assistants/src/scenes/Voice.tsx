import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_DISPLAY, FONT_UI, ROLES} from '../theme';
import {E, keys, mix, prog} from '../lib/anim';
import {Icon} from '../components/Icon';
import {Headline} from '../components/Headline';
import {Kicker, Pill, RoleTag, Surface} from '../components/ui';
import {Phone, PHONE, StatusBar, TeamHeader} from '../components/Phone';
import {VoiceWave} from '../components/VoiceWave';
import {TShirt} from '../components/Illustrations';

// 14–26 s. A spoken question, a concrete answer, a draft — never a purchase.

export const V = {
	move: [0, 30],
	rec1: 22,
	words1: 30,
	sent1: 96,
	reply1: 116,
	deploy: [124, 158],
	rec2: 204,
	words2: 212,
	sent2: 250,
	reply2: 268,
	morph: [270, 300],
	status: 300,
} as const;

const PX = 1340; // phone centre once settled
const PY = 540;
const SCREEN_L = PX - PHONE.w / 2;
const SCREEN_T = PY - PHONE.h / 2;

// Chat layout inside the screen (screen coordinates).
const CHAT_T = 164;
const MINI = {x: 22, y: 330, w: 318, h: 92}; // product mini-card in reply 1
const SHEET = {x: 150, y: 318, w: 780, h: 560}; // deployed card (frame coordinates)

const Q1 = ['« Il me reste combien', 'de t-shirts bleus', 'en taille M ? »'];
const Q1_WORDS = 10;
const Q2 = ['« Prépare de quoi en recommander. »'];
const Q2_WORDS = 5;
const STAG = 6;

const Bubble: React.FC<{text: string; f: number; start: number; sent: number; words: number; top: number}> = ({
	text,
	f,
	start,
	sent,
	words,
	top,
}) => {
	const appear = prog(f, start - 6, start + 8);
	const shown = Math.max(0, Math.min(words, Math.floor((f - start) / STAG) + 1));
	const tokens = text.split(' ');
	const solid = prog(f, sent, sent + 8);
	return (
		<div
			style={{
				position: 'absolute',
				top,
				right: 20,
				maxWidth: 300,
				padding: '13px 17px',
				borderRadius: '22px 22px 6px 22px',
				background: C.blue,
				color: '#fff',
				fontSize: 17.5,
				lineHeight: 1.35,
				fontWeight: 520,
				opacity: appear * (0.55 + 0.45 * solid),
				transform: `translateY(${(1 - appear) * 10}px)`,
			}}
		>
			{tokens.map((t, i) => (
				<span key={i} style={{opacity: i < shown ? 1 : 0}}>
					{t}
					{i < tokens.length - 1 ? ' ' : ''}
				</span>
			))}
		</div>
	);
};

const Typing: React.FC<{f: number; from: number; to: number; top: number}> = ({f, from, to, top}) => {
	const o = prog(f, from, from + 6) * (1 - prog(f, to - 4, to));
	if (o <= 0) return null;
	return (
		<div style={{position: 'absolute', top, left: 22, opacity: o, display: 'flex', alignItems: 'center', gap: 10}}>
			<RoleTag role="stock" size={14} />
			<div style={{display: 'flex', gap: 5}}>
				{[0, 1, 2].map((i) => (
					<div
						key={i}
						style={{
							width: 7,
							height: 7,
							borderRadius: 4,
							background: C.ink3,
							opacity: 0.35 + 0.65 * Math.max(0, Math.sin(f * 0.35 - i * 0.9)),
						}}
					/>
				))}
			</div>
		</div>
	);
};

const ChatScreen: React.FC<{f: number}> = ({f}) => {
	const ui = prog(f, 6, 24);
	const recording = (from: number, to: number) => prog(f, from, from + 6) * (1 - prog(f, to - 6, to));
	const rec = Math.max(recording(V.rec1, V.sent1), recording(V.rec2, V.sent2));
	const r1 = prog(f, V.reply1, V.reply1 + 14);
	const r2 = prog(f, V.reply2, V.reply2 + 14);
	const press = (at: number) => Math.max(0, 1 - Math.abs(f - at - 3) / 4);
	const micPress = Math.max(press(V.rec1), press(V.rec2));
	// the conversation slides up as the second exchange arrives
	const scroll = 0;
	return (
		<>
			<StatusBar opacity={ui} />
			<TeamHeader
				opacity={ui}
				subtitle={
					f < V.reply1 - 2 ? (
						'Six assistants · un dossier commun'
					) : (
						<span style={{color: ROLES.stock.color, fontWeight: 620}}>Stock et achats répond</span>
					)
				}
			/>
			<div style={{position: 'absolute', top: CHAT_T, left: 0, right: 0, bottom: 112, overflow: 'hidden'}}>
				<div style={{position: 'absolute', inset: 0, transform: `translateY(${scroll}px)`}}>
					<div
						style={{
							position: 'absolute',
							top: 4,
							left: 0,
							right: 0,
							textAlign: 'center',
							fontSize: 13,
							color: C.ink3,
							fontWeight: 560,
							opacity: ui,
						}}
					>
						Aujourd’hui
					</div>
					<Bubble text={'Il me reste combien de t-shirts bleus en taille M\u00A0?'} f={f} start={V.words1} sent={V.sent1} words={Q1_WORDS} top={36} />
					<Typing f={f} from={V.sent1 + 4} to={V.reply1} top={150} />
					{/* reply 1 */}
					<div style={{position: 'absolute', top: 146, left: 22, right: 22, opacity: r1, transform: `translateY(${(1 - r1) * 12}px)`}}>
						<RoleTag role="stock" size={14} />
						<div style={{marginTop: 8, fontSize: 17, lineHeight: 1.35, color: C.ink}}>Voici la fiche du produit.</div>
					</div>
					<div
						style={{
							position: 'absolute',
							left: MINI.x,
							top: MINI.y - CHAT_T,
							width: MINI.w,
							height: MINI.h,
							borderRadius: 18,
							background: '#fff',
							boxShadow: `0 0 0 1px ${C.line}, 0 8px 20px -10px rgba(21,23,28,0.25)`,
							display: 'flex',
							alignItems: 'center',
							gap: 12,
							padding: '0 14px',
							opacity: r1,
							transform: `translateY(${(1 - r1) * 12}px)`,
						}}
					>
						<TShirt size={62} radius={12} />
						<div>
							<div style={{fontSize: 16.5, fontWeight: 650}}>T-shirt bleu · M</div>
							<div style={{marginTop: 6}}>
								<Pill tone="ok" size={13}>
									3 disponibles
								</Pill>
							</div>
						</div>
					</div>
					<Bubble text="Prépare de quoi en recommander." f={f} start={V.words2} sent={V.sent2} words={Q2_WORDS} top={292} />
					<Typing f={f} from={V.sent2 + 2} to={V.reply2} top={372} />
					<div style={{position: 'absolute', top: 370, left: 22, right: 22, opacity: r2, transform: `translateY(${(1 - r2) * 12}px)`}}>
						<RoleTag role="stock" size={14} />
						<div style={{marginTop: 8, fontSize: 17, lineHeight: 1.35}}>
							Brouillon préparé. Rien n’est commandé sans votre accord.
						</div>
						<div style={{marginTop: 12}}>
							<Pill tone="wait" size={14} icon="doc">
								Commande fournisseur · brouillon
							</Pill>
						</div>
					</div>
				</div>
			</div>

			{/* input bar */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 0,
					height: 112,
					borderTop: `1px solid ${C.line}`,
					background: '#FBFBFA',
					display: 'flex',
					alignItems: 'flex-start',
					gap: 12,
					padding: '18px 20px 0',
					opacity: ui,
				}}
			>
				<div
					style={{
						width: 50,
						height: 50,
						borderRadius: 25,
						background: 'rgba(21,23,28,0.05)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Icon name="camera" size={24} color={C.ink2} />
				</div>
				<div
					style={{
						flex: 1,
						height: 50,
						borderRadius: 25,
						background: '#fff',
						boxShadow: `0 0 0 1px ${rec > 0.5 ? 'rgba(46,91,255,0.35)' : C.line}`,
						position: 'relative',
						overflow: 'hidden',
					}}
				>
					<div style={{position: 'absolute', left: 18, top: 15, fontSize: 16, color: C.ink3, opacity: 1 - rec}}>
						Écrire ou parler…
					</div>
					<div style={{position: 'absolute', left: 14, top: 11, opacity: rec, display: 'flex', alignItems: 'center', gap: 10}}>
						<VoiceWave f={f} width={150} height={28} bars={22} color={C.blue} level={rec} seed={f < V.rec2 ? 1 : 4} />
						<span style={{fontSize: 14, fontWeight: 620, color: C.blue, fontVariantNumeric: 'tabular-nums'}}>
							0:0{Math.min(4, Math.max(1, Math.floor(((f - (f < V.rec2 ? V.rec1 : V.rec2)) / 30) + 1)))}
						</span>
					</div>
				</div>
				<div style={{position: 'relative', width: 50, height: 50}}>
					{[0, 1].map((k) => {
						const t = ((f + k * 12) % 24) / 24;
						return (
							<div
								key={k}
								style={{
									position: 'absolute',
									inset: 0,
									borderRadius: 25,
									border: `2px solid ${C.blue}`,
									transform: `scale(${1 + t * 0.7})`,
									opacity: rec * (1 - t) * 0.6,
								}}
							/>
						);
					})}
					<div
						style={{
							position: 'absolute',
							inset: 0,
							borderRadius: 25,
							background: C.blue,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							transform: `scale(${1 - micPress * 0.1})`,
							boxShadow: '0 8px 18px -6px rgba(46,91,255,0.6)',
						}}
					>
						<Icon name="mic" size={25} color="#fff" stroke={2} />
					</div>
				</div>
			</div>
		</>
	);
};

// ————————————————————————————————————————————— Deployed card: sheet → draft

const Field: React.FC<{label: string; value: string; check?: boolean; o: number}> = ({label, value, check, o}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			height: 62,
			padding: '0 20px',
			borderRadius: 14,
			background: check ? 'rgba(201,138,27,0.07)' : 'rgba(21,23,28,0.035)',
			outline: check ? '1.5px dashed rgba(201,138,27,0.55)' : 'none',
			outlineOffset: -1.5,
			opacity: o,
			transform: `translateY(${(1 - o) * 12}px)`,
		}}
	>
		<div style={{fontSize: 18, color: C.ink2, fontWeight: 540}}>{label}</div>
		<div style={{display: 'flex', alignItems: 'center', gap: 14}}>
			<div style={{fontSize: 22, fontWeight: 680}}>{value}</div>
			{check ? (
				<Pill tone="wait" size={13} icon="eye">
					À vérifier
				</Pill>
			) : null}
		</div>
	</div>
);

const Stat: React.FC<{n: string; label: string; hi?: boolean; o: number; pulse?: number}> = ({n, label, hi, o, pulse = 0}) => (
	<div
		style={{
			flex: hi ? 1.35 : 1,
			height: 142,
			borderRadius: 18,
			padding: '18px 22px',
			background: hi ? C.blue : 'rgba(21,23,28,0.04)',
			color: hi ? '#fff' : C.ink,
			opacity: o,
			transform: `translateY(${(1 - o) * 14}px) scale(${1 + pulse * 0.04})`,
			boxShadow: hi ? `0 16px 36px -14px rgba(46,91,255,${0.55 + pulse * 0.3})` : 'none',
		}}
	>
		<div
			style={{
				fontFamily: FONT_DISPLAY,
				fontSize: 64,
				fontWeight: 700,
				lineHeight: 1,
				letterSpacing: '-0.03em',
				fontVariantNumeric: 'tabular-nums',
			}}
		>
			{n}
		</div>
		<div style={{marginTop: 12, fontSize: 20, fontWeight: 600, opacity: hi ? 0.92 : 0.6}}>{label}</div>
	</div>
);

const DeployCard: React.FC<{f: number}> = ({f}) => {
	const d = prog(f, V.deploy[0], V.deploy[1], E.out);
	if (d <= 0) return null;
	const m = prog(f, V.morph[0], V.morph[1], E.inOut);
	// geometry: from the mini-card inside the phone to the large sheet
	const mx = SCREEN_L + MINI.x;
	const my = SCREEN_T + MINI.y;
	const h = SHEET.h;
	const x = mix(mx, SHEET.x, d);
	const y = mix(my, SHEET.y, d);
	const w = mix(MINI.w, SHEET.w, d);
	const hh = mix(MINI.h, h, d);
	const cIn = prog(f, V.deploy[0] + 12, V.deploy[1] + 4);
	const a = (1 - prog(m, 0, 0.45, E.linear)) * cIn; // sheet content
	const b = prog(m, 0.4, 1, E.linear); // draft content
	const row = (k: number, base: number) => prog(f, base + k * 4, base + k * 4 + 16);
	const pulse = Math.max(0, Math.sin(Math.min(1, Math.max(0, (f - 176) / 18)) * Math.PI));
	// T-shirt travels from hero to thumbnail
	const ts = mix(206, 96, m);
	const tx = mix(40, 40, m);
	const ty = mix(98, 116, m);
	const status = prog(f, V.status, V.status + 16, E.back);
	return (
		<Surface
			lift
			radius={mix(18, 30, d)}
			style={{left: x, top: y, width: w, height: hh, zIndex: 4}}
		>
			<div style={{position: 'absolute', left: 0, top: 0, width: SHEET.w, height: SHEET.h, transformOrigin: '0 0', transform: `scale(${w / SHEET.w})`}}>
				{/* header */}
				<div style={{position: 'absolute', left: 40, right: 40, top: 34, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: cIn}}>
					<RoleTag role="stock" size={18} />
					<div style={{position: 'relative', height: 30}}>
						<Kicker style={{opacity: a, position: 'absolute', right: 0, top: 6}}>Fiche produit</Kicker>
						<div style={{opacity: b, position: 'absolute', right: 0, top: 0}}>
							<Pill tone="neutral" size={14} icon="doc">
								Brouillon · non envoyé
							</Pill>
						</div>
					</div>
				</div>
				<div style={{position: 'absolute', left: tx, top: ty, opacity: cIn}}>
					<TShirt size={ts} radius={mix(22, 16, m)} />
				</div>

				{/* A — product sheet */}
				<div style={{position: 'absolute', left: 280, top: 110, opacity: a, transform: `translateY(${-m * 16}px)`}}>
					<div style={{fontFamily: FONT_DISPLAY, fontSize: 50, fontWeight: 700, letterSpacing: '-0.03em'}}>T-shirt bleu</div>
					<div style={{fontSize: 26, fontWeight: 560, color: C.ink2, marginTop: 6}}>Taille M</div>
					<div style={{fontSize: 17, color: C.ink3, marginTop: 14, fontVariantNumeric: 'tabular-nums'}}>Réf. TSB-M · coton bio</div>
				</div>
				<div style={{position: 'absolute', left: 40, right: 40, top: 350, display: 'flex', gap: 16, opacity: a}}>
					<Stat n="5" label="en stock" o={row(0, V.deploy[0] + 14)} />
					<Stat n="2" label="réservés" o={row(1, V.deploy[0] + 14)} />
					<Stat n="3" label="disponibles" hi o={row(2, V.deploy[0] + 14)} pulse={pulse} />
				</div>

				{/* B — supplier draft */}
				<div style={{position: 'absolute', left: 160, top: 122, opacity: b, transform: `translateY(${(1 - b) * 16}px)`}}>
					<div style={{fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 700, letterSpacing: '-0.025em'}}>
						Commande fournisseur
					</div>
					<div style={{fontSize: 19, color: C.ink2, marginTop: 8}}>T-shirt bleu · Taille M · fournisseur habituel</div>
				</div>
				<div style={{position: 'absolute', left: 40, right: 40, top: 250, display: 'flex', flexDirection: 'column', gap: 12}}>
					<Field label="Référence" value="TSB-M" check o={b * row(0, V.morph[0] + 10)} />
					<Field label="Quantité proposée" value="20" check o={b * row(1, V.morph[0] + 10)} />
					<Field label="Disponible aujourd’hui" value="3" o={b * row(2, V.morph[0] + 10)} />
				</div>
				<div
					style={{
						position: 'absolute',
						left: 40,
						right: 40,
						bottom: 36,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						opacity: b * Math.min(1, status * 1.5),
					}}
				>
					<div style={{transform: `scale(${0.85 + 0.15 * status})`, transformOrigin: 'left center'}}>
						<Pill tone="wait" size={22}>
							Brouillon prêt à vérifier
						</Pill>
					</div>
					<div style={{fontSize: 16, color: C.ink3, fontWeight: 540}}>Rien n’est commandé automatiquement</div>
				</div>
			</div>
		</Surface>
	);
};

// ————————————————————————————————————————————— Scene

export const Voice: React.FC = () => {
	const f = useCurrentFrame();
	const px = keys(f, [
		[V.move[0], 960],
		[V.move[1], PX],
	]);
	const bezel = prog(f, 0, 16, E.out);

	// Left-hand typography: the spoken request, then it steps aside.
	const q1Out = prog(f, V.deploy[0] - 10, V.deploy[0] + 10, E.inOut);
	const q2In = prog(f, V.rec2, V.rec2 + 10);
	const exit = prog(f, 330, 360, E.inOut);
	const listenO = prog(f, V.rec1, V.rec1 + 10) * (1 - prog(f, V.deploy[0] - 6, V.deploy[0] + 6));

	return (
		<AbsoluteFill style={{background: C.night, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					left: px - 700,
					top: -160,
					width: 1400,
					height: 1400,
					borderRadius: '50%',
					background: 'radial-gradient(closest-side, rgba(46,91,255,0.16), rgba(46,91,255,0))',
					opacity: prog(f, 0, 40),
				}}
			/>
			<AbsoluteFill style={{transform: `scale(${1 - exit * 0.03})`}}>
				<Phone x={px} y={PY} bezel={bezel}>
					<ChatScreen f={f} />
				</Phone>

				{/* spoken request, large */}
				<div style={{position: 'absolute', left: 150, top: 300, opacity: 1 - q1Out, transform: `translateY(${-q1Out * 60}px)`}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 30, opacity: listenO}}>
						<VoiceWave f={f} width={120} height={36} bars={14} color={C.blueHi} level={prog(f, V.rec1, V.rec1 + 8) * (1 - prog(f, V.sent1 - 8, V.sent1))} />
						<Kicker color={C.snow2} size={16}>
							Demande vocale
						</Kicker>
					</div>
					<Headline lines={Q1} f={f} start={V.words1} stagger={STAG} size={84} color={C.snow} weight={620} lineHeight={1.08} />
				</div>

				{/* captions above the card */}
				<div
					style={{
						position: 'absolute',
						left: 150,
						top: 132,
						fontFamily: FONT_UI,
						opacity: prog(f, V.deploy[0] + 8, V.deploy[0] + 24) * (1 - q2In),
					}}
				>
					<Kicker color={C.snow3} size={15} style={{display: 'flex', alignItems: 'center', gap: 8}}>
						<Icon name="mic" size={16} color={C.blueHi} /> Vous
					</Kicker>
					<div style={{marginTop: 12, fontSize: 32, fontWeight: 560, color: C.snow2, letterSpacing: '-0.015em'}}>
						{'«\u00A0Il me reste combien de t-shirts bleus en taille M\u00A0?\u00A0»'}
					</div>
				</div>
				<div style={{position: 'absolute', left: 150, top: 132, opacity: q2In}}>
					<Kicker color={C.snow3} size={15} style={{display: 'flex', alignItems: 'center', gap: 10}}>
						<VoiceWave f={f} width={56} height={18} bars={8} color={C.blueHi} level={prog(f, V.rec2, V.rec2 + 8) * (1 - prog(f, V.sent2 - 8, V.sent2))} seed={4} />
						Vous
					</Kicker>
					<div style={{marginTop: 10}}>
						<Headline lines={Q2} f={f} start={V.words2} stagger={STAG} size={46} color={C.snow} weight={620} />
					</div>
				</div>

				<DeployCard f={f} />
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
