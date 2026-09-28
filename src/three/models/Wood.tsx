import React, {useMemo} from 'react';
import {ExtrudeGeometry, Path, Shape} from 'three';
import {makeCanvas, paintWood, rng, toTexture, useImage} from '../textures';
import {drawEye, drawLogoMono} from '../paint';
import {FONT} from '../../theme';
import {roundedSlab} from './Acrylic';

const BURN = '#3a1c0b';

/* ------------------------------------------------ laser-engraved oak board */

const useEngravedOak = () => {
	const logo = useImage('brand/vision-urbaine-logo.png');
	return useMemo(() => {
		if (!logo) return null;
		const W = 768;
		const H = 1024;
		const wood = paintWood(W, H, 21, 'oak');
		const {c, ctx} = makeCanvas(W, H);
		ctx.drawImage(wood, 0, 0);
		// engraving on its own layer, then burnt in with a soft halo
		const {c: e, ctx: ex} = makeCanvas(W, H);
		drawEye(ex, W / 2, 330, 170, {ring: BURN, pupil: BURN, sector: '#5a2e12'});
		drawLogoMono(ex, logo, W * 0.12, 590, W * 0.76, BURN);
		ex.fillStyle = BURN;
		ex.font = `500 40px ${FONT}`;
		ex.textAlign = 'center';
		ex.fillText('ATELIER  ·  BÉTHUNE', W / 2, 780);
		ex.fillRect(W / 2 - 120, 820, 240, 5);
		ctx.save();
		ctx.shadowColor = 'rgba(80,35,10,0.55)';
		ctx.shadowBlur = 6;
		ctx.globalAlpha = 0.92;
		ctx.drawImage(e, 0, 0);
		ctx.restore();
		// bump: engraving sits lower than the surface
		const {c: b, ctx: bx} = makeCanvas(W, H);
		bx.fillStyle = '#fff';
		bx.fillRect(0, 0, W, H);
		bx.filter = 'invert(1)';
		bx.drawImage(e, 0, 0);
		return {map: toTexture(c), bump: toTexture(b, false)};
	}, [logo]);
};

export const WoodPanel: React.FC<{rotY: number}> = ({rotY}) => {
	const w = 1.5;
	const h = 2.0;
	const slab = useMemo(() => roundedSlab(w, h, 0.14, 0.03, 0.02), []);
	const tex = useEngravedOak();
	return (
		<group rotation={[0, rotY, 0]}>
			{tex ? (
				<mesh geometry={slab}>
					<meshStandardMaterial map={tex.map} bumpMap={tex.bump} bumpScale={1.2} roughness={0.62} metalness={0} />
				</mesh>
			) : null}
		</group>
	);
};

/* ------------------------------------------------ laser-cut plywood rosette */

const rosetteShape = () => {
	const R = 1;
	const s = new Shape();
	const N = 360;
	for (let k = 0; k < N; k++) {
		const a = (k / N) * Math.PI * 2;
		const r = R * (0.93 + 0.07 * Math.cos(a * 12));
		const x = r * Math.cos(a);
		const y = r * Math.sin(a);
		if (k === 0) s.moveTo(x, y);
		else s.lineTo(x, y);
	}
	// ring of petal holes
	const petals = 12;
	for (let p = 0; p < petals; p++) {
		const a0 = (p / petals) * Math.PI * 2;
		const hole = new Path();
		const M = 40;
		for (let k = 0; k < M; k++) {
			const t = (k / M) * Math.PI * 2;
			// teardrop in local coords, then rotated/placed
			const lx = 0.62 + 0.2 * Math.cos(t);
			const ly = 0.075 * Math.sin(t) * (1 - 0.55 * Math.cos(t));
			const x = lx * Math.cos(a0) - ly * Math.sin(a0);
			const y = lx * Math.sin(a0) + ly * Math.cos(a0);
			if (k === 0) hole.moveTo(x, y);
			else hole.lineTo(x, y);
		}
		s.holes.push(hole);
	}
	// small circles between petals
	for (let p = 0; p < petals; p++) {
		const a = ((p + 0.5) / petals) * Math.PI * 2;
		// kept clear of the scalloped rim (min radius 0.86) so triangulation stays valid
		const hole = new Path();
		for (let k = 0; k < 24; k++) {
			const t = (k / 24) * Math.PI * 2;
			const x = 0.76 * Math.cos(a) + 0.035 * Math.cos(t);
			const y = 0.76 * Math.sin(a) + 0.035 * Math.sin(t);
			if (k === 0) hole.moveTo(x, y);
			else hole.lineTo(x, y);
		}
		s.holes.push(hole);
	}
	// central eye: ring cut-out with a pupil left as an island is impossible in one piece,
	// so cut a ring with bridges (as a real laser file would)
	for (let q = 0; q < 3; q++) {
		const a0 = (q / 3) * Math.PI * 2 + 0.12;
		const a1 = a0 + (Math.PI * 2) / 3 - 0.24;
		const hole = new Path();
		hole.absarc(0, 0, 0.36, a0, a1, false);
		hole.absarc(0, 0, 0.22, a1, a0, true);
		s.holes.push(hole);
	}
	return s;
};

const usePlywood = () =>
	useMemo(() => {
		const W = 512;
		const {c, ctx} = makeCanvas(W, W);
		ctx.drawImage(paintWood(W, W, 5, 'birch'), 0, 0);
		const r = rng(3);
		for (let k = 0; k < 6; k++) {
			ctx.fillStyle = `rgba(150,110,60,${0.05 + r() * 0.05})`;
			ctx.beginPath();
			ctx.ellipse(r() * W, r() * W, 30 + r() * 60, 6 + r() * 10, r(), 0, Math.PI * 2);
			ctx.fill();
		}
		return toTexture(c);
	}, []);

export const LaserCutRosette: React.FC<{rotY: number; rotX?: number}> = ({rotY, rotX = 0}) => {
	const geom = useMemo(() => {
		const g = new ExtrudeGeometry(rosetteShape(), {depth: 0.07, bevelEnabled: false, curveSegments: 24});
		g.translate(0, 0, -0.035);
		const uv = g.attributes.uv;
		const pos = g.attributes.position;
		for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + 1) / 2, (pos.getY(i) + 1) / 2);
		return g;
	}, []);
	const ply = usePlywood();
	return (
		<group rotation={[rotX, rotY, 0]}>
			<mesh geometry={geom}>
				{/* group 0 = faces (birch ply), group 1 = laser-burnt edges */}
				<meshStandardMaterial attach="material-0" map={ply} roughness={0.7} />
				<meshStandardMaterial attach="material-1" color="#3b2412" roughness={0.9} />
			</mesh>
		</group>
	);
};
