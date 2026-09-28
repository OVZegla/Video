import {C} from '../theme';
import type {Ink} from '../components/Cards';

/** Text colours for each window ground. */
export const INK: Record<'blue' | 'red' | 'white' | 'sky' | 'ice' | 'deep' | 'black', Ink> = {
	blue: {text: C.white, sub: C.ice, accent: C.ice, plate: C.blue},
	red: {text: C.white, sub: C.white, accent: C.ice, plate: C.red},
	white: {text: C.blue, sub: C.brandNavy, accent: C.red, plate: C.white},
	sky: {text: C.white, sub: C.white, accent: C.brandNavy, plate: C.sky},
	ice: {text: C.blueDeep, sub: C.blueDeep, accent: C.red, plate: C.ice},
	deep: {text: C.white, sub: C.ice, accent: C.sky, plate: C.blueDeep},
	black: {text: C.white, sub: C.ice, accent: C.sky, plate: C.black},
};

/** Motif colour to use on each ground. */
export const FG = {
	blue: C.white,
	red: C.white,
	white: C.blue,
	sky: C.white,
	ice: C.blue,
	deep: C.sky,
	black: C.blueDeep,
} as const;

export const BG = {
	blue: C.blue,
	red: C.red,
	white: C.white,
	sky: C.sky,
	ice: C.ice,
	deep: C.blueDeep,
	black: C.black,
} as const;

export type Ground = keyof typeof BG;
