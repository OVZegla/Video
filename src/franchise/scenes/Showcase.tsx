import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {COPY} from '../copy';
import {Product} from '../icons';
import {clamp01, ease, FW, K, lerp, p, SANS} from '../theme';
import {bodyStyle, Eye, Fade, KenBurns, Kicker, Logo, Num, Paper, Rise, titleStyle, Tricolour, Window} from '../ui';

// ---------------------------------------------------------------------------
// 4 — From a phone case to a whole interior: a track of objects, growing.

const N = COPY.possible.items.length;
const SIZE = (i: number) => 150 * Math.pow(460 / 150, i / (N - 1));
const GAP = 90;
const XS = (() => {
	const xs: number[] = [];
	let x = 0;
	for (let i = 0; i < N; i++) {
		xs.push(x);
		x += SIZE(i) + GAP;
	}
	return xs;
})();
const TRACK = XS[N - 1] + SIZE(N - 1);
const BASE = 790;

export const Possible: React.FC = () => {
	const f = useCurrentFrame();
	const c = COPY.possible;
	const pan = lerp(-180, TRACK - FW + 180, p(f, 50, 370, ease.inOut));
	const small = 1 - p(f, 200, 220, ease.in);
	const big = p(f, 250, 280);
	return (
		<AbsoluteFill>
			<Paper />
			<div style={{position: 'absolute', left: 160, top: 150, opacity: small}}>
				<Fade at={10}>
					<Kicker>02 — {COPY.chapters[1]}</Kicker>
				</Fade>
				<div style={{height: 26}} />
				<Rise at={18}>
					<div style={titleStyle(K.navy, 96)}>{c.small}</div>
				</Rise>
			</div>
			<div style={{position: 'absolute', right: 160, top: 176, textAlign: 'right', opacity: big, transform: `translateY(${(1 - big) * 30}px)`}}>
				<div style={titleStyle(K.navy, 96)}>{c.big}</div>
			</div>

			{/* track */}
			<div style={{position: 'absolute', left: 0, top: 0, width: FW, height: 1080}}>
				{c.items.map((label, i) => {
					const s = SIZE(i);
					const sx = XS[i] - pan;
					const cx = sx + s / 2;
					if (sx > FW + 40 || sx + s < -40) return null;
					const enter = p(f, 16 + i * 5, 46 + i * 5);
					const m = clamp01((1680 - cx) / 360);
					return (
						<div key={label} style={{position: 'absolute', left: sx, top: BASE - s, width: s, opacity: enter}}>
							<Product i={i} m={m} size={s} style={{transform: `translateY(${(1 - enter) * 60}px)`}} />
							<div
								style={{
									position: 'absolute',
									top: s + 28,
									left: -60,
									right: -60,
									textAlign: 'center',
									fontFamily: SANS,
									fontSize: 24,
									fontWeight: 400,
									color: K.navySoft,
									opacity: clamp01(m * 3),
								}}
							>
								{label}
							</div>
						</div>
					);
				})}
				{/* ruler */}
				<svg width={FW} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
					<line x1={0} y1={BASE + 110} x2={FW} y2={BASE + 110} stroke={K.navy} strokeWidth={2} />
					{Array.from({length: 120}, (_, k) => {
						const x = -pan - 200 + k * 50;
						if (x < -20 || x > FW + 20) return null;
						const major = k % 10 === 0;
						return <line key={k} x1={x} y1={BASE + 110} x2={x} y2={BASE + 110 - (major ? 24 : 10)} stroke={K.navy} strokeWidth={major ? 2 : 1} />;
					})}
					{c.ruler.map((r, k) => {
						const x = [XS[0] + SIZE(0) / 2, XS[7] + SIZE(7) / 2, XS[N - 1] + SIZE(N - 1) / 2][k] - pan;
						return (
							<g key={r}>
								<circle cx={x} cy={BASE + 110} r={8} fill={K.red} />
								<text x={x} y={BASE + 160} textAnchor="middle" fontFamily={SANS} fontSize={24} fontWeight={500} fill={K.red} letterSpacing={3}>
									{r}
								</text>
							</g>
						);
					})}
				</svg>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, bottom: 44, textAlign: 'center'}}>
				<Fade at={372}>
					<div style={{...titleStyle(K.navy, 40), fontWeight: 400}}>{c.foot}</div>
				</Fade>
			</div>
		</AbsoluteFill>
	);
};

// ---------------------------------------------------------------------------
// 5 — Dynamic LED windows draw the mall's passers-by in.

/** What plays on the transparent LED window (320 × 500). */
const LedContent: React.FC<{f: number}> = ({f}) => {
	const PER = 72;
	const k = Math.floor(f / PER) % 4;
	const lf = f % PER;
	const t = p(lf, 0, 18);
	const s = COPY.led.screen;
	let body: React.ReactNode;
	if (k === 0) {
		body = (
			<div style={{position: 'absolute', inset: 0, background: K.blue, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 26}}>
				{s.map((w, i) => (
					<div key={w} style={{overflow: 'hidden'}}>
						<div
							style={{
								fontFamily: SANS,
								fontWeight: 700,
								fontSize: 62,
								lineHeight: 1.02,
								color: i === 2 ? K.red : K.white,
								transform: `translateY(${(1 - p(lf, i * 6, 16 + i * 6)) * 100}%)`,
							}}
						>
							{w}
						</div>
					</div>
				))}
			</div>
		);
	} else if (k === 1) {
		body = (
			<div style={{position: 'absolute', inset: 0, background: K.navy, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Product i={2} m={p(lf, 10, 50, ease.inOut)} size={260} />
			</div>
		);
	} else if (k === 2) {
		body = (
			<div style={{position: 'absolute', inset: 0, background: K.paperLight, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
				<div style={{position: 'absolute', width: 300 * t, height: 300 * t, borderRadius: 300, border: `3px solid ${K.blue}`}} />
				<Eye size={180 * p(lf, 0, 22, ease.back)} spin={lf * 3} />
			</div>
		);
	} else {
		body = (
			<div style={{position: 'absolute', inset: 0, background: K.red, overflow: 'hidden'}}>
				{Array.from({length: 9}, (_, i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: -200 + i * 70 + lf * 2,
							top: -100,
							width: 26,
							height: 800,
							background: i % 3 === 0 ? K.navy : i % 3 === 1 ? K.white : K.blue,
							transform: 'rotate(28deg)',
						}}
					/>
				))}
				<Product i={6} m={1} size={220} style={{position: 'absolute', left: 50, top: 140, transform: `scale(${t})`}} />
			</div>
		);
	}
	return (
		<div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
			{body}
			{/* LED mesh */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage: 'radial-gradient(circle, transparent 1.3px, rgba(0,0,20,0.55) 1.9px)',
					backgroundSize: '6px 6px',
				}}
			/>
		</div>
	);
};

const PEOPLE = [
	{c: K.navy, x0: -80, x1: 230, t0: 20, stop: 110, enter: 210, dir: 1},
	{c: K.red, x0: 2000, x1: 470, t0: 50, stop: 150, enter: 250, dir: -1},
	{c: K.sage, x0: -80, x1: 2000, t0: 80, stop: -1, enter: -1, dir: 1},
	{c: K.wood, x0: 2000, x1: 350, t0: 100, stop: 190, enter: 280, dir: -1},
	{c: K.blue, x0: -80, x1: 2000, t0: 150, stop: -1, enter: -1, dir: 1},
];
const DOOR_X = 650;

const Person: React.FC<{f: number; i: number}> = ({f, i}) => {
	const pp = PEOPLE[i];
	let x: number;
	let y = 930;
	let sc = 1;
	let op = 1;
	let walking = true;
	if (pp.stop < 0) {
		x = lerp(pp.x0, pp.x1, clamp01((f - pp.t0) / 260));
	} else if (f < pp.stop) {
		x = lerp(pp.x0, pp.x1, p(f, pp.t0, pp.stop, ease.soft));
	} else if (f < pp.enter) {
		x = pp.x1;
		walking = false;
	} else {
		const t = p(f, pp.enter, pp.enter + 60, ease.inOut);
		x = lerp(pp.x1, DOOR_X, t);
		y = lerp(930, 800, t);
		sc = lerp(1, 0.7, t);
		op = 1 - p(f, pp.enter + 40, pp.enter + 60);
	}
	const leg = walking ? Math.sin(f / 3 + i) * 14 : 0;
	const lookUp = !walking && f > pp.stop ? 1 : 0;
	return (
		<svg width={80} height={200} viewBox="-40 -170 80 200" style={{position: 'absolute', left: x - 40, top: y - 170, transform: `scale(${sc})`, opacity: op, overflow: 'visible'}}>
			<line x1={-6} y1={-50} x2={-6 + leg} y2={0} stroke={K.navy} strokeWidth={9} strokeLinecap="round" />
			<line x1={6} y1={-50} x2={6 - leg} y2={0} stroke={K.navy} strokeWidth={9} strokeLinecap="round" />
			<rect x={-20} y={-120} width={40} height={78} rx={18} fill={pp.c} />
			<circle cx={0} cy={-142 - lookUp * 3} r={17} fill={K.sand} />
			{lookUp > 0 && <circle cx={8} cy={-147} r={3} fill={K.navy} />}
		</svg>
	);
};

const Facade: React.FC<{f: number}> = ({f}) => {
	const build = p(f, 8, 40);
	const on = p(f, 60, 72);
	const wave = (k: number) => ((f - 70 + k * 24) % 72) / 72;
	return (
		<div style={{position: 'absolute', left: 80, top: 150, width: 1120, height: 880}}>
			{/* floor */}
			<div style={{position: 'absolute', left: -80, right: -900, top: 660, height: 260, background: K.sand}} />
			{/* reflection of the LED on the floor */}
			<div
				style={{
					position: 'absolute',
					left: 60,
					top: 662,
					width: 340,
					height: 160,
					opacity: on * 0.55,
					background: `linear-gradient(${K.blue}, transparent)`,
					filter: 'blur(14px)',
				}}
			/>
			<div style={{position: 'absolute', left: 40, top: 0, width: 1040, height: 660, background: '#D9D4C9', clipPath: `inset(${(1 - build) * 100}% 0 0 0)`}}>
				{/* sign band */}
				<div style={{position: 'absolute', left: 30, right: 30, top: 24, height: 96, background: K.paperLight, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Logo width={500} />
				</div>
				{/* LED window */}
				<div style={{position: 'absolute', left: 30, top: 144, width: 320, height: 500, background: '#0B0E2A', boxShadow: `0 0 ${60 * on}px rgba(31,75,255,${0.6 * on})`}}>
					<div style={{position: 'absolute', inset: 0, opacity: on}}>
						<LedContent f={Math.max(0, f - 60)} />
					</div>
				</div>
				{/* door, interior */}
				<div style={{position: 'absolute', left: 380, top: 144, width: 330, height: 516, background: '#FFF6E6', overflow: 'hidden'}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 60, background: '#F3E6CC'}} />
					{[120, 220, 320].map((y) => (
						<div key={y} style={{position: 'absolute', left: 20, right: 20, top: y, height: 6, background: K.line}} />
					))}
					{[0, 1, 2, 3, 4].map((k) => (
						<div key={k} style={{position: 'absolute', left: 36 + k * 56, top: 188 - (k % 2) * 16, width: 24, height: 32 + (k % 2) * 16, background: k % 2 ? K.navy : K.blue, borderRadius: 4}} />
					))}
					<div style={{position: 'absolute', left: 80, top: 390, width: 170, height: 126, background: K.paperLight, boxShadow: `0 -6px 0 ${K.wood} inset`}} />
					<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, background: '#4A4A55'}} />
					<div style={{position: 'absolute', left: 161, top: 0, bottom: 0, width: 8, background: '#4A4A55'}} />
					<div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 8, background: '#4A4A55'}} />
				</div>
				{/* right window */}
				<div style={{position: 'absolute', left: 740, top: 144, width: 270, height: 500, background: '#FFF6E6', overflow: 'hidden'}}>
					{[0, 1, 2].map((r) => (
						<React.Fragment key={r}>
							<div style={{position: 'absolute', left: 20, right: 20, top: 150 + r * 130, height: 6, background: K.wood}} />
							{[0, 1, 2].map((k) => (
								<div key={k} style={{position: 'absolute', left: 36 + k * 76, top: 90 + r * 130, width: 50, height: 60}}>
									<Product i={[2, 3, 0, 8, 4, 10, 5, 1, 9][r * 3 + k]} m={1} size={60} />
								</div>
							))}
						</React.Fragment>
					))}
				</div>
			</div>
			{/* attraction waves from the LED window */}
			<svg width={1400} height={1000} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: on}}>
				{[0, 1, 2].map((k) => {
					const w = wave(k);
					return f > 70 ? (
						<circle key={k} cx={230} cy={400} r={260 + w * 320} fill="none" stroke={K.blue} strokeWidth={3} opacity={(1 - w) * 0.45} />
					) : null;
				})}
			</svg>
		</div>
	);
};

export const Led: React.FC = () => {
	const f = useCurrentFrame();
	const c = COPY.led;
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Paper />
			{f < 370 && <Facade f={f} />}
			<div style={{position: 'absolute', inset: 0, opacity: 1 - p(f, 318, 336)}}>
				{PEOPLE.map((_, i) => (
					<Person key={i} f={f} i={i} />
				))}
			</div>
			<Window x={80} y={150} w={1120} h={747} at={330} radius={24} from="left">
				<KenBurns src={staticFile('franchise/facade.jpg')} dur={120} start={330} from={1.02} to={1.1} />
			</Window>
			<Fade at={356} style={{position: 'absolute', left: 80, top: 920, width: 1120}}>
				<div style={{...bodyStyle(K.navySoft, 22), fontStyle: 'italic'}}>{c.photo}</div>
			</Fade>

			<div style={{position: 'absolute', left: 1290, top: 180, width: 560}}>
				<Fade at={16}>
					<Kicker>03 — {COPY.chapters[2]}</Kicker>
				</Fade>
				<div style={{height: 30}} />
				<Rise at={26}>
					<div style={titleStyle(K.navy, 70)}>{c.title[0]}</div>
				</Rise>
				<Rise at={34}>
					<div style={titleStyle(K.navy, 70)}>{c.title[1]}</div>
				</Rise>
				<div style={{height: 22}} />
				<Tricolour p={p(f, 44, 70)} width={160} />
				<div style={{height: 30}} />
				<Fade at={70}>
					<div style={bodyStyle(K.navySoft, 26)}>{c.body}</div>
				</Fade>
				<div style={{height: 50}} />
				<div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
					{c.steps.map((s, k) => {
						const at = [90, 150, 210][k];
						const on = p(f, at, at + 16);
						return (
							<div key={s} style={{display: 'flex', alignItems: 'center', gap: 20, opacity: 0.25 + on * 0.75}}>
								<Num n={k + 1} size={46} bg={on > 0.5 ? K.red : K.grey} s={0.85 + on * 0.15} />
								<div style={{fontFamily: SANS, fontSize: 36, fontWeight: 500, color: K.navy}}>{s}</div>
							</div>
						);
					})}
				</div>
			</div>
		</AbsoluteFill>
	);
};

