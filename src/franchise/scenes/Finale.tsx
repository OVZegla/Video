import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {COPY} from '../copy';
import {ease, K, lerp, p, SANS} from '../theme';
import {Blob, bodyStyle, Eye, Fade, KenBurns, Kicker, Logo, Paper, Rise, titleStyle, Tricolour, Window} from '../ui';

// ---------------------------------------------------------------------------
// 8 — Large-scale projects, on the showroom wall.

const WALL = {x: 120, y: 110, w: 1680, h: 560}; // photo is 2000 × 667
const PIN_SRC: [number, number][] = [
	[335, 200],
	[512, 270],
	[330, 372],
	[1512, 245],
	[1590, 410],
	[1665, 462],
];

// Where each callout label sits relative to its pin.
const LABEL_OFFSET: [number, number][] = [
	[18, -52],
	[18, -52],
	[18, 14],
	[18, -52],
	[-190, -40],
	[18, 14],
];

export const Custom: React.FC = () => {
	const f = useCurrentFrame();
	const c = COPY.custom;
	const zoom = lerp(1, 1.04, p(f, 0, 390, ease.soft));
	const k = WALL.w / 2000;
	return (
		<AbsoluteFill>
			<Paper />
			<Window x={WALL.x} y={WALL.y} w={WALL.w} h={WALL.h} at={8} radius={32} from="left">
				<div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`}}>
					<Img src={staticFile('franchise/mur-showroom.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
					{PIN_SRC.map(([x, y], i) => {
						const at = 50 + i * 16;
						const t = p(f, at, at + 18, ease.back);
						const [dx, dy] = LABEL_OFFSET[i];
						return (
							<div key={i} style={{position: 'absolute', left: x * k, top: y * k, opacity: Math.min(1, t)}}>
								<div style={{position: 'absolute', left: -9, top: -9, width: 18, height: 18, borderRadius: 18, background: K.red, border: `3px solid ${K.white}`, transform: `scale(${t})`}} />
								<div
									style={{
										position: 'absolute',
										left: dx,
										top: dy,
										whiteSpace: 'nowrap',
										background: K.white,
										color: K.navy,
										fontFamily: SANS,
										fontSize: 22,
										fontWeight: 500,
										padding: '8px 16px',
										borderRadius: 24,
										boxShadow: '0 8px 20px rgba(0,4,79,0.18)',
									}}
								>
									{c.callouts[i]}
								</div>
							</div>
						);
					})}
				</div>
			</Window>
			<div style={{position: 'absolute', left: 120, top: 730}}>
				<Fade at={18}>
					<Kicker>07 — {COPY.chapters[6]}</Kicker>
				</Fade>
				<div style={{height: 22}} />
				<Rise at={26}>
					<div style={titleStyle(K.navy, 66)}>{c.title[0]}</div>
				</Rise>
				<Rise at={34}>
					<div style={titleStyle(K.navy, 66)}>{c.title[1]}</div>
				</Rise>
			</div>
			<div style={{position: 'absolute', left: 820, top: 740, width: 980}}>
				<Fade at={60}>
					<div style={bodyStyle(K.navySoft, 27)}>{c.body}</div>
				</Fade>
				<div style={{height: 30}} />
				<div style={{display: 'flex', gap: 14, flexWrap: 'wrap'}}>
					{c.clients.map((cl, i) => (
						<Fade key={cl} at={140 + i * 12} y={16}>
							<div
								style={{
									fontFamily: SANS,
									fontSize: 24,
									fontWeight: 500,
									color: i % 2 ? K.navy : K.white,
									background: i % 2 ? K.paperLight : [K.navy, K.blue, K.red][(i / 2) % 3],
									border: i % 2 ? `2px solid ${K.navy}` : '2px solid transparent',
									padding: '10px 24px',
									borderRadius: 40,
								}}
							>
								{cl}
							</div>
						</Fade>
					))}
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// 9 — What a franchisee gets.

const TileGlyph: React.FC<{i: number; t: number}> = ({i, t}) => (
	<svg viewBox="0 0 60 60" width={60} height={60}>
		{i === 0 && <circle cx={30} cy={30} r={26 * t} fill={K.navy} />}
		{i === 1 && (
			<>
				<rect x={8} y={4} width={44 * t} height={52} fill={K.blue} />
				<rect x={8} y={4} width={44 * t} height={52} fill="none" stroke={K.navy} strokeWidth={2} />
			</>
		)}
		{i === 2 && (
			<>
				<rect x={4} y={16} width={52} height={40} fill={K.navy} />
				<line x1={30} y1={4} x2={30} y2={4 + 40 * t} stroke={K.red} strokeWidth={5} />
			</>
		)}
		{i === 3 && (
			<>
				{[0, 1, 2].map((k) => (
					<rect key={k} x={4 + k * 19} y={56 - 50 * t * (0.6 + k * 0.2)} width={14} height={50 * t * (0.6 + k * 0.2)} fill={[K.wood, K.blue, K.red][k]} />
				))}
			</>
		)}
		{i === 4 && <path d={`M 4 56 a 26 26 0 0 1 52 0 z`} fill={K.red} transform={`rotate(${(1 - t) * -90} 30 56)`} />}
		{i === 5 && (
			<>
				{[
					[14, 14],
					[46, 14],
					[30, 46],
				].map(([x, y], k) => (
					<circle key={k} cx={x} cy={y} r={10 * t} fill={[K.navy, K.blue, K.red][k]} />
				))}
				<path d="M 14 14 L 46 14 L 30 46 Z" fill="none" stroke={K.navy} strokeWidth={2} opacity={t} />
			</>
		)}
	</svg>
);

export const Franchise: React.FC = () => {
	const f = useCurrentFrame();
	const c = COPY.franchise;
	return (
		<AbsoluteFill>
			<Paper />
			<Blob cx={420} cy={560} r={360} ry={430} seed={21} color={K.navy} at={4} dur={40} wobble={0.1} />
			<Window x={140} y={150} w={560} h={747} at={14} radius={280}>
				<KenBurns src={staticFile('franchise/interieur-atelier.jpg')} dur={390} from={1.04} to={1.14} oy={40} />
			</Window>
			<div style={{position: 'absolute', left: 820, top: 150, width: 1000}}>
				<Fade at={18}>
					<Kicker>08 — {COPY.chapters[7]}</Kicker>
				</Fade>
				<div style={{height: 24}} />
				<Rise at={26}>
					<div style={titleStyle(K.navy, 76)}>{c.title[0]}</div>
				</Rise>
				<Rise at={34}>
					<div style={titleStyle(K.navy, 76)}>{c.title[1]}</div>
				</Rise>
				<div style={{height: 24}} />
				<Fade at={54}>
					<div style={bodyStyle(K.navySoft, 28)}>{c.body}</div>
				</Fade>
				<div style={{height: 46}} />
				<div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20}}>
					{c.items.map((it, i) => {
						const at = 80 + i * 18;
						const t = p(f, at, at + 24);
						return (
							<div
								key={it.t}
								style={{
									background: K.paperLight,
									borderRadius: 20,
									padding: '26px 26px 24px',
									height: 214,
									boxSizing: 'border-box',
									opacity: t,
									transform: `translateY(${(1 - t) * 40}px)`,
									boxShadow: '0 12px 30px rgba(0,4,79,0.07)',
								}}
							>
								<TileGlyph i={i} t={p(f, at + 8, at + 34)} />
								<div style={{fontFamily: SANS, fontSize: 30, fontWeight: 500, color: K.navy, marginTop: 14}}>{it.t}</div>
								<div style={{...bodyStyle(K.navySoft, 21), lineHeight: 1.3, marginTop: 6}}>{it.d}</div>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// 10 — Closing card.

export const Outro: React.FC = () => {
	const f = useCurrentFrame();
	const c = COPY.outro;
	const logo = p(f, 60, 96);
	return (
		<AbsoluteFill style={{background: K.navy}}>
			<Blob cx={1700} cy={140} r={320} ry={240} seed={4} color={K.navySoft} at={0} dur={50} />
			<Blob cx={180} cy={960} r={280} ry={220} seed={9} color={K.blue} at={6} dur={50} />
			<Blob cx={1760} cy={980} r={120} seed={13} color={K.red} at={20} dur={40} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<Rise at={14}>
					<div style={{...titleStyle(K.white, 76), fontWeight: 300, textAlign: 'center'}}>{c.line[0]}</div>
				</Rise>
				<Rise at={24}>
					<div style={{...titleStyle(K.white, 76), fontWeight: 300, textAlign: 'center'}}>{c.line[1]}</div>
				</Rise>
				<div style={{height: 70}} />
				<div style={{clipPath: `inset(-10% ${(1 - logo) * 100}% -10% 0)`}}>
					<Logo width={900} white />
				</div>
				<div style={{height: 50}} />
				<Tricolour p={p(f, 90, 130)} width={220} />
				<div style={{height: 60}} />
				<Fade at={120}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 18,
							background: K.red,
							color: K.white,
							fontFamily: SANS,
							fontSize: 34,
							fontWeight: 500,
							letterSpacing: '0.06em',
							padding: '18px 40px 18px 22px',
							borderRadius: 60,
						}}
					>
						<Eye size={46} ring={K.white} spin={f * 1.2} />
						{c.cta}
					</div>
				</Fade>
			</div>
		</AbsoluteFill>
	);
};
