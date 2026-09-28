import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {FONT} from './theme';

// Inter (SIL OFL): contemporary Swiss grotesque, bundled for offline renders.
const weights = ['200', '300', '400', '500', '600'] as const;

export const sympsFontsReady = Promise.all(
	weights.map((weight) =>
		loadFont({
			family: FONT,
			url: staticFile(`symps/fonts/inter-latin-${weight}-normal.woff2`),
			weight,
			format: 'woff2',
		}),
	),
);
