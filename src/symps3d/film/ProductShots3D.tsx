import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Machine3D} from '../kit/Machine3D';
import {Stage3D, type Look} from '../kit/Stage3D';
import {SPECS} from '../specs';
import type {Product} from '../../symps/data/products';
import {RevealLine, fontBase} from '../../symps/components/Typography';
import {C, ease, lerp, prog} from '../../symps/theme';
import {Caption, SlamTitle, Streak, orbit, whip, type V3} from './common';

/**
 * OPALINE: exploded parts fly together while the camera circles, the mast
 * deploys, then the machine turns a full revolution on its turntable while
 * the print unit runs up the mast and back.
 */
export const OPALINE3D = 246;

export const OpalineHero3D: React.FC<{product: Product}> = ({product}) => {
	const f = useCurrentFrame();
	const spec = SPECS.opaline;
	const build = prog(f, 0, 92, ease.out);
	const explode = 1 - build;
	const mast = prog(f, 58, 112, ease.inOut);
	// act 1: circle the assembly; act 2: low hero angle, machine turns
	const a1 = lerp(-2.6, -0.7, prog(f, 0, 112, ease.out));
	const turn = prog(f, 112, 236, ease.inOut) * Math.PI * 2;
	const head = f < 112 ? 0 : 0.5 - 0.5 * Math.cos(prog(f, 120, 236, ease.inOut) * Math.PI * 2);
	const t2 = prog(f, 108, 130, ease.inOut);
	const cam1 = orbit([0, 1.3, 0], lerp(5.2, 4.2, prog(f, 0, 112, ease.out)), a1, lerp(2.6, 1.5, prog(f, 0, 112, ease.out)), 36);
	const cam2 = orbit([0, 1.4, 0], 5.4, 0.55 + prog(f, 112, 246, ease.linear) * 0.18, 0.6, 36, 0, 0.95);
	const cam = {pos: [lerp(cam1.pos[0], cam2.pos[0], t2), lerp(cam1.pos[1], cam2.pos[1], t2), lerp(cam1.pos[2], cam2.pos[2], t2)] as V3, target: [lerp(0, cam2.target[0], t2), lerp(1.3, 1.4, t2), lerp(0, cam2.target[2], t2)] as V3, fov: 36};
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Stage3D cam={cam} look={{key: 2.2, rim: 5, env: 0.9, pool: [2.6, 0.2]}}>
				<group rotation={[0, turn, 0]}>
					<Machine3D spec={spec} state={{explode, mast: 0.25 + 0.75 * mast, head, uv: prog(f, 90, 120, ease.inOut)}} />
				</group>
			</Stage3D>
			<AbsoluteFill style={{justifyContent: 'center', paddingLeft: 150, paddingBottom: 60}}>
				<SlamTitle text={product.name} at={120} size={200} />
				<RevealLine at={146} dur={26} style={{marginTop: 18}}>
					<div style={{...fontBase, fontSize: 38, fontWeight: 300, color: C.mist}}>{product.tagline}</div>
				</RevealLine>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

/** How each machine is presented: the entrance and camera move differ, the grammar stays the same. */
type Move = 'drive' | 'orbit' | 'crane' | 'spin';

const LOOKS: Record<string, Look> = {
	studio: {key: 2.4, rim: 4, env: 1},
	bright: {key: 3, rim: 2, env: 1.6, floor: '#1A1B1E', mirror: 0.15, pool: [3, 0.35], poolColor: '#FFFFFF', exposure: 1.1, cyc: ['#DADDE2', 0.8]},
	edge: {key: 0.5, rim: 9, env: 0.45, rimColor: '#9FC2FF', cyc: ['#8FB2FF', 0.5]},
	red: {key: 1.8, rim: 6, env: 0.8, rimColor: '#FF4D66', pool: [2.4, 0.22], poolColor: '#FF3355', cyc: ['#8A1426', 0.6]},
};

export const PRODUCT3D = 78;

export const ProductShot3D: React.FC<{product: Product; move: Move; look?: keyof typeof LOOKS; textSide?: 'left' | 'right'}> = ({product, move, look = 'studio', textSide = 'left'}) => {
	const f = useCurrentFrame();
	const spec = SPECS[product.id];
	const D = PRODUCT3D;
	const w = whip(f, D);
	const t = prog(f, 0, D, ease.out);
	const m = spec.mast;
	// machine sits in the third opposite the text
	const sh = textSide === 'left' ? 0.75 : -0.75;
	const center: V3 = [0, m * 0.5, 0];

	let cam = orbit(center, 3.9, 0.5 + w.yaw, 0.55, 40, 0, sh);
	let z = 0;
	let spin = 0;
	let turn = 0;
	let head = 0.3 + 0.35 * Math.sin(f * 0.07);
	switch (move) {
		case 'drive': {
			// rolls in from the side and brakes, the camera panning with it
			const d = prog(f, 0, 34, ease.out);
			z = lerp(-3.4, 0, d);
			spin = z / spec.wheelR;
			turn = lerp(0, 0.45, prog(f, 30, D, ease.inOut));
			cam = orbit([0, center[1], z * 0.4], 3.9, 0.8 + w.yaw, 0.45, 40, 0, sh);
			break;
		}
		case 'orbit':
			cam = orbit(center, lerp(3.4, 3.9, t), lerp(-1.1, 0.6, t) + w.yaw, lerp(2.2, 0.6, t), 40, 0, sh);
			break;
		case 'crane': {
			const c = prog(f, 0, D * 0.8, ease.out);
			cam = orbit([0, lerp(m * 0.85, center[1], c), 0], lerp(2.4, 3.9, c), 0.35 + w.yaw, lerp(m + 0.5, 0.5, c), 40, 0, sh);
			head = lerp(0.9, 0.2, c);
			break;
		}
		case 'spin':
			turn = lerp(-1.6, 0.35, t);
			cam = orbit(center, lerp(3.2, 3.9, t), 0.55 + w.yaw, 0.4, 40, 0, sh);
			break;
	}

	return (
		<AbsoluteFill style={{background: look === 'bright' ? '#15161A' : '#000'}}>
			<Streak blur={w.blur}>
				<Stage3D cam={cam} look={LOOKS[look]} background={look === 'bright' ? '#15161A' : '#000'}>
					<group position={[0, 0, z]} rotation={[0, turn, 0]}>
						<Machine3D spec={spec} state={{spin, head, uv: 0.8}} />
					</group>
				</Stage3D>
			</Streak>
			<AbsoluteFill
				style={{
					justifyContent: 'center',
					alignItems: textSide === 'left' ? 'flex-start' : 'flex-end',
					padding: '0 150px 40px',
				}}
			>
				{product.model && (
					<div style={{marginBottom: 14}}>
						<Caption text={product.model} at={10} out={D - 12} />
					</div>
				)}
				<SlamTitle text={product.name} at={8} out={D - 12} size={product.name.length > 7 ? 150 : 180} />
				{product.suffix && <SlamTitle text={product.suffix} at={14} out={D - 12} size={150} weight={200} />}
				<RevealLine at={22} out={D - 14} style={{marginTop: 14}}>
					<div style={{...fontBase, fontSize: 34, fontWeight: 300, color: C.mist}}>{product.tagline}</div>
				</RevealLine>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
