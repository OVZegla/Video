import React, {useEffect, useLayoutEffect} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';

export type Cam = {pos: [number, number, number]; target: [number, number, number]; fov?: number; roll?: number};

/** Places the camera every frame (the film drives it, not the user). */
const CameraRig: React.FC<{cam: Cam}> = ({cam}) => {
	const {camera} = useThree();
	useLayoutEffect(() => {
		const c = camera as THREE.PerspectiveCamera;
		c.position.set(...cam.pos);
		c.up.set(Math.sin(cam.roll ?? 0), Math.cos(cam.roll ?? 0), 0);
		c.lookAt(...cam.target);
		if (cam.fov && c.fov !== cam.fov) {
			c.fov = cam.fov;
			c.updateProjectionMatrix();
		}
	});
	return null;
};

/** Photographic studio for reflections: black room, a large overhead softbox and two tall strip lights. */
const studioScene = () => {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color('#000000');
	const panel = (w: number, h: number, power: number, pos: [number, number, number], rot: [number, number, number]) => {
		const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({color: new THREE.Color(power, power, power * 1.04), side: THREE.DoubleSide}));
		m.position.set(...pos);
		m.rotation.set(...rot);
		scene.add(m);
	};
	panel(8, 3, 3.2, [0, 6, 0], [Math.PI / 2, 0, 0]); // overhead softbox
	panel(1.2, 6, 5, [-6, 2.5, -2], [0, Math.PI / 2.6, 0]); // left strip
	panel(1.2, 6, 5, [6, 2.5, -2], [0, -Math.PI / 2.6, 0]); // right strip
	panel(5, 1.6, 0.8, [0, 1.2, 7], [0, Math.PI, 0]); // soft front fill
	panel(20, 0.5, 0.6, [0, 0.25, -9], [0, 0, 0]); // horizon line in the reflections
	return scene;
};

let envCache: THREE.Texture | null = null;
const Environment: React.FC<{intensity: number}> = ({intensity}) => {
	const {gl, scene} = useThree();
	useEffect(() => {
		if (!envCache) {
			const pm = new THREE.PMREMGenerator(gl);
			envCache = pm.fromScene(studioScene(), 0.02).texture;
		}
		scene.environment = envCache;
	}, [gl, scene]);
	useLayoutEffect(() => {
		scene.environmentIntensity = intensity;
	});
	return null;
};

const cycTex = new Map<string, THREE.Texture>();
const cycTexture = (color: string) => {
	if (cycTex.has(color)) return cycTex.get(color)!;
	const c = document.createElement('canvas');
	c.width = 4;
	c.height = 512;
	const g = c.getContext('2d')!;
	const grad = g.createLinearGradient(0, 0, 0, 512);
	// texture spans 16 m: the light band sits just above the floor line
	grad.addColorStop(0, '#000000');
	grad.addColorStop(0.78, '#000000');
	grad.addColorStop(0.95, color);
	grad.addColorStop(1, color);
	g.fillStyle = grad;
	g.fillRect(0, 0, 4, 512);
	const t = new THREE.CanvasTexture(c);
	t.colorSpace = THREE.SRGBColorSpace;
	cycTex.set(color, t);
	return t;
};

let poolTex: THREE.Texture | null = null;
const lightPool = () => {
	if (poolTex) return poolTex;
	const c = document.createElement('canvas');
	c.width = c.height = 512;
	const g = c.getContext('2d')!;
	const r = g.createRadialGradient(256, 256, 0, 256, 256, 256);
	r.addColorStop(0, 'rgba(255,255,255,1)');
	r.addColorStop(0.4, 'rgba(255,255,255,0.35)');
	r.addColorStop(1, 'rgba(255,255,255,0)');
	g.fillStyle = r;
	g.fillRect(0, 0, 512, 512);
	poolTex = new THREE.CanvasTexture(c);
	return poolTex;
};

export type Look = {
	env?: number;
	key?: number;
	rim?: number;
	rimColor?: string;
	fill?: number;
	floor?: string;
	/** 0..1 how much the floor mirrors the machines */
	mirror?: number;
	/** soft pool of light on the floor under the subject: [radius, strength] */
	pool?: [number, number];
	poolColor?: string;
	/** curved studio backdrop: [colour of the light band, strength] */
	cyc?: [string, number];
	fog?: [string, number, number];
	exposure?: number;
};

/**
 * A 3D shot: canvas, environment reflections, key/rim/fill lights, a glossy
 * floor with a mirror reflection of `children`, and the camera.
 */
export const Stage3D: React.FC<{cam: Cam; look?: Look; children: React.ReactNode; background?: string; reflect?: boolean}> = ({cam, look = {}, children, background = '#000', reflect = true}) => {
	const {env = 1, key = 2.2, rim = 3, rimColor = '#BFD4FF', fill = 0.08, floor = '#000000', mirror = 0.25, fog, exposure = 1, pool = [2.2, 0.16], poolColor = '#9FB6DA', cyc = ['#7F95B8', 0.35]} = look;
	return (
		<ThreeCanvas
			width={1920}
			height={1080}
			style={{background}}
			shadows
			gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: exposure}}
			camera={{fov: cam.fov ?? 30, near: 0.02, far: 200}}
		>
			<CameraRig cam={cam} />
			<Environment intensity={env} />
			{fog && <fog attach="fog" args={fog} />}
			<spotLight position={[3.5, 5.5, 4.5]} angle={0.32} penumbra={1} intensity={key * 40} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} />
			<directionalLight position={[-4, 3, -5]} intensity={rim} color={rimColor} />
			<directionalLight position={[5, 2.5, -4]} intensity={rim * 0.6} color={rimColor} />
			<ambientLight intensity={fill} />
			{children}
			{reflect && mirror > 0 && <group scale={[1, -1, 1]}>{children}</group>}
			{cyc[1] > 0 && (
				<mesh position={[0, 8, 0]}>
					<cylinderGeometry args={[11, 11, 16, 96, 1, true]} />
					<meshBasicMaterial map={cycTexture(cyc[0])} side={THREE.BackSide} transparent opacity={cyc[1]} depthWrite={false} fog={false} />
				</mesh>
			)}
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0005, 0]}>
				<planeGeometry args={[200, 200]} />
				<meshBasicMaterial color={floor} transparent opacity={1 - mirror} />
			</mesh>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
				<planeGeometry args={[200, 200]} />
				<shadowMaterial opacity={0.55} />
			</mesh>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0015, 0]}>
				<planeGeometry args={[pool[0] * 2, pool[0] * 2]} />
				<meshBasicMaterial map={lightPool()} color={poolColor} transparent opacity={pool[1]} depthWrite={false} blending={THREE.AdditiveBlending} />
			</mesh>
		</ThreeCanvas>
	);
};
