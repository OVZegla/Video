import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {RevealLine, Wordmark, fontBase} from '../components/Typography';
import {C, ease, lerp, prog} from '../theme';

export const OUTRO_DURATION = 150;

/** Back to black. The name, one pass of light across it, the promise, then black. */
export const Outro: React.FC = () => {
	const f = useCurrentFrame();
	const logoIn = prog(f, 8, 50, ease.out);
	const sweep = prog(f, 30, 84, ease.inOut);
	const end = prog(f, OUTRO_DURATION - 34, OUTRO_DURATION - 4, ease.inOut);
	return (
		<AbsoluteFill style={{background: '#000', alignItems: 'center', justifyContent: 'center'}}>
			{/* faint halo behind the logo, carried by the light pass */}
			<div
				style={{
					position: 'absolute',
					width: 1200,
					height: 420,
					borderRadius: '50%',
					background: 'radial-gradient(ellipse at center, rgba(47,123,255,0.10) 0%, rgba(0,0,0,0) 65%)',
					opacity: Math.sin(sweep * Math.PI) * (1 - end),
					transform: `translateY(-40px)`,
				}}
			/>
			<div style={{opacity: (1 - end) * logoIn, transform: `scale(${lerp(0.97, 1, logoIn)})`, filter: `blur(${(1 - logoIn) * 12}px)`, marginTop: -60}}>
				<Wordmark size={130} sweep={sweep} sub subOpacity={prog(f, 40, 70, ease.inOut)} />
			</div>
			<div style={{position: 'absolute', top: 700, opacity: 1 - end}}>
				<RevealLine at={66} dur={40}>
					<div style={{...fontBase, fontSize: 40, fontWeight: 300, letterSpacing: '-0.01em', color: C.ink}}>
						Donnez une nouvelle dimension aux murs.
					</div>
				</RevealLine>
			</div>
		</AbsoluteFill>
	);
};
