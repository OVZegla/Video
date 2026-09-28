import React, {useMemo} from 'react';
import {DoubleSide, LatheGeometry, Vector2} from 'three';
import {makeCanvas, toTexture, useImage} from '../textures';
import {C, FONT} from '../../theme';

const OUTER = 0.8;

const profile = () => {
	const p: [number, number][] = [
		[0, -1],
		[0.7, -1],
		[0.77, -0.985],
		[0.795, -0.95],
		[OUTER, -0.88],
		[OUTER, 0.96],
		[0.792, 0.995],
		[0.76, 1.0],
		[0.735, 0.985],
		[0.725, 0.95],
		[0.725, -0.82],
		[0.7, -0.86],
		[0, -0.87],
	];
	return p.map(([x, y]) => new Vector2(x, y));
};

/** Sublimation print: transparent canvas wrapped on the mug body. */
const usePrint = (name: string) => {
	const logo = useImage('brand/vision-urbaine-logo.png');
	return useMemo(() => {
		if (!logo) return null;
		const {c, ctx} = makeCanvas(1024, 512);
		// Bauhaus motif
		ctx.fillStyle = C.brandNavy;
		ctx.fillRect(0, 0, 1024, 34);
		ctx.fillStyle = C.blue;
		ctx.beginPath();
		ctx.arc(330, 250, 118, Math.PI / 2, (3 * Math.PI) / 2);
		ctx.fill();
		ctx.fillStyle = C.brandRed;
		ctx.beginPath();
		ctx.arc(356, 250, 118, -Math.PI / 2, Math.PI / 2);
		ctx.fill();
		ctx.fillStyle = '#ffffff';
		ctx.beginPath();
		ctx.arc(343, 250, 40, 0, Math.PI * 2);
		ctx.fill();
		// personalised name
		ctx.fillStyle = C.brandNavy;
		ctx.font = `700 150px ${FONT}`;
		ctx.textBaseline = 'middle';
		ctx.fillText(name, 520, 238);
		// brand
		const lw = 560;
		ctx.drawImage(logo, 512 - lw / 2 + 80, 400, lw, lw / (logo.width / logo.height));
		return toTexture(c);
	}, [logo, name]);
};

export const Mug: React.FC<{rotY: number; name?: string}> = ({rotY, name = 'Léa'}) => {
	const lathe = useMemo(() => new LatheGeometry(profile(), 96), []);
	const print = usePrint(name);
	return (
		<group rotation={[0, rotY, 0]}>
			<mesh geometry={lathe}>
				<meshPhysicalMaterial color="#f7f7f4" roughness={0.16} clearcoat={1} clearcoatRoughness={0.05} side={DoubleSide} />
			</mesh>
			{/* handle */}
			<mesh position={[OUTER + 0.02, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1.15, 1, 1]}>
				<torusGeometry args={[0.4, 0.085, 24, 48, Math.PI]} />
				<meshPhysicalMaterial color="#f7f7f4" roughness={0.16} clearcoat={1} clearcoatRoughness={0.05} />
			</mesh>
			{print ? (
				<mesh>
					<cylinderGeometry args={[OUTER + 0.004, OUTER + 0.004, 1.5, 96, 1, true, -Math.PI * 0.42, Math.PI * 0.84]} />
					<meshPhysicalMaterial map={print} transparent roughness={0.2} clearcoat={1} clearcoatRoughness={0.05} />
				</mesh>
			) : null}
		</group>
	);
};
