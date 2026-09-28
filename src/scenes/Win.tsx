import React from 'react';
import {Card} from '../components/Card';
import {Motif, Ribbon, WindowBg} from '../components/Patterns';
import {BG, FG, Ground} from './palette';

/** A window for one scene: coloured ground + Bauhaus motifs + ribbon slice, then content. */
export const Win: React.FC<{
	i: number;
	inAt: number | null;
	outAt: number | null;
	ground: Ground;
	motifs?: Motif[];
	ribbon?: Ribbon;
	children?: (lf: number) => React.ReactNode;
}> = ({i, inAt, outAt, ground, motifs = [], ribbon, children}) => (
	<Card i={i} inAt={inAt} outAt={outAt}>
		{(lf) => (
			<>
				<WindowBg i={i} lf={lf} style={{bg: BG[ground], fg: FG[ground], motifs, ribbon}} />
				{children ? children(lf) : null}
			</>
		)}
	</Card>
);
