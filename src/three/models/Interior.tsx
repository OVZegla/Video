import React, {useMemo} from 'react';
import {AdditiveBlending, ExtrudeGeometry, Path, Shape, Vector2} from 'three';
import {makeCanvas, paintWood, rng, toTexture} from '../textures';
import {C} from '../../theme';
import {roundedSlab, Standoff} from './Acrylic';

/* Large-scale interior pieces, after the Vision Urbaine showroom wall. */

const NAVY_LACQUER = {color: '#101a4a', roughness: 0.28, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.12} as const;

/* ------------------------------------------------ claustra: oak slats on a lacquered panel */

const pillShape = (w: number, h: number) => {
	const r = w / 2;
	const s = new Shape();
	s.moveTo(-r, -h / 2);
	s.lineTo(r, -h / 2);
	s.lineTo(r, h / 2 - r);
	s.absarc(0, h / 2 - r, r, 0, Math.PI, false);
	s.lineTo(-r, -h / 2);
	return s;
};

export const Claustra: React.FC<{rotY: number}> = ({rotY}) => {
	const back = useMemo(() => {
		const g = new ExtrudeGeometry(pillShape(1.5, 2.3), {depth: 0.06, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 3, curveSegments: 32});
		g.translate(0, 0, -0.03);
		return g;
	}, []);
	const oak = useMemo(() => {
		const t = toTexture(paintWood(256, 1024, 31, 'oak'));
		return t;
	}, []);
	const slats = 8;
	return (
		<group rotation={[0, rotY, 0]}>
			<mesh geometry={back}>
				<meshPhysicalMaterial {...NAVY_LACQUER} />
			</mesh>
			{Array.from({length: slats}, (_, k) => {
				const x = -0.56 + (k * 1.12) / (slats - 1);
				// slats follow the pill's arched top
				const top = 1.15 - 0.75 + Math.sqrt(Math.max(0, 0.75 * 0.75 - x * x)) - 0.08;
				const bottom = -1.15 + 0.08;
				const h = top - bottom;
				return (
					<mesh key={k} position={[x, bottom + h / 2, 0.1]}>
						<boxGeometry args={[0.085, h, 0.1]} />
						<meshStandardMaterial map={oak} roughness={0.6} />
					</mesh>
				);
			})}
		</group>
	);
};

/* ------------------------------------------------ backlit organic panel + laser-cut tree of life */

const blobShape = () => {
	const pts: Vector2[] = [];
	const N = 9;
	const r = rng(8);
	for (let k = 0; k < N; k++) {
		const a = (k / N) * Math.PI * 2;
		const rad = 1 + (r() - 0.5) * 0.35;
		pts.push(new Vector2(Math.cos(a) * rad * 0.95, Math.sin(a) * rad * 1.15));
	}
	const s = new Shape();
	s.moveTo(pts[0].x, pts[0].y);
	s.splineThru([...pts.slice(1), pts[0]]);
	return s;
};

const useTreeOfLife = () =>
	useMemo(() => {
		const W = 1024;
		const {c, ctx} = makeCanvas(W, W);
		ctx.drawImage(paintWood(W, W, 44, 'oak'), 0, 0);
		const ink = '#24120a';
		ctx.strokeStyle = ink;
		ctx.fillStyle = ink;
		ctx.lineCap = 'round';
		// engraved border ring
		ctx.lineWidth = 18;
		ctx.beginPath();
		ctx.arc(W / 2, W / 2, W / 2 - 40, 0, Math.PI * 2);
		ctx.stroke();
		const r = rng(5);
		const branch = (x: number, y: number, len: number, ang: number, w: number, depth: number, dir: 1 | -1) => {
			if (depth === 0 || len < 6) return;
			const x2 = x + Math.cos(ang) * len;
			const y2 = y + Math.sin(ang) * len * dir;
			ctx.lineWidth = w;
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x2, y2);
			ctx.stroke();
			const n = depth > 6 ? 2 : 3;
			for (let k = 0; k < n; k++) {
				const spread = 0.35 + r() * 0.35;
				const a = ang + (k - (n - 1) / 2) * spread + (r() - 0.5) * 0.2;
				branch(x2, y2, len * (0.68 + r() * 0.1), a, w * 0.68, depth - 1, dir);
			}
		};
		// crown
		branch(W / 2, W * 0.6, 150, -Math.PI / 2, 46, 9, 1);
		// roots
		branch(W / 2, W * 0.6, 70, -Math.PI / 2, 40, 6, -1);
		// leaves as dots on the crown
		for (let k = 0; k < 600; k++) {
			const a = r() * Math.PI * 2;
			const d = Math.sqrt(r()) * 300;
			const x = W / 2 + Math.cos(a) * d;
			const y = W * 0.36 + Math.sin(a) * d * 0.72;
			if (Math.hypot(x - W / 2, y - W / 2) > W / 2 - 70) continue;
			ctx.beginPath();
			ctx.arc(x, y, 5 + r() * 7, 0, Math.PI * 2);
			ctx.fill();
		}
		// ground line
		ctx.lineWidth = 12;
		ctx.beginPath();
		ctx.moveTo(W * 0.2, W * 0.62);
		ctx.lineTo(W * 0.8, W * 0.62);
		ctx.stroke();
		return toTexture(c);
	}, []);

/** Warm LED halo: the blob outline, blurred, painted additively behind the panel. */
const useHalo = (shape: Shape) =>
	useMemo(() => {
		const S = 512;
		const {c, ctx} = makeCanvas(S, S);
		const pts = shape.getPoints(80);
		ctx.filter = 'blur(26px)';
		ctx.fillStyle = 'rgba(255,214,150,0.95)';
		ctx.beginPath();
		pts.forEach((p, k) => {
			const x = S / 2 + (p.x / 1.6) * (S / 2) * 0.82;
			const y = S / 2 - (p.y / 1.6) * (S / 2) * 0.82;
			if (k === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		});
		ctx.closePath();
		ctx.fill();
		return toTexture(c);
	}, [shape]);

export const BacklitPanel: React.FC<{rotY: number; glow: number}> = ({rotY, glow}) => {
	const shape = useMemo(blobShape, []);
	const geom = useMemo(() => {
		const g = new ExtrudeGeometry(shape, {depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 40});
		g.translate(0, 0, -0.04);
		return g;
	}, [shape]);
	const tree = useTreeOfLife();
	const halo = useHalo(shape);
	return (
		<group rotation={[0, rotY, 0]}>
			<mesh position={[0, 0, -0.12]} scale={[1.18, 1.18, 1]}>
				<planeGeometry args={[3.2, 3.2]} />
				<meshBasicMaterial map={halo} transparent blending={AdditiveBlending} depthWrite={false} opacity={glow} toneMapped={false} />
			</mesh>
			<mesh geometry={geom}>
				<meshPhysicalMaterial {...NAVY_LACQUER} />
			</mesh>
			{/* laser-cut oak medallion */}
			{/* the cap's UVs run sideways: turn the disc a quarter so the tree stands upright */}
			<group position={[0, 0.05, 0.1]} rotation={[0, 0, Math.PI / 2]}>
				<mesh rotation={[Math.PI / 2, 0, 0]}>
					<cylinderGeometry args={[0.72, 0.72, 0.06, 96]} />
					<meshStandardMaterial attach="material-0" color="#6b4424" roughness={0.8} />
					<meshStandardMaterial attach="material-1" map={tree} roughness={0.6} />
					<meshStandardMaterial attach="material-2" color="#6b4424" roughness={0.8} />
				</mesh>
			</group>
		</group>
	);
};

/* ------------------------------------------------ laser-cut corten steel screen, backlit */

const screenShape = (w: number, h: number) => {
	const s = new Shape();
	s.moveTo(-w / 2, -h / 2);
	s.lineTo(w / 2, -h / 2);
	s.lineTo(w / 2, h / 2);
	s.lineTo(-w / 2, h / 2);
	s.lineTo(-w / 2, -h / 2);
	const cols = 3;
	const rows = 5;
	const cell = 0.34;
	const r = rng(12);
	const poly = (pts: [number, number][]) => {
		const p = new Path();
		pts.forEach(([x, y], k) => (k === 0 ? p.moveTo(x, y) : p.lineTo(x, y)));
		s.holes.push(p);
	};
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const cx = (col - (cols - 1) / 2) * (cell + 0.06);
			const cy = (row - (rows - 1) / 2) * (cell + 0.06);
			const q = cell / 2 - 0.03;
			const kind = Math.floor(r() * 4);
			const rot = Math.floor(r() * 4) * (Math.PI / 2);
			const R = (x: number, y: number): [number, number] => [cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)];
			if (kind === 0) {
				poly(Array.from({length: 32}, (_, k) => R(Math.cos((k / 32) * Math.PI * 2) * q, Math.sin((k / 32) * Math.PI * 2) * q)));
			} else if (kind === 1) {
				// quarter disc
				poly([R(-q, -q), ...Array.from({length: 17}, (_, k) => R(-q + Math.cos((k / 16) * (Math.PI / 2)) * 2 * q, -q + Math.sin((k / 16) * (Math.PI / 2)) * 2 * q))]);
			} else if (kind === 2) {
				poly([R(-q, -q), R(q, -q), R(-q, q)]);
			} else {
				// half disc
				poly(Array.from({length: 17}, (_, k) => R(Math.cos((k / 16) * Math.PI) * q, -q * 0.3 + Math.sin((k / 16) * Math.PI) * q)));
			}
		}
	}
	return s;
};

const useCorten = () =>
	useMemo(() => {
		const W = 512;
		const {c, ctx} = makeCanvas(W, W);
		ctx.fillStyle = '#8a4521';
		ctx.fillRect(0, 0, W, W);
		const r = rng(77);
		// fine granular patina rather than large blotches
		for (let k = 0; k < 14000; k++) {
			const v = r();
			ctx.fillStyle =
				v < 0.45 ? `rgba(168,88,40,${0.25 + r() * 0.35})` : v < 0.85 ? `rgba(92,40,16,${0.2 + r() * 0.3})` : `rgba(196,120,60,${0.2 + r() * 0.3})`;
			ctx.fillRect(r() * W, r() * W, 1 + r() * 3, 1 + r() * 3);
		}
		// faint run marks
		for (let k = 0; k < 40; k++) {
			ctx.fillStyle = `rgba(70,30,12,${0.08 + r() * 0.1})`;
			ctx.fillRect(r() * W, r() * W, 1 + r() * 2, 20 + r() * 80);
		}
		return toTexture(c);
	}, []);

const useWarmGlow = () =>
	useMemo(() => {
		const {c, ctx} = makeCanvas(256, 256);
		const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
		g.addColorStop(0, 'rgba(255,220,160,1)');
		g.addColorStop(0.6, 'rgba(255,170,90,0.55)');
		g.addColorStop(1, 'rgba(255,140,60,0)');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, 256, 256);
		return toTexture(c);
	}, []);

export const MetalScreen: React.FC<{rotY: number; glow: number}> = ({rotY, glow}) => {
	const geom = useMemo(() => {
		const g = new ExtrudeGeometry(screenShape(1.3, 2.05), {depth: 0.03, bevelEnabled: false, curveSegments: 12});
		g.translate(0, 0, -0.015);
		const uv = g.attributes.uv;
		const pos = g.attributes.position;
		for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / 1.3 + 0.5, pos.getY(i) / 2.05 + 0.5);
		return g;
	}, []);
	const rust = useCorten();
	const warm = useWarmGlow();
	return (
		<group rotation={[0, rotY, 0]}>
			<mesh position={[0, 0, -0.25]}>
				<planeGeometry args={[1.9, 2.6]} />
				<meshBasicMaterial map={warm} transparent blending={AdditiveBlending} depthWrite={false} opacity={glow} toneMapped={false} />
			</mesh>
			<mesh geometry={geom}>
				<meshStandardMaterial attach="material-0" map={rust} roughness={0.85} metalness={0.45} />
				<meshStandardMaterial attach="material-1" color="#4a200c" roughness={0.7} metalness={0.6} />
			</mesh>
			{/* floor foot */}
			<mesh position={[0, -1.06, 0]}>
				<boxGeometry args={[1.4, 0.08, 0.4]} />
				<meshStandardMaterial color="#2a2a2c" metalness={0.8} roughness={0.35} />
			</mesh>
		</group>
	);
};

/* ------------------------------------------------ red acrylic nameplate (showroom sample) */

export const RedAcrylicPlate: React.FC<{rotY: number}> = ({rotY}) => {
	const slab = useMemo(() => roundedSlab(1.2, 1.2, 0.1, 0.06), []);
	return (
		<group rotation={[0, rotY, 0]}>
			<mesh geometry={slab}>
				<meshPhysicalMaterial color={C.red} roughness={0.08} clearcoat={1} transmission={0.2} thickness={0.1} />
			</mesh>
			{[
				[-0.45, 0.45],
				[0.45, 0.45],
				[-0.45, -0.45],
				[0.45, -0.45],
			].map(([x, y], k) => (
				<Standoff key={k} x={x} y={y} z={0.08} />
			))}
		</group>
	);
};

/* ------------------------------------------------ palm-leaf claustra (laser-cut room divider) */

/**
 * Cut pattern: sweeping palm leaves, each a curved midrib with tapered slots
 * on both sides (the slots are the holes), overlapping like the client's
 * divider. White = material, black = cut.
 */
const usePalmCut = () =>
	useMemo(() => {
		const W = 600;
		const H = 1400;
		const {c, ctx} = makeCanvas(W, H);
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, W, H);
		ctx.fillStyle = '#000000';
		ctx.strokeStyle = '#000000';
		ctx.lineCap = 'round';
		const r = rng(19);
		/**
		 * One palm frond: slots are filled crescents between neighbouring ribs,
		 * wide and sweeping, so the remaining material reads as bold leaf ribs.
		 */
		const leaf = (x0: number, y0: number, ang: number, len: number, bend: number) => {
			const x2 = x0 + Math.cos(ang) * len;
			const y2 = y0 + Math.sin(ang) * len;
			const mx = (x0 + x2) / 2 + Math.cos(ang + Math.PI / 2) * bend;
			const my = (y0 + y2) / 2 + Math.sin(ang + Math.PI / 2) * bend;
			const P = (t: number) => ({
				x: (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x2,
				y: (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * my + t * t * y2,
			});
			const ribs = 8;
			const rib = 12; // material left between slots (px)
			const stem = 10; // half-width of the solid midrib
			for (const side of [-1, 1]) {
				for (let k = 0; k < ribs; k++) {
					const t0 = 0.08 + (k / ribs) * 0.86;
					const t1 = 0.08 + ((k + 1) / ribs) * 0.86;
					const tm = (t0 + t1) / 2;
					const reach = len * 0.5 * Math.sin(Math.PI * Math.min(0.98, tm * 1.05)) + 30;
					// slot outline: from the midrib, sweep out and back towards the tip
					const pa = P(t0);
					const pb = P(t1);
					const dirA = Math.atan2(P(t0 + 0.01).y - pa.y, P(t0 + 0.01).x - pa.x);
					const dirB = Math.atan2(P(t1 + 0.01).y - pb.y, P(t1 + 0.01).x - pb.x);
					const nA = dirA + side * Math.PI / 2;
					const nB = dirB + side * Math.PI / 2;
					const sweep = side * -0.75; // ribs lean towards the tip
					const a0x = pa.x + Math.cos(nA) * stem + Math.cos(dirA) * rib * 0.5;
					const a0y = pa.y + Math.sin(nA) * stem + Math.sin(dirA) * rib * 0.5;
					const b0x = pb.x + Math.cos(nB) * stem - Math.cos(dirB) * rib * 0.5;
					const b0y = pb.y + Math.sin(nB) * stem - Math.sin(dirB) * rib * 0.5;
					const outA = nA - sweep * 0.9;
					const outB = nB - sweep * 0.9;
					const a1x = a0x + Math.cos(outA) * reach;
					const a1y = a0y + Math.sin(outA) * reach;
					const b1x = b0x + Math.cos(outB) * reach * 1.02;
					const b1y = b0y + Math.sin(outB) * reach * 1.02;
					const bow = reach * 0.22;
					ctx.beginPath();
					ctx.moveTo(a0x, a0y);
					ctx.quadraticCurveTo(
						(a0x + a1x) / 2 + Math.cos(outA + side * Math.PI / 2) * bow,
						(a0y + a1y) / 2 + Math.sin(outA + side * Math.PI / 2) * bow,
						a1x,
						a1y,
					);
					ctx.quadraticCurveTo((a1x + b1x) / 2, (a1y + b1y) / 2, b1x, b1y);
					ctx.quadraticCurveTo(
						(b0x + b1x) / 2 + Math.cos(outB + side * Math.PI / 2) * bow,
						(b0y + b1y) / 2 + Math.sin(outB + side * Math.PI / 2) * bow,
						b0x,
						b0y,
					);
					ctx.closePath();
					ctx.fill();
				}
			}
		};
		const leaves = [
			[60, 120, 0.35, 520, 70],
			[560, 420, 3.5, 520, -80],
			[40, 640, 0.1, 520, -70],
			[560, 900, 3.3, 500, 70],
			[60, 1180, -0.2, 520, 60],
			[420, 1380, -2.2, 360, -50],
			[500, 40, 2.6, 330, 40],
		];
		for (const [x, y, a, l, b] of leaves) leaf(x, y, a + (r() - 0.5) * 0.08, l, b);
		// re-draw the frond midribs as solid material so fronds stay connected
		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 16;
		ctx.lineCap = 'round';
		for (const [x0, y0, a, l, b] of leaves) {
			const x2 = x0 + Math.cos(a) * l;
			const y2 = y0 + Math.sin(a) * l;
			const mx = (x0 + x2) / 2 + Math.cos(a + Math.PI / 2) * b;
			const my = (y0 + y2) / 2 + Math.sin(a + Math.PI / 2) * b;
			ctx.beginPath();
			ctx.moveTo(x0, y0);
			ctx.quadraticCurveTo(mx, my, x2, y2);
			ctx.stroke();
		}
		// solid border for the frame rebate
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, W, 18);
		ctx.fillRect(0, H - 18, W, 18);
		ctx.fillRect(0, 0, 18, H);
		ctx.fillRect(W - 18, 0, 18, H);
		return toTexture(c, false);
	}, []);

export const PalmClaustra: React.FC<{rotY: number; glow: number}> = ({rotY, glow}) => {
	const cut = usePalmCut();
	const mdf = useMemo(() => toTexture(paintWood(300, 700, 23, 'oak')), []);
	const oak = useMemo(() => toTexture(paintWood(128, 1024, 29, 'oak')), []);
	const warm = useWarmGlow();
	const w = 1.1;
	const h = 2.4;
	// stacked cut planes give the panel real thickness and visible kerf walls
	const layers = 7;
	return (
		<group rotation={[0, rotY, 0]}>
			<mesh position={[0, 0, -0.35]}>
				<planeGeometry args={[1.8, 3]} />
				<meshBasicMaterial map={warm} transparent blending={AdditiveBlending} depthWrite={false} opacity={glow} toneMapped={false} />
			</mesh>
			{Array.from({length: layers}, (_, k) => {
				const z = -0.03 + (k * 0.06) / (layers - 1);
				const face = k === layers - 1;
				return (
					<mesh key={k} position={[0, 0, z]}>
						<planeGeometry args={[w, h]} />
						<meshStandardMaterial map={mdf} alphaMap={cut} alphaTest={0.5} color={face ? '#ffffff' : '#9c7550'} roughness={0.8} side={2} />
					</mesh>
				);
			})}
			{/* oak frame */}
			{[
				[0, h / 2 + 0.04, w + 0.16, 0.08],
				[0, -h / 2 - 0.04, w + 0.16, 0.08],
				[-w / 2 - 0.04, 0, 0.08, h + 0.16],
				[w / 2 + 0.04, 0, 0.08, h + 0.16],
			].map(([x, y, fw, fh], k) => (
				<mesh key={k} position={[x, y, 0]}>
					<boxGeometry args={[fw, fh, 0.12]} />
					<meshStandardMaterial map={oak} roughness={0.55} />
				</mesh>
			))}
		</group>
	);
};
