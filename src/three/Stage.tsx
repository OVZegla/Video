import React, {useLayoutEffect, useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {NeutralToneMapping, PMREMGenerator, SRGBColorSpace} from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {makeCanvas, toTexture} from './textures';

/** Image-based lighting from a procedural studio room — no network, no HDR files. */
const StudioLight: React.FC<{intensity?: number}> = ({intensity = 1}) => {
	const {gl, scene} = useThree();
	useLayoutEffect(() => {
		const pmrem = new PMREMGenerator(gl);
		const room = new RoomEnvironment();
		const env = pmrem.fromScene(room, 0.03).texture;
		scene.environment = env;
		scene.environmentIntensity = intensity;
		return () => {
			scene.environment = null;
			env.dispose();
			room.dispose();
			pmrem.dispose();
		};
	}, [gl, scene, intensity]);
	return null;
};

/** Places the camera on a slow orbit around the product; re-applied every video frame. */
const CameraRig: React.FC<{z: number; y: number; orbit: number; lookY: number}> = ({z, y, orbit, lookY}) => {
	const {camera, invalidate} = useThree();
	useLayoutEffect(() => {
		camera.position.set(Math.sin(orbit) * z, y, Math.cos(orbit) * z);
		camera.lookAt(0, lookY, 0);
		camera.updateMatrixWorld();
		invalidate();
	}, [camera, invalidate, z, y, orbit, lookY]);
	return null;
};

/** Glossy black floor: the mirrored product shows through it and fades with distance. */
const useFloorFade = () =>
	useMemo(() => {
		const {c, ctx} = makeCanvas(256, 256);
		const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
		g.addColorStop(0, 'rgb(185,185,185)'); // ~27 % of the reflection shows near the object
		g.addColorStop(0.6, 'rgb(235,235,235)');
		g.addColorStop(1, 'rgb(255,255,255)');
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, 256, 256);
		return toTexture(c, false);
	}, []);

const Floor: React.FC<{y: number}> = ({y}) => {
	const fade = useFloorFade();
	return (
		<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} renderOrder={10}>
			<planeGeometry args={[5, 5]} />
			<meshBasicMaterial color="#000000" transparent alphaMap={fade} depthWrite={false} toneMapped={false} />
		</mesh>
	);
};

/**
 * A photographic product stage filling one window: studio IBL, a warm key,
 * a light-blue rim light, optional mirror floor, and a slowly orbiting camera.
 * Transparent background (black on the LED = open glass).
 */
export const Stage: React.FC<{
	width: number;
	height: number;
	fov?: number;
	camZ?: number;
	camY?: number;
	lookY?: number;
	orbit?: number;
	floorY?: number;
	env?: number;
	children: React.ReactNode;
}> = ({width, height, fov = 30, camZ = 6, camY = 0, lookY = 0, orbit = 0, floorY, env = 1, children}) => (
	<ThreeCanvas
		width={width}
		height={height}
		dpr={2}
		// render only when React props change (i.e. once per video frame), never in a free-running loop
		frameloop="demand"
		gl={{antialias: true, alpha: true, preserveDrawingBuffer: true}}
		camera={{fov, position: [0, camY, camZ], near: 0.1, far: 100}}
		onCreated={({gl}) => {
			gl.toneMapping = NeutralToneMapping;
			gl.toneMappingExposure = 1.08;
			gl.outputColorSpace = SRGBColorSpace;
		}}
	>
		<CameraRig z={camZ} y={camY} orbit={orbit} lookY={lookY} />
		<StudioLight intensity={env} />
		<directionalLight position={[3, 4, 5]} intensity={1.7} color="#fff4e6" />
		<directionalLight position={[-4, 2, -4]} intensity={2.4} color="#8fc3ff" />
		<directionalLight position={[4, 1, -3]} intensity={1.2} color="#ffffff" />
		<group>{children}</group>
		{floorY !== undefined ? (
			<>
				<group position={[0, 2 * floorY, 0]} scale={[1, -1, 1]}>
					{children}
				</group>
				<Floor y={floorY} />
			</>
		) : null}
	</ThreeCanvas>
);
