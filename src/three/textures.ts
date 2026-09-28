import {useEffect, useMemo, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {CanvasTexture, RepeatWrapping, SRGBColorSpace, Texture} from 'three';
import {fontsReady} from '../fonts';

/* Deterministic PRNG so every render of every frame paints identical textures. */
export const rng = (seed: number) => () => {
	seed = (seed * 1664525 + 1013904223) % 4294967296;
	return seed / 4294967296;
};

const makeCanvas = (w: number, h: number) => {
	const c = document.createElement('canvas');
	c.width = w;
	c.height = h;
	const ctx = c.getContext('2d')!;
	return {c, ctx};
};

export const toTexture = (c: HTMLCanvasElement, srgb = true) => {
	const t = new CanvasTexture(c);
	if (srgb) t.colorSpace = SRGBColorSpace;
	t.anisotropy = 8;
	t.needsUpdate = true;
	return t;
};

/* ---------------------------------------------------------------- images */

const cache = new Map<string, Promise<HTMLImageElement>>();
const loadImage = (src: string) => {
	if (!cache.has(src)) {
		cache.set(
			src,
			new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = () => resolve(img);
				img.onerror = reject;
				img.src = src;
			}),
		);
	}
	return cache.get(src)!;
};

/** Loads an image from /public and blocks the render until it is ready. */
export const useImage = (path: string) => {
	const [img, setImg] = useState<HTMLImageElement | null>(null);
	const [handle] = useState(() => delayRender(`image ${path}`));
	useEffect(() => {
		Promise.all([loadImage(staticFile(path)), fontsReady]).then(([i]) => {
			setImg(i);
			continueRender(handle);
		});
	}, [path, handle]);
	return img;
};

/** Build a texture once its source image is available (null until then). */
export const useCanvasTexture = (
	deps: unknown[],
	paint: () => HTMLCanvasElement | null,
	srgb = true,
): Texture | null =>
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useMemo(() => {
		const c = paint();
		return c ? toTexture(c, srgb) : null;
	}, deps);

/* ---------------------------------------------------------------- wood */

export const paintWood = (w: number, h: number, seed = 7, tone: 'oak' | 'birch' = 'oak') => {
	const {c, ctx} = makeCanvas(w, h);
	const r = rng(seed);
	const base = tone === 'oak' ? [176, 122, 72] : [222, 190, 146];
	ctx.fillStyle = `rgb(${base.join(',')})`;
	ctx.fillRect(0, 0, w, h);
	// growth rings: long, slightly wavy strokes
	for (let k = 0; k < 140; k++) {
		const y0 = r() * h;
		const amp = 2 + r() * 6;
		const freq = 0.004 + r() * 0.01;
		const phase = r() * 10;
		const dark = r() < 0.5;
		ctx.strokeStyle = dark
			? `rgba(90,52,24,${0.08 + r() * 0.22})`
			: `rgba(255,225,180,${0.05 + r() * 0.12})`;
		ctx.lineWidth = 0.6 + r() * 2.4;
		ctx.beginPath();
		for (let x = 0; x <= w; x += 6) {
			const y = y0 + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 3.1) * amp * 0.3;
			if (x === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}
		ctx.stroke();
	}
	// fine pores
	for (let k = 0; k < 2500; k++) {
		ctx.fillStyle = `rgba(70,40,18,${r() * 0.18})`;
		ctx.fillRect(r() * w, r() * h, 2 + r() * 8, 0.8);
	}
	return c;
};

/* ---------------------------------------------------------------- brushed metal */

export const paintBrushed = (w: number, h: number, seed = 3) => {
	const {c, ctx} = makeCanvas(w, h);
	const r = rng(seed);
	ctx.fillStyle = '#b9bcc0';
	ctx.fillRect(0, 0, w, h);
	for (let k = 0; k < 1600; k++) {
		const v = 150 + Math.floor(r() * 90);
		ctx.strokeStyle = `rgba(${v},${v},${v + 4},${0.25 + r() * 0.35})`;
		ctx.lineWidth = 0.5 + r();
		const y = r() * h;
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(w, y + (r() - 0.5) * 2);
		ctx.stroke();
	}
	return c;
};

/* ---------------------------------------------------------------- helpers */

export const makeRepeat = (t: Texture, x: number, y: number) => {
	t.wrapS = RepeatWrapping;
	t.wrapT = RepeatWrapping;
	t.repeat.set(x, y);
	return t;
};

export {makeCanvas};
