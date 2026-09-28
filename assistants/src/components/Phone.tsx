import React from 'react';
import {C, FONT_UI, ROLE_ORDER} from '../theme';
import {RoleTile} from './ui';

export const PHONE = {w: 432, h: 900, r: 52, bezel: 11};

/** Generic handset drawn from scratch (no manufacturer cues). */
export const Phone: React.FC<{
	x: number; // centre
	y: number;
	scale?: number;
	bezel?: number; // 0..1 how much of the bezel is built
	children: React.ReactNode;
}> = ({x, y, scale = 1, bezel = 1, children}) => {
	const b = PHONE.bezel * bezel;
	return (
		<div
			style={{
				position: 'absolute',
				left: x - PHONE.w / 2,
				top: y - PHONE.h / 2,
				width: PHONE.w,
				height: PHONE.h,
				transform: `scale(${scale})`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: -b,
					borderRadius: PHONE.r + b,
					background: '#08090B',
					boxShadow: `0 0 0 1px rgba(255,255,255,${0.12 * bezel}), 0 50px 120px -30px rgba(0,0,0,${0.7 * bezel}), 0 0 160px rgba(46,91,255,${0.12 * bezel})`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					borderRadius: PHONE.r,
					overflow: 'hidden',
					background: '#fff',
					fontFamily: FONT_UI,
					color: C.ink,
				}}
			>
				{children}
			</div>
		</div>
	);
};

export const StatusBar: React.FC<{opacity?: number}> = ({opacity = 1}) => (
	<div
		style={{
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			height: 50,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '6px 34px 0',
			fontSize: 16,
			fontWeight: 650,
			opacity,
		}}
	>
		<span style={{fontVariantNumeric: 'tabular-nums'}}>09:12</span>
		<div style={{display: 'flex', alignItems: 'flex-end', gap: 6}}>
			{[6, 9, 12, 15].map((h) => (
				<div key={h} style={{width: 3.5, height: h, borderRadius: 1.5, background: C.ink}} />
			))}
			<div
				style={{
					marginLeft: 6,
					width: 26,
					height: 13,
					borderRadius: 4,
					border: `1.6px solid ${C.ink}`,
					padding: 1.6,
					boxSizing: 'border-box',
				}}
			>
				<div style={{width: '72%', height: '100%', borderRadius: 1.5, background: C.ink}} />
			</div>
		</div>
	</div>
);

/** App header: the whole team, always one conversation away. */
export const TeamHeader: React.FC<{opacity?: number; subtitle: React.ReactNode}> = ({opacity = 1, subtitle}) => (
	<div
		style={{
			position: 'absolute',
			top: 50,
			left: 0,
			right: 0,
			height: 92,
			padding: '8px 24px 0',
			borderBottom: `1px solid ${C.line}`,
			opacity,
		}}
	>
		<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
			<div style={{fontSize: 24, fontWeight: 720, letterSpacing: '-0.02em'}}>Votre équipe</div>
			<div style={{display: 'flex'}}>
				{ROLE_ORDER.map((r, i) => (
					<div key={r} style={{marginLeft: i ? -7 : 0, borderRadius: 10, boxShadow: '0 0 0 2.5px #fff'}}>
						<RoleTile role={r} size={28} solid />
					</div>
				))}
			</div>
		</div>
		<div style={{marginTop: 6, fontSize: 14.5, color: C.ink3, fontWeight: 520}}>{subtitle}</div>
	</div>
);
