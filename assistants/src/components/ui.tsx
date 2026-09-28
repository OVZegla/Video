import React from 'react';
import {C, FONT_UI, ROLES, RoleId, SHADOW} from '../theme';
import {Icon} from './Icon';
import type {IconName} from '../theme';

// ————————————————————————————————————————————— Surfaces

export const Surface: React.FC<{
	style?: React.CSSProperties;
	dark?: boolean;
	lift?: boolean;
	radius?: number;
	children?: React.ReactNode;
}> = ({style, dark, lift, radius = 22, children}) => (
	<div
		style={{
			position: 'absolute',
			background: dark ? C.nightCard : C.card,
			borderRadius: radius,
			boxShadow: dark ? SHADOW.night : lift ? SHADOW.lift : SHADOW.card,
			outline: `1px solid ${dark ? C.nightLine : C.line}`,
			outlineOffset: -1,
			fontFamily: FONT_UI,
			color: dark ? C.snow : C.ink,
			overflow: 'hidden',
			...style,
		}}
	>
		{children}
	</div>
);

// ————————————————————————————————————————————— Role identity

/** Rounded tile carrying the assistant's pictogram. */
export const RoleTile: React.FC<{role: RoleId; size?: number; dark?: boolean; solid?: boolean}> = ({
	role,
	size = 44,
	dark,
	solid,
}) => {
	const r = ROLES[role];
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: size * 0.3,
				background: solid ? r.color : dark ? `${r.color}2E` : `${r.color}1A`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexShrink: 0,
			}}
		>
			<Icon name={r.icon} size={size * 0.56} color={solid ? '#fff' : r.color} stroke={1.9} />
		</div>
	);
};

/** Small "role" label: coloured dot + name. */
export const RoleTag: React.FC<{role: RoleId; size?: number; dark?: boolean; style?: React.CSSProperties}> = ({
	role,
	size = 15,
	dark,
	style,
}) => {
	const r = ROLES[role];
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: size * 0.5,
				fontFamily: FONT_UI,
				fontSize: size,
				fontWeight: 560,
				color: dark ? C.snow2 : C.ink2,
				whiteSpace: 'nowrap',
				...style,
			}}
		>
			<Icon name={r.icon} size={size * 1.25} color={r.color} stroke={2} />
			{r.label}
		</div>
	);
};

// ————————————————————————————————————————————— Status & actions

export type Tone = 'wait' | 'ok' | 'blue' | 'neutral' | 'dark';

export const Pill: React.FC<{
	tone?: Tone;
	icon?: IconName;
	size?: number;
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({tone = 'neutral', icon, size = 15, children, style}) => {
	const t = {
		wait: {bg: C.amberSoft, fg: '#9A6810', dot: C.amber},
		ok: {bg: 'rgba(46,91,255,0.10)', fg: C.blue, dot: C.blue},
		blue: {bg: C.blue, fg: '#fff', dot: '#fff'},
		neutral: {bg: 'rgba(21,23,28,0.06)', fg: C.ink2, dot: C.ink3},
		dark: {bg: 'rgba(255,255,255,0.08)', fg: C.snow2, dot: C.snow3},
	}[tone];
	return (
		<div
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				gap: size * 0.45,
				height: size * 2,
				padding: `0 ${size * 0.8}px 0 ${size * 0.7}px`,
				borderRadius: size,
				background: t.bg,
				color: t.fg,
				fontFamily: FONT_UI,
				fontSize: size,
				fontWeight: 600,
				whiteSpace: 'nowrap',
				...style,
			}}
		>
			{icon ? (
				<Icon name={icon} size={size * 1.15} color={t.fg} stroke={2.3} />
			) : (
				<div style={{width: size * 0.45, height: size * 0.45, borderRadius: 9, background: t.dot}} />
			)}
			{children}
		</div>
	);
};

export const Button: React.FC<{
	kind?: 'primary' | 'ghost';
	icon?: IconName;
	size?: number;
	press?: number; // 0..1 pressed amount
	children: React.ReactNode;
	style?: React.CSSProperties;
}> = ({kind = 'ghost', icon, size = 20, press = 0, children, style}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: size * 0.45,
			height: size * 2.6,
			padding: `0 ${size * 1.2}px`,
			borderRadius: size * 1.3,
			background: kind === 'primary' ? C.blue : '#fff',
			color: kind === 'primary' ? '#fff' : C.ink,
			boxShadow:
				kind === 'primary'
					? `0 1px 0 rgba(255,255,255,0.25) inset, 0 ${10 - press * 8}px ${22 - press * 14}px -8px rgba(46,91,255,${0.55 - press * 0.25})`
					: `0 0 0 1px ${C.line}, 0 2px 6px -2px rgba(21,23,28,0.08)`,
			fontFamily: FONT_UI,
			fontSize: size,
			fontWeight: 620,
			transform: `scale(${1 - press * 0.05})`,
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{icon ? <Icon name={icon} size={size * 1.1} stroke={2.1} /> : null}
		{children}
	</div>
);

// ————————————————————————————————————————————— Shared job marker

/** The graphic marker every document of the same job carries. */
export const JobTag: React.FC<{size?: number; label?: string; style?: React.CSSProperties; dark?: boolean}> = ({
	size = 15,
	label = 'Chantier Tilleuls',
	style,
	dark,
}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: size * 0.4,
			height: size * 1.9,
			padding: `0 ${size * 0.75}px 0 ${size * 0.5}px`,
			borderRadius: size * 0.5,
			background: dark ? 'rgba(91,127,255,0.18)' : C.blueSoft,
			color: dark ? C.blueHi : C.blue,
			fontFamily: FONT_UI,
			fontSize: size,
			fontWeight: 650,
			whiteSpace: 'nowrap',
			boxShadow: `inset 3px 0 0 ${C.blue}`,
			...style,
		}}
	>
		<Icon name="pin" size={size * 1.15} stroke={2.2} />
		{label}
	</div>
);

/** Kicker label above a headline or card title. */
export const Kicker: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties}> = ({
	children,
	color = C.ink3,
	size = 15,
	style,
}) => (
	<div
		style={{
			fontFamily: FONT_UI,
			fontSize: size,
			fontWeight: 620,
			letterSpacing: '0.08em',
			textTransform: 'uppercase',
			color,
			whiteSpace: 'nowrap',
			...style,
		}}
	>
		{children}
	</div>
);
