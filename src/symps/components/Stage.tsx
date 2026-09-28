import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {HEIGHT, WIDTH} from '../theme';
import {MACHINE_ASPECT} from './Machine';

/** Fine film grain: breaks up gradient banding and gives the image a physical texture. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
	const frame = useCurrentFrame();
	const seed = Math.floor(random(`grain-${frame % 12}`) * 1000);
	return (
		<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity}}>
			<svg width={WIDTH} height={HEIGHT}>
				<filter id="symps-grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#symps-grain)" />
			</svg>
		</AbsoluteFill>
	);
};

/** Soft lens vignette. */
export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
	<AbsoluteFill
		style={{
			pointerEvents: 'none',
			background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
		}}
	/>
);

/**
 * A machine standing on the floor at (x, floorY), with an optional mirror
 * reflection (dark glossy floor) or contact shadow (bright floor).
 */
export const Placed: React.FC<{
	x: number;
	floorY: number;
	height: number;
	reflection?: number;
	shadow?: number;
	shadowColor?: string;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({x, floorY, height, reflection = 0, shadow = 0, shadowColor = '0,0,0', children, style}) => {
	const w = height * MACHINE_ASPECT;
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: floorY - height, width: w, height, ...style}}>
			{shadow > 0 && (
				<div
					style={{
						position: 'absolute',
						left: w * 0.05,
						width: w * 0.9,
						top: height - height * 0.03,
						height: height * 0.06,
						borderRadius: '50%',
						background: `radial-gradient(ellipse at center, rgba(${shadowColor},${0.55 * shadow}) 0%, rgba(${shadowColor},0) 70%)`,
						filter: 'blur(6px)',
					}}
				/>
			)}
			{reflection > 0 && (
				<div
					style={{
						position: 'absolute',
						left: 0,
						top: height,
						width: w,
						height,
						transform: 'scaleY(-1)',
						transformOrigin: 'center center',
						opacity: reflection,
						filter: 'blur(1.5px)',
						WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 18%, rgba(0,0,0,0) 38%)',
						maskImage: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 18%, rgba(0,0,0,0) 38%)',
					}}
				>
					<div style={{position: 'absolute', inset: 0}}>{children}</div>
				</div>
			)}
			<div style={{position: 'absolute', inset: 0}}>{children}</div>
		</div>
	);
};

/** Background: wall gradient + floor plane with a soft horizon. */
export const Backdrop: React.FC<{
	sky: [string, string];
	floor: string;
	horizon: number;
	/** soft glow on the wall behind the subject */
	glow?: {x: number; y: number; color: string; size: number; opacity: number};
}> = ({sky, floor, horizon, glow}) => (
	<AbsoluteFill>
		<AbsoluteFill style={{background: `linear-gradient(180deg, ${sky[0]} 0%, ${sky[1]} ${horizon * 100}%)`}} />
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: horizon * HEIGHT,
				bottom: 0,
				background: `linear-gradient(180deg, ${floor} 0%, ${sky[1]} 100%)`,
			}}
		/>
		{glow && (
			<div
				style={{
					position: 'absolute',
					left: glow.x - glow.size / 2,
					top: glow.y - glow.size / 2,
					width: glow.size,
					height: glow.size,
					borderRadius: '50%',
					background: `radial-gradient(circle, ${glow.color} 0%, rgba(0,0,0,0) 65%)`,
					opacity: glow.opacity,
				}}
			/>
		)}
	</AbsoluteFill>
);

/** Black overlay with a soft transparent window: the light "reveals" what is under it. */
export const LightPool: React.FC<{x: number; y: number; rx: number; ry: number; darkness?: number}> = ({x, y, rx, ry, darkness = 1}) => (
	<AbsoluteFill
		style={{
			pointerEvents: 'none',
			background: `radial-gradient(ellipse ${rx}px ${ry}px at ${x}px ${y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,${0.55 * darkness}) 55%, rgba(0,0,0,${darkness}) 100%)`,
		}}
	/>
);

/** Directional light sweep: everything "behind" the light edge stays in darkness. p: 0 dark → 1 fully lit. */
export const SideLight: React.FC<{p: number; from: 'left' | 'right'; softness?: number; floor?: number}> = ({p, from, softness = 0.45, floor = 0}) => {
	const edge = -softness + p * (1 + softness * 2);
	const a = Math.max(0, Math.min(1, 1 - floor));
	const dir = from === 'left' ? '90deg' : '270deg';
	return (
		<AbsoluteFill
			style={{
				pointerEvents: 'none',
				background: `linear-gradient(${dir}, rgba(0,0,0,0) ${(edge - softness) * 100}%, rgba(0,0,0,${a}) ${edge * 100}%)`,
			}}
		/>
	);
};
