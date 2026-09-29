import React, {useMemo} from 'react';
import {AdditiveBlending, Color, MeshStandardMaterial, Path, ShaderMaterial, Texture} from 'three';
import {makeCanvas, paintWood, rng, toTexture, useImage} from '../three/textures';
import {drawEye} from '../three/paint';
import {C, FONT} from '../theme';
import {DISPLAY} from '../fonts';
import {circleShape, makeEngraveMaterial, MatKind, plateGeometry, roundRectShape, useMatSpec} from './materials';

/* ================================================= masks */

/** White-on-transparent artwork used as an engraving mask (alpha = mark). */
export const useLogoMask = (w: number, h: number) => {
	const logo = useImage('brand/vision-urbaine-logo-white.png');
	return useMemo(() => {
		if (!logo) return null;
		const {c, ctx} = makeCanvas(w, h);
		ctx.clearRect(0, 0, w, h);
		drawEye(ctx, w / 2, h * 0.36, w * 0.24, {ring: '#ffffff', pupil: '#ffffff', sector: 'rgba(255,255,255,0.55)'});
		const tmp = document.createElement('canvas');
		tmp.width = Math.round(w * 0.8);
		tmp.height = Math.round(tmp.width / (logo.width / logo.height));
		const t = tmp.getContext('2d')!;
		t.drawImage(logo, 0, 0, tmp.width, tmp.height);
		t.globalCompositeOperation = 'source-in';
		t.fillStyle = '#ffffff';
		t.fillRect(0, 0, tmp.width, tmp.height);
		ctx.drawImage(tmp, (w - tmp.width) / 2, h * 0.64);
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(w * 0.35, h * 0.83, w * 0.3, h * 0.012);
		return toTexture(c);
	}, [logo, w, h]);
};

/** A first name as engraving mask; `print` draws it in brand colours for UV printing. */
export const useNameMasks = (names: string[], w: number, h: number, print = false) =>
	useMemo(
		() =>
			names.map((name) => {
				const {c, ctx} = makeCanvas(w, h);
				ctx.clearRect(0, 0, w, h);
				const ink = print ? C.blue : '#ffffff';
				drawEye(ctx, w / 2, h * 0.3, w * 0.14, {ring: print ? C.brandNavy : '#fff', pupil: print ? C.blue : '#fff', sector: print ? C.red : 'rgba(255,255,255,0.6)'});
				ctx.fillStyle = ink;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				const long = name.length > 5;
				ctx.font = long ? `800 extra-condensed ${w * 0.2}px ${DISPLAY}` : `700 ${w * 0.26}px ${FONT}`;
				ctx.fillText(name, w / 2, h * 0.62);
				ctx.fillStyle = print ? C.red : '#ffffff';
				ctx.fillRect(w * 0.38, h * 0.76, w * 0.24, h * 0.018);
				return toTexture(c);
			}),
		[names, w, h, print],
	);

/* ================================================= engraved plate */

export type PlateShape = 'rect' | 'round' | 'tag';

/**
 * A plate of a real material, engraved by the laser shader. `progress` 0→1
 * runs the raster engraving top to bottom; `useMaskColor` prints the mask's
 * colours instead (UV printing).
 */
export const EngravePlate: React.FC<{
	kind: MatKind;
	shape?: PlateShape;
	w: number;
	h: number;
	depth?: number;
	mask: Texture | null;
	progress: number;
	useMaskColor?: boolean;
	position: [number, number, number];
	rotY?: number;
}> = ({kind, shape = 'rect', w, h, depth = 0.12, mask, progress, useMaskColor = false, position, rotY = 0}) => {
	const spec = useMatSpec(kind);
	const geom = useMemo(() => {
		if (shape === 'round') return plateGeometry(circleShape(w / 2), depth);
		const s = roundRectShape(w, h, shape === 'tag' ? w * 0.22 : 0.06);
		if (shape === 'tag') {
			const hole = new Path();
			for (let k = 0; k < 32; k++) {
				const a = (k / 32) * Math.PI * 2;
				const x = Math.cos(a) * w * 0.08;
				const y = h / 2 - w * 0.2 + Math.sin(a) * w * 0.08;
				if (k === 0) hole.moveTo(x, y);
				else hole.lineTo(x, y);
			}
			s.holes.push(hole);
		}
		return plateGeometry(s, depth);
	}, [shape, w, h, depth]);
	const {material, uniforms} = useMemo(() => makeEngraveMaterial(spec), [spec]);
	uniforms.uMask.value = mask;
	uniforms.uProgress.value = progress;
	uniforms.uUseMaskColor.value = useMaskColor ? 1 : 0;
	return <mesh geometry={geom} material={material} position={position} rotation={[0, rotY, 0]} />;
};

/* ================================================= the glowing burn line (intro) */

/** A line burnt across the storefront: white-hot at the laser head, cooling to red behind it. */
export const BurnLine: React.FC<{head: number; y: number; cool: number}> = ({head, y, cool}) => {
	const mat = useMemo(
		() =>
			new ShaderMaterial({
				transparent: true,
				blending: AdditiveBlending,
				depthWrite: false,
				uniforms: {uHead: {value: 0}, uCool: {value: 0}},
				vertexShader: `varying vec3 vW; varying vec2 vUv;
void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
				fragmentShader: `varying vec3 vW; varying vec2 vUv; uniform float uHead; uniform float uCool;
void main(){
	float behind = uHead - vW.x;
	if (behind < 0.0) discard;
	float core = 1.0 - abs(vUv.y - 0.5) * 2.0;
	core = pow(core, 1.5);
	vec3 white = vec3(1.4, 1.3, 1.1);
	vec3 orange = vec3(1.3, 0.45, 0.1);
	vec3 red = vec3(0.7, 0.08, 0.04);
	vec3 col = mix(white, orange, smoothstep(0.0, 1.2, behind));
	col = mix(col, red, smoothstep(1.5, 7.0, behind) * (0.4 + 0.6 * uCool));
	float a = core * (1.0 - 0.55 * uCool);
	gl_FragColor = vec4(col * a, a);
}`,
			}),
		[],
	);
	mat.uniforms.uHead.value = head;
	mat.uniforms.uCool.value = cool;
	return (
		<mesh position={[0, y, 0]} material={mat}>
			<planeGeometry args={[17, 0.09]} />
		</mesh>
	);
};

/* ================================================= giant laser-cut panel */

/** Bauhaus cut pattern spanning the whole storefront. White = cut. */
const useBigPattern = () =>
	useMemo(() => {
		const W = 2048;
		const H = 836;
		const {c, ctx} = makeCanvas(W, H);
		ctx.clearRect(0, 0, W, H);
		ctx.fillStyle = '#ffffff';
		const r = rng(404);
		const cell = 116;
		const cols = Math.floor((W - 60) / cell);
		const rows = Math.floor((H - 60) / cell);
		const ox = (W - cols * cell) / 2;
		const oy = (H - rows * cell) / 2;
		for (let j = 0; j < rows; j++) {
			for (let i = 0; i < cols; i++) {
				const x = ox + i * cell + 12;
				const y = oy + j * cell + 12;
				const s = cell - 24;
				const k = Math.floor(r() * 6);
				const rot = Math.floor(r() * 4);
				ctx.save();
				ctx.translate(x + s / 2, y + s / 2);
				ctx.rotate((rot * Math.PI) / 2);
				ctx.translate(-s / 2, -s / 2);
				ctx.beginPath();
				if (k === 0) ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
				else if (k === 1) {
					ctx.moveTo(0, 0);
					ctx.arc(0, 0, s, 0, Math.PI / 2);
				} else if (k === 2) ctx.arc(s / 2, s, s / 2, Math.PI, 0);
				else if (k === 3) {
					ctx.moveTo(0, 0);
					ctx.lineTo(s, 0);
					ctx.lineTo(0, s);
				} else if (k === 4) {
					for (let q = 0; q < 4; q++) ctx.rect(q * (s / 4) + 3, 0, s / 8, s);
				} else {
					ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
					ctx.arc(s / 2, s / 2, s / 4, 0, Math.PI * 2, true);
				}
				ctx.fill();
				ctx.restore();
			}
		}
		return toTexture(c, false);
	}, []);

/**
 * Plywood panel the size of the storefront. The laser sweeps left → right;
 * cut holes open behind it (discard), their edges charred, the kerf front
 * glowing. Nothing sits behind the panel: the holes show pure black, which on
 * the transparent LED screens reads as clear glass.
 */
export const CutPanel: React.FC<{progress: number}> = ({progress}) => {
	const mask = useBigPattern();
	const wood = useMemo(() => toTexture(paintWood(1024, 420, 17, 'birch')), []);
	const geom = useMemo(() => plateGeometry(roundRectShape(15.4, 6.3, 0.08), 0.1, 0.01), []);
	const {material, uniforms} = useMemo(() => {
		const u = {uMask: {value: mask as Texture}, uProgress: {value: 0}};
		const m = new MeshStandardMaterial({map: wood, roughness: 0.8, color: new Color('#d8cbb8')});
		m.onBeforeCompile = (shader) => {
			Object.assign(shader.uniforms, u);
			shader.fragmentShader = shader.fragmentShader
				.replace('#include <common>', `#include <common>\nuniform sampler2D uMask;\nuniform float uProgress;\nfloat vuHot;`)
				.replace(
					'#include <map_fragment>',
					`#include <map_fragment>
{
	float col = vMapUv.x;
	float mk = texture2D(uMask, vMapUv).a;
	if (mk > 0.5 && col < uProgress) discard;
	float o = 0.004;
	float nb = max(max(texture2D(uMask, vMapUv + vec2(o, 0.0)).a, texture2D(uMask, vMapUv - vec2(o, 0.0)).a),
	               max(texture2D(uMask, vMapUv + vec2(0.0, o * 2.4)).a, texture2D(uMask, vMapUv - vec2(0.0, o * 2.4)).a));
	float cut = step(col, uProgress);
	float charred = nb * (1.0 - step(0.5, mk)) * cut;
	diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.16, 0.08, 0.03), charred * 0.85);
	vuHot = mk * (1.0 - smoothstep(0.0, 0.01, abs(col - uProgress)));
}`,
				)
				.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(1.6, 0.6, 0.15) * vuHot * 4.0;`);
		};
		m.customProgramCacheKey = () => 'vu-cut';
		return {material: m, uniforms: u};
	}, [mask, wood]);
	uniforms.uProgress.value = progress;

	return (
		<>
			<mesh geometry={geom} material={material} />
		</>
	);
};

/** Soft coloured pools behind the plates so the dark stage has depth. */
export const Backdrop: React.FC<{tint?: string; z?: number}> = ({tint = '#0d2a8a', z = -2.5}) => {
	const tex = useMemo(() => {
		const {c, ctx} = makeCanvas(1024, 256);
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, 1024, 256);
		for (let i = 0; i < 5; i++) {
			const x = 1024 * ((i + 0.5) / 5);
			const g = ctx.createRadialGradient(x, 110, 5, x, 110, 150);
			g.addColorStop(0, tint);
			g.addColorStop(1, 'rgba(0,0,0,0)');
			ctx.fillStyle = g;
			ctx.fillRect(0, 0, 1024, 256);
		}
		return toTexture(c);
	}, [tint]);
	return (
		<mesh position={[0, 0, z]}>
			<planeGeometry args={[26, 13]} />
			<meshBasicMaterial map={tex} toneMapped={false} />
		</mesh>
	);
};
