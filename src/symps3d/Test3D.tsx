import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Machine3D} from './kit/Machine3D';
import {Stage3D} from './kit/Stage3D';
import {SPECS} from './specs';

export const Test3D: React.FC = () => {
	const f = useCurrentFrame();
	const a = [0.35, -0.5, 2.6, -2.4][f % 4];
	const d = 4.2;
	return (
		<Stage3D cam={{pos: [Math.sin(a) * d, 1.3, Math.cos(a) * d], target: [0, 1.3, 0], fov: 40}}>
			<Machine3D spec={SPECS.opaline} state={{head: 0, uv: 0.5}} />
		</Stage3D>
	);
};
