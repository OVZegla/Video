import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {Cam} from '../kit/Stage3D';
import {fontBase} from '../../symps/components/Typography';
import {C, ease, lerp, prog} from '../../symps/theme';

export type V3 = [number, number, number];

/**
 * Camera on a circle around `target`. angle 0 = on +z, positive turns towards +x.
 * `shift` slides the whole camera sideways (screen-left, metres) so the
 * subject sits right of centre (negative: left of centre).
 */
export const orbit = (target: V3, radius: number, angle: number, height: number, fov = 30, roll = 0, shift = 0): Cam => {
	const rx = Math.cos(angle);
	const rz = -Math.sin(angle);
	const t: V3 = [target[0] - rx * shift, target[1], target[2] - rz * shift];
	return {pos: [t[0] + Math.sin(angle) * radius, height, t[2] + Math.cos(angle) * radius], target: t, fov, roll};
};

export const mix = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/**
 * Whip-pan: the shot enters with a fast sideways swing that settles, and
 * leaves with one; the canvas is streaked while it moves. Returns the yaw
 * offset (radians) to add to the camera and the blur to apply.
 */
export const whip = (f: number, dur: number, enter = true, exit = true, len = 9) => {
	const i = enter ? 1 - prog(f, 0, len, ease.out) : 0;
	const o = exit ? prog(f, dur - len, dur, ease.in) : 0;
	const yaw = i * 0.55 - o * 0.55;
	const blur = (i + o) * 22;
	return {yaw, blur};
};

/** Horizontal motion streak (for whip pans), applied to a whole shot. */
export const Streak: React.FC<{blur: number; children: React.ReactNode}> = ({blur, children}) => (
	<AbsoluteFill style={{filter: blur > 0.3 ? `blur(${blur * 0.35}px)` : undefined, transform: blur > 0.3 ? `scaleX(${1 + blur * 0.004})` : undefined}}>{children}</AbsoluteFill>
);

/** Big kinetic title: letters rise in a cascade, sharpen and tighten. */
export const SlamTitle: React.FC<{
	text: string;
	at: number;
	out?: number;
	size?: number;
	weight?: number;
	color?: string;
	align?: 'left' | 'center';
	stagger?: number;
}> = ({text, at, out, size = 190, weight = 600, color = C.ink, align = 'left', stagger = 1.6}) => {
	const f = useCurrentFrame();
	const q = out === undefined ? 0 : prog(f, out, out + 12, ease.in);
	return (
		<div style={{display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start', overflow: 'hidden', paddingBottom: size * 0.12}}>
			{text.split('').map((ch, i) => {
				const p = prog(f, at + i * stagger, at + i * stagger + 18, ease.out);
				return (
					<span
						key={i}
						style={{
							...fontBase,
							display: 'inline-block',
							fontSize: size,
							fontWeight: weight,
							letterSpacing: '-0.04em',
							lineHeight: 1,
							color,
							whiteSpace: 'pre',
							transform: `translateY(${(1 - p) * 90 + q * -60}%) scale(${lerp(1.25, 1, p)})`,
							opacity: Math.min(p * 1.4, 1 - q),
							filter: `blur(${(1 - p) * 10 + q * 12}px)`,
						}}
					>
						{ch}
					</span>
				);
			})}
		</div>
	);
};

/** Small tracked caption (model reference, space name…). */
export const Caption: React.FC<{text: string; at: number; out?: number; color?: string; size?: number}> = ({text, at, out, color = C.mist, size = 22}) => {
	const f = useCurrentFrame();
	const p = prog(f, at, at + 16, ease.out);
	const q = out === undefined ? 0 : prog(f, out, out + 10, ease.in);
	return (
		<div
			style={{
				...fontBase,
				fontSize: size,
				fontWeight: 500,
				letterSpacing: `${lerp(0.8, 0.36, p)}em`,
				color,
				opacity: Math.min(p, 1 - q),
				whiteSpace: 'nowrap',
			}}
		>
			{text}
		</div>
	);
};

/** Quick exposure flash used on hard cuts. */
export const CutFlash: React.FC<{at: number; strength?: number}> = ({at, strength = 0.5}) => {
	const f = useCurrentFrame();
	const o = f < at ? 0 : Math.max(0, 1 - (f - at) / 6) * strength;
	return o > 0 ? <AbsoluteFill style={{background: '#FFFFFF', opacity: o, mixBlendMode: 'screen'}} /> : null;
};
