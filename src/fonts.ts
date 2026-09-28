import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {FONT} from './theme';

// Jost — geometric, Futura-lineage sans: a natural Bauhaus voice.
// Loaded from /public so rendering never depends on the network.
const weights = ['300', '500', '700', '800'] as const;

export const fontsReady = Promise.all(
	weights.map((weight) =>
		loadFont({
			family: FONT,
			url: staticFile(`fonts/jost-latin-${weight}-normal.woff2`),
			weight,
			format: 'woff2',
		}),
	),
);
