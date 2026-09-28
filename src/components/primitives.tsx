import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT, HEIGHT, WIN_W, winX} from '../theme';

/** A single storefront window: 128 × 320, content clipped to its glass. */
export const Win: React.FC<{
	i: number;
	children: React.ReactNode;
	clip?: boolean;
	style?: React.CSSProperties;
}> = ({i, children, clip = true, style}) => (
	<div
		style={{
			position: 'absolute',
			left: winX(i),
			top: 0,
			width: WIN_W,
			height: HEIGHT,
			overflow: clip ? 'hidden' : 'visible',
			...style,
		}}
	>
		{children}
	</div>
);

/**
 * Mask reveal: content slides out of an invisible slot.
 * p = 0 hidden, 1 fully shown. dir = 1 rises from below, -1 drops from above.
 */
export const Reveal: React.FC<{
	p: number;
	dir?: 1 | -1;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({p, dir = 1, children, style}) => (
	<div style={{overflow: 'hidden', ...style}}>
		<div style={{transform: `translateY(${(1 - p) * 105 * dir}%)`}}>
			{children}
		</div>
	</div>
);

/** Small caption under an object, masked in and out. */
export const Label: React.FC<{
	text: string;
	p: number;
	accent: string;
	top?: number;
}> = ({text, p, accent, top = 262}) => (
	<div
		style={{
			position: 'absolute',
			top,
			left: 0,
			width: WIN_W,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			gap: 7,
		}}
	>
		<div
			style={{
				width: 18 * p,
				height: 2,
				background: accent,
			}}
		/>
		<Reveal p={p}>
			<div
				style={{
					fontFamily: FONT,
					fontWeight: 500,
					fontSize: 10.5,
					letterSpacing: '0.18em',
					color: C.white,
					whiteSpace: 'nowrap',
					paddingLeft: '0.18em',
				}}
			>
				{text}
			</div>
		</Reveal>
	</div>
);

export const Layer: React.FC<{children: React.ReactNode}> = ({children}) => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>{children}</AbsoluteFill>
);
