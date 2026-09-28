import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {COPY} from '../copy';
import {ease, FW, K, lerp, p, SANS} from '../theme';
import {Blob, bodyStyle, Eye, Fade, Kicker, Logo, Paper, Rise, titleStyle, Tricolour, Window} from '../ui';

/** 1 — Bauhaus shapes gather into the logo's eye, then the logo. */
export const Intro: React.FC = () => {
	const f = useCurrentFrame();
	const eye = p(f, 40, 80, ease.back);
	const slide = p(f, 88, 124, ease.inOut);
	const logo = p(f, 96, 134, ease.out);
	const drift = (k: number) => Math.sin(f / 50 + k) * 10;
	const shape = (at: number) => p(f, at, at + 34, ease.out);
	return (
		<AbsoluteFill>
			<Paper />
			<Blob cx={1720} cy={120} r={330} ry={260} seed={3} color={K.navy} at={0} dur={40} />
			<Blob cx={140} cy={980} r={260} ry={200} seed={8} color={K.blue} at={8} dur={40} />
			<Blob cx={1780} cy={1010} r={170} seed={5} color={K.sand} at={16} dur={40} />
			<svg width={FW} height={1080} style={{position: 'absolute'}}>
				{/* red half disc */}
				<path
					d={`M ${260 - 90} ${210 + drift(1)} a 90 90 0 0 1 180 0 z`}
					fill={K.red}
					transform={`rotate(${lerp(-90, 0, shape(10))} 260 210)`}
					opacity={shape(10)}
				/>
				{/* wood disc */}
				<circle cx={1540} cy={820 + drift(2)} r={78 * shape(18)} fill={K.wood} />
				{/* stripes */}
				{[0, 1, 2, 3, 4].map((k) => (
					<rect key={k} x={1440 + k * 22} y={700} width={10} height={170 * p(f, 22 + k * 3, 52 + k * 3)} fill={K.navy} />
				))}
				{/* thin circle */}
				<circle cx={430} cy={760} r={120} fill="none" stroke={K.navy} strokeWidth={2} strokeDasharray={754} strokeDashoffset={754 * (1 - shape(20))} />
			</svg>

			{/* eye → logo */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center'}}>
				<div style={{position: 'relative', width: 1100, height: 127}}>
					<div
						style={{
							position: 'absolute',
							left: lerp(550 - 80, 330, slide),
							top: lerp(-20, 33, slide),
							opacity: 1 - logo,
							transform: `scale(${eye * lerp(1, 0.45, slide)})`,
							transformOrigin: 'center',
						}}
					>
						<Eye size={160} spin={lerp(-200, 0, eye)} />
					</div>
					<div style={{clipPath: `inset(-10% ${(1 - logo) * 100}% -10% 0)`}}>
						<Logo width={1100} />
					</div>
				</div>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 290, display: 'flex', justifyContent: 'center'}}>
				<Fade at={120}>
					<Kicker color={K.navySoft}>{COPY.intro.kicker}</Kicker>
				</Fade>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
				<Tricolour p={p(f, 130, 170)} width={240} />
				<Rise at={144}>
					<div style={{...titleStyle(K.navy, 56), fontWeight: 400}}>{COPY.intro.tagline}</div>
				</Rise>
			</div>
		</AbsoluteFill>
	);
};

/** 2 — The concept, over the walk-through of the mall. */
export const Concept: React.FC = () => {
	const f = useCurrentFrame();
	const c = COPY.concept;
	const verbAt = (k: number) => 150 + k * 34;
	const active = Math.max(0, Math.min(c.verbs.length - 1, Math.floor((f - 150) / 34)));
	return (
		<AbsoluteFill>
			<Paper />
			<Blob cx={430} cy={560} r={390} ry={440} seed={11} color={K.blue} at={6} dur={40} wobble={0.1} />
			<Window x={150} y={120} w={560} h={750} at={14} radius={280}>
				<OffthreadVideo src={staticFile('franchise/visite-galerie.mp4')} muted playbackRate={1.5} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</Window>
			<div style={{position: 'absolute', left: 860, top: 250, width: 960}}>
				<Fade at={20}>
					<Kicker>01 — {COPY.chapters[0]}</Kicker>
				</Fade>
				<div style={{height: 34}} />
				<Rise at={30}>
					<div style={titleStyle()}>{c.title[0]}</div>
				</Rise>
				<Rise at={40}>
					<div style={titleStyle()}>{c.title[1]}</div>
				</Rise>
				<div style={{height: 36}} />
				<Fade at={70}>
					<div style={{...bodyStyle(), width: 860}}>{c.body}</div>
				</Fade>
				<div style={{height: 70}} />
				<div style={{display: 'flex', gap: 28, alignItems: 'baseline', flexWrap: 'wrap'}}>
					{c.verbs.map((v, k) => {
						const t = p(f, verbAt(k), verbAt(k) + 16);
						const on = k === active && f >= verbAt(0);
						return (
							<div key={v} style={{position: 'relative', opacity: t, transform: `translateY(${(1 - t) * 20}px)`}}>
								<div
									style={{
										fontFamily: SANS,
										fontWeight: on ? 500 : 400,
										fontSize: 38,
										letterSpacing: '0.02em',
										color: on ? K.navy : K.grey,
									}}
								>
									{v}
								</div>
								<div style={{position: 'absolute', left: 0, right: 0, bottom: -12, height: 4, background: K.red, transform: `scaleX(${on ? 1 : 0})`, transformOrigin: 'left'}} />
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};

const Glyph: React.FC<{k: number; t: number}> = ({k, t}) => (
	<svg viewBox="0 0 160 160" width={160} height={160}>
		{k === 0 && (
			<>
				<circle cx={80} cy={80} r={70 * t} fill={K.blue} />
				<circle cx={80} cy={80} r={28 * t} fill={K.paperLight} />
			</>
		)}
		{k === 1 && (
			<>
				<rect x={20} y={20} width={120 * t} height={120} fill={K.navy} />
				<line x1={80} y1={20} x2={80} y2={20 + 120 * t} stroke={K.red} strokeWidth={6} />
				<circle cx={80} cy={20 + 120 * t} r={10} fill={K.red} opacity={t} />
			</>
		)}
		{k === 2 && (
			<>
				<path d={`M 10 150 L 80 ${150 - 130 * t} L 150 150 Z`} fill={K.red} />
				<rect x={60} y={110} width={40} height={40} fill={K.wood} opacity={t} />
			</>
		)}
	</svg>
);

/** 3 — Three spaces. */
export const Pillars: React.FC = () => {
	const f = useCurrentFrame();
	const c = COPY.pillars;
	return (
		<AbsoluteFill>
			<Paper />
			<div style={{position: 'absolute', left: 160, top: 170}}>
				<Rise at={14}>
					<div style={titleStyle(K.navy, 72)}>{c.title}</div>
				</Rise>
				<div style={{height: 26}} />
				<Tricolour p={p(f, 30, 60)} width={180} />
			</div>
			<div style={{position: 'absolute', left: 160, right: 160, top: 400, display: 'flex', gap: 48}}>
				{c.items.map((it, k) => {
					const at = 40 + k * 22;
					const t = p(f, at, at + 30);
					return (
						<div
							key={it.n}
							style={{
								flex: 1,
								height: 520,
								background: K.paperLight,
								borderRadius: k === 1 ? 0 : k === 0 ? '240px 240px 12px 12px' : '12px 120px 12px 12px',
								padding: '56px 48px',
								boxSizing: 'border-box',
								opacity: t,
								transform: `translateY(${(1 - t) * 80}px)`,
								boxShadow: '0 20px 50px rgba(0,4,79,0.08)',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
							}}
						>
							<Glyph k={k} t={p(f, at + 14, at + 44)} />
							<div style={{flex: 1}} />
							<div style={{fontFamily: SANS, fontWeight: 500, fontSize: 22, letterSpacing: '0.3em', color: K.red}}>{it.n}</div>
							<div style={{...titleStyle(K.navy, 48), marginTop: 10}}>{it.t}</div>
							<div style={{...bodyStyle(K.navySoft, 25), marginTop: 16}}>{it.d}</div>
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
