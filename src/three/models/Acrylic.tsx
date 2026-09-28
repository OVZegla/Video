import React, {useMemo} from 'react';
import {AdditiveBlending, ExtrudeGeometry, Shape} from 'three';
import {makeCanvas, rng, toTexture, useImage} from '../textures';
import {brand, drawEye, drawLogoMono} from '../paint';
import {FONT} from '../../theme';

/* Rounded-rectangle slab, centred, bevelled like polished acrylic edges. */
export const roundedSlab = (w: number, h: number, depth: number, r: number, bevel = 0.012) => {
	const s = new Shape();
	const x = -w / 2;
	const y = -h / 2;
	s.moveTo(x + r, y);
	s.lineTo(x + w - r, y);
	s.quadraticCurveTo(x + w, y, x + w, y + r);
	s.lineTo(x + w, y + h - r);
	s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	s.lineTo(x + r, y + h);
	s.quadraticCurveTo(x, y + h, x, y + h - r);
	s.lineTo(x, y + r);
	s.quadraticCurveTo(x, y, x + r, y);
	const g = new ExtrudeGeometry(s, {
		depth,
		bevelEnabled: bevel > 0,
		bevelThickness: bevel,
		bevelSize: bevel,
		bevelSegments: 3,
		curveSegments: 10,
	});
	g.translate(0, 0, -depth / 2);
	// map UVs of the caps to 0..1 across the slab
	const uv = g.attributes.uv;
	const pos = g.attributes.position;
	for (let i = 0; i < uv.count; i++) {
		uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
	}
	return g;
};

const acrylicProps = {
	color: '#ffffff',
	transmission: 1,
	thickness: 0.12,
	roughness: 0.03,
	ior: 1.49,
	metalness: 0,
	clearcoat: 1,
	clearcoatRoughness: 0.02,
	specularIntensity: 1,
} as const;

export const Standoff: React.FC<{x: number; y: number; z: number}> = ({x, y, z}) => (
	<group position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
		<mesh>
			<cylinderGeometry args={[0.07, 0.07, 0.16, 32]} />
			<meshStandardMaterial color="#e8e8e8" metalness={1} roughness={0.12} />
		</mesh>
		<mesh position={[0, 0.085, 0]}>
			<cylinderGeometry args={[0.055, 0.07, 0.02, 32]} />
			<meshStandardMaterial color="#ffffff" metalness={1} roughness={0.08} />
		</mesh>
	</group>
);

/* ------------------------------------------------ printed acrylic */

const usePosterPrint = () => {
	const logo = useImage('brand/vision-urbaine-logo.png');
	return useMemo(() => {
		if (!logo) return null;
		const W = 768;
		const H = 1024;
		const {c, ctx} = makeCanvas(W, H);
		// dusk sky
		const sky = ctx.createLinearGradient(0, 0, 0, H * 0.72);
		sky.addColorStop(0, '#061158');
		sky.addColorStop(0.55, '#1f4fe0');
		sky.addColorStop(1, '#ff8a5c');
		ctx.fillStyle = sky;
		ctx.fillRect(0, 0, W, H);
		// sun
		const sun = ctx.createRadialGradient(W * 0.64, H * 0.5, 10, W * 0.64, H * 0.5, 170);
		sun.addColorStop(0, '#fff4d8');
		sun.addColorStop(0.35, '#ff5a3c');
		sun.addColorStop(1, 'rgba(255,40,40,0)');
		ctx.fillStyle = sun;
		ctx.fillRect(0, 0, W, H);
		// city skyline with a belfry
		ctx.fillStyle = '#050a2a';
		const r = rng(11);
		let x = 0;
		while (x < W) {
			const bw = 40 + r() * 70;
			const bh = 80 + r() * 150;
			ctx.fillRect(x, H * 0.72 - bh, bw + 1, bh + 2);
			x += bw;
		}
		const bx = W * 0.32;
		ctx.fillRect(bx - 34, H * 0.72 - 330, 68, 330);
		ctx.beginPath();
		ctx.moveTo(bx - 44, H * 0.72 - 330);
		ctx.lineTo(bx, H * 0.72 - 450);
		ctx.lineTo(bx + 44, H * 0.72 - 330);
		ctx.fill();
		for (const dx of [-40, 40]) {
			ctx.beginPath();
			ctx.moveTo(bx + dx - 10, H * 0.72 - 330);
			ctx.lineTo(bx + dx, H * 0.72 - 380);
			ctx.lineTo(bx + dx + 10, H * 0.72 - 330);
			ctx.fill();
		}
		// lit windows
		for (let k = 0; k < 90; k++) {
			ctx.fillStyle = `rgba(255,214,150,${0.35 + r() * 0.5})`;
			ctx.fillRect(r() * W, H * 0.72 - r() * 150, 5, 7);
		}
		// lower band with brand
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, H * 0.72, W, H * 0.28);
		const lw = W * 0.8;
		ctx.drawImage(logo, (W - lw) / 2, H * 0.8, lw, lw / (logo.width / logo.height));
		ctx.fillStyle = brand.navy;
		ctx.font = `700 34px ${FONT}`;
		ctx.textAlign = 'center';
		ctx.fillText('BÉTHUNE', W / 2, H * 0.95);
		return toTexture(c);
	}, [logo]);
};

export const PrintedAcrylic: React.FC<{rotY: number}> = ({rotY}) => {
	const w = 1.5;
	const h = 2.0;
	const slab = useMemo(() => roundedSlab(w, h, 0.1, 0.06), []);
	const print = usePosterPrint();
	return (
		<group rotation={[0, rotY, 0]}>
			{/* direct print on the back face, seen through the acrylic */}
			{print ? (
				<mesh position={[0, 0, -0.066]}>
					<planeGeometry args={[w - 0.02, h - 0.02]} />
					<meshStandardMaterial map={print} roughness={0.5} />
				</mesh>
			) : null}
			<mesh geometry={slab}>
				<meshPhysicalMaterial {...acrylicProps} />
			</mesh>
			{[
				[-w / 2 + 0.14, h / 2 - 0.14],
				[w / 2 - 0.14, h / 2 - 0.14],
				[-w / 2 + 0.14, -h / 2 + 0.14],
				[w / 2 - 0.14, -h / 2 + 0.14],
			].map(([x, y], k) => (
				<Standoff key={k} x={x} y={y} z={0.08} />
			))}
		</group>
	);
};

/* ------------------------------------------------ engraved, edge-lit acrylic */

const useEngraving = () => {
	const logo = useImage('brand/vision-urbaine-logo.png');
	return useMemo(() => {
		if (!logo) return null;
		const W = 768;
		const H = 896;
		const {c, ctx} = makeCanvas(W, H);
		const white = '#ffffff';
		drawEye(ctx, W / 2, 250, 150, {ring: white, pupil: white, sector: 'rgba(255,255,255,0.55)'});
		drawLogoMono(ctx, logo, W * 0.1, 470, W * 0.8, white);
		ctx.fillStyle = white;
		ctx.font = `500 44px ${FONT}`;
		ctx.textAlign = 'center';
		ctx.fillText('B I E N V E N U E', W / 2, 660);
		ctx.fillRect(W / 2 - 90, 710, 180, 4);
		return toTexture(c);
	}, [logo]);
};

export const EngravedAcrylic: React.FC<{rotY: number; glow: number}> = ({rotY, glow}) => {
	const w = 1.5;
	const h = 1.75;
	const slab = useMemo(() => roundedSlab(w, h, 0.1, 0.02, 0.008), []);
	const engraving = useEngraving();
	return (
		<group rotation={[0.05, rotY, 0]} position={[0, 0.15, 0]}>
			{/* clear sheet: glassy reflections only, so the glowing engraving reads on black */}
			<mesh geometry={slab}>
				<meshPhysicalMaterial color="#e6eeff" transparent opacity={0.1} roughness={0.02} clearcoat={1} envMapIntensity={2.2} depthWrite={false} />
			</mesh>
			{engraving ? (
				<>
					{/* frosted engraving catching the light from the base */}
					<mesh position={[0, 0, 0.001]}>
						<planeGeometry args={[w * 0.92, h * 0.92]} />
						<meshBasicMaterial map={engraving} transparent color="#dfe9ff" opacity={0.35 + 0.65 * glow} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
					</mesh>
				</>
			) : null}
			{/* LED base */}
			<mesh position={[0, -h / 2 - 0.12, 0]}>
				<boxGeometry args={[w + 0.1, 0.22, 0.34]} />
				<meshStandardMaterial color="#1b1b1d" metalness={0.6} roughness={0.35} />
			</mesh>
			<mesh position={[0, -h / 2 - 0.005, 0]}>
				<boxGeometry args={[w * 0.96, 0.02, 0.12]} />
				<meshBasicMaterial color="#cfe0ff" toneMapped={false} opacity={0.4 + 0.6 * glow} transparent />
			</mesh>
		</group>
	);
};
