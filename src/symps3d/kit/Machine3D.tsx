import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {INK_CAPS, alloy, anodised, emissive, flat, glassScreen, paint, plasticBlack, plasticWhite, rubber, steel} from './materials';
import {lcdTexture, modelPlate, screenTexture, sympsPlate} from './textures';

/**
 * Parametric 3D wall printer.
 *
 * Units are metres, y is up, the machine stands on the floor at the origin.
 * The wall it prints on is on the -x side: the print unit faces -x and
 * travels up the mast; the machine rolls along z.
 */

export type MachineSpec = {
	id: string;
	/** main lacquer: cabinet, chassis, print unit */
	body: string;
	chassis?: string;
	cabinet?: string;
	unit?: string;
	/** handles and small details */
	accent: string;
	rail: 'black' | 'silver';
	/** aluminium profiles side by side in the mast */
	rails: 1 | 2 | 3;
	/** mast height above the floor, m */
	mast: number;
	/** control cabinet, or null for machines without a tower */
	tower: {w: number; h: number; d: number} | null;
	steelStrip?: boolean;
	controlPanel?: 'red' | 'black';
	/** model plate on the wall-side face of the cabinet */
	plate?: string;
	sympsPlate?: boolean;
	/** angled coloured panel on the cabinet */
	swoosh?: string;
	/** perforated coloured plates running up the mast */
	mastPlates?: string;
	wheel: 'alloy' | 'black';
	wheelR: number;
	chassisSize: [number, number];
	screen?: boolean;
	fan?: boolean;
};

export type MachineState = {
	/** print unit position along the mast, 0 (rest, low) → 1 (top) */
	head?: number;
	/** mast deployment, 0 (retracted to cabinet height) → 1 */
	mast?: number;
	/** wheel rotation, radians */
	spin?: number;
	/** exploded view, 0 (assembled) → 1 */
	explode?: number;
	/** UV lamp glow 0 → 1 */
	uv?: number;
};

const geoCache = new Map<string, THREE.BufferGeometry>();
const rbox = (w: number, h: number, d: number, r = 0.01) => {
	const k = `rb-${w.toFixed(4)}-${h.toFixed(4)}-${d.toFixed(4)}-${r}`;
	if (!geoCache.has(k)) geoCache.set(k, new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.2, h / 2.2, d / 2.2)));
	return geoCache.get(k)!;
};

const Box: React.FC<{size: [number, number, number]; pos?: [number, number, number]; rot?: [number, number, number]; mat: THREE.Material; r?: number}> = ({size, pos = [0, 0, 0], rot, mat, r = 0.004}) => (
	<mesh geometry={rbox(size[0], size[1], size[2], r)} material={mat} position={pos} rotation={rot} castShadow receiveShadow />
);

const Cyl: React.FC<{r: number; h: number; pos?: [number, number, number]; rot?: [number, number, number]; mat: THREE.Material; seg?: number; r2?: number}> = ({r, h, pos = [0, 0, 0], rot, mat, seg = 32, r2}) => (
	<mesh position={pos} rotation={rot} material={mat} castShadow>
		<cylinderGeometry args={[r, r2 ?? r, h, seg]} />
	</mesh>
);

// ——————————————————————————————————————————————— wheels

export const Wheel: React.FC<{r: number; style: 'alloy' | 'black'; spin: number; side: 1 | -1}> = ({r, style, spin, side}) => {
	const w = r * 0.62;
	return (
		<group rotation={[spin, 0, 0]}>
			{/* tyre */}
			<Cyl r={r} h={w} rot={[0, 0, Math.PI / 2]} mat={rubber()} seg={48} />
			<mesh rotation={[0, Math.PI / 2, 0]} material={rubber()}>
				<torusGeometry args={[r - w * 0.18, w * 0.2, 12, 48]} />
			</mesh>
			{/* rim */}
			<group position={[(side * w) / 2 + side * 0.001, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
				<Cyl r={r * 0.7} h={0.008} mat={style === 'alloy' ? alloy() : plasticBlack()} seg={40} />
				{Array.from({length: 5}).map((_, i) => {
					const a = (i / 5) * Math.PI * 2;
					return (
						<mesh key={i} position={[Math.cos(a) * r * 0.4, -side * 0.0045, Math.sin(a) * r * 0.4]} rotation={[0, -a, 0]} scale={[1.5, 1, 0.8]} material={flat('#0A0A0B', 0.6)}>
							<cylinderGeometry args={[r * 0.14, r * 0.14, 0.002, 20]} />
						</mesh>
					);
				})}
				<Cyl r={r * 0.14} h={0.014} mat={style === 'alloy' ? alloy() : steel()} />
			</group>
		</group>
	);
};

// ——————————————————————————————————————————————— mast

const Mast: React.FC<{spec: MachineSpec; height: number; x: number; z: number}> = ({spec, height, x, z}) => {
	const m = anodised(spec.rail);
	const slot = flat(spec.rail === 'black' ? '#050506' : '#7D838B', 0.5, 0.6);
	const prof = 0.042;
	const offsets = spec.rails === 1 ? [0] : spec.rails === 2 ? [-0.023, 0.023] : [-0.046, 0, 0.046];
	return (
		<group position={[x, 0, z]}>
			{offsets.map((oz, i) => (
				<group key={i} position={[i === 1 && spec.rails === 3 ? 0.03 : 0, height / 2, oz]}>
					<Box size={[prof, height, prof]} mat={m} r={0.003} />
					{/* T-slots */}
					{[-1, 1].map((s) => (
						<Box key={s} size={[0.006, height - 0.02, 0.008]} pos={[(s * prof) / 2, 0, 0]} mat={slot} r={0.001} />
					))}
					<Box size={[0.008, height - 0.02, 0.006]} pos={[0, 0, prof / 2]} mat={slot} r={0.001} />
				</group>
			))}
			{/* top: pulley + knob */}
			<group position={[0, height + 0.02, 0]}>
				<Box size={[0.07, 0.04, 0.07]} mat={anodised('black')} r={0.006} />
				<Cyl r={0.032} h={0.016} pos={[-0.03, 0.01, 0]} rot={[0, 0, Math.PI / 2]} mat={plasticWhite()} />
				<Cyl r={0.014} h={0.03} pos={[0.035, 0.0, 0]} rot={[0, 0, Math.PI / 2]} mat={plasticBlack()} />
			</group>
			{/* clamp brackets with knobs */}
			{[0.55, 0.72].map((p) => (
				<group key={p} position={[0, height * p, 0]}>
					<Box size={[0.056, 0.05, 0.06 + (spec.rails - 1) * 0.046]} mat={anodised('black')} r={0.004} />
					<Cyl r={0.012} h={0.03} pos={[0.04, 0, 0]} rot={[0, 0, Math.PI / 2]} mat={plasticBlack()} />
				</group>
			))}
			{spec.mastPlates && (
				<group position={[0.03, 0, 0]}>
					{[0.28, 0.62].map((p) => (
						<group key={p} position={[0, height * p, 0]}>
							<Box size={[0.012, height * 0.3, 0.09]} mat={paint(spec.mastPlates!)} r={0.003} />
							{Array.from({length: 8}).map((_, i) => (
								<Cyl key={i} r={0.008} h={0.014} pos={[0, -height * 0.13 + i * height * 0.037, 0]} rot={[0, 0, Math.PI / 2]} mat={flat('#060606')} seg={16} />
							))}
						</group>
					))}
				</group>
			)}
		</group>
	);
};

// ——————————————————————————————————————————————— print unit

export const PrintUnit: React.FC<{spec: MachineSpec; uv: number}> = ({spec, uv}) => {
	const body = paint(spec.unit ?? spec.body);
	const dark = flat('#0C0C0E', 0.5);
	const lcd = useMemo(() => new THREE.MeshBasicMaterial({map: lcdTexture(), toneMapped: false}), []);
	return (
		<group>
			{/* lower housing */}
			<Box size={[0.3, 0.2, 0.32]} pos={[0, 0.1, 0]} mat={body} r={0.01} />
			{/* vents on +z */}
			{[0, 1, 2].map((i) => (
				<Box key={i} size={[0.12, 0.012, 0.004]} pos={[0.04, 0.05 + i * 0.022, 0.161]} mat={dark} r={0.002} />
			))}
			{/* LCD */}
			<mesh position={[-0.07, 0.12, 0.162]} material={lcd}>
				<planeGeometry args={[0.08, 0.03]} />
			</mesh>
			<Box size={[0.1, 0.05, 0.004]} pos={[-0.07, 0.12, 0.16]} mat={steel()} r={0.002} />
			{/* nozzle face towards the wall */}
			<Box size={[0.006, 0.12, 0.26]} pos={[-0.152, 0.07, 0]} mat={dark} r={0.002} />
			{/* UV lamp strip */}
			<mesh position={[-0.156, 0.015, 0]} material={emissive('#8B7BFF', 1.5 + uv * 3)} visible={uv > 0.02}>
				<boxGeometry args={[0.004, 0.012, 0.24]} />
			</mesh>
			{/* cartridge block, tilted */}
			<group position={[0.05, 0.22, 0]} rotation={[0, 0, -0.35]}>
				<Box size={[0.12, 0.06, 0.24]} mat={body} r={0.006} />
				{INK_CAPS.map((c, i) => (
					<group key={c} position={[0, 0.033, -0.09 + i * 0.045]}>
						<Cyl r={0.018} h={0.012} mat={flat('#111113', 0.4)} />
						<Cyl r={0.013} h={0.014} mat={paint(c, 0.3)} />
					</group>
				))}
				{/* serrated edge */}
				{Array.from({length: 10}).map((_, i) => (
					<Box key={i} size={[0.004, 0.01, 0.012]} pos={[0.062, 0.02, -0.11 + i * 0.024]} mat={dark} r={0.001} />
				))}
			</group>
			{/* sensor (yellow) */}
			<Cyl r={0.011} h={0.07} pos={[-0.06, 0.225, 0.13]} rot={[0, 0, Math.PI / 2]} mat={paint('#F2B600', 0.35)} />
			{/* drive pulley */}
			<Cyl r={0.06} h={0.02} pos={[0.13, 0.12, -0.17]} rot={[Math.PI / 2, 0, 0]} mat={flat('#8C9096', 0.35, 0.8)} />
			{spec.fan && (
				<group position={[0.1, 0.1, 0.162]}>
					<Cyl r={0.04} h={0.004} rot={[Math.PI / 2, 0, 0]} mat={dark} />
					{[0, 1, 2].map((i) => (
						<mesh key={i} position={[0, 0, 0.003]} material={flat('#3A3C40', 0.4, 0.5)}>
							<torusGeometry args={[0.012 + i * 0.011, 0.0015, 6, 32]} />
						</mesh>
					))}
				</group>
			)}
		</group>
	);
};

// ——————————————————————————————————————————————— coiled cable

const coilGeometry = (a: THREE.Vector3, b: THREE.Vector3) => {
	const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0.06, -0.1, 0.12));
	const path = new THREE.CatmullRomCurve3([a, a.clone().add(new THREE.Vector3(0.02, -0.12, 0.08)), mid, b.clone().add(new THREE.Vector3(0.04, 0.12, 0.06)), b]);
	const frames = path.computeFrenetFrames(200, false);
	const turns = Math.max(18, Math.round(path.getLength() * 55));
	const pts: THREE.Vector3[] = [];
	const N = turns * 14;
	for (let i = 0; i <= N; i++) {
		const t = i / N;
		const fi = Math.min(199, Math.floor(t * 199));
		const p = path.getPointAt(t);
		const ang = t * turns * Math.PI * 2;
		const n = frames.normals[fi];
		const bn = frames.binormals[fi];
		pts.push(p.add(n.clone().multiplyScalar(Math.cos(ang) * 0.022)).add(bn.clone().multiplyScalar(Math.sin(ang) * 0.022)));
	}
	return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), N, 0.0055, 6, false);
};

const Coil: React.FC<{from: THREE.Vector3; to: THREE.Vector3}> = ({from, to}) => {
	const key = `${from.toArray().map((v) => v.toFixed(2))}-${to.toArray().map((v) => v.toFixed(2))}`;
	const geo = useMemo(() => coilGeometry(from, to), [key]); // eslint-disable-line react-hooks/exhaustive-deps
	return <mesh geometry={geo} material={flat('#0D0D0F', 0.35, 0.2)} castShadow />;
};

// ——————————————————————————————————————————————— cabinet

const Cabinet: React.FC<{spec: MachineSpec}> = ({spec}) => {
	const t = spec.tower!;
	const body = paint(spec.cabinet ?? spec.body);
	const plateMat = useMemo(() => (spec.plate ? new THREE.MeshStandardMaterial({map: modelPlate(spec.plate), roughness: 0.4}) : null), [spec.plate]);
	const sympsMat = useMemo(() => new THREE.MeshStandardMaterial({map: sympsPlate(), roughness: 0.35}), []);
	return (
		<group>
			<Box size={[t.w, t.h, t.d]} pos={[0, t.h / 2, 0]} mat={body} r={0.012} />
			{/* lid */}
			<Box size={[t.w - 0.01, 0.012, t.d - 0.01]} pos={[0, t.h + 0.004, 0]} mat={steel()} r={0.003} />
			{/* brushed-steel strip with red pinstripes (+z face, right edge) */}
			{spec.steelStrip && (
				<group position={[t.w / 2 - 0.07, t.h / 2, t.d / 2 + 0.003]}>
					<Box size={[0.13, t.h - 0.02, 0.006]} mat={steel()} r={0.002} />
					{[-0.05, -0.043].map((x) => (
						<Box key={x} size={[0.003, t.h - 0.1, 0.002]} pos={[x, 0, 0.004]} mat={paint('#B0122A')} r={0.0008} />
					))}
					<Box size={[0.003, t.h * 0.35, 0.002]} pos={[0.045, -t.h * 0.25, 0.004]} mat={paint('#B0122A')} r={0.0008} />
					<Box size={[0.05, 0.003, 0.002]} pos={[0.02, -t.h * 0.075, 0.004]} mat={paint('#B0122A')} r={0.0008} />
				</group>
			)}
			{spec.controlPanel && (
				<group position={[t.w / 2 - 0.045, t.h - 0.2, t.d / 2 + 0.009]}>
					<Box size={[0.055, 0.28, 0.008]} mat={paint(spec.controlPanel === 'red' ? '#A8142A' : '#141416')} r={0.004} />
					<Cyl r={0.013} h={0.012} pos={[0, 0.1, 0.008]} rot={[Math.PI / 2, 0, 0]} mat={paint('#D11F2E')} />
					<Cyl r={0.013} h={0.012} pos={[0, 0.055, 0.008]} rot={[Math.PI / 2, 0, 0]} mat={paint('#1E8F4E')} />
					<Box size={[0.05, 0.05, 0.012]} pos={[0, -0.01, 0.008]} mat={paint('#F2C000')} r={0.006} />
					<Cyl r={0.019} r2={0.015} h={0.022} pos={[0, -0.01, 0.022]} rot={[Math.PI / 2, 0, 0]} mat={paint('#D11F2E')} />
					<Box size={[0.022, 0.03, 0.01]} pos={[0, -0.08, 0.008]} mat={plasticBlack()} r={0.003} />
				</group>
			)}
			{/* model plate on the wall-side face */}
			{plateMat && (
				<mesh position={[-t.w / 2 - 0.002, t.h * 0.72, 0.02]} rotation={[0, -Math.PI / 2, 0]} material={plateMat}>
					<planeGeometry args={[0.16, 0.094]} />
				</mesh>
			)}
			{/* SYMP'S plate + door handle on the back (-z) */}
			{spec.sympsPlate && (
				<>
					<mesh position={[0, t.h * 0.72, -t.d / 2 - 0.002]} rotation={[0, Math.PI, 0]} material={sympsMat}>
						<planeGeometry args={[t.w * 0.62, t.w * 0.44]} />
					</mesh>
					<Box size={[0.02, 0.1, 0.012]} pos={[t.w / 2 - 0.04, t.h * 0.55, -t.d / 2 - 0.004]} mat={steel()} r={0.004} />
				</>
			)}
			{spec.swoosh && (
				<group position={[0.02, t.h + 0.2, 0]} rotation={[0, 0, -0.5]}>
					<Box size={[0.07, 0.55, t.d * 0.8]} mat={paint(spec.swoosh)} r={0.01} />
				</group>
			)}
			{/* aviation connector on the wall side */}
			<group position={[-t.w / 2 - 0.02, t.h - 0.06, t.d / 2 - 0.05]} rotation={[0, 0, Math.PI / 2]}>
				<Cyl r={0.022} h={0.04} mat={flat('#9A9EA4', 0.25, 1)} />
				<Cyl r={0.017} h={0.03} pos={[0, 0.03, 0]} mat={flat('#6D7177', 0.3, 1)} />
			</group>
		</group>
	);
};

// ——————————————————————————————————————————————— screen on its arm

const ScreenArm: React.FC<{y: number}> = ({y}) => {
	const scr = useMemo(() => new THREE.MeshBasicMaterial({map: screenTexture(), toneMapped: false}), []);
	return (
		<group position={[0.03, y, 0.03]}>
			<Box size={[0.05, 0.05, 0.05]} mat={plasticWhite()} r={0.01} />
			<group rotation={[0, 0.5, 0.5]}>
				<Box size={[0.3, 0.045, 0.045]} pos={[0.13, 0, 0]} mat={plasticWhite()} r={0.02} />
			</group>
			<group position={[0.24, 0.13, 0.13]} rotation={[-0.15, 0.55, 0]}>
				<Box size={[0.28, 0.185, 0.022]} mat={plasticBlack()} r={0.008} />
				<mesh position={[0, 0, 0.0115]} material={scr}>
					<planeGeometry args={[0.255, 0.16]} />
				</mesh>
				<mesh position={[0, 0, 0.012]} material={glassScreen()} >
					<planeGeometry args={[0.255, 0.16]} />
				</mesh>
			</group>
		</group>
	);
};

// ——————————————————————————————————————————————— machine

/** Where the parts of a machine are, for a given state (used by cameras to frame details). */
export const layout = (spec: MachineSpec, state: MachineState = {}) => {
	const {head = 0, mast = 1} = state;
	const [cw, cd] = spec.chassisSize;
	const r = spec.wheelR;
	const deckY = r + 0.03;
	const t = spec.tower;
	const towerX = t ? cw / 2 - t.w / 2 - 0.02 : 0;
	const towerZ = t ? -cd / 2 + t.d / 2 + 0.06 : 0;
	const mastX = t ? towerX - t.w / 2 - 0.03 : -0.1;
	const mastZ = t ? towerZ - t.d / 2 + 0.05 : 0;
	const retracted = t ? t.h + deckY + 0.1 : 1.0;
	const mastH = retracted + (spec.mast - retracted) * mast;
	const unitLow = deckY + 0.04;
	const unitHigh = mastH - 0.42;
	const unitY = unitLow + (unitHigh - unitLow) * head;
	const unitX = mastX - 0.19;
	const unitZ = mastZ + 0.08;
	return {cw, cd, r, deckY, t, towerX, towerZ, mastX, mastZ, mastH, unitX, unitY, unitZ,
		wheel: new THREE.Vector3(cw / 2 + r * 0.25, r, cd / 2 - r * 0.9),
		caps: new THREE.Vector3(unitX + 0.05, unitY + 0.26, unitZ),
		nozzle: new THREE.Vector3(unitX - 0.16, unitY + 0.07, unitZ),
		panel: t ? new THREE.Vector3(towerX + t.w / 2 - 0.045, deckY + t.h - 0.2, towerZ + t.d / 2 + 0.02) : new THREE.Vector3(0, 0.5, 0),
		top: new THREE.Vector3(mastX, mastH, mastZ),
	};
};

export const Machine3D: React.FC<{spec: MachineSpec; state?: MachineState}> = ({spec, state = {}}) => {
	const {spin = 0, explode = 0, uv = 0} = state;
	const {cw, cd, r, deckY, t, towerX, towerZ, mastX, mastZ, mastH, unitX, unitY, unitZ} = layout(spec, state);
	const e = explode;

	const connector = new THREE.Vector3(towerX - (t?.w ?? 0) / 2 - 0.04 - e * 0.1, deckY + (t?.h ?? 0.6) - 0.06 + e * 0.35, towerZ + (t?.d ?? 0) / 2 - 0.05);
	const unitTop = new THREE.Vector3(unitX + 0.1 - e * 0.45, unitY + 0.2 + e * 0.05, unitZ + 0.1);

	return (
		<group>
			{/* wheels */}
			{[
				[-1, -1],
				[1, -1],
				[-1, 1],
				[1, 1],
			].map(([sx, sz]) => (
				<group key={`${sx}${sz}`} position={[sx * (cw / 2 + r * 0.25 + e * 0.7), r - e * 0.05, sz * (cd / 2 - r * 0.9 + e * 0.5)]} rotation={[0, sx * e * 1.2, 0]}>
					<Wheel r={r} style={spec.wheel} spin={spin} side={sx as 1 | -1} />
				</group>
			))}
			{/* chassis */}
			<group position={[0, -e * 0.25, 0]} rotation={[e * 0.25, 0, 0]}>
				<Box size={[cw, 0.05, cd]} pos={[0, deckY - 0.025, 0]} mat={paint(spec.chassis ?? spec.body)} r={0.008} />
				{/* red handles */}
				<Box size={[0.12, 0.05, 0.02]} pos={[0.05, deckY + 0.02, cd / 2 + 0.005]} rot={[0, 0, 0.25]} mat={paint(spec.accent)} r={0.006} />
				<Box size={[0.2, 0.04, 0.015]} pos={[0, deckY + 0.02, -cd / 2 - 0.003]} mat={paint(spec.accent)} r={0.005} />
			</group>
			{/* cabinet */}
			{t && (
				<group position={[towerX + e * 0.6, deckY + e * 1.1, towerZ - e * 0.3]} rotation={[0, e * 0.9, e * 0.2]}>
					<Cabinet spec={spec} />
				</group>
			)}
			{/* mast */}
			<group position={[-e * 0.35, e * 1.6, 0]} rotation={[0, 0, -e * 0.25]}>
				<Mast spec={spec} height={mastH - deckY} x={mastX} z={mastZ} />
			</group>
			{/* print unit */}
			<group position={[unitX - e * 1.3, unitY + e * 0.45, unitZ + e * 0.4]} rotation={[e * 0.6, e * 1.1, 0]}>
				<PrintUnit spec={spec} uv={uv} />
			</group>
			{/* cable */}
			{t && e < 0.02 && <Coil from={connector} to={unitTop} />}
			{/* screen */}
			{spec.screen && (
				<group position={[mastX + e * 0.5, e * 1.4, mastZ + e * 0.6]} rotation={[0, -e * 1.2, 0]}>
					<ScreenArm y={Math.min(mastH - 0.3, deckY + (t?.h ?? 0.8) + 0.45)} />
				</group>
			)}
		</group>
	);
};
