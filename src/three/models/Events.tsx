import React, {useMemo} from 'react';
import {AdditiveBlending, LatheGeometry, Vector2} from 'three';
import {makeCanvas, paintBrushed, paintWood, rng, toTexture, useImage} from '../textures';
import {brand, drawEye, drawLogo} from '../paint';
import {C, FONT} from '../../theme';
import {DISPLAY} from '../../fonts';
import {roundedSlab, Standoff} from './Acrylic';
import {resample} from '../geom';

/* ================================================= SIGNAGE ================================================= */

/** French street nameplate: enamel blue, white border, domed. */
const useStreetPlate = () =>
	useMemo(() => {
		const W = 1024;
		const H = 512;
		const {c, ctx} = makeCanvas(W, H);
		ctx.fillStyle = '#1b3c9e';
		ctx.fillRect(0, 0, W, H);
		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 16;
		ctx.beginPath();
		ctx.roundRect(28, 28, W - 56, H - 56, 30);
		ctx.stroke();
		ctx.fillStyle = '#ffffff';
		ctx.textAlign = 'center';
		ctx.font = `500 58px ${FONT}`;
		ctx.fillText('RUE', W / 2, 150);
		ctx.font = `800 extra-condensed 170px ${DISPLAY}`;
		ctx.fillText('DES ARTISANS', W / 2, 320);
		ctx.font = `500 40px ${FONT}`;
		ctx.fillText('BÉTHUNE', W / 2, 410);
		return toTexture(c);
	}, []);

export const StreetSign: React.FC<{rotY: number}> = ({rotY}) => {
	const slab = useMemo(() => roundedSlab(1.8, 0.9, 0.05, 0.08, 0.03), []);
	const face = useStreetPlate();
	return (
		<group rotation={[0, rotY, 0]} position={[0, 0.15, 0]}>
			<mesh geometry={slab}>
				<meshPhysicalMaterial map={face} roughness={0.15} clearcoat={1} clearcoatRoughness={0.05} />
			</mesh>
			{/* stone wall fixing */}
			{[-0.78, 0.78].map((x) => (
				<mesh key={x} position={[x, 0, 0.045]}>
					<cylinderGeometry args={[0.035, 0.035, 0.02, 20]} />
					<meshStandardMaterial color="#e8e8e8" metalness={1} roughness={0.2} />
				</mesh>
			))}
		</group>
	);
};

/** Door plate: clear acrylic printed on the back, on brushed standoffs. */
const useDoorPlate = () => {
	const logo = useImage('brand/vision-urbaine-logo.png');
	return useMemo(() => {
		if (!logo) return null;
		const W = 1024;
		const H = 640;
		const {c, ctx} = makeCanvas(W, H);
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, W, H);
		ctx.fillStyle = C.blue;
		ctx.fillRect(0, 0, 60, H);
		ctx.fillStyle = brand.navy;
		ctx.font = `800 extra-condensed 150px ${DISPLAY}`;
		ctx.fillText('SALLE 12', 120, 230);
		ctx.fillStyle = C.brandRed;
		ctx.fillRect(122, 270, 220, 12);
		ctx.fillStyle = brand.navy;
		ctx.font = `500 56px ${FONT}`;
		ctx.fillText('Réunion · 1er étage', 122, 380);
		drawLogo(ctx, logo, W - 260, H - 110, 360);
		return toTexture(c);
	}, [logo]);
};

export const DoorPlate: React.FC<{rotY: number}> = ({rotY}) => {
	const slab = useMemo(() => roundedSlab(1.6, 1.0, 0.08, 0.04), []);
	const print = useDoorPlate();
	return (
		<group rotation={[0, rotY, 0]}>
			{print ? (
				<mesh position={[0, 0, -0.045]}>
					<planeGeometry args={[1.58, 0.98]} />
					<meshStandardMaterial map={print} roughness={0.5} />
				</mesh>
			) : null}
			<mesh geometry={slab}>
				<meshPhysicalMaterial color="#ffffff" transmission={1} thickness={0.08} roughness={0.03} ior={1.49} clearcoat={1} />
			</mesh>
			{[
				[-0.68, 0.38],
				[0.68, 0.38],
				[-0.68, -0.38],
				[0.68, -0.38],
			].map(([x, y], k) => (
				<Standoff key={k} x={x} y={y} z={0.06} />
			))}
		</group>
	);
};

/** Wayfinding totem: a post with arrow blades. */
const useBlade = (label: string, bg: string, fg: string, dir: 1 | -1) =>
	useMemo(() => {
		const W = 1024;
		const H = 256;
		const {c, ctx} = makeCanvas(W, H);
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, W, H);
		ctx.fillStyle = fg;
		ctx.font = `800 extra-condensed 150px ${DISPLAY}`;
		ctx.textBaseline = 'middle';
		ctx.textAlign = dir === 1 ? 'left' : 'right';
		ctx.fillText(label, dir === 1 ? 60 : W - 60, H / 2 + 6);
		// arrow
		const ax = dir === 1 ? W - 150 : 150;
		ctx.beginPath();
		ctx.moveTo(ax - 50 * dir, H / 2 - 60);
		ctx.lineTo(ax + 50 * dir, H / 2);
		ctx.lineTo(ax - 50 * dir, H / 2 + 60);
		ctx.closePath();
		ctx.fill();
		return toTexture(c);
	}, [label, bg, fg, dir]);

export const Totem: React.FC<{rotY: number}> = ({rotY}) => {
	const a = useBlade('ACCUEIL', C.blue, '#ffffff', 1);
	const b = useBlade('ATELIER', '#ffffff', brand.navy, -1);
	const d = useBlade('SHOWROOM', C.brandRed, '#ffffff', 1);
	const blades: [typeof a, number, number][] = [
		[a, 0.62, 0.22],
		[b, 0.18, -0.22],
		[d, -0.26, 0.22],
	];
	return (
		<group rotation={[0, rotY, 0]}>
			<mesh>
				<boxGeometry args={[0.16, 2.3, 0.16]} />
				<meshStandardMaterial color="#26282c" metalness={0.7} roughness={0.35} />
			</mesh>
			<mesh position={[0, -1.17, 0]}>
				<boxGeometry args={[0.7, 0.06, 0.5]} />
				<meshStandardMaterial color="#26282c" metalness={0.7} roughness={0.35} />
			</mesh>
			{blades.map(([tex, y, x], k) => (
				<mesh key={k} position={[x, y, 0.1]}>
					<boxGeometry args={[1.25, 0.32, 0.05]} />
					<meshStandardMaterial attach="material-0" color="#26282c" />
					<meshStandardMaterial attach="material-1" color="#26282c" />
					<meshStandardMaterial attach="material-2" color="#26282c" />
					<meshStandardMaterial attach="material-3" color="#26282c" />
					<meshPhysicalMaterial attach="material-4" map={tex} roughness={0.3} clearcoat={0.6} />
					<meshPhysicalMaterial attach="material-5" map={tex} roughness={0.3} clearcoat={0.6} />
				</mesh>
			))}
		</group>
	);
};

/* ================================================= EVENTS ================================================= */

/** Reusable event cup (frosted polypropylene) with a printed design. */
const cupProfile = () =>
	[
		[0, -1],
		[0.46, -1],
		[0.5, -0.96],
		[0.62, 0.95],
		[0.65, 1.0],
		[0.6, 1.0],
		[0.57, 0.95],
		[0.45, -0.9],
		[0, -0.9],
	].map(([x, y]) => new Vector2(x, y));

const useCupPrint = () =>
	useMemo(() => {
		const W = 1024;
		const H = 1024;
		const {c, ctx} = makeCanvas(W, H);
		ctx.clearRect(0, 0, W, H);
		const cx = 0;
		for (const x of [cx, W]) {
			ctx.fillStyle = C.brandRed;
			ctx.beginPath();
			ctx.arc(x, H * 0.64, 46, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = C.blue;
			ctx.textAlign = 'center';
			ctx.font = `800 extra-condensed 90px ${DISPLAY}`;
			ctx.fillText('FESTIVAL', x, H * 0.74);
			ctx.font = `600 40px ${FONT}`;
			ctx.fillText('Béthune 2027', x, H * 0.8);
		}
		return toTexture(c);
	}, []);

export const EventCup: React.FC<{rotY: number}> = ({rotY}) => {
	const geom = useMemo(() => new LatheGeometry(resample(cupProfile(), 160), 96), []);
	const print = useCupPrint();
	return (
		<group rotation={[0, rotY, 0]} position={[0, 0.1, 0]}>
			<mesh geometry={geom}>
				<meshPhysicalMaterial color="#eef2fa" roughness={0.55} clearcoat={0.3} side={2} />
			</mesh>
			<mesh geometry={geom} scale={[1.006, 1, 1.006]} renderOrder={2}>
				<meshStandardMaterial map={print} transparent alphaTest={0.05} roughness={0.5} />
			</mesh>
		</group>
	);
};

/** Wedding welcome sign: clear acrylic with white print, on a wooden easel. */
const useWeddingPrint = () =>
	useMemo(() => {
		const W = 768;
		const H = 1024;
		const {c, ctx} = makeCanvas(W, H);
		ctx.clearRect(0, 0, W, H);
		ctx.fillStyle = '#ffffff';
		ctx.textAlign = 'center';
		ctx.font = `300 64px ${FONT}`;
		ctx.fillText('Bienvenue', W / 2, 250);
		ctx.font = `300 44px ${FONT}`;
		ctx.fillText('au mariage de', W / 2, 330);
		ctx.font = `700 150px ${FONT}`;
		ctx.fillText('Léa', W / 2, 520);
		ctx.font = `300 70px ${FONT}`;
		ctx.fillText('&', W / 2, 610);
		ctx.font = `700 150px ${FONT}`;
		ctx.fillText('Tom', W / 2, 760);
		ctx.font = `500 44px ${FONT}`;
		ctx.fillText('12 · 06 · 2027', W / 2, 870);
		// leafy corner flourish
		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 5;
		for (let k = 0; k < 9; k++) {
			ctx.beginPath();
			ctx.ellipse(110 + k * 16, 110 + k * 8, 34, 12, 0.6 + k * 0.1, 0, Math.PI * 2);
			ctx.stroke();
		}
		return toTexture(c);
	}, []);

export const WeddingSign: React.FC<{rotY: number}> = ({rotY}) => {
	const slab = useMemo(() => roundedSlab(1.35, 1.8, 0.06, 0.08), []);
	const print = useWeddingPrint();
	const oak = useMemo(() => toTexture(paintWood(128, 512, 51, 'oak')), []);
	return (
		<group rotation={[0, rotY, 0]}>
			{/* easel */}
			{[-0.45, 0.45].map((x) => (
				<mesh key={x} position={[x, -0.1, -0.12]} rotation={[0.12, 0, x > 0 ? -0.08 : 0.08]}>
					<boxGeometry args={[0.07, 2.4, 0.07]} />
					<meshStandardMaterial map={oak} roughness={0.6} />
				</mesh>
			))}
			<mesh position={[0, -0.72, 0]}>
				<boxGeometry args={[1.2, 0.06, 0.12]} />
				<meshStandardMaterial map={oak} roughness={0.6} />
			</mesh>
			<group position={[0, 0.2, 0.02]} rotation={[-0.08, 0, 0]}>
				<mesh geometry={slab}>
					<meshPhysicalMaterial color="#eef3ff" transparent opacity={0.28} roughness={0.02} clearcoat={1} envMapIntensity={2} depthWrite={false} />
				</mesh>
				<mesh position={[0, 0, 0.035]}>
					<planeGeometry args={[1.3, 1.73]} />
					<meshBasicMaterial map={print} transparent toneMapped={false} />
				</mesh>
			</group>
		</group>
	);
};

/** Engraved brass plaque, e.g. a wedding keepsake. */
const useBrass = () =>
	useMemo(() => {
		const W = 1024;
		const H = 768;
		const {c, ctx} = makeCanvas(W, H);
		const brushed = paintBrushed(W, H, 14);
		ctx.drawImage(brushed, 0, 0);
		ctx.globalCompositeOperation = 'multiply';
		ctx.fillStyle = '#e0b660';
		ctx.fillRect(0, 0, W, H);
		ctx.globalCompositeOperation = 'source-over';
		const ink = '#3b2a10';
		ctx.fillStyle = ink;
		ctx.textAlign = 'center';
		ctx.font = `700 150px ${FONT}`;
		ctx.fillText('L & T', W / 2, 330);
		ctx.fillRect(W / 2 - 150, 380, 300, 6);
		ctx.font = `500 60px ${FONT}`;
		ctx.fillText('Pour toujours', W / 2, 480);
		ctx.font = `500 46px ${FONT}`;
		ctx.fillText('12 juin 2027', W / 2, 570);
		ctx.strokeStyle = ink;
		ctx.lineWidth = 6;
		ctx.strokeRect(40, 40, W - 80, H - 80);
		return toTexture(c);
	}, []);

export const BrassPlaque: React.FC<{rotY: number}> = ({rotY}) => {
	const slab = useMemo(() => roundedSlab(1.6, 1.2, 0.04, 0.05, 0.012), []);
	const map = useBrass();
	const walnut = useMemo(() => toTexture(paintWood(512, 512, 61, 'oak')), []);
	return (
		<group rotation={[0, rotY, 0]}>
			<mesh position={[0, 0, -0.06]}>
				<boxGeometry args={[1.9, 1.5, 0.09]} />
				<meshStandardMaterial map={walnut} color="#7a4d2c" roughness={0.5} />
			</mesh>
			<mesh geometry={slab}>
				<meshStandardMaterial map={map} metalness={0.95} roughness={0.28} />
			</mesh>
		</group>
	);
};

/** Place cards: laser-engraved birch with guests' names. */
const usePlaceCard = (name: string) =>
	useMemo(() => {
		const W = 768;
		const H = 384;
		const {c, ctx} = makeCanvas(W, H);
		ctx.drawImage(paintWood(W, H, name.length * 7, 'birch'), 0, 0);
		ctx.fillStyle = '#3a1c0b';
		ctx.textAlign = 'center';
		ctx.font = `700 120px ${FONT}`;
		ctx.fillText(name, W / 2, 230);
		ctx.fillRect(W / 2 - 80, 270, 160, 5);
		return toTexture(c);
	}, [name]);

const PlaceCard: React.FC<{name: string; x: number; y?: number; z: number; ry: number}> = ({name, x, y = 0, z, ry}) => {
	const tex = usePlaceCard(name);
	return (
		<group position={[x, y, z]} rotation={[0, ry, 0]}>
			<mesh rotation={[-0.2, 0, 0]}>
				<boxGeometry args={[1.0, 0.5, 0.03]} />
				<meshStandardMaterial attach="material-0" color="#c9a878" />
				<meshStandardMaterial attach="material-1" color="#c9a878" />
				<meshStandardMaterial attach="material-2" color="#c9a878" />
				<meshStandardMaterial attach="material-3" color="#c9a878" />
				<meshStandardMaterial attach="material-4" map={tex} roughness={0.7} />
				<meshStandardMaterial attach="material-5" color="#c9a878" />
			</mesh>
		</group>
	);
};

/** Three place cards stacked on a small stepped stand so every name shows. */
export const PlaceCards: React.FC<{rotY: number}> = ({rotY}) => {
	const oak = useMemo(() => toTexture(paintWood(256, 256, 71, 'oak')), []);
	return (
		<group rotation={[0, rotY, 0]} position={[0, -0.1, 0]}>
			{[0, 1, 2].map((k) => (
				<mesh key={k} position={[0, -0.95 + k * 0.62, -0.3 * k]}>
					<boxGeometry args={[1.3, 0.08, 0.5]} />
					<meshStandardMaterial map={oak} roughness={0.6} />
				</mesh>
			))}
			<PlaceCard name="Inès" x={0} z={0.05} ry={0} y={-0.66} />
			<PlaceCard name="Hugo" x={0} z={-0.25} ry={0} y={-0.04} />
			<PlaceCard name="Chloé" x={0} z={-0.55} ry={0} y={0.58} />
		</group>
	);
};

/* ================================================= LIGHT ================================================= */

export type LitDesign = 'logo' | 'bienvenue' | 'wedding' | 'belfry' | 'open';

/** White engraving art for the edge-lit acrylic panels. */
const useLitArt = (design: LitDesign) => {
	const logo = useImage('brand/vision-urbaine-logo-white.png');
	return useMemo(() => {
		if (!logo) return null;
		const W = 768;
		const H = 1024;
		const {c, ctx} = makeCanvas(W, H);
		ctx.clearRect(0, 0, W, H);
		const white = '#ffffff';
		ctx.fillStyle = white;
		ctx.strokeStyle = white;
		ctx.textAlign = 'center';
		if (design === 'logo') {
			drawEye(ctx, W / 2, 360, 190, {ring: white, pupil: white, sector: 'rgba(255,255,255,0.6)'});
			// monochrome logo
			const tmp = document.createElement('canvas');
			tmp.width = 640;
			tmp.height = Math.round(640 / (logo.width / logo.height));
			const t = tmp.getContext('2d')!;
			t.drawImage(logo, 0, 0, tmp.width, tmp.height);
			t.globalCompositeOperation = 'source-in';
			t.fillStyle = white;
			t.fillRect(0, 0, tmp.width, tmp.height);
			ctx.drawImage(tmp, (W - 640) / 2, 640);
		} else if (design === 'bienvenue') {
			ctx.font = `300 72px ${FONT}`;
			ctx.fillText('Bienvenue', W / 2, 380);
			ctx.font = `800 extra-condensed 200px ${DISPLAY}`;
			ctx.fillText('CHEZ', W / 2, 580);
			ctx.fillText('NOUS', W / 2, 760);
			ctx.lineWidth = 6;
			ctx.strokeRect(80, 180, W - 160, 680);
		} else if (design === 'wedding') {
			ctx.font = `700 160px ${FONT}`;
			ctx.fillText('L & T', W / 2, 480);
			ctx.lineWidth = 5;
			ctx.beginPath();
			ctx.arc(W / 2, 430, 280, 0, Math.PI * 2);
			ctx.stroke();
			ctx.font = `500 54px ${FONT}`;
			ctx.fillText('12 · 06 · 2027', W / 2, 820);
		} else if (design === 'belfry') {
			// stylised Béthune belfry line drawing
			ctx.lineWidth = 10;
			ctx.lineJoin = 'round';
			const x = W / 2;
			ctx.beginPath();
			ctx.moveTo(x - 110, 860);
			ctx.lineTo(x - 110, 420);
			ctx.lineTo(x + 110, 420);
			ctx.lineTo(x + 110, 860);
			ctx.moveTo(x - 140, 420);
			ctx.lineTo(x, 200);
			ctx.lineTo(x + 140, 420);
			ctx.moveTo(x - 110, 560);
			ctx.lineTo(x + 110, 560);
			ctx.stroke();
			for (const dx of [-140, 140]) {
				ctx.beginPath();
				ctx.moveTo(x + dx - 24, 420);
				ctx.lineTo(x + dx, 320);
				ctx.lineTo(x + dx + 24, 420);
				ctx.stroke();
			}
			ctx.beginPath();
			ctx.arc(x, 490, 36, 0, Math.PI * 2);
			ctx.stroke();
			ctx.fillRect(x - 40, 640, 80, 120);
			ctx.font = `800 extra-condensed 110px ${DISPLAY}`;
			ctx.fillText('BÉTHUNE', x, 980);
		} else {
			ctx.font = `800 extra-condensed 260px ${DISPLAY}`;
			ctx.fillText('OPEN', W / 2, 560);
			ctx.lineWidth = 8;
			ctx.beginPath();
			ctx.roundRect(70, 330, W - 140, 330, 40);
			ctx.stroke();
			ctx.font = `500 50px ${FONT}`;
			ctx.fillText('7 / 7', W / 2, 760);
		}
		// soft halo version for the bloom
		const {c: h, ctx: hx} = makeCanvas(W, H);
		hx.filter = 'blur(18px)';
		hx.drawImage(c, 0, 0);
		hx.filter = 'blur(6px)';
		hx.drawImage(c, 0, 0);
		return {art: toTexture(c), halo: toTexture(h)};
	}, [logo, design]);
};

const useSpeckle = () =>
	useMemo(() => {
		const {c, ctx} = makeCanvas(256, 256);
		const r = rng(2);
		for (let k = 0; k < 300; k++) {
			ctx.fillStyle = `rgba(255,255,255,${r() * 0.12})`;
			ctx.fillRect(r() * 256, r() * 256, 1, 1);
		}
		return toTexture(c);
	}, []);

/**
 * Edge-lit engraved acrylic on an LED base. `on` 0 → 1 switches it on:
 * the engraving blooms white, the edges catch the light, the base glows.
 */
export const LitAcrylic: React.FC<{design: LitDesign; on: number; rotY: number}> = ({design, on, rotY}) => {
	const slab = useMemo(() => roundedSlab(1.45, 1.95, 0.1, 0.03, 0.01), []);
	const art = useLitArt(design);
	const speckle = useSpeckle();
	const flick = on;
	return (
		<group rotation={[0, rotY, 0]} position={[0, 0.12, 0]}>
			<mesh geometry={slab}>
				<meshPhysicalMaterial color="#dfe8ff" transparent opacity={0.1 + 0.08 * flick} roughness={0.02} clearcoat={1} envMapIntensity={1.4} depthWrite={false} emissive="#ffffff" emissiveMap={speckle} emissiveIntensity={flick * 0.5} />
			</mesh>
			{art ? (
				<>
					{/* engraving: dim frosted when off, brilliant white when on */}
					<mesh position={[0, 0, 0.001]}>
						<planeGeometry args={[1.4, 1.9]} />
						<meshBasicMaterial map={art.art} transparent color="#ffffff" opacity={0.18 + 0.82 * flick} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
					</mesh>
					<mesh position={[0, 0, 0.02]} scale={1.04}>
						<planeGeometry args={[1.4, 1.9]} />
						<meshBasicMaterial map={art.halo} transparent color="#eaf2ff" opacity={flick * 0.9} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
					</mesh>
				</>
			) : null}
			{/* polished top edge catching the light */}
			<mesh position={[0, 0.975, 0]}>
				<boxGeometry args={[1.45, 0.012, 0.1]} />
				<meshBasicMaterial color="#ffffff" transparent opacity={0.15 + 0.85 * flick} toneMapped={false} />
			</mesh>
			{/* LED base */}
			<mesh position={[0, -1.1, 0]}>
				<boxGeometry args={[1.6, 0.22, 0.36]} />
				<meshStandardMaterial color="#141416" metalness={0.7} roughness={0.3} />
			</mesh>
			<mesh position={[0, -0.985, 0]}>
				<boxGeometry args={[1.5, 0.015, 0.14]} />
				<meshBasicMaterial color="#ffffff" transparent opacity={0.1 + 0.9 * flick} toneMapped={false} />
			</mesh>
		</group>
	);
};
