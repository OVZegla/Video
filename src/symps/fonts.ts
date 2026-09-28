import {staticFile} from 'remotion';
import {loadFontsSafely} from '../loadFontsSafely';
import {FONT} from './theme';

// Inter (SIL OFL): contemporary Swiss grotesque, bundled for offline renders.
const weights = ['200', '300', '400', '500', '600'];

export const sympsFontsReady = loadFontsSafely(
	weights.map((weight) => ({family: FONT, url: staticFile(`symps/fonts/inter-latin-${weight}-normal.woff2`), weight})),
);
