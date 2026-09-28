import React, {useMemo} from 'react';
import {CatmullRomCurve3, LatheGeometry, TubeGeometry, Vector2, Vector3} from 'three';
import {makeCanvas, toTexture, useImage} from '../textures';
import {C, FONT} from '../../theme';

const R = 0.78; // outer radius
const H = 1.9; // height

/** Outer glaze profile (bottom → rim), including the unglazed foot ring. */
const outerProfile = () =>
	[
		[0.0, -0.95],
		[0.6, -0.95],
		[0.68, -0.945],
		[0.72, -0.93],
		[0.74, -0.9],
		[R - 0.01, -0.84],
		[R, -0.76],
		[R, 0.9],
		[R - 0.005, 0.935],
		[R - 0.02, 0.95],
		[R - 0.045, 0.952],
		[R - 0.065, 0.94],
	].map(([x, y]) => new Vector2(x, y));

/** Inner wall (rim → bottom), glazed in brand blue. */
const innerProfile = () =>
	[
		[R - 0.065, 0.94],
		[R - 0.07, 0.9],
		[R - 0.07, -0.72],
		[R - 0.12, -0.8],
		[0.0, -0.81],
	].map(([x, y]) => new Vector2(x, y));

/** Handle: a C-shaped tube with an oval section, like a real mug handle. */
const handleGeometry = () => {
	const curve = new CatmullRomCurve3(
		[
			new Vector3(R - 0.04, 0.58, 0),
			new Vector3(R + 0.28, 0.6, 0),
			new Vector3(R + 0.5, 0.36, 0),
			new Vector3(R + 0.52, -0.02, 0),
			new Vector3(R + 0.42, -0.36, 0),
			new Vector3(R + 0.16, -0.52, 0),
			new Vector3(R - 0.04, -0.5, 0),
		],
		false,
		'centripetal',
	);
	const g = new TubeGeometry(curve, 80, 0.085, 20, false);
	g.scale(1, 1, 1.35); // flatten into an oval grip
	return g;
};

/** Sublimation print: transparent canvas wrapped on the mug body. */
const usePrint = (name: string) => {
	const logo = useImage('brand/vision-urbaine-logo.png');
	return useMemo(() => {
		if (!logo) return null;
		const {c, ctx} = makeCanvas(1400, 700);
		// Bauhaus band motif
		ctx.fillStyle = C.brandNavy;
		ctx.fillRect(0, 60, 1400, 20);
		ctx.fillStyle = C.brandRed;
		ctx.fillRect(0, 88, 1400, 8);
		ctx.fillStyle = C.blue;
		ctx.beginPath();
		ctx.arc(470, 330, 150, Math.PI / 2, (3 * Math.PI) / 2);
		ctx.fill();
		ctx.fillStyle = C.brandRed;
		ctx.beginPath();
		ctx.arc(500, 330, 150, -Math.PI / 2, Math.PI / 2);
		ctx.fill();
		ctx.fillStyle = '#ffffff';
		ctx.beginPath();
		ctx.arc(485, 330, 50, 0, Math.PI * 2);
		ctx.fill();
		// personalised name
		ctx.fillStyle = C.brandNavy;
		ctx.font = `700 190px ${FONT}`;
		ctx.textBaseline = 'middle';
		ctx.fillText(name, 700, 320);
		const lw = 640;
		ctx.drawImage(logo, 700 - lw / 2 + 60, 540, lw, lw / (logo.width / logo.height));
		return toTexture(c);
	}, [logo, name]);
};

const glaze = {color: '#fbfbf8', roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04, sheen: 0} as const;

export const Mug: React.FC<{rotY: number; name?: string}> = ({rotY, name = 'Léa'}) => {
	const outer = useMemo(() => new LatheGeometry(outerProfile(), 128), []);
	const inner = useMemo(() => new LatheGeometry(innerProfile(), 128), []);
	const handle = useMemo(handleGeometry, []);
	const print = usePrint(name);
	return (
		<group rotation={[0, rotY, 0]} position={[0, 0.05, 0]}>
			<group position={[-0.26, 0, 0]}>
			<mesh geometry={outer}>
				<meshPhysicalMaterial {...glaze} />
			</mesh>
			<mesh geometry={inner}>
				<meshPhysicalMaterial color={C.blue} roughness={0.1} clearcoat={1} clearcoatRoughness={0.05} side={2} />
			</mesh>
			{/* unglazed foot ring */}
			<mesh position={[0, -0.948, 0]} rotation={[-Math.PI / 2, 0, 0]}>
				<ringGeometry args={[0.6, 0.72, 96]} />
				<meshStandardMaterial color="#d8d2c4" roughness={0.9} />
			</mesh>
			<mesh geometry={handle}>
				<meshPhysicalMaterial {...glaze} />
			</mesh>
			{print ? (
				<mesh>
					<cylinderGeometry args={[R + 0.003, R + 0.003, H * 0.78, 128, 1, true, -Math.PI * 0.4, Math.PI * 0.8]} />
					<meshPhysicalMaterial map={print} transparent roughness={0.14} clearcoat={1} clearcoatRoughness={0.04} />
				</mesh>
			) : null}
			</group>
		</group>
	);
};
