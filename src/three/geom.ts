import {Vector2} from 'three';

/**
 * LatheGeometry spreads v evenly per profile point, not per length: resample the
 * profile uniformly by arc length so a texture keeps its proportions.
 */
export const resample = (pts: Vector2[], n: number) => {
	const seg = pts.slice(1).map((p, k) => p.distanceTo(pts[k]));
	const total = seg.reduce((a, b) => a + b, 0);
	const out: Vector2[] = [];
	for (let i = 0; i < n; i++) {
		let d = (i / (n - 1)) * total;
		let k = 0;
		while (k < seg.length - 1 && d > seg[k]) d -= seg[k++];
		out.push(pts[k].clone().lerp(pts[k + 1], Math.min(1, d / seg[k])));
	}
	return out;
};

