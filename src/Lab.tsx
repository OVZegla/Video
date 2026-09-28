import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage} from './three/Stage';
import {Bottle, Cap, Keychains, ToteBag, TShirt} from './three/models/SmallObjects';

const bgs = ['#A9D2FF', '#F2352B', '#F6F5F0', '#2451FF', '#4FA3FF'];
export const Lab: React.FC = () => (
	<AbsoluteFill style={{background: '#000'}}>
		{[
			<Bottle rotY={0.2} />,
			<TShirt rotY={0.2} swing={0.02} />,
			<ToteBag rotY={-0.2} swing={0} />,
			<Cap rotY={0.4} />,
			<Keychains rotY={0.2} t={10} />,
		].map((m, i) => (
			<div key={i} style={{position: 'absolute', left: i * 128, top: 0, width: 128, height: 320, background: bgs[i]}}>
				<Stage width={128} height={244} camZ={7} camY={1} lookY={-0.1} floorY={-1.15}>
					{m}
				</Stage>
			</div>
		))}
	</AbsoluteFill>
);
