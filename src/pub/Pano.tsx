import React, {useLayoutEffect, useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Bloom, EffectComposer, Vignette} from '@react-three/postprocessing';
import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Color,
	NeutralToneMapping,
	PMREMGenerator,
	Quaternion,
	ShaderMaterial,
	SRGBColorSpace,
	Vector3,
} from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {HEIGHT, WIDTH, WIN_W} from '../theme';
import {BAND, sweepLead} from '../components/Sweep';
import {makeCanvas, rng, toTexture} from '../three/textures';

/*
 * One 3D world seen through all five windows. The camera frames x ∈ [-8, 8],
 * y ∈ [-4, 4] on the z = 0 plane, so each window covers 3.2 world units and
 * window i is centred on winWX(i).
 */
export const PANO_W = 16;
export const winWX = (i: number) => -PANO_W / 2 + (PANO_W / 5) * (i + 0.5);
const CAM_Z = 10;
const FOV = (2 * Math.atan(4 / CAM_Z) * 180) / Math.PI;

const Studio: React.FC<{env: number}> = ({env}) => {
	const {gl, scene} = useThree();
	useLayoutEffect(() => {
		const pmrem = new PMREMGenerator(gl);
		const room = new RoomEnvironment();
		const tex = pmrem.fromScene(room, 0.03).texture;
		scene.environment = tex;
		scene.environmentIntensity = env;
		scene.background = new Color('#000000');
		return () => {
			scene.environment = null;
			tex.dispose();
			room.dispose();
			pmrem.dispose();
		};
	}, [gl, scene, env]);
	return null;
};

/** Camera move + a redraw on every video frame (uniforms change without React props). */
const Rig: React.FC<{frame: number; camX: number; camY: number; camZ: number}> = ({frame, camX, camY, camZ}) => {
	const {camera, invalidate} = useThree();
	useLayoutEffect(() => {
		camera.position.set(camX, camY, camZ);
		camera.lookAt(camX, camY * 0.6, 0);
		camera.updateMatrixWorld();
		invalidate();
	}, [camera, invalidate, frame, camX, camY, camZ]);
	return null;
};

/** Full-storefront 3D canvas with studio lighting and bloom (so lasers and LEDs glow). */
export const PanoStage: React.FC<{
	children: React.ReactNode;
	camX?: number;
	camY?: number;
	camZ?: number;
	env?: number;
	bloom?: number;
	threshold?: number; // luminance above which things glow
}> = ({children, camX = 0, camY = 0, camZ = CAM_Z, env = 0.9, bloom = 1.1, threshold = 0.72}) => {
	const frame = useCurrentFrame();
	return (
		<ThreeCanvas
			width={WIDTH}
			height={HEIGHT}
			dpr={2}
			frameloop="demand"
			gl={{antialias: true, preserveDrawingBuffer: true}}
			camera={{fov: FOV, position: [0, 0, CAM_Z], near: 0.1, far: 100}}
			onCreated={({gl}) => {
				gl.toneMapping = NeutralToneMapping;
				gl.toneMappingExposure = 1.05;
				gl.outputColorSpace = SRGBColorSpace;
			}}
		>
			<Rig frame={frame} camX={camX} camY={camY} camZ={camZ} />
			<Studio env={env} />
			<directionalLight position={[4, 6, 8]} intensity={1.6} color="#fff1e0" />
			<directionalLight position={[-6, 2, -4]} intensity={2.2} color="#8fc3ff" />
			{children}
			<EffectComposer multisampling={4}>
				<Bloom intensity={bloom} luminanceThreshold={threshold} luminanceSmoothing={0.2} mipmapBlur />
				<Vignette eskil={false} offset={0.25} darkness={0.55} />
			</EffectComposer>
		</ThreeCanvas>
	);
};

/**
 * Clips a full-width layer to what the tricolour band has uncovered, like
 * Card does per window: visible behind sweep `inAt`, until sweep `outAt`.
 */
export const PanoCard: React.FC<{inAt: number | null; outAt: number | null; children: (lf: number) => React.ReactNode}> = ({inAt, outAt, children}) => {
	const frame = useCurrentFrame();
	const trailIn = inAt === null ? Infinity : sweepLead(frame, inAt) - BAND;
	const leadOut = outAt === null || frame < outAt ? -Infinity : sweepLead(frame, outAt);
	const left = Math.max(0, leadOut);
	const right = Math.min(WIDTH, trailIn);
	if (inAt !== null && frame < inAt) return null;
	if (right <= left) return null;
	return (
		<div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${WIDTH - right}px 0 ${left}px)`}}>
			{children(inAt === null ? frame + 10000 : frame - inAt)}
		</div>
	);
};

/** Pixel x of a window's left edge (for 2D overlays on top of the panorama). */
export const winPX = (i: number) => i * WIN_W;

/* ================================================= laser + sparks */

const useGlowSprite = () =>
	useMemo(() => {
		const {c, ctx} = makeCanvas(128, 128);
		const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
		g.addColorStop(0, 'rgba(255,255,255,1)');
		g.addColorStop(0.18, 'rgba(255,220,170,0.95)');
		g.addColorStop(0.45, 'rgba(255,90,40,0.35)');
		g.addColorStop(1, 'rgba(255,40,0,0)');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, 128, 128);
		return toTexture(c);
	}, []);

/**
 * A laser: housing at `from`, beam to `to`, a white-hot spot at the impact.
 * `on` 0–1, `flicker` adds the pulsing of a real tube.
 */
export const Laser: React.FC<{from: [number, number, number]; to: [number, number, number]; on: number; color?: string; frame: number}> = ({
	from,
	to,
	on,
	color = '#ff5a2a',
	frame,
}) => {
	const glow = useGlowSprite();
	const a = new Vector3(...from);
	const b = new Vector3(...to);
	const mid = a.clone().add(b).multiplyScalar(0.5);
	const len = a.distanceTo(b);
	const q = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), b.clone().sub(a).normalize());
	const f = on * (0.85 + 0.15 * Math.sin(frame * 2.7) * Math.sin(frame * 0.9));
	return (
		<>
			<group position={a}>
				<mesh>
					<boxGeometry args={[0.36, 0.28, 0.36]} />
					<meshStandardMaterial color="#1d1f24" metalness={0.8} roughness={0.3} />
				</mesh>
				<mesh position={[0, -0.16, 0]}>
					<cylinderGeometry args={[0.06, 0.08, 0.08, 20]} />
					<meshStandardMaterial color="#b9bcc2" metalness={1} roughness={0.2} />
				</mesh>
			</group>
			{f > 0.01 ? (
				<>
					<mesh position={mid} quaternion={q}>
						<cylinderGeometry args={[0.012, 0.012, len, 8]} />
						<meshBasicMaterial color={color} transparent opacity={0.9 * f} blending={AdditiveBlending} toneMapped={false} />
					</mesh>
					<mesh position={b}>
						<planeGeometry args={[0.9 * f, 0.9 * f]} />
						<meshBasicMaterial map={glow} transparent blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
					</mesh>
					<mesh position={b}>
						<sphereGeometry args={[0.035, 12, 8]} />
						<meshBasicMaterial color="#ffffff" toneMapped={false} />
					</mesh>
				</>
			) : null}
		</>
	);
};

const sparkMaterial = () =>
	new ShaderMaterial({
		transparent: true,
		depthWrite: false,
		blending: AdditiveBlending,
		uniforms: {uScale: {value: 60}},
		vertexShader: `
attribute float aLife;
varying float vLife;
uniform float uScale;
void main() {
	vLife = aLife;
	vec4 mv = modelViewMatrix * vec4(position, 1.0);
	gl_PointSize = uScale * (0.25 + 0.75 * aLife) / -mv.z;
	gl_Position = projectionMatrix * mv;
}`,
		fragmentShader: `
varying float vLife;
void main() {
	vec2 p = gl_PointCoord - 0.5;
	float d = length(p);
	if (d > 0.5 || vLife <= 0.0) discard;
	float core = smoothstep(0.5, 0.0, d);
	vec3 hot = mix(vec3(1.0, 0.25, 0.05), vec3(1.0, 0.95, 0.8), vLife);
	gl_FragColor = vec4(hot * (1.5 + 2.0 * vLife), core * vLife);
}`,
	});

/**
 * Deterministic spark shower at `at` (a function of time, so the emitter can
 * follow the laser): each spark is born on a fixed schedule, flies ballistic
 * and fades. Rebuilt every frame from the frame number alone.
 */
export const Sparks: React.FC<{at: (t: number) => [number, number, number]; frame: number; rate: number; count?: number; seed?: number}> = ({
	at,
	frame,
	rate,
	count = 90,
	seed = 1,
}) => {
	const mat = useMemo(sparkMaterial, []);
	const geo = useMemo(() => {
		const g = new BufferGeometry();
		g.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));
		g.setAttribute('aLife', new BufferAttribute(new Float32Array(count), 1));
		return g;
	}, [count]);
	const pos = geo.attributes.position as BufferAttribute;
	const life = geo.attributes.aLife as BufferAttribute;
	const LIFE = 16;
	for (let k = 0; k < count; k++) {
		const r = rng(seed * 1000 + k);
		const phase = r() * LIFE;
		const age = (frame + phase) % LIFE;
		const born = frame - age;
		const [x0, y0, z0] = at(born);
		const vx = (r() - 0.5) * 0.16;
		const vy = 0.02 + r() * 0.1;
		const vz = 0.04 + r() * 0.08;
		const on = rate > 0 && r() < rate ? 1 : 0;
		pos.setXYZ(k, x0 + vx * age, y0 + vy * age - 0.006 * age * age, z0 + vz * age);
		life.setX(k, on * (1 - age / LIFE));
	}
	pos.needsUpdate = true;
	life.needsUpdate = true;
	return <points geometry={geo} material={mat} frustumCulled={false} />;
};
