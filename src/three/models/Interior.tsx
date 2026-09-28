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
