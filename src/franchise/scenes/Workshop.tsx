import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COPY} from '../copy';
import {MiniIcon, TreeMark} from '../icons';
import {clamp01, ease, K, lerp, p, SANS} from '../theme';
import {bodyStyle, Fade, Kicker, Paper, Rise, titleStyle, Tricolour} from '../ui';

// Machine, seen from above (screen px).
const M = {x: 110, y: 150, w: 920, h: 800};
const PLATE = {x: 300, y: 300, w: 540, h: 500};
const DESIGN = {x: 370, y: 350, w: 400, h: 400}; // raster area
const CUT = {cx: 570, cy: 550, r: 215};
const RASTER = [40, 290] as const;
const CUTTING = [300, 400] as const;

const headAt = (f: number): [number, number, boolean] => {
	if (f < RASTER[0]) return [lerp(M.x + 120, DESIGN.x, p(f, 0, RASTER[0])), lerp(M.y + 120, DESIGN.y, p(f, 0, RASTER[0])), false];
	if (f < RASTER[1]) {
		const t = (f - RASTER[0]) / (RASTER[1] - RASTER[0]);
		const period = 10;
		const ph = ((f - RASTER[0]) % period) / period;
		const tri = ph < 0.5 ? ph * 2 : 2 - ph * 2;
		return [DESIGN.x + tri * DESIGN.w, DESIGN.y + t * DESIGN.h, true];
	}
	if (f < CUTTING[0]) {
		const t = p(f, RASTER[1], CUTTING[0]);
		return [lerp(DESIGN.x + DESIGN.w / 2, CUT.cx + CUT.r, t), lerp(DESIGN.y + DESIGN.h, CUT.cy, t), false];
	}
	if (f < CUTTING[1]) {
		const a = ((f - CUTTING[0]) / (CUTTING[1] - CUTTING[0])) * Math.PI * 2;
		return [CUT.cx + Math.cos(a) * CUT.r, CUT.cy + Math.sin(a) * CUT.r, true];
	}
	const t = p(f, CUTTING[1], CUTTING[1] + 30);
	return [lerp(CUT.cx + CUT.r, M.x + M.w - 140, t), lerp(CUT.cy, M.y + 120, t), false];
};

const Machine: React.FC<{f: number}> = ({f}) => {
	const build = p(f, 4, 34);
	const [hx, hy, firing] = headAt(f);
	const rasterY = DESIGN.y + clamp01((f - RASTER[0]) / (RASTER[1] - RASTER[0])) * DESIGN.h;
	const cut = clamp01((f - CUTTING[0]) / (CUTTING[1] - CUTTING[0]));
	const lift = p(f, CUTTING[1] + 10, CUTTING[1] + 50, ease.back);
	const circ = 2 * Math.PI * CUT.r;
	const smoke = firing
		? Array.from({length: 8}, (_, k) => {
				const age = ((f + k * 5) % 40) / 40;
				return {x: hx + Math.sin(k * 2.3 + f / 9) * 18 * age, y: hy - age * 70, r: 6 + age * 16, o: (1 - age) * 0.25};
			})
		: [];
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: build}}>
			<defs>
				<clipPath id="raster">
					<rect x={DESIGN.x - 10} y={DESIGN.y - 10} width={DESIGN.w + 20} height={rasterY - DESIGN.y + 10} />
				</clipPath>
				<radialGradient id="laserGlow">
					<stop offset="0%" stopColor="#FFFFFF" />
					<stop offset="30%" stopColor={K.red} stopOpacity={0.9} />
					<stop offset="100%" stopColor={K.red} stopOpacity={0} />
				</radialGradient>
			</defs>
			{/* frame */}
			<rect x={M.x} y={M.y} width={M.w} height={M.h} rx={28} fill={K.navy} />
			<rect x={M.x + 44} y={M.y + 44} width={M.w - 88} height={M.h - 88} rx={10} fill="#2A2F6E" />
			{/* honeycomb bed */}
			{Array.from({length: 18}, (_, k) => (
				<line key={k} x1={M.x + 60 + k * 46} y1={M.y + 60} x2={M.x + 60 + k * 46} y2={M.y + M.h - 60} stroke="#3A3F7E" strokeWidth={2} />
			))}
			{/* wood plate */}
			<rect x={PLATE.x} y={PLATE.y} width={PLATE.w} height={PLATE.h} fill={K.wood} />
			{Array.from({length: 11}, (_, k) => (
				<path
					key={k}
					d={`M ${PLATE.x} ${PLATE.y + 20 + k * 46} q ${PLATE.w / 2} ${k % 2 ? 14 : -14} ${PLATE.w} 0`}
					stroke={K.woodDark}
					strokeWidth={1.5}
					opacity={0.35}
					fill="none"
				/>
			))}
			{/* the disc once cut, lifted */}
			<g transform={`translate(${CUT.cx} ${CUT.cy}) scale(${1 + lift * 0.06}) translate(${-CUT.cx} ${-CUT.cy - lift * 16})`}>
				{lift > 0 && <circle cx={CUT.cx} cy={CUT.cy + 16} r={CUT.r} fill="#000" opacity={0.25 * lift} />}
				{lift > 0 && <circle cx={CUT.cx} cy={CUT.cy} r={CUT.r} fill={K.wood} />}
				{/* engraving */}
				<g clipPath="url(#raster)">
					<g transform={`translate(${DESIGN.x} ${DESIGN.y - 20}) scale(2)`}>
						<TreeMark color={K.woodDeep} />
					</g>
					<text x={CUT.cx} y={DESIGN.y + 350} textAnchor="middle" fontFamily={SANS} fontSize={26} fontWeight={500} letterSpacing={8} fill={K.woodDeep}>
						LÉA &amp; MAX
					</text>
				</g>
				{/* cut line */}
				<circle
					cx={CUT.cx}
					cy={CUT.cy}
					r={CUT.r}
					fill="none"
					stroke={K.woodDeep}
					strokeWidth={4}
					strokeDasharray={`${circ * cut} ${circ}`}
					transform={`rotate(0 ${CUT.cx} ${CUT.cy})`}
				/>
			</g>
			{/* smoke */}
			{smoke.map((s, k) => (
				<circle key={k} cx={s.x} cy={s.y} r={s.r} fill="#FFFFFF" opacity={s.o} />
			))}
			{/* gantry + head */}
			<rect x={M.x + 10} y={hy - 22} width={M.w - 20} height={44} rx={8} fill="#11165C" />
			<rect x={M.x + 10} y={hy - 22} width={M.w - 20} height={8} rx={4} fill="#3A3F8E" />
			<rect x={hx - 40} y={hy - 46} width={80} height={80} rx={10} fill={K.paperLight} />
			<rect x={hx - 40} y={hy - 46} width={80} height={16} rx={6} fill={K.line} />
			<circle cx={hx} cy={hy} r={12} fill={K.navy} />
			{firing && (
				<>
					<circle cx={hx} cy={hy} r={36} fill="url(#laserGlow)" opacity={0.8 + 0.2 * Math.sin(f)} />
					<circle cx={hx} cy={hy} r={5} fill="#FFFFFF" />
				</>
			)}
		</svg>
	);
};

export const Workshop: React.FC = () => {
	const f = useCurrentFrame();
	const c = COPY.workshop;
	const kinds = ['laser', 'uv', 'textile', 'finish'] as const;
	const blink = Math.floor(f / 15) % 2 === 0;
	return (
		<AbsoluteFill>
			<Paper />
			<Machine f={f} />
			<Fade at={30} style={{position: 'absolute', left: 150, top: 176}}>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						background: K.red,
						color: K.white,
						padding: '8px 18px',
						borderRadius: 30,
						fontFamily: SANS,
						fontWeight: 500,
						fontSize: 20,
						letterSpacing: '0.25em',
					}}
				>
					<div style={{width: 12, height: 12, borderRadius: 12, background: K.white, opacity: blink ? 1 : 0.3}} />
					{c.live}
				</div>
			</Fade>
			<div style={{position: 'absolute', left: 1130, top: 170, width: 720}}>
				<Fade at={14}>
					<Kicker>06 — {COPY.chapters[5]}</Kicker>
				</Fade>
				<div style={{height: 28}} />
				<Rise at={22}>
					<div style={titleStyle(K.navy, 66)}>{c.title[0]}</div>
				</Rise>
				<Rise at={30}>
					<div style={titleStyle(K.navy, 66)}>{c.title[1]}</div>
				</Rise>
				<div style={{height: 50}} />
				<div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
					{c.techniques.map((t, k) => (
						<Fade key={t} at={70 + k * 26} y={0} style={{display: 'flex', alignItems: 'center', gap: 24}}>
							<div style={{width: 64, height: 64, borderRadius: 64, background: K.paperLight, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<MiniIcon kind={kinds[k]} size={38} />
							</div>
							<div style={{fontFamily: SANS, fontSize: 32, fontWeight: 400, color: K.navy}}>{t}</div>
						</Fade>
					))}
				</div>
				<div style={{height: 44}} />
				<Fade at={190}>
					<div style={bodyStyle(K.navySoft, 24)}>{c.materials}</div>
				</Fade>
				<div style={{height: 40}} />
				<Fade at={230}>
					<Tricolour p={p(f, 230, 260)} width={140} />
					<div style={{height: 18}} />
					<div style={{fontFamily: SANS, fontSize: 30, fontWeight: 500, letterSpacing: '0.04em', color: K.navy}}>{c.brand}</div>
				</Fade>
			</div>
		</AbsoluteFill>
	);
};
