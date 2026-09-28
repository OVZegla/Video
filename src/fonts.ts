import {staticFile} from 'remotion';
import {loadFontsSafely} from './loadFontsSafely';
import {FONT} from './theme';

// Jost — geometric, Futura-lineage sans: a natural Bauhaus voice.
// Loaded from /public so rendering never depends on the network.
const weights = ['300', '500', '700', '800'];

export const fontsReady = loadFontsSafely(
	weights.map((weight) => ({family: FONT, url: staticFile(`fonts/jost-latin-${weight}-normal.woff2`), weight})),
);
