import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT_UI, ROLES, ROLE_ORDER} from '../theme';
import {E, mix, prog} from '../lib/anim';
import {Headline} from '../components/Headline';

// 56–60 s. Signature — no name, no logo: the line, and six points for six
// assistants, born from the blue point of the validation.

export const End: React.FC = () => {
	const t = useCurrentFrame();
	const split = prog(t, 0, 26, E.inOut);
	const rise = prog(t, 0, 22, E.inOut);
	const gap = 34;
	return (
		<AbsoluteFill style={{background: C.paper}}>
			{ROLE_ORDER.map((r, i) => {
				const tx = 960 + (i - 2.5) * gap * split;
				const y = mix(540, 318, rise);
				const size = mix(22, 16, split);
				const col = i === 0 && split < 0.5 ? C.blue : undefined;
				return (
					<div
						key={r}
						style={{
							position: 'absolute',
							left: tx - size / 2,
							top: y - size / 2,
							width: size,
							height: size,
							borderRadius: size / 2,
							background: col ?? (split < 0.35 ? C.blue : ROLES[r].color),
							opacity: i === 0 ? 1 : Math.min(1, split * 3),
						}}
					/>
				);
			})}
			<div style={{position: 'absolute', top: 392, left: 0, right: 0}}>
				<Headline lines={['Votre activité.']} f={t} start={8} size={116} align="center" weight={660} />
			</div>
			<div style={{position: 'absolute', top: 520, left: 0, right: 0}}>
				<Headline
					lines={[{text: 'Toute une équipe à vos côtés.', color: C.blue}]}
					f={t}
					start={20}
					stagger={3}
					size={116}
					align="center"
					weight={660}
				/>
			</div>
			<div
				style={{
					position: 'absolute',
					top: 700,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontFamily: FONT_UI,
					fontSize: 34,
					fontWeight: 500,
					color: C.ink2,
					letterSpacing: '-0.01em',
					opacity: prog(t, 42, 60),
					transform: `translateY(${(1 - prog(t, 42, 64)) * 14}px)`,
				}}
			>
				Six assistants IA pour votre quotidien professionnel.
			</div>
			<div
				style={{
					position: 'absolute',
					bottom: 64,
					left: 0,
					right: 0,
					textAlign: 'center',
					fontFamily: FONT_UI,
					fontSize: 21,
					fontWeight: 520,
					color: C.ink3,
					letterSpacing: '0.01em',
					opacity: prog(t, 50, 66),
				}}
			>
				Concept d’application — démonstration illustrative
			</div>
		</AbsoluteFill>
	);
};
