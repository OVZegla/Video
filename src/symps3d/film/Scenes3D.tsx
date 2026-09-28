import React, {useMemo} from 'react';
import {AbsoluteFill, Sequence, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import * as THREE from 'three';
import {Machine3D, layout, type MachineSpec} from '../kit/Machine3D';
import {Stage3D} from '../kit/Stage3D';
import {PrintMask, muralTexture, type MuralStyle} from '../kit/murals';
import {flat, paint, steel} from '../kit/materials';
import {SPECS} from '../specs';
import {RevealLine, Wordmark, fontBase} from '../../symps/components/Typography';
import {LAYERS_DURATION, Layers} from '../../symps/scenes/PrintheadScene';
import {C, ease, inOut, lerp, prog} from '../../symps/theme';
import {Caption, CutFlash, SlamTitle, orbit, type V3} from './common';

// ————————————————————————————————————————————— brand moment

export const BRAND3D = 132;

/** The first machines on one turning platform; the camera climbs and pulls away. */
export const BrandCircle3D: React.FC<{ids: string[]}> = ({ids}) => {
	const f = useCurrentFrame();
	const t = prog(f, 0, BRAND3D, ease.out);
	const rot = lerp(0.6, -0.5, prog(f, 0, BRAND3D, ease.inOut));
	const cam = orbit([0, 1.2, 0], lerp(3.2, 8.4, t), lerp(-0.4, 0.5, t), lerp(0.6, 3.4, t), 38);
	const third = BRAND3D / 3;
	const line: React.CSSProperties = {...fontBase, fontSize: 72, letterSpacing: '-0.035em', color: C.ink, textAlign: 'center'};
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Stage3D cam={cam} look={{key: 2, rim: 5, pool: [3.2, 0.22], cyc: ['#000', 0]}}>
				<group rotation={[0, rot, 0]}>
					{ids.map((id, i) => {
						const a = (i / ids.length) * Math.PI * 2;
						return (
							<group key={id} position={[Math.sin(a) * 1.55, 0, Math.cos(a) * 1.55]} rotation={[0, a + Math.PI / 2, 0]}>
								<Machine3D spec={SPECS[id]} state={{head: 0.5 + 0.4 * Math.sin(f * 0.08 + i * 1.6), uv: 0.6}} />
							</group>
						);
					})}
				</group>
			</Stage3D>
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 110}}>
				<div style={{position: 'relative', width: '100%', height: 110}}>
					{['Une gamme.', 'Plusieurs façons de créer.', 'Une seule vision.'].map((txt, i) => (
						<AbsoluteFill key={txt} style={{alignItems: 'center'}}>
							<RevealLine at={i * third + 4} out={i < 2 ? (i + 1) * third - 6 : undefined} dur={20} outDur={10}>
								<div style={{...line, fontWeight: i === 1 ? 300 : 600}}>{txt}</div>
							</RevealLine>
						</AbsoluteFill>
					))}
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ————————————————————————————————————————————— printing demo

const WALL_W = 4.4;
const COLS = 10;

/** A wall in front of the machine (wall-side = -x), printed progressively. */
const PrintedWall: React.FC<{spec: MachineSpec; p: number; style: MuralStyle; palette: string[]; x: number; y0: number; y1: number; zCenter?: number}> = ({p, style, palette, x, y0, y1, zCenter = 0}) => {
	const mask = useMemo(() => new PrintMask(COLS), []);
	const tex = muralTexture(style, palette, 2048, 1024);
	const alpha = mask.update(p);
	const h = y1 - y0;
	return (
		<group position={[x, 0, zCenter]} rotation={[0, Math.PI / 2, 0]}>
			{/* plaster */}
			<mesh position={[0, 1.6, -0.01]} receiveShadow>
				<planeGeometry args={[WALL_W + 14, 3.2]} />
				<meshStandardMaterial color="#E6E4DF" roughness={0.9} />
			</mesh>
			<mesh position={[0, y0 + h / 2, 0]}>
				<planeGeometry args={[WALL_W, h]} />
				<meshStandardMaterial map={tex} alphaMap={alpha} transparent roughness={0.75} />
			</mesh>
		</group>
	);
};

export const PRINT3D = 250;

export const PrintDemo3D: React.FC = () => {
	const f = useCurrentFrame();
	const spec = SPECS.opaline;
	const L0 = layout(spec, {head: 0});
	const L1 = layout(spec, {head: 1});
	const wallX = L0.nozzle.x - 0.035;
	const y0 = L0.nozzle.y - 0.05;
	const y1 = L1.nozzle.y + 0.05;

	const p = prog(f, 16, 176, ease.linear);
	const [col, frac] = PrintMask.state(p, COLS);
	const head = p >= 1 ? 0.5 : PrintMask.head(p, COLS);
	// the machine steps to the next swath at the start of each one (plane u runs towards -z)
	const colW = WALL_W / COLS;
	const zOf = (c: number) => WALL_W / 2 - colW / 2 - c * colW - L0.nozzle.z;
	const step = prog(frac, 0, 0.18, ease.inOut);
	const mz = col === 0 ? zOf(0) : lerp(zOf(col - 1), zOf(col), p >= 1 ? 1 : step);
	const spin = mz / spec.wheelR;

	// camera: close on the head → wide → along the wall
	const nz = mz + L0.nozzle.z;
	const hy = lerp(y0, y1, head);
	const close: {pos: V3; target: V3} = {pos: [wallX + 0.55, hy + 0.2, nz + 0.95], target: [wallX + 0.05, hy, nz - 0.1]};
	const wide: {pos: V3; target: V3} = {pos: [3.6, 1.8, 3.4], target: [wallX, 1.25, 0]};
	const k = prog(f, 56, 110, ease.inOut);
	const pos: V3 = [lerp(close.pos[0], wide.pos[0], k), lerp(close.pos[1], wide.pos[1], k), lerp(close.pos[2], wide.pos[2], k)];
	const target: V3 = [lerp(close.target[0], wide.target[0], k), lerp(close.target[1], wide.target[1], k), lerp(close.target[2], wide.target[2], k)];
	const drift = prog(f, 110, 180, ease.inOut);
	pos[2] -= drift * 1.2;
	pos[0] -= drift * 0.4;

	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Sequence durationInFrames={180} layout="none">
				<Stage3D cam={{pos, target, fov: lerp(34, 40, k)}} look={{key: 2.4, rim: 4, env: 1, pool: [3, 0.18], cyc: ['#7F95B8', 0.2]}}>
					<PrintedWall spec={spec} p={p} style="waves" palette={['#F3EEE6', '#1E3C9E', '#2F7BFF', '#E0233D', '#F5B83D']} x={wallX} y0={y0} y1={y1} />
					<group position={[0, 0, mz]}>
						<Machine3D spec={spec} state={{head, uv: p > 0 && p < 1 ? 1 : 0.2, spin}} />
					</group>
				</Stage3D>
			</Sequence>
			<Sequence from={180} layout="none">
				<Gallery />
			</Sequence>
			<CutFlash at={180} strength={0.3} />
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 70}}>
				<RevealLine at={4} out={56}>
					<div style={{...fontBase, fontSize: 64, fontWeight: 300, letterSpacing: '-0.03em', color: C.ink}}>Du mur blanc…</div>
				</RevealLine>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 90}}>
				<RevealLine at={196}>
					<div style={{...fontBase, fontSize: 64, fontWeight: 600, letterSpacing: '-0.03em', color: C.ink}}>…à l’espace qui vous ressemble.</div>
				</RevealLine>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

const SPACES: {label: string; style?: MuralStyle; palette?: string[]; photo?: string}[] = [
	{label: 'Hôtellerie', style: 'waves', palette: ['#1B2A4A', '#6C7FA6', '#C9A98A', '#2C3550', '#F2D7B0']},
	{label: 'Art mural', photo: 'symps3d/murals/portrait-blue.jpg'},
	{label: 'Restauration', style: 'arches', palette: ['#E8D9C4', '#C56B4A', '#E0A77A', '#8B4A36', '#F1C9A0']},
	{label: 'Commerce', style: 'geo', palette: ['#0D1B3D', '#2F7BFF', '#E0233D', '#F2EFE8', '#F5B83D']},
	{label: 'Habitat', style: 'botanical', palette: ['#E6E2D6', '#7C9A7E', '#4E6B55', '#A9BFA0', '#2F4A3A']},
	{label: 'Bureaux', style: 'lines', palette: ['#10151F', '#8FA3BF', '#2F7BFF']},
];

const photoTex = new Map<string, THREE.Texture>();
/** Loads a photo as a texture, holding the render until it is decoded. */
const photoTexture = (src: string) => {
	if (!photoTex.has(src)) {
		const handle = delayRender(`texture ${src}`);
		const t = new THREE.TextureLoader().load(
			staticFile(src),
			() => continueRender(handle),
			undefined,
			() => continueRender(handle),
		);
		t.colorSpace = THREE.SRGBColorSpace;
		photoTex.set(src, t);
	}
	return photoTex.get(src)!;
};

/** Camera glides along a long wall of finished prints, one per kind of space. */
const Gallery: React.FC = () => {
	const f = useCurrentFrame();
	const gap = 2.9;
	const x = lerp(-0.6, (SPACES.length - 1) * gap + 0.4, prog(f, 0, 70, ease.inOut));
	const idx = Math.round((x + 0.6) / gap);
	return (
		<AbsoluteFill>
			<Stage3D cam={{pos: [x + 1.2, 1.35, 3.1], target: [x - 0.4, 1.4, 0], fov: 42}} look={{key: 2.6, rim: 2, env: 1, pool: [0, 0], cyc: ['#000', 0]}} reflect={false}>
				<mesh position={[8, 1.6, -0.02]}>
					<planeGeometry args={[40, 3.2]} />
					<meshStandardMaterial color="#E6E4DF" roughness={0.9} />
				</mesh>
				{SPACES.map((s, i) => {
					const h = 1.9;
					const w = s.photo ? h * 0.643 : 2.5;
					const map = s.photo ? photoTexture(s.photo) : muralTexture(s.style!, s.palette!, 1600, 1216);
					return (
						<mesh key={s.label} position={[i * gap, 1.45, 0]}>
							<planeGeometry args={[w, h]} />
							<meshStandardMaterial map={map} roughness={0.7} />
						</mesh>
					);
				})}
			</Stage3D>
			<AbsoluteFill style={{justifyContent: 'flex-end', padding: '0 0 170px 150px'}}>
				{SPACES.map((s, i) => (
					<div key={s.label} style={{position: 'absolute', bottom: 190, left: 150, opacity: i === idx ? 1 : 0}}>
						<Caption text={s.label.toUpperCase()} at={0} color={C.ink} size={24} />
					</div>
				))}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

// ————————————————————————————————————————————— technology

/** Two Epson I1600 heads on their carriage plate (CMYK + white). */
export const EpsonHeads3D: React.FC<{open?: number}> = ({open = 0}) => {
	const head = (x: number, inks: string[]) => (
		<group position={[x, 0, 0]}>
			<mesh material={flat('#17181B', 0.4, 0.3)} castShadow>
				<boxGeometry args={[0.07, 0.05, 0.045]} />
			</mesh>
			<mesh position={[0, -0.028, 0]} material={steel()}>
				<boxGeometry args={[0.062, 0.006, 0.04]} />
			</mesh>
			{[-0.016, 0.016].map((z) => (
				<mesh key={z} position={[0, 0.045, z * 0.6]} material={flat('#C9A45A', 0.35, 0.6)}>
					<boxGeometry args={[0.05, 0.04, 0.002]} />
				</mesh>
			))}
			{inks.map((c, i) => (
				<mesh key={i} position={[-0.024 + i * 0.016, 0.03, 0.012]} material={paint(c, 0.3)}>
					<cylinderGeometry args={[0.005, 0.005, 0.012, 16]} />
				</mesh>
			))}
		</group>
	);
	return (
		<group>
			<mesh position={[0, 0.03 + open * 0.08, 0]} material={paint('#1E3C9E')}>
				<boxGeometry args={[0.22, 0.012, 0.09]} />
			</mesh>
			{head(-0.05, ['#00A3E0', '#E4007C', '#FFD400', '#1A1A1E'])}
			{head(0.05, ['#F4F4F2', '#F4F4F2'])}
		</group>
	);
};

export const TECH3D = 168;
const BEAT = 42;

const Word: React.FC<{text: string}> = ({text}) => (
	<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
		<SlamTitle text={text} at={2} out={BEAT - 10} size={200} align="center" stagger={1.1} />
	</AbsoluteFill>
);

export const Tech3D: React.FC = () => {
	const spec = SPECS.opaline;
	const beats: React.ReactNode[] = [
		<Precision key="p" spec={spec} />,
		<Couleur key="c" spec={spec} />,
		<Techno key="t" />,
		<Creativite key="k" spec={spec} />,
	];
	const words = ['PRÉCISION', 'COULEUR', 'TECHNOLOGIE', 'CRÉATIVITÉ'];
	return (
		<AbsoluteFill style={{background: '#000'}}>
			{beats.map((b, i) => (
				<Sequence key={i} from={i * BEAT} durationInFrames={BEAT}>
					<AbsoluteFill style={{opacity: 0.6}}>{b}</AbsoluteFill>
					<Word text={words[i]} />
				</Sequence>
			))}
			{[1, 2, 3].map((i) => (
				<CutFlash key={i} at={i * BEAT} strength={0.25} />
			))}
		</AbsoluteFill>
	);
};

const Precision: React.FC<{spec: MachineSpec}> = ({spec}) => {
	const f = useCurrentFrame();
	const head = lerp(0.2, 0.45, prog(f, 0, BEAT, ease.linear));
	const n = layout(spec, {head}).nozzle;
	return (
		<Stage3D cam={{pos: [n.x - 0.45, n.y + 0.05, n.z + lerp(0.3, -0.1, prog(f, 0, BEAT, ease.out))], target: [n.x, n.y, n.z], fov: 30}} look={{key: 1, rim: 5, env: 0.6}} reflect={false}>
			<Machine3D spec={spec} state={{head, uv: 1}} />
		</Stage3D>
	);
};

const Couleur: React.FC<{spec: MachineSpec}> = ({spec}) => {
	const f = useCurrentFrame();
	const c = layout(spec).caps;
	const a = lerp(-2.4, -1.2, prog(f, 0, BEAT, ease.out));
	return (
		<Stage3D cam={{pos: [c.x + Math.sin(a) * 0.3, c.y + 0.35, c.z + Math.cos(a) * 0.3], target: [c.x, c.y, c.z], fov: 30}} look={{key: 2.5, rim: 3}} reflect={false}>
			<Machine3D spec={spec} />
		</Stage3D>
	);
};

const Techno: React.FC = () => {
	const f = useCurrentFrame();
	const a = lerp(-0.8, 0.8, prog(f, 0, BEAT, ease.inOut));
	return (
		<Stage3D cam={orbit([0, 0.25, 0], 0.42, a, 0.36, 30)} look={{key: 2.5, rim: 5, cyc: ['#000', 0], pool: [0.4, 0.25]}} reflect={false}>
			<group position={[0, 0.25, 0]} rotation={[0, f * 0.01, 0]}>
				<EpsonHeads3D />
			</group>
		</Stage3D>
	);
};

const Creativite: React.FC<{spec: MachineSpec}> = ({spec}) => {
	const f = useCurrentFrame();
	const p = lerp(0.25, 0.75, prog(f, 0, BEAT, ease.linear));
	const L0 = layout(spec, {head: 0});
	const L1 = layout(spec, {head: 1});
	const wallX = L0.nozzle.x - 0.035;
	return (
		<Stage3D cam={{pos: [wallX + 2.2, 1.3, 1.6], target: [wallX, 1.3, -0.3], fov: 40}} look={{key: 2.5, rim: 3, cyc: ['#000', 0]}} reflect={false}>
			<PrintedWall spec={spec} p={p} style="geo" palette={['#0D1B3D', '#2F7BFF', '#E0233D', '#F2EFE8', '#F5B83D']} x={wallX} y0={L0.nozzle.y - 0.05} y1={L1.nozzle.y + 0.05} />
		</Stage3D>
	);
};

// ————————————————————————————————————————————— Epson double head

export const EPSON3D = 90 + LAYERS_DURATION;

export const Epson3D: React.FC = () => {
	const f = useCurrentFrame();
	const a = lerp(-1.1, 0.5, prog(f, 0, 96, ease.inOut));
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Sequence durationInFrames={96}>
				<Stage3D cam={orbit([0, 0.24, 0], lerp(0.5, 0.36, prog(f, 0, 96, ease.out)), a, lerp(0.2, 0.3, prog(f, 0, 96, ease.out)), 32, 0, -0.06)} look={{key: 2.5, rim: 6, cyc: ['#000', 0], pool: [0.45, 0.3]}}>
					<group position={[0, 0.24, 0]}>
						<EpsonHeads3D open={1 - prog(f, 0, 40, ease.out)} />
					</group>
				</Stage3D>
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-end', paddingRight: 150}}>
					<Caption text="DOUBLE TÊTE" at={8} out={84} />
					<div style={{marginTop: 12}}>
						<SlamTitle text="Epson I1600" at={12} out={84} size={120} />
					</div>
					<RevealLine at={30} out={82} style={{marginTop: 14}}>
						<div style={{...fontBase, fontSize: 32, fontWeight: 300, color: C.mist, textAlign: 'right'}}>Une tête couleur. Une tête blanc.</div>
					</RevealLine>
				</AbsoluteFill>
			</Sequence>
			<Sequence from={90} durationInFrames={LAYERS_DURATION}>
				<AbsoluteFill style={{opacity: inOut(f - 90, 0, 10, LAYERS_DURATION - 6, LAYERS_DURATION)}}>
					<Layers />
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
};

// ————————————————————————————————————————————— the whole range

export const LINEUP3D = 204;

export const Lineup3D: React.FC<{ids: string[]}> = ({ids}) => {
	const f = useCurrentFrame();
	const n = ids.length;
	const gap = 1.35;
	const xs = ids.map((_, i) => (i - (n - 1) / 2) * gap);
	const truck = prog(f, 0, 100, ease.inOut);
	const rise = prog(f, 88, 190, ease.inOut);
	const pos: V3 = [lerp(xs[0] - 1.2, xs[n - 1] - 2.5, truck) * (1 - rise), lerp(0.55, 3.4, rise), lerp(2.8, 11.5, rise)];
	const target: V3 = [lerp(xs[0] + 0.4, xs[n - 1] - 1.2, truck) * (1 - rise), lerp(1.3, 1.1, rise), 0];
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Stage3D cam={{pos, target, fov: lerp(40, 40, rise)}} look={{key: 2.2, rim: 5, pool: [6, 0.18]}}>
				{ids.map((id, i) => (
					<group key={id} position={[xs[i], 0, (i % 2) * -0.6]} rotation={[0, 0.35, 0]}>
						<Machine3D spec={SPECS[id]} state={{head: 0.45 + 0.4 * Math.sin(f * 0.09 - i * 0.8), uv: 0.6}} />
					</group>
				))}
			</Stage3D>
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 96}}>
				<RevealLine at={26} out={104}>
					<div style={{...fontBase, fontSize: 64, fontWeight: 500, letterSpacing: '-0.03em', color: C.ink}}>Une gamme pensée pour chaque projet.</div>
				</RevealLine>
			</AbsoluteFill>
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 90}}>
				<RevealLine at={126} dur={30} blur={16} rise={0.4}>
					<Wordmark size={110} sweep={prog(f, 140, 190, ease.inOut)} />
				</RevealLine>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
