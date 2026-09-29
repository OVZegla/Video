import {useMemo} from 'react';
import {
	Color,
	ExtrudeGeometry,
	MeshPhysicalMaterial,
	Shape,
	Texture,
	Vector2,
} from 'three';
import {makeCanvas, paintBrushed, paintWood, rng, toTexture} from '../three/textures';

/* ================================================= procedural PBR maps */

/** Height map (canvas luminance) → tangent-space normal map. */
export const heightToNormal = (src: HTMLCanvasElement, strength = 2) => {
	const w = src.width;
	const h = src.height;
	const sd = src.getContext('2d')!.getImageData(0, 0, w, h).data;
	const {c, ctx} = makeCanvas(w, h);
	const out = ctx.createImageData(w, h);
	const L = (x: number, y: number) => {
		const i = (((y + h) % h) * w + ((x + w) % w)) * 4;
		return (sd[i] + sd[i + 1] + sd[i + 2]) / (3 * 255);
	};
	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			const dx = (L(x + 1, y) - L(x - 1, y)) * strength;
			const dy = (L(x, y + 1) - L(x, y - 1)) * strength;
			const inv = 1 / Math.hypot(dx, dy, 1);
			const i = (y * w + x) * 4;
			out.data[i] = (-dx * inv * 0.5 + 0.5) * 255;
			out.data[i + 1] = (dy * inv * 0.5 + 0.5) * 255;
			out.data[i + 2] = (inv * 0.5 + 0.5) * 255;
			out.data[i + 3] = 255;
		}
	}
	ctx.putImageData(out, 0, 0);
	return toTexture(c, false);
};

const noiseCanvas = (w: number, h: number, seed: number, base: string, specks: [string, number, number][]) => {
	const {c, ctx} = makeCanvas(w, h);
	ctx.fillStyle = base;
	ctx.fillRect(0, 0, w, h);
	const r = rng(seed);
	for (const [color, count, size] of specks) {
		ctx.fillStyle = color;
		for (let k = 0; k < count; k++) {
			const s = size * (0.4 + r());
			ctx.globalAlpha = 0.2 + r() * 0.5;
			ctx.beginPath();
			ctx.ellipse(r() * w, r() * h, s, s * (0.6 + r() * 0.8), r() * 3, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	ctx.globalAlpha = 1;
	return c;
};

export type MatKind = 'oak' | 'alu' | 'acrylic' | 'slate' | 'leather' | 'brass' | 'white';

export type MatSpec = {
	params: ConstructorParameters<typeof MeshPhysicalMaterial>[0];
	engrave: {color: string; roughness: number; emissive: [number, number, number]; glow: string};
};

/** Physically based presets with generated colour / normal / roughness maps. */
export const useMatSpec = (kind: MatKind): MatSpec =>
	useMemo(() => {
		switch (kind) {
			case 'oak': {
				const col = paintWood(512, 512, 81, 'oak');
				return {
					params: {map: toTexture(col), normalMap: heightToNormal(col, 3), normalScale: new Vector2(0.6, 0.6), roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.4},
					engrave: {color: '#2a1407', roughness: 0.95, emissive: [0, 0, 0], glow: '#ff7a2a'},
				};
			}
			case 'alu': {
				// black anodised, brushed: the laser exposes bright bare aluminium
				const b = paintBrushed(512, 512, 23);
				const {c, ctx} = makeCanvas(512, 512);
				ctx.drawImage(b, 0, 0);
				ctx.globalCompositeOperation = 'multiply';
				ctx.fillStyle = '#2a2d33';
				ctx.fillRect(0, 0, 512, 512);
				return {
					params: {map: toTexture(c), normalMap: heightToNormal(b, 1.2), normalScale: new Vector2(0.4, 0.4), metalness: 0.85, roughness: 0.38},
					engrave: {color: '#e8ecf2', roughness: 0.25, emissive: [0, 0, 0], glow: '#bfe0ff'},
				};
			}
			case 'acrylic': {
				const {c} = makeCanvas(8, 8);
				c.getContext('2d')!.fillStyle = '#ffffff';
				c.getContext('2d')!.fillRect(0, 0, 8, 8);
				return {
					params: {map: toTexture(c), transmission: 1, thickness: 0.14, ior: 1.49, roughness: 0.03, clearcoat: 1, attenuationColor: new Color('#cfe3ff'), attenuationDistance: 2},
					// engraving frosted and edge-lit: it glows through the bloom
					engrave: {color: '#ffffff', roughness: 0.8, emissive: [0.55, 0.75, 1.0], glow: '#ffffff'},
				};
			}
			case 'slate': {
				const col = noiseCanvas(512, 512, 91, '#34373c', [
					['#4a4e55', 900, 10],
					['#25282c', 600, 8],
					['#5d626a', 250, 3],
				]);
				return {
					params: {map: toTexture(col), normalMap: heightToNormal(col, 4), normalScale: new Vector2(0.8, 0.8), roughness: 0.82},
					engrave: {color: '#cfd3d8', roughness: 0.95, emissive: [0, 0, 0], glow: '#ffd2a0'},
				};
			}
			case 'leather': {
				const col = noiseCanvas(512, 512, 55, '#9a5a30', [
					['#7a4422', 3000, 5],
					['#b06a3c', 1500, 4],
				]);
				return {
					params: {map: toTexture(col), normalMap: heightToNormal(col, 5), normalScale: new Vector2(1, 1), roughness: 0.6, sheen: 0.4, sheenColor: new Color('#caa07a')},
					engrave: {color: '#1f0b03', roughness: 0.85, emissive: [0, 0, 0], glow: '#ff8a3a'},
				};
			}
			case 'brass': {
				const b = paintBrushed(512, 512, 44);
				const {c, ctx} = makeCanvas(512, 512);
				ctx.drawImage(b, 0, 0);
				ctx.globalCompositeOperation = 'multiply';
				ctx.fillStyle = '#e2b457';
				ctx.fillRect(0, 0, 512, 512);
				return {
					params: {map: toTexture(c), normalMap: heightToNormal(b, 1.2), normalScale: new Vector2(0.35, 0.35), metalness: 0.95, roughness: 0.3},
					engrave: {color: '#3b2a10', roughness: 0.7, emissive: [0, 0, 0], glow: '#ffcf7a'},
				};
			}
			default: {
				const col = noiseCanvas(256, 256, 5, '#d9d7cf', [['#cbc8bf', 400, 3]]);
				return {
					params: {map: toTexture(col), roughness: 0.55, clearcoat: 0.2, envMapIntensity: 0.6},
					engrave: {color: '#1d3fd6', roughness: 0.4, emissive: [0, 0, 0], glow: '#8fb4ff'},
				};
			}
		}
	}, [kind]);

/* ================================================= laser engraving shader */

export type EngraveUniforms = {
	uMask: {value: Texture | null};
	uProgress: {value: number};
	uEngraveColor: {value: Color};
	uEngraveRough: {value: number};
	uEngraveEmissive: {value: Color};
	uGlowColor: {value: Color};
	uGlow: {value: number};
	uUseMaskColor: {value: number};
};

/**
 * MeshPhysicalMaterial + a laser pass injected into three's shader chunks.
 * The mask (alpha = where to mark) is revealed raster-style from the top of
 * the UV space down to `uProgress`, with an incandescent line at the front.
 * Engraved texels take their own colour, roughness and optional emission
 * (edge-lit acrylic). With uUseMaskColor = 1 the mask's RGB is printed as is
 * (UV printing).
 */
export const makeEngraveMaterial = (spec: MatSpec) => {
	const m = new MeshPhysicalMaterial(spec.params);
	const u: EngraveUniforms = {
		uMask: {value: null},
		uProgress: {value: 0},
		uEngraveColor: {value: new Color(spec.engrave.color)},
		uEngraveRough: {value: spec.engrave.roughness},
		uEngraveEmissive: {value: new Color(...spec.engrave.emissive)},
		uGlowColor: {value: new Color(spec.engrave.glow)},
		uGlow: {value: 6},
		uUseMaskColor: {value: 0},
	};
	m.onBeforeCompile = (shader) => {
		Object.assign(shader.uniforms, u);
		shader.fragmentShader = shader.fragmentShader
			.replace(
				'#include <common>',
				`#include <common>
uniform sampler2D uMask;
uniform float uProgress;
uniform vec3 uEngraveColor;
uniform float uEngraveRough;
uniform vec3 uEngraveEmissive;
uniform vec3 uGlowColor;
uniform float uGlow;
uniform float uUseMaskColor;
float vuMark;
float vuHot;`,
			)
			.replace(
				'#include <map_fragment>',
				`#include <map_fragment>
{
	vec4 mk = texture2D(uMask, vMapUv);
	float row = 1.0 - vMapUv.y;               // 0 = top of the piece
	float done = step(row, uProgress);
	vuMark = mk.a * done;
	vuHot = mk.a * done * smoothstep(uProgress - 0.035, uProgress, row);
	vec3 ink = mix(uEngraveColor, mk.rgb, uUseMaskColor);
	diffuseColor.rgb = mix(diffuseColor.rgb, ink, vuMark);
}`,
			)
			.replace(
				'#include <roughnessmap_fragment>',
				`#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, uEngraveRough, vuMark);`,
			)
			.replace(
				'#include <emissivemap_fragment>',
				`#include <emissivemap_fragment>
totalEmissiveRadiance += uEngraveEmissive * vuMark + uGlowColor * vuHot * uGlow;`,
			);
	};
	m.customProgramCacheKey = () => 'vu-engrave';
	return {material: m, uniforms: u};
};

/* ================================================= geometry */

/** Extruded plate from a shape, UVs spanning its bounding box on both faces. */
export const plateGeometry = (shape: Shape, depth: number, bevel = 0.015) => {
	const g = new ExtrudeGeometry(shape, {depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 48});
	g.translate(0, 0, -depth / 2);
	g.computeBoundingBox();
	const bb = g.boundingBox!;
	const w = bb.max.x - bb.min.x;
	const h = bb.max.y - bb.min.y;
	const uv = g.attributes.uv;
	const pos = g.attributes.position;
	for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) - bb.min.x) / w, (pos.getY(i) - bb.min.y) / h);
	return g;
};

export const roundRectShape = (w: number, h: number, r: number) => {
	const s = new Shape();
	const x = -w / 2;
	const y = -h / 2;
	s.moveTo(x + r, y);
	s.lineTo(x + w - r, y);
	s.quadraticCurveTo(x + w, y, x + w, y + r);
	s.lineTo(x + w, y + h - r);
	s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	s.lineTo(x + r, y + h);
	s.quadraticCurveTo(x, y + h, x, y + h - r);
	s.lineTo(x, y + r);
	s.quadraticCurveTo(x, y, x + r, y);
	return s;
};

export const circleShape = (r: number) => {
	const s = new Shape();
	s.absarc(0, 0, r, 0, Math.PI * 2, false);
	return s;
};
