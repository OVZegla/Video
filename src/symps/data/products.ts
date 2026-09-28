/**
 * The Symp's range, in film order.
 *
 * Reorder, remove or add entries here: the product sequence, the brand moment
 * and the final lineup are all derived from this list.
 *
 * Imagery: drop the official photo for a machine into
 *   public/symps/products/<id>.png   (transparent PNG preferred; webp/jpg also work)
 * and run `npm run symps:assets`. The film then uses the photo, uncropped and
 * with its own proportions, instead of the built-in vector render (`look`).
 */

export type Finish = 'gloss' | 'satin' | 'matte';

/** Parameters of the built-in vector render, used when no photo is supplied. */
export interface MachineLook {
	body: string; // main panels
	bodyLight: string; // lit side of panels
	bodyDark: string; // shaded side
	rail: string; // aluminium mast
	railLight: string;
	accent: string; // status light / brand line
	finish: Finish;
	/** mast height relative to the tallest machine (T1000 = 1). */
	height: number;
	/** base width in render units (canvas is 600 wide). */
	baseWidth: number;
	carriageWidth: number;
	dualMast?: boolean;
	/** subtle pearlescent sheen (Opaline). */
	pearl?: boolean;
	/** 0 = pared-back, 1 = fully equipped. */
	detail: number;
}

export type Mood = 'darkSide' | 'studioWhite' | 'graphite' | 'edge' | 'highKey' | 'industrial' | 'clean' | 'ruby';

export interface Environment {
	mood: Mood;
	/** background gradient, top → bottom */
	sky: [string, string];
	floor: string;
	/** text colour on this background */
	text: string;
	subText: string;
	/** colour of the soft rim/edge light */
	rim: string;
	/** true for bright scenes (shadow instead of reflection) */
	bright: boolean;
}

/** Named details of a machine, as [x, y] fractions of its photo (used for close-ups). */
export type DetailKey = 'wheel' | 'ink' | 'panel' | 'cable' | 'screen' | 'top' | 'head' | 'connector' | 'rail';

export interface Product {
	id: string;
	name: string;
	/** optional light-weight second word, e.g. "EDITION" */
	suffix?: string;
	/** secondary reference, e.g. "TMP1000" */
	model?: string;
	tagline: string;
	/** machine on the right or left third of the frame */
	side: 'left' | 'right';
	env: Environment;
	look: MachineLook;
	/** where the details sit on the official photo, if there is one */
	details?: Partial<Record<DetailKey, [number, number]>>;
}

const DARK_TEXT = {text: '#F5F5F7', subText: '#8E8E93'};
const LIGHT_TEXT = {text: '#1D1D1F', subText: '#6E6E73'};

export const PRODUCTS: Product[] = [
	{
		id: 'opaline',
		name: 'OPALINE',
		tagline: 'L’élégance rencontre la technologie.',
		side: 'right',
		env: {mood: 'darkSide', sky: ['#050608', '#000000'], floor: '#0A0B0D', rim: '#9FC2FF', bright: false, ...DARK_TEXT},
		look: {
			body: '#E9E7E2', bodyLight: '#FBFAF7', bodyDark: '#A9A69F',
			rail: '#B9BDC4', railLight: '#F2F4F7', accent: '#2F7BFF',
			finish: 'gloss', height: 1, baseWidth: 430, carriageWidth: 236, pearl: true, detail: 1,
		},
		details: {
			wheel: [0.468, 0.955],
			ink: [0.255, 0.735],
			head: [0.2, 0.77],
			panel: [0.742, 0.69],
			cable: [0.485, 0.83],
			connector: [0.535, 0.63],
			screen: [0.535, 0.48],
			top: [0.395, 0.03],
			rail: [0.395, 0.3],
		},
	},
	{
		id: 'm1',
		name: 'M1',
		model: 'MK01',
		tagline: 'La précision, simplement.',
		side: 'left',
		env: {mood: 'studioWhite', sky: ['#E9EAEC', '#C9CBCF'], floor: '#D5D7DA', rim: '#FFFFFF', bright: true, ...LIGHT_TEXT},
		look: {
			body: '#D6D8DB', bodyLight: '#F1F2F4', bodyDark: '#9A9EA4',
			rail: '#AEB3BA', railLight: '#E9ECEF', accent: '#2F7BFF',
			finish: 'satin', height: 0.9, baseWidth: 390, carriageWidth: 214, detail: 0.8,
		},
	},
	{
		id: 'graphite',
		name: 'GRAPHITE',
		suffix: 'EDITION',
		tagline: 'Compacte. Mobile. Radicale.',
		side: 'right',
		env: {mood: 'graphite', sky: ['#24262A', '#0B0C0E'], floor: '#141518', rim: '#C9D3DF', bright: false, ...DARK_TEXT},
		look: {
			body: '#45484E', bodyLight: '#6E727A', bodyDark: '#212326',
			rail: '#565A61', railLight: '#9CA2AB', accent: '#5B8CFF',
			finish: 'satin', height: 0.78, baseWidth: 340, carriageWidth: 196, detail: 0.9,
		},
	},
	{
		id: 'black-2',
		name: 'BLACK 2.0',
		model: 'TWF1000',
		tagline: 'Le noir, dans sa forme la plus pure.',
		side: 'left',
		env: {mood: 'edge', sky: ['#000000', '#000000'], floor: '#030304', rim: '#BFD6FF', bright: false, ...DARK_TEXT},
		look: {
			body: '#141416', bodyLight: '#3A3B40', bodyDark: '#050506',
			rail: '#1C1D20', railLight: '#55585F', accent: '#2F7BFF',
			finish: 'gloss', height: 0.92, baseWidth: 410, carriageWidth: 224, detail: 1,
		},
	},
	{
		id: 'white',
		name: 'WHITE',
		model: 'TMP1000',
		tagline: 'La pureté du blanc. Partout avec vous.',
		side: 'right',
		env: {mood: 'highKey', sky: ['#FAFAFA', '#EDEDED'], floor: '#F2F2F2', rim: '#FFFFFF', bright: true, ...LIGHT_TEXT},
		look: {
			body: '#F4F4F2', bodyLight: '#FFFFFF', bodyDark: '#C4C5C4',
			rail: '#E0E1E3', railLight: '#FFFFFF', accent: '#8AA8D8',
			finish: 'matte', height: 0.84, baseWidth: 350, carriageWidth: 204, detail: 0.7,
		},
	},
	{
		id: 't1000',
		name: 'T1000',
		model: 'TPP1000',
		tagline: 'Pensée pour les très grands formats.',
		side: 'left',
		env: {mood: 'industrial', sky: ['#101216', '#020203'], floor: '#0B0C0F', rim: '#A9C4FF', bright: false, ...DARK_TEXT},
		look: {
			body: '#2A2C31', bodyLight: '#4D5058', bodyDark: '#131417',
			rail: '#A7ACB4', railLight: '#E6E9ED', accent: '#2F7BFF',
			finish: 'satin', height: 1, baseWidth: 560, carriageWidth: 250, dualMast: true, detail: 1,
		},
	},
	{
		id: 'access',
		name: 'ACCESS',
		tagline: 'L’impression murale, accessible à tous.',
		side: 'right',
		env: {mood: 'clean', sky: ['#1A1C20', '#0A0B0D'], floor: '#121316', rim: '#DDE6F2', bright: false, ...DARK_TEXT},
		look: {
			body: '#C5CAD1', bodyLight: '#E6E9ED', bodyDark: '#8B9098',
			rail: '#9EA4AB', railLight: '#DADDE2', accent: '#2F7BFF',
			finish: 'satin', height: 0.8, baseWidth: 340, carriageWidth: 190, detail: 0.35,
		},
	},
	{
		id: 'ruby',
		name: 'RUBY',
		model: 'MK02',
		tagline: 'Compacte. Précieuse. Intense.',
		side: 'left',
		env: {mood: 'ruby', sky: ['#12050A', '#000000'], floor: '#070203', rim: '#FF5C70', bright: false, ...DARK_TEXT},
		look: {
			body: '#7A1224', bodyLight: '#B8263D', bodyDark: '#3A0610',
			rail: '#2B2B2F', railLight: '#6B6C72', accent: '#FF3B55',
			finish: 'gloss', height: 0.76, baseWidth: 322, carriageWidth: 186, detail: 0.85,
		},
	},
];

export const productById = (id: string): Product => {
	const p = PRODUCTS.find((x) => x.id === id);
	if (!p) throw new Error(`Unknown product "${id}"`);
	return p;
};

/** Products shown before the mid-film brand moment (the rest come after). */
export const FIRST_ACT_COUNT = 4;
