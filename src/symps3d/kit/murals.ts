import * as THREE from 'three';

/**
 * Wall artworks as canvas textures, plus the progressive "print" mask:
 * the wall printer lays the image down in vertical swaths, the head
 * running up and down the mast while the machine steps along the wall.
 */

export type MuralStyle = 'waves' | 'arches' | 'blobs' | 'geo' | 'botanical' | 'lines';

const cache = new Map<string, THREE.CanvasTexture>();

export const muralTexture = (style: MuralStyle, palette: string[], w = 2048, h = 1024) => {
	const key = `${style}-${palette.join()}-${w}x${h}`;
	if (cache.has(key)) return cache.get(key)!;
	const canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	const c = canvas.getContext('2d')!;
	const [a, b, cc, d, e] = [...palette, ...palette];
	c.fillStyle = a;
	c.fillRect(0, 0, w, h);
	switch (style) {
		case 'waves':
			[b, cc, d, e].forEach((col, i) => {
				const y0 = h * (0.35 + i * 0.16);
				const amp = h * (0.08 - i * 0.01);
				c.beginPath();
				c.moveTo(0, y0);
				c.bezierCurveTo(w * 0.2, y0 - amp * 2, w * 0.35, y0 + amp * 2, w * 0.55, y0);
				c.bezierCurveTo(w * 0.7, y0 - amp * 1.8, w * 0.85, y0 - amp * 1.5, w, y0 + amp);
				c.lineTo(w, h);
				c.lineTo(0, h);
				c.fillStyle = col;
				c.fill();
			});
			c.fillStyle = e;
			c.beginPath();
			c.arc(w * 0.72, h * 0.2, h * 0.08, 0, Math.PI * 2);
			c.fill();
			break;
		case 'arches':
			[b, cc, d, e].forEach((col, i) => {
				const r = w * (0.2 - i * 0.042);
				const cx = w * 0.32;
				c.fillStyle = col;
				c.beginPath();
				c.moveTo(cx - r, h);
				c.lineTo(cx - r, h * 0.6);
				c.arc(cx, h * 0.6, r, Math.PI, 0);
				c.lineTo(cx + r, h);
				c.fill();
			});
			c.fillStyle = cc;
			c.beginPath();
			c.arc(w * 0.74, h * 0.32, h * 0.13, 0, Math.PI * 2);
			c.fill();
			c.fillStyle = d;
			c.beginPath();
			c.moveTo(w * 0.6, h);
			c.lineTo(w * 0.6, h * 0.72);
			c.arc(w * 0.76, h * 0.72, w * 0.16, Math.PI, 0);
			c.lineTo(w * 0.92, h);
			c.fill();
			break;
		case 'blobs':
			c.filter = `blur(${Math.round(h * 0.1)}px)`;
			(
				[
					[0.2, 0.3, 0.45, b],
					[0.55, 0.75, 0.5, cc],
					[0.85, 0.25, 0.42, d],
					[0.6, 0.1, 0.25, e],
				] as [number, number, number, string][]
			).forEach(([x, y, r, col]) => {
				c.fillStyle = col;
				c.beginPath();
				c.arc(w * x, h * y, h * r, 0, Math.PI * 2);
				c.fill();
			});
			c.filter = 'none';
			break;
		case 'geo':
			c.fillStyle = b;
			c.fillRect(0, h * 0.55, w * 0.42, h * 0.45);
			c.fillStyle = cc;
			c.beginPath();
			c.arc(w * 0.42, h * 0.55, h * 0.3, 0, Math.PI * 2);
			c.fill();
			c.fillStyle = d;
			c.fillRect(w * 0.58, 0, w * 0.18, h * 0.7);
			c.fillStyle = e;
			c.beginPath();
			c.moveTo(w * 0.76, h);
			c.lineTo(w, h * 0.45);
			c.lineTo(w, h);
			c.fill();
			break;
		case 'botanical':
			for (let i = 0; i < 34; i++) {
				const x = ((i * 0.618) % 1) * w;
				const y = h * (0.15 + ((i * 0.37) % 1) * 0.95);
				const rot = (((i * 47) % 120) - 60) * (Math.PI / 180);
				const s = h * (0.25 + ((i * 0.29) % 1) * 0.3);
				c.save();
				c.translate(x, y);
				c.rotate(rot);
				c.fillStyle = [b, cc, d, e][i % 4];
				c.beginPath();
				c.moveTo(0, 0);
				c.bezierCurveTo(s * 0.35, -s * 0.3, s * 0.35, -s * 0.75, 0, -s);
				c.bezierCurveTo(-s * 0.35, -s * 0.75, -s * 0.35, -s * 0.3, 0, 0);
				c.fill();
				c.restore();
			}
			break;
		case 'lines':
			c.lineWidth = Math.max(2, h * 0.004);
			for (let i = 0; i < 44; i++) {
				const y0 = h * (0.06 + i * 0.021);
				c.strokeStyle = i % 7 === 3 ? cc : b;
				c.beginPath();
				c.moveTo(0, y0);
				c.bezierCurveTo(w * 0.3, y0 - h * 0.18 * Math.sin(i * 0.2), w * 0.6, y0 + h * 0.2 * Math.cos(i * 0.15), w, y0 - h * 0.05);
				c.stroke();
			}
			break;
	}
	const tex = new THREE.CanvasTexture(canvas);
	tex.colorSpace = THREE.SRGBColorSpace;
	tex.anisotropy = 8;
	cache.set(key, tex);
	return tex;
};

/**
 * Alpha mask of what has been printed so far.
 * `columns` vertical swaths; `p` 0 → 1 over the whole wall. Within the
 * current swath the image grows from the bottom up to the head height.
 * Stateless (depends only on p) so frames can render in any order.
 */
export class PrintMask {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	texture: THREE.CanvasTexture;
	constructor(private columns: number) {
		this.canvas = document.createElement('canvas');
		this.canvas.width = 512;
		this.canvas.height = 256;
		this.ctx = this.canvas.getContext('2d')!;
		this.texture = new THREE.CanvasTexture(this.canvas);
	}
	/** head height (0 bottom → 1 top) for a progress p */
	static head(p: number, columns: number) {
		const [col, frac] = PrintMask.state(p, columns);
		return col % 2 === 0 ? frac : 1 - frac;
	}
	/** returns [column index, fraction within column] for a progress p */
	static state(p: number, columns: number) {
		const x = Math.max(0, Math.min(0.99999, p)) * columns;
		return [Math.floor(x), x - Math.floor(x)] as const;
	}
	update(p: number) {
		const {ctx, canvas, columns} = this;
		const [col, frac] = PrintMask.state(p, columns);
		const cw = canvas.width / columns;
		ctx.fillStyle = '#000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = '#fff';
		if (p >= 1) ctx.fillRect(0, 0, canvas.width, canvas.height);
		else {
			ctx.fillRect(0, 0, col * cw, canvas.height);
			// the head goes up one swath and down the next
			const hh = canvas.height * frac;
			if (col % 2 === 0) ctx.fillRect(col * cw, canvas.height - hh, cw + 0.5, hh);
			else ctx.fillRect(col * cw, 0, cw + 0.5, hh);
		}
		this.texture.needsUpdate = true;
		return this.texture;
	}
}
