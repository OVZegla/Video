import type {Product} from './data/products';
import {MACHINE_ASPECT, mastOffset} from './components/Machine';
import {HEIGHT, WIDTH} from './theme';

/** Floor line of the single-product shots. */
export const PRODUCT_FLOOR_Y = Math.round(HEIGHT * 0.88);
/** Height of the tallest machine in the single-product shots; the others scale from it. */
export const PRODUCT_MAX_H = 860;

export const productHeight = (p: Product) => PRODUCT_MAX_H * p.look.height;
export const productX = (p: Product) => (p.side === 'right' ? WIDTH * 0.665 : WIDTH * 0.335);

/** Screen x of the (inner-most) mast at the end of a product shot: where the transition line is born. */
export const mastScreenX = (p: Product) => productX(p) + mastOffset(p, productHeight(p), p.side);

export const machineWidth = (h: number) => h * MACHINE_ASPECT;
