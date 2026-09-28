import React, {useMemo} from 'react';
import {makeCanvas, paintBrushed, rng, toTexture, useImage} from '../textures';
import {brand, drawEye} from '../paint';
import {DISPLAY} from '../../fonts';
import {FONT} from '../../theme';
import {roundedSlab, Standoff} from './Acrylic';

/* ------------------------------------------------ brushed aluminium plaque */

const usePlaque = () =>
	useMemo(() => {
		const W = 1024;
		const H = 680;
		const {c, ctx} = makeCanvas(W, H);
		ctx.drawImage(paintBrushed(W, H, 9), 0, 0);
		const ink = '#15171c';
		ctx.fillStyle = brand.navy;
		ctx.fillRect(70, 150, 12, 330);
		ctx.fillStyle = ink;
		ctx.font = `800 extra-condensed 118px ${DISPLAY}`;
		ctx.fillText('ATELIER', 120, 270);
		ctx.fillText('DUPONT', 120, 390);
		ctx.fillStyle = brand.red;
		ctx.fillRect(122, 420, 200, 8);
		ctx.fillStyle = ink;
		ctx.font = `500 44px ${FONT}`;
		ctx.fillText('ARCHITECTES  DPLG', 122, 490);
		ctx.font = `500 32px ${FONT}`;
		ctx.fillText('Sur rendez-vous', 122, 548);
		return toTexture(c);
	}, []);

export const MetalPlaque: React.FC<{rotY: number}> = ({rotY}) => {
	const w = 1.7;
	const h = 1.13;
	const slab = useMemo(() => roundedSlab(w, h, 0.03, 0.04, 0.01), []);
	const map = usePlaque();
	return (
		<group rotation={[0, rotY, 0]}>
			<mesh geometry={slab}>
				<meshStandardMaterial map={map} metalness={0.85} roughness={0.32} envMapIntensity={1.3} />
			</mesh>
			{[
				[-w / 2 + 0.1, h / 2 - 0.1],
				[w / 2 - 0.1, h / 2 - 0.1],
				[-w / 2 + 0.1, -h / 2 + 0.1],
				[w / 2 - 0.1, -h / 2 + 0.1],
			].map(([x, y], k) => (
				<Standoff key={k} x={x} y={y} z={0.03} />
			))}
		</group>
	);
};

/* ------------------------------------------------ projecting blade sign */

const useBladeFace = () => {
	const logo = useImage('brand/vision-urbaine-logo.png');
	return useMemo(() => {
		if (!logo) return null;
		const W = 768;
		const {c, ctx} = makeCanvas(W, W);
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, W, W);
		ctx.fillStyle = brand.navy;
		ctx.fillRect(0, 0, W, 26);
		ctx.fillRect(0, W - 26, W, 26);
		drawEye(ctx, W / 2, 300, 170, {ring: brand.navy, pupil: brand.blue, sector: brand.red});
		const lw = W * 0.84;
		ctx.drawImage(logo, (W - lw) / 2, 540, lw, lw / (logo.width / logo.height));
		return toTexture(c);
	}, [logo]);
};

export const BladeSign: React.FC<{swing: number; rotY: number}> = ({swing, rotY}) => {
	const face = useBladeFace();
	const s = 1.3;
	return (
		<group rotation={[0, rotY, 0]}>
			{/* wall plate + arm */}
			<mesh position={[-1.0, 1.05, 0]}>
				<boxGeometry args={[0.08, 0.5, 0.3]} />
				<meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.35} />
			</mesh>
			<mesh position={[-0.05, 1.05, 0]} rotation={[0, 0, Math.PI / 2]}>
				<cylinderGeometry args={[0.035, 0.035, 1.9, 24]} />
				<meshStandardMaterial color="#222" metalness={0.9} roughness={0.25} />
			</mesh>
			<mesh position={[0.9, 1.05, 0]}>
				<sphereGeometry args={[0.06, 24, 16]} />
				<meshStandardMaterial color="#222" metalness={0.9} roughness={0.25} />
			</mesh>
			<group position={[0, 1.05, 0]} rotation={[swing, 0, 0]}>
				{[-0.45, 0.45].map((x) => (
					<mesh key={x} position={[x, -0.12, 0]}>
						<cylinderGeometry args={[0.012, 0.012, 0.24, 8]} />
						<meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
					</mesh>
				))}
				<group position={[0, -0.24 - s / 2, 0]}>
					{face ? (<mesh>
						<boxGeometry args={[s, s, 0.09]} />
						<meshStandardMaterial attach="material-0" color="#1a1a1a" metalness={0.6} roughness={0.3} />
						<meshStandardMaterial attach="material-1" color="#1a1a1a" metalness={0.6} roughness={0.3} />
						<meshStandardMaterial attach="material-2" color="#1a1a1a" metalness={0.6} roughness={0.3} />
						<meshStandardMaterial attach="material-3" color="#1a1a1a" metalness={0.6} roughness={0.3} />
						<meshPhysicalMaterial attach="material-4" map={face} roughness={0.25} clearcoat={0.8} />
						<meshPhysicalMaterial attach="material-5" map={face} roughness={0.25} clearcoat={0.8} />
					</mesh>) : null}
				</group>
			</group>
		</group>
	);
};

/* ------------------------------------------------ printed decorative panel (dibond) */

const useDecor = () =>
	useMemo(() => {
		const W = 768;
		const H = 1024;
		const {c, ctx} = makeCanvas(W, H);
		ctx.fillStyle = '#f3efe6';
		ctx.fillRect(0, 0, W, H);
		const cols = [brand.navy, brand.blue, brand.red, '#f3efe6', '#e8c35a'];
		const r = rng(42);
		const s = W / 4;
		for (let y = 0; y < 5; y++) {
			for (let x = 0; x < 4; x++) {
				const px = x * s;
				const py = y * s + 20;
				const bg = cols[Math.floor(r() * cols.length)];
				let fg = cols[Math.floor(r() * cols.length)];
				if (fg === bg) fg = cols[(cols.indexOf(bg) + 2) % cols.length];
				ctx.fillStyle = bg;
				ctx.fillRect(px, py, s, s);
				ctx.fillStyle = fg;
				const k = Math.floor(r() * 4);
				ctx.beginPath();
				if (k === 0) {
					ctx.moveTo(px, py);
					ctx.arc(px, py, s, 0, Math.PI / 2);
				} else if (k === 1) {
					ctx.arc(px + s / 2, py + s, s / 2, Math.PI, 0);
				} else if (k === 2) {
					ctx.arc(px + s / 2, py + s / 2, s * 0.3, 0, Math.PI * 2);
				} else {
					ctx.moveTo(px, py + s);
					ctx.lineTo(px + s, py);
					ctx.lineTo(px + s, py + s);
				}
				ctx.fill();
			}
		}
		// subtle print texture
		for (let k = 0; k < 4000; k++) {
			ctx.fillStyle = `rgba(0,0,0,${r() * 0.05})`;
			ctx.fillRect(r() * W, r() * H, 1.5, 1.5);
		}
		return toTexture(c);
	}, []);

export const DecorPanel: React.FC<{rotY: number}> = ({rotY}) => {
	const w = 1.5;
	const h = 2.0;
	const slab = useMemo(() => roundedSlab(w, h, 0.03, 0.005, 0.004), []);
	const map = useDecor();
	return (
		<group rotation={[0, rotY, 0]}>
			<mesh geometry={slab}>
				<meshPhysicalMaterial map={map} roughness={0.45} clearcoat={0.3} clearcoatRoughness={0.4} />
			</mesh>
		</group>
	);
};
