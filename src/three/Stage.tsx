import React, {useLayoutEffect} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {NeutralToneMapping, PMREMGenerator, SRGBColorSpace} from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';

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

/**
 * A small photographic "product stage" that fills one window region.
 * Studio IBL + a key light, neutral tone mapping, transparent background
 * (black on the LED = open glass).
 */
export const Stage: React.FC<{
	width: number;
	height: number;
	fov?: number;
	camZ?: number;
	camY?: number;
	env?: number;
	children: React.ReactNode;
}> = ({width, height, fov = 30, camZ = 6, camY = 0, env = 1, children}) => (
	<ThreeCanvas
		width={width}
		height={height}
		dpr={2}
		gl={{antialias: true, alpha: true, preserveDrawingBuffer: true}}
		camera={{fov, position: [0, camY, camZ], near: 0.1, far: 100}}
		onCreated={({gl, camera}) => {
			gl.toneMapping = NeutralToneMapping;
			gl.toneMappingExposure = 1.05;
			gl.outputColorSpace = SRGBColorSpace;
			camera.lookAt(0, 0, 0);
		}}
	>
		<StudioLight intensity={env} />
		<directionalLight position={[3, 4, 5]} intensity={1.6} />
		<directionalLight position={[-4, 1, -3]} intensity={1.2} color="#9fb4ff" />
		{children}
	</ThreeCanvas>
);
