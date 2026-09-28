import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {FONT} from './theme';

// Jost — geometric, Futura-lineage sans: a natural Bauhaus voice.
// Loaded from /public so rendering never depends on the network.
const weights = ['300', '500', '700', '800'] as const;

export const DISPLAY = 'Archivo';

export const fontsReady = Promise.all([
	// Archivo variable (width + weight axes): condensed display cuts that fit a 128 px window.
	loadFont({
		family: DISPLAY,
		url: staticFile('fonts/archivo-latin-wdth-normal.woff2'),
		weight: '100 900',
		stretch: '62% 125%',
		format: 'woff2',
	}),
	...weights.map((weight) =>
		loadFont({
			family: FONT,
			url: staticFile(`fonts/jost-latin-${weight}-normal.woff2`),
			weight,
			format: 'woff2',
		}),
	),
]);
