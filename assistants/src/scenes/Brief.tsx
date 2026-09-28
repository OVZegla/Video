import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_DISPLAY, FONT_UI, RoleId} from '../theme';
import {E, mix, prog} from '../lib/anim';
import {Icon} from '../components/Icon';
import {Headline} from '../components/Headline';
import {Kicker, Pill, RoleTag, RoleTile} from '../components/ui';
import {SCENES} from '../timeline';

// 40–49 s. A calm morning card: where things stand, what awaits a decision.

const LEAD = SCENES.brief.lead;

export const CARD = {x: 1000, y: 176, w: 780, h: 660};
const ROW0 = 300; // first row, relative to the card
const ROW_H = 112;
export const ROW_RECT = (i: number) => ({x: CARD.x + 28, y: CARD.y + ROW0 + i * ROW_H, w: CARD.w - 56, h: ROW_H - 12});

// The review panel of the previous scene, where the night grows from.
const FROM = {x: 390, y: 196, w: 1140, h: 708, r: 30};

const ITEMS: {role: RoleId; title: string; sub: string; status: string}[] = [
	{role: 'commercial', title: 'Un devis à vérifier', sub: 'Pergola en bois · M. Robert', status: 'À vérifier'},
	{role: 'stock', title: 'Une commande à préparer', sub: 'Vis inox et lambourdes', status: 'À préparer'},
	{role: 'com', title: 'Une publication prête à relire', sub: 'Nouvelle réalisation · terrasse', status: 'À relire'},
];

export const Brief: React.FC = () => {
	const f = useCurrentFrame();
	const t = f - LEAD;

	const w = prog(f, 0, LEAD + 2, E.inOut);
	const clip = {
		top: mix(FROM.y, 0, w),
		left: mix(FROM.x, 0, w),
		right: mix(1920 - FROM.x - FROM.w, 0, w),
		bottom: mix(1080 - FROM.y - FROM.h, 0, w),
		r: mix(FROM.r, 0, w),
	};

	const drift = 1 + 0.018 * prog(t, 0, 246, E.inOutSoft);
	const cardIn = prog(t, -6, 26, E.out);
	const focus = prog(t, 206, 232, E.inOut);

	return (
		<AbsoluteFill
			style={{
				background: C.night,
				clipPath: `inset(${clip.top}px ${clip.right}px ${clip.bottom}px ${clip.left}px round ${clip.r}px)`,
			}}
		>
			{/* morning light */}
			<div
				style={{
					position: 'absolute',
					left: 700,
					top: -500,
					width: 1600,
					height: 1400,
					borderRadius: '50%',
					background: 'radial-gradient(closest-side, rgba(91,127,255,0.14), rgba(91,127,255,0))',
					opacity: prog(t, 0, 60),
				}}
			/>
			<AbsoluteFill style={{transform: `scale(${drift})`}}>
				{/* ———— text */}
				<div style={{position: 'absolute', left: 140, top: 300}}>
					<Headline lines={['Vous savez', 'où vous en êtes.']} f={t} start={96} size={84} color={C.snow} weight={620} />
				</div>
				<div style={{position: 'absolute', left: 140, top: 540}}>
					<Headline
						lines={['Et ce qui attend', 'votre décision.']}
						f={t}
						start={150}
						size={84}
						color={C.blueHi}
						weight={620}
					/>
				</div>

				{/* ———— veille, second plane */}
				{(() => {
					const v = prog(t, 122, 146, E.out);
					return (
						<div
							style={{
								position: 'absolute',
								left: CARD.x + 340,
								top: CARD.y + CARD.h + 26 + (1 - v) * 16,
								width: 470,
								height: 88,
								borderRadius: 20,
								background: C.nightHi,
								outline: `1px solid ${C.nightLine}`,
								display: 'flex',
								alignItems: 'center',
								gap: 16,
								padding: '0 22px',
								opacity: v * 0.78 * (1 - focus * 0.5),
								transform: 'scale(0.96)',
								filter: 'blur(0.6px)',
								fontFamily: FONT_UI,
							}}
						>
							<RoleTile role="pilotage" size={42} dark />
							<div>
								<Kicker size={13} color={C.snow3}>
									Veille
								</Kicker>
								<div style={{fontSize: 19, fontWeight: 600, color: C.snow2, marginTop: 4}}>Pluie annoncée jeudi</div>
							</div>
							<Icon name="cloud" size={30} color={C.snow3} style={{marginLeft: 'auto'}} />
						</div>
					);
				})()}

				{/* ———— daily brief */}
				<div
					style={{
						position: 'absolute',
						left: CARD.x,
						top: CARD.y,
						width: CARD.w,
						height: CARD.h,
						borderRadius: 30,
						background: C.nightCard,
						boxShadow: `0 1px 0 rgba(255,255,255,0.06) inset, 0 40px 90px -30px rgba(0,0,0,0.7)`,
						outline: `1px solid ${C.nightLine}`,
						fontFamily: FONT_UI,
						color: C.snow,
						opacity: cardIn,
						transform: `translateY(${(1 - cardIn) * 40}px)`,
					}}
				>
					<div
						style={{
							position: 'absolute',
							left: 36,
							right: 36,
							top: 34,
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							opacity: prog(t, 6, 20),
						}}
					>
						<RoleTag role="pilotage" dark size={17} />
						<div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 17, color: C.snow3, fontWeight: 540}}>
							<Icon name="sun" size={20} color="#C7951A" /> Mardi 29 septembre · 08:00
						</div>
					</div>
					<div style={{position: 'absolute', left: 36, top: 104}}>
						<Headline
							lines={['Bonjour.', {text: 'Voici votre point du jour.', color: C.snow2}]}
							f={t}
							start={12}
							stagger={3}
							size={52}
							color={C.snow}
							weight={640}
							lineHeight={1.12}
							tracking={-0.025}
						/>
					</div>
					{ITEMS.map((it, i) => {
						const r = prog(t, 48 + i * 13, 70 + i * 13, E.out);
						const hi = i === 0 ? focus : 0;
						const dim = i === 0 ? 1 : 1 - focus * 0.55;
						const rr = ROW_RECT(i);
						return (
							<div
								key={it.role}
								style={{
									position: 'absolute',
									left: rr.x - CARD.x,
									top: rr.y - CARD.y,
									width: rr.w,
									height: rr.h,
									borderRadius: 20,
									background: `rgba(255,255,255,${0.04 + 0.04 * hi})`,
									outline: `${1 + hi}px solid rgba(91,127,255,${0.0 + 0.7 * hi})`,
									outlineOffset: -1,
									display: 'flex',
									alignItems: 'center',
									gap: 18,
									padding: '0 22px',
									opacity: r * dim,
									transform: `translateY(${(1 - r) * 18}px) scale(${1 + hi * 0.015})`,
								}}
							>
								<RoleTile role={it.role} size={52} dark />
								<div style={{flex: 1}}>
									<div style={{fontFamily: FONT_DISPLAY, fontSize: 25, fontWeight: 650, letterSpacing: '-0.015em'}}>
										{it.title}
									</div>
									<div style={{fontSize: 16, color: C.snow3, marginTop: 5}}>{it.sub}</div>
								</div>
								<Pill tone="dark" size={15}>
									{it.status}
								</Pill>
								<Icon name="chevron" size={22} color={C.snow3} />
							</div>
						);
					})}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
