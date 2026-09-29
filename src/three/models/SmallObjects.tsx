import React, {useMemo} from 'react';
import {ExtrudeGeometry, LatheGeometry, Shape, Vector2} from 'three';
import {makeCanvas, paintBrushed, paintWood, rng, toTexture, useImage} from '../textures';
import {brand, drawEye, drawLogo, drawLogoMono} from '../paint';
import {C, FONT} from '../../theme';
import {resample} from '../geom';
import {DISPLAY} from '../../fonts';

/* ------------------------------------------------ insulated bottle, laser-engraved */

const bottleProfile = () =>
	[
		[0, -1.2],
		[0.36, -1.2],
		[0.4, -1.17],
		[0.42, -1.1],
		[0.42, 0.62],
		[0.4, 0.74],
		[0.3, 0.88],
		[0.24, 0.94],
		[0.24, 1.0],
	].map(([x, y]) => new Vector2(x, y));

/** Powder-coated blue with the engraving exposing the steel underneath. */
const useBottleSkin = (name: string) => {
	const logo = useImage('brand/vision-urbaine-logo.png');
	return useMemo(() => {
		if (!logo) return null;
		const W = 1024;
		const H = 1024;
		const {c, ctx} = makeCanvas(W, H);
		ctx.fillStyle = '#1f47d8';
		ctx.fillRect(0, 0, W, H);
		const r = rng(3);
		for (let k = 0; k < 6000; k++) {
			ctx.fillStyle = `rgba(255,255,255,${r() * 0.04})`;
			ctx.fillRect(r() * W, r() * H, 2, 2);
		}
		// engraving in steel colour. A lathe's u = 0 faces the camera and sits on
		// the texture seam, so the design is drawn at both edges.
		const steel = '#d9dde3';
		for (const cx of [0, W]) {
			drawEye(ctx, cx, H * 0.34, 40, {ring: steel, pupil: steel, sector: steel});
			ctx.fillStyle = steel;
			ctx.font = `700 92px ${FONT}`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(name, cx, H * 0.45);
			ctx.fillRect(cx - 60, H * 0.5, 120, 5);
			drawLogoMono(ctx, logo, cx - 95, H * 0.54, 190, steel);
		}
		return toTexture(c);
	}, [logo, name]);
};

export const Bottle: React.FC<{rotY: number; name?: string}> = ({rotY, name = 'Hugo'}) => {
	const body = useMemo(() => new LatheGeometry(resample(bottleProfile(), 120), 96), []);
	const skin = useBottleSkin(name);
	return (
		<group rotation={[0, rotY, 0]} position={[0, 0.1, 0]}>
			{skin ? (
				<mesh geometry={body}>
					<meshPhysicalMaterial map={skin} roughness={0.45} metalness={0.2} clearcoat={0.4} clearcoatRoughness={0.4} />
				</mesh>
			) : null}
			{/* stainless cap with carry loop */}
			<mesh position={[0, 1.1, 0]}>
				<cylinderGeometry args={[0.27, 0.27, 0.22, 64]} />
				<meshStandardMaterial color="#cfd3d8" metalness={1} roughness={0.22} />
			</mesh>
			<mesh position={[0, 1.27, 0]} rotation={[0, Math.PI / 2, 0]}>
				<torusGeometry args={[0.13, 0.035, 16, 40]} />
				<meshStandardMaterial color="#cfd3d8" metalness={1} roughness={0.22} />
			</mesh>
		</group>
	);
};

/* ------------------------------------------------ t-shirt on a wooden hanger */

const shirtShape = () => {
	const s = new Shape();
	s.moveTo(-0.28, 1.0);
	s.bezierCurveTo(-0.18, 0.86, 0.18, 0.86, 0.28, 1.0); // neckline
	s.lineTo(0.62, 0.9);
	s.lineTo(1.05, 0.55); // sleeve top
	s.lineTo(0.86, 0.3); // sleeve end
	s.lineTo(0.64, 0.45);
	s.lineTo(0.66, -1.0);
	s.quadraticCurveTo(0, -1.04, -0.66, -1.0);
	s.lineTo(-0.64, 0.45);
	s.lineTo(-0.86, 0.3);
	s.lineTo(-1.05, 0.55);
	s.lineTo(-0.62, 0.9);
	s.lineTo(-0.28, 1.0);
	return s;
};

const useShirtPrint = (color: string, ink: string, line1: string, line2: string) => {
	const logo = useImage('brand/vision-urbaine-logo-white.png');
	return useMemo(() => {
		if (!logo) return null;
		const W = 1024;
		const {c, ctx} = makeCanvas(W, W);
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, W, W);
		// knit texture
		const r = rng(9);
		for (let k = 0; k < 20000; k++) {
			ctx.fillStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,255,255'},${r() * 0.05})`;
			ctx.fillRect(r() * W, r() * W, 2, 1);
		}
		ctx.fillStyle = ink;
		ctx.textAlign = 'center';
		// kept well inside the chest (the body spans roughly 0.2–0.8 of the texture width)
		ctx.font = `800 extra-condensed 80px ${DISPLAY}`;
		ctx.fillText(line1, W / 2, W * 0.46);
		ctx.font = `600 44px ${FONT}`;
		ctx.fillText(line2, W / 2, W * 0.52);
		ctx.fillStyle = C.brandRed;
		ctx.fillRect(W / 2 - 60, W * 0.545, 120, 7);
		if (ink === '#ffffff') drawLogo(ctx, logo, W / 2, W * 0.585, 220);
		return toTexture(c);
	}, [logo, color, ink, line1, line2]);
};

export const TShirt: React.FC<{rotY: number; swing: number; color?: string; ink?: string; line1?: string; line2?: string}> = ({
	rotY,
	swing,
	color = '#0f2fb8',
	ink = '#ffffff',
	line1 = 'TEAM BÉTHUNE',
	line2 = 'Tournoi 2027',
}) => {
	const geom = useMemo(() => {
		const g = new ExtrudeGeometry(shirtShape(), {depth: 0.06, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 6, curveSegments: 16});
		g.translate(0, 0, -0.03);
		const uv = g.attributes.uv;
		const pos = g.attributes.position;
		for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + 1.1) / 2.2, (pos.getY(i) + 1.1) / 2.2);
		// soft drape: bow the fabric slightly
		for (let i = 0; i < pos.count; i++) {
			const x = pos.getX(i);
			const y = pos.getY(i);
			pos.setZ(i, pos.getZ(i) + 0.08 * Math.cos(x * 1.4) + 0.03 * Math.sin(y * 3 + x));
		}
		g.computeVertexNormals();
		return g;
	}, []);
	const print = useShirtPrint(color, ink, line1, line2);
	return (
		<group rotation={[0, rotY, 0]}>
			<group position={[0, 1.18, 0]} rotation={[0, 0, swing]}>
				{/* hanger */}
				<mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
					<torusGeometry args={[0.08, 0.018, 12, 32, Math.PI * 1.4]} />
					<meshStandardMaterial color="#bfc3c8" metalness={1} roughness={0.25} />
				</mesh>
				<mesh position={[0, -0.14, 0.02]} rotation={[0, 0, 0]}>
					<boxGeometry args={[1.25, 0.07, 0.07]} />
					<meshStandardMaterial color="#b98a55" roughness={0.5} />
				</mesh>
				{print ? (
					<mesh geometry={geom} position={[0, -1.02, 0]} scale={[0.8, 0.9, 0.8]}>
						<meshPhysicalMaterial map={print} roughness={1} sheen={0.25} sheenRoughness={0.9} sheenColor="#9fb2ff" envMapIntensity={0.6} />
					</mesh>
				) : null}
			</group>
		</group>
	);
};

/* ------------------------------------------------ canvas tote bag */

const useTotePrint = () => {
	const logo = useImage('brand/vision-urbaine-logo.png');
	return useMemo(() => {
		if (!logo) return null;
		const W = 1024;
		const {c, ctx} = makeCanvas(W, W);
		ctx.fillStyle = '#efe6d2';
		ctx.fillRect(0, 0, W, W);
		const r = rng(21);
		for (let y = 0; y < W; y += 3) {
			ctx.fillStyle = `rgba(120,100,70,${0.05 + r() * 0.05})`;
			ctx.fillRect(0, y, W, 1);
		}
		for (let x = 0; x < W; x += 3) {
			ctx.fillStyle = `rgba(120,100,70,${0.03 + r() * 0.04})`;
			ctx.fillRect(x, 0, 1, W);
		}
		// Bauhaus screen print
		ctx.fillStyle = C.blue;
		ctx.beginPath();
		ctx.arc(W * 0.4, W * 0.42, 190, Math.PI / 2, (Math.PI * 3) / 2);
		ctx.fill();
		ctx.fillStyle = C.brandRed;
		ctx.fillRect(W * 0.42, W * 0.42 - 190, 190, 190);
		ctx.fillStyle = C.brandNavy;
		for (let k = 0; k < 6; k++) ctx.fillRect(W * 0.42 + k * 32, W * 0.42 + 10, 16, 180);
		drawLogo(ctx, logo, W / 2, W * 0.78, 640);
		return toTexture(c);
	}, [logo]);
};

export const ToteBag: React.FC<{rotY: number; swing: number}> = ({rotY, swing}) => {
	const geom = useMemo(() => {
		const s = new Shape();
		s.moveTo(-0.8, -1);
		s.lineTo(0.8, -1);
		s.lineTo(0.82, 0.8);
		s.lineTo(-0.82, 0.8);
		s.lineTo(-0.8, -1);
		const g = new ExtrudeGeometry(s, {depth: 0.04, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.04, bevelSegments: 5});
		const uv = g.attributes.uv;
		const pos = g.attributes.position;
		for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + 0.82) / 1.64, (pos.getY(i) + 1) / 1.8);
		for (let i = 0; i < pos.count; i++) pos.setZ(i, pos.getZ(i) + 0.1 * Math.cos(pos.getX(i) * 1.6) * (0.6 - pos.getY(i) * 0.3));
		g.computeVertexNormals();
		return g;
	}, []);
	const print = useTotePrint();
	return (
		<group rotation={[0, rotY, swing]} position={[0, -0.25, 0]}>
			{[-0.42, 0.42].map((x) => (
				<mesh key={x} position={[x, 0.8, 0.02]} rotation={[0, 0, 0]}>
					<torusGeometry args={[0.36, 0.04, 10, 32, Math.PI]} />
					<meshStandardMaterial color="#e3d8c0" roughness={0.95} />
				</mesh>
			))}
			{print ? (
				<mesh geometry={geom}>
					<meshStandardMaterial map={print} roughness={0.95} />
				</mesh>
			) : null}
		</group>
	);
};

/* ------------------------------------------------ embroidered cap */

const useCapCrown = () => {
	const logo = useImage('brand/vision-urbaine-logo-white.png');
	return useMemo(() => {
		if (!logo) return null;
		const W = 1024;
		const H = 512;
		const {c, ctx} = makeCanvas(W, H);
		ctx.fillStyle = '#0f1f6e';
		ctx.fillRect(0, 0, W, H);
		const r = rng(4);
		// twill
		for (let k = -H; k < W; k += 5) {
			ctx.strokeStyle = `rgba(255,255,255,${0.03 + r() * 0.03})`;
			ctx.beginPath();
			ctx.moveTo(k, 0);
			ctx.lineTo(k + H, H);
			ctx.stroke();
		}
		// panel seams
		ctx.strokeStyle = 'rgba(0,0,0,0.35)';
		ctx.lineWidth = 3;
		for (let k = 0; k < 6; k++) {
			ctx.beginPath();
			ctx.moveTo((k * W) / 6, 0);
			ctx.lineTo((k * W) / 6, H);
			ctx.stroke();
		}
		return toTexture(c);
	}, [logo]);
};

/*
 * Embroidery patch: a piece of sphere covering the crown's front, with its own
 * UVs, so the design keeps its proportions instead of being stretched by the
 * crown's wrap-around mapping. Arc size ≈ 1.1 rad × 0.72 · sin(1.05) wide by
 * 0.66 rad × 0.72 tall → aspect ≈ 1.4, matched by the 700 × 500 canvas.
 */
const PATCH = {phi: 1.1, theta0: 0.72, theta: 0.66};

const useCapPatch = () => {
	const logo = useImage('brand/vision-urbaine-logo-white.png');
	return useMemo(() => {
		if (!logo) return null;
		const W = 700;
		const H = 500;
		const {c, ctx} = makeCanvas(W, H);
		ctx.clearRect(0, 0, W, H);
		drawEye(ctx, W / 2, H * 0.36, 110, {ring: '#ffffff', pupil: brand.blue, sector: brand.red});
		drawLogo(ctx, logo, W / 2, H * 0.72, 560);
		return toTexture(c);
	}, [logo]);
};

export const Cap: React.FC<{rotY: number}> = ({rotY}) => {
	const crown = useCapCrown();
	const patch = useCapPatch();
	/**
	 * Brim: a crescent whose inner edge follows the crown's front (ellipse
	 * 0.72 × 0.78) and whose outer edge reaches forward (ellipse 0.72 × 1.28),
	 * tapering to nothing at the sides, with a slight lateral curve.
	 */
	const visor = useMemo(() => {
		const s = new Shape();
		s.moveTo(0.72, 0);
		s.absellipse(0, 0, 0.72, 0.78, 0, Math.PI, false, 0);
		s.absellipse(0, 0, 0.72, 1.28, Math.PI, 0, true, 0);
		const g = new ExtrudeGeometry(s, {depth: 0.025, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 3, curveSegments: 48});
		const pos = g.attributes.position;
		for (let i = 0; i < pos.count; i++) pos.setZ(i, pos.getZ(i) + 0.1 * Math.pow(pos.getX(i), 2));
		g.computeVertexNormals();
		return g;
	}, []);
	return (
		<group rotation={[0.18, rotY, 0]} position={[0, -0.3, 0]}>
			{crown ? (
				<mesh scale={[1, 0.95, 1.08]}>
					<sphereGeometry args={[0.72, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
					<meshPhysicalMaterial map={crown} roughness={0.9} sheen={1} sheenColor="#8aa0ff" sheenRoughness={0.7} side={2} />
				</mesh>
			) : null}
			{patch ? (
				<mesh scale={[1, 0.95, 1.08]}>
					<sphereGeometry args={[0.725, 48, 24, Math.PI / 2 - PATCH.phi / 2, PATCH.phi, PATCH.theta0, PATCH.theta]} />
					<meshStandardMaterial map={patch} transparent alphaTest={0.1} roughness={0.7} />
				</mesh>
			) : null}
			{/* top button */}
			<mesh position={[0, 0.6, 0]}>
				<sphereGeometry args={[0.06, 16, 12]} />
				<meshStandardMaterial color="#0f1f6e" roughness={0.8} />
			</mesh>
			{/* visor */}
			<mesh geometry={visor} rotation={[Math.PI / 2 - 0.08, 0, 0]} position={[0, 0.02, 0]}>
				<meshStandardMaterial color="#0f1f6e" roughness={0.85} />
			</mesh>
		</group>
	);
};

/* ------------------------------------------------ keychains on a ring */

const useKeyTags = () => {
	const logo = useImage('brand/vision-urbaine-logo.png');
	return useMemo(() => {
		if (!logo) return null;
		// engraved round oak tag
		const {c: w, ctx: wx} = makeCanvas(512, 512);
		wx.drawImage(paintWood(512, 512, 17, 'birch'), 0, 0);
		wx.fillStyle = '#3a1c0b';
		wx.font = `700 120px ${FONT}`;
		wx.textAlign = 'center';
		wx.textBaseline = 'middle';
		wx.fillText('Chloé', 256, 256);
		wx.lineWidth = 8;
		wx.strokeStyle = '#3a1c0b';
		wx.beginPath();
		wx.arc(256, 256, 200, 0, Math.PI * 2);
		wx.stroke();
		// printed acrylic tag
		const {c: a, ctx: ax} = makeCanvas(512, 512);
		ax.fillStyle = '#ffffff';
		ax.fillRect(0, 0, 512, 512);
		ax.fillStyle = C.blue;
		ax.fillRect(0, 0, 512, 170);
		ax.fillStyle = C.brandRed;
		ax.beginPath();
		ax.arc(256, 300, 110, 0, Math.PI * 2);
		ax.fill();
		ax.fillStyle = '#ffffff';
		ax.font = `800 extra-condensed 130px ${DISPLAY}`;
		ax.textAlign = 'center';
		ax.textBaseline = 'middle';
		ax.fillText('62', 256, 305);
		ax.font = `800 extra-condensed 90px ${DISPLAY}`;
		ax.fillText('BÉTHUNE', 256, 90);
		// brushed metal tag with engraving
		const {c: m, ctx: mx} = makeCanvas(512, 512);
		mx.drawImage(paintBrushed(512, 512, 5), 0, 0);
		drawEye(mx, 256, 230, 120, {ring: '#2a2c30', pupil: '#2a2c30', sector: '#4a4c52'});
		mx.fillStyle = '#2a2c30';
		mx.font = `600 64px ${FONT}`;
		mx.textAlign = 'center';
		mx.fillText('Tom', 256, 440);
		return {wood: toTexture(w), acrylic: toTexture(a), metal: toTexture(m)};
	}, [logo]);
};

const Tag: React.FC<{x: number; swing: number; children: React.ReactNode}> = ({x, swing, children}) => (
	<group position={[0, 0.9, 0]} rotation={[0, 0, swing]}>
		{/* short chain */}
		<mesh position={[x * 0.5, -0.25, 0]} rotation={[0, 0, Math.atan2(x, 0.5)]}>
			<cylinderGeometry args={[0.012, 0.012, Math.hypot(x, 0.5), 8]} />
			<meshStandardMaterial color="#c9ccd1" metalness={1} roughness={0.2} />
		</mesh>
		<group position={[x, -0.5, 0]}>{children}</group>
	</group>
);

export const Keychains: React.FC<{rotY: number; t: number}> = ({rotY, t}) => {
	const tags = useKeyTags();
	if (!tags) return null;
	const sw = (k: number) => 0.12 * Math.sin(t / 18 + k * 1.7);
	return (
		<group rotation={[0, rotY, 0]} position={[0, 0.15, 0]}>
			{/* split ring */}
			<mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
				<torusGeometry args={[0.16, 0.025, 12, 40]} />
				<meshStandardMaterial color="#d4d7dc" metalness={1} roughness={0.15} />
			</mesh>
			<Tag x={-0.55} swing={sw(0)}>
				<mesh position={[0, -0.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
					<cylinderGeometry args={[0.36, 0.36, 0.06, 64]} />
					<meshStandardMaterial attach="material-0" color="#b88a58" roughness={0.7} />
					<meshStandardMaterial attach="material-1" map={tags.wood} roughness={0.6} />
					<meshStandardMaterial attach="material-2" color="#b88a58" roughness={0.7} />
				</mesh>
			</Tag>
			<Tag x={0} swing={sw(1)}>
				<mesh position={[0, -0.5, 0]}>
					<boxGeometry args={[0.55, 0.8, 0.05]} />
					<meshStandardMaterial attach="material-0" color="#e6ecff" roughness={0.1} />
					<meshStandardMaterial attach="material-1" color="#e6ecff" roughness={0.1} />
					<meshStandardMaterial attach="material-2" color="#e6ecff" roughness={0.1} />
					<meshStandardMaterial attach="material-3" color="#e6ecff" roughness={0.1} />
					<meshPhysicalMaterial attach="material-4" map={tags.acrylic} roughness={0.08} clearcoat={1} />
					<meshPhysicalMaterial attach="material-5" map={tags.acrylic} roughness={0.08} clearcoat={1} />
				</mesh>
			</Tag>
			<Tag x={0.55} swing={sw(2)}>
				<mesh position={[0, -0.42, 0]}>
					<boxGeometry args={[0.5, 0.7, 0.03]} />
					<meshStandardMaterial attach="material-0" color="#d8dade" metalness={1} roughness={0.25} />
					<meshStandardMaterial attach="material-1" color="#d8dade" metalness={1} roughness={0.25} />
					<meshStandardMaterial attach="material-2" color="#d8dade" metalness={1} roughness={0.25} />
					<meshStandardMaterial attach="material-3" color="#d8dade" metalness={1} roughness={0.25} />
					<meshStandardMaterial attach="material-4" map={tags.metal} metalness={0.9} roughness={0.3} />
					<meshStandardMaterial attach="material-5" map={tags.metal} metalness={0.9} roughness={0.3} />
				</mesh>
			</Tag>
		</group>
	);
};
