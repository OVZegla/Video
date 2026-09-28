import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {Product} from '../data/products';
import {HEIGHT, WIDTH, ease, lerp, prog} from '../theme';
import {Machine} from './Machine';
import {Placed} from './Stage';

export type StudioItem = {
	product: Product;
	x: number;
	floorY: number;
	/** height of the tallest machine at this depth; each machine scales by its own height */
	base: number;
	/** first frame of its light-up */
	at: number;
	/** depth of field blur, px */
	blur?: number;
	/** 0 = front, 1 = far: atmospheric haze */
	depth?: number;
};

/**
 * A large dark studio: back wall, glossy floor, pools of light. Machines
 * light up one by one and are sorted back → front so depth reads correctly.
 */
export const Studio: React.FC<{
	items: StudioItem[];
	horizon: number;
	camera: {scale: number; x: number; y: number; originX?: number; originY?: number};
	head?: number;
}> = ({items, horizon, camera, head = 0.35}) => {
	const f = useCurrentFrame();
	const sorted = [...items].sort((a, b) => a.floorY - b.floorY);
	return (
		<AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
			<AbsoluteFill
				style={{
					transformOrigin: `${camera.originX ?? WIDTH / 2}px ${camera.originY ?? HEIGHT * 0.62}px`,
					transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
				}}
			>
				{/* back wall + floor */}
				<div
					style={{
						position: 'absolute',
						left: -WIDTH,
						width: WIDTH * 3,
						top: -HEIGHT,
						height: HEIGHT + horizon,
						background: 'linear-gradient(180deg, #000 0%, #000 55%, #08090B 88%, #0E0F12 100%)',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						left: -WIDTH,
						width: WIDTH * 3,
						top: horizon,
						height: HEIGHT * 2,
						background: 'linear-gradient(180deg, #0B0C0E 0%, #050506 30%, #000 70%)',
					}}
				/>
				{/* back-wall wash */}
				<div
					style={{
						position: 'absolute',
						left: WIDTH / 2 - 1100,
						width: 2200,
						top: horizon - 700,
						height: 900,
						background: 'radial-gradient(ellipse at 50% 85%, rgba(120,150,200,0.10) 0%, rgba(0,0,0,0) 60%)',
					}}
				/>
				{sorted.map((it) => {
					const on = prog(f, it.at, it.at + 40, ease.inOut);
					const h = it.base * it.product.look.height;
					const haze = it.depth ?? 0;
					return (
						<React.Fragment key={it.product.id}>
							{/* pool of light on the floor */}
							<div
								style={{
									position: 'absolute',
									left: it.x - h * 0.6,
									width: h * 1.2,
									top: it.floorY - h * 0.1,
									height: h * 0.2,
									borderRadius: '50%',
									background: 'radial-gradient(ellipse at center, rgba(200,215,240,0.16) 0%, rgba(200,215,240,0) 70%)',
									opacity: on,
								}}
							/>
							<Placed
								x={it.x}
								floorY={it.floorY}
								height={h}
								reflection={0.3}
								style={{
									opacity: lerp(0, 1, prog(f, it.at, it.at + 18, ease.inOut)),
									filter: `brightness(${lerp(0.05, 1 - haze * 0.35, on)})${it.blur ? ` blur(${it.blur}px)` : ''}`,
								}}
							>
								<Machine product={it.product} height={h} head={head} uv={0.6 * on} rim={0.25 * on} />
							</Placed>
						</React.Fragment>
					);
				})}
			</AbsoluteFill>
			{/* light falloff towards the top of frame */}
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 32%, rgba(0,0,0,0) 50%)'}} />
		</AbsoluteFill>
	);
};
