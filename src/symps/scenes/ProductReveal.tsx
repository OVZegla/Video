import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {Product} from '../data/products';
import {Machine} from '../components/Machine';
import {ProductTitle} from '../components/ProductTitle';
import {Backdrop, Placed, SideLight} from '../components/Stage';
import {PRODUCT_FLOOR_Y, productHeight, productX} from '../layout';
import {HEIGHT, WIDTH, ease, lerp, prog} from '../theme';

/**
 * One machine, one light, one line of text.
 *
 * Every product shares the same staging (floor line, scale, text column,
 * camera grammar) so the range reads as one ecosystem; the light changes.
 */
export const ProductReveal: React.FC<{product: Product; duration: number; hero?: boolean}> = ({product, duration, hero}) => {
	const f = useCurrentFrame();
	const {env} = product;
	const mood = env.mood;

	const X = productX(product);
	const floorY = PRODUCT_FLOOR_Y;
	const h = productHeight(product);
	const sign = product.side === 'right' ? 1 : -1;

	// ——— camera: slow drift that settles well before the end (the shot "breathes") ———
	const settle = duration * (hero ? 0.72 : 0.78);
	const cam = prog(f, 0, settle, ease.camera);
	const pan = (1 - cam) * (hero ? 170 : 90) * sign;
	const push = lerp(1, hero ? 1.05 : 1.035, prog(f, 0, duration, ease.camera));

	// industrial: start close on the top of the frame and pull back to reveal scale
	const tilt = mood === 'industrial' ? prog(f, 0, duration * 0.7, ease.camera) : 1;
	const indScale = mood === 'industrial' ? lerp(1.55, 1, tilt) : 1;
	const indY = mood === 'industrial' ? lerp(h * 0.55, 0, tilt) : 0;

	// ——— printing carriage slowly travels up the mast ———
	const head = lerp(0.18, 0.46, prog(f, 0, duration, ease.inOut));
	const uv = env.bright ? 0.35 : 0.8 * prog(f, 20, 60, ease.inOut);

	// ——— lighting per mood ———
	let lightOverlay: React.ReactNode = null;
	let machineFilter = 'none';
	let rim = 0;
	let reflection = env.bright ? 0 : 0.32;
	let shadow = env.bright ? 1 : 0.6;
	let extraBack: React.ReactNode = null;
	let extraFront: React.ReactNode = null;

	const rev = prog(f, 2, hero ? 96 : 46, ease.inOut);

	switch (mood) {
		case 'darkSide': {
			lightOverlay = (
				<>
					<SideLight p={rev} from={product.side} softness={0.5} />
					<AbsoluteFill
						style={{
							background: `linear-gradient(${product.side === 'right' ? 270 : 90}deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)`,
						}}
					/>
				</>
			);
			rim = 0.25 * rev;
			break;
		}
		case 'studioWhite': {
			const on = prog(f, 0, 26, ease.inOut);
			lightOverlay = <AbsoluteFill style={{background: '#0A0A0B', opacity: 0.85 * (1 - on)}} />;
			extraBack = (
				<div
					style={{
						position: 'absolute',
						left: X - 700,
						top: floorY - 820,
						width: 1400,
						height: 1100,
						background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 60%)',
					}}
				/>
			);
			break;
		}
		case 'graphite': {
			const col = prog(f, 0, 44, ease.out);
			extraBack = (
				<div
					style={{
						position: 'absolute',
						left: X - 290,
						width: 580,
						top: 0,
						height: floorY,
						transformOrigin: 'center bottom',
						transform: `scaleY(${col})`,
						background:
							'linear-gradient(90deg, rgba(190,200,215,0) 0%, rgba(190,200,215,0.10) 30%, rgba(210,220,235,0.16) 50%, rgba(190,200,215,0.10) 70%, rgba(190,200,215,0) 100%)',
					}}
				/>
			);
			lightOverlay = <SideLight p={rev} from={product.side === 'right' ? 'right' : 'left'} softness={0.4} />;
			// a metallic highlight crossing the machine
			const s = prog(f, 26, 86, ease.inOut);
			extraFront = (
				<AbsoluteFill
					style={{
						mixBlendMode: 'overlay',
						background: `linear-gradient(105deg, rgba(255,255,255,0) ${s * 140 - 30}%, rgba(255,255,255,0.55) ${s * 140 - 18}%, rgba(255,255,255,0) ${s * 140 - 6}%)`,
					}}
				/>
			);
			rim = 0.35 * rev;
			reflection = 0.36;
			break;
		}
		case 'edge': {
			rim = prog(f, 0, 36, ease.out);
			const body = prog(f, 22, 96, ease.inOut);
			machineFilter = `brightness(${lerp(0.08, 1, body)})`;
			reflection = 0.55 * prog(f, 0, 34, ease.inOut);
			break;
		}
		case 'highKey': {
			const emerge = prog(f, 0, 50, ease.inOut);
			lightOverlay = <AbsoluteFill style={{background: '#FFFFFF', opacity: 0.9 * (1 - emerge)}} />;
			shadow = 0.8 * emerge;
			break;
		}
		case 'industrial': {
			extraBack = (
				<>
					{[-1, 1].map((s) => (
						<div
							key={s}
							style={{
								position: 'absolute',
								left: X + s * 250 - 300,
								top: 0,
								width: 600,
								height: floorY,
								clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)',
								background: 'linear-gradient(180deg, rgba(200,215,240,0.14) 0%, rgba(200,215,240,0.02) 100%)',
								opacity: prog(f, 6 + (s + 1) * 6, 40 + (s + 1) * 6, ease.inOut),
							}}
						/>
					))}
				</>
			);
			lightOverlay = <SideLight p={prog(f, 0, 50, ease.inOut)} from="left" softness={0.6} />;
			rim = 0.3;
			reflection = 0.3;
			break;
		}
		case 'clean': {
			const up = prog(f, 0, 34, ease.inOut);
			lightOverlay = <AbsoluteFill style={{background: '#000', opacity: 1 - up}} />;
			extraBack = (
				<div
					style={{
						position: 'absolute',
						left: X - 420,
						top: floorY - 70,
						width: 840,
						height: 140,
						borderRadius: '50%',
						background: 'radial-gradient(ellipse at center, rgba(230,238,250,0.16) 0%, rgba(230,238,250,0) 70%)',
					}}
				/>
			);
			reflection = 0.22;
			break;
		}
		case 'ruby': {
			extraBack = (
				<div
					style={{
						position: 'absolute',
						left: X - 700,
						top: floorY - 900,
						width: 1400,
						height: 1200,
						background: 'radial-gradient(ellipse at center, rgba(142,20,40,0.42) 0%, rgba(142,20,40,0.12) 35%, rgba(0,0,0,0) 62%)',
						opacity: prog(f, 0, 50, ease.inOut),
					}}
				/>
			);
			lightOverlay = <SideLight p={rev} from="right" softness={0.5} />;
			rim = 0.5 * rev;
			reflection = 0.38;
			break;
		}
	}

	const machine = (
		<Machine product={product} height={h} head={head} uv={uv} rim={rim} style={{filter: machineFilter}} />
	);

	const textLeft = product.side === 'right' ? WIDTH * 0.115 : WIDTH * 0.565;
	const titleAt = hero ? 78 : 26;

	return (
		<AbsoluteFill style={{background: env.sky[1], overflow: 'hidden'}}>
			{/* background layer, moves less than the machine: parallax */}
			<AbsoluteFill style={{transform: `translateX(${pan * 0.35}px) scale(${1 + (push - 1) * 0.4})`}}>
				<Backdrop sky={env.sky} floor={env.floor} horizon={floorY / HEIGHT} />
				{extraBack}
			</AbsoluteFill>

			{/* machine layer */}
			<AbsoluteFill
				style={{
					transformOrigin: `${X}px ${floorY - h * 0.5}px`,
					transform: `translateX(${pan}px) translateY(${indY}px) scale(${push * indScale})`,
				}}
			>
				<Placed x={X} floorY={floorY} height={h} reflection={reflection} shadow={shadow}>
					{machine}
				</Placed>
			</AbsoluteFill>

			{extraFront}
			{lightOverlay}

			<ProductTitle product={product} at={titleAt} left={textLeft} top={hero ? 380 : 400} size={hero ? 132 : 120} />
		</AbsoluteFill>
	);
};
