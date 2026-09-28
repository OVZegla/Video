import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, ease, prog, WIN_COUNT, WIN_W, winX} from '../theme';
import {Label, Layer} from '../components/primitives';
import {BladeSign, EngravedAcrylic, Mug, PrintedAcrylic, WoodPanel} from '../components/Products';

export const MATERIALS_LEN = 104;

const LABELS = ['ACRYLIQUE', 'GRAVURE', 'BOIS', 'OBJETS', 'ENSEIGNE'];
const ACCENTS = [C.blue, C.white, C.red, C.blue, C.red];

/**
 * A conveyor through the storefront: every product slides in from the
 * neighbouring window, settles, performs its small material gesture
 * (gloss, engraving, burn, print, swing), then glides on to the next window.
 */
export const Materials: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	return (
		<Layer>
			{Array.from({length: WIN_COUNT}, (_, i) => {
				const enter = spring({
					frame: frame - i * 4,
					fps,
					config: {damping: 20, stiffness: 70, mass: 0.9},
				});
				const exitStart = 78 + (WIN_COUNT - 1 - i) * 3;
				const exit = prog(frame, exitStart, exitStart + 22, ease.in);
				const x = winX(i) - WIN_W * (1 - enter) + WIN_W * 1.1 * exit;
				const rot = (1 - enter) * -8 + exit * 6;
				const t = frame - 22 - i * 4; // local time once settled
				const labelP = prog(frame, 26 + i * 3, 42 + i * 3, ease.out) * (1 - prog(frame, 70 + i * 2, 82 + i * 2, ease.in));

				let product: React.ReactNode;
				switch (i) {
					case 0:
						product = <PrintedAcrylic shine={prog(t, 4, 34, ease.soft)} />;
						break;
					case 1:
						product = <EngravedAcrylic draw={prog(t, 0, 40, ease.soft)} />;
						break;
					case 2:
						product = <WoodPanel burn={prog(t, 6, 22, ease.out)} />;
						break;
					case 3:
						product = <Mug print={prog(t, 4, 24, ease.inOut)} />;
						break;
					default:
						product = (
							<BladeSign
								swing={(1 - enter) * 16 + Math.sin(Math.max(0, t) / 6) * 5 * Math.exp(-Math.max(0, t) / 22) - exit * 10}
								light={0.5 + 0.5 * Math.sin(frame / 5)}
							/>
						);
				}
				return (
					<React.Fragment key={i}>
						<div
							style={{
								position: 'absolute',
								left: x,
								top: 30,
								width: WIN_W,
								transform: `rotate(${rot}deg)`,
								opacity: Math.min(1, enter * 1.5) * (1 - prog(frame, exitStart + 12, exitStart + 22)),
							}}
						>
							{product}
						</div>
						<div style={{position: 'absolute', left: winX(i), top: 0}}>
							<Label text={LABELS[i]} p={labelP} accent={ACCENTS[i]} />
						</div>
					</React.Fragment>
				);
			})}
		</Layer>
	);
};
