import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {clamp01, ease, FW, K, lerp, p, SANS} from './theme';

export const LOGO = {
	navy: {src: staticFile('brand/vision-urbaine-logo.png'), w: 1940, h: 223},
	white: {src: staticFile('brand/vision-urbaine-logo-white.png'), w: 1940, h: 223},
};

export const Logo: React.FC<{width: number; white?: boolean; style?: React.CSSProperties}> = ({width, white, style}) => {
	const l = white ? LOGO.white : LOGO.navy;
	return <Img src={l.src} style={{display: 'block', width, height: (width * l.h) / l.w, ...style}} />;
};

export const Paper: React.FC<{color?: string}> = ({color = K.paper}) => <AbsoluteFill style={{background: color}} />;

/** Text line that rises out of a mask. */
export const Rise: React.FC<{
	at: number;
	dur?: number;
	out?: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({at, dur = 22, out, children, style}) => {
	const f = useCurrentFrame();
	const t = p(f, at, at + dur, ease.out);
	const o = out === undefined ? 0 : p(f, out, out + 14, ease.in);
	return (
		<div style={{overflow: 'hidden', paddingBottom: '0.08em', ...style}}>
			<div style={{transform: `translateY(${(1 - t) * 110 - o * 110}%)`, opacity: t}}>{children}</div>
		</div>
	);
};

/** Simple fade + lift. */
export const Fade: React.FC<{at: number; dur?: number; y?: number; out?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
	at,
	dur = 18,
	y = 24,
	out,
	children,
	style,
}) => {
	const f = useCurrentFrame();
	const t = p(f, at, at + dur);
	const o = out === undefined ? 0 : p(f, out, out + 12, ease.in);
	return <div style={{opacity: t * (1 - o), transform: `translateY(${(1 - t) * y}px)`, ...style}}>{children}</div>;
};

export const Tricolour: React.FC<{p: number; width: number; height?: number; style?: React.CSSProperties}> = ({p: t, width, height = 6, style}) => {
	const seg = (k: number) => clamp01(t * 3 - k);
	return (
		<div style={{display: 'flex', gap: height, width, height, ...style}}>
			{[K.navy, K.paperLight, K.red].map((c, k) => (
				<div key={k} style={{flex: 1, position: 'relative'}}>
					<div
						style={{
							position: 'absolute',
							inset: 0,
							background: c,
							boxShadow: c === K.paperLight ? `inset 0 0 0 1.5px ${K.line}` : undefined,
							transform: `scaleX(${seg(k)})`,
							transformOrigin: 'left',
						}}
					/>
				</div>
			))}
		</div>
	);
};

export const Kicker: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = K.red, style}) => (
	<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 22, letterSpacing: '0.32em', textTransform: 'uppercase', color, ...style}}>{children}</div>
);

export const titleStyle = (color: string = K.navy, size = 84): React.CSSProperties => ({
	fontFamily: SANS,
	fontWeight: 500,
	fontSize: size,
	lineHeight: 1.04,
	letterSpacing: '-0.015em',
	color,
});

export const bodyStyle = (color: string = K.navySoft, size = 30): React.CSSProperties => ({
	fontFamily: SANS,
	fontWeight: 300,
	fontSize: size,
	lineHeight: 1.45,
	color,
});

// ---------------------------------------------------------------------------
// Organic "blob" shapes, after the showroom wall panels.

const rand = (seed: number) => {
	const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};

/** Smooth closed blob, radius rx × ry, gently morphing with `t` (radians). */
export const blobPath = (cx: number, cy: number, rx: number, ry: number, seed: number, wobble = 0.12, t = 0, n = 7) => {
	const pts = Array.from({length: n}, (_, i) => {
		const a = (i / n) * Math.PI * 2 + rand(seed) * 6.28;
		const k = 1 + wobble * (rand(seed + i * 3.1) * 2 - 1) + wobble * 0.5 * Math.sin(t + i * 1.7 + seed);
		return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k] as const;
	});
	let d = `M ${pts[0][0]} ${pts[0][1]}`;
	for (let i = 0; i < n; i++) {
		const p0 = pts[(i - 1 + n) % n];
		const p1 = pts[i];
		const p2 = pts[(i + 1) % n];
		const p3 = pts[(i + 2) % n];
		const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
		const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
		d += ` C ${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
	}
	return d + ' Z';
};

/** A blob that grows from nothing and breathes. Absolute, in 1920×1080 space. */
export const Blob: React.FC<{
	cx: number;
	cy: number;
	r: number;
	ry?: number;
	seed: number;
	color: string;
	at: number;
	dur?: number;
	wobble?: number;
	opacity?: number;
}> = ({cx, cy, r, ry, seed, color, at, dur = 30, wobble = 0.14, opacity = 1}) => {
	const f = useCurrentFrame();
	const s = p(f, at, at + dur, ease.out);
	if (s <= 0) return null;
	return (
		<svg width={FW} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
			<path d={blobPath(cx, cy, r * s, (ry ?? r) * s, seed, wobble, f / 40)} fill={color} opacity={opacity} />
		</svg>
	);
};

/** Rounded "pill" window (like the showroom's arched mirrors) holding a photo or video. */
export const Window: React.FC<{
	x: number;
	y: number;
	w: number;
	h: number;
	at: number;
	radius?: number;
	children: React.ReactNode;
	from?: 'bottom' | 'left' | 'right';
	shadow?: boolean;
}> = ({x, y, w, h, at, radius = 48, children, from = 'bottom', shadow = true}) => {
	const f = useCurrentFrame();
	const t = p(f, at, at + 34, ease.out);
	const clip =
		from === 'bottom'
			? `inset(${(1 - t) * 100}% 0 0 0 round ${radius}px)`
			: from === 'left'
				? `inset(0 ${(1 - t) * 100}% 0 0 round ${radius}px)`
				: `inset(0 0 0 ${(1 - t) * 100}% round ${radius}px)`;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: w,
				height: h,
				filter: shadow ? 'drop-shadow(0 30px 40px rgba(0,4,79,0.18))' : undefined,
			}}
		>
			<div style={{position: 'absolute', inset: 0, clipPath: clip, overflow: 'hidden', borderRadius: radius}}>{children}</div>
		</div>
	);
};

/** Slow Ken Burns on a still. */
export const KenBurns: React.FC<{src: string; from?: number; to?: number; ox?: number; oy?: number; dx?: number; dy?: number; dur: number; start?: number}> = ({
	src,
	from = 1.06,
	to = 1.16,
	ox = 50,
	oy = 50,
	dx = 0,
	dy = 0,
	dur,
	start = 0,
}) => {
	const f = useCurrentFrame();
	const t = p(f, start, start + dur, ease.soft);
	return (
		<Img
			src={src}
			style={{
				width: '100%',
				height: '100%',
				objectFit: 'cover',
				objectPosition: `${ox}% ${oy}%`,
				transform: `scale(${lerp(from, to, t)}) translate(${dx * t}%, ${dy * t}%)`,
			}}
		/>
	);
};

/** The logo's "eye": navy ring, blue pupil, red sector. */
export const Eye: React.FC<{size: number; spin?: number; style?: React.CSSProperties; ring?: string}> = ({size, spin = 0, style, ring = K.navy}) => {
	const r = 50;
	const a0 = (-62 * Math.PI) / 180;
	const a1 = (-12 * Math.PI) / 180;
	const arc = (rr: number, a: number) => [50 + Math.cos(a) * rr, 50 + Math.sin(a) * rr];
	const [x0, y0] = arc(r, a0);
	const [x1, y1] = arc(r, a1);
	const [x2, y2] = arc(29, a1);
	const [x3, y3] = arc(29, a0);
	return (
		<svg viewBox="0 0 100 100" width={size} height={size} style={style}>
			<g transform={`rotate(${spin} 50 50)`}>
				<circle cx={50} cy={50} r={r} fill={ring} />
				<path d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A 29 29 0 0 0 ${x3} ${y3} Z`} fill={K.red} />
				<line x1={50 + Math.cos(a0) * 26} y1={50 + Math.sin(a0) * 26} x2={50 + Math.cos(a0) * 52} y2={50 + Math.sin(a0) * 52} stroke={K.white} strokeWidth={4} />
				<circle cx={50} cy={50} r={29} fill={ring} />
				<circle cx={46} cy={54} r={21} fill={K.white} />
				<circle cx={46} cy={54} r={15.5} fill={K.blue} />
			</g>
		</svg>
	);
};

/** Numbered disc used for zones and steps. */
export const Num: React.FC<{n: string | number; size?: number; bg?: string; fg?: string; s?: number}> = ({n, size = 44, bg = K.navy, fg = K.white, s = 1}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: size,
			background: bg,
			color: fg,
			fontFamily: SANS,
			fontWeight: 500,
			fontSize: size * 0.44,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			transform: `scale(${s})`,
			flexShrink: 0,
		}}
	>
		{n}
	</div>
);
