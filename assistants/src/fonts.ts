import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Bundled variable fonts (SIL OFL) so renders are identical offline.
loadFont({
	family: 'Inter Tight',
	url: staticFile('fonts/inter-tight-latin-wght-normal.woff2'),
	weight: '100 900',
});
loadFont({
	family: 'Inter',
	url: staticFile('fonts/inter-latin-wght-normal.woff2'),
	weight: '100 900',
});
