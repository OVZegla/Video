import React from 'react';
import {Logo, Eye} from '../franchise/ui';
import {Product, TreeMark} from '../franchise/icons';
import {clamp01, ease, K, lerp, p, SANS} from '../franchise/theme';
import {Glyph} from './glyphs';

/**
 * Animated illustrations for the training modules. Each stage fills the
 * 760 × 760 panel and is driven by `t`, the frames since it appeared.
 */
export const PW = 760;
export type StageProps = {t: number};
export type Stage = React.FC<StageProps>;

const pop = (t: number, at: number, d = 18) => p(t, at, at + d, ease.back);
const rise = (t: number, at: number, d = 20) => p(t, at, at + d, ease.out);

const label = (size = 26, color: string = K.navy, weight = 500): React.CSSProperties => ({
	fontFamily: SANS,
	fontSize: size,
	fontWeight: weight,
	color,
	lineHeight: 1.2,
	textAlign: 'center',
});

const Abs: React.FC<{x: number; y: number; w?: number; h?: number; children?: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w, h, children, style}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, height: h, ...style}}>{children}</div>
);

const card: React.CSSProperties = {
	background: K.white,
	borderRadius: 26,
	boxShadow: '0 14px 34px rgba(0,4,79,0.09)',
};

// ---------------------------------------------------------------------------
// Generic stages

export type Item = {g: string; l: string};

/** Grid of pictogram tiles. */
export const Tiles =
	(items: Item[], cols = items.length <= 3 ? items.length : 2): Stage =>
	({t}) => {
		const rows = Math.ceil(items.length / cols);
		const gap = 30;
		const pad = 40;
		const w = (PW - pad * 2 - gap * (cols - 1)) / cols;
		const h = rows === 1 ? Math.min(w * 1.5, 420) : Math.min(w, (PW - pad * 2 - gap * (rows - 1)) / rows);
		const y0 = (PW - (rows * h + (rows - 1) * gap)) / 2;
		return (
			<>
				{items.map((it, i) => {
					const s = pop(t, 4 + i * 9);
					const c = i % cols;
					const r = Math.floor(i / cols);
					return (
						<Abs key={i} x={pad + c * (w + gap)} y={y0 + r * (h + gap)} w={w} h={h}>
							<div
								style={{
									...card,
									width: '100%',
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 18,
									transform: `scale(${s})`,
									opacity: clamp01(s * 2),
								}}
							>
								<Glyph name={it.g} size={Math.min(h * 0.46, 150)} />
								<div style={{...label(h > 300 ? 30 : 26), padding: '0 16px'}}>{it.l}</div>
							</div>
						</Abs>
					);
				})}
			</>
		);
	};

/** Steps linked by a line that draws itself, a red dot travelling along. */
export const Chain =
	(items: Item[]): Stage =>
	({t}) => {
		const n = items.length;
		const step = PW / n;
		const y = 330;
		const R = n > 3 ? 66 : 84;
		const line = p(t, 10, 10 + n * 16, ease.inOut);
		const x0 = step / 2;
		const x1 = PW - step / 2;
		const dot = lerp(x0, x1, p(t, 20, 20 + n * 22, ease.inOut));
		return (
			<>
				<svg width={PW} height={PW} style={{position: 'absolute', left: 0, top: 0}}>
					<line x1={x0} y1={y} x2={lerp(x0, x1, line)} y2={y} stroke={K.navy} strokeWidth={4} strokeDasharray="10 10" />
					<circle cx={dot} cy={y} r={11} fill={K.red} opacity={p(t, 20, 26)} />
				</svg>
				{items.map((it, i) => {
					const s = pop(t, 4 + i * 14);
					const cx = x0 + i * step;
					return (
						<React.Fragment key={i}>
							<Abs x={cx - R} y={y - R} w={R * 2} h={R * 2}>
								<div
									style={{
										width: '100%',
										height: '100%',
										borderRadius: R * 2,
										background: K.white,
										boxShadow: '0 12px 28px rgba(0,4,79,0.10)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										transform: `scale(${s})`,
									}}
								>
									<Glyph name={it.g} size={R * 1.1} />
								</div>
							</Abs>
							<Abs x={cx - step / 2 + 6} y={y + R + 26} w={step - 12} style={{opacity: rise(t, 12 + i * 14)}}>
								<div style={label(n > 3 ? 23 : 27)}>{it.l}</div>
							</Abs>
							<Abs x={cx - 18} y={y - R - 56} w={36} style={{opacity: rise(t, 12 + i * 14)}}>
								<div style={{...label(20, K.red), letterSpacing: '0.1em'}}>{String(i + 1).padStart(2, '0')}</div>
							</Abs>
						</React.Fragment>
					);
				})}
			</>
		);
	};

/** A card of items that get ticked one after another. */
export const Checks =
	(items: string[], g?: string): Stage =>
	({t}) => {
		const rowH = 118;
		const h = items.length * rowH + 90;
		const y0 = (PW - h) / 2 + (g ? 40 : 0);
		return (
			<>
				{g && (
					<Abs x={PW / 2 - 60} y={y0 - 150} style={{transform: `scale(${pop(t, 0)})`}}>
						<Glyph name={g} size={120} />
					</Abs>
				)}
				<Abs x={90} y={y0} w={PW - 180} h={h} style={{...card, opacity: rise(t, 2), transform: `translateY(${(1 - rise(t, 2)) * 40}px)`}}>
					{items.map((it, i) => {
						const tick = p(t, 22 + i * 16, 36 + i * 16, ease.out);
						return (
							<div key={i} style={{position: 'absolute', left: 50, top: 45 + i * rowH, height: rowH, display: 'flex', alignItems: 'center', gap: 30, opacity: rise(t, 8 + i * 10)}}>
								<svg width={56} height={56} viewBox="0 0 56 56">
									<rect x={3} y={3} width={50} height={50} rx={12} fill={tick > 0.5 ? K.blue : K.paperLight} stroke={K.navy} strokeWidth={3} />
									<path d="M 14 29 L 24 39 L 42 18" stroke={K.white} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={46} strokeDashoffset={46 * (1 - tick)} />
								</svg>
								<div style={{...label(32), textAlign: 'left'}}>{it}</div>
							</div>
						);
					})}
				</Abs>
			</>
		);
	};

/** One big pictogram, rings pulsing, small satellites orbiting. */
export const Hero =
	(g: string, caption?: string, orbit: string[] = []): Stage =>
	({t}) => {
		const s = pop(t, 2, 24);
		const c = PW / 2;
		const cy = caption ? 330 : 380;
		return (
			<>
				<svg width={PW} height={PW} style={{position: 'absolute', left: 0, top: 0}}>
					<circle cx={c} cy={cy} r={200 * s} fill={K.sand} />
					{[0, 1].map((k) => {
						const w = ((t + k * 40) % 80) / 80;
						return <circle key={k} cx={c} cy={cy} r={200 + w * 130} fill="none" stroke={K.blue} strokeWidth={3} opacity={(1 - w) * 0.4 * s} />;
					})}
				</svg>
				<Abs x={c - 120} y={cy - 120} style={{transform: `scale(${s})`}}>
					<Glyph name={g} size={240} />
				</Abs>
				{orbit.map((o, i) => {
					const a = (i / orbit.length) * Math.PI * 2 + t / 90 - Math.PI / 2;
					const r = 240;
					const os = pop(t, 16 + i * 8);
					return (
						<Abs key={i} x={c + Math.cos(a) * r - 44} y={cy + Math.sin(a) * r - 44} w={88} h={88} style={{...card, borderRadius: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${os})`}}>
							<Glyph name={o} size={54} />
						</Abs>
					);
				})}
				{caption && (
					<Abs x={0} y={cy + 318} w={PW} style={{opacity: rise(t, 20)}}>
						<div style={{...label(34), letterSpacing: '0.02em'}}>{caption}</div>
					</Abs>
				)}
			</>
		);
	};

/** A centre node and labelled satellites linked to it. */
export const Network =
	(center: React.ReactNode, items: Item[], bg: string = K.navy): Stage =>
	({t}) => {
		const c = PW / 2;
		const r = 262;
		const pos = items.map((_, i) => {
			const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
			return [c + Math.cos(a) * r, c + Math.sin(a) * r * 0.86] as const;
		});
		return (
			<>
				<svg width={PW} height={PW} style={{position: 'absolute', left: 0, top: 0}}>
					{pos.map(([x, y], i) => {
						const d = p(t, 14 + i * 8, 34 + i * 8, ease.inOut);
						return <line key={i} x1={c} y1={c} x2={lerp(c, x, d)} y2={lerp(c, y, d)} stroke={K.sky} strokeWidth={5} strokeDasharray="2 12" strokeLinecap="round" />;
					})}
				</svg>
				<Abs x={c - 100} y={c - 100} w={200} h={200} style={{borderRadius: 200, background: bg, boxShadow: '0 14px 34px rgba(0,4,79,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(t, 0, 22)})`}}>
					{center}
				</Abs>
				{items.map((it, i) => {
					const [x, y] = pos[i];
					const s = pop(t, 26 + i * 8);
					return (
						<Abs key={i} x={x - 80} y={y - 62} w={160} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transform: `scale(${s})`}}>
							<div style={{...card, width: 96, height: 96, borderRadius: 96, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<Glyph name={it.g} size={60} />
							</div>
							<div style={label(22)}>{it.l}</div>
						</Abs>
					);
				})}
			</>
		);
	};

/** Speech bubbles alternating left / right. */
export const Talk =
	(lines: {r?: boolean; text: string}[]): Stage =>
	({t}) => (
		<div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28, padding: '0 60px'}}>
			{lines.map((l, i) => {
				const s = pop(t, 4 + i * 16);
				return (
					<div key={i} style={{display: 'flex', justifyContent: l.r ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 16}}>
						{!l.r && <div style={{width: 58, height: 58, borderRadius: 58, background: K.blue, flexShrink: 0, transform: `scale(${s})`}} />}
						<div
							style={{
								...label(30, l.r ? K.white : K.navy, 400),
								textAlign: 'left',
								background: l.r ? K.navy : K.white,
								boxShadow: '0 12px 28px rgba(0,4,79,0.10)',
								padding: '20px 30px',
								borderRadius: l.r ? '30px 30px 6px 30px' : '30px 30px 30px 6px',
								transform: `scale(${s})`,
								transformOrigin: l.r ? 'right bottom' : 'left bottom',
							}}
						>
							{l.text}
						</div>
						{l.r && <div style={{width: 58, height: 58, borderRadius: 58, background: K.red, flexShrink: 0, transform: `scale(${s})`}} />}
					</div>
				);
			})}
		</div>
	);

// ---------------------------------------------------------------------------
// Custom stages

/** A small town seen from above, with client pins — or a visibility radar. */
export const Territory =
	(mode: 'pins' | 'radar', pins: Item[] = []): Stage =>
	({t}) => {
		const draw = rise(t, 0, 26);
		const blocks: [number, number, number, number][] = [];
		for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) blocks.push([60 + c * 132, 60 + r * 132, 104, 104]);
		const spots: [number, number][] = [
			[178, 178],
			[574, 244],
			[244, 574],
			[574, 574],
			[112, 442],
			[640, 112],
		];
		return (
			<>
				<svg width={PW} height={PW} style={{position: 'absolute', left: 0, top: 0}}>
					<rect x={20} y={20} width={PW - 40} height={PW - 40} rx={30} fill={K.sand} opacity={draw} />
					{blocks.map(([x, y, w, h], i) => (
						<rect key={i} x={x} y={y} width={w} height={h} rx={14} fill={i % 7 === 3 ? K.sage : K.paperLight} opacity={clamp01(draw * 2 - (i % 5) * 0.12)} />
					))}
					<path d="M 20 400 C 200 360 500 460 740 380" stroke={K.sky} strokeWidth={18} fill="none" opacity={0.7 * draw} />
					{mode === 'radar' &&
						[0, 1, 2].map((k) => {
							const w = ((t + k * 30) % 90) / 90;
							return <circle key={k} cx={380} cy={380} r={60 + w * 330} fill="none" stroke={K.red} strokeWidth={4} opacity={(1 - w) * 0.6 * p(t, 16, 24)} />;
						})}
				</svg>
				{mode === 'pins' &&
					pins.map((it, i) => {
						const [x, y] = spots[i];
						const s = pop(t, 16 + i * 12);
						return (
							<React.Fragment key={i}>
								<Abs x={x - 40} y={y - 84} style={{transform: `translateY(${(1 - s) * -60}px)`, opacity: clamp01(s * 2)}}>
									<Glyph name="pin" size={80} />
								</Abs>
								<Abs x={x - 110} y={y + 6} w={220} style={{opacity: rise(t, 24 + i * 12), display: 'flex', justifyContent: 'center'}}>
									<div style={{...card, borderRadius: 40, padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 10}}>
										<Glyph name={it.g} size={36} />
										<div style={label(22)}>{it.l}</div>
									</div>
								</Abs>
							</React.Fragment>
						);
					})}
				{mode === 'radar' && (
					<>
						<Abs x={380 - 80} y={380 - 80} w={160} h={160} style={{...card, borderRadius: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(t, 8)})`}}>
							<Eye size={110} />
						</Abs>
						{spots.map(([x, y], i) => (
							<Abs key={i} x={x - 30} y={y - 30} style={{transform: `scale(${pop(t, 30 + i * 10)})`}}>
								<Glyph name={i % 2 ? 'people' : 'house'} size={60} />
							</Abs>
						))}
						<Abs x={0} y={PW - 110} w={PW} style={{opacity: rise(t, 50), display: 'flex', justifyContent: 'center'}}>
							<div style={{...card, borderRadius: 40, padding: '10px 26px', display: 'flex', alignItems: 'center', gap: 12}}>
								<Glyph name="flag" size={40} />
								<div style={label(24)}>Actions de lancement</div>
							</div>
						</Abs>
					</>
				)}
			</>
		);
	};

/** The workshop plan: outline, then four zones, then an order's route. */
export const Floor =
	(mode: 0 | 1 | 2): Stage =>
	({t}) => {
		const Z = [
			{l: 'Accueil', x: 70, y: 430, w: 290, h: 240, c: K.blue, g: 'people'},
			{l: 'Présentation', x: 400, y: 430, w: 290, h: 240, c: K.wood, g: 'star'},
			{l: 'Production', x: 70, y: 90, w: 400, h: 300, c: K.navy, g: 'laser'},
			{l: 'Stockage', x: 510, y: 90, w: 180, h: 300, c: K.grey, g: 'box'},
		];
		const outline = p(t, 0, 36, ease.inOut);
		const len = 2 * (620 + 580);
		const route: [number, number][] = [
			[215, 720],
			[215, 560],
			[270, 250],
			[600, 250],
			[545, 550],
			[545, 720],
		];
		const seg = route.slice(1).map((pt, i) => Math.hypot(pt[0] - route[i][0], pt[1] - route[i][1]));
		const total = seg.reduce((a, b) => a + b, 0);
		const d = p(t, 20, 150, ease.inOut) * total;
		let acc = 0;
		let path = `M ${route[0][0]} ${route[0][1]}`;
		let dot = route[0];
		for (let i = 0; i < seg.length; i++) {
			if (d <= acc) break;
			const k = Math.min(1, (d - acc) / seg[i]);
			dot = [lerp(route[i][0], route[i + 1][0], k), lerp(route[i][1], route[i + 1][1], k)];
			path += ` L ${dot[0]} ${dot[1]}`;
			acc += seg[i];
		}
		return (
			<>
				<svg width={PW} height={PW} style={{position: 'absolute', left: 0, top: 0}}>
					<rect x={60} y={80} width={640} height={600} fill={K.white} opacity={outline} />
					{Z.map((z, i) => {
						const s = mode === 0 ? 0 : mode === 1 ? rise(t, 10 + i * 14) : 1;
						return <rect key={i} x={z.x} y={z.y} width={z.w} height={z.h} rx={16} fill={z.c} opacity={s * (mode === 2 ? 0.28 : 0.9)} />;
					})}
					<path
						d="M 330 680 L 60 680 L 60 80 L 700 80 L 700 680 L 430 680"
						stroke={K.navy}
						strokeWidth={10}
						fill="none"
						strokeDasharray={len}
						strokeDashoffset={len * (1 - outline)}
					/>
					{mode === 0 &&
						Array.from({length: 7}, (_, k) => (
							<line key={k} x1={60 + k * 100} y1={80} x2={60 + k * 100} y2={680} stroke={K.line} strokeWidth={2} strokeDasharray="6 10" opacity={rise(t, 20 + k * 3)} />
						))}
					{mode === 2 && (
						<>
							<path d={path} stroke={K.red} strokeWidth={7} fill="none" strokeDasharray="2 16" strokeLinecap="round" />
							<circle cx={dot[0]} cy={dot[1]} r={16} fill={K.red} />
						</>
					)}
				</svg>
				{mode === 0 && (
					<Abs x={0} y={330} w={PW} style={{opacity: rise(t, 30)}}>
						<div style={{...label(30, K.navySoft, 400), letterSpacing: '0.2em'}}>VOTRE ESPACE</div>
					</Abs>
				)}
				{mode >= 1 &&
					Z.map((z, i) => (
						<Abs key={i} x={z.x} y={z.y + z.h / 2 - 60} w={z.w} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: mode === 1 ? rise(t, 18 + i * 14) : 0.9}}>
							<div style={{...card, width: 76, height: 76, borderRadius: 76, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<Glyph name={z.g} size={46} />
							</div>
							<div style={label(24, mode === 1 && i !== 1 ? K.white : K.navy)}>{z.l}</div>
						</Abs>
					))}
				{mode === 2 && (
					<>
						<Abs x={100} y={694} w={230} style={{opacity: rise(t, 10)}}>
							<div style={{...label(22, K.red), textAlign: 'center'}}>Demande du client</div>
						</Abs>
						<Abs x={430} y={694} w={230} style={{opacity: rise(t, 140)}}>
							<div style={{...label(22, K.red), textAlign: 'center'}}>Produit terminé</div>
						</Abs>
					</>
				)}
			</>
		);
	};

/** Settings screen with moving sliders, plus the four set-up topics. */
export const Settings: Stage = ({t}) => {
	const sl = [
		{l: 'Puissance', v: 0.72, c: K.red},
		{l: 'Vitesse', v: 0.45, c: K.blue},
		{l: 'Passes', v: 0.25, c: K.wood},
	];
	const chips: Item[] = [
		{g: 'wrench', l: 'Installation'},
		{g: 'sliders', l: 'Réglages'},
		{g: 'screen', l: 'Logiciels'},
		{g: 'shield', l: 'Sécurité'},
	];
	return (
		<>
			<Abs x={70} y={60} w={620} h={420} style={{...card, background: K.navy, opacity: rise(t, 0), transform: `translateY(${(1 - rise(t, 0)) * 40}px)`}}>
				<div style={{position: 'absolute', left: 40, top: 30, ...label(20, K.sky), letterSpacing: '0.25em'}}>PARAMÈTRES</div>
				{sl.map((s, i) => {
					const v = lerp(0.1, s.v, p(t, 16 + i * 10, 50 + i * 10, ease.inOut)) + Math.sin(t / 14 + i) * 0.02;
					return (
						<div key={i} style={{position: 'absolute', left: 40, right: 40, top: 100 + i * 100}}>
							<div style={{...label(24, K.white, 400), textAlign: 'left'}}>{s.l}</div>
							<div style={{position: 'relative', height: 10, marginTop: 18, borderRadius: 6, background: '#2A2F6E'}}>
								<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${v * 100}%`, background: s.c, borderRadius: 6}} />
								<div style={{position: 'absolute', left: `calc(${v * 100}% - 15px)`, top: -10, width: 30, height: 30, borderRadius: 30, background: K.white}} />
							</div>
						</div>
					);
				})}
			</Abs>
			<div style={{position: 'absolute', left: 40, right: 40, top: 530, display: 'flex', justifyContent: 'space-between'}}>
				{chips.map((c, i) => (
					<div key={i} style={{...card, width: 156, height: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, transform: `scale(${pop(t, 30 + i * 10)})`}}>
						<Glyph name={c.g} size={64} />
						<div style={label(21)}>{c.l}</div>
					</div>
				))}
			</div>
		</>
	);
};

/** Practice pieces engraved one after another; a mastery bar fills. */
export const Practice: Stage = ({t}) => {
	const pieces = [1, 10, 9];
	const bar = p(t, 20, 150, ease.inOut);
	return (
		<>
			<div style={{position: 'absolute', left: 30, right: 30, top: 120, display: 'flex', justifyContent: 'space-between'}}>
				{pieces.map((i, k) => (
					<div key={k} style={{...card, width: 220, height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(t, 2 + k * 8)})`}}>
						<Product i={i} m={p(t, 20 + k * 40, 56 + k * 40, ease.inOut)} size={190} />
					</div>
				))}
			</div>
			<Abs x={60} y={500} w={640} style={{opacity: rise(t, 10)}}>
				<div style={{...label(26), textAlign: 'left', marginBottom: 20}}>Gestes essentiels</div>
				<div style={{position: 'relative', height: 22, borderRadius: 14, background: K.sand}}>
					<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${bar * 100}%`, borderRadius: 14, background: `linear-gradient(90deg, ${K.blue}, ${K.navy})`}} />
				</div>
				<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14}}>
					{['Découvrir', 'S’exercer', 'Maîtriser'].map((s, k) => (
						<div key={s} style={{...label(22, bar > k * 0.45 ? K.navy : K.grey, 400)}}>{s}</div>
					))}
				</div>
			</Abs>
		</>
	);
};

/** An artboard: visual, crop marks and dimension lines. */
export const Artboard: Stage = ({t}) => {
	const s = lerp(0.7, 1, p(t, 6, 40, ease.inOut));
	const dim = p(t, 36, 64, ease.inOut);
	const W = 420 * s;
	const H = 320 * s;
	const x = 380 - W / 2;
	const y = 340 - H / 2;
	return (
		<>
			<svg width={PW} height={PW} style={{position: 'absolute', left: 0, top: 0}}>
				<rect x={x} y={y} width={W} height={H} fill={K.white} stroke={K.blue} strokeWidth={3} />
				<g transform={`translate(${380 - 102 * 1.9 * s} ${340 - 108 * 1.9 * s}) scale(${1.9 * s})`}>
					<TreeMark color={K.navy} />
				</g>
				{[
					[x, y],
					[x + W, y],
					[x, y + H],
					[x + W, y + H],
				].map(([cx, cy], k) => (
					<rect key={k} x={cx - 9} y={cy - 9} width={18} height={18} fill={K.white} stroke={K.blue} strokeWidth={3} />
				))}
				<g opacity={dim} stroke={K.red} strokeWidth={3}>
					<line x1={x} y1={y + H + 50} x2={x + W * dim} y2={y + H + 50} />
					<line x1={x} y1={y + H + 38} x2={x} y2={y + H + 62} />
					<line x1={x + W} y1={y + H + 38} x2={x + W} y2={y + H + 62} opacity={dim > 0.95 ? 1 : 0} />
					<line x1={x + W + 50} y1={y} x2={x + W + 50} y2={y + H * dim} />
					<line x1={x + W + 38} y1={y} x2={x + W + 62} y2={y} />
					<line x1={x + W + 38} y1={y + H} x2={x + W + 62} y2={y + H} opacity={dim > 0.95 ? 1 : 0} />
				</g>
				<text x={380} y={y + H + 94} textAnchor="middle" fontFamily={SANS} fontSize={26} fontWeight={500} fill={K.red} opacity={dim}>
					120 mm
				</text>
				<text x={x + W + 70} y={340 + 9} fontFamily={SANS} fontSize={26} fontWeight={500} fill={K.red} opacity={dim}>
					80 mm
				</text>
			</svg>
			<Abs x={0} y={650} w={PW} style={{display: 'flex', justifyContent: 'center', gap: 16, opacity: rise(t, 60)}}>
				{['Visuel adapté', 'Dimensions', 'Prêt à produire'].map((c, k) => (
					<div key={c} style={{...label(22, k === 2 ? K.white : K.navy), background: k === 2 ? K.blue : K.white, padding: '10px 20px', borderRadius: 30, boxShadow: '0 8px 20px rgba(0,4,79,0.08)'}}>
						{c}
					</div>
				))}
			</Abs>
		</>
	);
};

/** Choosing a material, then its settings. */
export const Materials: Stage = ({t}) => {
	const mats = [
		{l: 'Bois', c: K.wood},
		{l: 'Métal', c: '#B8BCC8'},
		{l: 'Plexiglas', c: K.sky},
		{l: 'Cuir', c: '#8A5A3A'},
	];
	const sel = Math.min(3, Math.floor(p(t, 20, 110, ease.inOut) * 3.99));
	const pick = [0, 2, 1, 0][sel];
	return (
		<>
			<div style={{position: 'absolute', left: 40, right: 40, top: 70, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18}}>
				{mats.map((m, i) => (
					<div
						key={i}
						style={{
							...card,
							height: 230,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 16,
							transform: `scale(${pop(t, 2 + i * 6) * (i === pick ? 1.06 : 1)})`,
							outline: i === pick ? `5px solid ${K.red}` : 'none',
						}}
					>
						<div style={{width: 100, height: 100, borderRadius: i % 2 ? 50 : 14, background: m.c}} />
						<div style={label(24)}>{m.l}</div>
					</div>
				))}
			</div>
			<Abs x={70} y={380} w={620} h={300} style={{...card, opacity: rise(t, 26)}}>
				<div style={{position: 'absolute', left: 36, top: 28, ...label(22, K.navySoft, 400), letterSpacing: '0.2em'}}>RÉSULTAT RECHERCHÉ</div>
				{['Marquage léger', 'Gravure profonde', 'Découpe nette'].map((s, i) => {
					const on = i === (sel % 3);
					return (
						<div key={s} style={{position: 'absolute', left: 36, right: 36, top: 84 + i * 66, display: 'flex', alignItems: 'center', gap: 20}}>
							<div style={{width: 30, height: 30, borderRadius: 30, border: `3px solid ${K.navy}`, background: on ? K.red : 'transparent'}} />
							<div style={{...label(28, on ? K.navy : K.grey, on ? 500 : 400)}}>{s}</div>
						</div>
					);
				})}
			</Abs>
		</>
	);
};

/** Two branches: act yourself, or call technical support. */
export const Fork: Stage = ({t}) => {
	const d = p(t, 16, 40, ease.inOut);
	return (
		<>
			<svg width={PW} height={PW} style={{position: 'absolute', left: 0, top: 0}}>
				<path d={`M 380 250 V ${lerp(250, 360, d)}`} stroke={K.navy} strokeWidth={5} />
				<path d={`M 380 360 C 380 420 200 400 200 ${lerp(360, 470, d)}`} stroke={K.navy} strokeWidth={5} fill="none" opacity={d} />
				<path d={`M 380 360 C 380 420 560 400 560 ${lerp(360, 470, d)}`} stroke={K.navy} strokeWidth={5} fill="none" opacity={d} />
			</svg>
			<Abs x={380 - 90} y={70} w={180} h={180} style={{...card, borderRadius: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(t, 0)})`}}>
				<Glyph name="question" size={110} />
			</Abs>
			{[
				{x: 200, g: 'wrench', l: 'Intervenir', c: K.blue},
				{x: 560, g: 'headset', l: 'Assistance technique', c: K.red},
			].map((b, i) => (
				<Abs key={i} x={b.x - 130} y={470} w={260} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, transform: `scale(${pop(t, 36 + i * 12)})`}}>
					<div style={{width: 170, height: 170, borderRadius: 170, background: K.white, border: `6px solid ${b.c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 28px rgba(0,4,79,0.10)'}}>
						<Glyph name={b.g} size={100} />
					</div>
					<div style={label(28)}>{b.l}</div>
				</Abs>
			))}
		</>
	);
};

/** A range of products and the personalisation options. */
export const Range: Stage = ({t}) => {
	const prods = [2, 3, 6, 8];
	const chips = ['Prénom', 'Logo', 'Photo', 'Couleur'];
	return (
		<>
			<div style={{position: 'absolute', left: 40, right: 40, top: 60, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18}}>
				{prods.map((i, k) => (
					<div key={k} style={{...card, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(t, 2 + k * 6)})`}}>
						<Product i={i} m={p(t, 50 + k * 14, 80 + k * 14, ease.inOut)} size={150} />
					</div>
				))}
			</div>
			<Abs x={40} y={330} w={680} style={{opacity: rise(t, 20)}}>
				<div style={{...label(22, K.navySoft, 400), textAlign: 'left', letterSpacing: '0.2em'}}>OPTIONS DE PERSONNALISATION</div>
			</Abs>
			<div style={{position: 'absolute', left: 40, right: 40, top: 390, display: 'flex', flexWrap: 'wrap', gap: 16}}>
				{chips.map((c, k) => (
					<div
						key={c}
						style={{
							...label(24, k % 2 ? K.navy : K.white),
							background: k % 2 ? K.white : [K.navy, K.red][k / 2],
							border: `2px solid ${K.navy}`,
							padding: '14px 30px',
							borderRadius: 40,
							transform: `scale(${pop(t, 30 + k * 8)})`,
						}}
					>
						+ {c}
					</div>
				))}
			</div>
			<Abs x={40} y={540} w={680} h={150} style={{...card, background: K.sand, display: 'flex', alignItems: 'center', gap: 24, padding: '0 30px', boxSizing: 'border-box', opacity: rise(t, 70)}}>
				<Glyph name="star" size={80} />
				<div style={{...label(28), textAlign: 'left'}}>Des exemples qui donnent envie</div>
			</Abs>
		</>
	);
};

/** Costs stacking into a price; `margin` adds the margin and the tag. */
export const Costs =
	(margin: boolean): Stage =>
	({t}) => {
		const segs = [
			{l: 'Supports', v: 110, c: K.wood},
			{l: 'Consommables', v: 80, c: K.sky},
			{l: 'Temps de travail', v: 140, c: K.blue},
			{l: 'Charges', v: 90, c: K.navy},
			...(margin ? [{l: 'Marge', v: 120, c: K.red}] : []),
		];
		const base = 690;
		let y = base;
		return (
			<>
				<svg width={PW} height={PW} style={{position: 'absolute', left: 0, top: 0}}>
					<line x1={80} y1={base} x2={680} y2={base} stroke={K.navy} strokeWidth={4} />
				</svg>
				{segs.map((s, i) => {
					const at = margin ? (i < 4 ? 0 : 20) : 6 + i * 16;
					const g = margin && i < 4 ? 1 : p(t, at, at + 22, ease.out);
					const h = s.v * g;
					y -= h;
					return (
						<React.Fragment key={i}>
							<Abs x={130} y={y} w={220} h={h} style={{background: s.c, borderRadius: i === segs.length - 1 ? '14px 14px 0 0' : 0}} />
							<Abs x={380} y={y + h / 2 - 20} w={330} style={{opacity: g, display: 'flex', alignItems: 'center', gap: 14}}>
								<div style={{width: 30, height: 4, background: s.c}} />
								<div style={{...label(26, s.c === K.red ? K.red : K.navy, s.c === K.red ? 500 : 400), textAlign: 'left'}}>{s.l}</div>
							</Abs>
						</React.Fragment>
					);
				})}
				{margin && (
					<Abs x={120} y={60} style={{transform: `scale(${pop(t, 44, 24)}) rotate(-6deg)`, transformOrigin: 'left center'}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 16, background: K.red, color: K.white, padding: '16px 34px 16px 24px', borderRadius: '40px 12px 12px 40px', ...label(32, K.white)}}>
							<div style={{width: 18, height: 18, borderRadius: 18, background: K.paperLight}} />
							Prix de vente
						</div>
					</Abs>
				)}
			</>
		);
	};

/** A phone whose feed fills with photographed creations. */
export const Feed: Stage = ({t}) => {
	const flash = 1 - p(t, 4, 16);
	const prods = [2, 10, 6, 0, 8, 3, 12, 5, 9];
	return (
		<>
			<Abs x={210} y={30} w={340} h={680} style={{background: K.navy, borderRadius: 56, transform: `translateY(${(1 - rise(t, 0)) * 60}px)`}}>
				<div style={{position: 'absolute', left: 16, right: 16, top: 50, bottom: 40, background: K.paperLight, borderRadius: 30, overflow: 'hidden'}}>
					<div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '18px 18px 10px'}}>
						<Eye size={42} />
						<div style={{...label(20), textAlign: 'left'}}>Votre atelier</div>
					</div>
					<div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, padding: 4}}>
						{prods.map((i, k) => (
							<div key={k} style={{aspectRatio: '1', background: [K.sand, K.white, '#E9EEFF'][k % 3], display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: rise(t, 14 + k * 7), transform: `scale(${pop(t, 14 + k * 7)})`}}>
								<Product i={i} m={1} size={80} />
							</div>
						))}
					</div>
				</div>
			</Abs>
			<Abs x={40} y={140} style={{transform: `scale(${pop(t, 0)})`}}>
				<div style={{...card, width: 140, height: 140, borderRadius: 140, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Glyph name="camera" size={86} />
				</div>
			</Abs>
			{[0, 1, 2, 3].map((k) => {
				const age = ((t - 40 + k * 22) % 88) / 88;
				return t > 40 ? (
					<Abs key={k} x={600 + Math.sin(k * 2 + t / 20) * 30} y={560 - age * 420} style={{opacity: (1 - age) * 0.9}}>
						<Glyph name="heart" size={44 + k * 6} />
					</Abs>
				) : null;
			})}
			<div style={{position: 'absolute', inset: 0, background: K.white, opacity: flash * 0.7}} />
		</>
	);
};

/** Shop window and online presence side by side. */
export const WindowOnline: Stage = ({t}) => (
	<div style={{position: 'absolute', left: 40, right: 40, top: 120, display: 'flex', gap: 30}}>
		{[
			{g: 'shop', l: 'Dans votre vitrine'},
			{g: 'phone', l: 'En ligne'},
		].map((it, k) => (
			<div key={k} style={{...card, flex: 1, height: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, transform: `scale(${pop(t, 4 + k * 12)})`}}>
				<div style={{position: 'relative'}}>
					<Glyph name={it.g} size={200} />
					<div style={{position: 'absolute', right: -30, top: -30, transform: `scale(${pop(t, 30 + k * 10)}) rotate(${t * 0.6}deg)`}}>
						<Glyph name="star" size={80} />
					</div>
				</div>
				<div style={label(30)}>{it.l}</div>
			</div>
		))}
	</div>
);

/** Stock levels and a production planning grid. */
export const StockPlan: Stage = ({t}) => {
	const stock = [
		{l: 'Supports', v: 0.8},
		{l: 'Encres', v: 0.55},
		{l: 'Bois', v: 0.18},
		{l: 'Textile', v: 0.66},
	];
	return (
		<>
			<Abs x={40} y={60} w={320} h={640} style={{...card, opacity: rise(t, 0)}}>
				<div style={{position: 'absolute', left: 30, top: 26, ...label(22, K.navySoft, 400), letterSpacing: '0.2em'}}>STOCKS</div>
				{stock.map((s, i) => {
					const v = s.v * p(t, 10 + i * 8, 40 + i * 8, ease.out);
					const low = s.v < 0.3 && t > 50;
					return (
						<div key={i} style={{position: 'absolute', left: 30 + i * 70, bottom: 80, width: 44, height: 420, borderRadius: 10, background: K.paper}}>
							<div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${v * 100}%`, borderRadius: 10, background: low ? K.red : K.blue}} />
							<div style={{position: 'absolute', bottom: -44, left: -20, right: -20, ...label(17, K.navy, 400)}}>{s.l}</div>
							{low && <div style={{position: 'absolute', top: -60, left: 2, width: 40, height: 40, borderRadius: 40, background: K.red, ...label(28, K.white, 700), display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pop(t, 50)})`}}>!</div>}
						</div>
					);
				})}
			</Abs>
			<Abs x={390} y={60} w={330} h={640} style={{...card, opacity: rise(t, 10)}}>
				<div style={{position: 'absolute', left: 30, top: 26, ...label(22, K.navySoft, 400), letterSpacing: '0.2em'}}>PLANNING</div>
				{['L', 'M', 'M', 'J', 'V'].map((d, r) => (
					<div key={r} style={{position: 'absolute', left: 30, right: 30, top: 90 + r * 104, height: 84, display: 'flex', alignItems: 'center', gap: 14}}>
						<div style={{...label(22, K.navySoft), width: 24}}>{d}</div>
						<div style={{flex: 1, position: 'relative', height: 60, background: K.paper, borderRadius: 10}}>
							{[0, 1].map((k) => {
								const s = pop(t, 30 + r * 10 + k * 8);
								const w = [[0.5, 0.3], [0.35, 0.45], [0.7, 0.2], [0.4, 0.4], [0.3, 0.5]][r][k];
								const x = k === 0 ? 0 : [[0.55], [0.4], [0.75], [0.45], [0.35]][r][0];
								return <div key={k} style={{position: 'absolute', left: `${x * 100}%`, width: `${w * 100}%`, top: 8, bottom: 8, borderRadius: 8, background: k ? K.wood : K.navy, transform: `scaleX(${s})`, transformOrigin: 'left'}} />;
							})}
						</div>
					</div>
				))}
			</Abs>
		</>
	);
};

/** Four key indicators, drawn without figures. */
export const Kpis: Stage = ({t}) => {
	const cards = ['Chiffre d’affaires', 'Charges', 'Marges', 'Trésorerie'];
	const d = (i: number) => p(t, 10 + i * 10, 50 + i * 10, ease.inOut);
	const chart = (i: number) => {
		const k = d(i);
		if (i === 0) {
			const pts = [10, 30, 24, 50, 44, 70, 88].map((v, j) => `${20 + j * 40},${150 - v * k}`).join(' ');
			return <polyline points={pts} fill="none" stroke={K.blue} strokeWidth={6} strokeLinejoin="round" />;
		}
		if (i === 1) return [50, 70, 45, 60, 55].map((v, j) => <rect key={j} x={30 + j * 48} y={150 - v * k} width={30} height={v * k} fill={K.wood} />);
		if (i === 2)
			return (
				<>
					<circle cx={150} cy={90} r={56} fill="none" stroke={K.sand} strokeWidth={24} />
					<circle cx={150} cy={90} r={56} fill="none" stroke={K.red} strokeWidth={24} strokeDasharray={`${352 * 0.34 * k} 352`} transform="rotate(-90 150 90)" />
				</>
			);
		const pts = [30, 40, 36, 56, 62, 74, 80].map((v, j) => `${20 + j * 40},${150 - v * k}`).join(' ');
		return <polygon points={`20,150 ${pts} 260,150`} fill={K.navy} opacity={0.85} />;
	};
	return (
		<div style={{position: 'absolute', left: 30, right: 30, top: 50, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
			{cards.map((c, i) => (
				<div key={c} style={{...card, height: 310, padding: '26px 24px', boxSizing: 'border-box', transform: `scale(${pop(t, 2 + i * 6)})`}}>
					<div style={{...label(24), textAlign: 'left'}}>{c}</div>
					<svg width={280} height={170} viewBox="0 0 280 170" style={{marginTop: 30}}>
						{chart(i)}
					</svg>
				</div>
			))}
		</div>
	);
};

/** The brand board: logo, colours, type, the eye. */
export const BrandBoard: Stage = ({t}) => {
	const cols = [K.navy, K.blue, K.paperLight, K.red, K.wood];
	return (
		<>
			<Abs x={40} y={50} w={680} h={200} style={{...card, display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: `inset(0 ${(1 - rise(t, 0, 30)) * 100}% 0 0 round 26px)`}}>
				<Logo width={560} />
			</Abs>
			<div style={{position: 'absolute', left: 40, right: 40, top: 290, display: 'flex', justifyContent: 'space-between'}}>
				{cols.map((c, i) => (
					<div key={i} style={{width: 118, height: 118, borderRadius: 118, background: c, border: c === K.paperLight ? `2px solid ${K.line}` : 'none', transform: `scale(${pop(t, 16 + i * 6)})`}} />
				))}
			</div>
			<Abs x={40} y={450} w={330} h={260} style={{...card, background: K.navy, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 34px', boxSizing: 'border-box', opacity: rise(t, 40)}}>
				<div style={{...label(110, K.white, 500), textAlign: 'left', lineHeight: 1}}>Aa</div>
				<div style={{...label(24, K.sky, 400), textAlign: 'left', marginTop: 10, letterSpacing: '0.2em'}}>JOST · BAUHAUS</div>
			</Abs>
			<Abs x={390} y={450} w={330} h={260} style={{...card, background: K.sand, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: rise(t, 50)}}>
				<Eye size={170} spin={t * 0.8} />
			</Abs>
		</>
	);
};

/** Workshops of the network, all sharing the same identity. */
export const Ateliers: Stage = ({t}) => {
	const pts: [number, number][] = [
		[380, 120],
		[140, 280],
		[620, 280],
		[200, 560],
		[560, 560],
	];
	return (
		<>
			<svg width={PW} height={PW} style={{position: 'absolute', left: 0, top: 0}}>
				{pts.map(([x, y], i) =>
					pts.slice(i + 1).map(([x2, y2], j) => {
						const d = p(t, 20 + (i + j) * 6, 50 + (i + j) * 6, ease.inOut);
						return <line key={`${i}${j}`} x1={x} y1={y} x2={lerp(x, x2, d)} y2={lerp(y, y2, d)} stroke={K.sky} strokeWidth={3} />;
					}),
				)}
			</svg>
			{pts.map(([x, y], i) => (
				<Abs key={i} x={x - 80} y={y - 80} w={160} h={160} style={{...card, borderRadius: 34, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, transform: `scale(${pop(t, 2 + i * 7)})`}}>
					<Glyph name="shop" size={80} />
					<Eye size={36} />
				</Abs>
			))}
			<Abs x={0} y={680} w={PW} style={{opacity: rise(t, 50)}}>
				<div style={{...label(26, K.navySoft, 400), letterSpacing: '0.18em'}}>MÉTHODES & STANDARDS DU RÉSEAU</div>
			</Abs>
		</>
	);
};

/** Countdown to the opening. */
export const Countdown: Stage = ({t}) => {
	const days = ['J-3', 'J-2', 'J-1'];
	const k = Math.floor(t / 26);
	const open = t > 80;
	const swing = Math.sin(t / 8) * 6 * (1 - p(t, 80, 140));
	return (
		<>
			<div style={{position: 'absolute', left: 60, right: 60, top: 80, display: 'flex', justifyContent: 'space-between'}}>
				{days.map((d, i) => (
					<div key={d} style={{...card, width: 190, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', ...label(52, i <= k ? K.white : K.navy), background: i < k ? K.navy : i === k ? K.blue : K.white, transform: `scale(${pop(t, i * 26)})`}}>
						{d}
					</div>
				))}
			</div>
			<svg width={PW} height={PW} style={{position: 'absolute', left: 0, top: 0}}>
				<line x1={300} y1={290} x2={380} y2={360} stroke={K.navy} strokeWidth={4} opacity={p(t, 70, 80)} />
				<line x1={460} y1={290} x2={380} y2={360} stroke={K.navy} strokeWidth={4} opacity={p(t, 70, 80)} />
				<circle cx={380} cy={290} r={10} fill={K.navy} opacity={p(t, 70, 80)} />
			</svg>
			<Abs x={180} y={360} w={400} h={200} style={{transform: `rotate(${swing}deg) scale(${pop(t, 76, 24)})`, transformOrigin: '200px 0'}}>
				<div style={{width: '100%', height: '100%', borderRadius: 30, background: open ? K.red : K.navy, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8}}>
					<div style={{...label(64, K.white, 500)}}>Ouverture</div>
					<Eye size={50} ring={K.white} />
				</div>
			</Abs>
			<Abs x={0} y={620} w={PW} style={{display: 'flex', justifyContent: 'center', gap: 16, opacity: rise(t, 100)}}>
				{['Étapes', 'Priorités', 'Lancement'].map((c, i) => (
					<div key={c} style={{...label(24), background: K.white, padding: '10px 22px', borderRadius: 30, boxShadow: '0 8px 20px rgba(0,4,79,0.08)'}}>
						{i + 1}. {c}
					</div>
				))}
			</Abs>
		</>
	);
};

/** A rising curve with milestones. */
export const Growth: Stage = ({t}) => {
	const d = p(t, 6, 110, ease.inOut);
	const pts: [number, number][] = [
		[70, 620],
		[190, 560],
		[300, 580],
		[420, 460],
		[530, 400],
		[640, 250],
	];
	const miles = [
		{i: 1, l: 'Premiers résultats', g: 'chart'},
		{i: 3, l: 'Ajustements', g: 'sliders'},
		{i: 5, l: 'Nouvelle offre', g: 'grid'},
	];
	const len = pts.slice(1).reduce((a, pt, i) => a + Math.hypot(pt[0] - pts[i][0], pt[1] - pts[i][1]), 0);
	return (
		<>
			<svg width={PW} height={PW} style={{position: 'absolute', left: 0, top: 0}}>
				<line x1={60} y1={680} x2={710} y2={680} stroke={K.navy} strokeWidth={4} />
				<polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={K.blue} strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - d)} />
			</svg>
			{miles.map((m, k) => {
				const [x, y] = pts[m.i];
				const s = pop(t, 20 + (m.i / 5) * 90);
				return (
					<Abs key={k} x={x - 100} y={y - 150} w={200} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transform: `scale(${s})`}}>
						<div style={{...card, width: 80, height: 80, borderRadius: 80, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
							<Glyph name={m.g} size={48} />
						</div>
						<div style={label(22)}>{m.l}</div>
						<div style={{width: 18, height: 18, borderRadius: 18, background: K.red, marginTop: 6}} />
					</Abs>
				);
			})}
		</>
	);
};
