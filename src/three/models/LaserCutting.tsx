import React, {useMemo} from 'react';
import {AdditiveBlending} from 'three';
import {makeCanvas, paintWood, toTexture} from '../textures';

const W = 768;
const SHEET = 2.2;

/** Cut path: the logo's eye — outer ring, then the pupil. t ∈ [0,1] → canvas point. */
const pathPoint = (t: number) => {
	const cx = W / 2;
	const cy = W / 2;
	if (t < 0.62) {
		const a = -Math.PI / 2 + (t / 0.62) * Math.PI * 2;
		return {x: cx + Math.cos(a) * 250, y: cy + Math.sin(a) * 250};
	}
	const u = Math.min(1, (t - 0.62) / 0.38);
	const a = -Math.PI / 2 + u * Math.PI * 2;
	return {x: cx + Math.cos(a) * 95, y: cy + Math.sin(a) * 95};
};

/** Glow sprite texture for the laser spot. */
const useGlow = () =>
	useMemo(() => {
		const {c, ctx} = makeCanvas(128, 128);
		const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
		g.addColorStop(0, 'rgba(255,255,255,1)');
		g.addColorStop(0.15, 'rgba(255,200,120,0.9)');
		g.addColorStop(0.4, 'rgba(255,80,20,0.35)');
		g.addColorStop(1, 'rgba(255,40,0,0)');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, 128, 128);
		return toTexture(c);
	}, []);

/**
 * A laser head tracing the Vision Urbaine eye into a plywood sheet.
 * `cut` 0→1 is the progress of the job.
 */
export const LaserCutting: React.FC<{cut: number; frame: number}> = ({cut, frame}) => {
	const base = useMemo(() => paintWood(W, W, 13, 'birch'), []);
	const {canvas, tex} = useMemo(() => {
		const {c} = makeCanvas(W, W);
		return {canvas: c, tex: toTexture(c)};
	}, []);
	const glow = useGlow();

	// repaint the sheet with the kerf cut so far (deterministic per frame)
	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(base, 0, 0);
	ctx.strokeStyle = '#2a1407';
	ctx.lineWidth = 12;
	ctx.lineCap = 'round';
	ctx.shadowColor = 'rgba(90,40,10,0.6)';
	ctx.shadowBlur = 8;
	ctx.beginPath();
	const steps = Math.floor(cut * 400);
	for (let k = 0; k <= steps; k++) {
		const t = k / 400;
		const p = pathPoint(t);
		const prev = k > 0 ? pathPoint((k - 1) / 400) : null;
		if (!prev || Math.hypot(p.x - prev.x, p.y - prev.y) > 30) ctx.moveTo(p.x, p.y);
		else ctx.lineTo(p.x, p.y);
	}
	ctx.stroke();
	ctx.shadowBlur = 0;
	tex.needsUpdate = true;

	const head = pathPoint(Math.min(cut, 0.999));
	const hx = (head.x / W - 0.5) * SHEET;
	const hy = -(head.y / W - 0.5) * SHEET;
	const active = cut > 0.001 && cut < 0.999;
	const flicker = 0.8 + 0.2 * Math.sin(frame * 2.3) * Math.sin(frame * 0.7);

	return (
		<group rotation={[-0.95, 0, 0]}>
			<mesh>
				<boxGeometry args={[SHEET, SHEET, 0.05]} />
				<meshStandardMaterial attach="material-0" color="#c9a878" roughness={0.8} />
				<meshStandardMaterial attach="material-1" color="#c9a878" roughness={0.8} />
				<meshStandardMaterial attach="material-2" color="#c9a878" roughness={0.8} />
				<meshStandardMaterial attach="material-3" color="#c9a878" roughness={0.8} />
				<meshStandardMaterial attach="material-4" map={tex} roughness={0.75} />
				<meshStandardMaterial attach="material-5" color="#c9a878" roughness={0.8} />
			</mesh>
			{/* laser head (gantry carriage) */}
			<group position={[hx, hy, 0.62]}>
				<mesh>
					<boxGeometry args={[0.34, 0.26, 0.5]} />
					<meshStandardMaterial color="#2b2d31" metalness={0.7} roughness={0.3} />
				</mesh>
				<mesh position={[0, 0, -0.29]} rotation={[Math.PI / 2, 0, 0]}>
					<cylinderGeometry args={[0.06, 0.08, 0.08, 24]} />
					<meshStandardMaterial color="#9a9ca2" metalness={1} roughness={0.2} />
				</mesh>
				{/* gantry rail */}
				<mesh position={[-hx, 0, 0.1]}>
					<boxGeometry args={[SHEET + 0.3, 0.1, 0.08]} />
					<meshStandardMaterial color="#3a3c40" metalness={0.8} roughness={0.3} />
				</mesh>
			</group>
			{active ? (
				<>
					<mesh position={[hx, hy, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
						<cylinderGeometry args={[0.008, 0.008, 0.56, 8]} />
						<meshBasicMaterial color="#ff6a3a" transparent opacity={0.8 * flicker} blending={AdditiveBlending} toneMapped={false} />
					</mesh>
					<mesh position={[hx, hy, 0.04]}>
						<planeGeometry args={[0.8 * flicker, 0.8 * flicker]} />
						<meshBasicMaterial map={glow} transparent blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
					</mesh>
				</>
			) : null}
		</group>
	);
};
