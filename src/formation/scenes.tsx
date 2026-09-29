import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ease, FW, K, lerp, p, SANS} from '../franchise/theme';
import {Blob, bodyStyle, Eye, Fade, Kicker, Logo, Paper, Rise, titleStyle, Tricolour} from '../franchise/ui';
import {INTRO, MODULES, OUTRO, type Module} from './copy';
import {Glyph} from './glyphs';
import {STAGES} from './modules';
import {PW} from './stages';

// ---------------------------------------------------------------------------
// Timing: every beat stays on screen long enough to be read.

const words = (lines: string[]) => lines.join(' ').split(/\s+/).filter(Boolean).length;
export const beatLen = (lines: string[]) => Math.round(30 * Math.max(3.0, words(lines) / 2.8 + 1.0));
export const HEAD = 40; // title settles before the first beat
export const TAIL = 26;

export const moduleBeats = (m: Module) => {
	const starts: number[] = [];
	let t = HEAD;
	for (const b of m.beats) {
		starts.push(t);
		t += beatLen(b);
	}
	return {starts, end: t, len: t + TAIL};
};

const ACCENTS = [K.blue, K.red, K.navy, K.wood];

// ---------------------------------------------------------------------------
// A training module: illustration panel on the left, text on the right.

const PX = 110;
const PY = 170;

export const ModuleScene: React.FC<{i: number}> = ({i}) => {
	const f = useCurrentFrame();
	const m = MODULES[i];
	const {starts, len} = moduleBeats(m);
	const accent = ACCENTS[i % ACCENTS.length];
	const enter = p(f, 0, 24);
	const exit = p(f, len - 18, len, ease.in);
	const current = starts.reduce((a, s, k) => (f >= s ? k : a), -1);
	const panelIn = p(f, 0, 26, ease.out);
	return (
		<AbsoluteFill>
			<Paper />
			<Blob cx={PX - 10} cy={PY + PW - 150} r={130} ry={110} seed={i * 3 + 1} color={accent} at={0} dur={30} opacity={0.9} />
			<div style={{position: 'absolute', inset: 0, opacity: 1 - exit, transform: `translateY(${-exit * 30}px)`}}>
				<div
					style={{
						position: 'absolute',
						left: PX,
						top: PY,
						width: PW,
						height: PW,
						borderRadius: 48,
						background: '#ECE6D9',
						overflow: 'hidden',
						clipPath: `inset(${(1 - panelIn) * 100}% 0 0 0 round 48px)`,
					}}
				>
					{STAGES[i].map((S, k) => {
						const a = starts[k] - (k === 0 ? 14 : 8);
						const b = k + 1 < starts.length ? starts[k + 1] + 4 : len + 10;
						if (f < a || f > b) return null;
						const o = Math.min(p(f, a, a + 14), 1 - p(f, b - 12, b, ease.in));
						return (
							<div key={k} style={{position: 'absolute', inset: 0, opacity: o, transform: `translateY(${(1 - p(f, a, a + 18)) * 30}px)`}}>
								<S t={f - a} />
							</div>
						);
					})}
				</div>
				<div
					style={{
						position: 'absolute',
						left: PX - 40,
						top: PY - 50,
						width: 130,
						height: 130,
						borderRadius: 130,
						background: accent,
						color: K.white,
						fontFamily: SANS,
						fontWeight: 500,
						fontSize: 54,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						transform: `scale(${p(f, 6, 26, ease.back)})`,
						boxShadow: '0 16px 30px rgba(0,4,79,0.18)',
					}}
				>
					{m.n}
				</div>

				<div style={{position: 'absolute', left: 970, top: 160, width: 860, opacity: enter}}>
					<Kicker>
						Module {m.n} / {MODULES.length}
					</Kicker>
					<div style={{height: 20}} />
					<Rise at={4}>
						<div style={titleStyle(K.navy, 60)}>{m.title}</div>
					</Rise>
					<div style={{height: 26}} />
					<Tricolour p={p(f, 12, 36)} width={150} />
					<div style={{height: 40}} />
					<div style={{display: 'flex', flexDirection: 'column', gap: 26}}>
						{m.beats.map((b, k) => {
							const s = starts[k];
							const t = p(f, s, s + 18);
							const on = k === current;
							return (
								<div
									key={k}
									style={{
										position: 'relative',
										paddingLeft: 30,
										opacity: t * (on ? 1 : 0.42),
										transform: `translateY(${(1 - t) * 20}px)`,
									}}
								>
									<div style={{position: 'absolute', left: 0, top: 8, bottom: 8, width: 5, borderRadius: 3, background: on ? K.red : K.line}} />
									{b.map((l, j) => (
										<div key={j} style={{...bodyStyle(K.navy, 30), fontWeight: on ? 400 : 300, lineHeight: 1.36}}>
											{l}
										</div>
									))}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// Intro

/** A Bauhaus workshop assembles, piece by piece. */
const Atelier: React.FC<{f: number}> = ({f}) => {
	const drop = (at: number) => {
		const t = p(f, at, at + 24, ease.back);
		return {transform: `translateY(${(1 - t) * -140}px)`, opacity: p(f, at, at + 8)};
	};
	return (
		<svg width={FW} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
			<rect x={120} y={868} width={800} height={6} fill={K.navy} opacity={p(f, 0, 10)} />
			<g style={drop(4)}>
				<rect x={200} y={470} width={640} height={398} fill={K.navy} />
			</g>
			<g style={drop(14)}>
				{[0, 1, 2, 3].map((k) => (
					<path key={k} d={`M ${200 + k * 160} 470 L ${200 + k * 160} 360 L ${360 + k * 160} 470 Z`} fill={k % 2 ? K.blue : K.red} />
				))}
			</g>
			<g style={drop(26)}>
				<rect x={240} y={500} width={560} height={70} fill={K.paperLight} />
			</g>
			<g style={drop(36)}>
				<path d="M 260 860 V 700 a 100 100 0 0 1 200 0 V 860 Z" fill={K.sky} />
				<line x1={360} y1={600} x2={360} y2={860} stroke={K.navy} strokeWidth={6} />
			</g>
			<g style={drop(44)}>
				<rect x={560} y={640} width={130} height={228} fill={K.wood} />
				<circle cx={670} cy={760} r={7} fill={K.navy} />
			</g>
			<g style={drop(52)}>
				<circle cx={930} cy={330} r={60} fill={K.red} />
			</g>
			<g style={drop(58)}>
				{[0, 1, 2, 3, 4].map((k) => (
					<rect key={k} x={880 + k * 20} y={690} width={8} height={178} fill={K.navy} />
				))}
			</g>
		</svg>
	);
};

export const IntroBuild: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<Paper />
			<Blob cx={1780} cy={120} r={260} ry={200} seed={2} color={K.sand} at={0} />
			<Atelier f={f} />
			<div style={{position: 'absolute', left: 260, top: 510, width: 520, display: 'flex', justifyContent: 'center', opacity: p(f, 34, 50)}}>
				<Logo width={440} />
			</div>
			<div style={{position: 'absolute', left: 1010, top: 380, width: 880}}>
				<Fade at={20}>
					<Kicker>{INTRO.kicker}</Kicker>
				</Fade>
				<div style={{height: 34}} />
				<Rise at={30}>
					<div style={titleStyle(K.navy, 62)}>{INTRO.title[0]}</div>
				</Rise>
				<div style={{height: 10}} />
				<Rise at={70}>
					<div style={{...titleStyle(K.blue, 62), fontWeight: 400}}>{INTRO.title[1]}</div>
				</Rise>
				<div style={{height: 40}} />
				<Tricolour p={p(f, 90, 120)} width={200} />
			</div>
		</AbsoluteFill>
	);
};

export const IntroSkills: React.FC = () => {
	const f = useCurrentFrame();
	const g = ['laser', 'tag', 'megaphone', 'chart'];
	const active = Math.floor((f - 70) / 30);
	return (
		<AbsoluteFill>
			<Paper />
			<div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				{INTRO.skills.lead.map((l, k) => (
					<Rise key={k} at={10 + k * 12}>
						<div style={{...titleStyle(K.navy, 58), fontWeight: 400, textAlign: 'center'}}>{l}</div>
					</Rise>
				))}
			</div>
			<div style={{position: 'absolute', left: 190, right: 190, top: 470, display: 'flex', gap: 40}}>
				{INTRO.skills.words.map((w, k) => {
					const s = p(f, 40 + k * 10, 62 + k * 10, ease.back);
					const on = k === active;
					return (
						<div
							key={w}
							style={{
								flex: 1,
								height: 400,
								borderRadius: k % 2 ? '200px 200px 24px 24px' : 24,
								background: on ? K.navy : K.white,
								boxShadow: '0 16px 40px rgba(0,4,79,0.09)',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 34,
								transform: `scale(${s}) translateY(${on ? -14 : 0}px)`,
							}}
						>
							<div style={{width: 170, height: 170, borderRadius: 170, background: on ? K.paperLight : K.paper, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<Glyph name={g[k]} size={110} />
							</div>
							<div style={{fontFamily: SANS, fontSize: 38, fontWeight: 500, color: on ? K.white : K.navy}}>{w}</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

/** The 13 modules laid out as one path. */
export const IntroProgram: React.FC = () => {
	const f = useCurrentFrame();
	const n = MODULES.length;
	const row = (k: number) => (k < 7 ? 0 : 1);
	const pos = (k: number): [number, number] => (k < 7 ? [190 + k * 256, 500] : [190 + (12 - k) * 256 + 128, 810]);
	const pts = MODULES.map((_, k) => pos(k));
	const d = `M ${pts[0][0]} ${pts[0][1]} ` + pts.slice(1).map(([x, y], k) => (row(k + 1) !== row(k) ? `C 1900 ${pts[k][1]} 1900 ${y} ${x} ${y}` : `L ${x} ${y}`)).join(' ');
	const draw = p(f, 40, 40 + n * 12, ease.inOut);
	return (
		<AbsoluteFill>
			<Paper />
			<div style={{position: 'absolute', left: 150, top: 150}}>
				<Rise at={8}>
					<div style={titleStyle(K.navy, 60)}>{INTRO.program[0]}</div>
				</Rise>
				<Rise at={18}>
					<div style={{...titleStyle(K.blue, 60), fontWeight: 400}}>{INTRO.program[1]}</div>
				</Rise>
			</div>
			<svg width={FW} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<path d={d} fill="none" stroke={K.line} strokeWidth={6} pathLength={1} strokeDasharray={`${draw} 1`} />
			</svg>
			{MODULES.map((m, k) => {
				const [x, y] = pos(k);
				const s = p(f, 44 + k * 12, 64 + k * 12, ease.back);
				return (
					<div key={m.n} style={{position: 'absolute', left: x - 110, top: y - 38, width: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, transform: `scale(${s})`}}>
						<div
							style={{
								width: 76,
								height: 76,
								borderRadius: 76,
								background: ACCENTS[k % ACCENTS.length],
								color: K.white,
								fontFamily: SANS,
								fontWeight: 500,
								fontSize: 30,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							{m.n}
						</div>
						<div style={{...bodyStyle(K.navy, 21), fontWeight: 400, lineHeight: 1.2, textAlign: 'center'}}>{m.title}</div>
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// Outro

export const OutroPillars: React.FC = () => {
	const f = useCurrentFrame();
	const g = ['laser', 'star', 'gauge'];
	return (
		<AbsoluteFill>
			<Paper />
			<div style={{position: 'absolute', left: 120, right: 120, top: 300, display: 'flex', gap: 40}}>
				{OUTRO.pillars.map((t, k) => {
					const at = 10 + k * 26;
					const s = p(f, at, at + 26, ease.back);
					return (
						<div key={t} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50}}>
							<div
								style={{
									width: 340,
									height: 340,
									borderRadius: k === 1 ? 40 : 340,
									background: [K.navy, K.sand, K.blue][k],
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									transform: `scale(${s}) rotate(${(1 - s) * -30}deg)`,
								}}
							>
								<div style={{width: 210, height: 210, borderRadius: 210, background: K.paperLight, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<Glyph name={g[k]} size={130} />
								</div>
							</div>
							<Rise at={at + 14}>
								<div style={{...titleStyle(K.navy, 44), textAlign: 'center', whiteSpace: 'nowrap'}}>{t}</div>
							</Rise>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

export const OutroBrand: React.FC = () => {
	const f = useCurrentFrame();
	const logo = p(f, 14, 50);
	return (
		<AbsoluteFill style={{background: K.navy}}>
			<Blob cx={1720} cy={130} r={300} ry={230} seed={6} color={K.navySoft} at={0} dur={50} />
			<Blob cx={170} cy={970} r={260} ry={200} seed={12} color={K.blue} at={6} dur={50} />
			<Blob cx={1760} cy={990} r={110} seed={14} color={K.red} at={16} dur={40} />
			<div style={{position: 'absolute', left: 0, right: 0, top: 230, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<div style={{transform: `scale(${p(f, 0, 30, ease.back)})`}}>
					<Eye size={110} ring={K.white} spin={lerp(-120, 0, p(f, 0, 40))} />
				</div>
				<div style={{height: 50}} />
				<div style={{clipPath: `inset(-10% ${(1 - logo) * 100}% -10% 0)`}}>
					<Logo width={960} white />
				</div>
				<div style={{height: 50}} />
				<Tricolour p={p(f, 50, 90)} width={240} />
				<div style={{height: 60}} />
				{OUTRO.lines.map((l, k) => (
					<Rise key={l} at={70 + k * 22}>
						<div style={{...titleStyle(k === 0 ? K.white : K.sky, 50), fontWeight: k === 0 ? 500 : 300, textAlign: 'center', lineHeight: 1.3}}>{l}</div>
					</Rise>
				))}
			</div>
		</AbsoluteFill>
	);
};
