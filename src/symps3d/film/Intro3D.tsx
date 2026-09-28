import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Machine3D, layout} from '../kit/Machine3D';
import {Stage3D} from '../kit/Stage3D';
import {SPECS} from '../specs';
import {RevealLine, Wordmark, fontBase} from '../../symps/components/Typography';
import {C, ease, lerp, prog} from '../../symps/theme';
import {CutFlash, type V3} from './common';

/**
 * Four fast macro shots of the Opaline, cut hard:
 * the mast (print unit rushing past), a rolling wheel, the ink caps,
 * then a pull-back from the control panel that reveals the whole machine.
 */
export const INTRO3D = 156;
const spec = SPECS.opaline;

const MastGlide: React.FC = () => {
	const f = useCurrentFrame();
	const t = prog(f, 0, 40, ease.linear);
	const head = lerp(0.02, 0.62, prog(f, 0, 40, ease.inOut));
	const L = layout(spec, {head});
	const y = lerp(0.8, 2.1, t);
	return (
		<Stage3D
			cam={{pos: [L.mastX - 0.42, y + 0.05, L.mastZ + 0.38], target: [L.mastX, y + 0.12, L.mastZ], fov: 34, roll: -0.05}}
			look={{key: 1.2, rim: 5, env: 0.8, mirror: 0}}
			reflect={false}
		>
			<Machine3D spec={spec} state={{head, uv: 1}} />
		</Stage3D>
	);
};

const RollingWheel: React.FC = () => {
	const f = useCurrentFrame();
	const z = lerp(-0.5, 0.35, prog(f, 0, 36, ease.out));
	const L = layout(spec);
	const w: V3 = [L.wheel.x, L.wheel.y, L.wheel.z + z];
	return (
		<Stage3D cam={{pos: [w[0] + 0.55, 0.14, w[2] + 0.42], target: [w[0], w[1] + 0.02, w[2] - 0.05], fov: 30}} look={{key: 2.5, rim: 4, mirror: 0.35}}>
			<group position={[0, 0, z]}>
				<Machine3D spec={spec} state={{spin: z / spec.wheelR}} />
			</group>
		</Stage3D>
	);
};

const InkCaps: React.FC = () => {
	const f = useCurrentFrame();
	const L = layout(spec);
	const a = lerp(-0.4, -1.3, prog(f, 0, 36, ease.out));
	const c = L.caps;
	return (
		<Stage3D cam={{pos: [c.x + Math.sin(a) * 0.42, c.y + 0.3, c.z + Math.cos(a) * 0.42], target: [c.x, c.y - 0.02, c.z], fov: 32}} look={{key: 2.5, rim: 3}}>
			<Machine3D spec={spec} state={{uv: 0.6}} />
		</Stage3D>
	);
};

const PullBack: React.FC = () => {
	const f = useCurrentFrame();
	const t = prog(f, 0, 60, ease.out);
	const L = layout(spec);
	const p = L.panel;
	const near: V3 = [p.x + 0.12, p.y + 0.02, p.z + 0.32];
	const far: V3 = [1.9, 1.4, 4.4];
	const pos: V3 = [lerp(near[0], far[0], t), lerp(near[1], far[1], t), lerp(near[2], far[2], t)];
	const target: V3 = [lerp(p.x, -0.75, t), lerp(p.y, 1.35, t), lerp(p.z, 0.2, t)];
	return (
		<Stage3D cam={{pos, target, fov: lerp(28, 34, t)}} look={{key: lerp(2.5, 0.8, t), rim: 6, env: lerp(1, 0.55, t)}}>
			<Machine3D spec={spec} state={{uv: 0.5}} />
		</Stage3D>
	);
};

export const Intro3D: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Sequence durationInFrames={40}>
				<AbsoluteFill style={{opacity: prog(f, 0, 14, ease.inOut)}}>
					<MastGlide />
				</AbsoluteFill>
			</Sequence>
			<Sequence from={40} durationInFrames={36}>
				<RollingWheel />
			</Sequence>
			<Sequence from={76} durationInFrames={34}>
				<InkCaps />
			</Sequence>
			<Sequence from={110}>
				<PullBack />
			</Sequence>
			<CutFlash at={40} strength={0.25} />
			<CutFlash at={76} strength={0.25} />
			<CutFlash at={110} strength={0.35} />

			{/* SYMP'S over the ink caps, the promise over the reveal */}
			<AbsoluteFill style={{alignItems: 'center', paddingTop: 170, opacity: 1 - prog(f, 104, 112, ease.inOut)}}>
				<RevealLine at={78} dur={22} blur={16} rise={0.5}>
					<Wordmark size={150} sweep={prog(f, 84, 108, ease.inOut)} />
				</RevealLine>
			</AbsoluteFill>
			<AbsoluteFill style={{justifyContent: 'center', paddingLeft: 150}}>
				<RevealLine at={116} dur={24}>
					<div style={{...fontBase, fontSize: 84, fontWeight: 600, letterSpacing: '-0.035em', color: C.ink, lineHeight: 1.05}}>L’impression murale.</div>
				</RevealLine>
				<RevealLine at={128} dur={24}>
					<div style={{...fontBase, fontSize: 84, fontWeight: 200, letterSpacing: '-0.035em', color: C.ink, lineHeight: 1.05}}>Réinventée.</div>
				</RevealLine>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
